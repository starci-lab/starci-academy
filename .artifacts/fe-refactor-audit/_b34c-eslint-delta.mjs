import fs from "node:fs"

const before = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b34c-eslint-before.json", "utf8"),
)
const after = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b34c-eslint-after.json", "utf8"),
)
const scope = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b34c-scope.json", "utf8"),
)

const norm = (p) => p.replace(/\\/g, "/")

function index(raw) {
  const map = new Map()
  for (const f of raw) {
    const rel = norm(f.filePath).split("/starci-academy/").pop()
    const msgs = (f.messages || []).filter((m) => m.severity !== 2)
    const errors = (f.messages || []).filter((m) => m.severity === 2)
    const rules = {}
    for (const m of msgs) rules[m.ruleId || "(none)"] = (rules[m.ruleId || "(none)"] || 0) + 1
    map.set(rel, { count: msgs.length, errors: errors.length, rules })
  }
  return map
}

function lookup(map, file) {
  if (map.has(file)) return map.get(file)
  for (const [k, v] of map) {
    if (k.endsWith(file) || file.endsWith(k)) return v
  }
  return { count: 0, errors: 0, rules: {} }
}

function sum(raw) {
  let w = 0
  let e = 0
  let a = 0
  let f = 0
  for (const x of raw) {
    const m = x.messages || []
    if (!m.length) continue
    f++
    for (const i of m) {
      if (i.severity === 2) e++
      else w++
      if ((i.ruleId || "").startsWith("jsx-a11y/")) a++
    }
  }
  return { warnings: w, errors: e, a11y: a, files: f }
}

const B = index(before)
const A = index(after)
const retained = scope.commitCandidates
const introduced = []
const reduced = []

for (const file of retained) {
  const b = lookup(B, file)
  const a = lookup(A, file)
  if (a.errors > 0) {
    introduced.push({ file, kind: "error", before: b.count, after: a.count, errors: a.errors })
  }
  if (a.count > b.count) {
    introduced.push({
      file,
      kind: "warning-increase",
      before: b.count,
      after: a.count,
      delta: a.count - b.count,
      beforeRules: b.rules,
      afterRules: a.rules,
    })
  }
  if (a.count < b.count) {
    reduced.push({ file, before: b.count, after: a.count, delta: a.count - b.count })
  }
}

const sb = sum(before)
const sa = sum(after)

const lines = [
  "# B34c ESLint delta",
  "",
  "Command: `npx eslint --format json --no-error-on-unmatched-pattern src .storybook`",
  "",
  "| | Warnings | Files | Errors | a11y |",
  "|---|---:|---:|---:|---:|",
  `| Checkpoint \`6ff21c66\` (measured) | ${sb.warnings} | ${sb.files} | ${sb.errors} | ${sb.a11y} |`,
  `| Worktree after B34 | ${sa.warnings} | ${sa.files} | ${sa.errors} | ${sa.a11y} |`,
  `| Δ | ${sa.warnings - sb.warnings} | ${sa.files - sb.files} | ${sa.errors - sb.errors} | ${sa.a11y - sb.a11y} |`,
  "",
  "## Candidate vs measured",
  "",
  "B34 status candidate before was 6911/1237 (B33c after artifact).",
  `Fresh detached worktree remasure at checkpoint is **${sb.warnings}/${sb.files}**.`,
  "Certification uses measured values.",
  "",
  "## Introduced warnings/errors on commit candidates",
  "",
  introduced.length === 0
    ? "_none_"
    : introduced.map((i) => `- \`${i.file}\` — ${i.kind}: ${i.before} → ${i.after}`).join("\n"),
  "",
  `## Reduced files on commit candidates: ${reduced.length}`,
  "",
]

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-10-b34c-eslint-delta.md",
  lines.join("\n"),
)
fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-10-b34c-eslint-introduced.json",
  JSON.stringify({ before: sb, after: sa, introduced, reduced }, null, 2),
)
console.log(JSON.stringify({ before: sb, after: sa, introducedCount: introduced.length, introduced, reducedCount: reduced.length }, null, 2))
