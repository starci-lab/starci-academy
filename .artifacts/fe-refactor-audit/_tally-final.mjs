import { readFileSync } from "node:fs"

const base = JSON.parse(readFileSync(".artifacts/fe-refactor-audit/eslint-arch-burn-baseline.json", "utf8"))
const after = JSON.parse(readFileSync(".artifacts/fe-refactor-audit/eslint-arch-burn-final.json", "utf8"))

const ARCH = [
  "require-frame-self-declare",
  "require-identity-root",
  "no-identity-wrapper-div",
  "no-raw-shape-at-sentence-tier",
  "no-heroui-outside-vocabulary",
  "no-cn-above-vocabulary",
  "no-classname-at-sentence-tier",
  "no-per-part-classname-prop",
  "no-inline-skeleton-branch",
  "no-parallel-skeleton",
  "no-skeleton-twin-component",
  "page-folder-two-files-only",
  "no-helper-folder-in-components",
  "export-matches-folder",
  "indent",
  "no-inline-parameter-type",
  "no-emoji-in-source",
  "no-vietnamese-in-source-authoring",
  "handler-on-prefix",
  "prefer-arrow-export",
]

function tally(results) {
  const m = {}
  let total = 0
  for (const f of results) {
    for (const msg of f.messages || []) {
      const r = (msg.ruleId || "").replace(/^starci-fe\//, "")
      m[r] = (m[r] || 0) + 1
      total++
    }
  }
  return { m, total, files: results.length }
}

const b = tally(base)
const a = tally(after)
console.log("TOTAL", b.total, "->", a.total, "delta", a.total - b.total)
for (const r of ARCH) {
  const bv = b.m[r] || 0
  const av = a.m[r] || 0
  if (bv || av) {
    const d = av - bv
    console.log(r.padEnd(40), String(bv).padStart(5), "->", String(av).padStart(5), (d >= 0 ? "+" : "") + d)
  }
}
