import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".artifacts", ".next"].includes(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.(tsx|ts)$/.test(e.name)) out.push(p)
  }
  return out
}
const files = [...walk("src"), ...walk(".storybook")]
const FORBIDDEN = /(^|\/)(nivo|nivoexpert|mia-mia)(\/|$)/i

function scan(name, defs) {
  const def = new Set(defs)
  const re = new RegExp(`<${name}\\b[\\s\\S]{0,500}?className(s)?\\s*=`)
  const c = []
  for (const abs of files) {
    const rel = path.relative(ROOT, abs).replaceAll("\\", "/")
    if (def.has(rel)) continue
    if (!re.test(fs.readFileSync(abs, "utf8"))) continue
    c.push(rel + (FORBIDDEN.test(rel) ? " F" : ""))
  }
  console.log(name + ": " + c.length + (c.length ? "\n  " + c.slice(0, 12).join("\n  ") : " => BURN"))
}

const pairs = [
  ["CheckListCard", ["src/components/blocks/cards/CheckListCard/index.tsx"]],
  ["CrossListCard", ["src/components/blocks/cards/CrossListCard/index.tsx"]],
  ["CourseCardSkeleton", ["src/components/blocks/cards/CourseCardSkeleton/index.tsx"]],
  ["SummaryCard", ["src/components/blocks/cards/SummaryCard/index.tsx"]],
  ["AiCategoryChip", ["src/components/blocks/chips/AiCategoryChip/component.tsx", "src/components/blocks/chips/AiCategoryChip/index.tsx"]],
  ["SearchBar", ["src/components/blocks/form/SearchBar/component.tsx", "src/components/blocks/form/SearchBar/index.tsx"]],
  ["AvatarUploadButton", ["src/components/blocks/identity/AvatarUploadButton/index.tsx"]],
  ["StickyBottomBar", ["src/components/blocks/layout/StickyBottomBar/index.tsx"]],
  ["SubPageHeader", ["src/components/blocks/layout/SubPageHeader/component.tsx"]],
  ["VerdictHeroCard", ["src/components/blocks/stats/VerdictHeroCard/index.tsx"]],
  ["PaginationSkeleton", ["src/components/blocks/skeleton/PaginationSkeleton/index.tsx"]],
  ["CodePreviewTabs", ["src/components/composites/viewers/MarkdownContent/CodePreviewTabs.tsx"]],
  ["GroupPressableCard", ["src/components/blocks/cards/GroupPressableCard/index.tsx"]],
]
for (const [n, d] of pairs) scan(n, d)
