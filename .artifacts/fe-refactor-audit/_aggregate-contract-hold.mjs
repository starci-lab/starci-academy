import fs from "node:fs"
import path from "node:path"

const ART = ".artifacts/fe-refactor-audit"
const workers = [
  "per-part-props",
  "stacking-layout",
  "heroui-boundaries",
  "identity-hosts",
  "skeleton-contracts",
  "twin-parity",
]

const byFile = new Map()
const summary = {
  generatedAt: new Date().toISOString(),
  batch: 13,
  title: "CONTRACT HOLD CLOSURE",
  checkpoint: "22f28f4e",
  workers: {},
  totals: { changed: 0, skipped: 0, holds: 0, decisions: 0, regressions: 0 },
  overlaps: [],
  allDecisions: [],
  changedFiles: [],
}

const rel = (raw) => {
  let key = String(raw).replace(/\\/g, "/")
  for (const m of ["/src/", "/.storybook/"]) {
    const i = key.indexOf(m)
    if (i >= 0) {
      key = key.slice(i + 1)
      break
    }
  }
  return key.replace(/^\.\//, "")
}

for (const w of workers) {
  const j = JSON.parse(fs.readFileSync(path.join(ART, `2026-08-08-contract-worker-${w}.json`), "utf8"))
  const changed = j.changed || []
  const skipped = j.skipped || []
  const holds = j.holds || []
  const decisions = j.decisions || []
  const regressions = j.regressions || []
  summary.workers[w] = {
    changed: changed.length,
    skipped: skipped.length,
    holds: holds.length,
    decisions: decisions.length,
    regressions: regressions.length,
    verification: j.verification || {},
  }
  summary.totals.changed += changed.length
  summary.totals.skipped += skipped.length
  summary.totals.holds += holds.length
  summary.totals.decisions += decisions.length
  summary.totals.regressions += regressions.length
  for (const d of decisions) {
    summary.allDecisions.push({ partition: w, ...(typeof d === "object" ? d : { raw: d }) })
  }
  for (const c of changed) {
    const key = rel(typeof c === "string" ? c : c.path || c)
    if (!byFile.has(key)) byFile.set(key, [])
    byFile.get(key).push(w)
  }
}

for (const [f, ws] of byFile) {
  if (ws.length > 1) summary.overlaps.push({ file: f, workers: ws })
}

summary.uniqueChanged = byFile.size
summary.changedFiles = [...byFile.keys()].filter((f) => fs.existsSync(f)).sort()
summary.deferredSafe = summary.allDecisions.filter(
  (d) =>
    (d.classification === "safe-api-removal" || d.classification === "safe-consumer-migration") &&
    d.applied === false,
)
summary.proposedSlots = summary.allDecisions.filter((d) => d.classification === "new-named-slot-required")
summary.vendorBoundaries = summary.allDecisions.filter((d) => d.classification === "vendor-boundary")

fs.writeFileSync(path.join(ART, "_contract-aggregate-scratch.json"), JSON.stringify(summary, null, 2))
console.log(
  JSON.stringify(
    {
      totals: summary.totals,
      overlaps: summary.overlaps.length,
      changed: summary.changedFiles,
      deferredSafe: summary.deferredSafe.map((d) => ({ id: d.id, partition: d.partition })),
      proposedSlots: summary.proposedSlots.length,
      vendorBoundaries: summary.vendorBoundaries.length,
    },
    null,
    2,
  ),
)
