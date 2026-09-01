import fs from "fs"
import path from "path"

const rows = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/_b20-classname-raw.json", "utf8"),
)

const LOCKED = [
  /\/BlockAnatomy\//,
  /\/MockInterviewSession\//,
  /\/QuizSession\//,
  /\/LearnLoopScroll\//,
  /\/ContentAiChat\//,
  /\/ArchitectureScene\//,
  /\/resources\//,
]

const VENDOR = [
  /\/components\/frames\/Box\//,
  /\/components\/atoms\/.*\/(?:Modal|Drawer|Popover|Tooltip|Select|ListBox|Table|AlertDialog|ButtonGroup)\//,
]

// Teacher seams from prior batches (path substrings)
const TEACHER = [
  "Teacher",
  "teacher",
]

const APPROVED_CONTRACTS = new Set([
  "DrawerShell",
  "ModalShell",
  "PDFView",
])

function kindOf(message) {
  if (message.includes("WithClassNames")) return "withClassNames"
  if (message.startsWith("Do not pass")) return "usage"
  return "declaration"
}

function partition(file) {
  const f = file.replace(/\\/g, "/")
  const isSb = f.startsWith(".storybook/")
  const rel = f
    .replace(/^\.storybook\/components\//, "")
    .replace(/^src\/components\//, "")

  if (
    /\/frames\/Box\//.test(f) ||
    /\/atoms\/.*\/(?:Modal|Drawer|Popover|Tooltip|Select|ListBox|Table|AlertDialog|ButtonGroup)\//.test(f)
  ) {
    return "vendor-and-hold-ledger"
  }

  if (/\/pages\//.test(f) || /\/overlays\//.test(f)) return "pages-and-overlays"

  if (/\/blocks\//.test(f)) return "blocks-layout-domain"

  if (
    /\/composites\/viewers\//.test(f) ||
    /\/composites\/text\//.test(f) ||
    /\/composites\/async\//.test(f) ||
    /\/composites\/form\//.test(f) ||
    /\/composites\/feedback\//.test(f) ||
    /\/composites\/data\//.test(f) ||
    /\/composites\/lists\//.test(f)
  ) {
    return "composites-viewers-text"
  }

  if (
    /\/composites\/layout\//.test(f) ||
    /\/composites\/cards\//.test(f) ||
    /\/composites\/stats\//.test(f) ||
    /\/composites\/frames\//.test(f) ||
    /\/frames\//.test(f)
  ) {
    return "composites-layout-cards"
  }

  if (/\/atoms\/(navigation|overlay|overlays)\//.test(f) || /\/atoms\/.*\/(Pagination|Tabs|Breadcrumb|Link|Menu)/.test(f)) {
    return "atoms-navigation-overlay"
  }

  if (/\/atoms\//.test(f)) return "atoms-display-forms"

  // storybook-only leftovers (stories aren't in components/, but if any)
  if (isSb && !f.includes("/components/")) return "storybook-only"

  // default: storybook composites not matched → storybook-only bucket for SB-only paths
  // For twins we already bucketed by type above.
  return isSb ? "storybook-only" : "blocks-layout-domain"
}

function classify(file, message) {
  const f = file.replace(/\\/g, "/")

  if (VENDOR.some((re) => re.test(f))) return "vendor-boundary"
  if (LOCKED.some((re) => re.test(f))) return "locked-or-teacher-hold"
  if (/Skeleton/i.test(f)) return "locked-or-teacher-hold" // redesign-only per prior ledger
  if (/nivoexpert|\/nivo\//i.test(f)) return "locked-or-teacher-hold"
  if (/Teacher/.test(f)) return "locked-or-teacher-hold"

  // HeroUI wrapper atoms that match vendor patterns already handled;
  // remaining classNames on shells that forward to HeroUI dialog parts:
  // classify as ambiguous unless it's known hold contentClassName

  if (message.includes("contentClassName") || /contentClassName/.test(message)) {
    return "ambiguous"
  }

  // SurfaceCard classNames slots — HeroUI Card classNames object door
  if (/SurfaceCard/.test(f) && message.includes("classNames")) {
    return "ambiguous" // PressableGroup TILE_CHROME / slot doors held
  }

  // Usage of className on vendor atoms imported as house bindings
  // (DrawerDialog, DrawerBody, etc.) — internal forward to vendor
  if (
    kindOf(message) === "usage" &&
    /(DrawerDialog|DrawerBody|DrawerFooter|DrawerContent|ModalContent|ModalHeader|ModalBody|ModalFooter|Card|CardBody|CardHeader|CardFooter)/.test(
      message,
    )
  ) {
    return "vendor-boundary"
  }

  // Default: ambiguous until worker proves dead/parent/intrinsic
  return "ambiguous"
}

const findings = rows.map((r) => {
  const kind = kindOf(r.message)
  const classification = classify(r.file, r.message)
  const part = partition(r.file)
  return {
    ...r,
    kind,
    classification,
    partition: part,
  }
})

// Aggregate by file
const byFile = new Map()
for (const f of findings) {
  if (!byFile.has(f.file)) {
    byFile.set(f.file, {
      file: f.file,
      partition: f.partition,
      classifications: new Set(),
      kinds: new Set(),
      hitCount: 0,
      lines: [],
    })
  }
  const e = byFile.get(f.file)
  e.classifications.add(f.classification)
  e.kinds.add(f.kind)
  e.hitCount++
  e.lines.push({ line: f.line, kind: f.kind, classification: f.classification, message: f.message })
}

// Prefer strongest classification per file for rollup
const RANK = {
  "vendor-boundary": 1,
  "locked-or-teacher-hold": 2,
  dead: 3,
  "parent-placement": 4,
  "intrinsic-semantic": 5,
  ambiguous: 6,
}

function primaryClass(set) {
  return [...set].sort((a, b) => RANK[a] - RANK[b])[0]
}

const fileEntries = [...byFile.values()].map((e) => ({
  file: e.file,
  partition: e.partition,
  classification: primaryClass(e.classifications),
  allClassifications: [...e.classifications],
  kinds: [...e.kinds],
  hitCount: e.hitCount,
  lines: e.lines,
}))

const summary = {
  generatedAt: new Date().toISOString(),
  rule: "starci-fe/no-public-classname-prop",
  totalHits: findings.length,
  totalFiles: fileEntries.length,
  byClassification: {},
  byPartition: {},
  byKind: {},
  approvedContractsStatus: {
    DrawerShell: "implemented-b19",
    ModalShell: "implemented-b19",
    PDFView: "implemented-b19",
    SurfaceCard_bodyVariant:
      "present-from-b19; B20 rule = only keep if ≥2 identical consumers (ContinueCard Item+Hero proven)",
  },
  note:
    "Initial classification is path/message heuristic. Workers must reclassify dead/parent-placement/intrinsic-semantic with consumer evidence before edits. Vendor/locked/ambiguous are holds unless proven otherwise.",
}

for (const f of findings) {
  summary.byClassification[f.classification] =
    (summary.byClassification[f.classification] || 0) + 1
  summary.byPartition[f.partition] = (summary.byPartition[f.partition] || 0) + 1
  summary.byKind[f.kind] = (summary.byKind[f.kind] || 0) + 1
}

const inventory = {
  summary,
  files: fileEntries.sort((a, b) => a.file.localeCompare(b.file)),
  findings,
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-08-b20-classname-inventory.json",
  JSON.stringify(inventory, null, 2),
)

// Partition manifests (file lists, disjoint)
const manifests = {}
for (const e of fileEntries) {
  if (!manifests[e.partition]) manifests[e.partition] = []
  manifests[e.partition].push(e.file)
}
for (const [name, list] of Object.entries(manifests)) {
  const uniq = [...new Set(list)].sort()
  fs.writeFileSync(
    `.artifacts/fe-refactor-audit/2026-08-08-b20-manifest-${name}.json`,
    JSON.stringify({ partition: name, files: uniq, count: uniq.length }, null, 2),
  )
}

// Markdown summary
const md = [
  "# BATCH 20 — classname inventory",
  "",
  `Generated: ${summary.generatedAt}`,
  "",
  `Total hits: **${summary.totalHits}** across **${summary.totalFiles}** files.`,
  "",
  "## By classification (hits)",
  "",
  "| Classification | Hits |",
  "|---|---:|",
  ...Object.entries(summary.byClassification)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `| \`${k}\` | ${v} |`),
  "",
  "## By partition (hits)",
  "",
  "| Partition | Hits | Files |",
  "|---|---:|---:|",
  ...Object.keys(manifests)
    .sort()
    .map((k) => {
      const hits = summary.byPartition[k] || 0
      return `| \`${k}\` | ${hits} | ${manifests[k].length} |`
    }),
  "",
  "## By kind",
  "",
  "| Kind | Hits |",
  "|---|---:|",
  ...Object.entries(summary.byKind).map(([k, v]) => `| \`${k}\` | ${v} |`),
  "",
  "## Approved contracts (from B19)",
  "",
  "- DrawerShell `dialogWidth` / `footerVariant` — implemented",
  "- ModalShell `viewportFit` — implemented",
  "- PDFView `height` — implemented",
  "- SurfaceCard `bodyVariant` — present; keep only with ≥2 identical consumers (ContinueCard)",
  "",
  "## Classification policy",
  "",
  "1. `vendor-boundary` — Box + HeroUI wrapper atoms; internal forwards to vendor primitives",
  "2. `locked-or-teacher-hold` — locked paths, nivo/nivoexpert, skeletons, teacher seams",
  "3. `ambiguous` — default until worker proves dead / parent-placement / intrinsic-semantic",
  "4. Workers must not invent variants; SurfaceCard bodyVariant only if ≥2 identical consumers",
  "",
  "## Top files by hit count",
  "",
  "| Hits | File | Classification | Partition |",
  "|---:|---|---|---|",
  ...[...fileEntries]
    .sort((a, b) => b.hitCount - a.hitCount)
    .slice(0, 40)
    .map(
      (e) =>
        `| ${e.hitCount} | \`${e.file}\` | ${e.classification} | ${e.partition} |`,
    ),
  "",
]

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-08-b20-classname-inventory.md",
  md.join("\n"),
)

console.log(JSON.stringify(summary, null, 2))
console.log(
  "manifests",
  Object.fromEntries(Object.entries(manifests).map(([k, v]) => [k, v.length])),
)
