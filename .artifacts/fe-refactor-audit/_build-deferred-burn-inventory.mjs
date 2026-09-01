/**
 * BATCH 10 Phase 0 — fresh deferred-debt inventory (no product edits).
 * Classifies starci-fe findings and partitions by disjoint ownership.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const raw = JSON.parse(
  fs.readFileSync(path.join(ART, "2026-08-08-deferred-burn-eslint-raw.json"), "utf8"),
)
const ledger = JSON.parse(
  fs.readFileSync(path.join(ROOT, ".claude/fe/decision-ledger.json"), "utf8"),
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

const isLocked = (p) => LOCKED_RE.some((r) => r.test(norm(p)))

/** Teacher-held paths from ledger (active pattern / teacher holds). */
const teacherPaths = new Set()
for (const e of ledger.entries || ledger.decisions || []) {
  const p = e.path || e.file || e.target
  if (!p || typeof p !== "string") continue
  const status = String(e.status || e.resolution || e.state || "").toLowerCase()
  if (status.includes("superseded") || status.includes("resolved") || status.includes("closed")) {
    continue
  }
  const kind = String(e.kind || e.type || e.category || e.id || "").toLowerCase()
  const summary = String(e.summary || e.note || e.reason || "").toLowerCase()
  if (
    kind.includes("teacher") ||
    kind.includes("pattern") ||
    summary.includes("teacher hold") ||
    summary.includes("pattern-coverage") ||
    e.hold === true ||
    String(e.id || "").includes("hold")
  ) {
    teacherPaths.add(norm(p).replace(/^\.\//, ""))
  }
}

// Also pull known pattern-hold paths from recent audit artifact if present
const patternInv = path.join(ART, "pattern-seam-inventory.json")
if (fs.existsSync(patternInv)) {
  try {
    const inv = JSON.parse(fs.readFileSync(patternInv, "utf8"))
    for (const s of inv.seams || inv.holds || inv.files || []) {
      const p = typeof s === "string" ? s : s.path || s.file
      if (p) teacherPaths.add(norm(p))
    }
  } catch {
    /* ignore */
  }
}

const isTeacher = (p) => {
  const n = norm(p)
  for (const t of teacherPaths) {
    if (n === t || n.startsWith(t + "/") || n.includes(t)) return true
  }
  return false
}

const SAFE_MECHANICAL = new Set([
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
  "starci-fe/no-inline-skeleton-branch",
  "starci-fe/no-raw-shape-at-sentence-tier",
  "starci-fe/no-classname-at-sentence-tier",
  "starci-fe/no-per-part-classname-prop",
  "starci-fe/no-heroui-outside-vocabulary",
  "starci-fe/no-cn-above-vocabulary",
  "starci-fe/require-frame-self-declare",
  "starci-fe/no-parallel-skeleton",
  "starci-fe/no-skeleton-twin-component",
  "starci-fe/page-folder-two-files-only",
  "starci-fe/no-helper-folder-in-components",
])

const SEMANTIC_HOLD = new Set([
  "starci-fe/no-retired-async-content",
  "starci-fe/no-arbitrary-token",
  "starci-fe/no-hardcoded-user-text-in-vocabulary",
  "starci-fe/no-hero-heading-class",
  "starci-fe/no-identity-wrapper-div",
])

/**
 * Classify one finding. Order: locked → teacher → a11y → message heuristics → rule sets.
 */
function classify(rule, message, filePath) {
  const p = norm(filePath)
  if (isLocked(p)) return "locked-path"
  if (isTeacher(p)) return "teacher-hold"
  if (String(rule || "").startsWith("jsx-a11y/")) return "semantic-hold"
  const msg = String(message || "")

  if (rule === "starci-fe/no-heroui-outside-vocabulary") {
    if (/vendor|HeroModal|HeroUI\.|@heroui.*compound|vocabulary boundary/i.test(msg + p)) {
      // Product-level accidental wrappers stay safe-structural; true atom vocabulary stays vendor
      if (/\/atoms\//.test(p) || /\/vocabulary\//.test(p)) return "vendor-hold"
    }
    if (/\/atoms\//.test(p)) return "vendor-hold"
  }

  if (rule === "starci-fe/require-frame-self-declare") {
    // Most missing-both messages say: declares neither `principle` nor `explain`
    if (/neither|missing both|invent|no existing principle token/i.test(msg)) {
      return "ambiguous"
    }
    if (/missing explain|add explain|explain only|only explain/i.test(msg)) {
      return "safe-structural"
    }
    return "ambiguous"
  }

  if (rule === "starci-fe/require-identity-root") {
    if (/unclear|inner|wrapper|arbitrary/i.test(msg)) return "ambiguous"
    return "safe-structural"
  }

  if (rule === "starci-fe/page-folder-two-files-only" || rule === "starci-fe/no-helper-folder-in-components") {
    return "semantic-hold" // mechanical only after importer proof — default hold
  }

  if (rule === "starci-fe/no-parallel-skeleton" || rule === "starci-fe/no-skeleton-twin-component") {
    return "semantic-hold"
  }

  if (rule === "starci-fe/no-inline-skeleton-branch") return "safe-structural"

  if (SAFE_MECHANICAL.has(rule)) return "safe-mechanical"
  if (SAFE_STRUCTURAL.has(rule)) return "safe-structural"
  if (SEMANTIC_HOLD.has(rule)) return "semantic-hold"
  if (String(rule || "").startsWith("starci-fe/")) return "ambiguous"
  return "semantic-hold"
}

/**
 * Disjoint partition ownership. First match wins. Twins share ownership via path shape.
 */
function partitionFor(fp) {
  // Normalize to slash path and strip leading ./ so prefixes match.
  const p = norm(fp).replace(/^\.\//, "")
  if (isLocked("/" + p) || isLocked(p)) return "HOLD-LOCKED"

  const inAtoms =
    p.startsWith("src/components/atoms/") ||
    p.startsWith(".storybook/components/atoms/") ||
    p.startsWith(".storybook/stories/atoms/")
  if (inAtoms) return "atoms-display-forms"

  const inCompositesFrames =
    p.startsWith("src/components/composites/") ||
    p.startsWith(".storybook/components/composites/") ||
    p.startsWith("src/components/frames/") ||
    p.startsWith(".storybook/components/frames/") ||
    p.startsWith(".storybook/stories/composites/") ||
    p.startsWith(".storybook/stories/frames/") ||
    /spacing-resolv|_principles\.ts$/.test(p)
  if (inCompositesFrames) return "composites-frames"

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

  if (
    p.startsWith("src/components/overlays/") ||
    p.startsWith(".storybook/components/overlays/")
  ) {
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

const partitions = {}
const ensure = (name) => {
  if (!partitions[name]) {
    partitions[name] = {
      fileCount: 0,
      messageCount: 0,
      byClass: {},
      ruleCounts: {},
      files: [],
    }
  }
  return partitions[name]
}

const fileMap = new Map() // path -> file entry

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
    if (classification === "locked-path") lockedPathMessages++

    const part = partitionFor(filePath)
    const bucket = ensure(part)
    bucket.messageCount++
    bucket.ruleCounts[rule] = (bucket.ruleCounts[rule] || 0) + 1
    bucket.byClass[classification] = (bucket.byClass[classification] || 0) + 1

    if (!fileMap.has(filePath)) {
      fileMap.set(filePath, {
        path: filePath,
        absolutePath,
        partition: part,
        messageCount: 0,
        byClass: {},
        rules: new Set(),
        messages: [],
        twin: twinOf(filePath),
        twinExists: false,
      })
    }
    const entry = fileMap.get(filePath)
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

// twinExists
for (const entry of fileMap.values()) {
  if (entry.twin) entry.twinExists = fs.existsSync(path.join(ROOT, entry.twin))
}

// storybook-only refinement: stories/config/utils without component twin ownership
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

// Rebuild partitions from fileMap for consistency after reassignment
const rebuilt = {}
const ensure2 = (name) => {
  if (!rebuilt[name]) {
    rebuilt[name] = {
      fileCount: 0,
      messageCount: 0,
      byClass: {},
      ruleCounts: {},
      candidateFileCount: 0,
      files: [],
    }
  }
  return rebuilt[name]
}

for (const entry of fileMap.values()) {
  const b = ensure2(entry.partition)
  b.fileCount++
  b.messageCount += entry.messageCount
  for (const [c, n] of Object.entries(entry.byClass)) {
    b.byClass[c] = (b.byClass[c] || 0) + n
  }
  for (const r of entry.rules) {
    const count = entry.messages.filter((m) => m.rule === r).length
    b.ruleCounts[r] = (b.ruleCounts[r] || 0) + count
  }
  const candidateMsgs = entry.messages.filter(
    (m) => m.classification === "safe-mechanical" || m.classification === "safe-structural",
  )
  const fileOut = {
    path: entry.path,
    absolutePath: entry.absolutePath,
    messageCount: entry.messageCount,
    byClass: entry.byClass,
    rules: [...entry.rules],
    twin: entry.twin,
    twinExists: entry.twinExists,
    candidateCount: candidateMsgs.length,
    messages: entry.messages,
  }
  if (candidateMsgs.length > 0) b.candidateFileCount++
  b.files.push(fileOut)
}

for (const b of Object.values(rebuilt)) {
  b.files.sort((a, c) => c.candidateCount - a.candidateCount || a.path.localeCompare(c.path))
}

const inventory = {
  generatedAt: new Date().toISOString(),
  checkpoint: "27127bb5",
  head: "d1d71459",
  totals: {
    starciFeMessages,
    a11yUntouched,
    lockedPathMessages,
    byClassification: byClass,
  },
  byRule,
  holdsRecorded: [
    "27 pattern-coverage teacher holds (audit:fe)",
    "Locked paths: BlockAnatomy, MockInterviewSession, QuizSession, LearnLoopScroll, ContentAiChat, ArchitectureScene, nivo/nivoexpert, Mia-Mia, src/resources",
    "missing-both require-frame-self-declare → ambiguous (no invented tokens)",
    "page-folder-two-files-only / helper-folder → semantic-hold unless mechanical + importer-proven",
    "parallel/twin skeleton → semantic-hold by default",
    "no-retired-async-content API mismatch → semantic-hold",
    "HeroUI vendor compounds at atom vocabulary → vendor-hold",
    "ragsourcegraph-data-tier-div-2026-08-07",
    "a11y out of scope",
  ],
  partitions: rebuilt,
}

fs.writeFileSync(path.join(ART, "2026-08-08-deferred-burn-inventory.json"), JSON.stringify(inventory, null, 2))

// Markdown summary
const lines = []
lines.push("# Deferred FE debt burn — inventory 2026-08-08")
lines.push("")
lines.push("Checkpoint: `27127bb5`. HEAD: `d1d71459`. Fresh ESLint JSON: `2026-08-08-deferred-burn-eslint-raw.json`.")
lines.push("")
lines.push("## Totals")
lines.push("")
lines.push("| Metric | Count |")
lines.push("|---|---:|")
lines.push(`| starci-fe messages | ${starciFeMessages} |`)
lines.push(`| a11y (untouched) | ${a11yUntouched} |`)
lines.push(`| messages on locked paths | ${lockedPathMessages} |`)
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
lines.push("## Holds (recorded before dispatch)")
lines.push("")
for (const h of inventory.holdsRecorded) lines.push(`- ${h}`)
lines.push("")
lines.push("## Partitions (disjoint file ownership)")
lines.push("")
for (const [name, meta] of Object.entries(rebuilt).sort((a, b) => b[1].messageCount - a[1].messageCount)) {
  lines.push(`### \`${name}\``)
  lines.push("")
  lines.push(
    `- files: **${meta.fileCount}** · messages: **${meta.messageCount}** · candidate files: **${meta.candidateFileCount}**`,
  )
  const top = Object.entries(meta.ruleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
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

fs.writeFileSync(path.join(ART, "2026-08-08-deferred-burn-inventory.md"), lines.join("\n"))

// Per-partition manifests (candidate files only for worker focus; includes holds for awareness)
const PARTITION_NAMES = [
  "atoms-display-forms",
  "composites-frames",
  "blocks-layout",
  "blocks-domain",
  "pages-learning-commerce",
  "pages-profile-dashboard",
  "app-modules-utils",
  "storybook-only",
]

for (const name of PARTITION_NAMES) {
  const meta = rebuilt[name]
  if (!meta) {
    console.log("empty", name)
    continue
  }
  // Cap large partitions: prefer candidate files, then high message count; include twin pairs
  const MAX = 45
  const candidates = meta.files.filter((f) => f.candidateCount > 0)
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
  // If still room and few candidates, add high-debt hold files for explicit hold recording (no edit)
  if (selected.length < 10) {
    for (const f of meta.files) {
      if (selected.length >= Math.min(MAX, 20)) break
      add(f)
    }
  }

  const manifest = {
    partition: name,
    generatedAt: new Date().toISOString(),
    checkpoint: "27127bb5",
    fileCount: selected.length,
    totalPartitionFiles: meta.fileCount,
    totalPartitionMessages: meta.messageCount,
    capped: meta.fileCount > selected.length,
    allowedClassifications: ["safe-mechanical", "safe-structural"],
    holdClassifications: ["semantic-hold", "vendor-hold", "teacher-hold", "locked-path", "ambiguous"],
    files: selected.map((f) => ({
      path: f.path,
      absolutePath: f.absolutePath,
      twin: f.twin,
      twinExists: f.twinExists,
      candidateCount: f.candidateCount,
      messageCount: f.messageCount,
      byClass: f.byClass,
      candidateRules: [
        ...new Set(
          f.messages
            .filter((m) => m.classification === "safe-mechanical" || m.classification === "safe-structural")
            .map((m) => m.rule),
        ),
      ],
      holdRules: [
        ...new Set(
          f.messages
            .filter((m) => !(m.classification === "safe-mechanical" || m.classification === "safe-structural"))
            .map((m) => m.rule),
        ),
      ],
      messages: f.messages,
    })),
  }
  fs.writeFileSync(path.join(ART, `2026-08-08-deferred-manifest-${name}.json`), JSON.stringify(manifest, null, 2))
  console.log(
    name,
    "selected",
    selected.length,
    "/",
    meta.fileCount,
    "msgs",
    meta.messageCount,
    "candidates",
    meta.candidateFileCount,
  )
}

console.log(
  JSON.stringify(
    {
      starciFeMessages,
      a11yUntouched,
      lockedPathMessages,
      byClass,
      partitions: Object.fromEntries(
        Object.entries(rebuilt).map(([k, v]) => [
          k,
          { files: v.fileCount, msgs: v.messageCount, candidates: v.candidateFileCount },
        ]),
      ),
    },
    null,
    2,
  ),
)
