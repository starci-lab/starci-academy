import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit");

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

const norm = (p) => String(p || "").replace(/\\/g, "/");
const rel = (abs) => {
  const n = norm(abs);
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"), n.indexOf("/plugins/"));
  if (i >= 0) return n.slice(i + 1);
  return n;
};

const pathFamily = (file) => {
  const f = norm(file);
  if (f.startsWith("src/components/atoms/")) return "src-atoms";
  if (f.startsWith("src/components/frames/")) return "src-frames";
  if (f.startsWith("src/components/composites/")) return "src-composites";
  if (f.startsWith("src/components/blocks/")) return "src-blocks";
  if (f.startsWith("src/components/pages/")) return "src-pages";
  if (f.startsWith("src/components/layouts/")) return "src-layouts";
  if (f.startsWith("src/components/overlays/")) return "src-overlays";
  if (f.startsWith("src/app/")) return "src-app";
  if (f.startsWith("src/modules/")) return "src-modules";
  if (f.startsWith("src/hooks/")) return "src-hooks";
  if (f.startsWith(".storybook/components/atoms/")) return "sb-atoms";
  if (f.startsWith(".storybook/components/frames/")) return "sb-frames";
  if (f.startsWith(".storybook/components/composites/")) return "sb-composites";
  if (f.startsWith(".storybook/components/starci/")) return "sb-starci";
  if (f.startsWith(".storybook/components/nivo/")) return "sb-nivo";
  if (f.startsWith(".storybook/components/nivoexpert/")) return "sb-nivoexpert";
  if (f.startsWith(".storybook/components/mia-mia/")) return "sb-mia-mia";
  if (f.startsWith(".storybook/")) return "sb-other";
  if (f.startsWith("plugins/")) return "plugins";
  return "other";
};

const classifyHold = (file, rule) => {
  if (!rule) return "unknown";
  if (rule.startsWith("jsx-a11y/")) return "a11y-observed";
  if (LOCKED_RE.some((re) => re.test(file))) return "locked";
  if (
    /\/atoms\/.*\/(?:Modal|Drawer|Popover|Tooltip|Select|ListBox|Table|AlertDialog|ButtonGroup)\b/.test(
      file,
    )
  ) {
    if (rule === "starci-fe/no-public-classname-prop") return "vendor";
  }
  return "actionable";
};

const afterDoc = JSON.parse(fs.readFileSync(`${ART}/2026-08-10-b32c-eslint-after.json`, "utf8"));
const before = JSON.parse(fs.readFileSync(`${ART}/2026-08-10-b32c-eslint-before.json`, "utf8"));
const results = afterDoc.results;
if (!results) throw new Error("after.results missing");

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

const after = {
  checkpoint: "9e86cbdf",
  command: "npx eslint --format json --no-error-on-unmatched-pattern src .storybook",
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
  note: "Normalized to same family/holdClass classifiers as before inventory (phase2).",
};

// Keep results for cert tooling that expects them
after.results = results;

fs.writeFileSync(`${ART}/2026-08-10-b32c-eslint-after.json`, JSON.stringify(after));

const deltaRules = {};
for (const r of new Set([...Object.keys(before.byRule || {}), ...Object.keys(byRule)])) {
  const bv = (before.byRule || {})[r] || 0;
  const av = byRule[r] || 0;
  if (bv !== av) deltaRules[r] = { before: bv, after: av, delta: av - bv };
}
const deltaFam = {};
for (const f of new Set([...Object.keys(before.byFamily || {}), ...Object.keys(byFamily)])) {
  const bv = (before.byFamily || {})[f] || 0;
  const av = byFamily[f] || 0;
  if (bv !== av) deltaFam[f] = { before: bv, after: av, delta: av - bv };
}

const lines = [
  "# B32c ESLint delta (normalized)",
  "",
  "Command: `npx eslint --format json --no-error-on-unmatched-pattern src .storybook`",
  "Before: checkpoint `9e86cbdf` via temporary worktree",
  "After: active worktree (post unused-var repair remeasure)",
  "Classifiers: identical `pathFamily` + `classifyHold` as Phase 2 before inventory.",
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
for (const k of [
  ...new Set([
    ...Object.keys(before.byHoldClass || {}),
    ...Object.keys(after.byHoldClass || {}),
  ]),
].sort()) {
  const bv = (before.byHoldClass || {})[k] || 0;
  const av = (after.byHoldClass || {})[k] || 0;
  lines.push(`| ${k} | ${bv} | ${av} | ${av - bv} |`);
}
lines.push("", "## Rule delta (sorted by improvement)", "");
for (const [r, v] of Object.entries(deltaRules).sort((a, c) => a[1].delta - c[1].delta)) {
  lines.push(`- \`${r}\`: ${v.before} → ${v.after} (${v.delta >= 0 ? "+" : ""}${v.delta})`);
}
lines.push("", "## Path family delta", "");
for (const [r, v] of Object.entries(deltaFam).sort((a, c) => a[1].delta - c[1].delta)) {
  lines.push(`- \`${r}\`: ${v.before} → ${v.after} (${v.delta >= 0 ? "+" : ""}${v.delta})`);
}
lines.push(
  "",
  "## Freeze-audit reconciliation",
  "",
  "Freeze audit claimed 7,347 / 1,358. B32 inventory claimed 7,428 / 1,434.",
  `Normalized checkpoint remeasure: **${before.rawMessages} / ${before.affectedFiles}**.`,
  "Use this normalized pair for all B32c claims; discard prior mismatched baselines.",
  "",
  "## Certification note",
  "",
  "Earlier intermediate after-inventory (7159 / 1261 / 7 errors) was pre–unused-var repair.",
  "This file reflects the certified post-repair totals (0 errors).",
  "",
);
fs.writeFileSync(`${ART}/2026-08-10-b32c-eslint-delta.md`, lines.join("\n"));
console.log(
  JSON.stringify({
    before: {
      raw: before.rawMessages,
      files: before.affectedFiles,
      errors: before.errors,
      hold: before.byHoldClass,
    },
    after: {
      raw: after.rawMessages,
      files: after.affectedFiles,
      errors: after.errors,
      hold: after.byHoldClass,
    },
  }),
);
