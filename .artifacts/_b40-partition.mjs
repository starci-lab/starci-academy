/**
 * B40 mass safe-burn — partition safe mechanical ESLint findings into
 * disjoint worker manifests. Does not edit product code.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const eslintPath = join(ROOT, ".artifacts/_b38-eslint-after.json")
const outDir = join(ROOT, ".artifacts/fe-refactor-audit")

const SAFE = new Set([
  "starci-fe/require-export-jsdoc",
  "starci-fe/no-inline-parameter-type",
  "starci-fe/handler-on-prefix",
  "starci-fe/prefer-arrow-export",
  "starci-fe/no-vietnamese-in-source-authoring",
  "starci-fe/require-identity-root",
  "starci-fe/require-frame-self-declare",
  "starci-fe/no-emoji-in-source",
])

const DIRTY = new Set([
  "src/components/blocks/feed/ActivityFeed/component.tsx",
  "src/components/blocks/learn/ChatToolResult/index.tsx",
  "src/components/blocks/learn/EntityResultRow/component.tsx",
  "src/components/blocks/learn/EntityResultRow/index.tsx",
  "src/components/blocks/learn/RelatedContentList/component.tsx",
  "src/components/overlays/drawers/MindMapNodeDrawer/component.tsx",
  "src/components/pages/ProfileOverviewPage/index.tsx",
  "src/components/blocks/profile/ProfileJobReadiness/index.tsx",
  "src/components/blocks/marketing/PitchCard/index.tsx",
])

const isForbidden = (file) => {
  const f = file.replace(/\\/g, "/")
  if (f.includes("/nivo/") || f.includes("/nivoexpert/") || f.includes("/mia-mia/")) return true
  if (f.includes("LandingPage/KnowledgeGraph")) return true
  if (f.includes("MockInterviewSession")) return true
  if (f.includes("LearnLoopScroll")) return true
  if (f.includes("ContentAiChat")) return true
  if (f.includes("QuizSession")) return true
  if (f.includes("links/options.ts")) return true
  return false
}

const rel = (p) => p.replace(/\\/g, "/").replace(/^.*starci-academy\//, "")

const report = JSON.parse(readFileSync(eslintPath, "utf8"))
const byFile = {}
let total = 0

for (const f of report) {
  const file = rel(f.filePath)
  if (isForbidden(file) || DIRTY.has(file)) continue
  if (!file.startsWith("src/") && !file.startsWith(".storybook/")) continue
  for (const m of f.messages || []) {
    if (!SAFE.has(m.ruleId) || m.severity === 2) continue
    total += 1
    if (!byFile[file]) byFile[file] = { count: 0, rules: {} }
    byFile[file].count += 1
    byFile[file].rules[m.ruleId] = (byFile[file].rules[m.ruleId] || 0) + 1
  }
}

const bucketOf = (file) => {
  const parts = file.split("/")
  if (file.startsWith("src/components/atoms/")) return "src-atoms"
  if (file.startsWith("src/components/frames/")) return "src-frames"
  if (file.startsWith("src/components/composites/")) return `src-composites-${parts[3] || "misc"}`
  if (file.startsWith("src/components/blocks/")) return `src-blocks-${parts[3] || "misc"}`
  if (file.startsWith("src/components/pages/")) return `src-pages-${parts[3] || "misc"}`
  if (file.startsWith("src/components/overlays/")) return "src-overlays"
  if (file.startsWith("src/components/layouts/")) return "src-layouts"
  if (file.startsWith(".storybook/components/atoms/")) return "sb-atoms"
  if (file.startsWith(".storybook/components/frames/")) return "sb-frames"
  if (file.startsWith(".storybook/components/composites/")) return `sb-composites-${parts[3] || "misc"}`
  if (file.startsWith(".storybook/components/starci/")) return "sb-starci"
  if (file.startsWith(".storybook/stories/")) return "sb-stories"
  return "other"
}

const buckets = {}
for (const [file, info] of Object.entries(byFile)) {
  const b = bucketOf(file)
  if (!buckets[b]) buckets[b] = { files: [], count: 0, rules: {} }
  buckets[b].files.push(file)
  buckets[b].count += info.count
  for (const [rule, n] of Object.entries(info.rules)) {
    buckets[b].rules[rule] = (buckets[b].rules[rule] || 0) + n
  }
}

const ranked = Object.entries(buckets).sort((a, b) => b[1].count - a[1].count)

/** Merge small buckets into ~16 worker partitions by size. */
const TARGET = 16
const workers = []
for (const [name, data] of ranked) {
  if (workers.length < TARGET) {
    workers.push({ name, files: [...data.files], count: data.count, rules: { ...data.rules }, sources: [name] })
    continue
  }
  // append to smallest
  workers.sort((a, b) => a.count - b.count)
  const w = workers[0]
  w.files.push(...data.files)
  w.count += data.count
  w.sources.push(name)
  for (const [rule, n] of Object.entries(data.rules)) w.rules[rule] = (w.rules[rule] || 0) + n
  // keep readable name for first/primary
}

workers.sort((a, b) => b.count - a.count)
// rename merged workers
const named = workers.map((w, i) => ({
  id: `w${String(i + 1).padStart(2, "0")}-${w.name.replace(/[^a-z0-9-]+/gi, "-").slice(0, 40)}`,
  primary: w.name,
  sources: w.sources,
  files: w.files.sort(),
  count: w.count,
  rules: w.rules,
}))

// overlap proof
const seen = new Map()
const overlaps = []
for (const w of named) {
  for (const f of w.files) {
    if (seen.has(f)) overlaps.push({ file: f, a: seen.get(f), b: w.id })
    else seen.set(f, w.id)
  }
}

const inventory = {
  batch: "B40",
  mode: "mass-safe-burn",
  checkpoint: "2a096210a",
  note: "Baseline ESLint JSON from B38 remasure (_b38-eslint-after.json). Safe mechanical rules only. Excludes dirty B38/B39 paths and locked trees.",
  safeRules: [...SAFE],
  safeFindings: total,
  safeFiles: Object.keys(byFile).length,
  workerCount: named.length,
  overlaps,
  dirtyExcluded: [...DIRTY],
  workers: named.map((w) => ({
    id: w.id,
    primary: w.primary,
    sources: w.sources,
    count: w.count,
    fileCount: w.files.length,
    rules: w.rules,
    owns: w.files,
  })),
}

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, "2026-08-10-b40-inventory.json"), JSON.stringify(inventory, null, 2))
writeFileSync(join(ROOT, ".artifacts/_b40-safe-buckets.json"), JSON.stringify({ ranked: ranked.map(([k, v]) => ({ k, count: v.count, files: v.files.length })), workers: named }, null, 2))
console.log(JSON.stringify({
  safeFindings: total,
  safeFiles: Object.keys(byFile).length,
  workers: named.map((w) => ({ id: w.id, count: w.count, files: w.files.length, sources: w.sources.length })),
  overlaps: overlaps.length,
}, null, 2))
