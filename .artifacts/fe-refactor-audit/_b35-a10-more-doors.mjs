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

const candidates = [
  ["Page.className", ["src/components/composites/layout/Page/index.tsx", ".storybook/components/composites/layout/Page/Page.tsx"], (t) => /<Page(\.[A-Za-z]+)?\b[\s\S]{0,500}?className(s)?\s*=/.test(t)],
  ["Form.className", ["src/components/composites/form/Form/index.tsx", ".storybook/components/composites/form/Form/Form.tsx"], (t) => /<Form(\.[A-Za-z]+)?\b[\s\S]{0,500}?className(s)?\s*=/.test(t)],
  ["KeyValue.className", ["src/components/composites/data/KeyValue/index.tsx"], (t) => /<KeyValue(\.[A-Za-z]+)?\b[\s\S]{0,500}?className(s)?\s*=/.test(t)],
  ["Toolbar.className", ["src/components/composites/navigation/Toolbar/index.tsx"], (t) => /<Toolbar\b[\s\S]{0,500}?className(s)?\s*=/.test(t)],
  ["TitledText.classNames", ["src/components/composites/text/TitledText/index.tsx", ".storybook/components/composites/text/TitledText/TitledText.tsx"], (t) => /<TitledText\b[\s\S]{0,400}?classNames\s*=/.test(t)],
  ["ContinueCard.className", ["src/components/blocks/cards/ContinueCard/index.tsx"], (t) => /<ContinueCard\b[\s\S]{0,400}?className\s*=/.test(t)],
  ["SectionCard.className", ["src/components/blocks/cards/SectionCard/index.tsx"], (t) => /<SectionCard\b[\s\S]{0,400}?className(s)?\s*=/.test(t)],
  ["PressableCard.className", ["src/components/blocks/cards/PressableCard/index.tsx"], (t) => /<PressableCard\b[\s\S]{0,400}?className(s)?\s*=/.test(t)],
  ["PageHeader.className", ["src/components/blocks/layout/PageHeader/index.tsx"], (t) => /<PageHeader\b[\s\S]{0,400}?className(s)?\s*=/.test(t)],
  ["ListRow.className", ["src/components/blocks/lists/ListRow/index.tsx"], (t) => /<ListRow\b[\s\S]{0,400}?className(s)?\s*=/.test(t)],
  ["BrandLogo.className", ["src/components/blocks/identity/BrandLogo/index.tsx"], (t) => /<BrandLogo\b[\s\S]{0,400}?className(s)?\s*=/.test(t)],
  ["IconTile.className", ["src/components/blocks/identity/IconTile/index.tsx"], (t) => /<IconTile\b[\s\S]{0,400}?className(s)?\s*=/.test(t)],
  ["CourseCard.className", ["src/components/blocks/cards/CourseCard/component.tsx"], (t) => /<_?CourseCard\b[\s\S]{0,400}?className\s*=/.test(t)],
]

for (const [id, defs, test] of candidates) {
  const def = new Set(defs)
  const consumers = []
  for (const abs of files) {
    const rel = path.relative(ROOT, abs).replaceAll("\\", "/")
    if (def.has(rel)) continue
    if (!test(fs.readFileSync(abs, "utf8"))) continue
    consumers.push({
      file: rel,
      f: FORBIDDEN_RE.test(rel),
      m: mine.has(rel),
    })
  }
  const tag =
    consumers.length === 0
      ? "BURN"
      : consumers.some((c) => c.f)
        ? "RETAIN-locked"
        : "RETAIN/migrate"
  console.log(`${id}: ${consumers.length} => ${tag}`)
  for (const c of consumers.slice(0, 10))
    console.log(" ", c.f ? "F" : c.m ? "M" : "A", c.file)
}
