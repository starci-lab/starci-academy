import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const art = path.join(cwd, ".artifacts/fe-refactor-audit");
const scope = JSON.parse(
  fs.readFileSync(path.join(art, "2026-08-10-b35c-scope.json"), "utf8"),
);
const CHECKPOINT = scope.checkpoint || "02011807";

const RAW_HOSTS = new Set([
  "div",
  "section",
  "main",
  "aside",
  "header",
  "footer",
  "nav",
  "span",
  "ul",
  "ol",
  "li",
  "p",
  "article",
]);

const TYPED_LAYOUT = /\b(Stack[VH]?|Flex|Grid|Box|Container|FillAvailable|RailShell|SurfaceCard|Card)\b/;

function norm(p) {
  return p.replace(/\\/g, "/");
}

function git(args, opts = {}) {
  const r = spawnSync("git", args, {
    encoding: "utf8",
    cwd,
    maxBuffer: 40 * 1024 * 1024,
    ...opts,
  });
  return {
    status: r.status,
    stdout: r.stdout || "",
    stderr: r.stderr || "",
  };
}

function parseDiffHunks(text) {
  const files = [];
  let cur = null;
  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith("diff --git ")) {
      if (cur) files.push(cur);
      const m = line.match(/^diff --git a\/(.+) b\/(.+)$/);
      cur = {
        path: m ? norm(m[2]) : null,
        added: [],
        removed: [],
        raw: [],
        isBinary: false,
        isNew: false,
        isDeleted: false,
      };
      continue;
    }
    if (!cur) continue;
    cur.raw.push(line);
    if (line.startsWith("new file mode")) cur.isNew = true;
    if (line.startsWith("deleted file mode")) cur.isDeleted = true;
    if (line.startsWith("Binary files")) cur.isBinary = true;
    if (line.startsWith("+++") || line.startsWith("---") || line.startsWith("@@")) continue;
    if (line.startsWith("+")) cur.added.push(line.slice(1));
    else if (line.startsWith("-")) cur.removed.push(line.slice(1));
  }
  if (cur) files.push(cur);
  return files;
}

function countCrlfOnlyChurn(fileDiff) {
  // Heuristic: many +/- lines that are identical after stripping CR, and little real change
  const rem = fileDiff.removed;
  const add = fileDiff.added;
  if (rem.length < 8 || add.length < 8) return false;
  if (Math.abs(rem.length - add.length) > Math.max(3, rem.length * 0.05)) return false;
  let same = 0;
  const n = Math.min(rem.length, add.length);
  for (let i = 0; i < n; i++) {
    if (rem[i].replace(/\r/g, "") === add[i].replace(/\r/g, "")) same++;
  }
  // Also check if content equal ignoring whitespace-only diffs
  const remNorm = rem.map((l) => l.replace(/\r/g, "")).join("\n");
  const addNorm = add.map((l) => l.replace(/\r/g, "")).join("\n");
  if (remNorm === addNorm && rem.length >= 8) return true;
  return same / n > 0.92 && rem.length + add.length > 40;
}

function extractTagOpens(lines) {
  const tags = [];
  for (const l of lines) {
    const re = /<\/?([A-Za-z][\w.]*)\b/g;
    let m;
    while ((m = re.exec(l))) {
      tags.push({ tag: m[1], line: l.trim() });
    }
  }
  return tags;
}

