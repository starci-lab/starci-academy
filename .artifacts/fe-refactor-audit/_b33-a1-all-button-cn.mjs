import fs from "node:fs"
import path from "node:path"

const roots = [
  "src/components",
  ".storybook/components/starci",
  ".storybook/components/atoms",
  ".storybook/components/composites",
  ".storybook/components/frames",
  "src/components/atoms",
  "src/components/composites",
  "src/components/frames",
]

const houseImportRe =
  /from\s+["'](@\/components\/atoms\/buttons\/Button(?:\/[^"']*)?|@sb-components\/atoms\/buttons\/Button(?:\/[^"']*)?)["']/

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (ent.name === "nivo" || ent.name === "nivoexpert" || ent.name === "mia-mia") continue
      walk(p, acc)
    } else if (/\.(tsx|ts)$/.test(ent.name)) acc.push(p)
  }
  return acc
}

const hits = []
for (const root of roots) {
  for (const abs of walk(root)) {
    const text = fs.readFileSync(abs, "utf8")
    if (!houseImportRe.test(text) && !/ButtonBase/.test(text)) continue
    // skip definition
    if (/ButtonBase\.tsx$|buttons\/Button\/index\.tsx$|buttons\/Button\/Button\.tsx$/.test(abs.replace(/\\/g, "/"))) {
      // still check if it's the decl
    }
    const lines = text.split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
      if (!/<(Button|ButtonBase)\b/.test(lines[i])) continue
      const window = lines.slice(i, Math.min(lines.length, i + 15)).join("\n")
      // stop at next JSX open of different component roughly
      const cn = window.match(/classNames?\s*=\s*(\{[\s\S]*?\}|"[^"]*"|'[^']*')/)
      if (!cn) continue
      // ensure it's on the Button open, not a nested child — crude: className before next `<`
      const beforeNext = window.split(/<(?!\/)/)[0] + (window.match(/^[^<]*classNames?\s*=/) ? "" : "")
      const openAttrs = window.match(/^[\s\S]*?<(?:Button|ButtonBase)\b([\s\S]*?)(?:\/>|>)/)
      if (!openAttrs) continue
      const attrs = openAttrs[1]
      const cn2 = attrs.match(/classNames?\s*=\s*(\{[\s\S]*?\}|"[^"]*"|'[^']*')/)
      if (!cn2) continue
      hits.push({
        file: abs.replace(/\\/g, "/").replace(/^.*?starci-academy\//, ""),
        line: i + 1,
        prop: cn2[0].replace(/\s+/g, " ").slice(0, 160),
      })
    }
  }
}

console.log(JSON.stringify(hits, null, 2))
console.log("count", hits.length)

// classify forbidden
const forbidden = hits.filter((h) => /\/(nivo|nivoexpert|mia-mia)\//.test(h.file))
const starci = hits.filter((h) => !/\/(nivo|nivoexpert|mia-mia)\//.test(h.file))
console.log("starci", starci.length, "forbidden", forbidden.length)
