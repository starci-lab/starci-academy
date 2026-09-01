/**
 * B33c Phase 1–5 certification pipeline (artifacts + measurement; repairs separate).
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync, execSync } from "node:child_process";

const ROOT = process.cwd();
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit");
const CHECKPOINT = "139391b6";
const WORKTREE = path.join(ROOT, ".artifacts", "_b33c-worktree-139391b6");
const PRE_DIRTY = new Set([
  "CLAUDE.md",
  ".claude/fe/decision-ledger.json",
  ".storybook/stories/mia-mia/blocks/marketing/SiteFooter/SiteFooter.stories.tsx",
  "src/components/blocks/learn/ReactionButton/types.ts",
]);
const FORBIDDEN_PREFIXES = [
  ".storybook/components/nivo/",
  ".storybook/components/nivoexpert/",
  ".storybook/stories/nivo/",
  ".storybook/stories/nivoexpert/",
  ".storybook/components/mia-mia/",
  ".storybook/stories/mia-mia/",
];

const norm = (p) => String(p || "").replace(/\\/g, "/");
const isForbidden = (f) => FORBIDDEN_PREFIXES.some((p) => norm(f).startsWith(p));

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(ART, name), "utf8"));
}

function workerChangedFiles(report) {
  const out = new Set();
  const add = (x) => {
    if (!x) return;
    if (typeof x === "string") out.add(norm(x));
    else if (Array.isArray(x)) x.forEach(add);
    else if (typeof x === "object") {
      if (x.file) out.add(norm(x.file));
      if (x.path) out.add(norm(x.path));
    }
  };
  add(report.changedFiles);
  add(report.changed);
  add(report.consumersMigrated);
  if (Array.isArray(report.migrations)) {
    for (const m of report.migrations) add(m.file || m.path || m);
  }
  return [...out];
}

const manifests = loadJson("2026-08-10-b33-manifests.json");
const changedManifest = loadJson("2026-08-10-b33-changed-manifest.json");
const b32cClusters = loadJson("2026-08-10-b32c-clusters.json");
const partials18 = b32cClusters.partialSample || [];

const workerKeys = [
  "agent-1-button",
  "agent-2-chip-avatar",
  "agent-3-typography",
  "agent-4-stack-flex-cluster",
  "agent-5-container-grid",
  "agent-6-composites",
  "agent-7-identity",
  "agent-8-page-folder",
  "agent-9-sentence-heroui",
  "agent-10-oracle",
];

const ownerByFile = new Map();
const entries = [];

function claim(file, classification, owner, extra = {}) {
  const f = norm(file);
  if (!f || PRE_DIRTY.has(f) || f.startsWith(".artifacts/")) return;
  if (ownerByFile.has(f) && ownerByFile.get(f) !== owner) {
    entries.push({
      file: f,
      dualOwnership: true,
      owners: [ownerByFile.get(f), owner],
      classification: "dual-ownership",
    });
    return;
  }
  ownerByFile.set(f, owner);
  entries.push({
    file: f,
    classification,
    owner,
    dualOwnership: false,
    forbidden: isForbidden(f),
    ...extra,
  });
}

// Manifest ownership first
for (const [agent, man] of Object.entries(manifests.manifests || {})) {
  for (const f of man.files || []) claim(f, "b33-manifest", agent, { inManifest: true });
}

// Worker-reported changed files (may be subset)
for (const key of workerKeys) {
  const report = loadJson(`2026-08-10-b33-worker-${key}.json`);
  for (const f of workerChangedFiles(report)) {
    if (!ownerByFile.has(f)) claim(f, "b33-worker-extra", key, { fromWorkerReport: true });
  }
}

// Coordinator repairs known from B33 status
const coordinatorRepairs = [
  ".storybook/components/starci/blocks/navigation/CollapsibleSidebar/CollapsibleSidebar.tsx",
  "src/components/blocks/navigation/CollapsibleSidebar/index.tsx",
  ".storybook/components/composites/cards/SurfaceCard/SurfaceCard.tsx",
  "src/components/composites/cards/SurfaceCard/index.tsx",
];
for (const f of coordinatorRepairs) {
  if (ownerByFile.has(f)) {
    // annotate existing
    const e = entries.find((x) => x.file === f && !x.dualOwnership);
    if (e) e.coordinatorRepair = true;
  } else {
    claim(f, "coordinator-repair", "coordinator", { coordinatorRepair: true });
  }
}

// New product files from changed manifest
for (const f of changedManifest.newProductFiles || []) {
  if (!ownerByFile.has(f)) claim(f, "b33-worker-extra", "agent-8-page-folder", { untrackedNew: true });
}

// Build commit set from actual git diff vs checkpoint ∩ owned, minus pre-dirty/forbidden
const diffFiles = spawnSync("git", ["diff", "--name-only", CHECKPOINT], { encoding: "utf8", cwd: ROOT })
  .stdout.split(/\r?\n/)
  .map(norm)
  .filter(Boolean);
const untracked = spawnSync("git", ["ls-files", "--others", "--exclude-standard"], {
  encoding: "utf8",
  cwd: ROOT,
})
  .stdout.split(/\r?\n/)
  .map(norm)
  .filter(Boolean);
const productUntracked = untracked.filter(
  (f) =>
    /^(src\/|\.storybook\/|plugins\/)/.test(f) &&
    !isForbidden(f) &&
    !PRE_DIRTY.has(f),
);

const dirtyProduct = [...new Set([...diffFiles, ...productUntracked])].filter(
  (f) => !f.startsWith(".artifacts/"),
);

const commitFiles = [];
const unowned = [];
const preDirtyHits = [];
const forbiddenHits = [];

for (const f of dirtyProduct) {
  if (PRE_DIRTY.has(f)) {
    preDirtyHits.push(f);
    continue;
  }
  if (isForbidden(f)) {
    forbiddenHits.push(f);
    continue;
  }
  if (!ownerByFile.has(f)) {
    // If file is in changed-manifest from B33, assign coordinator-repair orphan review
    if ((changedManifest.changedFiles || []).includes(f)) {
      claim(f, "coordinator-repair", "coordinator", { orphanReconciled: true });
    } else {
      unowned.push(f);
      continue;
    }
  }
  commitFiles.push(f);
}

// Deleted files still in commit if they were owned (git shows them in diff)
const deleted = spawnSync("git", ["diff", "--name-only", "--diff-filter=D", CHECKPOINT], {
  encoding: "utf8",
  cwd: ROOT,
})
  .stdout.split(/\r?\n/)
  .map(norm)
  .filter(Boolean);

for (const f of deleted) {
  if (PRE_DIRTY.has(f) || isForbidden(f)) continue;
  if (!commitFiles.includes(f)) {
    if (!ownerByFile.has(f)) claim(f, "b33-worker-extra", "agent-8-page-folder", { deleted: true });
    commitFiles.push(f);
  }
}

const uniqueCommit = [...new Set(commitFiles)].sort();
const dual = entries.filter((e) => e.dualOwnership);

const scope = {
  batch: "B33c",
  checkpoint: CHECKPOINT,
  generatedAt: new Date().toISOString(),
  ownershipOk: unowned.length === 0 && dual.length === 0 && forbiddenHits.length === 0,
  unowned,
  dualOwnership: dual,
  forbiddenHits,
  preDirtyHoldOuts: [...PRE_DIRTY],
  preDirtyPresentInWorktree: preDirtyHits,
  coordinatorRepairs,
  commitManifestCount: uniqueCommit.length,
  commitManifest: uniqueCommit,
  byOwner: {},
  entries: [...ownerByFile.entries()].map(([file, owner]) => ({
    file,
    owner,
    classification: entries.find((e) => e.file === file && e.owner === owner)?.classification || "b33",
    coordinatorRepair: coordinatorRepairs.includes(file),
    forbidden: isForbidden(file),
  })),
};
for (const f of uniqueCommit) {
  const o = ownerByFile.get(f) || "coordinator";
  scope.byOwner[o] = (scope.byOwner[o] || 0) + 1;
}

fs.writeFileSync(path.join(ART, "2026-08-10-b33c-scope.json"), JSON.stringify(scope, null, 2));
fs.writeFileSync(
  path.join(ART, "_b33c-commit-manifest.json"),
  JSON.stringify(
    {
      checkpoint: CHECKPOINT,
      count: uniqueCommit.length,
      files: uniqueCommit,
      excludedPreDirty: [...PRE_DIRTY],
      forbiddenHits,
      ownershipOk: scope.ownershipOk,
    },
    null,
    2,
  ),
);

console.log(
  JSON.stringify(
    {
      ownershipOk: scope.ownershipOk,
      commitCount: uniqueCommit.length,
      unowned,
      dual: dual.length,
      forbiddenHits,
      preDirty: preDirtyHits,
      byOwner: scope.byOwner,
    },
    null,
    2,
  ),
);

// ---------- ESLint summarize ----------
const LOCKED_RE = [
  /\/BlockAnatomy\b/i,
  /\/MockInterviewSession\b/,
  /\/QuizSession\b/,
  /\/LearnLoopScroll\b/,
  /\/ContentAiChat\b/,
  /\/ArchitectureScene\b/,
  /\/resources\//,
  /\/(?:nivo|nivoexpert)\//i,
  /\/mia-mia\//i,
];

function pathFamily(file) {
  const f = norm(file);
  if (f.startsWith("src/components/atoms/")) return "src-atoms";
  if (f.startsWith("src/components/frames/")) return "src-frames";
  if (f.startsWith("src/components/composites/")) return "src-composites";
  if (f.startsWith("src/components/blocks/")) return "src-blocks";
  if (f.startsWith("src/components/pages/")) return "src-pages";
  if (f.startsWith("src/components/layouts/")) return "src-layouts";
  if (f.startsWith("src/components/overlays/")) return "src-overlays";
  if (f.startsWith("src/modules/")) return "src-modules";
  if (f.startsWith(".storybook/components/atoms/")) return "sb-atoms";
  if (f.startsWith(".storybook/components/frames/")) return "sb-frames";
  if (f.startsWith(".storybook/components/composites/")) return "sb-composites";
  if (f.startsWith(".storybook/components/starci/")) return "sb-starci";
  if (f.startsWith(".storybook/components/nivo/")) return "sb-nivo";
  if (f.startsWith(".storybook/components/nivoexpert/")) return "sb-nivoexpert";
  if (f.startsWith(".storybook/components/mia-mia/")) return "sb-mia-mia";
  if (f.startsWith(".storybook/")) return "sb-other";
  return "other";
}
function classifyHold(file, rule) {
  if (!rule) return "unknown";
  if (rule.startsWith("jsx-a11y/")) return "a11y-observed";
  if (LOCKED_RE.some((re) => re.test(file))) return "locked";
  return "actionable";
}
function rel(abs, root) {
  const n = norm(abs);
  const r = norm(root).replace(/\/$/, "");
  if (n.startsWith(r + "/")) return n.slice(r.length + 1);
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"), n.indexOf("/plugins/"));
  if (i >= 0) return n.slice(i + 1);
  return n;
}
function runEslint(cwd) {
  const proc = spawnSync(
    "npx",
    ["eslint", "--format", "json", "--no-error-on-unmatched-pattern", "src", ".storybook"],
    { cwd, encoding: "buffer", maxBuffer: 256 * 1024 * 1024, shell: true },
  );
  const out = proc.stdout.toString("utf8");
  const start = out.indexOf("[");
  if (start < 0) throw new Error(`eslint parse fail in ${cwd}`);
  return JSON.parse(out.slice(start));
}
function summarize(results, root, label) {
  const messages = [];
  for (const file of results) {
    const fileRel = rel(file.filePath, root);
    for (const msg of file.messages || []) {
      messages.push({
        file: fileRel,
        rule: msg.ruleId || "unknown",
        severity: msg.severity,
        line: msg.line,
        column: msg.column,
        endLine: msg.endLine ?? msg.line,
        endColumn: msg.endColumn ?? msg.column,
        message: msg.message,
        family: pathFamily(fileRel),
        holdClass: classifyHold(fileRel, msg.ruleId),
      });
    }
  }
  const byRule = {};
  const byFamily = {};
  const byHold = {};
  const byFile = {};
  for (const m of messages) {
    byRule[m.rule] = (byRule[m.rule] || 0) + 1;
    byFamily[m.family] = (byFamily[m.family] || 0) + 1;
    byHold[m.holdClass] = (byHold[m.holdClass] || 0) + 1;
    byFile[m.file] = (byFile[m.file] || 0) + 1;
  }
  return {
    label,
    command: "npx eslint --format json --no-error-on-unmatched-pattern src .storybook",
    checkpoint: CHECKPOINT,
    rawMessages: messages.length,
    affectedFiles: Object.keys(byFile).length,
    errors: messages.filter((m) => m.severity === 2).length,
    warnings: messages.filter((m) => m.severity === 1).length,
    starciMessages: messages.filter((m) => String(m.rule).startsWith("starci-fe/")).length,
    a11yMessages: messages.filter((m) => String(m.rule).startsWith("jsx-a11y/")).length,
    byRule,
    byFamily,
    byHoldClass: byHold,
    messages,
    generatedAt: new Date().toISOString(),
  };
}

console.log("Measuring before via worktree…");
if (fs.existsSync(WORKTREE)) {
  try {
    execSync(`git worktree remove --force "${WORKTREE}"`, { cwd: ROOT, stdio: "ignore" });
  } catch {
    fs.rmSync(WORKTREE, { recursive: true, force: true });
  }
}
execSync(`git worktree add --detach "${WORKTREE}" ${CHECKPOINT}`, { cwd: ROOT, stdio: "inherit" });
const beforeResults = runEslint(WORKTREE);
const before = summarize(beforeResults, WORKTREE, "before");
fs.writeFileSync(path.join(ART, "2026-08-10-b33c-eslint-before.json"), JSON.stringify(before));
console.log("before", before.rawMessages, before.affectedFiles, before.errors);

console.log("Measuring after…");
const afterResults = runEslint(ROOT);
const after = summarize(afterResults, ROOT, "after");
fs.writeFileSync(path.join(ART, "2026-08-10-b33c-eslint-after.json"), JSON.stringify(after));
console.log("after", after.rawMessages, after.affectedFiles, after.errors);

const deltaRules = {};
for (const r of new Set([...Object.keys(before.byRule), ...Object.keys(after.byRule)])) {
  const bv = before.byRule[r] || 0;
  const av = after.byRule[r] || 0;
  if (bv !== av) deltaRules[r] = { before: bv, after: av, delta: av - bv };
}
const lines = [
  "# B33c ESLint delta (normalized)",
  "",
  "Command: `npx eslint --format json --no-error-on-unmatched-pattern src .storybook`",
  `Before: checkpoint \`${CHECKPOINT}\` via temporary worktree`,
  "After: active worktree",
  "",
  "## Totals",
  "",
  "| Metric | Before | After | Delta |",
  "|---|---:|---:|---:|",
  `| Raw messages | ${before.rawMessages} | ${after.rawMessages} | ${after.rawMessages - before.rawMessages} |`,
  `| Affected files | ${before.affectedFiles} | ${after.affectedFiles} | ${after.affectedFiles - before.affectedFiles} |`,
  `| Errors | ${before.errors} | ${after.errors} | ${after.errors - before.errors} |`,
  `| Warnings | ${before.warnings} | ${after.warnings} | ${after.warnings - before.warnings} |`,
  `| StarCi | ${before.starciMessages} | ${after.starciMessages} | ${after.starciMessages - before.starciMessages} |`,
  `| A11y (observed) | ${before.a11yMessages} | ${after.a11yMessages} | ${after.a11yMessages - before.a11yMessages} |`,
  "",
  "## Hold classes",
  "",
  "| Class | Before | After | Delta |",
  "|---|---:|---:|---:|",
];
for (const k of [...new Set([...Object.keys(before.byHoldClass), ...Object.keys(after.byHoldClass)])].sort()) {
  const bv = before.byHoldClass[k] || 0;
  const av = after.byHoldClass[k] || 0;
  lines.push(`| ${k} | ${bv} | ${av} | ${av - bv} |`);
}
lines.push("", "## Rule delta (sorted by improvement)", "");
for (const [r, v] of Object.entries(deltaRules).sort((a, b) => a[1].delta - b[1].delta)) {
  lines.push(`- \`${r}\`: ${v.before} → ${v.after} (${v.delta >= 0 ? "+" : ""}${v.delta})`);
}
fs.writeFileSync(path.join(ART, "2026-08-10-b33c-eslint-delta.md"), lines.join("\n"));

try {
  execSync(`git worktree remove --force "${WORKTREE}"`, { cwd: ROOT, stdio: "ignore" });
} catch {
  /* leave */
}

console.log("phase1-2 done");
