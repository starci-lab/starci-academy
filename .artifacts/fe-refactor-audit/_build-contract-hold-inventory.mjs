/**
 * BATCH 13 Phase 0 — Contract hold closure inventory (no product edits).
 * Focused on named candidate areas from the batch brief, not the full 4k pile.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const raw = JSON.parse(
  fs.readFileSync(path.join(ART, "2026-08-08-contract-hold-eslint-raw.json"), "utf8"),
)

const norm = (p) => p.replace(/\\/g, "/")
const rel = (abs) => {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
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

const twinOf = (p) => {
  const n = norm(p)
  if (n.startsWith(".storybook/components/")) return n.replace(/^\.storybook\//, "src/")
  if (n.startsWith("src/components/")) return n.replace(/^src\//, ".storybook/")
  // starci twin paths
  if (n.startsWith(".storybook/components/starci/")) {
    return n.replace(".storybook/components/starci/", "src/components/")
  }
  if (n.includes("/blocks/learn/ContinueCard/") || n.includes("/overlays/")) {
    const sb = n.replace(/^src\//, ".storybook/components/starci/")
    if (fs.existsSync(path.join(ROOT, sb))) return sb
  }
  return null
}

/** Explicit ownership units for this batch */
const UNITS = {
  "per-part-props": [
    "src/components/composites/layout/DrawerShell/index.tsx",
    ".storybook/components/composites/layout/DrawerShell/DrawerShell.tsx",
    "src/components/composites/layout/ModalShell/index.tsx",
    ".storybook/components/composites/layout/ModalShell/ModalShell.tsx",
    "src/components/composites/cards/SurfaceCard/index.tsx",
    ".storybook/components/composites/cards/SurfaceCard/SurfaceCard.tsx",
    "src/components/composites/viewers/PDFView/index.tsx",
    ".storybook/components/composites/viewers/PDFView/PDFView.tsx",
    "src/components/blocks/rendering/PDFView/index.tsx",
    "src/components/overlays/drawers/MiniCartDrawer/component.tsx",
    "src/components/overlays/drawers/MiniCartDrawer/index.tsx",
    "src/components/overlays/modals/CvPreviewModal/component.tsx",
    "src/components/overlays/modals/CvPreviewModal/index.tsx",
    "src/components/overlays/modals/LivestreamCalendarModal/component.tsx",
    ".storybook/stories/composites/viewers/PDFView/PDFView.stories.tsx",
    "src/components/blocks/cards/LabeledCard/index.tsx",
    "src/components/blocks/marketing/ShowcaseMockup/index.tsx",
  ],
  "stacking-layout": [
    "src/components/blocks/learn/ContinueCard/index.tsx",
    "src/components/blocks/learn/ContinueCard/CardBody.tsx",
    "src/components/blocks/learn/ContinueCard/ContinueCardHero/index.tsx",
    "src/components/blocks/learn/ContinueCard/ContinueCardItem/index.tsx",
    "src/components/blocks/learn/ContinueCard/types.ts",
    ".storybook/components/starci/blocks/learn/ContinueCard/ContinueCardHero/index.tsx",
    ".storybook/components/starci/blocks/learn/ContinueCard/ContinueCardItem/index.tsx",
    "src/components/blocks/learn/MilestoneUpNextCard/index.tsx",
    ".storybook/components/starci/blocks/learn/MilestoneUpNextCard/MilestoneUpNextCard.tsx",
    "src/components/pages/DashboardPage/LeagueCard/component.tsx",
    "src/components/blocks/dashboard/LeaderboardListCard/index.tsx",
  ],
  "heroui-boundaries": [], // filled from eslint hits below
  "identity-hosts": [],
  "skeleton-contracts": [],
  "twin-parity": [],
}

const CLASSES = [
  "safe-api-removal",
  "safe-consumer-migration",
  "new-named-slot-required",
  "vendor-boundary",
  "identity-decision",
  "skeleton-decision",
  "teacher-hold",
  "ambiguous",
]

