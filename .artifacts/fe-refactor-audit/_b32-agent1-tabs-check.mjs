import fs from "fs"
import path from "path"

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

const files = [".storybook", "src"].flatMap((r) => walk(r)).map((p) => p.replace(/\\/g, "/"))
const hits = []
for (const file of files) {
  if (file.includes("/atoms/navigation/Tabs/")) continue
  const content = fs.readFileSync(file, "utf8")
  // house Tabs import evidence
  const house =
    /atoms\/navigation\/Tabs/.test(content) ||
    /from\s+['"][^'"]*TabsBase['"]/.test(content) ||
    /import\s*\{[^}]*\bTabs\b[^}]*\}\s*from\s*['"][^'"]*components\/atoms/.test(content) ||
    /import\s*\{[^}]*\bTabs\b[^}]*\}\s*from\s*['"]@\/components\/atoms/.test(content) ||
    /import\s*\{[^}]*\bTabs\b[^}]*\}\s*from\s*['"]@sb-components\/atoms/.test(content)
  if (!house) continue
  for (const tag of ["Tabs", "TabsBase"]) {
    for (const open of openingAttrs(content, tag)) {
      if (/(^|[\s{/])classNames\s*=/.test(open.attrs)) {
        hits.push(`${file}:${open.line}`)
      }
    }
  }
}
console.log(hits.length ? hits.join("\n") : "NONE")
