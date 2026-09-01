import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const FORBIDDEN_RE = /(^|\/)(nivo|nivoexpert|mia-mia)(\/|$)/i
const manifests = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, ".artifacts/fe-refactor-audit/2026-08-10-b35-manifests.json"),
    "utf8",
  ),
)
const mine = new Set(
  manifests.manifests["shared-consumer-chains-coordinator"].files.map((f) =>
    f.replaceAll("\\", "/"),
  ),
)

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

const files = [...walk(path.join(ROOT, "src")), ...walk(path.join(ROOT, ".storybook"))]

function scan(id, defFiles, test) {
  const def = new Set(defFiles)
  const consumers = []
  for (const abs of files) {
    const rel = path.relative(ROOT, abs).replaceAll("\\", "/")
    if (def.has(rel)) continue
    const text = fs.readFileSync(abs, "utf8")
    if (!test(text)) continue
    consumers.push({
      file: rel,
      forbidden: FORBIDDEN_RE.test(rel),
      inManifest: mine.has(rel),
    })
  }
  console.log("\n" + id, "n=" + consumers.length)
  for (const c of consumers) {
    console.log(
      c.forbidden ? "F" : c.inManifest ? "M" : "A",
      c.file,
    )
  }
}

scan(
  "EmptyContent.classNames",
  ["src/components/blocks/async/EmptyContent/index.tsx"],
  (t) => /<EmptyContent\b[\s\S]{0,400}?classNames\s*=/.test(t),
)
scan(
  "ErrorContent.classNames",
  ["src/components/blocks/async/ErrorContent/index.tsx"],
  (t) => /<ErrorContent\b[\s\S]{0,400}?classNames\s*=/.test(t),
)
scan(
  "Spacer.className",
  ["src/components/blocks/layout/Spacer/index.tsx"],
  (t) => /<Spacer\b[\s\S]{0,400}?className\s*=/.test(t),
)
scan(
  "SurfaceListCard.className",
  ["src/components/blocks/cards/SurfaceListCard/index.tsx"],
  (t) => /<SurfaceListCard(\.(Row|Item))?\b[\s\S]{0,400}?className\s*=/.test(t),
)
