/**
 * B33 Phase 0 — StarCi-only inventory + 10 disjoint manifests.
 * Does not edit product code. Does not touch CLAUDE.md / decision-ledger.json.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit");
const CHECKPOINT = "139391b6";

const FORBIDDEN_RE =
  /(?:^|\/)(?:\.storybook\/(?:components|stories)\/(?:nivo|nivoexpert|mia-mia)\/|src\/components\/(?:nivo|nivoexpert)\/|src\/(?:resources|modules\/api)\/)/i;

const LOCKED_RE = [
  /\/BlockAnatomy\b/i,
  /\/MockInterviewSession\b/,
  /\/QuizSession\b/,
  /\/LearnLoopScroll\b/,
  /\/ContentAiChat\b/,
  /\/ArchitectureScene\b/,
];

const norm = (p) => String(p || "").replace(/\\/g, "/");
const rel = (abs) => {
  const n = norm(abs);
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"), n.indexOf("/plugins/"));
  if (i >= 0) return n.slice(i + 1);
  return n;
};

function isForbidden(file) {
  const f = norm(file);
  if (FORBIDDEN_RE.test(f)) return true;
  if (LOCKED_RE.some((re) => re.test(f))) return true;
  return false;
}

function isStarCiEditable(file) {
  const f = norm(file);
  if (isForbidden(f)) return false;
  if (f.startsWith("src/components/")) return true;
  if (f.startsWith(".storybook/components/starci/")) return true;
  // shared atoms/frames/composites only when required by StarCi consumer chain — assigned later
  if (f.startsWith(".storybook/components/atoms/")) return "shared-candidate";
  if (f.startsWith(".storybook/components/frames/")) return "shared-candidate";
  if (f.startsWith(".storybook/components/composites/")) return "shared-candidate";
  if (f.startsWith("plugins/eslint/") && f.endsWith(".test.mjs")) return "oracle";
  return false;
}

function pathFamily(file) {
  const f = norm(file);
  if (f.startsWith("src/components/atoms/")) return "src-atoms";
  if (f.startsWith("src/components/frames/")) return "src-frames";
  if (f.startsWith("src/components/composites/")) return "src-composites";
  if (f.startsWith("src/components/blocks/")) return "src-blocks";
  if (f.startsWith("src/components/pages/")) return "src-pages";
  if (f.startsWith("src/components/layouts/")) return "src-layouts";
  if (f.startsWith("src/components/overlays/")) return "src-overlays";
  if (f.startsWith(".storybook/components/starci/")) return "sb-starci";
  if (f.startsWith(".storybook/components/atoms/")) return "sb-atoms";
  if (f.startsWith(".storybook/components/frames/")) return "sb-frames";
  if (f.startsWith(".storybook/components/composites/")) return "sb-composites";
  return "other";
}

console.log("Running ESLint inventory…");
const proc = spawnSync(
  "npx",
  ["eslint", "--format", "json", "--no-error-on-unmatched-pattern", "src", ".storybook"],
  { cwd: ROOT, encoding: "buffer", maxBuffer: 256 * 1024 * 1024, shell: true },
);
const out = proc.stdout.toString("utf8");
const start = out.indexOf("[");
if (start < 0) {
  fs.writeFileSync(path.join(ART, "_b33-eslint-fail.txt"), out + "\n" + (proc.stderr?.toString() || ""));
  throw new Error("ESLint JSON parse failed");
}
const results = JSON.parse(out.slice(start));

const messages = [];
for (const file of results) {
  const fileRel = rel(file.filePath);
  for (const msg of file.messages || []) {
    messages.push({
      file: fileRel,
      rule: msg.ruleId || "unknown",
      severity: msg.severity,
      line: msg.line,
      column: msg.column,
      message: msg.message,
      family: pathFamily(fileRel),
      forbidden: isForbidden(fileRel),
      a11y: String(msg.ruleId || "").startsWith("jsx-a11y/"),
    });
  }
}

const byRule = {};
const byFamily = {};
const byFile = {};
for (const m of messages) {
  byRule[m.rule] = (byRule[m.rule] || 0) + 1;
  byFamily[m.family] = (byFamily[m.family] || 0) + 1;
  byFile[m.file] = (byFile[m.file] || 0) + 1;
}

const b32c = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-10-b32c-clusters.json"), "utf8"));
const partials = b32c.partialSample || [];

// Resolve partial cluster owners → files
function resolvePartialFiles(clusterId) {
  // id like src-or-sb:blocks/learn/Foo::Foo::…
  const m = clusterId.match(/^src-or-sb:(.+?)::/);
  if (!m) return [];
  const rest = m[1]; // blocks/learn/Foo or composites/cards/SurfaceCard
  const candidates = [];
  if (rest.startsWith("blocks/") || rest.startsWith("composites/") || rest.startsWith("frames/") || rest.startsWith("atoms/") || rest.startsWith("layouts/") || rest.startsWith("overlays/") || rest.startsWith("pages/")) {
    candidates.push(`.storybook/components/starci/${rest}`);
    // also try without starci prefix for composites/frames/atoms
    if (!rest.startsWith("blocks/")) {
      candidates.push(`.storybook/components/${rest}`);
    } else {
      // starci blocks live under starci/blocks
      candidates.push(`.storybook/components/starci/${rest}`);
      candidates.push(`src/components/${rest}`);
    }
    candidates.push(`src/components/${rest}`);
  }
  const files = [];
  const seen = new Set();
  const tryPaths = (base) => {
    const variants = [
      `${base}.tsx`,
      `${base}/index.tsx`,
      `${base}/${base.split("/").pop()}.tsx`,
    ];
    // nested like CourseQaQuestionList/SkeletonQuestionRow
    for (const v of variants) {
      if (fs.existsSync(path.join(ROOT, v)) && !seen.has(v)) {
        seen.add(v);
        files.push(norm(v));
      }
    }
  };
  // Better resolution from known patterns
  const parts = rest.split("/");
  const leaf = parts[parts.length - 1];
  const tries = [
    `.storybook/components/starci/${rest}/${leaf}.tsx`,
    `.storybook/components/starci/${rest}/index.tsx`,
    `.storybook/components/${rest}/${leaf}.tsx`,
    `.storybook/components/${rest}/index.tsx`,
    `src/components/${rest}/index.tsx`,
    `src/components/${rest}/component.tsx`,
    `src/components/${rest}/${leaf}.tsx`,
  ];
  for (const t of tries) {
    if (fs.existsSync(path.join(ROOT, t)) && !seen.has(t)) {
      seen.add(t);
      files.push(norm(t));
    }
  }
  return files;
}

const partialResolved = partials.map((p) => ({
  ...p,
  files: resolvePartialFiles(p.id).filter((f) => !isForbidden(f)),
}));

// Scan CSS door consumers for Button/Chip/Avatar/Typography/Stack/Flex/Cluster/Container
const doorTargets = {
  Button: ["Button", "ButtonBase"],
  Chip: ["Chip", "ChipBase"],
  Avatar: ["Avatar", "AvatarBase"],
  Typography: ["Typography"],
  Stack: ["StackH", "StackV", "Stack"],
  Flex: ["Flex"],
  Cluster: ["Cluster", "ResponsiveCluster"],
  Container: ["Container"],
  ButtonGroup: ["ButtonGroup"],
  EnumChip: ["EnumChip"],
  ProgressMeter: ["ProgressMeter"],
  MarkdownContent: ["MarkdownContent"],
  SurfaceCard: ["SurfaceCard"],
  PinnedTrack: ["PinnedTrack"],
};

function scanConsumers(names) {
  const hits = [];
  const roots = ["src/components", ".storybook/components/starci"];
  // also shared for declaration files
  const sharedRoots = [
    "src/components/atoms",
    "src/components/frames",
    "src/components/composites",
    ".storybook/components/atoms",
    ".storybook/components/frames",
    ".storybook/components/composites",
  ];
  const rg = spawnSync(
    "rg",
    [
      "-l",
      "--glob",
      "*.{tsx,ts}",
      names.map((n) => `\\b${n}\\b`).join("|"),
      ...roots,
      ...sharedRoots,
    ],
    { cwd: ROOT, encoding: "utf8", shell: true, maxBuffer: 50 * 1024 * 1024 },
  );
  // fallback: use grep via node walk if rg missing
  const listed = (rg.stdout || "")
    .split(/\r?\n/)
    .map((s) => norm(s.trim()))
    .filter(Boolean);
  if (listed.length) return listed.filter((f) => !isForbidden(f));

  // slow fallback walk
  function walk(dir, acc = []) {
    if (!fs.existsSync(dir)) return acc;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(p, acc);
      else if (/\.(tsx|ts)$/.test(ent.name)) acc.push(norm(path.relative(ROOT, p)));
    }
    return acc;
  }
  const all = [];
  for (const r of [...roots, ...sharedRoots]) walk(r, all);
  const re = new RegExp(`\\b(${names.join("|")})\\b`);
  for (const f of all) {
    if (isForbidden(f)) continue;
    try {
      const text = fs.readFileSync(path.join(ROOT, f), "utf8");
      if (re.test(text) && /className|classNames/.test(text)) hits.push(f);
    } catch {
      /* ignore */
    }
  }
  return hits;
}

