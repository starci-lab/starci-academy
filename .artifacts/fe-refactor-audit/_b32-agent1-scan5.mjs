import fs from "fs"
import path from "path"

const ROOTS = [".storybook", "src"]
const manifest = JSON.parse(
  fs.readFileSync("./.artifacts/fe-refactor-audit/2026-08-10-b32-manifests.json", "utf8"),
).agents["agent-1-atoms"]
const manifestSet = new Set(manifest.map((p) => p.replace(/\\/g, "/")))

const targets = [
  { key: "ProgressBar", tags: ["ProgressBar"], doors: ["classNames"], atomPath: "/atoms/display/Progress" },
  { key: "ProgressCircle", tags: ["ProgressCircle"], doors: ["classNames"], atomPath: "/atoms/display/Progress" },
  { key: "ProgressGauge", tags: ["ProgressGauge"], doors: ["classNames"], atomPath: "/atoms/display/Progress" },
  { key: "ProgressMeter", tags: ["ProgressMeter"], doors: ["classNames"], atomPath: "/atoms/display/Progress" },
  { key: "Progress.Bar", tags: ["Progress.Bar"], doors: ["classNames"], atomPath: "/atoms/display/Progress" },
  { key: "IconTile", tags: ["IconTile"], doors: ["classNames"], atomPath: "/atoms/display/IconTile" },
  { key: "Accordion", tags: ["Accordion"], doors: ["classNames"], atomPath: "/atoms/navigation/Accordion" },
  { key: "Badge", tags: ["Badge"], doors: ["classNames"], atomPath: "/atoms/display/Badge" },
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

function openingAttrs(content, tag) {
  const results = []
  const escaped = tag.replace(/\./g, "\\.")
  const startRe = new RegExp(`<${escaped}\\b`, "g")
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
        results.push({
          attrs: content.slice(m.index + m[0].length, i),
          line: content.slice(0, m.index).split(/\n/).length,
        })
        break
      }
      i++
    }
  }
  return results
}

for (const t of targets) {
  for (const door of t.doors) {
    const consumers = []
    for (const file of files) {
      if (file.includes(t.atomPath)) continue
      const content = fs.readFileSync(file, "utf8")
      const hits = []
      for (const tag of t.tags) {
        for (const open of openingAttrs(content, tag)) {
          if (new RegExp(`(^|[\\s{/])${door}\\s*=`).test(open.attrs)) {
            hits.push(open.line)
          }
        }
      }
      if (hits.length) consumers.push({ file, inManifest: manifestSet.has(file), hits })
    }
    const out = consumers.filter((c) => !c.inManifest)
    console.log(
      `${t.key}.${door}: total=${consumers.length} out=${out.length} actionable=${out.length === 0}`,
    )
    for (const c of out.slice(0, 10)) console.log(`  OUT ${c.file}:${c.hits.join(",")}`)
    for (const c of consumers.filter((x) => x.inManifest).slice(0, 5))
      console.log(`  IN  ${c.file}:${c.hits.join(",")}`)
  }
}
