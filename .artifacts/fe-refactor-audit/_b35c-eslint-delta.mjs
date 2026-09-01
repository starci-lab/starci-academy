import fs from "node:fs"

const before = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b35c-eslint-before.json", "utf8"),
)
const after = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b35c-eslint-after.json", "utf8"),
)
const scope = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b35c-scope.json", "utf8"),
)

const norm = (p) => p.replace(/\\/g, "/")
const ARCH = [
  "starci-fe/no-host-element-at-sentence-tier",
  "starci-fe/no-raw-shape-at-sentence-tier",
  "starci-fe/no-classname-at-sentence-tier",
  "starci-fe/no-cn-above-vocabulary",
  "starci-fe/no-public-classname-prop",
  "starci-fe/require-identity-root",
  "starci-fe/require-frame-self-declare",
  "starci-fe/no-heroui-outside-vocabulary",
  "starci-fe/no-frame-fragment-item",
  "starci-fe/page-folder-two-files-only",
]

function summarize(raw) {
  let warnings = 0
  let errors = 0
  let a11y = 0
  let files = 0
  const byRule = {}
  for (const f of raw) {
    const msgs = f.messages || []
    if (!msgs.length) continue
    files++
    for (const m of msgs) {
      if (m.severity === 2) errors++
      else {
        warnings++
        byRule[m.ruleId || "(none)"] = (byRule[m.ruleId || "(none)"] || 0) + 1
        if ((m.ruleId || "").startsWith("jsx-a11y/")) a11y++
      }
    }
  }
  return { warnings, errors, a11y, files, byRule }
}

function index(raw) {
  const map = new Map()
  for (const f of raw) {
    const rel = norm(f.filePath).split("/starci-academy/").pop()
    const msgs = (f.messages || []).filter((m) => m.severity !== 2)
    const rules = {}
    for (const m of msgs) rules[m.ruleId || "(none)"] = (rules[m.ruleId || "(none)"] || 0) + 1
    map.set(rel, { count: msgs.length, errors: (f.messages || []).filter((m) => m.severity === 2).length, rules })
  }
  return map
}

function lookup(map, file) {
  if (map.has(file)) return map.get(file)
  for (const [k, v] of map) if (k.endsWith(file) || file.endsWith(k)) return v
  return { count: 0, errors: 0, rules: {} }
}

const sb = summarize(before)
const sa = summarize(after)
const B = index(before)
const A = index(after)

const introduced = []
const reduced = []
for (const file of scope.commitManifest) {
  const b = lookup(B, file)
  const a = lookup(A, file)
  if (a.errors > 0) introduced.push({ file, kind: "error", before: b.count, after: a.count, errors: a.errors })
  if (a.count > b.count)
    introduced.push({ file, kind: "warning-increase", before: b.count, after: a.count, delta: a.count - b.count })
  if (a.count < b.count) reduced.push({ file, before: b.count, after: a.count, delta: a.count - b.count })
}

const ruleDelta = ARCH.map((r) => ({
  rule: r,
  before: sb.byRule[r] || 0,
  after: sa.byRule[r] || 0,
  delta: (sa.byRule[r] || 0) - (sb.byRule[r] || 0),
}))

const lines = [
  "# B35c ESLint delta",
  "",
  "Command: `npx eslint --format json --no-error-on-unmatched-pattern src .storybook`",
  "",
  "| | Warnings | Files | Errors | a11y |",
  "|---|---:|---:|---:|---:|",
  `| Checkpoint \`02011807\` (measured) | ${sb.warnings} | ${sb.files} | ${sb.errors} | ${sb.a11y} |`,
  `| Worktree after B35 | ${sa.warnings} | ${sa.files} | ${sa.errors} | ${sa.a11y} |`,
  `| Δ | ${sa.warnings - sb.warnings} | ${sa.files - sb.files} | ${sa.errors - sb.errors} | ${sa.a11y - sb.a11y} |`,
  "",
  "## Candidate vs measured",
  "",
  "B35 status candidate before was 6872/1232 (B34c-after artifact).",
  `Fresh detached remasure at checkpoint is **${sb.warnings}/${sb.files}**. Certification uses measured values.`,
  "",
  "## High-frequency rule Δ",
  "",
  "| Rule | Before | After | Δ |",
  "|---|---:|---:|---:|",
  ...ruleDelta.map((r) => `| ${r.rule} | ${r.before} | ${r.after} | ${r.delta} |`),
  "",
  "## Introduced on commit manifest",
  "",
  introduced.length === 0
    ? "_none_"
    : introduced.map((i) => `- \`${i.file}\` — ${i.kind}: ${i.before} → ${i.after}`).join("\n"),
  "",
  `Reduced files on commit manifest: ${reduced.length}`,
  "",
]

fs.writeFileSync(".artifacts/fe-refactor-audit/2026-08-10-b35c-eslint-delta.md", lines.join("\n"))
fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-10-b35c-eslint-introduced.json",
  JSON.stringify({ before: sb, after: sa, ruleDelta, introduced, reducedCount: reduced.length }, null, 2),
)
console.log(JSON.stringify({ before: sb, after: sa, delta: { w: sa.warnings - sb.warnings, f: sa.files - sb.files }, introducedCount: introduced.length, introduced: introduced.slice(0, 25) }, null, 2))