const consumerIndex = {};
for (const [key, names] of Object.entries(doorTargets)) {
  consumerIndex[key] = scanConsumers(names);
}

// Assign agent manifests — disjoint by dominant owner
const agents = {
  "agent-1-button": { files: new Set(), clusterIds: [], focus: "Button/ButtonGroup consumer chain" },
  "agent-2-chip-avatar": { files: new Set(), clusterIds: [], focus: "Chip/Avatar consumer chains" },
  "agent-3-typography": { files: new Set(), clusterIds: [], focus: "Typography CSS-door consumers" },
  "agent-4-stack-flex-cluster": { files: new Set(), clusterIds: [], focus: "Stack/Flex/Cluster consumer chains" },
  "agent-5-container-grid": { files: new Set(), clusterIds: [], focus: "Container/Grid/measure consumer chains" },
  "agent-6-composites": { files: new Set(), clusterIds: [], focus: "EnumChip/ProgressMeter/Markdown/SurfaceCard/PinnedTrack" },
  "agent-7-identity": { files: new Set(), clusterIds: [], focus: "identity + frame-self-declare" },
  "agent-8-page-folder": { files: new Set(), clusterIds: [], focus: "page-folder + AuthenticationModal" },
  "agent-9-sentence-heroui": { files: new Set(), clusterIds: [], focus: "sentence hosts/raw/cn/heroui" },
  "agent-10-oracle": { files: new Set(), clusterIds: [], focus: "plugins tests + aggregation only" },
};

