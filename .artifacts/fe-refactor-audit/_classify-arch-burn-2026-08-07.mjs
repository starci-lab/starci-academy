/**
 * Phase 1 classifier — architectural ESLint burn (2026-08-07).
 * Scan only. Writes JSON used by the markdown report.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

const ROOT = process.cwd()
const product = JSON.parse(
  readFileSync(resolve(ROOT, ".artifacts/fe-refactor-audit/eslint-arch-burn-baseline.json"), "utf8"),
)
const ledger = JSON.parse(readFileSync(resolve(ROOT, ".claude/fe/decision-ledger.json"), "utf8"))

const ARCH = [
  "starci-fe/require-frame-self-declare",
  "starci-fe/require-identity-root",
  "starci-fe/no-identity-wrapper-div",
  "starci-fe/no-raw-shape-at-sentence-tier",
  "starci-fe/no-heroui-outside-vocabulary",
  "starci-fe/no-cn-above-vocabulary",
  "starci-fe/no-classname-at-sentence-tier",
  "starci-fe/no-per-part-classname-prop",
  "starci-fe/no-parallel-skeleton",
  "starci-fe/no-inline-skeleton-branch",
  "starci-fe/no-skeleton-twin-component",
  "starci-fe/no-retired-async-content",
  "starci-fe/page-folder-two-files-only",
  "starci-fe/no-helper-folder-in-components",
  "starci-fe/export-matches-folder",
]
const ARCH_SET = new Set(ARCH)
const A11Y = /^jsx-a11y\//

const LOCKED = [
  /\/\.storybook\/utils\/BlockAnatomy\//,
  /\/MockInterviewPage\/MockInterviewSession\//,
  /\/FlashcardsPage\/QuizSession\//,
  /\/LandingPage\/LearnLoopScroll\//,
  /\/blocks\/learn\/ContentAiChat\//,
  /\/blocks\/marketing\/ArchitectureScene\//,
  /\/\.storybook\/components\/nivo\//i,
  /\/\.storybook\/components\/nivoexpert\//i,
  /\/src\/resources\//,
  /MiaMia|mia-mia/i,
]

const OVERLAP_CLUSTER = new Set([
  "starci-fe/no-classname-at-sentence-tier",
  "starci-fe/no-cn-above-vocabulary",
  "starci-fe/no-raw-shape-at-sentence-tier",
  "starci-fe/no-heroui-outside-vocabulary",
  "starci-fe/no-per-part-classname-prop",
  "starci-fe/require-frame-self-declare",
  "starci-fe/require-identity-root",
  "starci-fe/no-identity-wrapper-div",
])

const holdPaths = new Map()
for (const d of ledger.decisions || []) {
  if (d.status !== "open") continue
  for (const p of d.paths || (d.path ? [d.path] : [])) {
    holdPaths.set(String(p).replace(/\\/g, "/"), d.id)
  }
}

const rel = (p) => p.replace(/\\/g, "/").replace(/^.*?starci-academy\//, "")

const isLocked = (f) => LOCKED.some((re) => re.test(f))
const holdId = (f) => {
  const n = f.replace(/\\/g, "/")
  for (const [hp, id] of holdPaths) {
    if (n === hp || n.endsWith(hp) || n.includes(hp) || n.startsWith(hp + "/")) return id
  }
  return null
}

function tierOf(file) {
  const f = file.replace(/\\/g, "/")
  const m = f.match(/\/(?:src|\.storybook)\/components\/([^/]+)\//)
  if (m) return m[1]
  if (f.includes("/.storybook/stories/")) return "stories"
  if (f.includes("/.storybook/")) return "storybook-extra"
  if (f.includes("/src/app/")) return "app-route"
  return "other"
}

function classify(file, rule, message) {
  if (A11Y.test(rule || "")) return { class: "out-of-scope-a11y", note: "jsx-a11y excluded" }
  if (!ARCH_SET.has(rule)) return { class: "skip-authoring", note: "authoring pass already done — leave" }
  if (isLocked(file)) return { class: "hard-case", note: "locked path — do not edit" }
  const hid = holdId(file)
  if (hid) return { class: "teacher-hold", note: `ledger:${hid}` }

  // frame-self-declare message kinds
  if (rule === "starci-fe/require-frame-self-declare") {
    if (/neither/i.test(message)) return { class: "confirmed", note: "missing principle+explain — only fix if token is inferable from gap/pad; else promote to hard-case at repair time" }
    if (/no `explain`|but no `explain`/i.test(message)) return { class: "confirmed", note: "explain-only — safe if principle already valid" }
    if (/no `principle`/i.test(message)) return { class: "confirmed", note: "has explain, missing principle — infer token or hard-case" }
  }

  if (rule === "starci-fe/require-identity-root") {
    return { class: "confirmed", note: "add identity on clear single root frame/composite; host div roots → hard-case at repair" }
  }
  if (rule === "starci-fe/no-identity-wrapper-div") {
    return { class: "confirmed", note: "replace data-tier wrapper with identity prop on root" }
  }
  if (rule === "starci-fe/no-retired-async-content") {
    return { class: "hard-case", note: "prior burn: API mismatch blocks↔composites — leave unless mechanical twin exists" }
  }
  if (rule === "starci-fe/page-folder-two-files-only" || rule === "starci-fe/no-helper-folder-in-components") {
    return { class: "confirmed", note: "structural move — high import risk; inspect before move" }
  }
  if (
    rule === "starci-fe/no-raw-shape-at-sentence-tier" ||
    rule === "starci-fe/no-cn-above-vocabulary" ||
    rule === "starci-fe/no-classname-at-sentence-tier" ||
    rule === "starci-fe/no-heroui-outside-vocabulary" ||
    rule === "starci-fe/no-per-part-classname-prop"
  ) {
    return { class: "confirmed", note: "tier boundary — move decision to owning atom/composite/frame; overlap likely" }
  }
  if (
    rule === "starci-fe/no-parallel-skeleton" ||
    rule === "starci-fe/no-inline-skeleton-branch" ||
    rule === "starci-fe/no-skeleton-twin-component"
  ) {
    return { class: "confirmed", note: "thread isSkeleton; skip primitives under blocks/skeleton and atoms" }
  }
  if (rule === "starci-fe/export-matches-folder") {
    return { class: "confirmed", note: "add matching named export alias when safe" }
  }
  return { class: "confirmed", note: "architectural" }
}

const findings = []
for (const file of product) {
  const fileRel = rel(file.filePath)
  for (const m of file.messages || []) {
    const rule = m.ruleId || "(other)"
    const c = classify(fileRel, rule, m.message || "")
    findings.push({
      file: fileRel,
      line: m.line,
      column: m.column,
      rule,
      severity: m.severity,
      message: m.message,
      tier: tierOf(fileRel),
      classification: c.class,
      note: c.note,
    })
  }
}

// overlap mark
const byLoc = new Map()
for (const f of findings) {
  const k = `${f.file}:${f.line}`
  if (!byLoc.has(k)) byLoc.set(k, [])
  byLoc.get(k).push(f)
}
let overlapMarked = 0
for (const [, arr] of byLoc) {
  const cluster = arr.filter((a) => OVERLAP_CLUSTER.has(a.rule) && a.classification === "confirmed")
  if (cluster.length < 2) continue
  let kept = false
  for (const f of cluster) {
    if (!kept) {
      kept = true
      f.note = `${f.note}; primary in overlap cluster`
      continue
    }
    f.classification = "overlap"
    f.note = "same line — fix once with primary"
    overlapMarked++
  }
}

const archFindings = findings.filter((f) => ARCH_SET.has(f.rule))
const byRule = {}
const byClass = {}
const byTier = {}
for (const f of archFindings) {
  byRule[f.rule] = (byRule[f.rule] || 0) + 1
  byClass[f.classification] = (byClass[f.classification] || 0) + 1
  byTier[f.tier] = (byTier[f.tier] || 0) + 1
}

// frame-self-declare message split
const frameKinds = { missingBoth: 0, noExplain: 0, noPrinciple: 0, other: 0 }
for (const f of archFindings.filter((x) => x.rule === "starci-fe/require-frame-self-declare")) {
  const msg = f.message || ""
  if (/neither/i.test(msg)) frameKinds.missingBoth++
  else if (/no `explain`|but no `explain`/i.test(msg)) frameKinds.noExplain++
  else if (/no `principle`/i.test(msg)) frameKinds.noPrinciple++
  else frameKinds.other++
}

// identity-root path buckets
const identityBuckets = {}
for (const f of archFindings.filter((x) => x.rule === "starci-fe/require-identity-root")) {
  identityBuckets[f.tier] = (identityBuckets[f.tier] || 0) + 1
}

const topFiles = {}
for (const f of archFindings) {
  if (f.classification === "out-of-scope-a11y" || f.classification === "skip-authoring") continue
  topFiles[f.file] = (topFiles[f.file] || 0) + 1
}

const out = {
  generated: "2026-08-07",
  productTotal: findings.length,
  archTotal: archFindings.length,
  a11y: findings.filter((f) => A11Y.test(f.rule)).length,
  error: findings.filter((f) => f.severity === 2),
  byRule: Object.fromEntries(Object.entries(byRule).sort((a, b) => b[1] - a[1])),
  byClass,
  byTier: Object.fromEntries(Object.entries(byTier).sort((a, b) => b[1] - a[1])),
  frameKinds,
  identityBuckets,
  overlapMarked,
  overlapLocations: [...byLoc.values()].filter((a) => new Set(a.map((x) => x.rule)).size > 1).length,
  topFiles: Object.entries(topFiles)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([file, n]) => ({ file, n, tier: tierOf(file), locked: isLocked(file), hold: holdId(file) })),
  samples: {
    confirmed: archFindings.filter((f) => f.classification === "confirmed").slice(0, 50),
    hardCase: archFindings.filter((f) => f.classification === "hard-case").slice(0, 40),
    teacherHold: archFindings.filter((f) => f.classification === "teacher-hold").slice(0, 30),
    overlap: archFindings.filter((f) => f.classification === "overlap").slice(0, 30),
    identityWrapper: archFindings.filter((f) => f.rule === "starci-fe/no-identity-wrapper-div"),
  },
}

writeFileSync(
  resolve(ROOT, ".artifacts/fe-refactor-audit/2026-08-07-architectural-burn-classify.json"),
  JSON.stringify(out, null, 2),
)
console.log(
  JSON.stringify(
    {
      archTotal: out.archTotal,
      byClass,
      frameKinds,
      identityBuckets,
      byRuleTop: Object.entries(byRule).slice(0, 20),
      overlapMarked,
      error: out.error.map((e) => `${e.file}:${e.line} ${e.rule}`),
    },
    null,
    2,
  ),
)
