import fs from "node:fs"
import path from "node:path"

const m = JSON.parse(
  fs.readFileSync(
    ".artifacts/fe-refactor-audit/2026-08-10-b33-manifests.json",
    "utf8",
  ),
)
const files = m.manifests["agent-1-button"].files
const results = []

for (const f of files) {
  const t = fs.readFileSync(f, "utf8")
  const hits = []
  const rx = /<(Button(?:Group|Base)?)\b([\s\S]*?)(?:\/>|>)/g
  let match
  while ((match = rx.exec(t))) {
    const tag = match[1]
    const attrs = match[2]
    const cn = attrs.match(/classNames?\s*=\s*(\{[\s\S]*?\}|"[^"]*"|'[^']*')/)
    if (cn) {
      hits.push({
        tag,
        classProp: cn[0].replace(/\s+/g, " ").slice(0, 160),
        line: t.slice(0, match.index).split("\n").length,
      })
    }
  }
  if (hits.length) results.push({ f, hits })
}

console.log(JSON.stringify(results, null, 2))
console.log("filesWithHits", results.length)

// Also inventory AllowedClassName tokens used
const tokens = new Map()
for (const { f, hits } of results) {
  for (const h of hits) {
    const arr = [...h.classProp.matchAll(/["']([a-z0-9:./\[\]%-]+)["']/g)].map(
      (x) => x[1],
    )
    for (const tok of arr) {
      if (tok === "classNames" || tok === "className") continue
      tokens.set(tok, (tokens.get(tok) || 0) + 1)
    }
  }
}
console.log("tokenFreq", Object.fromEntries([...tokens.entries()].sort((a, b) => b[1] - a[1])))