function classifyFinding(rule, message, filePath, unit) {
  const p = norm(filePath)
  const msg = String(message || "")
  if (isLocked(p)) return "teacher-hold"
  if (/ChipBase|dotClassName/i.test(p) && /Chip\//.test(p)) return "vendor-boundary"
  if (rule === "starci-fe/handler-on-prefix" && /handleSide/i.test(msg + p)) return "vendor-boundary"

  if (unit === "per-part-props" || rule === "starci-fe/no-per-part-classname-prop") {
    if (/MiniCart|CvPreview|heightClassName|dialogClassName|footerClassName|containerClassName/i.test(p + msg)) {
      // Real layout consumers — likely need named slot or keep boundary
      if (/heightClassName|dialogClassName|footerClassName|containerClassName="h-\[|max-w|flex-col/i.test(msg + p)) {
        return "new-named-slot-required"
      }
      return "safe-consumer-migration"
    }
    return "new-named-slot-required"
  }

  if (unit === "stacking-layout") {
    if (/contentClassName|ContinueCard|stack/i.test(p + msg)) return "new-named-slot-required"
    return "ambiguous"
  }

  if (rule === "starci-fe/no-heroui-outside-vocabulary") {
    if (/\/atoms\//.test(p)) return "vendor-boundary"
    return "vendor-boundary" // BATCH 12 proved non-identical — default vendor until proven
  }

  if (rule === "starci-fe/require-identity-root") return "identity-decision"

  if (
    rule === "starci-fe/no-parallel-skeleton" ||
    rule === "starci-fe/no-skeleton-twin-component" ||
    rule === "starci-fe/no-inline-skeleton-branch"
  ) {
    return "skeleton-decision"
  }

  if (rule === "starci-fe/require-frame-self-declare" && /neither|missing both/i.test(msg)) {
    return "ambiguous"
  }

  return "ambiguous"
}

// Collect eslint messages by file
const fileMsgs = new Map()
let starciTotal = 0
let a11y = 0
const byRule = {}

for (const f of raw) {
  const filePath = rel(f.filePath)
  for (const m of f.messages || []) {
    const rule = m.ruleId || "(other)"
    if (String(rule).startsWith("jsx-a11y/")) {
      a11y++
      continue
    }
    if (!String(rule).startsWith("starci-fe/")) continue
    starciTotal++
    byRule[rule] = (byRule[rule] || 0) + 1
    if (!fileMsgs.has(filePath)) fileMsgs.set(filePath, [])
    fileMsgs.get(filePath).push({
      rule,
      line: m.line,
      column: m.column,
      message: m.message,
      severity: m.severity,
    })
  }
}

// Seed heroui / identity / skeleton candidates from eslint (non-locked), capped
const herouiFiles = []
const identityFiles = []
const skeletonFiles = []
for (const [fp, msgs] of fileMsgs) {
  if (isLocked(fp)) continue
  // Exclude files already in per-part or stacking
  const reserved = new Set([...UNITS["per-part-props"], ...UNITS["stacking-layout"]])
  if (reserved.has(fp)) continue

  const rules = new Set(msgs.map((m) => m.rule))
  if (rules.has("starci-fe/no-heroui-outside-vocabulary") && herouiFiles.length < 30) {
    herouiFiles.push(fp)
  } else if (
    rules.has("starci-fe/require-identity-root") &&
    !rules.has("starci-fe/no-heroui-outside-vocabulary") &&
    identityFiles.length < 30
  ) {
    identityFiles.push(fp)
  } else if (
    (rules.has("starci-fe/no-parallel-skeleton") ||
      rules.has("starci-fe/no-skeleton-twin-component") ||
      rules.has("starci-fe/no-inline-skeleton-branch")) &&
    skeletonFiles.length < 25
  ) {
    skeletonFiles.push(fp)
  }
}
UNITS["heroui-boundaries"] = herouiFiles
UNITS["identity-hosts"] = identityFiles
UNITS["skeleton-contracts"] = skeletonFiles

/** Exclusive claim */
const claimed = new Map()
const partitions = {}
const byClass = {}

function claim(unit, filePath) {
  const p = norm(filePath).replace(/^\.\//, "")
  if (!p || !fs.existsSync(path.join(ROOT, p))) return null
  if (claimed.has(p)) return null
  claimed.set(p, unit)
  return p
}

for (const [unit, files] of Object.entries(UNITS)) {
  partitions[unit] = {
    fileCount: 0,
    byClass: {},
    files: [],
    decisions: [],
  }
  const selected = []
  for (const f of files) {
    const p = claim(unit, f)
    if (!p) continue
    // also claim twin if exists and unclaimed
    let twin = twinOf(p)
    // starci path twin heuristics
    if (!twin && p.startsWith("src/components/")) {
      const starci = p.replace("src/components/", ".storybook/components/starci/")
      if (fs.existsSync(path.join(ROOT, starci))) twin = starci
      else {
        const plain = p.replace("src/", ".storybook/")
        if (fs.existsSync(path.join(ROOT, plain))) twin = plain
      }
    }
    if (twin && !claimed.has(twin) && unit !== "heroui-boundaries") {
      // heroui/identity twins claimed only if same unit later
      if (unit === "per-part-props" || unit === "stacking-layout" || unit === "identity-hosts" || unit === "skeleton-contracts") {
        claim(unit, twin)
        if (!files.includes(twin) && !selected.find((x) => x.path === twin)) {
          // will add below
        }
      }
    }

    const msgs = (fileMsgs.get(p) || []).map((m) => ({
      ...m,
      classification: classifyFinding(m.rule, m.message, p, unit),
    }))
    for (const m of msgs) {
      byClass[m.classification] = (byClass[m.classification] || 0) + 1
      partitions[unit].byClass[m.classification] =
        (partitions[unit].byClass[m.classification] || 0) + 1
    }
    selected.push({
      path: p,
      absolutePath: path.join(ROOT, p).replace(/\\/g, "/"),
      twin: twin && fs.existsSync(path.join(ROOT, twin)) ? twin : null,
      twinExists: !!(twin && fs.existsSync(path.join(ROOT, twin))),
      messageCount: msgs.length,
      messages: msgs,
      role: "primary",
    })
  }

  // Add claimed twins that weren't in original list
  for (const [p, owner] of claimed) {
    if (owner !== unit) continue
    if (selected.find((x) => x.path === p)) continue
    const msgs = (fileMsgs.get(p) || []).map((m) => ({
      ...m,
      classification: classifyFinding(m.rule, m.message, p, unit),
    }))
    for (const m of msgs) {
      byClass[m.classification] = (byClass[m.classification] || 0) + 1
      partitions[unit].byClass[m.classification] =
        (partitions[unit].byClass[m.classification] || 0) + 1
    }
    selected.push({
      path: p,
      absolutePath: path.join(ROOT, p).replace(/\\/g, "/"),
      twin: twinOf(p),
      twinExists: !!(twinOf(p) && fs.existsSync(path.join(ROOT, twinOf(p)))),
      messageCount: msgs.length,
      messages: msgs,
      role: "twin",
    })
  }

  partitions[unit].files = selected
  partitions[unit].fileCount = selected.length

  // Seed decisions for coordinator
  if (unit === "per-part-props") {
    partitions[unit].decisions = [
      {
        id: "DrawerShell-dialog-footer",
        classification: "new-named-slot-required",
        note: "MiniCart uses dialogClassName=sm:max-w-md and footerClassName flex-col stretch — real layout; needs named size/footerVariant or keep prop",
      },
      {
        id: "ModalShell-container-CvPreview",
        classification: "new-named-slot-required",
        note: "CvPreview containerClassName near-fullscreen + PDF heightClassName — not equivalent to size=cover/full without proof",
      },
      {
        id: "PDFView-heightClassName",
        classification: "new-named-slot-required",
        note: "Multiple story/viewport heights; propose height token enum only if canon already has sizes",
      },
      {
        id: "SurfaceCard-contentClassName",
        classification: "new-named-slot-required",
        note: "ContinueCard/LeagueCard/Leaderboard use contentClassName for stack chrome — stacking-layout owns ContinueCard; SurfaceCard prop may stay until named bodyVariant",
      },
    ]
  }
}

const inventory = {
  generatedAt: new Date().toISOString(),
  batch: 13,
  title: "CONTRACT HOLD CLOSURE",
  checkpoint: "22f28f4e (BATCH 12 uncommitted on top of db1f7a11)",
  head: "22f28f4e",
  totals: {
    starciFeMessages: starciTotal,
    a11yUntouched: a11y,
    scopedManifestFiles: claimed.size,
    byClassification: byClass,
  },
  byRule,
  hardHolds: [
    "27 teacher pattern holds / Nivo / locked paths / a11y",
    "ChipBase API / handleSide vendor boundary",
    "No invented principle tokens / no eslint-disable / no generic className escapes",
    "No HeroUI conversion when atom API non-identical",
    "No prop removal while real consumers depend on it",
  ],
  partitions,
}

fs.writeFileSync(path.join(ART, "2026-08-08-contract-hold-inventory.json"), JSON.stringify(inventory, null, 2))

const lines = []
lines.push("# Contract hold closure — inventory 2026-08-08 (BATCH 13)")
lines.push("")
lines.push("Checkpoint context: BATCH 12 on `db1f7a11` / HEAD `22f28f4e` (+ uncommitted reconcile). Fresh ESLint: `2026-08-08-contract-hold-eslint-raw.json`.")
lines.push("")
lines.push("## Totals")
lines.push("")
lines.push("| Metric | Count |")
lines.push("|---|---:|")
lines.push(`| starci-fe (repo) | ${starciTotal} |`)
lines.push(`| a11y untouched | ${a11y} |`)
lines.push(`| scoped manifest files | ${claimed.size} |`)
lines.push("")
lines.push("### Scoped classifications")
lines.push("")
lines.push("| Classification | Count |")
lines.push("|---|---:|")
for (const [k, v] of Object.entries(byClass).sort((a, b) => b[1] - a[1])) {
  lines.push(`| \`${k}\` | ${v} |`)
}
lines.push("")
lines.push("## Candidate areas → partitions")
lines.push("")
for (const [name, meta] of Object.entries(partitions)) {
  lines.push(`### \`${name}\``)
  lines.push("")
  lines.push(`- files: **${meta.fileCount}**`)
  const cls = Object.entries(meta.byClass || {})
    .sort((a, b) => b[1] - a[1])
    .map(([r, c]) => `\`${r}(${c})\``)
    .join(", ")
  lines.push(`- by class: ${cls || "(none)"}`)
  if (meta.decisions?.length) {
    lines.push("- seeded decisions:")
    for (const d of meta.decisions) lines.push(`  - **${d.id}**: ${d.classification} — ${d.note}`)
  }
  lines.push("")
}
lines.push("## Hard holds")
lines.push("")
for (const h of inventory.hardHolds) lines.push(`- ${h}`)
fs.writeFileSync(path.join(ART, "2026-08-08-contract-hold-inventory.md"), lines.join("\n"))

// Write manifests + overlap check
let overlaps = 0
const seen = new Map()
for (const [name, meta] of Object.entries(partitions)) {
  for (const f of meta.files) {
    if (seen.has(f.path)) overlaps++
    else seen.set(f.path, name)
  }
  fs.writeFileSync(
    path.join(ART, `2026-08-08-contract-manifest-${name}.json`),
    JSON.stringify(
      {
        partition: name,
        generatedAt: new Date().toISOString(),
        batch: 13,
        fileCount: meta.files.length,
        allowedApply: ["safe-api-removal", "safe-consumer-migration"],
        recordOnly: [
          "new-named-slot-required",
          "vendor-boundary",
          "identity-decision",
          "skeleton-decision",
          "teacher-hold",
          "ambiguous",
        ],
        seededDecisions: meta.decisions || [],
        hardHolds: inventory.hardHolds,
        files: meta.files,
      },
      null,
      2,
    ),
  )
  console.log(name, meta.files.length)
}

console.log(
  JSON.stringify(
    {
      starciTotal,
      scopedFiles: claimed.size,
      overlaps,
      byClass,
    },
    null,
    2,
  ),
)
