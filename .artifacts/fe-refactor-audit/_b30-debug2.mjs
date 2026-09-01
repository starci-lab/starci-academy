import fs from "node:fs"
const src = fs.readFileSync("src/components/blocks/feedback/ReadinessChecklist/index.tsx", "utf8")
const start = src.indexOf("<ListRow")
let i = start + "<ListRow".length
let depth = 0
let quote = null
let tag = "<ListRow"
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
  if (depth === 0 && ch === ">") {
    console.log("STOP at index", i, "depth", depth)
    console.log("context", JSON.stringify(src.slice(i - 50, i + 20)))
    break
  }
}
console.log("tag length", tag.length)
console.log("ends with", JSON.stringify(tag.slice(-80)))
