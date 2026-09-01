import fs from "fs"

const eslint = JSON.parse(
  fs.readFileSync("./.artifacts/fe-refactor-audit/2026-08-10-b35-eslint-before.json", "utf8"),
)
const m = JSON.parse(
  fs.readFileSync("./.artifacts/fe-refactor-audit/2026-08-10-b35-manifests.json", "utf8"),
)
const slice = m.manifests["pages-and-filing"]
const files = new Set(slice.files.map((f) => f.replaceAll("\\", "/")))
const locked = new Set(slice.lockedHolds.map((h) => h.path.replaceAll("\\", "/")))

const toRel = (fp) =>
  fp.replaceAll("\\", "/").replace(/^.*starci-academy\//i, "")

const byRule = {}
const byFile = {}
let total = 0
let lockedTotal = 0
let matched = 0

for (const r of eslint) {
  const rel = toRel(r.filePath || "")
  if (!files.has(rel)) continue
  matched++
  const isLocked = locked.has(rel)
  for (const msg of r.messages || []) {
    if (!msg.ruleId || !msg.ruleId.startsWith("starci-fe/")) continue
    total++
    if (isLocked) lockedTotal++
    byRule[msg.ruleId] = (byRule[msg.ruleId] || 0) + 1
    if (!byFile[rel]) byFile[rel] = { total: 0, rules: {}, locked: isLocked }
    byFile[rel].total++
    byFile[rel].rules[msg.ruleId] = (byFile[rel].rules[msg.ruleId] || 0) + 1
  }
}

console.log("matched", matched, "msgs", total, "lockedMsgs", lockedTotal)
console.log(
  Object.entries(byRule)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k.replace("starci-fe/", "")}: ${v}`)
    .join("\n"),
)

const extras = Object.entries(byFile).filter(
  ([, v]) => v.rules["starci-fe/page-folder-two-files-only"],
)
console.log(
  "\npage-two",
  extras.length,
  "unlocked",
  extras.filter(([, v]) => !v.locked).length,
)

const byPage = {}
for (const [f, v] of extras) {
  if (v.locked) continue
  const mm = f.match(/src\/components\/pages\/([^/]+)/)
  const page = mm ? mm[1] : f
  byPage[page] = (byPage[page] || 0) + 1
}
console.log(
  "by top page",
  Object.entries(byPage).sort((a, b) => b[1] - a[1]),
)

// Hold family prefixes from brief
const holdPrefixes = [
  "src/components/pages/MockInterviewPage/MockInterviewSession",
  "src/components/pages/FlashcardsPage/QuizSession",
  "src/components/pages/LandingPage/LearnLoopScroll",
]

const isProductHold = (f) =>
  holdPrefixes.some((p) => f === p || f.startsWith(p + "/") || f.startsWith(p + ".")) ||
  /MockInterviewSession|QuizSession|LearnLoopScroll/.test(f)

const burnableExtras = extras.filter(([f, v]) => !v.locked && !isProductHold(f))
console.log("\nburnable page-two (excl product-hold families)", burnableExtras.length)

// List leaf extras that are helpers (not nested component folders with only index)
const helperish = burnableExtras.filter(([f]) => {
  const rest = f.replace(/^src\/components\/pages\/[^/]+\//, "")
  return (
    !rest.endsWith("/index.tsx") &&
    !rest.endsWith("/component.tsx") &&
    rest !== "index.tsx" &&
    rest !== "component.tsx"
  )
})
console.log("\nhelperish extras (non index/component under page):", helperish.length)
for (const [f] of helperish.slice(0, 80)) console.log(" ", f)

// Nested component folders (rest like Foo/index.tsx or Foo/Bar/index.tsx)
const nested = burnableExtras.filter(([f]) => {
  const rest = f.replace(/^src\/components\/pages\/[^/]+\//, "")
  return rest.includes("/") && (rest.endsWith("/index.tsx") || rest.endsWith("/component.tsx"))
})
console.log("\nnested component files (page-two):", nested.length)

fs.writeFileSync(
  "./.artifacts/_b35-a9-scan-out.json",
  JSON.stringify(
    {
      matched,
      total,
      lockedTotal,
      byRule,
      pageTwoCount: extras.length,
      burnableExtras: burnableExtras.map(([f, v]) => ({ f, ...v })),
      helperish: helperish.map(([f]) => f),
      nestedSample: nested.slice(0, 100).map(([f]) => f),
    },
    null,
    2,
  ),
)
console.log("\nwrote .artifacts/_b35-a9-scan-out.json")
