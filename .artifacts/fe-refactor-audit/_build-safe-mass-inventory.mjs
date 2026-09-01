/**
 * BATCH 11 Phase 0 — SAFE MASS-BURN inventory (no product edits).
 * Classification: safe | hold | vendor | ambiguous
 * Only `safe` findings are candidate work for workers.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const raw = JSON.parse(
  fs.readFileSync(path.join(ART, "2026-08-08-safe-mass-eslint-raw.json"), "utf8"),
)

const norm = (p) => p.replace(/\\/g, "/")
const rel = (abs) => {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"), n.indexOf("/plugins/"))
  return i >= 0 ? n.slice(i + 1) : n.replace(/^.*starci-academy\//, "")
}

const LOCKED_RE = [
  /\/BlockAnatomy\b/i,
  /\/MockInterviewSession\b/,
  /\/QuizSession\b/,
  /\/LearnLoopScroll\b/,
  /\/ContentAiChat\b/,
  /\/ArchitectureScene\b/,
  /\/nivo\//i,
  /\/nivoexpert\//i,
  /\/[Mm]ia-[Mm]ia\//,
  /\/resources\//,
]
const isLocked = (p) => LOCKED_RE.some((r) => r.test("/" + norm(p)))

/** Explicit hard holds from batch contract */
const HARD_HOLD_PATHS = [
  "src/components/atoms/chips/Chip/ChipBase.tsx",
  ".storybook/components/atoms/chips/Chip/ChipBase.tsx",
]

const SAFE_AUTHORING = new Set([
  "starci-fe/require-export-jsdoc",
  "starci-fe/prefer-arrow-export",
  "starci-fe/handler-on-prefix",
  "starci-fe/no-inline-parameter-type",
  "starci-fe/no-emoji-in-source",
  "starci-fe/no-vietnamese-in-source-authoring",
  "starci-fe/export-matches-folder",
  "starci-fe/no-runtime-namespace",
])

const SAFE_STRUCTURAL = new Set([
  "starci-fe/require-identity-root",
  "starci-fe/no-heroui-outside-vocabulary",
  "starci-fe/no-per-part-classname-prop",
])

const HOLD_RULES = new Set([
  "starci-fe/require-frame-self-declare",
  "starci-fe/page-folder-two-files-only",
  "starci-fe/no-helper-folder-in-components",
  "starci-fe/no-parallel-skeleton",
  "starci-fe/no-skeleton-twin-component",
  "starci-fe/no-inline-skeleton-branch",
  "starci-fe/no-raw-shape-at-sentence-tier",
  "starci-fe/no-cn-above-vocabulary",
  "starci-fe/no-classname-at-sentence-tier",
  "starci-fe/no-retired-async-content",
  "starci-fe/no-arbitrary-token",
  "starci-fe/no-hardcoded-user-text-in-vocabulary",
  "starci-fe/no-hero-heading-class",
  "starci-fe/no-identity-wrapper-div",
])

