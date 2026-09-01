import fs from "node:fs"
import path from "node:path"

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, acc)
    else if (/\.(tsx|ts)$/.test(ent.name)) acc.push(p)
  }
  return acc
}

const roots = [
  ".storybook/components/nivo",
  ".storybook/components/nivoexpert",
  ".storybook/components/mia-mia",
]
const houseImportRe =
  /from\s+["']@sb-components\/atoms\/buttons\/Button/

const hits = []
for (const root of roots) {
  for (const abs of walk(root)) {
    const text = fs.readFileSync(abs, "utf8")
    if (!houseImportRe.test(text)) continue
    const lines = text.split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
      if (!/<(Button|ButtonBase)\b/.test(lines[i])) continue
      const openAttrs = lines
        .slice(i, Math.min(lines.length, i + 15))
        .join("\n")
        .match(/^[\s\S]*?<(?:Button|ButtonBase)\b([\s\S]*?)(?:\/>|>)/)
      if (!openAttrs) continue
      const cn = openAttrs[1].match(
        /classNames?\s*=\s*(\{[\s\S]*?\}|"[^"]*"|'[^']*')/,
      )
      if (!cn) continue
      hits.push({
        file: abs.replace(/\\/g, "/").replace(/^.*?starci-academy\//, ""),
        line: i + 1,
        prop: cn[0].replace(/\s+/g, " ").slice(0, 120),
      })
    }
  }
}
console.log(JSON.stringify(hits, null, 2))
console.log("forbiddenHits", hits.length)
