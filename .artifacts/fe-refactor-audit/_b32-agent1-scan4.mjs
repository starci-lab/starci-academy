import fs from "fs"
import path from "path"

const ROOTS = [".storybook", "src"]
const manifest = JSON.parse(
  fs.readFileSync("./.artifacts/fe-refactor-audit/2026-08-10-b32-manifests.json", "utf8"),
).agents["agent-1-atoms"]
const manifestSet = new Set(manifest.map((p) => p.replace(/\\/g, "/")))

const targets = [
  { key: "Button", tags: ["ButtonBase"], doors: ["classNames"], atomPath: "/atoms/buttons/Button/" },
  { key: "Chip", tags: ["ChipBase"], doors: ["classNames", "dotClassName"], atomPath: "/atoms/chips/Chip/" },
  { key: "Avatar", tags: ["AvatarBase"], doors: ["classNames"], atomPath: "/atoms/display/Avatar/" },
  { key: "Badge", tags: ["Badge"], doors: ["classNames"], atomPath: "/atoms/display/Badge" },
  { key: "Divider", tags: ["Divider"], doors: ["classNames"], atomPath: "/atoms/display/Divider" },
  { key: "IconTile", tags: ["IconTile"], doors: ["classNames"], atomPath: "/atoms/display/IconTile" },
  { key: "Logo", tags: ["Logo"], doors: ["classNames"], atomPath: "/atoms/display/Logo" },
  { key: "Spinner", tags: ["Spinner"], doors: ["classNames"], atomPath: "/atoms/display/Spinner" },
  { key: "Alert", tags: ["Alert"], doors: ["classNames"], atomPath: "/atoms/feedback/Alert" },
  { key: "QRCode", tags: ["QRCode"], doors: ["classNames"], atomPath: "/atoms/media/QRCode" },
  { key: "Accordion", tags: ["Accordion"], doors: ["classNames"], atomPath: "/atoms/navigation/Accordion" },
  { key: "Breadcrumbs", tags: ["Breadcrumbs"], doors: ["classNames"], atomPath: "/atoms/navigation/Breadcrumbs" },
  { key: "LinkBack", tags: ["LinkBack"], doors: ["classNames"], atomPath: "/atoms/navigation/Link/LinkBack" },
  { key: "LinkSeeMore", tags: ["LinkSeeMore"], doors: ["classNames"], atomPath: "/atoms/navigation/Link/LinkSeeMore" },
  { key: "Pagination", tags: ["Pagination"], doors: ["classNames"], atomPath: "/atoms/navigation/Pagination" },
  { key: "TabsBase", tags: ["TabsBase"], doors: ["classNames"], atomPath: "/atoms/navigation/Tabs/TabsBase" },
  { key: "TabsExtended", tags: ["TabsExtended"], doors: ["classNames"], atomPath: "/atoms/navigation/Tabs/TabsExtended" },
  { key: "Menu", tags: ["Menu"], doors: ["classNames"], atomPath: "/atoms/overlay/Menu" },
  { key: "Typography", tags: ["Typography"], doors: ["classNames"], atomPath: "/atoms/text/Typography" },
  { key: "Progress", tags: ["Progress"], doors: ["classNames"], atomPath: "/atoms/display/Progress" },
  // also check exported aliases where name differs from file
  { key: "ButtonAlias", tags: ["Button"], doors: ["classNames"], atomPath: "/atoms/buttons/Button/", importHint: "ButtonBase" },
  { key: "ChipAlias", tags: ["Chip"], doors: ["classNames", "dotClassName"], atomPath: "/atoms/chips/Chip/", importHint: "ChipBase" },
  { key: "AvatarAlias", tags: ["Avatar"], doors: ["classNames"], atomPath: "/atoms/display/Avatar/", importHint: "AvatarBase" },
]

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next") continue
      walk(p, out)
    } else if (/\.(tsx|ts)$/.test(ent.name)) out.push(p)
  }
  return out
}

const files = ROOTS.flatMap((r) => walk(r)).map((p) => p.replace(/\\/g, "/"))

/** Extract opening-tag attribute text for each <Tag ...> occurrence. */
function openingAttrs(content, tag) {
  const results = []
  const startRe = new RegExp(`<${tag}\\b`, "g")
  let m
  while ((m = startRe.exec(content))) {
    let i = m.index + m[0].length
    let brace = 0
    let quote = null
    while (i < content.length) {
      const ch = content[i]
      if (quote) {
        if (ch === "\\") {
          i += 2
          continue
        }
        if (ch === quote) quote = null
        i++
        continue
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        quote = ch
        i++
        continue
      }
      if (ch === "{") {
        brace++
        i++
        continue
      }
      if (ch === "}") {
        brace = Math.max(0, brace - 1)
        i++
        continue
      }
      if (brace === 0 && ch === ">") {
        const attrs = content.slice(m.index + m[0].length, i)
        const line = content.slice(0, m.index).split(/\n/).length
        results.push({ attrs, line })
        break
      }
      i++
    }
  }
  return results
}

