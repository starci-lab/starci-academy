/**
 * BATCH 30 — write worker JSONs, status, run after-inventory.
 */
import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const scan = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b30-consumer-scan.json"), "utf8"))

const workers = {
  "tier-card": {
    manifest: [
      "src/components/blocks/commerce/TierCardBase/index.tsx",
      "src/components/blocks/commerce/TierCard/index.tsx",
      "src/components/blocks/commerce/FreeTierCard/index.tsx",
    ],
    openTagConsumers: scan.TierCardBase?.consumers ?? [],
    valueSet: { before: ["border-accent ring-2 ring-accent/30"], after: [] },
    ownership: {
      "border-accent ring-2 ring-accent/30": "intrinsic merchandising → isFeatured",
    },
    oldApi: "className?: string (WithClassNames)",
    newApi: "isFeatured?: boolean",
    changed: [
      "src/components/blocks/commerce/TierCardBase/index.tsx",
      "src/components/blocks/commerce/TierCard/index.tsx",
    ],
    holds: [],
    parity: { TierCardBase: "src-only (no SB twin)", FreeTierCard: "unchanged (no featured chrome)" },
    verification: { tsc: "pending-coordinator" },
    regressions: [],
    overlapCheck: "pending",
  },
  "list-row": {
    manifest: [
      "src/components/blocks/lists/ListRow/index.tsx",
      "src/components/blocks/lists/ListRow/README.md",
      "src/components/blocks/feedback/ReadinessChecklist/index.tsx",
    ],
    openTagConsumers: [
      {
        file: "src/components/blocks/feedback/ReadinessChecklist/index.tsx",
        normalized: "p-3",
        note: "sole live root className before migration",
      },
    ],
    valueSet: { before: ["p-3"], after: [] },
    ownership: { "p-3": "intrinsic density → density=comfortable" },
    oldApi: "className?: string",
    newApi: 'density?: "default" | "comfortable"',
    changed: [
      "src/components/blocks/lists/ListRow/index.tsx",
      "src/components/blocks/lists/ListRow/README.md",
      "src/components/blocks/feedback/ReadinessChecklist/index.tsx",
    ],
    holds: [],
    parity: { ListRow: "src-only (no SB twin)" },
    verification: { tsc: "pending-coordinator" },
    regressions: [],
    overlapCheck: "pending",
  },
  "button-group": {
    manifest: [
      "src/components/blocks/navigation/FlexWrapButtonRadio/index.tsx",
      "src/components/atoms/buttons/ButtonGroup/index.tsx",
      ".storybook/components/atoms/buttons/ButtonGroup/ButtonGroup.tsx",
      ".storybook/components/nivoexpert/blocks/studio/ConfirmDialog/ConfirmDialog.tsx",
      ".storybook/components/nivoexpert/overlays/modals/RefundOrderModal/RefundOrderModal.tsx",
      "src/components/composites/buttons/ButtonGroup/index.tsx",
    ],
    openTagConsumers: scan.ButtonGroup?.consumers ?? [],
    valueSet: {
      before: ["w-fit", "!top-0 !h-full !bg-border !opacity-100", "w-full"],
      after: ["w-full"],
    },
    ownership: {
      "w-fit": "baked into ButtonGroupRoot; FlexWrap migrated to house atoms",
      "!top-0 !h-full !bg-border !opacity-100": "already baked into ButtonGroupSeparator; FlexWrap uses atom",
      "w-full": "parent placement on composite ButtonGroup — held (nivoexpert)",
    },
    oldApi: "HeroUI ButtonGroup className + Separator className; composite classNames",
    newApi: "ButtonGroupRoot + ButtonGroupSeparator (no CSS doors); composite classNames residual hold",
    changed: ["src/components/blocks/navigation/FlexWrapButtonRadio/index.tsx"],
    holds: [
      {
        component: "ButtonGroup (composite)",
        reason: "Nivoexpert ConfirmDialog + RefundOrderModal keep classNames=['w-full']; RefundOrderModal explicitly not edited; root door remains live",
        files: [
          ".storybook/components/nivoexpert/blocks/studio/ConfirmDialog/ConfirmDialog.tsx",
          ".storybook/components/nivoexpert/overlays/modals/RefundOrderModal/RefundOrderModal.tsx",
        ],
      },
    ],
    parity: {
      ButtonGroupSeparator: "SB atom twin already baked identical chrome (no edit)",
      ButtonGroupRoot: "SB atom twin already has w-fit baked (no edit)",
    },
    verification: { tsc: "pending-coordinator" },
    regressions: [],
    overlapCheck: "pending",
  },
  "tabs-card": {
    manifest: [
      "src/components/blocks/learn/lesson/ContentTabBar/index.tsx",
      "src/components/pages/ArchitecturePage/ArchitectureMap/index.tsx",
      "src/components/pages/FlashcardsPage/index.tsx",
      "src/components/pages/NotificationsPage/index.tsx",
      "src/components/pages/FlashcardsPage/QuizSession/index.tsx",
      "src/components/blocks/navigation/TabsCard/index.tsx",
    ],
    openTagConsumers: scan.TabsCard?.consumers ?? [],
    valueSet: {
      before: ["mx-auto w-full max-w-3xl", "w-full max-w-xs", "w-full", "overflow-x-auto"],
      after: ["w-full"],
    },
    ownership: {
      "mx-auto w-full max-w-3xl": "parent Container size=md (max-w-app-md ≡ 48rem)",
      "w-full max-w-xs": "parent Box exact className (no Container size for 20rem)",
      "w-full": "parent Box on FlashcardsPage; QuizSession locked residual",
      "overflow-x-auto": "parent Box principle=reel",
    },
    oldApi: "TabsCard className door (unchanged API; residual locked consumer)",
    newApi: "no new TabsCard props; parent Container/Box placement only",
    changed: [
      "src/components/blocks/learn/lesson/ContentTabBar/index.tsx",
      "src/components/pages/ArchitecturePage/ArchitectureMap/index.tsx",
      "src/components/pages/FlashcardsPage/index.tsx",
      "src/components/pages/NotificationsPage/index.tsx",
    ],
    holds: [
      {
        component: "TabsCard",
        reason: "Locked QuizSession keeps className=\"w-full\"; door remains live; not edited",
        file: "src/components/pages/FlashcardsPage/QuizSession/index.tsx",
      },
    ],
    parity: { TabsCard: "src-only consumers; no SB twin edits" },
    verification: { tsc: "pending-coordinator" },
    regressions: [],
    overlapCheck: "pending",
  },
  "leaderboard-list-card": {
    manifest: [
      "src/components/blocks/dashboard/LeaderboardListCard/index.tsx",
      "src/components/pages/DashboardPage/TopLearners/component.tsx",
    ],
    openTagConsumers: [
      {
        file: "src/components/pages/DashboardPage/TopLearners/component.tsx",
        normalized: "className",
        note: "passthrough only; never painted on non-bare LabeledCard path; no live bare consumers",
      },
    ],
    valueSet: { before: ["className passthrough (dead)"], after: [] },
    ownership: {
      className: "root placement door unused — deleted; TopLearners dropped passthrough",
    },
    oldApi: "LeaderboardListCard className + TopLearners WithClassNames passthrough",
    newApi: "no className door",
    changed: [
      "src/components/blocks/dashboard/LeaderboardListCard/index.tsx",
      "src/components/pages/DashboardPage/TopLearners/component.tsx",
    ],
    holds: [],
    parity: { LeaderboardListCard: "src-only" },
    verification: { tsc: "pending-coordinator" },
    regressions: [],
    overlapCheck: "pending",
  },
  "sidebar-labeled-list": {
    manifest: [
      "src/components/blocks/navigation/SidebarNavItem/index.tsx",
      "src/components/blocks/lists/LabeledList/index.tsx",
    ],
    openTagConsumers: [],
    valueSet: {
      beforeApparent: {
        SidebarNavItem: "nested icon/Badge classes only (brace-aware → 0)",
        LabeledList: "nested Button classNames self-start only (brace-aware → 0)",
      },
      after: [],
    },
    ownership: {
      door: "zero real open-tag consumers → delete className doors",
    },
    oldApi: "className?: string on both",
    newApi: "no public CSS door",
    changed: [
      "src/components/blocks/navigation/SidebarNavItem/index.tsx",
      "src/components/blocks/lists/LabeledList/index.tsx",
    ],
    holds: [],
    parity: {
      SidebarNavItem: "Nivo SB twin already doorless (separate component; not edited)",
      LabeledList: "src-only (no SB twin)",
    },
    verification: { tsc: "pending-coordinator" },
    regressions: [],
    overlapCheck: "pending",
  },
  "section-card-surface": {
    manifest: [
      "src/components/blocks/cards/SectionCard/index.tsx",
      "src/components/composites/cards/SurfaceCard/index.tsx",
      "src/components/composites/cards/SurfaceCard/surface-card-header.tsx",
      "src/components/blocks/learn/QuizCard/index.tsx",
    ],
    openTagConsumers: scan.SectionCard?.consumers ?? [],
    valueSet: { SectionCard: ["classNames passthrough from QuizCard"] },
    ownership: {
      decision: "HOLD — SurfaceCard cannot honestly replace SectionCard without new contracts",
    },
    oldApi: "SectionCard owns duplicated card skin + classNames door",
    newApi: "unchanged (hold)",
    changed: [],
    holds: [
      {
        component: "SectionCard",
        missingContracts: [
          "accent boolean → SurfaceCard has isHighlight (sweep) / isSelected (ring), not border-accent face",
          "withVerdict on card root → SurfaceCard.Base has no verdict band; only PressableGroup/List item rows",
          "in-card header (icon ComponentType + title + action) with border-b separator → SurfaceCard header is outside-above, string label only, no icon slot",
          "contentGap?: AllowedGap → no SurfaceCard equivalent",
          "fillHeight?: boolean → no SurfaceCard equivalent on content wrapper",
          "contentAlign?: LayoutAlign → no SurfaceCard equivalent",
          "DOM semantics (Box root + StackV body) vs SurfaceCard slot/pressable tree — not 1:1",
          "SectionCard has no isSkeleton; SurfaceCard skeleton model differs — not a migration blocker alone but confirms different contracts",
        ],
        note: "identity exists on both; do not invent SectionCard classNames replacement",
      },
      {
        component: "QuizCard",
        reason: "Independent classNames forward to SectionCard — held separately; not hidden in a new variant",
      },
    ],
    parity: { SectionCard: "hold — no SB/src edit" },
    verification: { audit: "compatibility matrix recorded; no product edit" },
    regressions: [],
    overlapCheck: "pending",
  },
}

