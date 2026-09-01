/**
 * BATCH 30 — brace-aware open-tag consumer scan.
 * Only attributes at brace-depth 0 count; skip // comments; ignore `=>` greater-thans.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")

const TARGETS = [
  "TierCardBase",
  "ListRow",
  "ButtonGroup",
  "ButtonGroup.Separator",
  "ButtonGroupRoot",
  "ButtonGroupSeparator",
  "TabsCard",
  "LeaderboardListCard",
  "SidebarNavItem",
  "LabeledList",
  "SectionCard",
]

function walk(dir, acc = []) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return acc
  }
  for (const e of entries) {
    if (["node_modules", ".git", ".next", "dist", ".artifacts"].includes(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, acc)
    else if (/\.(tsx|ts)$/.test(e.name)) acc.push(p)
  }
  return acc
}

function extractOpens(src, component) {
  const hits = []
  const re = new RegExp(`<${component.replace(/\./g, "\\.")}\\b`, "g")
  let m
  while ((m = re.exec(src))) {
    const start = m.index
    let i = start + m[0].length
    let depth = 0
    let quote = null
    let tag = m[0]
    for (; i < src.length; i++) {
      const ch = src[i]
      tag += ch
      if (quote) {
        if (ch === "\\" && quote !== "`") {
          if (i + 1 < src.length) tag += src[++i]
          continue
        }
        if (ch === quote) quote = null
        continue
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        quote = ch
        continue
      }
      if (ch === "{") {
        depth++
        continue
      }
      if (ch === "}") {
        depth = Math.max(0, depth - 1)
        continue
      }
      if (depth === 0 && ch === "/" && src[i + 1] === "/") {
        tag += src[i + 1]
        i++
        while (i + 1 < src.length && src[i + 1] !== "\n") {
          i++
          tag += src[i]
        }
        continue
      }
      if (ch === ">" && tag.endsWith("=>")) continue
      if (depth === 0 && ch === ">") break
    }
    hits.push({ line: src.slice(0, start).split(/\n/).length, tag })
  }
  return hits
}

function propValue(tag, prop) {
  let i = 1
  while (i < tag.length && /[\w.]/.test(tag[i])) i++
  let depth = 0
  let quote = null
  while (i < tag.length) {
    const ch = tag[i]
    if (quote) {
      if (ch === "\\" && quote !== "`") {
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
    if (depth === 0 && ch === "/" && tag[i + 1] === "/") {
      i += 2
      while (i < tag.length && tag[i] !== "\n") i++
      continue
    }
    if (ch === "{") {
      depth++
      i++
      continue
    }
    if (ch === "}") {
      depth = Math.max(0, depth - 1)
      i++
      continue
    }
    if (depth === 0) {
      const rest = tag.slice(i)
      const named = new RegExp(`^${prop}\\s*=\\s*`)
      const m = named.exec(rest)
      if (m) {
        i += m[0].length
        if (tag[i] === '"' || tag[i] === "'") {
          const q = tag[i]
          let j = i + 1
          let out = ""
          while (j < tag.length && tag[j] !== q) out += tag[j++]
          return { kind: "string", value: out }
        }
        if (tag[i] === "{") {
          let d = 0
          let j = i
          for (; j < tag.length; j++) {
            if (tag[j] === "{") d++
            else if (tag[j] === "}") {
              d--
              if (d === 0) {
                j++
                break
              }
            }
          }
          return { kind: "expr", value: tag.slice(i + 1, j - 1).trim() }
        }
        return null
      }
    }
    i++
  }
  return null
}

function normalize(value) {
  let v = String(value || "").replace(/\s+/g, " ").trim()
  const cn = /^cn\((.*)\)$/s.exec(v)
  if (cn) v = cn[1]
  if (/^[A-Za-z_$][\w$]*$/.test(v)) return v
  const strs = [...v.matchAll(/["'`]([^"'`]+)["'`]/g)].map((x) => x[1])
  if (strs.length) {
    if (/\?/.test(v)) return strs.join(" | ")
    return strs.join(" ")
  }
  return v
}

console.log("Walking…")
const files = [...walk(path.join(ROOT, "src")), ...walk(path.join(ROOT, ".storybook"))]
const results = {}

for (const name of TARGETS) {
  const consumers = []
  for (const abs of files) {
    const src = fs.readFileSync(abs, "utf8")
    if (!src.includes(`<${name.split(".")[0]}`)) continue
    const rel = path.relative(ROOT, abs).replace(/\\/g, "/")
    for (const open of extractOpens(src, name)) {
      const className = propValue(open.tag, "className")
      const classNames = propValue(open.tag, "classNames")
      if (!className && !classNames) continue
      const raw = className || classNames
      consumers.push({
        file: rel,
        line: open.line,
        prop: className ? "className" : "classNames",
        kind: raw.kind,
        value: raw.value,
        normalized: normalize(raw.value),
        snippet: open.tag.replace(/\s+/g, " ").slice(0, 280),
      })
    }
  }
  results[name] = {
    consumerCount: consumers.length,
    valueSet: [...new Set(consumers.map((c) => c.normalized))],
    consumers,
  }
}

fs.writeFileSync(path.join(ART, "2026-08-09-b30-consumer-scan.json"), JSON.stringify(results, null, 2) + "\n")

for (const [name, data] of Object.entries(results)) {
  console.log(`\n## ${name} (${data.consumerCount})`)
  console.log("values:", JSON.stringify(data.valueSet))
  for (const c of data.consumers) {
    console.log(`  ${c.file}:${c.line} ${c.prop}=${JSON.stringify(c.normalized)}`)
  }
}
