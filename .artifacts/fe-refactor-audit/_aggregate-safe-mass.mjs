import fs from "node:fs"
import path from "node:path"

const ART = ".artifacts/fe-refactor-audit"
const workers = [
  "atoms",
  "composites-frames",
  "blocks-layout",
  "blocks-domain",
  "pages-learning-commerce",
  "pages-profile-dashboard",
  "app-modules-utils",
  "storybook-only",
]

const byFile = new Map()
const summary = {
  generatedAt: new Date().toISOString(),
  batch: 11,
  title: "SAFE MASS-BURN ONLY",
  workers: {},
  totals: { changed: 0, skipped: 0, holds: 0, regressions: 0 },
  overlaps: [],
  uniqueChangedFiles: 0,
}

const rel = (raw) => {
  let key = String(raw).replace(/\\/g, "/")
  for (const m of ["/src/", "/.storybook/", "/plugins/"]) {
    const i = key.indexOf(m)
    if (i >= 0) {
      key = key.slice(i + 1)
      break
    }
  }
  return key.replace(/^\.\//, "")
}

for (const w of workers) {
  const j = JSON.parse(fs.readFileSync(path.join(ART, `2026-08-08-safe-mass-worker-${w}.json`), "utf8"))
  const changed = j.changed || []
  const skipped = j.skipped || []
  const holds = j.holds || []
  const regressions = j.regressions || []
  summary.workers[w] = {
    changed: changed.length,
    skipped: skipped.length,
    holds: holds.length,
    regressions: regressions.length,
    verification: j.verification || {},
  }
  summary.totals.changed += changed.length
  summary.totals.skipped += skipped.length
  summary.totals.holds += holds.length
  summary.totals.regressions += regressions.length
  for (const c of changed) {
    const key = rel(c.path || c)
    if (!byFile.has(key)) byFile.set(key, [])
    byFile.get(key).push(w)
  }
}

for (const [f, ws] of byFile) {
  if (ws.length > 1) summary.overlaps.push({ file: f, workers: ws })
}
summary.uniqueChangedFiles = byFile.size

const files = [...byFile.keys()].filter((f) => fs.existsSync(f)).sort()
fs.writeFileSync(path.join(ART, "_safe-mass-changed-files.txt"), files.join("\n"))

const set = new Set(files)
const twinIssues = []
for (const p of files) {
  if (!p.endsWith(".tsx") && !p.endsWith(".ts")) continue
  if (p.includes("/stories/")) continue
  let twin = null
  if (p.startsWith(".storybook/components/")) twin = p.replace(/^\.storybook\//, "src/")
  else if (p.startsWith("src/components/")) twin = p.replace(/^src\//, ".storybook/")
  if (!twin) continue
  if (fs.existsSync(twin) && !set.has(twin)) twinIssues.push({ changed: p, twin })
}
summary.twinParity = { softMismatches: twinIssues.length, issues: twinIssues }
fs.writeFileSync(path.join(ART, "2026-08-08-safe-mass-twin-parity.json"), JSON.stringify(summary.twinParity, null, 2))
fs.writeFileSync(path.join(ART, "2026-08-08-safe-mass-status.json"), JSON.stringify(summary, null, 2))

console.log(
  JSON.stringify(
    {
      totals: summary.totals,
      overlaps: summary.overlaps.length,
      unique: summary.uniqueChangedFiles,
      existing: files.length,
      twinMissing: twinIssues.length,
      perWorker: Object.fromEntries(
        Object.entries(summary.workers).map(([k, v]) => [
          k,
          { changed: v.changed, holds: v.holds, skipped: v.skipped },
        ]),
      ),
    },
    null,
    2,
  ),
)
if (twinIssues.length) console.log(JSON.stringify(twinIssues.slice(0, 20), null, 2))