// overlap
const owner = new Map()
const overlaps = []
for (const [name, data] of Object.entries(workers)) {
  for (const f of data.manifest) {
    if (owner.has(f)) overlaps.push({ file: f, a: owner.get(f), b: name })
    else owner.set(f, name)
  }
}
for (const data of Object.values(workers)) {
  data.overlapCheck = overlaps.length ? "fail" : "pass"
}

for (const [name, data] of Object.entries(workers)) {
  fs.writeFileSync(path.join(ART, `2026-08-09-b30-worker-${name}.json`), JSON.stringify(data, null, 2) + "\n")
}

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
  console.error("inventory parse", e.message)
}

const beforeHits = 1536
const beforeFiles = 562
const changed = [
  ...new Set(
    Object.values(workers)
      .flatMap((w) => w.changed)
      .map((f) => f.replace(/\\/g, "/")),
  ),
].sort()

const coordinator = {
  manifest: [
    ".artifacts/fe-refactor-audit/2026-08-09-b30-status.json",
    ".artifacts/fe-refactor-audit/2026-08-09-b30-status.md",
    ".artifacts/fe-refactor-audit/2026-08-09-b30-consumer-scan.json",
    ".claude/fe/decision-ledger.json",
  ],
  openTagConsumers: [],
  valueSet: {},
  ownership: { role: "aggregate + ledger + verification only" },
  oldApi: "n/a",
  newApi: "n/a",
  changed: [],
  holds: [
    "TabsCard door live (QuizSession)",
    "composite ButtonGroup classNames live (nivoexpert)",
    "SectionCard + QuizCard classNames hold",
  ],
  parity: {
    StorybookFirst: "ButtonGroup atom chrome already SB=src; no new SB components this batch",
    srcMirrors: "TierCardBase/ListRow/doors are src-only",
  },
  verification: {},
  regressions: [],
  overlapCheck: overlaps.length ? "fail" : "pass",
  overlaps,
}
fs.writeFileSync(
  path.join(ART, "2026-08-09-b30-worker-coordinator-verification.json"),
  JSON.stringify(coordinator, null, 2) + "\n",
)