function attrsHaveDoor(attrs, door) {
  return new RegExp(`(^|[\\s{/])${door}\\s*=`).test(attrs)
}

function fileImportsHouseAtom(content, atomPath, importHint) {
  // rough: import from path containing atom folder
  const needle = atomPath.replace(/^\//, "").replace(/\/$/, "")
  if (content.includes(needle)) return true
  if (importHint && new RegExp(`from\\s+['\"][^'\"]*${importHint}`).test(content)) return true
  // barrel imports: hard to prove; for Chip/Button/Avatar aliases we require path hint
  if (importHint) {
    // also @/components/atoms/... or similar
    if (content.includes(`/atoms/`) && content.includes(importHint.split("/").pop())) return true
  }
  return !importHint // for unique tags like Typography, Logo — accept all
}

const report = {}
for (const t of targets) {
  report[t.key] = {}
  for (const door of t.doors) {
    const consumers = []
    for (const file of files) {
      if (file.includes(t.atomPath)) continue
      const content = fs.readFileSync(file, "utf8")
      if (t.importHint && !fileImportsHouseAtom(content, t.atomPath, t.importHint)) {
        // still scan unique tags without importHint
      }
      const hits = []
      for (const tag of t.tags) {
        for (const open of openingAttrs(content, tag)) {
          if (attrsHaveDoor(open.attrs, door)) hits.push({ tag, line: open.line })
        }
      }
      if (!hits.length) continue
      // For aliased generic names, require import evidence
      if (t.importHint) {
        const hasImport =
          content.includes(t.atomPath.replace(/^\//, "")) ||
          content.includes("atoms/buttons/Button") ||
          content.includes("atoms/chips/Chip") ||
          content.includes("atoms/display/Avatar") ||
          /from\s+['"][^'"]*ButtonBase['"]/.test(content) ||
          /from\s+['"][^'"]*ChipBase['"]/.test(content) ||
          /from\s+['"][^'"]*AvatarBase['"]/.test(content) ||
          /from\s+['"]@\/components\/atoms\/(buttons\/Button|chips\/Chip|display\/Avatar)/.test(content) ||
          /from\s+['"]@sb-components\/atoms\/(buttons\/Button|chips\/Chip|display\/Avatar)/.test(content)
        // weaker: named import of Chip/Button/Avatar from house barrels
        const weak =
          /import\s*\{[^}]*\b(Button|Chip|Avatar)\b[^}]*\}\s*from\s*['"][^'"]*components\/atoms/.test(content) ||
          /import\s*\{[^}]*\b(Button|Chip|Avatar)\b[^}]*\}\s*from\s*['"]@\/components\/atoms/.test(content)
        if (!hasImport && !weak) continue
      }
      consumers.push({ file, inManifest: manifestSet.has(file), hits: hits.slice(0, 10) })
    }
    const out = consumers.filter((c) => !c.inManifest)
    report[t.key][door] = {
      consumers: consumers.length,
      actionable: out.length === 0,
      outOfManifest: out.map((c) => ({ file: c.file, hits: c.hits })),
      inManifest: consumers.filter((c) => c.inManifest).map((c) => ({ file: c.file, hits: c.hits })),
    }
  }
}

fs.writeFileSync(
  "./.artifacts/fe-refactor-audit/_b32-agent1-consumer-scan4.json",
  JSON.stringify(report, null, 2),
)

console.log("ACTIONABLE:")
for (const [k, doors] of Object.entries(report)) {
  for (const [d, info] of Object.entries(doors)) {
    if (info.actionable) console.log(`  ${k}.${d} consumers=${info.consumers}`)
  }
}
console.log("\nHELD:")
for (const [k, doors] of Object.entries(report)) {
  for (const [d, info] of Object.entries(doors)) {
    if (!info.actionable) {
      console.log(`  ${k}.${d} out=${info.outOfManifest.length}`)
      for (const c of info.outOfManifest.slice(0, 8)) {
        console.log(`    ${c.file}:${c.hits.map((h) => h.line).join(",")}`)
      }
    }
  }
}
