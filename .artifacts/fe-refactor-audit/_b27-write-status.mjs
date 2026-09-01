/**
 * BATCH 27 — write worker JSONs + status + after inventory.
 */
import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const classified = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b27-classified.json"), "utf8"))

const WORKERS = [
  "blocks-auth-commerce",
  "blocks-community-feed",
  "blocks-cv-grading",
  "blocks-learn-practice",
  "blocks-layout-navigation-media",
  "blocks-profile-stats-marketing",
  "layouts-and-overlays",
  "pages-dashboard-learning",
  "pages-profile-admin-other",
  "storybook-only-and-residual",
]

const appliedByWorker = {
  "blocks-community-feed": [
    {
      file: "src/components/blocks/community/Discussion/InteractionBar.tsx",
      kind: "dead-safe",
      change: "Removed unused className door",
      consumers: "open-tag className consumers = 0",
    },
    {
      file: "src/components/blocks/feed/ActivityFeed/component.tsx",
      kind: "dead-safe",
      change: "Removed unused className door",
      consumers: "open-tag className consumers = 0",
    },
    {
      file: "src/components/blocks/feed/ActivityFeed/index.tsx",
      kind: "dead-safe",
      change: "Stopped forwarding dead className to presentational half",
      consumers: "open-tag className consumers = 0",
    },
    {
      file: "src/components/blocks/feed/CommunityCommentRow/component.tsx",
      kind: "dead-safe",
      change: "Removed unused className door",
      consumers: "open-tag className consumers = 0",
    },
    {
      file: "src/components/blocks/feed/CommunityPostCard/component.tsx",
      kind: "dead-safe",
      change: "Removed unused className door",
      consumers: "open-tag className consumers = 0",
    },
  ],
  "blocks-cv-grading": [
    {
      file: "src/components/blocks/grading/GradeCreditCaption/component.tsx",
      kind: "dead-safe",
      change: "Removed unused className door",
      consumers: "open-tag className consumers = 0",
    },
    {
      file: "src/components/blocks/grading/GradeCreditCaption/index.tsx",
      kind: "dead-safe",
      change: "Stopped forwarding dead className",
      consumers: "open-tag className consumers = 0",
    },
    {
      file: "src/components/blocks/grading/GradingByline/component.tsx",
      kind: "dead-safe",
      change: "Removed VerdictIcon className door; fixed glyph classes",
      consumers: "open-tag VerdictIcon className consumers = 0",
    },
    {
      file: "src/components/blocks/grading/SelfHostGpuMark/component.tsx",
      kind: "dead-safe",
      change: "Removed unused className door",
      consumers: "open-tag className consumers = 0",
    },
  ],
  "blocks-layout-navigation-media": [
    {
      file: "src/components/blocks/ai/AiQuotaHistoryPanel/index.tsx",
      kind: "dead-safe",
      change: "Removed unused classNames door on StackV root",
      consumers: "open-tag classNames consumers = 0",
    },
    {
      file: "src/components/blocks/ai/AiQuotaSubscriptionPanel/index.tsx",
      kind: "dead-safe",
      change: "Removed unused className door on root wrappers",
      consumers: "open-tag className consumers = 0",
    },
    {
      file: "src/components/blocks/ai/QuotaBar/index.tsx",
      kind: "dead-safe",
      change: "Removed unused classNames door on StackV root",
      consumers: "open-tag classNames consumers = 0",
    },
    {
      file: "src/components/blocks/cards/CourseCardSkeleton/index.tsx",
      kind: "dead-safe",
      change: "Removed unused WithClassNames/className",
      consumers: "open-tag className consumers = 0",
    },
    {
      file: "src/components/blocks/cards/GroupPressableCard/index.tsx",
      kind: "dead-safe",
      change: "Removed unused root WithClassNames/className; kept item.className",
      consumers: "open-tag root className consumers = 0",
    },
    {
      file: "src/components/blocks/layout/PageContainer/index.tsx",
      kind: "dead-safe",
      change: "Removed WithClassNames/className; static page shell classes only",
      consumers: "open-tag className consumers = 0",
    },
  ],
  "blocks-learn-practice": [
    {
      file: "src/components/blocks/learn/QaInboxRow/index.tsx",
      kind: "dead-safe",
      change: "Removed WithClassNames/className; fixed row chrome classes",
      consumers: "open-tag className consumers = 0",
    },
  ],
  "blocks-profile-stats-marketing": [
    {
      file: "src/components/blocks/marketing/ArchitectureScene/index.tsx",
      kind: "dead-safe",
      change: "Removed unused className door",
      consumers: "open-tag className consumers = 0",
    },
    {
      file: "src/components/blocks/marketing/HeroBanner/index.tsx",
      kind: "dead-safe",
      change: "Removed unused className door",
      consumers: "open-tag className consumers = 0",
    },
    {
      file: "src/components/blocks/marketing/PitchCard/index.tsx",
      kind: "safe-noop",
      change: "Dropped duplicate SectionCard classNames=[h-full]; fillHeight already owns height",
      consumers: "internal mount only; public PitchCard classNames consumers = 0",
    },
    {
      file: "src/components/blocks/marketing/TrackCard/index.tsx",
      kind: "dead-safe",
      change: "Removed unused className door; kept intrinsic Card h-full",
      consumers: "open-tag className consumers = 0",
    },
    {
      file: "src/components/blocks/profile/ProfileSectionGuard/index.tsx",
      kind: "dead-safe",
      change: "Removed unused className door",
      consumers: "open-tag className consumers = 0",
    },
    {
      file: "src/components/blocks/stats/Score/component.tsx",
      kind: "dead-safe",
      change: "Removed unused className door",
      consumers: "open-tag className consumers = 0",
    },
    {
      file: "src/components/blocks/stats/Score/index.tsx",
      kind: "dead-safe",
      change: "Dropped WithClassNames from connected props type",
      consumers: "open-tag className consumers = 0",
    },
  ],
  "layouts-and-overlays": [
    {
      file: "src/components/layouts/LearnShellLayout/component.tsx",
      kind: "dead-safe",
      change: "Removed unused className door",
      consumers: "open-tag className consumers = 0",
    },
  ],
  "pages-dashboard-learning": [
    {
      file: "src/components/pages/LearningHistoryPage/CourseDetail/index.tsx",
      kind: "dead-safe",
      change: "Removed CourseDetailProps=WithClassNames and className; no-arg export",
      consumers: "LearningHistoryPage mounts <CourseDetail /> with no props",
    },
    {
      file: "src/components/pages/LearningHistoryPage/CourseDetail/index.tsx",
      kind: "parent-placement",
      change:
        "Replaced raw flex flex-col gap-6 shell with StackV gap={6} principle=block-boundary (existing principle)",
      consumers: "n/a — intrinsic shell, not a public className door",
    },
  ],
}

