import fs from "node:fs";
import { spawnSync } from "node:child_process";

const ROOT = new URL("../..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
// On Windows URL pathname may start with /D: — normalize via cwd
const cwd = process.cwd();
const art = `${cwd}/.artifacts/fe-refactor-audit`;

const r = spawnSync(
  "npx",
  ["eslint", "--format", "json", "--no-error-on-unmatched-pattern", "src", ".storybook"],
  { encoding: "buffer", maxBuffer: 200 * 1024 * 1024, shell: true, cwd },
);
const d = r.stdout.toString("utf8");
const i = d.indexOf("[");
if (i < 0) {
  console.error("no eslint json");
  process.exit(1);
}
const j = JSON.parse(d.slice(i));
const before = JSON.parse(fs.readFileSync(`${art}/2026-08-10-b32c-eslint-before.json`, "utf8"));

const holdRules = new Set([
  "starci-fe/no-heroui-outside-vocabulary",
  "starci-fe/page-folder-two-files-only",
]);
const lockedPrefixes = [
  "src/components/nivoexpert/",
  "src/components/pages/Nivo",
  "src/modules/nivo",
];

function family(p) {
  p = p.replace(/\\/g, "/");
  if (p.includes(".storybook/components/atoms")) return "sb-atoms";
  if (p.includes(".storybook/components/frames")) return "sb-frames";
  if (p.includes(".storybook/components/composites")) return "sb-composites";
  if (p.includes(".storybook/components/starci")) return "sb-starci";
  if (p.includes(".storybook/")) return "sb-other";
  if (p.includes("/atoms/")) return "src-atoms";
  if (p.includes("/frames/")) return "src-frames";
  if (p.includes("/composites/")) return "src-composites";
  if (p.includes("/blocks/")) return "src-blocks";
  if (p.includes("/pages/")) return "src-pages";
  if (p.includes("/layouts/")) return "src-layouts";
  if (p.includes("/overlays/")) return "src-overlays";
  if (p.includes("/modules/")) return "src-modules";
  return "other";
}

function holdClass(file, rule) {
  const f = file.replace(/\\/g, "/");
  if (rule && rule.startsWith("jsx-a11y/")) return "a11y-observed";
  if (lockedPrefixes.some((x) => f.includes(x))) return "locked";
  if (holdRules.has(rule)) return "teacher-holdish";
  return "actionable";
}

function summarize(results, label) {
  let msgs = 0,
    files = 0,
    err = 0,
    warn = 0,
    a11y = 0,
    starci = 0;
  const byRule = {};
  const byFamily = {};
  const byHold = {};
  for (const f of results) {
    const file = (f.filePath || "").replace(/\\/g, "/");
    const m = f.messages || [];
    if (m.length) files++;
    for (const x of m) {
      msgs++;
      if (x.severity === 2) err++;
      else warn++;
      const rule = x.ruleId || "(none)";
      byRule[rule] = (byRule[rule] || 0) + 1;
      if (rule.startsWith("jsx-a11y/")) a11y++;
      else if (rule.startsWith("starci-fe/")) starci++;
      const fam = family(file);
      byFamily[fam] = (byFamily[fam] || 0) + 1;
      const hc = holdClass(file, rule);
      byHold[hc] = (byHold[hc] || 0) + 1;
    }
  }
  return {
    label,
    raw: msgs,
    files,
    errors: err,
    warnings: warn,
    starci,
    a11y,
    byRule,
    byFamily,
    byHold,
    generatedAt: new Date().toISOString(),
  };
}

const afterSum = summarize(j, "after");
fs.writeFileSync(
  `${art}/2026-08-10-b32c-eslint-after.json`,
  JSON.stringify({
    checkpoint: "9e86cbdf",
    command: "npx eslint --format json --no-error-on-unmatched-pattern src .storybook",
    summary: afterSum,
    results: j,
  }),
);

const b = before.summary || before;
const deltaRules = {};
for (const rName of new Set([...Object.keys(b.byRule || {}), ...Object.keys(afterSum.byRule)])) {
  const bv = (b.byRule || {})[rName] || 0;
  const av = afterSum.byRule[rName] || 0;
  if (bv !== av) deltaRules[rName] = { before: bv, after: av, delta: av - bv };
}
const deltaFam = {};
for (const f of new Set([...Object.keys(b.byFamily || {}), ...Object.keys(afterSum.byFamily)])) {
  const bv = (b.byFamily || {})[f] || 0;
  const av = afterSum.byFamily[f] || 0;
  if (bv !== av) deltaFam[f] = { before: bv, after: av, delta: av - bv };
}

const lines = [
  "# B32c ESLint delta (normalized)",
  "",
  "Command: `npx eslint --format json --no-error-on-unmatched-pattern src .storybook`",
  "Before: checkpoint `9e86cbdf` via temporary worktree",
  "After: active worktree (post unused-var repair remeasure)",
  "",
  "## Totals",
  "",
  "| Metric | Before | After | Delta |",
  "|---|---:|---:|---:|",
  `| Raw messages | ${b.raw} | ${afterSum.raw} | ${afterSum.raw - b.raw} |`,
  `| Affected files | ${b.files} | ${afterSum.files} | ${afterSum.files - b.files} |`,
  `| Errors | ${b.errors} | ${afterSum.errors} | ${afterSum.errors - b.errors} |`,
  `| Warnings | ${b.warnings} | ${afterSum.warnings} | ${afterSum.warnings - b.warnings} |`,
  `| StarCi | ${b.starci} | ${afterSum.starci} | ${afterSum.starci - b.starci} |`,
  `| A11y (observed) | ${b.a11y} | ${afterSum.a11y} | ${afterSum.a11y - b.a11y} |`,
  "",
  "## Hold classes",
  "",
  "| Class | Before | After | Delta |",
  "|---|---:|---:|---:|",
];
for (const k of ["actionable", "locked", "teacher-holdish", "a11y-observed"]) {
  const bv = (b.byHold || {})[k] || 0;
  const av = afterSum.byHold[k] || 0;
  lines.push(`| ${k} | ${bv} | ${av} | ${av - bv} |`);
}
lines.push("", "## Rule delta (sorted by improvement)", "");
for (const [rName, v] of Object.entries(deltaRules).sort((a, c) => a[1].delta - c[1].delta)) {
  lines.push(
    `- \`${rName}\`: ${v.before} → ${v.after} (${v.delta >= 0 ? "+" : ""}${v.delta})`,
  );
}
lines.push("", "## Path family delta", "");
for (const [rName, v] of Object.entries(deltaFam).sort((a, c) => a[1].delta - c[1].delta)) {
  lines.push(
    `- \`${rName}\`: ${v.before} → ${v.after} (${v.delta >= 0 ? "+" : ""}${v.delta})`,
  );
}
lines.push(
  "",
  "## Freeze-audit reconciliation",
  "",
  "Freeze audit claimed 7,347 / 1,358. B32 inventory claimed 7,428 / 1,434.",
  `Normalized checkpoint remeasure: **${b.raw} / ${b.files}**.`,
  "Use this normalized pair for all B32c claims; discard prior mismatched baselines.",
  "",
);
fs.writeFileSync(`${art}/2026-08-10-b32c-eslint-delta.md`, lines.join("\n"));
console.log(
  JSON.stringify({
    before: { raw: b.raw, files: b.files, errors: b.errors },
    after: { raw: afterSum.raw, files: afterSum.files, errors: afterSum.errors },
    delta: {
      raw: afterSum.raw - b.raw,
      files: afterSum.files - b.files,
      errors: afterSum.errors - b.errors,
    },
  }),
);