function classify(rule, message, filePath) {
  const p = norm(filePath).replace(/^\.\//, "")
  if (isLocked(p)) return "hold" // locked treated as hold for this batch
  if (HARD_HOLD_PATHS.includes(p)) return "hold"
  if (String(rule || "").startsWith("jsx-a11y/")) return "hold"
  const msg = String(message || "")

  // handleSide false-positive
  if (rule === "starci-fe/handler-on-prefix" && /handleSide/i.test(msg + p)) return "hold"

  if (rule === "starci-fe/no-heroui-outside-vocabulary") {
    if (/\/atoms\//.test(p) || /\/vocabulary\//.test(p)) return "vendor"
    // Product accidental wrappers → safe (worker must verify identical API)
    return "safe"
  }

  if (rule === "starci-fe/require-identity-root") {
    if (/unclear|inner|wrapper|arbitrary|host/i.test(msg)) return "ambiguous"
    return "safe" // worker still verifies declared root
  }

  if (rule === "starci-fe/no-per-part-classname-prop") {
    if (/ChipBase|dotClassName/i.test(p + msg)) return "hold"
    return "safe" // only when unused / no consumer
  }

  if (rule === "starci-fe/require-frame-self-declare") {
    if (/neither|missing both/i.test(msg)) return "ambiguous"
    return "ambiguous" // never invent; explain-only still out of this batch scope
  }

  if (SAFE_AUTHORING.has(rule)) return "safe"
  if (SAFE_STRUCTURAL.has(rule)) return "safe"
  if (HOLD_RULES.has(rule)) return "hold"
  if (String(rule || "").startsWith("starci-fe/")) return "ambiguous"
  return "hold"
}

function partitionFor(fp) {
  const p = norm(fp).replace(/^\.\//, "")
  if (isLocked(p)) return "HOLD-LOCKED"

  if (
    p.startsWith("src/components/atoms/") ||
    p.startsWith(".storybook/components/atoms/") ||
    p.startsWith(".storybook/stories/atoms/")
  ) {
    return "atoms"
  }

  if (
    p.startsWith("src/components/composites/") ||
    p.startsWith(".storybook/components/composites/") ||
    p.startsWith("src/components/frames/") ||
    p.startsWith(".storybook/components/frames/") ||
    p.startsWith(".storybook/stories/composites/") ||
    p.startsWith(".storybook/stories/frames/")
  ) {
    return "composites-frames"
  }

  const isBlock =
    p.startsWith("src/components/blocks/") ||
    p.startsWith(".storybook/components/blocks/") ||
    p.startsWith(".storybook/stories/blocks/") ||
    p.startsWith("src/components/starci/blocks/") ||
    p.startsWith(".storybook/components/starci/blocks/")

  if (isBlock) {
    if (
      /\/(learn|commerce|dashboard|profile|cv|marketing|stats|async|cards|forms|feed|community|league|course|flashcard|practice|submission|roadmap|wallet)\//i.test(
        "/" + p,
      )
    ) {
      return "blocks-domain"
    }
    return "blocks-layout"
  }

  if (p.startsWith("src/components/overlays/") || p.startsWith(".storybook/components/overlays/")) {
    return "blocks-layout"
  }

  const isPage =
    p.startsWith("src/components/pages/") ||
    p.startsWith(".storybook/components/pages/") ||
    p.startsWith(".storybook/stories/pages/")

  if (isPage) {
    if (
      /\/(Learn|Learning|Flashcard|Practice|Course|Commerce|Cart|Checkout|Order|Pricing|Subscription|ContentPage|ContentArticle)/i.test(
        "/" + p,
      ) ||
      /\/(learn|flashcard|practice|course|commerce|cart|checkout)\//i.test("/" + p)
    ) {
      return "pages-learning-commerce"
    }
    return "pages-profile-dashboard"
  }

  if (
    p.startsWith("src/app/") ||
    p.startsWith("src/modules/") ||
    p.startsWith("src/hooks/") ||
    p.startsWith("src/redux/") ||
    p.startsWith("src/providers/") ||
    p.startsWith("src/i18n/") ||
    p.startsWith("src/messages/") ||
    p.startsWith("src/lib/") ||
    p.startsWith("src/utils/") ||
    p.startsWith("src/types/")
  ) {
    return "app-modules-utils"
  }

  if (p.startsWith(".storybook/")) return "storybook-only"
  return "app-modules-utils"
}

function twinOf(p) {
  const n = norm(p)
  if (n.startsWith(".storybook/components/")) return n.replace(/^\.storybook\//, "src/")
  if (n.startsWith("src/components/")) return n.replace(/^src\//, ".storybook/")
  return null
}

const byRule = {}
const byClass = {}
let starciFeMessages = 0
let a11yUntouched = 0
let lockedPathMessages = 0
const fileMap = new Map()

for (const f of raw) {
  const absolutePath = norm(f.filePath)
  const filePath = rel(absolutePath)
  for (const m of f.messages || []) {
    const rule = m.ruleId || "(other)"
    if (String(rule).startsWith("jsx-a11y/")) {
      a11yUntouched++
      continue
    }
    if (!String(rule).startsWith("starci-fe/")) continue

    starciFeMessages++
    byRule[rule] = (byRule[rule] || 0) + 1
    const classification = classify(rule, m.message, filePath)
    byClass[classification] = (byClass[classification] || 0) + 1
    if (isLocked(filePath)) lockedPathMessages++

    if (!fileMap.has(filePath)) {
      fileMap.set(filePath, {
        path: filePath,
        absolutePath,
        partition: partitionFor(filePath),
        messageCount: 0,
        byClass: {},
        rules: new Set(),
        messages: [],
        twin: twinOf(filePath),
        twinExists: false,
      })
    }
    const entry = fileMap.get(filePath)
    // Re-lock partition if locked
    if (isLocked(filePath)) entry.partition = "HOLD-LOCKED"
    entry.messageCount++
    entry.byClass[classification] = (entry.byClass[classification] || 0) + 1
    entry.rules.add(rule)
    entry.messages.push({
      rule,
      line: m.line,
      column: m.column,
      message: m.message,
      severity: m.severity,
      classification,
    })
  }
}

for (const entry of fileMap.values()) {
  if (entry.twin) entry.twinExists = fs.existsSync(path.join(ROOT, entry.twin))
}

// storybook-only refinement
for (const entry of fileMap.values()) {
  if (!entry.path.startsWith(".storybook/")) continue
  if (
    entry.path.startsWith(".storybook/components/atoms/") ||
    entry.path.startsWith(".storybook/components/composites/") ||
    entry.path.startsWith(".storybook/components/frames/") ||
    entry.path.startsWith(".storybook/components/blocks/") ||
    entry.path.startsWith(".storybook/components/pages/") ||
    entry.path.startsWith(".storybook/components/starci/") ||
    entry.path.startsWith(".storybook/components/overlays/")
  ) {
    continue
  }
  if (entry.partition !== "storybook-only" && entry.partition !== "HOLD-LOCKED") {
    entry.partition = "storybook-only"
  }
}

const rebuilt = {}
const ensure = (name) => {
  if (!rebuilt[name]) {
    rebuilt[name] = {
      fileCount: 0,
      messageCount: 0,
      byClass: {},
      ruleCounts: {},
      safeFileCount: 0,
      files: [],
    }
  }
  return rebuilt[name]
}

for (const entry of fileMap.values()) {
  const b = ensure(entry.partition)
  b.fileCount++
  b.messageCount += entry.messageCount
  for (const [c, n] of Object.entries(entry.byClass)) b.byClass[c] = (b.byClass[c] || 0) + n
  for (const r of entry.rules) {
    b.ruleCounts[r] = (b.ruleCounts[r] || 0) + entry.messages.filter((m) => m.rule === r).length
  }
  const safeMsgs = entry.messages.filter((m) => m.classification === "safe")
  const fileOut = {
    path: entry.path,
    absolutePath: entry.absolutePath,
    messageCount: entry.messageCount,
    byClass: entry.byClass,
    rules: [...entry.rules],
    twin: entry.twin,
    twinExists: entry.twinExists,
    safeCount: safeMsgs.length,
    messages: entry.messages,
  }
  if (safeMsgs.length > 0) b.safeFileCount++
  b.files.push(fileOut)
}

for (const b of Object.values(rebuilt)) {
  b.files.sort((a, c) => c.safeCount - a.safeCount || a.path.localeCompare(c.path))
}

const inventory = {
  generatedAt: new Date().toISOString(),
  batch: 11,
  title: "SAFE MASS-BURN ONLY",
  head: "d1d71459",
  priorBatch: "2026-08-08-deferred-burn (BATCH 10, uncommitted)",
  totals: {
    starciFeMessages,
    a11yUntouched,
    lockedPathMessages,
    byClassification: byClass,
  },
  byRule,
  allowedWork: [
    "vocabulary redirects / approved substitutions",
    "public-export JSDoc + English authoring",
    "mechanical type/import/export with proven consumers",
    "identity root only on clear declared roots",
    "HeroUI layout wrappers → existing atoms (identical API)",
    "remove unused per-part classname (non-vendor, no consumers)",
  ],
  hardHolds: [
    "a11y / ChipBase API / handleSide / teacher holds / Nivo / locked paths",
    "missing-both frame principles / page-folder / parallel skeleton",
    "raw-shape without existing honest principle",
    "vendor HeroUI compounds / fake tokens / eslint-disable / git ops",
  ],
  partitions: rebuilt,
}

fs.writeFileSync(path.join(ART, "2026-08-08-safe-mass-inventory.json"), JSON.stringify(inventory, null, 2))

const lines = []
lines.push("# SAFE MASS-BURN — inventory 2026-08-08 (BATCH 11)")
lines.push("")
lines.push("HEAD: `d1d71459`. Fresh ESLint: `2026-08-08-safe-mass-eslint-raw.json`.")
lines.push("Prior: BATCH 10 deferred burn still uncommitted in working tree.")
lines.push("")
lines.push("## Totals")
lines.push("")
lines.push("| Metric | Count |")
lines.push("|---|---:|")
lines.push(`| starci-fe messages | ${starciFeMessages} |`)
lines.push(`| a11y (untouched) | ${a11yUntouched} |`)
lines.push(`| locked-path messages | ${lockedPathMessages} |`)
lines.push("")
lines.push("### By classification")
lines.push("")
lines.push("| Classification | Count |")
lines.push("|---|---:|")
for (const [k, v] of Object.entries(byClass).sort((a, b) => b[1] - a[1])) {
  lines.push(`| \`${k}\` | ${v} |`)
}
lines.push("")
lines.push("## By rule")
lines.push("")
lines.push("| Rule | Count |")
lines.push("|---|---:|")
for (const [k, v] of Object.entries(byRule).sort((a, b) => b[1] - a[1])) {
  lines.push(`| \`${k}\` | ${v} |`)
}
lines.push("")
lines.push("## Allowed / hard holds")
lines.push("")
lines.push("**Allowed:** " + inventory.allowedWork.join("; ") + ".")
lines.push("")
lines.push("**Hard holds:** " + inventory.hardHolds.join("; ") + ".")
lines.push("")
lines.push("## Partitions")
lines.push("")
for (const [name, meta] of Object.entries(rebuilt).sort((a, b) => b[1].safeFileCount - a[1].safeFileCount)) {
  lines.push(`### \`${name}\``)
  lines.push("")
  lines.push(
    `- files: **${meta.fileCount}** · messages: **${meta.messageCount}** · safe-candidate files: **${meta.safeFileCount}**`,
  )
  const top = Object.entries(meta.ruleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([r, c]) => `\`${r.replace("starci-fe/", "")}(${c})\``)
    .join(", ")
  lines.push(`- top rules: ${top}`)
  const cls = Object.entries(meta.byClass)
    .sort((a, b) => b[1] - a[1])
    .map(([r, c]) => `\`${r}(${c})\``)
    .join(", ")
  lines.push(`- by class: ${cls}`)
  lines.push("")
}
fs.writeFileSync(path.join(ART, "2026-08-08-safe-mass-inventory.md"), lines.join("\n"))

const PARTITION_NAMES = [
  "atoms",
  "composites-frames",
  "blocks-layout",
  "blocks-domain",
  "pages-learning-commerce",
  "pages-profile-dashboard",
  "app-modules-utils",
  "storybook-only",
]

const AUTHORING_ONLY = new Set([...SAFE_AUTHORING])

for (const name of PARTITION_NAMES) {
  const meta = rebuilt[name]
  if (!meta || meta.safeFileCount === 0) {
    console.log("empty-or-no-safe", name, meta ? meta.fileCount : 0)
    // still write empty manifest for clarity
    fs.writeFileSync(
      path.join(ART, `2026-08-08-safe-mass-manifest-${name}.json`),
      JSON.stringify(
        {
          partition: name,
          generatedAt: new Date().toISOString(),
          fileCount: 0,
          files: [],
          note: "No safe-candidate files — skip worker",
        },
        null,
        2,
      ),
    )
    continue
  }

  const MAX = name === "app-modules-utils" ? 50 : 40
  let candidates = meta.files.filter((f) => f.safeCount > 0)

  // app-modules-utils: authoring only
  if (name === "app-modules-utils") {
    candidates = candidates
      .map((f) => {
        const msgs = f.messages.filter((m) => m.classification === "safe" && AUTHORING_ONLY.has(m.rule))
        return {
          ...f,
          safeCount: msgs.length,
          safeRules: [...new Set(msgs.map((m) => m.rule))],
          messages: f.messages,
        }
      })
      .filter((f) => f.safeCount > 0)
  }

  const selected = []
  const selectedSet = new Set()
  const add = (f) => {
    if (!f || selectedSet.has(f.path)) return
    selectedSet.add(f.path)
    selected.push(f)
  }
  for (const f of candidates) {
    if (selected.length >= MAX) break
    add(f)
    if (f.twin && f.twinExists) {
      const twin = meta.files.find((x) => x.path === f.twin)
      if (twin) add(twin)
    }
  }

  const manifest = {
    partition: name,
    generatedAt: new Date().toISOString(),
    batch: 11,
    fileCount: selected.length,
    totalPartitionFiles: meta.fileCount,
    totalSafeFiles: meta.safeFileCount,
    capped: meta.safeFileCount > selected.length,
    allowedClassifications: ["safe"],
    holdClassifications: ["hold", "vendor", "ambiguous"],
    allowedWork: inventory.allowedWork,
    hardHolds: inventory.hardHolds,
    files: selected.map((f) => ({
      path: f.path,
      absolutePath: f.absolutePath,
      twin: f.twin,
      twinExists: f.twinExists,
      safeCount: f.safeCount,
      messageCount: f.messageCount,
      byClass: f.byClass,
      safeRules: [
        ...new Set(f.messages.filter((m) => m.classification === "safe").map((m) => m.rule)),
      ],
      holdRules: [
        ...new Set(f.messages.filter((m) => m.classification !== "safe").map((m) => m.rule)),
      ],
      messages: f.messages,
    })),
  }
  fs.writeFileSync(path.join(ART, `2026-08-08-safe-mass-manifest-${name}.json`), JSON.stringify(manifest, null, 2))
  console.log(name, "selected", selected.length, "/", meta.safeFileCount, "safeFiles", "msgs", meta.messageCount)
}

// overlap check
const seen = new Map()
const overlaps = []
for (const name of PARTITION_NAMES) {
  const m = JSON.parse(fs.readFileSync(path.join(ART, `2026-08-08-safe-mass-manifest-${name}.json`), "utf8"))
  for (const f of m.files || []) {
    if (seen.has(f.path)) overlaps.push({ file: f.path, a: seen.get(f.path), b: name })
    else seen.set(f.path, name)
  }
}

console.log(
  JSON.stringify(
    {
      starciFeMessages,
      a11yUntouched,
      byClass,
      overlaps: overlaps.length,
      manifestFiles: seen.size,
      partitions: Object.fromEntries(
        Object.entries(rebuilt).map(([k, v]) => [k, { files: v.fileCount, safe: v.safeFileCount, msgs: v.messageCount }]),
      ),
    },
    null,
    2,
  ),
)
if (overlaps.length) console.log("OVERLAPS", overlaps)
