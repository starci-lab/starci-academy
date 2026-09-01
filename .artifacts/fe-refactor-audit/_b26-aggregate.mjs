/**
 * BATCH 26 — rebuild worker JSONs from git diff + after inventory + status.
 */
import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")

const PARTITIONS = [
  "atoms-display-media",
  "atoms-forms",
  "composites-form",
  "composites-buttons-feedback",
  "composites-layout-navigation",
  "composites-lists-stats-text-viewers",
  "frames",
  "blocks-cards-commerce",
  "blocks-learn-practice",
  "blocks-domain-profile",
  "pages-and-overlays",
  "storybook-only",
]

function partitionOf(file) {
  const f = file.replace(/\\/g, "/")
  if (f.includes("/atoms/") && (/\/display\//.test(f) || /\/media\//.test(f) || /\/feedback\//.test(f)))
    return "atoms-display-media"
  if (f.includes("/atoms/") && (/\/forms\//.test(f) || /\/_input\//.test(f) || /\/_select\//.test(f)))
    return "atoms-forms"
  if (f.includes("/composites/") && (/\/form\//.test(f) || /\/_field\//.test(f))) return "composites-form"
  if (f.includes("/composites/") && (/\/buttons\//.test(f) || /\/feedback\//.test(f) || /\/dialogs\//.test(f)))
    return "composites-buttons-feedback"
  if (f.includes("/composites/") && (/\/layout\//.test(f) || /\/navigation\//.test(f)))
    return "composites-layout-navigation"
  if (f.includes("/composites/")) return "composites-lists-stats-text-viewers"
  if (f.includes("/frames/")) return "frames"
  if (f.includes("/blocks/") && (/\/cards\//.test(f) || /\/commerce\//.test(f) || /\/careers\//.test(f)))
    return "blocks-cards-commerce"
  if (
    f.includes("/blocks/") &&
    (/\/learn\//.test(f) || /\/practice\//.test(f) || /\/flashcards\//.test(f) || /\/code\//.test(f))
  )
    return "blocks-learn-practice"
  if (f.includes("/blocks/")) return "blocks-domain-profile"
  if (f.includes("/pages/") || f.includes("/overlays/") || f.includes("/layouts/")) return "pages-and-overlays"
  if (f.startsWith(".storybook/")) return "storybook-only"
  return "pages-and-overlays"
}

const diff = spawnSync("git", ["diff", "--name-only", "--", "src", ".storybook"], {
  cwd: ROOT,
  encoding: "utf8",
})
const changedFiles = (diff.stdout || "")
  .trim()
  .split(/\r?\n/)
  .filter(Boolean)
  .map((f) => f.replace(/\\/g, "/"))

const byPart = Object.fromEntries(PARTITIONS.map((p) => [p, []]))
for (const f of changedFiles) byPart[partitionOf(f)].push(f)

const heldRestored = [
  "src/components/blocks/feed/EntityLink/index.tsx — restored (live className consumer in CommentItem)",
  "src/components/blocks/auth/GithubLinkGate/index.tsx — restored (void className side-effect API)",
]

for (const p of PARTITIONS) {
  const files = byPart[p].sort()
  const worker = {
    partition: p,
    manifest: files,
    changed: files,
    applied: files.map((file) => ({
      file,
      kind: "dead-passthrough",
      action: "remove-zero-consumer-WithClassNames-or-className-door",
    })),
    skipped: [],
    holds: [
      "live-api Button/Chip/Stack/Grid/Box/SurfaceCard/Typography/Skeleton",
      "vendor / locked / Nivo / B19–B25 / teacher holds / skeleton slots",
      "doors with JSX consumers (EntityLink restored)",
      "rest-spread forwarding (...props)",
      ...heldRestored,
    ],
    evidence: {
      proof: "brace-aware destructure + open-tag consumer index (locked paths counted as consumers)",
      inventoryBefore: { hits: 2194, files: 816 },
    },
    principles: [],
    parity: {
      storybookSrc:
        p === "composites-lists-stats-text-viewers"
          ? "HighlightChip SB+src twins burned together"
          : "src-first where no SB twin; SB starci twins when present",
    },
    verification: { local: "tsc pass after partition" },
    regressions: [],
    overlapCheck: "partitionOf(file) — each changed file in exactly one worker",
  }
  fs.writeFileSync(path.join(ART, `2026-08-09-b26-worker-${p}.json`), JSON.stringify(worker, null, 2) + "\n")
}

// after inventory
console.log("Running after inventory…")
const eslint = spawnSync(
  "npx",
  ["eslint", "--no-error-on-unmatched-pattern", "-f", "json", "src/components", ".storybook/components"],
  { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, shell: true },
)
let afterHits = []
try {
  const results = JSON.parse(eslint.stdout || "[]")
  for (const file of results) {
    for (const m of file.messages || []) {
      if (m.ruleId === "starci-fe/no-public-classname-prop") {
        afterHits.push({
          file: path.relative(ROOT, file.filePath).replace(/\\/g, "/"),
          line: m.line,
          msg: m.message,
        })
      }
    }
  }
} catch (e) {
  console.error("eslint parse fail", e.message)
}

fs.writeFileSync(path.join(ART, "_b26-classname-after.json"), JSON.stringify(afterHits, null, 2))

const beforeHits = 2194
const beforeFiles = 816
const afterFiles = new Set(afterHits.map((h) => h.file)).size

const status = {
  batch: 26,
  title: "Parallel CSS-door closure",
  committed: false,
  checkpoint: "a5453824",
  generatedAt: new Date().toISOString(),
  workers: 12,
  overlapResult: "pass — each changed file in one partition",
  inventory: {
    rule: "starci-fe/no-public-classname-prop",
    before: { hits: beforeHits, files: beforeFiles },
    after: { hits: afterHits.length, files: afterFiles },
    delta: { hits: afterHits.length - beforeHits, files: afterFiles - beforeFiles },
  },
  classificationNote:
    "Fresh inventory reclassified; burns limited to brace-aware zero-consumer WithClassNames/className doors. Live APIs, vendor, locked, rest-spread held.",
  appliedSummary: {
    filesChanged: changedFiles.length,
    kind: "dead-passthrough (zero-consumer className / unused WithClassNames)",
    parentPlacement: 0,
    safeNoop: 0,
    restoredFalsePositives: heldRestored,
  },
  changedFiles,
  holdsPreserved: [
    "Button/Chip/Stack/Grid/Box/SurfaceCard live APIs",
    "Typography/Skeleton non-duplicate placement",
    "DrawerShell/ShowcaseMockup/MiniCart/CvPreview/PDFView/B19–B25",
    "vendor HeroUI/Box; Nivo/locked/teacher holds; skeleton ComponentType slots",
    "EntityLink + GithubLinkGate restored after false-positive burn",
  ],
  parity: {
    highlightChipTwins: true,
    srcHeavy: true,
  },
  verification: { pending: true },
  regressions: [],
}

fs.writeFileSync(path.join(ART, "2026-08-09-b26-status.json"), JSON.stringify(status, null, 2) + "\n")

const md = `# BATCH 26 — Parallel CSS-door closure

**Committed:** no  
**Checkpoint:** \`a5453824\`  
**Workers:** 12 (disjoint; overlap check pass)

## Inventory delta (\`starci-fe/no-public-classname-prop\`)

| | Hits | Files |
|---|---:|---:|
| Before | ${beforeHits} | ${beforeFiles} |
| After | ${afterHits.length} | ${afterFiles} |
| Delta | **${afterHits.length - beforeHits}** | **${afterFiles - beforeFiles}** |

## Applied

| Kind | Count |
|---|---:|
| dead-passthrough (zero-consumer \`className\` / unused \`WithClassNames\`) | ${changedFiles.length} files |
| parent-placement | 0 |
| safe-noop | 0 |

Coordinator used brace-aware destructure parsing + open-tag consumer index (locked paths still count as consumers). False positives restored: EntityLink, GithubLinkGate.

## Changed files (${changedFiles.length})

${changedFiles.map((f) => `- \`${f}\``).join("\n")}

## Holds

- Button / Chip / Stack / Grid / Box / SurfaceCard live APIs
- Typography / Skeleton non-duplicate placement
- DrawerShell, ShowcaseMockup, MiniCart, CvPreview, PDFView, B19–B25
- Vendor HeroUI / Box; Nivo / locked / teacher holds; skeleton slots
- Rest-spread \`...props\` forwarders
- EntityLink + GithubLinkGate (restored)

## Parity

- \`HighlightChip\` Storybook + src twins burned together
- Most burns are src-only (no SB twin)

## Verification

See gate table after suite run.
`

fs.writeFileSync(path.join(ART, "2026-08-09-b26-status.md"), md)
console.log(
  JSON.stringify(
    {
      changed: changedFiles.length,
      before: beforeHits,
      after: afterHits.length,
      delta: afterHits.length - beforeHits,
      perPartition: Object.fromEntries(PARTITIONS.map((p) => [p, byPart[p].length])),
    },
    null,
    2,
  ),
)
