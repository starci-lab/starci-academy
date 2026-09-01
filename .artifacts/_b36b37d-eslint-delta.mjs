/**
 * Summarize B36+B37d ESLint before/after and write delta markdown.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const OUT = ".artifacts/fe-refactor-audit"
const before = JSON.parse(readFileSync(join(OUT, "2026-08-10-b36-b37d-eslint-before.json"), "utf8"))
const after = JSON.parse(readFileSync(join(OUT, "2026-08-10-b36-b37d-eslint-after.json"), "utf8"))

function summarize(report) {
  const byRule = new Map()
  let warnings = 0
  let errors = 0
  let a11y = 0
  let files = 0
  for (const row of report) {
    const w = row.warningCount || 0
    const e = row.errorCount || 0
    if (w || e) files++
    warnings += w
    errors += e
    for (const m of row.messages || []) {
      const id = m.ruleId || "(parse/unknown)"
      byRule.set(id, (byRule.get(id) || 0) + 1)
      if (String(id).includes("jsx-a11y")) a11y++
    }
  }
  return { warnings, errors, files, a11y, byRule }
}

function domainOf(ruleId) {
  if (!ruleId) return "other"
  if (String(ruleId).includes("jsx-a11y")) return "a11y"
  if (!String(ruleId).startsWith("starci-fe/")) return "upstream"
  const r = ruleId.slice("starci-fe/".length)
  if (
    [
      "no-fractional-spacing",
      "no-adjacent-chip",
      "no-modal-title-classname",
      "no-hero-heading-class",
      "no-arbitrary-token",
      "explain-justifies-token-choice",
      "no-public-frame-css-props",
    ].includes(r)
  )
    return "token-invariant"
  if (
    [
      "prefer-arrow-export",
      "require-export-jsdoc",
      "handler-on-prefix",
      "export-matches-folder",
      "no-inline-parameter-type",
      "no-emoji-in-source",
      "no-vietnamese-in-source-authoring",
      "no-runtime-namespace",
    ].includes(r)
  )
    return "authoring"
  if (
    [
      "no-heroui-outside-vocabulary",
      "presentational-purity",
      "require-identity-root",
      "no-identity-wrapper-div",
      "require-frame-self-declare",
      "page-folder-two-files-only",
      "no-helper-folder-in-components",
      "no-hardcoded-user-text-in-vocabulary",
    ].includes(r)
  )
    return "tier-ownership"
  if (
    [
      "no-classname-at-sentence-tier",
      "no-cn-above-vocabulary",
      "no-raw-shape-at-sentence-tier",
      "no-host-element-at-sentence-tier",
      "no-frame-fragment-item",
      "no-contentpage-box-classname",
    ].includes(r)
  )
    return "sentence-shape"
  if (
    [
      "no-public-classname-prop",
      "no-per-part-classname-prop",
      "no-css-door-type-laundering",
    ].includes(r)
  )
    return "css-contract"
  if (
    [
      "no-retired-async-content",
      "no-parallel-skeleton",
      "no-inline-skeleton-branch",
      "no-skeleton-twin-component",
    ].includes(r)
  )
    return "lifecycle"
  if (r === "no-anatomy-overlay") return "inspection"
  return "other-starci"
}

const b = summarize(before)
const a = summarize(after)

const allRules = new Set([...b.byRule.keys(), ...a.byRule.keys()])
const ruleDelta = [...allRules]
  .map((id) => ({
    ruleId: id,
    before: b.byRule.get(id) || 0,
    after: a.byRule.get(id) || 0,
    delta: (a.byRule.get(id) || 0) - (b.byRule.get(id) || 0),
    domain: domainOf(id),
  }))
  .filter((r) => r.delta !== 0)
  .sort((x, y) => x.delta - y.delta)

const byDomain = new Map()
for (const r of ruleDelta) {
  const cur = byDomain.get(r.domain) || { before: 0, after: 0, delta: 0 }
  cur.before += r.before
  cur.after += r.after
  cur.delta += r.delta
  byDomain.set(r.domain, cur)
}

const summary = {
  command: "npx eslint --format json --no-error-on-unmatched-pattern src .storybook",
  checkpoint: "84b92cd77",
  before: { warnings: b.warnings, files: b.files, errors: b.errors, a11y: b.a11y },
  after: { warnings: a.warnings, files: a.files, errors: a.errors, a11y: a.a11y },
  delta: {
    warnings: a.warnings - b.warnings,
    files: a.files - b.files,
    errors: a.errors - b.errors,
    a11y: a.a11y - b.a11y,
  },
  noRedundantLabeledSurfacePresent: {
    before: b.byRule.get("starci-fe/no-redundant-labeled-surface") || 0,
    after: a.byRule.get("starci-fe/no-redundant-labeled-surface") || 0,
  },
  ruleDelta,
  domainDelta: Object.fromEntries(byDomain),
}

writeFileSync(join(OUT, "2026-08-10-b36-b37d-eslint-summary.json"), JSON.stringify(summary, null, 2))

const md = `# B36+B37d ESLint delta

Command (identical for checkpoint and worktree):

\`\`\`bash
npx eslint --format json --no-error-on-unmatched-pattern src .storybook
\`\`\`

## Totals

| | Warnings | Files | Errors | a11y |
|---|---:|---:|---:|---:|
| Checkpoint \`84b92cd77\` | ${b.warnings} | ${b.files} | ${b.errors} | ${b.a11y} |
| Current worktree | ${a.warnings} | ${a.files} | ${a.errors} | ${a.a11y} |
| Δ | ${a.warnings - b.warnings} | ${a.files - b.files} | ${a.errors - b.errors} | ${a.a11y - b.a11y} |

\`starci-fe/no-redundant-labeled-surface\` hits: before ${summary.noRedundantLabeledSurfacePresent.before}, after ${summary.noRedundantLabeledSurfacePresent.after} (must be 0 after B37c).

## Domain delta

| Domain | Before | After | Δ |
|---|---:|---:|---:|
${[...byDomain.entries()]
  .sort((a, b) => a[1].delta - b[1].delta)
  .map(([d, v]) => `| ${d} | ${v.before} | ${v.after} | ${v.delta} |`)
  .join("\n")}

## Rule delta (non-zero only)

| Rule | Before | After | Δ | Domain |
|---|---:|---:|---:|---|
${ruleDelta.map((r) => `| \`${r.ruleId}\` | ${r.before} | ${r.after} | ${r.delta} | ${r.domain} |`).join("\n")}
`

writeFileSync(join(OUT, "2026-08-10-b36-b37d-eslint-delta.md"), md)
console.log(JSON.stringify(summary.delta, null, 2))
console.log("before", summary.before)
console.log("after", summary.after)
