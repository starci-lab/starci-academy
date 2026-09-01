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
const clusters = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b35c-clusters.json", "utf8"),
)

const norm = (p) =>
  p
    .replace(/\\/g, "/")
    .split("/starci-academy/")
    .pop()
    .replace(/^\.artifacts\/_b35c-worktree-[^/]+\//, "")

function index(raw) {
  const map = new Map()
  for (const f of raw) {
    const rel = norm(f.filePath)
    const msgs = (f.messages || []).filter((m) => m.severity !== 2)
    const rules = {}
    for (const m of msgs) rules[m.ruleId || "(none)"] = (rules[m.ruleId || "(none)"] || 0) + 1
    map.set(rel, {
      count: msgs.length,
      errors: (f.messages || []).filter((m) => m.severity === 2).length,
      rules,
      a11y: msgs.filter((m) => (m.ruleId || "").startsWith("jsx-a11y/")).length,
    })
  }
  return map
}

function get(map, file) {
  if (map.has(file)) return map.get(file)
  for (const [k, v] of map) if (k.endsWith(file) || file.endsWith(k)) return v
  return { count: 0, errors: 0, rules: {}, a11y: 0 }
}

const B = index(before)
const A = index(after)

const introduced = []
const preexisting = []
let manifestWarnings = 0
let manifestFilesWithWarnings = 0
let manifestErrors = 0

for (const file of scope.commitManifest) {
  if (!/\.(ts|tsx|js|jsx|mjs)$/.test(file)) continue
  const b = get(B, file)
  const a = get(A, file)
  if (a.errors > 0) {
    introduced.push({ file, kind: "error", errors: a.errors })
    manifestErrors += a.errors
  }
  for (const [rule, count] of Object.entries(a.rules)) {
    const prev = b.rules[rule] || 0
    if (count > prev) introduced.push({ file, rule, before: prev, after: count })
  }
  if (a.count > 0) {
    manifestFilesWithWarnings++
    manifestWarnings += a.count
    preexisting.push({ file, before: b.count, after: a.count, rules: a.rules })
  }
}

const closed = (clusters.clusters || []).filter((c) => c.status === "fully closed")
const closedWithWarnings = closed.filter((c) => (c.afterFocus || 0) > 0)

// EntityLink spot
const el = "src/components/blocks/feed/EntityLink/index.tsx"
console.log(
  JSON.stringify(
    {
      sampleKey: [...A.keys()].find((k) => k.includes("EntityLink")),
      entityLink: { before: get(B, el), after: get(A, el) },
      introducedCount: introduced.length,
      introduced,
      manifestWarnings,
      manifestFilesWithWarnings,
      manifestErrors,
      preexistingCount: preexisting.length,
      preexistingSample: preexisting.slice(0, 10),
      fullyClosed: closed.length,
      closedWithWarnings: closedWithWarnings.length,
      closedWithWarningsSample: closedWithWarnings.slice(0, 5),
    },
    null,
    2,
  ),
)

// Chunk failure triage
const chunkWarnings = []
for (const name of fs.readdirSync(".artifacts").filter((n) => n.startsWith("_b35c-chunk-") && n.endsWith(".json"))) {
  let raw
  try {
    raw = JSON.parse(fs.readFileSync(`.artifacts/${name}`, "utf8"))
  } catch {
    chunkWarnings.push({ name, parseError: true })
    continue
  }
  if (!Array.isArray(raw)) continue
  for (const f of raw) {
    const msgs = (f.messages || []).filter((m) => m.severity !== 2)
    if (!msgs.length) continue
    chunkWarnings.push({
      file: norm(f.filePath),
      count: msgs.length,
      rules: msgs.reduce((acc, m) => {
        acc[m.ruleId] = (acc[m.ruleId] || 0) + 1
        return acc
      }, {}),
    })
  }
}
fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-10-b35c-chunk-debt.json",
  JSON.stringify(
    {
      filesWithWarnings: chunkWarnings.length,
      totalWarnings: chunkWarnings.reduce((s, x) => s + (x.count || 0), 0),
      files: chunkWarnings,
    },
    null,
    2,
  ),
)
console.log("chunkDebtFiles", chunkWarnings.length)
