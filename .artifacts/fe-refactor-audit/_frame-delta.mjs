import { readFileSync, writeFileSync } from "node:fs"

const after = JSON.parse(readFileSync(".artifacts/fe-refactor-audit/eslint-arch-burn-after-restore.json", "utf8"))
const base = JSON.parse(readFileSync(".artifacts/fe-refactor-audit/eslint-arch-burn-baseline.json", "utf8"))

function frameSplit(results) {
  const out = { missingBoth: 0, missingExplain: 0, missingPrinciple: 0, other: 0, files: new Map() }
  for (const f of results) {
    for (const m of f.messages || []) {
      if (m.ruleId !== "starci-fe/require-frame-self-declare") continue
      const msg = m.message || ""
      let kind = "other"
      if (/neither/.test(msg)) kind = "missingBoth"
      else if (/missing `explain`|needs an `explain`|without `explain`|principle.*explain/i.test(msg) || /explain/.test(msg) && /principle/.test(msg) === false)
        kind = "missingExplain"
      else if (/explain/.test(msg) && !/neither/.test(msg)) kind = "missingExplain"
      else if (/principle/.test(msg) && !/neither/.test(msg)) kind = "missingPrinciple"
      out[kind]++
      const rel = f.filePath.replace(/\\/g, "/").split("starci-academy/")[1] || f.filePath
      out.files.set(rel, (out.files.get(rel) || 0) + 1)
    }
  }
  return out
}

// Better classification from message text samples
function sampleMessages(results, n = 8) {
  const samples = []
  for (const f of results) {
    for (const m of f.messages || []) {
      if (m.ruleId !== "starci-fe/require-frame-self-declare") continue
      samples.push(m.message)
      if (samples.length >= n) return samples
    }
  }
  return samples
}

const a = frameSplit(after)
const b = frameSplit(base)
console.log("BASE frame kinds", { missingBoth: b.missingBoth, missingExplain: b.missingExplain, missingPrinciple: b.missingPrinciple, other: b.other })
console.log("AFTER frame kinds", { missingBoth: a.missingBoth, missingExplain: a.missingExplain, missingPrinciple: a.missingPrinciple, other: a.other })
console.log("\nSAMPLE AFTER:")
for (const s of sampleMessages(after)) console.log("-", s.slice(0, 160))

// Count by neither vs explain-only more carefully
function classify(results) {
  let neither = 0, explainOnly = 0, other = 0
  for (const f of results) {
    for (const m of f.messages || []) {
      if (m.ruleId !== "starci-fe/require-frame-self-declare") continue
      const msg = m.message || ""
      if (msg.includes("neither `principle` nor `explain`")) neither++
      else if (msg.includes("`explain`")) explainOnly++
      else other++
    }
  }
  return { neither, explainOnly, other }
}
console.log("\nBASE", classify(base))
console.log("AFTER", classify(after))

writeFileSync(
  ".artifacts/fe-refactor-audit/_frame-delta-top.json",
  JSON.stringify(
    [...a.files.entries()]
      .map(([f, n]) => ({ f, after: n, base: b.files.get(f) || 0, d: n - (b.files.get(f) || 0) }))
      .filter((x) => x.d !== 0)
      .sort((x, y) => Math.abs(y.d) - Math.abs(x.d))
      .slice(0, 40),
    null,
    2,
  ),
)