const doorsRemoved = [
  "TierCardBase.className",
  "ListRow.className",
  "LeaderboardListCard.className",
  "SidebarNavItem.className",
  "LabeledList.className",
  "FlexWrap HeroUI ButtonGroup/Separator className usage (migrated to doorless atoms)",
]
const semanticPropsAdded = [
  'TierCardBase.isFeatured?: boolean',
  'ListRow.density?: "default" | "comfortable"',
]
const parentMigrations = [
  "ContentTabBar → Container size=md",
  "ArchitectureMap → Box w-full max-w-xs",
  "FlashcardsPage overview TabsCard → Box w-full",
  "NotificationsPage TabsCard → Box principle=reel overflow-x-auto",
]

const status = {
  batch: 30,
  title: "Card, list, and navigation contract closure",
  committed: false,
  checkpoint: "8c13fd52",
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
  doorsRemoved,
  residualLiveDoors: [
    { component: "TabsCard", reason: "locked QuizSession className=w-full" },
    { component: "ButtonGroup (composite)", reason: "nivoexpert ConfirmDialog + RefundOrderModal classNames=w-full" },
    { component: "SectionCard", reason: "held; QuizCard forwards classNames" },
  ],
  semanticPropsAdded,
  parentPlacementMigrations: parentMigrations,
  sectionCardDecision: "HOLD — missing SurfaceCard contracts listed in section-card-surface worker",
  storybookSrcParity: {
    ButtonGroupSeparator: "already matched pre-batch",
    TierCardBase: "src-only",
    ListRow: "src-only",
    SidebarNavItem: "Nivo SB twin already doorless; src door burned",
  },
  changed,
  workersDetail: Object.keys(workers).concat(["coordinator-verification"]),
}

