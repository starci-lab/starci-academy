/**
 * BATCH 12 Phase 0 — Consumer/API reconciliation inventory (no product edits).
 * Classifications: consumer-safe | twin-safe | export-safe | identity-safe |
 * vendor-hold | api-hold | teacher-hold | ambiguous
 */
import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const raw = JSON.parse(
  fs.readFileSync(path.join(ART, "2026-08-08-reconcile-eslint-raw.json"), "utf8"),
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

const HARD_API_HOLD = [
  "src/components/atoms/chips/Chip/ChipBase.tsx",
  ".storybook/components/atoms/chips/Chip/ChipBase.tsx",
]

const TEACHER_SNIPPETS = [
  "InputTags",
  "KnowledgeSection",
  "ModelsSection",
  "ToolsSection",
  "InvoiceDetailModal",
  "InvoiceList",
  "MyOrdersList",
  "UpgradeTierConfirmModal",
  "KpiTile",
  "DomainList",
  "ExpertSiteGenerate",
  "ExpertSiteLeads",
  "ExpertSiteLeadsPipeline",
  "LeadsInboxCard",
  "AuditCta",
  "DemoFlow",
  "HumanInTheLoop",
  "OperatingLoopVisual",
  "ProblemStatement",
  "ProductQuickSelector",
  "SolutionByIndustry",
  "SystemFlow",
  "SupportTicketList",
  "TicketThread",
  "WalletOverview",
]

const isTeacher = (p) => TEACHER_SNIPPETS.some((s) => norm(p).includes(s))

function twinOf(p) {
  const n = norm(p)
  if (n.startsWith(".storybook/components/")) return n.replace(/^\.storybook\//, "src/")
  if (n.startsWith("src/components/")) return n.replace(/^src\//, ".storybook/")
  return null
}

function classify(rule, message, filePath) {
  const p = norm(filePath).replace(/^\.\//, "")
  if (isLocked(p)) return "api-hold"
  if (HARD_API_HOLD.includes(p)) return "api-hold"
  if (isTeacher(p)) return "teacher-hold"
  if (String(rule || "").startsWith("jsx-a11y/")) return "api-hold"
  const msg = String(message || "")

  if (rule === "starci-fe/handler-on-prefix" && /handleSide/i.test(msg + p)) return "api-hold"

  if (rule === "starci-fe/require-frame-self-declare") {
    if (/neither|missing both/i.test(msg)) return "ambiguous"
    return "ambiguous"
  }

  if (
    rule === "starci-fe/page-folder-two-files-only" ||
    rule === "starci-fe/no-parallel-skeleton" ||
    rule === "starci-fe/no-skeleton-twin-component" ||
    rule === "starci-fe/no-inline-skeleton-branch" ||
    rule === "starci-fe/no-raw-shape-at-sentence-tier" ||
    rule === "starci-fe/no-cn-above-vocabulary" ||
    rule === "starci-fe/no-classname-at-sentence-tier" ||
    rule === "starci-fe/no-retired-async-content" ||
    rule === "starci-fe/no-arbitrary-token" ||
    rule === "starci-fe/no-hardcoded-user-text-in-vocabulary" ||
    rule === "starci-fe/no-hero-heading-class" ||
    rule === "starci-fe/no-identity-wrapper-div" ||
    rule === "starci-fe/no-helper-folder-in-components"
  ) {
    return "api-hold"
  }

  if (rule === "starci-fe/no-heroui-outside-vocabulary") {
    if (/\/atoms\//.test(p)) return "vendor-hold"
    // Candidate: only if worker finds identical atom — inventory marks consumer-safe
    return "consumer-safe"
  }

  if (rule === "starci-fe/require-identity-root") return "identity-safe"

  if (rule === "starci-fe/no-per-part-classname-prop") {
    if (/ChipBase|dotClassName/i.test(p + msg)) return "api-hold"
    // Consumer migration candidate
    return "consumer-safe"
  }

  if (
    rule === "starci-fe/export-matches-folder" ||
    rule === "starci-fe/no-runtime-namespace" ||
    rule === "starci-fe/prefer-arrow-export"
  ) {
    return "export-safe"
  }

  // leftover authoring — not this batch's focus; hold unless export-related
  if (
    rule === "starci-fe/require-export-jsdoc" ||
    rule === "starci-fe/no-vietnamese-in-source-authoring" ||
    rule === "starci-fe/no-emoji-in-source" ||
    rule === "starci-fe/no-inline-parameter-type" ||
    rule === "starci-fe/handler-on-prefix"
  ) {
    return "api-hold" // out of BATCH 12 primary scope
  }

  if (String(rule || "").startsWith("starci-fe/")) return "ambiguous"
  return "api-hold"
}

function pathBucket(p) {
  const n = norm(p).replace(/^\.\//, "")
  if (isLocked(n)) return "HOLD-LOCKED"
  if (
    n.startsWith("src/components/atoms/") ||
    n.startsWith(".storybook/components/atoms/") ||
    n.startsWith("src/components/composites/") ||
    n.startsWith(".storybook/components/composites/") ||
    n.startsWith("src/components/frames/") ||
    n.startsWith(".storybook/components/frames/")
  ) {
    return "atoms-composites"
  }
  if (
    n.startsWith("src/components/blocks/") ||
    n.startsWith(".storybook/components/blocks/") ||
    n.startsWith("src/components/starci/blocks/") ||
    n.startsWith(".storybook/components/starci/blocks/") ||
    n.startsWith("src/components/overlays/") ||
    n.startsWith(".storybook/components/overlays/")
  ) {
    return "blocks"
  }
  if (n.startsWith("src/components/pages/") || n.startsWith(".storybook/components/pages/")) {
    return "pages"
  }
  return "other"
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
        messageCount: 0,
        byClass: {},
        rules: new Set(),
        messages: [],
        twin: twinOf(filePath),
        twinExists: false,
        bucket: pathBucket(filePath),
      })
    }
    const entry = fileMap.get(filePath)
    if (isLocked(filePath)) entry.bucket = "HOLD-LOCKED"
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

/** Find importers of a symbol/path via ripgrep (best-effort). */
function findImporters(patterns, glob = "*.{ts,tsx}") {
  const hits = new Set()
  for (const pat of patterns) {
    try {
      const out = execSync(`rg -l --glob "${glob}" ${JSON.stringify(pat)} src .storybook`, {
        cwd: ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        shell: true,
      })
      for (const line of out.split(/\r?\n/).filter(Boolean)) {
        hits.add(norm(line).replace(/^\.\//, ""))
      }
    } catch {
      /* no matches */
    }
  }
  return [...hits]
}

// Known per-part consumer migration units from BATCH 11 holds
const PER_PART_UNITS = [
  {
    id: "DrawerShell-classNames",
    defs: [
      "src/components/composites/layout/DrawerShell/index.tsx",
      ".storybook/components/composites/layout/DrawerShell/DrawerShell.tsx",
    ],
    propHints: ["dialogClassName", "footerClassName"],
  },
  {
    id: "ModalShell-classNames",
    defs: [
      "src/components/composites/layout/ModalShell/index.tsx",
      ".storybook/components/composites/layout/ModalShell/ModalShell.tsx",
    ],
    propHints: ["containerClassName"],
  },
  {
    id: "SurfaceCard-contentClassName",
    defs: [
      "src/components/composites/cards/SurfaceCard/index.tsx",
      ".storybook/components/composites/cards/SurfaceCard/SurfaceCard.tsx",
    ],
    propHints: ["contentClassName"],
  },
  {
    id: "PDFView-heightClassName",
    defs: [
      "src/components/composites/viewers/PDFView/index.tsx",
      ".storybook/components/composites/viewers/PDFView/PDFView.tsx",
      "src/components/blocks/rendering/PDFView/index.tsx",
    ],
    propHints: ["heightClassName"],
  },
]

const consumerUnits = []
for (const unit of PER_PART_UNITS) {
  const existingDefs = unit.defs.filter((d) => fs.existsSync(path.join(ROOT, d)))
  const importers = findImporters(unit.propHints).filter(
    (p) => !existingDefs.includes(p) && !isLocked(p),
  )
  consumerUnits.push({ ...unit, defs: existingDefs, importers })
}

/**
 * Assign each file to exactly one reconcile partition (first match wins).
 * Twin pairs stay together under the same owner.
 */
function assignPartition(entry) {
  const p = entry.path
  if (entry.bucket === "HOLD-LOCKED") return "HOLD-LOCKED"

  const classes = entry.byClass
  const has = (c) => (classes[c] || 0) > 0

  // export-safe exclusive
  if (has("export-safe") && !has("consumer-safe") && !has("identity-safe") && !has("twin-safe")) {
    return "exports-and-barrels"
  }
  if (entry.rules.has("starci-fe/no-runtime-namespace") || entry.rules.has("starci-fe/export-matches-folder")) {
    return "exports-and-barrels"
  }

  // twin-safe: both sides exist and have safe-class findings → parity worker
  if (entry.twinExists && has("consumer-safe")) {
    const twin = fileMap.get(entry.twin)
    if (twin && (twin.byClass["consumer-safe"] || 0) > 0) {
      // Prefer path bucket for owner of the pair (src wins)
      if (p.startsWith("src/")) {
        if (entry.bucket === "atoms-composites") return "storybook-src-parity"
        if (entry.bucket === "blocks") return "storybook-src-parity"
        if (entry.bucket === "pages") return "storybook-src-parity"
      }
    }
  }

  // heroui-boundaries: heroui consumer-safe without identity as primary
  const herouiCount = entry.messages.filter(
    (m) => m.rule === "starci-fe/no-heroui-outside-vocabulary" && m.classification === "consumer-safe",
  ).length
  const identityCount = entry.messages.filter((m) => m.classification === "identity-safe").length
  const perPartCount = entry.messages.filter(
    (m) => m.rule === "starci-fe/no-per-part-classname-prop" && m.classification === "consumer-safe",
  ).length

  if (herouiCount > 0 && identityCount === 0 && perPartCount === 0) {
    return "heroui-boundaries"
  }

  if (identityCount > 0 && herouiCount === 0 && perPartCount === 0) {
    return "identity-safe-roots"
  }

  // consumer migrations by path
  if (perPartCount > 0 || has("consumer-safe")) {
    if (entry.bucket === "atoms-composites") return "atoms-composites-consumers"
    if (entry.bucket === "blocks") return "blocks-consumer-migrations"
    if (entry.bucket === "pages") return "pages-consumer-migrations"
  }

  if (identityCount > 0) return "identity-safe-roots"
  if (herouiCount > 0) return "heroui-boundaries"

  return "HOLD-OTHER"
}

// First pass assignments
for (const entry of fileMap.values()) {
  entry.partition = assignPartition(entry)
}

// Force twin co-ownership: if one twin assigned to a work partition, pull the other
for (const entry of fileMap.values()) {
  if (!entry.twin || !entry.twinExists) continue
  const twin = fileMap.get(entry.twin)
  if (!twin) continue
  const work = new Set([
    "atoms-composites-consumers",
    "blocks-consumer-migrations",
    "pages-consumer-migrations",
    "storybook-src-parity",
    "exports-and-barrels",
    "identity-safe-roots",
    "heroui-boundaries",
  ])
  if (work.has(entry.partition) && !work.has(twin.partition)) {
    twin.partition = entry.partition
  } else if (work.has(twin.partition) && !work.has(entry.partition)) {
    entry.partition = twin.partition
  } else if (work.has(entry.partition) && work.has(twin.partition) && entry.partition !== twin.partition) {
    // prefer src owner's partition
    const keep = entry.path.startsWith("src/") ? entry.partition : twin.partition
    entry.partition = keep
    twin.partition = keep
  }
}

// Attach consumer unit files into atoms-composites-consumers
const owned = new Map() // path -> partition
for (const entry of fileMap.values()) owned.set(entry.path, entry.partition)

for (const unit of consumerUnits) {
  for (const d of unit.defs) {
    if (fileMap.has(d)) {
      fileMap.get(d).partition = "atoms-composites-consumers"
      fileMap.get(d).consumerUnit = unit.id
    }
  }
  for (const imp of unit.importers) {
    // only pull importers that are not locked; force into same partition if they have findings OR create soft entry
    if (isLocked(imp)) continue
    if (fileMap.has(imp)) {
      const e = fileMap.get(imp)
      if (e.partition === "HOLD-OTHER" || e.partition === "HOLD-LOCKED" || e.bucket === "atoms-composites" || e.bucket === "blocks" || e.bucket === "pages") {
        // Prefer keeping page/block consumers with their migration partition if already assigned to a worker
        if (
          e.partition === "pages-consumer-migrations" ||
          e.partition === "blocks-consumer-migrations" ||
          e.partition === "heroui-boundaries" ||
          e.partition === "identity-safe-roots"
        ) {
          // leave — consumer rewrite happens in def's partition only if we also list importer there
        } else {
          e.partition = "atoms-composites-consumers"
        }
      }
      e.consumerUnit = unit.id
    }
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
      candidateFileCount: 0,
      files: [],
    }
  }
  return rebuilt[name]
}

const CANDIDATE = new Set(["consumer-safe", "twin-safe", "export-safe", "identity-safe"])

for (const entry of fileMap.values()) {
  const b = ensure(entry.partition)
  b.fileCount++
  b.messageCount += entry.messageCount
  for (const [c, n] of Object.entries(entry.byClass)) b.byClass[c] = (b.byClass[c] || 0) + n
  for (const r of entry.rules) {
    b.ruleCounts[r] = (b.ruleCounts[r] || 0) + entry.messages.filter((m) => m.rule === r).length
  }
  const cand = entry.messages.filter((m) => CANDIDATE.has(m.classification))
  const fileOut = {
    path: entry.path,
    absolutePath: entry.absolutePath,
    messageCount: entry.messageCount,
    byClass: entry.byClass,
    rules: [...entry.rules],
    twin: entry.twin,
    twinExists: entry.twinExists,
    candidateCount: cand.length,
    consumerUnit: entry.consumerUnit || null,
    messages: entry.messages,
  }
  if (cand.length > 0) b.candidateFileCount++
  b.files.push(fileOut)
}

for (const b of Object.values(rebuilt)) {
  b.files.sort((a, c) => c.candidateCount - a.candidateCount || a.path.localeCompare(c.path))
}

const inventory = {
  generatedAt: new Date().toISOString(),
  batch: 12,
  title: "Consumer/API reconciliation",
  checkpoint: "db1f7a11",
  head: "22f28f4e",
  totals: {
    starciFeMessages,
    a11yUntouched,
    lockedPathMessages,
    byClassification: byClass,
  },
  byRule,
  consumerUnits,
  hardHolds: [
    "ChipBase API / handleSide / non-identical twins",
    "missing-both principles / page-folder / parallel skeleton",
    "Nivo / locked / teacher holds / a11y",
    "new principle tokens / unproven public API renames",
  ],
  partitions: rebuilt,
}

fs.writeFileSync(path.join(ART, "2026-08-08-reconcile-inventory.json"), JSON.stringify(inventory, null, 2))

const lines = []
lines.push("# Consumer/API reconciliation — inventory 2026-08-08 (BATCH 12)")
lines.push("")
lines.push("Checkpoint: `db1f7a11`. HEAD: `22f28f4e`. Fresh ESLint: `2026-08-08-reconcile-eslint-raw.json`.")
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
lines.push("## Consumer units (per-part classname)")
lines.push("")
for (const u of consumerUnits) {
  lines.push(`- **${u.id}**: defs ${u.defs.length}, importers ${u.importers.length}`)
}
lines.push("")
lines.push("## Partitions")
lines.push("")
for (const [name, meta] of Object.entries(rebuilt).sort((a, b) => b[1].candidateFileCount - a[1].candidateFileCount)) {
  lines.push(`### \`${name}\``)
  lines.push("")
  lines.push(
    `- files: **${meta.fileCount}** · messages: **${meta.messageCount}** · candidate files: **${meta.candidateFileCount}**`,
  )
  const top = Object.entries(meta.ruleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([r, c]) => `\`${r.replace("starci-fe/", "")}(${c})\``)
    .join(", ")
  lines.push(`- top rules: ${top}`)
  const cls = Object.entries(meta.byClass || {})
    .sort((a, b) => b[1] - a[1])
    .map(([r, c]) => `\`${r}(${c})\``)
    .join(", ")
  lines.push(`- by class: ${cls}`)
  lines.push("")
}
fs.writeFileSync(path.join(ART, "2026-08-08-reconcile-inventory.md"), lines.join("\n"))

// Strict exclusive claim order — first partition to claim a file wins.
const CLAIM_ORDER = [
  "atoms-composites-consumers",
  "exports-and-barrels",
  "heroui-boundaries",
  "identity-safe-roots",
  "blocks-consumer-migrations",
  "pages-consumer-migrations",
  "storybook-src-parity",
]

const seen = new Map()
const overlaps = []

const MAX_FOR = {
  "atoms-composites-consumers": 50,
  "exports-and-barrels": 20,
  "heroui-boundaries": 35,
  "identity-safe-roots": 35,
  "blocks-consumer-migrations": 40,
  "pages-consumer-migrations": 40,
  "storybook-src-parity": 40,
}

function toManifestFile(f, extra = {}) {
  return {
    path: f.path,
    absolutePath: f.absolutePath,
    twin: f.twin,
    twinExists: f.twinExists,
    candidateCount: f.candidateCount,
    messageCount: f.messageCount,
    byClass: f.byClass,
    consumerUnit: f.consumerUnit || null,
    role: f.role || "finding",
    importers: f.importers,
    candidateRules: [
      ...new Set(
        (f.messages || [])
          .filter((m) => CANDIDATE.has(m.classification))
          .map((m) => m.rule),
      ),
    ],
    messages: f.messages || [],
    ...extra,
  }
}

for (const name of CLAIM_ORDER) {
  const meta = rebuilt[name] || {
    fileCount: 0,
    messageCount: 0,
    candidateFileCount: 0,
    files: [],
  }

  const MAX = MAX_FOR[name] || 40
  const selected = []
  const selectedSet = new Set()

  const tryAdd = (f) => {
    if (!f || !f.path || selectedSet.has(f.path)) return false
    if (seen.has(f.path)) {
      if (seen.get(f.path) !== name) overlaps.push({ file: f.path, a: seen.get(f.path), b: name })
      return false
    }
    selectedSet.add(f.path)
    seen.set(f.path, name)
    selected.push(f)
    return true
  }

  if (name === "atoms-composites-consumers") {
    for (const u of consumerUnits) {
      for (const d of u.defs) {
        if (!fs.existsSync(path.join(ROOT, d))) continue
        const f = fileMap.get(d)
        tryAdd({
          path: d,
          absolutePath: path.join(ROOT, d).replace(/\\/g, "/"),
          twin: twinOf(d),
          twinExists: fs.existsSync(path.join(ROOT, twinOf(d) || "")),
          candidateCount: f
            ? f.messages.filter((m) => CANDIDATE.has(m.classification)).length
            : 1,
          messageCount: f ? f.messageCount : 0,
          byClass: f ? f.byClass : { "consumer-safe": 1 },
          messages: f ? f.messages : [],
          consumerUnit: u.id,
          importers: u.importers,
          role: "def",
        })
      }
      for (const imp of u.importers) {
        if (selected.length >= MAX) break
        if (!fs.existsSync(path.join(ROOT, imp))) continue
        if (isLocked(imp)) continue
        const f = fileMap.get(imp)
        tryAdd({
          path: imp,
          absolutePath: path.join(ROOT, imp).replace(/\\/g, "/"),
          twin: twinOf(imp),
          twinExists: fs.existsSync(path.join(ROOT, twinOf(imp) || "")),
          candidateCount: f
            ? Math.max(1, f.messages.filter((m) => CANDIDATE.has(m.classification)).length)
            : 1,
          messageCount: f ? f.messageCount : 0,
          byClass: f ? f.byClass : { "consumer-safe": 1 },
          messages: f ? f.messages : [],
          consumerUnit: u.id,
          role: "importer",
        })
      }
    }
  }

  const pool = (meta.files || []).filter((f) => f.candidateCount > 0)
  for (const f of pool) {
    if (selected.length >= MAX) break
    if (!tryAdd(f)) continue
    if (f.twin && f.twinExists) {
      const twin = (meta.files || []).find((x) => x.path === f.twin) || fileMap.get(f.twin)
      if (twin) {
        tryAdd({
          path: twin.path || f.twin,
          absolutePath: twin.absolutePath || path.join(ROOT, f.twin).replace(/\\/g, "/"),
          twin: twin.twin || f.path,
          twinExists: true,
          candidateCount: twin.candidateCount || 0,
          messageCount: twin.messageCount || 0,
          byClass: twin.byClass || {},
          messages: twin.messages || [],
          consumerUnit: twin.consumerUnit || null,
          role: "twin",
        })
      }
    }
  }

  if (selected.length === 0) {
    fs.writeFileSync(
      path.join(ART, `2026-08-08-reconcile-manifest-${name}.json`),
      JSON.stringify(
        {
          partition: name,
          generatedAt: new Date().toISOString(),
          fileCount: 0,
          files: [],
          note: "No candidate files after exclusive claim — omit worker",
        },
        null,
        2,
      ),
    )
    console.log("empty", name)
    continue
  }

  const manifest = {
    partition: name,
    generatedAt: new Date().toISOString(),
    batch: 12,
    fileCount: selected.length,
    totalCandidates: meta.candidateFileCount || selected.length,
    capped: (meta.candidateFileCount || 0) > selected.length,
    allowedClassifications: [...CANDIDATE],
    holdClassifications: ["vendor-hold", "api-hold", "teacher-hold", "ambiguous"],
    hardHolds: inventory.hardHolds,
    consumerUnits: name === "atoms-composites-consumers" ? consumerUnits : undefined,
    files: selected.map((f) => toManifestFile(f)),
  }
  fs.writeFileSync(path.join(ART, `2026-08-08-reconcile-manifest-${name}.json`), JSON.stringify(manifest, null, 2))
  console.log(name, "selected", selected.length, "poolCandidates", meta.candidateFileCount || 0)
}

// Final overlap audit across written manifests
const auditSeen = new Map()
const auditOverlaps = []
for (const name of CLAIM_ORDER) {
  const mp = path.join(ART, `2026-08-08-reconcile-manifest-${name}.json`)
  if (!fs.existsSync(mp)) continue
  const m = JSON.parse(fs.readFileSync(mp, "utf8"))
  for (const f of m.files || []) {
    if (auditSeen.has(f.path)) auditOverlaps.push({ file: f.path, a: auditSeen.get(f.path), b: name })
    else auditSeen.set(f.path, name)
  }
}

console.log(
  JSON.stringify(
    {
      starciFeMessages,
      byClass,
      claimOverlapsSkipped: overlaps.length,
      finalManifestOverlaps: auditOverlaps.length,
      manifestFiles: auditSeen.size,
      consumerUnits: consumerUnits.map((u) => ({
        id: u.id,
        defs: u.defs.filter((d) => fs.existsSync(path.join(ROOT, d))).length,
        importers: u.importers.length,
      })),
      partitions: Object.fromEntries(
        Object.entries(rebuilt).map(([k, v]) => [
          k,
          { files: v.fileCount, candidates: v.candidateFileCount, msgs: v.messageCount },
        ]),
      ),
    },
    null,
    2,
  ),
)
if (auditOverlaps.length) console.log("FINAL OVERLAPS", auditOverlaps)
