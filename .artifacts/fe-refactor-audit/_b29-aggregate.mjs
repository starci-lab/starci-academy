/**
 * BATCH 29 — aggregate status + inventory after.
 */
import fs from "node:fs"
import path from "node:path"
import { spawnSync, execSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")

const WORKERS = [
  "fill-frame-contract",
  "fill-learn-consumers",
  "fill-page-consumers",
  "video-renderer-contract",
  "markdown-block-contract",
  "cards-lists",
  "navigation-buttons",
  "verification-and-parity",
]

const workers = {}
for (const w of WORKERS) {
  if (w === "verification-and-parity") continue
  const p = path.join(ART, `2026-08-09-b29-worker-${w}.json`)
  if (!fs.existsSync(p)) {
    console.error("missing", w)
    process.exitCode = 1
  } else {
    workers[w] = JSON.parse(fs.readFileSync(p, "utf8"))
  }
}

const owner = new Map()
const overlaps = []
const changed = new Set()
for (const [name, data] of Object.entries(workers)) {
  for (const f of data.changed || []) {
    const key = f.replace(/\\/g, "/")
    if (owner.has(key)) overlaps.push({ file: key, a: owner.get(key), b: name })
    else owner.set(key, name)
    changed.add(key)
  }
}

// also include git-tracked B29 frame/canon files that may be outside worker changed arrays
const gitChanged = execSync("git diff --name-only e6066358 -- src .storybook", {
  encoding: "utf8",
  cwd: ROOT,
})
  .trim()
  .split(/\n/)
  .filter(Boolean)
  .map((f) => f.replace(/\\/g, "/"))
for (const f of gitChanged) changed.add(f)

console.log("After inventory…")
const eslint = spawnSync(
  "npx",
  ["eslint", "--no-error-on-unmatched-pattern", "-f", "json", "src/components", ".storybook/components"],
  { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, shell: true },
)
let afterHits = 0
const afterFiles = new Set()
try {
  for (const file of JSON.parse(eslint.stdout || "[]")) {
    const msgs = (file.messages || []).filter((m) => m.ruleId === "starci-fe/no-public-classname-prop")
    if (msgs.length) {
      afterHits += msgs.length
      afterFiles.add(path.relative(ROOT, file.filePath).replace(/\\/g, "/"))
    }
  }
} catch (e) {
  console.error(e.message)
}

const beforeHits = 1573
const beforeFiles = 575
const changedFiles = [...changed].sort()

const verificationWorker = {
  partition: "verification-and-parity",
  manifest: [],
  consumerEvidence: "read-only coordinator",
  valueSet: {},
  oldApi: "n/a",
  newApi: "n/a",
  changed: [],
  holds: [],
  parity: {
    FillAvailable: "SB first, src twin",
    PhaseScarcityNote: "n/a this batch",
    Markdown: "SB composites doors closed; src composites mirrored; src blocks map wrapped",
    VideoRenderer: "src-only (no SB twin)",
  },
  verification: { role: "coordinator suite after aggregation" },
  regressions: [],
  overlapCheck: overlaps.length ? "fail" : "pass",
}
fs.writeFileSync(
  path.join(ART, "2026-08-09-b29-worker-verification-and-parity.json"),
  JSON.stringify(verificationWorker, null, 2) + "\n",
)

const status = {
  batch: 29,
  title: "Fill, media, and markdown contract closure",
  committed: false,
  checkpoint: "e6066358",
  generatedAt: new Date().toISOString(),
  workers: 8,
  overlapResult: overlaps.length ? "fail" : "pass",
  overlaps,
  inventory: {
    rule: "starci-fe/no-public-classname-prop",
    before: { hits: beforeHits, files: beforeFiles },
    after: { hits: afterHits, files: afterFiles.size },
    delta: { hits: afterHits - beforeHits, files: afterFiles.size - beforeFiles },
  },
  primary: {
    fillAvailable: {
      token: "flex-fill",
      frame: "FillAvailable",
      at: { lg: "min-h-0 @app-lg:flex-1" },
      note: "Mapped to proven consumer string (not @app-lg:min-h-0 @app-lg:flex-1)",
      migrated: [
        "ContentMap",
        "LeaderboardCategoryRail",
        "MilestoneOutline",
        "ArchitectureRail",
        "PracticeRail",
      ],
    },
    videoRenderer: {
      doorsRemoved: ["VideoRenderer.className", "VideoRenderer.classNames", "MpegDash.className", "Standard.className", "Youtube.className"],
    },
    markdown: {
      doorsRemoved: [
        "SB/src CodeToHtml.classNames",
        "SB/src MermaidDiagram.classNames",
        "blocks CodeToHtml.className",
        "blocks MermaidDiagram.className (connected+presentational)",
      ],
      spacingOwner: "MarkdownContent map private blockMy wrapper div",
    },
  },
  secondary: {
    applied: [],
    held: [
      "SectionCard",
      "TierCardBase",
      "LeaderboardListCard",
      "LabeledList",
      "ListRow",
      "SidebarNavItem",
      "TabsCard",
      "ButtonGroup",
    ],
  },
  changedFiles,
  verification: { pending: true },
  regressions: [],
  note: "Proposals are not fixes",
}

fs.writeFileSync(path.join(ART, "2026-08-09-b29-status.json"), JSON.stringify(status, null, 2) + "\n")

const md = `# BATCH 29 — Fill, media, and markdown contract closure

**Committed:** no  
**Checkpoint:** \`e6066358\`  
**Workers:** 8 (overlap ${status.overlapResult})

## Inventory delta (\`starci-fe/no-public-classname-prop\`)

| | Hits | Files |
|---|---:|---:|
| Before | ${beforeHits} | ${beforeFiles} |
| After | ${afterHits} | ${afterFiles.size} |
| Delta | **${afterHits - beforeHits}** | **${afterFiles.size - beforeFiles}** |

## Primary contracts

### 1. FillAvailable + \`flex-fill\`
- New frame (SB → src) with \`at="lg"\` → private \`min-h-0 @app-lg:flex-1\`
- Migrated: ContentMap, LeaderboardCategoryRail, MilestoneOutline, ArchitectureRail, PracticeRail
- Removed those five public className doors
- \`at="base"\` not added (no unlocked exact \`min-h-0 flex-1\` on these targets)

### 2. VideoRenderer
- Deleted VideoRenderer / MpegDash / Standard / Youtube public CSS doors (zero consumers)
- Intrinsic aspect/chrome baked; selection + empty URL preserved

### 3. Markdown block spacing
- \`blockMy\` owned by map wrapper \`<div>\` (src blocks aligned to composite pattern)
- Removed CodeToHtml / MermaidDiagram className/classNames doors (SB + src composites + src blocks)

## Secondary candidates
**Applied:** none  
**Held:** SectionCard, TierCardBase, LeaderboardListCard, LabeledList, ListRow, SidebarNavItem, TabsCard, ButtonGroup

## Changed files

${changedFiles.map((f) => `- \`${f}\``).join("\n")}

## Verification

Pending coordinator suite.
`

fs.writeFileSync(path.join(ART, "2026-08-09-b29-status.md"), md)
console.log(
  JSON.stringify(
    {
      afterHits,
      afterFiles: afterFiles.size,
      delta: afterHits - beforeHits,
      changed: changedFiles.length,
      overlaps,
    },
    null,
    2,
  ),
)