const claimed = new Map(); // file -> agent

function claim(agent, file, reason) {
  const f = norm(file);
  if (!f || isForbidden(f)) return false;
  if (claimed.has(f) && claimed.get(f) !== agent) return false;
  claimed.set(f, agent);
  agents[agent].files.add(f);
  return true;
}

// Partial clusters assignment by dominant rule/owner
for (const p of partialResolved) {
  const id = p.id;
  let agent = "agent-9-sentence-heroui";
  if (id.includes("SurfaceCard") || id.includes("PinnedTrack") || id.includes("EnumChip") || id.includes("ProgressMeter") || id.includes("Markdown")) {
    agent = "agent-6-composites";
  } else if ((p.afterRules || []).includes("starci-fe/require-frame-self-declare") || (p.afterRules || []).includes("starci-fe/require-identity-root")) {
    agent = "agent-7-identity";
  } else if ((p.afterRules || []).some((r) => r.includes("classname") || r.includes("public-classname"))) {
    // css door on blocks — agent 9 or composites
    if (id.includes("composites/")) agent = "agent-6-composites";
    else agent = "agent-9-sentence-heroui";
  } else if ((p.afterRules || []).some((r) => r.includes("host") || r.includes("raw-shape"))) {
    agent = "agent-9-sentence-heroui";
  }
  agents[agent].clusterIds.push(id);
  for (const f of p.files || []) claim(agent, f, "partial");
}

// Door consumer claims — StarCi consumers only; shared declarations claimed only if StarCi consumers exist
function claimDoorChain(agent, doorKey, declGlobs) {
  const cons = (consumerIndex[doorKey] || []).filter((f) => {
    const e = isStarCiEditable(f);
    return e === true || (e === "shared-candidate" && (f.includes("/atoms/") || f.includes("/frames/") || f.includes("/composites/")));
  });
  // Prefer StarCi block/page/layout/overlay consumers; include shared decls only when needed
  const starciCons = cons.filter((f) => f.startsWith("src/components/") || f.startsWith(".storybook/components/starci/"));
  const sharedDecls = cons.filter(
    (f) =>
      /\/(atoms|frames|composites)\//.test(f) &&
      /(ButtonBase|ChipBase|AvatarBase|Typography|Stack|Flex|Cluster|Container|Grid|ButtonGroup|EnumChip|ProgressMeter|MarkdownContent|SurfaceCard|PinnedTrack)/.test(
        f,
      ),
  );
  for (const f of starciCons) {
    // skip if already claimed
    if (claimed.has(f)) continue;
    // route by path heuristics for pages
    if (f.includes("/pages/") || f.includes("AuthenticationModal")) {
      if (agent !== "agent-8-page-folder" && !claimed.has(f)) {
        /* leave for agent 8 if page-folder rule heavy */
      }
    }
    claim(agent, f, doorKey);
  }
  // Shared API files: claim only for the primary door agent if StarCi consumers exist
  if (starciCons.length) {
    for (const f of sharedDecls) {
      if (claimed.has(f)) continue;
      // Only claim declaration files for agents 1-6
      if (["agent-1-button", "agent-2-chip-avatar", "agent-3-typography", "agent-4-stack-flex-cluster", "agent-5-container-grid", "agent-6-composites"].includes(agent)) {
        claim(agent, f, `${doorKey}-decl`);
      }
    }
  }
}

