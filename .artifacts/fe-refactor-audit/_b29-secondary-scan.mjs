/**
 * B29 secondary candidate scan — evidence only; hold unless finite.
 */
import fs from "node:fs"
import path from "node:path"

function walk(dir, acc = []) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return acc
  }
  for (const e of entries) {
    if (e.name === "node_modules" || e.name === ".git" || e.name === ".next") continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, acc)
    else if (/\.(tsx|ts)$/.test(e.name)) acc.push(p)
  }
  return acc
}

function extract(src, name) {
  const re = new RegExp(`<${name}\\b`, "g")
  const hits = []
  let m
  while ((m = re.exec(src))) {
    let i = m.index + m[0].length
    let depth = 0
    let quote = null
    let tag = m[0]
    for (; i < src.length; i++) {
      const ch = src[i]
      tag += ch
      if (quote) {
        if (ch === quote) quote = null
        continue
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        quote = ch
        continue
      }
      if (ch === "{") depth++
      else if (ch === "}") depth = Math.max(0, depth - 1)
      else if (depth === 0 && ch === ">") break
    }
    if (/\bclassName\s*=/.test(tag) || /\bclassNames\s*=/.test(tag)) {
      hits.push(tag.replace(/\s+/g, " ").slice(0, 200))
    }
  }
  return hits
}

const files = [...walk("src"), ...walk(".storybook")]
const names = [
  "SectionCard",
  "TierCardBase",
  "LeaderboardListCard",
  "LabeledList",
  "ListRow",
  "SidebarNavItem",
  "TabsCard",
  "ButtonGroup",
]
const out = {}
for (const name of names) {
  const consumers = []
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8")
    if (!src.includes(`<${name}`)) continue
    for (const tag of extract(src, name)) {
      consumers.push({
        file: path.relative(".", f).replace(/\\/g, "/"),
        snippet: tag,
      })
    }
  }
  out[name] = consumers
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-09-b29-secondary-scan.json",
  JSON.stringify(out, null, 2) + "\n",
)
for (const [k, v] of Object.entries(out)) {
  console.log(k, v.length)
  for (const c of v.slice(0, 3)) console.log(" ", c.file, c.snippet)
}
