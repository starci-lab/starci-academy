/**
 * Find dead public CSS doors among coordinator-owned definition files.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const findings = JSON.parse(
  fs.readFileSync(path.join(ART, "_b35-a10-slice-findings.json"), "utf8"),
)
const FORBIDDEN_RE = /(^|\/)(nivo|nivoexpert|mia-mia)(\/|$)/i

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".artifacts" || ent.name === ".next")
      continue
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, out)
    else if (/\.(tsx|ts)$/.test(ent.name)) out.push(p)
  }
  return out
}
const allFiles = [...walk(path.join(ROOT, "src")), ...walk(path.join(ROOT, ".storybook"))]

function exportName(file) {
  const base = path.basename(file, path.extname(file))
  if (base === "index" || base === "component") {
    return path.basename(path.dirname(file))
  }
  return base.replace(/Base$/, "")
}

const doorDefs = findings.classnameDoors
  .map((x) => x.file)
  .filter((f) => !f.includes(".storybook/stories/"))

const dead = []
const live = []
for (const def of doorDefs) {
  const name = exportName(def)
  // skip SurfaceCard / huge namespaces for speed heuristics
  const re = new RegExp(`<${name}\\b[\\s\\S]{0,500}?className(s)?\\s*=`)
  const consumers = []
  for (const abs of allFiles) {
    const rel = path.relative(ROOT, abs).replaceAll("\\", "/")
    if (rel === def) continue
    // skip same folder twins
    if (rel.endsWith("/" + path.basename(def)) && path.dirname(rel).includes(name)) {
      // still check
    }
    let text
    try {
      text = fs.readFileSync(abs, "utf8")
    } catch {
      continue
    }
    if (!re.test(text)) continue
    consumers.push({
      file: rel,
      forbidden: FORBIDDEN_RE.test(rel),
    })
  }
  const entry = {
    def,
    name,
    n: consumers.length,
    forbidden: consumers.filter((c) => c.forbidden).length,
    sample: consumers.slice(0, 5).map((c) => c.file),
  }
  if (consumers.length === 0) dead.push(entry)
  else live.push(entry)
}

dead.sort((a, b) => a.def.localeCompare(b.def))
fs.writeFileSync(
  path.join(ART, "_b35-a10-dead-doors.json"),
  JSON.stringify({ dead, liveCount: live.length, deadCount: dead.length }, null, 2),
)
console.log("DEAD", dead.length)
for (const d of dead) console.log(" ", d.name, d.def)
console.log("LIVE", live.length)
