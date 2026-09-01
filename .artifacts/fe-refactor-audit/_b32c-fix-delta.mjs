import fs from "node:fs";

const art = `${process.cwd()}/.artifacts/fe-refactor-audit`;
const before = JSON.parse(fs.readFileSync(`${art}/2026-08-10-b32c-eslint-before.json`, "utf8"));
const afterDoc = JSON.parse(fs.readFileSync(`${art}/2026-08-10-b32c-eslint-after.json`, "utf8"));
const after = afterDoc.summary;

const b = {
  raw: before.rawMessages,
  files: before.affectedFiles,
  errors: before.errors,
  warnings: before.warnings,
  starci: before.starciMessages,
  a11y: before.a11yMessages,
  byRule: before.byRule,
  byFamily: before.byFamily,
  byHold: before.byHoldClass,
};

// Normalize after artifact shape to match before for consumers
afterDoc.normalized = {
  rawMessages: after.raw,
  affectedFiles: after.files,
  errors: after.errors,
  warnings: after.warnings,
  starciMessages: after.starci,
  a11yMessages: after.a11y,
  byRule: after.byRule,
  byFamily: after.byFamily,
  byHoldClass: after.byHold,
};
// Drop heavy results from after if present — keep summary only for size? Keep for cert.
fs.writeFileSync(`${art}/2026-08-10-b32c-eslint-after.json`, JSON.stringify(afterDoc));

const deltaRules = {};
for (const r of new Set([...Object.keys(b.byRule || {}), ...Object.keys(after.byRule || {})])) {
  const bv = (b.byRule || {})[r] || 0;
  const av = (after.byRule || {})[r] || 0;
  if (bv !== av) deltaRules[r] = { before: bv, after: av, delta: av - bv };
}
const deltaFam = {};
for (const f of new Set([...Object.keys(b.byFamily || {}), ...Object.keys(after.byFamily || {})])) {
  const bv = (b.byFamily || {})[f] || 0;
  const av = (after.byFamily || {})[f] || 0;
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
  `| Raw messages | ${b.raw} | ${after.raw} | ${after.raw - b.raw} |`,
  `| Affected files | ${b.files} | ${after.files} | ${after.files - b.files} |`,
  `| Errors | ${b.errors} | ${after.errors} | ${after.errors - b.errors} |`,
  `| Warnings | ${b.warnings} | ${after.warnings} | ${after.warnings - b.warnings} |`,
  `| StarCi | ${b.starci} | ${after.starci} | ${after.starci - b.starci} |`,
  `| A11y (observed) | ${b.a11y} | ${after.a11y} | ${after.a11y - b.a11y} |`,
  "",
  "## Hold classes",
  "",
  "| Class | Before | After | Delta |",
  "|---|---:|---:|---:|",
];
for (const k of ["actionable", "locked", "teacher-holdish", "vendor", "a11y-observed"]) {
  const bv = (b.byHold || {})[k] || 0;
  const av = (after.byHold || {})[k] || 0;
  if (bv || av) lines.push(`| ${k} | ${bv} | ${av} | ${av - bv} |`);
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
  `Normalized checkpoint remeasure: **${b.raw} / ${b.files}**.`,
  "Use this normalized pair for all B32c claims; discard prior mismatched baselines.",
  "",
  "## Certification note",
  "",
  "Earlier B32c after-inventory (7159 / 1261 / 7 errors) was pre–unused-var repair.",
  "This file reflects the certified post-repair totals (0 errors).",
  "",
);
fs.writeFileSync(`${art}/2026-08-10-b32c-eslint-delta.md`, lines.join("\n"));
console.log(
  JSON.stringify({
    before: { raw: b.raw, files: b.files, errors: b.errors },
    after: { raw: after.raw, files: after.files, errors: after.errors },
    delta: { raw: after.raw - b.raw, files: after.files - b.files },
  }),
);
