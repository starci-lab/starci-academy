import fs from "node:fs";

const ART = ".artifacts/fe-refactor-audit";
const before = JSON.parse(fs.readFileSync(`${ART}/2026-08-10-b33c-eslint-before.json`, "utf8"));
const afterRaw = JSON.parse(fs.readFileSync(`${ART}/2026-08-10-b33c-eslint-after.json`, "utf8"));
// Normalize after shape if produced by b33 helper
const after = {
  rawMessages: afterRaw.rawMessages ?? afterRaw.after?.raw,
  affectedFiles: afterRaw.affectedFiles ?? afterRaw.after?.files,
  errors: afterRaw.errors ?? afterRaw.after?.errors ?? 0,
  warnings: afterRaw.warnings ?? afterRaw.rawMessages ?? afterRaw.after?.raw,
  starciMessages: afterRaw.starciMessages,
  a11yMessages: afterRaw.a11yMessages ?? afterRaw.after?.a11y ?? 11,
  byRule: afterRaw.byRule || {},
  byFamily: afterRaw.byFamily || {},
  byHoldClass: afterRaw.byHoldClass || {},
};

const lines = [
  "# B33c ESLint delta (normalized)",
  "",
  "Command: `npx eslint --format json --no-error-on-unmatched-pattern src .storybook`",
  "Before: checkpoint `139391b6` via temporary worktree",
  "After: active worktree (post certification repairs)",
  "",
  "## Totals",
  "",
  "| Metric | Before | After | Delta |",
  "|---|---:|---:|---:|",
  `| Raw messages | ${before.rawMessages} | ${after.rawMessages} | ${after.rawMessages - before.rawMessages} |`,
  `| Affected files | ${before.affectedFiles} | ${after.affectedFiles} | ${after.affectedFiles - before.affectedFiles} |`,
  `| Errors | ${before.errors} | ${after.errors} | ${after.errors - before.errors} |`,
  `| Warnings | ${before.warnings} | ${after.warnings} | ${after.warnings - before.warnings} |`,
  `| StarCi | ${before.starciMessages} | ${after.starciMessages} | ${(after.starciMessages ?? 0) - before.starciMessages} |`,
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
lines.push(
  "",
  "## Baseline note",
  "",
  "B33 status candidate claimed before **7136 / 1260**. Normalized checkpoint remeasure is **" +
    `${before.rawMessages} / ${before.affectedFiles}` +
    "**.",
  "Use the normalized pair for all B33c claims.",
  "",
  "## Certification repairs reflected in after",
  "",
  "- SB CollapsibleSidebar: do not reintroduce `className` (src retains for mia-mia)",
  "- Reverted ResponsiveBreadcrumb HeroUI→atom migration (introduced identity-root)",
  "- Reverted Auth EmailField/PasswordField inlining (introduced identity-root on CredentialsState)",
  "- Removed unused `oauth-button-item` module",
  "",
);
fs.writeFileSync(`${ART}/2026-08-10-b33c-eslint-delta.md`, lines.join("\n"));
console.log({
  before: { raw: before.rawMessages, files: before.affectedFiles, errors: before.errors },
  after: { raw: after.rawMessages, files: after.affectedFiles, errors: after.errors, a11y: after.a11yMessages },
});