claimDoorChain("agent-1-button", "Button");
claimDoorChain("agent-1-button", "ButtonGroup");
claimDoorChain("agent-2-chip-avatar", "Chip");
claimDoorChain("agent-2-chip-avatar", "Avatar");
claimDoorChain("agent-3-typography", "Typography");
claimDoorChain("agent-4-stack-flex-cluster", "Stack");
claimDoorChain("agent-4-stack-flex-cluster", "Flex");
claimDoorChain("agent-4-stack-flex-cluster", "Cluster");
claimDoorChain("agent-5-container-grid", "Container");
claimDoorChain("agent-6-composites", "EnumChip");
claimDoorChain("agent-6-composites", "ProgressMeter");
claimDoorChain("agent-6-composites", "MarkdownContent");
claimDoorChain("agent-6-composites", "SurfaceCard");
claimDoorChain("agent-6-composites", "PinnedTrack");

// Agent 7: identity / frame-self-declare heavy StarCi files not yet claimed
const identityRules = new Set([
  "starci-fe/require-identity-root",
  "starci-fe/require-frame-self-declare",
  "starci-fe/no-identity-wrapper-div",
]);
for (const m of messages) {
  if (m.forbidden || m.a11y) continue;
  if (!identityRules.has(m.rule)) continue;
  const e = isStarCiEditable(m.file);
  if (e !== true && e !== "shared-candidate") continue;
  if (claimed.has(m.file)) continue;
  if (m.file.includes("/pages/") || m.file.includes("AuthenticationModal")) continue;
  claim("agent-7-identity", m.file, m.rule);
}

// Agent 8: page-folder + Auth modal
for (const m of messages) {
  if (m.forbidden) continue;
  if (m.rule !== "starci-fe/page-folder-two-files-only" && !m.file.includes("AuthenticationModal")) continue;
  if (!m.file.startsWith("src/components/pages/") && !m.file.includes("AuthenticationModal") && !m.file.startsWith("src/components/overlays/modals/AuthenticationModal")) continue;
  if (claimed.has(m.file)) continue;
  claim("agent-8-page-folder", m.file, m.rule);
}
// Also claim AuthenticationModal tree under overlays
function walkAuth(dir, acc = []) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return acc;
  for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
    const relP = norm(path.join(dir, ent.name));
    if (ent.isDirectory()) walkAuth(relP, acc);
    else if (/\.(tsx|ts)$/.test(ent.name)) acc.push(relP);
  }
  return acc;
}
for (const f of walkAuth("src/components/overlays/modals/AuthenticationModal")) {
  if (!claimed.has(f)) claim("agent-8-page-folder", f, "auth-modal");
}

// Agent 9: remaining StarCi sentence-tier messages
const sentenceRules = new Set([
  "starci-fe/no-host-element-at-sentence-tier",
  "starci-fe/no-raw-shape-at-sentence-tier",
  "starci-fe/no-classname-at-sentence-tier",
  "starci-fe/no-cn-above-vocabulary",
  "starci-fe/no-heroui-outside-vocabulary",
  "starci-fe/no-frame-fragment-item",
]);
for (const m of messages) {
  if (m.forbidden || m.a11y) continue;
  if (!sentenceRules.has(m.rule)) continue;
  if (isStarCiEditable(m.file) !== true) continue;
  if (claimed.has(m.file)) continue;
  claim("agent-9-sentence-heroui", m.file, m.rule);
}

// Agent 10: only plugin test files if needed — leave empty for product; coordinator owns aggregation
// Cap oversized manifests: redistribute if any agent > 80 files by moving excess to agent-9 only if unclaimed... already claimed
// Balance: if agent-9 is huge, leave it — that's OK