fs.writeFileSync(path.join(ART, "2026-08-09-b30-status.json"), JSON.stringify(status, null, 2) + "\n")

const md = `# BATCH 30 — Card, list, and navigation contract closure

**Committed:** no  
**Checkpoint:** \`8c13fd52\`  
**Workers:** 8 (overlap ${status.overlapResult})

## Inventory delta (\`starci-fe/no-public-classname-prop\`)

| | Hits | Files |
|---|---:|---:|
| Before | ${beforeHits} | ${beforeFiles} |
| After | ${afterHits} | ${afterFiles.size} |
| Delta | **${afterHits - beforeHits}** | **${afterFiles.size - beforeFiles}** |

## Doors removed
${doorsRemoved.map((d) => `- ${d}`).join("\n")}

## Semantic props added
${semanticPropsAdded.map((d) => `- \`${d}\``).join("\n")}

## Parent-placement migrations
${parentMigrations.map((d) => `- ${d}`).join("\n")}

## Residual live / locked doors
- **TabsCard** — locked QuizSession \`className="w-full"\` (not edited)
- **ButtonGroup (composite)** — nivoexpert ConfirmDialog + RefundOrderModal \`classNames=["w-full"]\` (RefundOrderModal explicit hold; door not claimed closed)
- **SectionCard** — HOLD; QuizCard independently forwards \`classNames\`

## SectionCard decision
**HOLD.** SurfaceCard cannot compose SectionCard while preserving accent face, root verdict band, in-card icon/title/action header, contentGap, fillHeight, contentAlign, and DOM semantics. Exact missing-contract list in \`2026-08-09-b30-worker-section-card-surface.json\`. No new SectionCard classNames replacement. QuizCard door held separately.

## Storybook / src parity
- Atom \`ButtonGroupRoot\` / \`ButtonGroupSeparator\` chrome already baked identically in SB + src (no twin edit this batch).
- TierCardBase, ListRow, LeaderboardListCard, LabeledList are src-only.
- SidebarNavItem src door burned; Nivo SB twin was already doorless.

## Overlap
\`${status.overlapResult}\`${overlaps.length ? "\\n" + JSON.stringify(overlaps, null, 2) : ""}

## Changed files
${changed.map((f) => `- \`${f}\``).join("\n")}
`

fs.writeFileSync(path.join(ART, "2026-08-09-b30-status.md"), md)
console.log(JSON.stringify(status.inventory, null, 2))
console.log("overlap", status.overlapResult, "changed", changed.length)