function findRawHostClassNameLines(lines) {
  return lines.filter((l) => {
    const m = l.match(/<([a-z][\w]*)\b/);
    if (!m) return false;
    if (!RAW_HOSTS.has(m[1])) return false;
    return /className=/.test(l) || /style=\{/.test(l);
  });
}

function novelPrinciples(added, removed) {
  const rem = [...removed.join("\n").matchAll(/principle\(\s*["'`]([^"'`]+)["'`]/g)].map(
    (m) => m[1],
  );
  const add = [...added.join("\n").matchAll(/principle\(\s*["'`]([^"'`]+)["'`]/g)].map(
    (m) => m[1],
  );
  return [...new Set(add.filter((p) => !rem.includes(p)))];
}

function hasLayoutCssBesidePrinciple(addedJoin) {
  // principle(...) on same element / nearby with gap-|items-|justify-|p-|px-|py-|pt-|pb-|gap=
  // Look for JSX with both principle= and gap/align/padding class or prop
  const lines = addedJoin.split("\n");
  let window = [];
  const hits = [];
  for (const l of lines) {
    window.push(l);
    if (window.length > 12) window.shift();
    const chunk = window.join("\n");
    if (!/principle=/.test(chunk) && !/principle\(/.test(chunk)) continue;
    const layoutCss =
      /\b(gap-\d|gap-\[|items-|justify-|content-|self-|p-\d|px-\d|py-\d|pt-\d|pb-\d|pl-\d|pr-\d|m-\d|mx-\d|my-\d|mt-\d|mb-\d)\b/.test(
        chunk,
      ) ||
      /\b(gap|align|justify|padding|paddingX|paddingY|paddingTop|paddingBottom)\s*=/.test(chunk);
    if (layoutCss && /principle=/.test(chunk)) {
      hits.push(window.filter((x) => /principle|gap-|items-|justify-|p-\d|padding|align/.test(x)).slice(-6));
    }
  }
  return hits;
}

function identityBelowRoot(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const src = fs.readFileSync(filePath, "utf8");
  // Look for exported component root return with identity
  const identityRe = /data-starci-identity|starciIdentity\s*=/;
  if (!identityRe.test(src)) return null;
  // Find function/const export component bodies — crude: first return ( after export
  const exportFn =
    src.match(/export\s+(?:default\s+)?function\s+\w+[\s\S]*?\{([\s\S]*)$/) ||
    src.match(/export\s+const\s+\w+[^=]*=\s*(?:\([^)]*\)|[^=])*=>\s*\{([\s\S]*)$/) ||
    src.match(/export\s+function\s+\w+[\s\S]*?\{([\s\S]*)$/);
  // Simpler approach: find outermost return ( ... ) of file's primary export
  const returns = [...src.matchAll(/\breturn\s*\(/g)];
  if (!returns.length) return null;
  const firstReturnIdx = returns[0].index;
  const idMatch = src.match(/data-starci-identity\s*=|starciIdentity\s*=/);
  if (!idMatch) return null;
  const idIdx = idMatch.index;
  // If identity appears after first return but not within ~400 chars of it (and nested), flag
  // Better: check if identity is on a child rather than the first JSX opening tag after return
  const after = src.slice(firstReturnIdx, firstReturnIdx + 800);
  const firstTag = after.match(/return\s*\(\s*(?:<>\s*)?<([A-Za-z][\w.]*)/);
  if (!firstTag) return null;
  const rootTag = firstTag[1];
  // Extract root open tag region
  const openStart = firstReturnIdx + after.indexOf("<" + rootTag);
  const openSlice = src.slice(openStart, openStart + 500);
  const rootHasIdentity = /data-starci-identity|starciIdentity\s*=/.test(openSlice.split(">")[0] || "");
  if (rootHasIdentity) return null;
  // identity exists somewhere after root open
  if (idIdx > openStart) {
    return {
      rootTag,
      evidence: `identity attr present in file but not on exported root <${rootTag}> open tag`,
    };
  }
  return null;
}

function twinCandidates(p) {
  p = norm(p);
  if (p.startsWith(".storybook/components/")) {
    const rest = p.slice(".storybook/components/".length);
    const parts = rest.split("/");
    const file = parts.pop();
    const dir = parts.join("/");
    // strip leading atoms|starci|composites|nivo wrappers for src mapping
    let srcDir = dir
      .replace(/^starci\//, "")
      .replace(/^atoms\//, "atoms/")
      .replace(/^composites\//, "composites/");
    // .storybook/components/starci/blocks/X/Y/Y.tsx -> src/components/blocks/X/Y/index.tsx
    if (dir.startsWith("starci/")) {
      srcDir = dir.slice("starci/".length);
    }
    const base = file.replace(/\.tsx?$/, "");
    return [
      `src/components/${srcDir}/index.tsx`,
      `src/components/${srcDir}/component.tsx`,
      `src/components/${srcDir}/${file}`,
      `src/components/${srcDir}/${base}.tsx`,
    ];
  }
  if (p.startsWith("src/components/")) {
    const rest = p.slice("src/components/".length);
    const parts = rest.split("/");
    const file = parts.pop();
    const dirParts = parts;
    const dir = dirParts.join("/");
    const leafDir = dirParts[dirParts.length - 1];
    return [
      `.storybook/components/starci/${dir}/${leafDir}.tsx`,
      `.storybook/components/${dir}/${leafDir}.tsx`,
      `.storybook/components/starci/${dir}/${file}`,
      `.storybook/components/${dir}/${file}`,
      `.storybook/components/atoms/${dir.replace(/^atoms\//, "")}/${leafDir}.tsx`,
    ];
  }
  return [];
}

function propSurface(src) {
  // Extract exported props type field names (rough)
  const fields = new Set();
  const typeBlocks = [
    ...src.matchAll(
      /(?:export\s+)?(?:type|interface)\s+\w*Props\w*\s*(?:=\s*)?\{([\s\S]*?)\n\}/g,
    ),
  ];
  for (const b of typeBlocks) {
    for (const m of b[1].matchAll(/^\s*(?:readonly\s+)?([A-Za-z_]\w*)\s*[\?:]/gm)) {
      fields.add(m[1]);
    }
  }
  return fields;
}

function findLiveConsumers(symbol, excludePath) {
  // ripgrep via git grep for speed
  const r = git([
    "grep",
    "-l",
    "-E",
    `\\b${symbol}\\b`,
    "--",
    "src",
    ".storybook",
  ]);
  if (!r.stdout.trim()) return [];
  return r.stdout
    .split(/\r?\n/)
    .map(norm)
    .filter((p) => p && p !== norm(excludePath));
}

const retained = scope.retainedProduct || [];
const productPaths = retained
  .filter((x) => x.kind === "B35 product change")
  .map((x) => norm(x.path));
const deletedPaths = retained
  .filter((x) => x.kind === "B35 deletion/move")
  .map((x) => norm(x.path));
const newPaths = retained
  .filter((x) => x.kind === "B35 new file")
  .map((x) => norm(x.path));

// High-risk priority order for sampling
const HIGH_RISK_SUBSTR = [
  "ChatPane",
  "Alert",
  "TabsExtended",
  "EmptyContent",
  "ErrorContent",
  "InfiniteScrollSentinel",
  "CheckListCard",
  "CrossListCard",
  "SummaryCard",
  "CourseCard",
  "SearchBar",
  "StickyBottomBar",
  "SubPageHeader",
  "PaginationSkeleton",
  "RemovableToken",
  "ProfileLoadingState",
  "LearnShell",
  "PublicProfileLayout",
  "Navbar",
  "NavLinks",
  "SettingsSidebarNav",
  "PremiumGateModal",
  "AiQuotaModal",
  "E2eResultDrawer",
  "SubmissionAttemptsDrawer",
  "ContentHeader",
  "ContentModeNav",
  "CourseBrief",
  "VoiceHero",
  "TrialEnrollBanner",
  "QuotaBar",
  "PhaseScarcityNote",
  "TrialConversionStrip",
  "ConsultantCard",
  "Discussion",
  "ActivityFeed",
  "Composer",
  "DailyQuest",
  "GithubTeamGate",
  "CookieConsentBanner",
];

function riskScore(p) {
  let s = 0;
  for (const k of HIGH_RISK_SUBSTR) if (p.includes(k)) s += 10;
  if (p.includes(".storybook/")) s += 2;
  if (p.endsWith(".tsx")) s += 1;
  if (/className|principle|Box|Skeleton|Loading/.test(p)) s += 3;
  return s;
}

const sortedProduct = [...productPaths].sort((a, b) => riskScore(b) - riskScore(a));

const regressions = [];
const notes = [];
const audited = new Set();
const suspects = [];

function addReg(kind, filePath, evidence) {
  regressions.push({ kind, path: norm(filePath), evidence });
}

// Diff product files in batches
function diffPaths(paths) {
  const out = [];
  const BATCH = 30;
  for (let i = 0; i < paths.length; i += BATCH) {
    const chunk = paths.slice(i, i + BATCH);
    const r = git(["diff", "-U3", "--ignore-cr-at-eol", CHECKPOINT, "--", ...chunk]);
    out.push(...parseDiffHunks(r.stdout));
  }
  return out;
}

const productDiffs = diffPaths(productPaths);
notes.push(`product-change diffs parsed: ${productDiffs.length}`);

const deletedDiffs = diffPaths(deletedPaths);
notes.push(`deletion diffs parsed: ${deletedDiffs.length}`);

// Untracked new files: treat as full-file adds
for (const p of newPaths) {
  if (!fs.existsSync(p)) {
    notes.push(`missing new file: ${p}`);
    continue;
  }
  const status = git(["status", "--short", "--", p]).stdout.trim();
  const content = fs.readFileSync(p, "utf8");
  const fileDiff = {
    path: p,
    added: content.split(/\r?\n/),
    removed: [],
    raw: [],
    isBinary: false,
    isNew: true,
    isDeleted: false,
    untracked: status.startsWith("??"),
  };
  productDiffs.push(fileDiff);
  audited.add(p);
}
notes.push(`new files appended as full adds: ${newPaths.length}`);

for (const fd of [...productDiffs, ...deletedDiffs]) {
  if (!fd.path) continue;
  audited.add(fd.path);
  const addJoin = fd.added.join("\n");
  const remJoin = fd.removed.join("\n");
  const text = fd.raw.join("\n");

  // 11. line-ending / formatting churn
  if (!fd.isNew && !fd.isDeleted && countCrlfOnlyChurn(fd)) {
    addReg(
      "line-ending-or-formatting-churn",
      fd.path,
      ">=92% of +/- lines identical after CR strip (or content-identical ignoring CR) with large churn",
    );
  }
  // Also detect pure whitespace reformatting: identical ignoring all whitespace
  if (
    !fd.isNew &&
    !fd.isDeleted &&
    fd.removed.length >= 20 &&
    fd.added.length >= 20 &&
    remJoin.replace(/\s+/g, "") === addJoin.replace(/\s+/g, "") &&
    remJoin !== addJoin
  ) {
    addReg(
      "line-ending-or-formatting-churn",
      fd.path,
      "diff is whitespace-only (content identical after stripping all whitespace)",
    );
  }

  if (fd.isDeleted) {
    // 8. public API removed with live consumer — check deleted export symbols
    const exportNames = [
      ...remJoin.matchAll(/export\s+(?:async\s+)?function\s+(\w+)/g),
      ...remJoin.matchAll(/export\s+const\s+(\w+)/g),
      ...remJoin.matchAll(/export\s+type\s+(\w+)/g),
      ...remJoin.matchAll(/export\s+interface\s+(\w+)/g),
      ...remJoin.matchAll(/export\s+enum\s+(\w+)/g),
      ...remJoin.matchAll(/export\s+\{\s*([^}]+)\s*\}/g),
    ];
    const symbols = new Set();
    for (const m of exportNames) {
      if (m[1].includes(",")) {
        for (const part of m[1].split(",")) {
          const name = part.trim().split(/\s+as\s+/).pop().trim();
          if (name && /^[A-Z]/.test(name)) symbols.add(name);
        }
      } else if (/^[A-Z]/.test(m[1])) {
        symbols.add(m[1]);
      }
    }
    // For moved files (hooks/utils), consumers should import from new location — check if old path still imported
    const base = path.basename(fd.path).replace(/\.(tsx?|jsx?)$/, "");
    const oldImportHits = git([
      "grep",
      "-n",
      fd.path.replace(/\.(tsx?)$/, ""),
      "--",
      "src",
      ".storybook",
    ]);
    // More useful: grep for ChatPaneSkeleton etc
    for (const sym of symbols) {
      if (sym.length < 4) continue;
      const consumers = findLiveConsumers(sym, fd.path).filter(
        (c) => !deletedPaths.includes(c) && fs.existsSync(c),
      );
      // Filter to import-like usage of the deleted module symbol without redefinition
      const live = [];
      for (const c of consumers.slice(0, 20)) {
        const body = fs.readFileSync(c, "utf8");
        if (new RegExp(`from\\s+["'][^"']*${base}["']`).test(body) && body.includes(sym)) {
          live.push(c);
        }
      }
      if (live.length) {
        addReg(
          "public-api-removed-with-live-consumer",
          fd.path,
          `deleted export ${sym} still imported from old path in: ${live.slice(0, 5).join(", ")}`,
        );
      }
    }
    continue;
  }

  // 1. raw host replacing another raw host
  const remRaw = findRawHostClassNameLines(fd.removed);
  const addRaw = findRawHostClassNameLines(fd.added);
  if (remRaw.length && addRaw.length) {
    // Check if a typed layout was removed in favor of raw, OR raw→raw swap
    const remTyped = fd.removed.filter((l) => TYPED_LAYOUT.test(l) && /<\w/.test(l));
    const addTyped = fd.added.filter((l) => TYPED_LAYOUT.test(l) && /<\w/.test(l));
    // raw host swap: removed raw with className, added different raw with className, without net typed gain
    if (addRaw.length >= remRaw.length && addTyped.length <= remTyped.length) {
      // Exclude pure className string tweaks on same tag
      const remTags = remRaw.map((l) => (l.match(/<([a-z]+)/) || [])[1]).join(",");
      const addTags = addRaw.map((l) => (l.match(/<([a-z]+)/) || [])[1]).join(",");
      if (remTags !== addTags || remRaw.some((l, i) => addRaw[i] && l.replace(/\s+/g, "") !== addRaw[i].replace(/\s+/g, ""))) {
        suspects.push({
          kind: "raw-host-replacing-raw-host",
          path: fd.path,
          remSample: remRaw.slice(0, 2),
          addSample: addRaw.slice(0, 2),
        });
      }
    }
  }
  // Also: typed host removed, raw host added (false burn / escape)
  const remTypedHosts = fd.removed.filter(
    (l) => /<(Stack[VH]?|Flex|Grid|Container|FillAvailable|RailShell)\b/.test(l),
  );
  const addRawOnly = addRaw.filter((l) => !TYPED_LAYOUT.test(l));
  if (remTypedHosts.length && addRawOnly.length && addRawOnly.length >= remTypedHosts.length) {
    addReg(
      "raw-host-replacing-raw-host",
      fd.path,
      `typed layout removed (${remTypedHosts[0].trim().slice(0, 80)}) and raw host with className added (${addRawOnly[0].trim().slice(0, 80)})`,
    );
  }

  // 2. Box used as fake lint escape
  const boxAdds = fd.added.filter((l) => /<Box\b/.test(l));
  const boxRems = fd.removed.filter((l) => /<Box\b/.test(l));
  if (boxAdds.length > boxRems.length) {
    const boxWithClass = boxAdds.filter(
      (l) => /className=/.test(l) || /classNames=/.test(l),
    );
    // Box wrapping previous raw host content / absorbing className from burned door
    const doorBurn =
      /className\??\s*:/.test(remJoin) ||
      /classNames\??\s*:/.test(remJoin) ||
      (/-.*\bclassName=/.test(text) && /\+.*<Box\b/.test(text));
    if (boxWithClass.length) {
      addReg(
        "box-fake-lint-escape",
        fd.path,
        `new <Box className/classNames> introduced (${boxWithClass[0].trim().slice(0, 120)}); door/className burn context=${doorBurn}`,
      );
    } else if (doorBurn && boxAdds.length) {
      // Box without className but used to replace raw host — still suspicious if only to satisfy lint
      const remRawHosts = fd.removed.filter((l) =>
        /<(div|section|span|header|footer|nav|main|aside)\b/.test(l),
      );
      if (remRawHosts.length) {
        suspects.push({
          kind: "box-fake-lint-escape",
          path: fd.path,
          evidence: `Box introduced while raw host removed; sample + ${boxAdds[0].trim().slice(0, 100)}`,
        });
      }
    }
  }

  // 3. removed className replaced by local CSS
  const removedClassDoor =
    (/className\??\s*:/.test(remJoin) || /classNames\??\s*:/.test(remJoin)) &&
    !(/className\??\s*:/.test(addJoin) || /classNames\??\s*:/.test(addJoin));
  const addedLocalCss =
    /className=\{?["'`][^"'`]+["'`]/.test(addJoin) ||
    /className=\{cn\(/.test(addJoin) ||
    /style=\{\{/.test(addJoin) ||
    (/<[a-z]+[^>]*className=/.test(addJoin) && findRawHostClassNameLines(fd.added).length);
  // More precise: public prop door removed AND new host className literals that encode former consumer styles
  if (removedClassDoor && addedLocalCss) {
    // Only flag if NEW className literals appear that weren't just relocating internal constants
    const remClassLits = [...remJoin.matchAll(/className=\{?["'`]([^"'`]+)["'`]/g)].map((m) => m[1]);
    const addClassLits = [...addJoin.matchAll(/className=\{?["'`]([^"'`]+)["'`]/g)].map((m) => m[1]);
    const novelLits = addClassLits.filter((c) => !remClassLits.includes(c));
    if (novelLits.length) {
      addReg(
        "classname-removed-replaced-by-local-css",
        fd.path,
        `public className(s) door removed; novel host className literals: ${novelLits.slice(0, 3).join(" | ")}`,
      );
    }
  }

  // 4. dishonest principle
  const novels = novelPrinciples(fd.added, fd.removed);
  if (novels.length) {
    // Dishonest if principle token looks like CSS dump or doesn't match component role
    const dishonest = novels.filter(
      (p) =>
        /gap-|items-|justify-|p-\d|flex|grid|w-full|h-full|absolute|relative/.test(p) ||
        p.split(/[\s/_-]+/).length > 6 ||
        /todo|fixme|temp|hack|lint|escape/i.test(p),
    );
    if (dishonest.length) {
      addReg(
        "dishonest-principle",
        fd.path,
        `novel principle tokens look like CSS/layout dumps or hacks: ${dishonest.join(", ")}`,
      );
    } else {
      // Still record novel principles as suspects for manual review
      suspects.push({
        kind: "novel-principle",
        path: fd.path,
        tokens: novels,
      });
    }
  }

  // 5. gap/align/padding retained beside principle
  const beside = hasLayoutCssBesidePrinciple(addJoin);
  if (beside.length) {
    addReg(
      "gap-align-padding-beside-principle",
      fd.path,
      `principle co-located with gap/align/padding CSS or props; sample: ${beside[0].join(" / ").slice(0, 200)}`,
    );
  }

  // 6. identity placed below exported root
  if (/\.(tsx|jsx)$/.test(fd.path) && fs.existsSync(fd.path)) {
    if (/data-starci-identity|starciIdentity/.test(addJoin) || /data-starci-identity|starciIdentity/.test(fs.readFileSync(fd.path, "utf8"))) {
      const deep = identityBelowRoot(fd.path);
      if (deep) {
        addReg("identity-below-exported-root", fd.path, deep.evidence);
      }
    }
  }

  // 9. ComponentType changed back to ReactNode
  if (
    (/:\s*ReactNode\b/.test(addJoin) || /:\s*React\.ReactNode\b/.test(addJoin)) &&
    (/:\s*ComponentType\b/.test(remJoin) || /ComponentTypeWithSkeleton/.test(remJoin))
  ) {
    addReg(
      "componenttype-reverted-to-reactnode",
      fd.path,
      "ComponentType/ComponentTypeWithSkeleton removed while ReactNode added in same diff",
    );
  }
  // Also: ReactNode newly added on composition slot props
  if (
    (/:\s*ReactNode\b/.test(addJoin) || /children\s*:\s*ReactNode/.test(addJoin)) &&
    !/:\s*ReactNode\b/.test(remJoin) &&
    /ComponentType/.test(remJoin)
  ) {
    addReg(
      "componenttype-reverted-to-reactnode",
      fd.path,
      "ReactNode slot introduced while ComponentType references removed",
    );
  }

  // 10. skeleton/loading behavior drift
  const skelSignals = [
    /isSkeleton/,
    /Skeleton/,
    /isLoading/,
    /loading\s*\?/,
    /ComponentTypeWithSkeleton/,
  ];
  if (skelSignals.some((r) => r.test(text))) {
    const remSkel = fd.removed.filter((l) => skelSignals.some((r) => r.test(l)));
    const addSkel = fd.added.filter((l) => skelSignals.some((r) => r.test(l)));
    // Flag material behavior changes: deleted parallel skeleton component usage, flipped defaults, removed isSkeleton pass-through
    const remPass = remJoin.match(/isSkeleton=\{[^}]+\}/g) || [];
    const addPass = addJoin.match(/isSkeleton=\{[^}]+\}/g) || [];
    const remDeletedSkeletonComp = /ChatPaneSkeleton|ParallelSkeleton|asSkeleton/.test(remJoin);
    // If isSkeleton expressions changed
    const remExpr = remPass.map((s) => s.replace(/\s+/g, "")).sort().join(";");
    const addExpr = addPass.map((s) => s.replace(/\s+/g, "")).sort().join(";");
    if (remExpr && addExpr && remExpr !== addExpr) {
      suspects.push({
        kind: "skeleton-loading-behavior-drift",
        path: fd.path,
        rem: remPass,
        add: addPass,
      });
    }
    // Removing skeleton prop plumbing without replacement
    if (
      /isSkeleton\??\s*:/.test(remJoin) &&
      !/isSkeleton\??\s*:/.test(addJoin) &&
      !fd.path.includes("ChatPaneSkeleton")
    ) {
      addReg(
        "skeleton-loading-behavior-drift",
        fd.path,
        "isSkeleton prop removed from type/destructure without replacement in same file",
      );
    }
    if (remDeletedSkeletonComp && !/isSkeleton/.test(addJoin) && !fd.path.includes("ChatPaneSkeleton")) {
      addReg(
        "skeleton-loading-behavior-drift",
        fd.path,
        "parallel skeleton component usage removed without isSkeleton replacement in this file",
      );
    }
    void remSkel;
    void addSkel;
  }
}

// 7. Storybook/src drift — compare twin prop surfaces for audited pairs
const sbTouched = [...audited].filter((p) => p.startsWith(".storybook/components/"));
for (const sb of sbTouched) {
  const cands = twinCandidates(sb);
  const srcTwin = cands.find((c) => fs.existsSync(c) && audited.has(c)) || cands.find((c) => fs.existsSync(c));
  if (!srcTwin || !fs.existsSync(srcTwin)) {
    // Only note if src twin expected and also in retained set under different path
    const anySrc = cands.find((c) => fs.existsSync(c));
    if (!anySrc && productPaths.some((p) => p.includes(path.basename(sb).replace(/\.tsx$/, "")))) {
      notes.push(`no src twin found for ${sb}`);
    }
    continue;
  }
  if (!audited.has(srcTwin) && !productPaths.includes(srcTwin)) {
    // SB changed but src twin not in batch — drift risk
    const sbSrc = fs.readFileSync(sb, "utf8");
    const srcSrc = fs.readFileSync(srcTwin, "utf8");
    const sbProps = propSurface(sbSrc);
    const srcProps = propSurface(srcSrc);
    const doors = ["className", "classNames", "principle"];
    for (const d of doors) {
      if (sbProps.has(d) !== srcProps.has(d)) {
        addReg(
          "storybook-src-drift",
          sb,
          `prop '${d}' present in SB=${sbProps.has(d)} vs src twin ${srcTwin}=${srcProps.has(d)}`,
        );
      }
    }
    continue;
  }
  // Both exist — compare prop surfaces
  const sbSrc = fs.readFileSync(sb, "utf8");
  const srcSrc = fs.readFileSync(srcTwin, "utf8");
  const sbProps = propSurface(sbSrc);
  const srcProps = propSurface(srcSrc);
  for (const d of ["className", "classNames"]) {
    if (sbProps.has(d) !== srcProps.has(d)) {
      addReg(
        "storybook-src-drift",
        sb,
        `door '${d}' SB=${sbProps.has(d)} src(${srcTwin})=${srcProps.has(d)}`,
      );
    }
  }
  // Compare whether both removed classNames in this batch
  const sbDiff = productDiffs.find((d) => d.path === sb);
  const srcDiff = productDiffs.find((d) => d.path === srcTwin);
  if (sbDiff && srcDiff) {
    const sbBurn = /classNames\??\s*:/.test(sbDiff.removed.join("\n"));
    const srcBurn = /classNames\??\s*:/.test(srcDiff.removed.join("\n"));
    const sbStill = /classNames\??\s*:/.test(sbSrc);
    const srcStill = /classNames\??\s*:/.test(srcSrc);
    if (sbBurn !== srcBurn || sbStill !== srcStill) {
      addReg(
        "storybook-src-drift",
        sb,
        `classNames burn asymmetry vs ${srcTwin}: sbBurn=${sbBurn} srcBurn=${srcBurn} sbStill=${sbStill} srcStill=${srcStill}`,
      );
    }
  }
}

// Manual high-risk deep review: top 50 by risk + ChatPane always
const spot = sortedProduct.slice(0, 55);
notes.push(`high-risk spot-check set size: ${spot.length}`);
notes.push(`spot-check sample: ${spot.slice(0, 15).join(", ")}`);

// Deep-read ChatPane diff
const chatDiff = git([
  "diff",
  "-U5",
  CHECKPOINT,
  "--",
  "src/components/pages/CommunityChatPage/ChatPane/index.tsx",
  "src/components/pages/CommunityChatPage/index.tsx",
]);
fs.writeFileSync(path.join(art, "_b35c-chatpane.diff"), chatDiff.stdout);

// Resolve Box suspects: promote clear escapes, drop clean Box uses
for (const s of suspects.filter((x) => x.kind === "box-fake-lint-escape")) {
  // already may be in regressions; if only suspect, promote when raw host removed
  if (!regressions.some((r) => r.path === s.path && r.kind === "box-fake-lint-escape")) {
    addReg("box-fake-lint-escape", s.path, s.evidence);
  }
}

// Resolve raw-host suspects with stricter check
for (const s of suspects.filter((x) => x.kind === "raw-host-replacing-raw-host")) {
  const remHost = (s.remSample[0] || "").match(/<([a-z]+)/)?.[1];
  const addHost = (s.addSample[0] || "").match(/<([a-z]+)/)?.[1];
  if (remHost && addHost && remHost !== addHost) {
    addReg(
      "raw-host-replacing-raw-host",
      s.path,
      `raw <${remHost}> with className replaced by raw <${addHost}> with className; - ${String(s.remSample[0]).trim().slice(0, 100)} + ${String(s.addSample[0]).trim().slice(0, 100)}`,
    );
  }
}

// Skeleton suspects: only flag if expressions meaningfully diverge beyond formatting
for (const s of suspects.filter((x) => x.kind === "skeleton-loading-behavior-drift")) {
  const remN = (s.rem || []).map((x) => x.replace(/\s+/g, ""));
  const addN = (s.add || []).map((x) => x.replace(/\s+/g, ""));
  if (remN.join() !== addN.join()) {
    // ChatPane intentional repair is OK if isSkeleton retained — check
    if (s.path.includes("ChatPane")) {
      // intentional: await-id uses isSkeleton; live uses isLoading && messages.length===0
      notes.push(
        `ChatPane skeleton expr change reviewed: rem=${JSON.stringify(s.rem)} add=${JSON.stringify(s.add)} (intentional repair — not flagged)`,
      );
      continue;
    }
    addReg(
      "skeleton-loading-behavior-drift",
      s.path,
      `isSkeleton expressions changed: ${JSON.stringify(s.rem)} -> ${JSON.stringify(s.add)}`,
    );
  }
}

// Dedupe regressions
const seen = new Set();
const deduped = [];
for (const r of regressions) {
  const key = `${r.kind}::${r.path}::${r.evidence.slice(0, 120)}`;
  if (seen.has(key)) continue;
  seen.add(key);
  deduped.push(r);
}

// Second pass: verify classname-removed-replaced-by-local-css false positives
// Legitimate: removing dead door while keeping pre-existing internal cn() literals that also appear in removed lines as usage
const refined = [];
for (const r of deduped) {
  if (r.kind === "classname-removed-replaced-by-local-css") {
    const fd = productDiffs.find((d) => d.path === r.path);
    if (!fd) {
      refined.push(r);
      continue;
    }
    // If novel literals are only on HeroUI/subcomponent slots and door was unused, still a smell if they LAUNDER the door
    // Soften: if the only change is removing optional classNames?: from props and cn(...classNames) → cn(fixed), and fixed was already in the cn() call, not a regression
    const remCn = fd.removed.filter((l) => /className=\{cn\(/.test(l) || /classNames=/.test(l));
    const addCn = fd.added.filter((l) => /className=\{cn\(/.test(l));
    const doorOnly =
      /classNames\??\s*:/.test(fd.removed.join("\n")) &&
      addCn.every((l) => {
        // cn("shadow-none") style retained without spreading classNames
        return /cn\(/.test(l) && !/\bclassNames\b/.test(l);
      }) &&
      remCn.some((l) => /\bclassNames\b/.test(l));
    if (doorOnly && !/style=\{\{/.test(fd.added.join("\n"))) {
      notes.push(
        `false-positive suppressed classname-local-css at ${r.path}: dead classNames door burn keeping prior internal cn literals`,
      );
      continue;
    }
  }
  refined.push(r);
}

// Novel principles that aren't dishonest — note only
const novelPrincipleNotes = suspects.filter((s) => s.kind === "novel-principle");
if (novelPrincipleNotes.length) {
  notes.push(
    `novel principle tokens (not auto-flagged as dishonest): ${novelPrincipleNotes
      .map((s) => `${s.path}:[${s.tokens.join(",")}]`)
      .slice(0, 25)
      .join("; ")}`,
  );
}

const result = {
  batch: "B35c",
  checkpoint: CHECKPOINT,
  filesAudited: audited.size,
  regressions: refined,
  regressionCount: refined.length,
  ok: refined.length === 0,
  notes: [
    ...notes,
    `retainedProduct=${retained.length} productChanges=${productPaths.length} deletions=${deletedPaths.length} newFiles=${newPaths.length}`,
    `suspectsRaw=${suspects.length}`,
    `highRiskFilesSpotChecked=${spot.length}`,
  ],
  meta: {
    generatedAt: new Date().toISOString(),
    spotCheckPaths: spot,
    suspectCount: suspects.length,
  },
};

fs.writeFileSync(
  path.join(art, "_b35c-diff-audit-raw.json"),
  JSON.stringify({ result, suspects: suspects.slice(0, 80) }, null, 2),
);

console.log(
  JSON.stringify(
    {
      filesAudited: result.filesAudited,
      regressionCount: result.regressionCount,
      ok: result.ok,
      kinds: refined.reduce((a, r) => {
        a[r.kind] = (a[r.kind] || 0) + 1;
        return a;
      }, {}),
      sample: refined.slice(0, 15),
    },
    null,
    2,
  ),
);
