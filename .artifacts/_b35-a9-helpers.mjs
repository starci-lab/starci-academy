import fs from "fs"
import path from "path"

const m = JSON.parse(
  fs.readFileSync("./.artifacts/fe-refactor-audit/2026-08-10-b35-manifests.json", "utf8"),
)
const files = m.manifests["pages-and-filing"].files
const locked = new Set(m.manifests["pages-and-filing"].lockedHolds.map((h) => h.path))
const holdRe = /MockInterviewSession|QuizSession|LearnLoopScroll/

const helpers = files.filter((f) => {
  if (locked.has(f) || holdRe.test(f)) return false
  const base = path.posix.basename(f)
  const norm = f.replaceAll("\\", "/")
  if (/\/(hooks|types|utils|constants|enums)\//.test(norm)) return true
  if (/^use[A-Z].*\.ts$/.test(base)) return true
  if (base === "types.ts" || base === "constants.ts" || base === "map.ts" || base === "map.tsx")
    return true
  if (base.endsWith(".ts") && !base.endsWith(".tsx") && !norm.includes("/hooks/")) {
    // other non-tsx leaves under pages
    if (/Persona|metricsFormat|modules|serialize|groupBy|kpiMeta|scene|data|recap|statusVisual/.test(base))
      return true
  }
  return false
})

console.log(helpers.join("\n"))
console.log("\nCOUNT", helpers.length)