// Cap door agents to StarCi consumers with className usage evidence — trim shared decls if too many files
function trimAgent(name, maxFiles) {
  const a = agents[name];
  if (a.files.size <= maxFiles) return;
  const arr = [...a.files];
  // Prefer keep: starci blocks, then src, then sb shared decls last
  arr.sort((x, y) => {
    const score = (f) =>
      (f.includes("/starci/") ? 0 : 10) +
      (f.startsWith("src/components/blocks") ? 0 : 5) +
      (f.includes("/atoms/") || f.includes("/frames/") ? 20 : 0);
    return score(x) - score(y);
  });
  const keep = arr.slice(0, maxFiles);
  const drop = arr.slice(maxFiles);
  a.files = new Set(keep);
  for (const f of drop) {
    if (claimed.get(f) === name) claimed.delete(f);
  }
}

trimAgent("agent-1-button", 45);
trimAgent("agent-2-chip-avatar", 40);
trimAgent("agent-3-typography", 40);
trimAgent("agent-4-stack-flex-cluster", 45);
trimAgent("agent-5-container-grid", 40);
trimAgent("agent-6-composites", 40);
trimAgent("agent-7-identity", 50);
trimAgent("agent-8-page-folder", 40);
trimAgent("agent-9-sentence-heroui", 55);

// Overlap check
const overlap = [];
const seen = new Map();
for (const [name, a] of Object.entries(agents)) {
  for (const f of a.files) {
    if (seen.has(f)) overlap.push({ file: f, a: seen.get(f), b: name });
    else seen.set(f, name);
  }
}

const manifests = Object.fromEntries(
  Object.entries(agents).map(([name, a]) => [
    name,
    {
      focus: a.focus,
      clusterIds: a.clusterIds,
      files: [...a.files].sort(),
      fileCount: a.files.size,
    },
  ]),
);

const inventory = {
  batch: "B33",
  checkpoint: CHECKPOINT,
  generatedAt: new Date().toISOString(),
  command: "npx eslint --format json --no-error-on-unmatched-pattern src .storybook",
  baselineB32cAfter: { raw: 7136, files: 1260, errors: 0 },
  current: {
    rawMessages: messages.length,
    affectedFiles: Object.keys(byFile).length,
    errors: messages.filter((m) => m.severity === 2).length,
    warnings: messages.filter((m) => m.severity === 1).length,
    a11y: messages.filter((m) => m.a11y).length,
    starci: messages.filter((m) => String(m.rule).startsWith("starci-fe/")).length,
    forbiddenMessages: messages.filter((m) => m.forbidden).length,
  },
  byRule,
  byFamily,
  partialClustersFromB32c: partials.length,
  partialResolved,
  consumerIndexSummary: Object.fromEntries(
    Object.entries(consumerIndex).map(([k, v]) => [k, v.length]),
  ),
  overlapPass: overlap.length === 0,
  overlap,
  manifestFileCounts: Object.fromEntries(
    Object.entries(manifests).map(([k, v]) => [k, v.fileCount]),
  ),
};

fs.writeFileSync(path.join(ART, "2026-08-10-b33-inventory.json"), JSON.stringify(inventory, null, 2));
fs.writeFileSync(path.join(ART, "2026-08-10-b33-manifests.json"), JSON.stringify({ batch: "B33", checkpoint: CHECKPOINT, overlapPass: overlap.length === 0, manifests }, null, 2));

const md = [
  "# B33 partial clusters (from B32c)",
  "",
  `Checkpoint: \`${CHECKPOINT}\``,
  "",
  `| # | Cluster ID | Before→After | Remaining rules | Files | Assigned agent |`,
  `|---:|---|---:|---|---|---|`,
];
partialResolved.forEach((p, i) => {
  const agent =
    Object.entries(agents).find(([, a]) => a.clusterIds.includes(p.id))?.[0] || "?";
  md.push(
    `| ${i + 1} | \`${p.id}\` | ${p.beforeRaw}→${p.afterRaw} | ${(p.afterRules || []).join(", ")} | ${(p.files || []).join(", ") || "—"} | ${agent} |`,
  );
});
md.push("", `Overlap: **${overlap.length === 0 ? "PASS" : "FAIL"}**`, "");
fs.writeFileSync(path.join(ART, "2026-08-10-b33-partial-clusters.md"), md.join("\n"));

console.log(
  JSON.stringify(
    {
      raw: inventory.current.rawMessages,
      files: inventory.current.affectedFiles,
      errors: inventory.current.errors,
      a11y: inventory.current.a11y,
      overlapPass: inventory.overlapPass,
      overlap: overlap.length,
      counts: inventory.manifestFileCounts,
      partialFiles: partialResolved.map((p) => ({ id: p.id, files: p.files })),
    },
    null,
    2,
  ),
);

if (overlap.length) {
  console.error("OVERLAP FAIL", overlap.slice(0, 20));
  process.exit(1);
}
