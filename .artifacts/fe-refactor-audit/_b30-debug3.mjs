import fs from "node:fs"

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
      // Skip line comments so `>` inside them cannot close the tag,
      // and so we don't confuse attribute scanning.
      if (depth === 0 && ch === "/" && src[i + 1] === "/") {
        tag += src[i + 1]
        i++
        while (i + 1 < src.length && src[i + 1] !== "\n") {
          i++
          tag += src[i]
        }
        continue
      }
      // Arrow `=>` — the `>` is not a tag closer.
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

const src = fs.readFileSync("src/components/blocks/feedback/ReadinessChecklist/index.tsx", "utf8")
const opens = extractOpens(src, "ListRow")
console.log("opens", opens.length, "tagLen", opens[0]?.tag.length)
console.log("className", propValue(opens[0].tag, "className"))
console.log("ends", JSON.stringify(opens[0].tag.slice(-30)))