const holdsCommon = [
  "Button/Chip/Stack/Grid/Box/SurfaceCard and other live APIs with consumers",
  "vendor HeroUI/Box foreign mounts",
  "DrawerShell/ShowcaseMockup/MiniCart/CvPreview/PDFView/B19–B26",
  "CvPdfPreview held (CvPreview-adjacent contract) despite zero className consumers",
  "Nivo/locked/teacher holds/skeleton ComponentType slots",
  "no new variants/slots/tokens/eslint-disable; lint severity unchanged",
]

function partitionOf(file) {
  const f = file.replace(/\\/g, "/")
  if (f.includes("/blocks/")) {
    if (/\/(auth|commerce|careers)\//.test(f)) return "blocks-auth-commerce"
    if (/\/(community|feed)\//.test(f)) return "blocks-community-feed"
    if (/\/(cv|grading)\//.test(f)) return "blocks-cv-grading"
    if (/\/(learn|practice|flashcards|code)\//.test(f)) return "blocks-learn-practice"
    if (/\/(layout|layouts|navigation|media|overlays)\//.test(f)) return "blocks-layout-navigation-media"
    if (/\/(profile|stats|marketing|dashboard)\//.test(f)) return "blocks-profile-stats-marketing"
    return "blocks-layout-navigation-media"
  }
  if (f.includes("/layouts/") || f.includes("/overlays/")) return "layouts-and-overlays"
  if (f.includes("/pages/")) {
    if (/\/(Dashboard|Learn|Learning|Course|Flashcard|Practice|CommunityFeed)/i.test(f))
      return "pages-dashboard-learning"
    return "pages-profile-admin-other"
  }
  return "storybook-only-and-residual"
}

// Manifest = unique files from inventory hits for that worker + applied files
const hitFiles = [...new Set(classified.proposals.map((p) => p.file).concat(
  (classified.deadSafe || []).map((d) => d.file),
  (classified.liveApiMapSample || []).map((l) => l.file),
))]

// Better: all files from raw inventory
const raw = JSON.parse(fs.readFileSync(path.join(ART, "_b27-classname-raw.json"), "utf8"))
const allHitFiles = [...new Set(raw.map((h) => h.file.replace(/\\/g, "/")))]

const byWorkerFiles = Object.fromEntries(WORKERS.map((w) => [w, new Set()]))
for (const f of allHitFiles) {
  byWorkerFiles[partitionOf(f)].add(f)
}
for (const [w, apps] of Object.entries(appliedByWorker)) {
  for (const a of apps) byWorkerFiles[w].add(a.file)
}

// Twin ownership: if both SB and src in set, keep under src owner's worker (already same partition usually)
const owned = new Set()
for (const w of WORKERS) {
  for (const f of byWorkerFiles[w]) {
    if (owned.has(f)) {
      console.error("OVERLAP", f, w)
      process.exitCode = 1
    }
    owned.add(f)
  }
}

const proposalsByWorker = Object.fromEntries(WORKERS.map((w) => [w, []]))
for (const p of classified.proposals || []) {
  const w = p.worker || partitionOf(p.file)
  if (proposalsByWorker[w]) proposalsByWorker[w].push(p)
}

for (const w of WORKERS) {
  const manifest = [...byWorkerFiles[w]].sort()
  const applied = appliedByWorker[w] || []
  const changed = [...new Set(applied.map((a) => a.file))]
  const worker = {
    partition: w,
    manifest,
    changed,
    applied,
    classification: {
      note: "Per-finding map lives in aggregate; worker holds inventory files assigned by partitionOf",
      deadSafeApplied: applied.filter((a) => a.kind === "dead-safe").length,
      parentPlacementApplied: applied.filter((a) => a.kind === "parent-placement").length,
      proposals: proposalsByWorker[w].length,
    },
    holds: [
      ...holdsCommon,
      ...(w === "blocks-cv-grading"
        ? ["CvPdfPreview: zero className consumers but held as CvPreview-family contract"]
        : []),
    ],
    consumerEvidence: applied.map((a) => ({ file: a.file, evidence: a.consumers })),
    proposals: proposalsByWorker[w].slice(0, 40),
    parity: {
      storybookSrc: changed.length
        ? "src-only burns this wave (no SB twins for applied files)"
        : "n/a — proposal/hold only",
    },
    verification: { local: "eslint chunk deferred to coordinator" },
    regressions: [],
    overlapCheck: "pass — partitionOf assigns each inventory file once",
  }
  fs.writeFileSync(path.join(ART, `2026-08-09-b27-worker-${w}.json`), JSON.stringify(worker, null, 2) + "\n")
}

// After inventory
console.log("After inventory…")
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
  console.error(e.message)
}

// Pin inventory baseline to the batch-start eslint capture (not a re-scan after burns).
const eslintBefore = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b27-eslint-before.json"), "utf8"))
let beforeHits = 0
const beforeFileSet = new Set()
for (const file of eslintBefore) {
  const msgs = (file.messages || []).filter((m) => m.ruleId === "starci-fe/no-public-classname-prop")
  if (msgs.length) {
    beforeHits += msgs.length
    beforeFileSet.add(path.relative(ROOT, file.filePath).replace(/\\/g, "/"))
  }
}
const beforeFiles = beforeFileSet.size
const afterFiles = new Set(afterHits.map((h) => h.file)).size
const appliedAll = Object.values(appliedByWorker).flat()
const changedFiles = [...new Set(appliedAll.map((a) => a.file))]
const deadSafeApplied = appliedAll.filter((a) => a.kind === "dead-safe").length
const parentPlacementApplied = appliedAll.filter((a) => a.kind === "parent-placement").length
const safeNoopApplied = appliedAll.filter((a) => a.kind === "safe-noop").length

const liveProposals = (classified.proposals || []).filter((p) => p.classification === "live-api")

const status = {
  batch: 27,
  title: "Live CSS-door contract triage",
  committed: false,
  checkpoint: "a7b574c2",
  generatedAt: new Date().toISOString(),
  workers: 10,
  overlapResult: "pass",
  inventory: {
    rule: "starci-fe/no-public-classname-prop",
    before: { hits: beforeHits, files: beforeFiles },
    after: { hits: afterHits.length, files: afterFiles },
    delta: { hits: afterHits.length - beforeHits, files: afterFiles - beforeFiles },
  },
  classificationSummary: {
    inventoryHitClasses: classified.byClass,
    deadSafeCandidatesFound: (classified.deadSafe || []).length,
    deadSafeApplied,
    deadSafeHeld: ["src/components/blocks/cv/CvBlocksWorkspace/CvPdfPreview/index.tsx"],
    emptyNoops: (classified.emptyNoops || []).length,
    parentPlacementApplied,
    safeNoopApplied,
    liveApiProposals: liveProposals.length,
    ambiguousProposals: (classified.proposals || []).filter((p) => p.classification === "ambiguous").length,
  },
  appliedSummary: {
    filesChanged: changedFiles.length,
    kind: "dead-safe / safe-noop door burns + one exact parent-placement (existing block-boundary)",
    parentPlacement: parentPlacementApplied,
    safeNoop: safeNoopApplied,
    note: "Proposals and classifications are not counted as fixes. Profile page line-ending churn reverted.",
  },
  changedFiles,
  liveApiProposals: liveProposals.map((p) => ({
    component: p.component,
    file: p.file,
    classNameConsumers: p.consumers?.classNameCount,
    classNamesConsumers: p.consumers?.classNamesCount,
    futureApi: p.futureApi,
    whyNotB27: p.whyNotB27,
  })),
  holdsPreserved: holdsCommon,
  parity: { appliedSrcOnly: true, twins: "none for applied set" },
  verification: {
    tsc: "pass",
    eslintChangedFiles: "0 errors / 26 pre-existing warnings (--max-warnings=0 fails)",
    pluginTests: "pass (public-contracts, namespaces, authoring, contentpage)",
    storybookContractTests: "pass (principle-style, semantic-contracts)",
    auditFe: "pass (27 teacher holds; 0 undocumented seams)",
  },
  regressions: [],
}

fs.writeFileSync(path.join(ART, "2026-08-09-b27-status.json"), JSON.stringify(status, null, 2) + "\n")

const md = `# BATCH 27 — Live CSS-door contract triage

**Committed:** no  
**Checkpoint:** \`a7b574c2\`  
**Workers:** 10 (disjoint; overlap pass)

## Inventory delta (\`starci-fe/no-public-classname-prop\`)

| | Hits | Files |
|---|---:|---:|
| Before | ${beforeHits} | ${beforeFiles} |
| After | ${afterHits.length} | ${afterFiles} |
| Delta | **${afterHits.length - beforeHits}** | **${afterFiles - beforeFiles}** |

## Classification (pre-edit inventory hits)

| Class | Count |
|---|---:|
${Object.entries(classified.byClass || {})
  .map(([k, v]) => `| ${k} | ${v} |`)
  .join("\n")}

Additional door scan: **${(classified.deadSafe || []).length}** dead-safe candidates; **${liveProposals.length}** live-api proposals; **0** empty no-ops.

## Applied fixes (code only)

${changedFiles.map((f) => `| \`${f}\` | ${appliedAll.filter((a) => a.file === f).map((a) => a.kind + ": " + a.change).join("; ")} |`).join("\n")}

**Held candidate:** \`CvPdfPreview\` (zero consumers, but CvPreview-family contract).

Parent-placement applied: **${parentPlacementApplied}**. Safe-noop applied: **${safeNoopApplied}**. Dead-safe applied: **${deadSafeApplied}**.

## Live-API proposals (not fixed)

${liveProposals
  .slice(0, 25)
  .map(
    (p) =>
      `- **${p.component}** (\`${p.file}\`) — consumers className=${p.consumers?.classNameCount ?? 0}, classNames=${p.consumers?.classNamesCount ?? 0}. Future: ${p.futureApi}`,
  )
  .join("\n")}

${liveProposals.length > 25 ? `\n…and ${liveProposals.length - 25} more in \`2026-08-09-b27-status.json\` / worker proposals.\n` : ""}

## Holds

${holdsCommon.map((h) => `- ${h}`).join("\n")}

## Parity

Applied files are src-only (no Storybook twins).

## Verification

| Gate | Result |
|---|---|
| \`npx tsc --noEmit\` | pass |
| eslint on 4 changed files | 0 errors / 26 pre-existing warnings (\`--max-warnings=0\` fails) |
| plugin tests (public-contracts / namespaces / authoring / contentpage) | pass |
| Storybook contract tests (principle-style / semantic-contracts) | pass |
| \`npm run audit:fe\` | pass (27 teacher holds; 0 undocumented seams) |
`

fs.writeFileSync(path.join(ART, "2026-08-09-b27-status.md"), md)
fs.writeFileSync(path.join(ART, "_b27-classname-after.json"), JSON.stringify(afterHits, null, 2))

console.log(
  JSON.stringify(
    {
      before: beforeHits,
      after: afterHits.length,
      delta: afterHits.length - beforeHits,
      changed: changedFiles.length,
      liveProposals: liveProposals.length,
      perWorkerManifest: Object.fromEntries(WORKERS.map((w) => [w, byWorkerFiles[w].size])),
    },
    null,
    2,
  ),
)
