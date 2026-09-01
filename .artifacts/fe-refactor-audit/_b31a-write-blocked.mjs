import fs from "fs"

const inventory = {
  batch: "B31a",
  phase: "filing-inventory",
  editsAllowed: false,
  checkpoint: {
    head: "18f84f5b15528163e9fca10cfb7252323f02f013",
    subject: "refactor(fe): enforce semantic closure ratchet",
  },
  objective:
    "Promote TopLearners from pages/DashboardPage/TopLearners to blocks/dashboard/TopLearners",
  leaderboardListCardClassNameRemainsOpen: true,
  storybookScan: {
    twin: "none",
    evidence: [
      "rg TopLearners under .storybook → 0 matches",
      "no .storybook/components/starci/blocks/dashboard/TopLearners",
      "no TopLearners.stories.tsx",
    ],
  },
  currentFamily: {
    "src/components/pages/DashboardPage/TopLearners/component.tsx": {
      classification: "presentational shape",
      export: "_TopLearners",
      warningsBefore: {
        errors: 0,
        warnings: 10,
        byRule: {
          "starci-fe/page-folder-two-files-only": 1,
          "starci-fe/no-classname-at-sentence-tier": 1,
          "starci-fe/no-public-classname-prop": 8,
        },
      },
      debts: [
        "WithClassNames / public className",
        "dead className passthrough to LeaderboardListCard",
        "Skeleton className size/placement bars",
        "StackV classNames min-w-0 flex-1",
        "Skeleton.Typography className min-w-0 flex-1",
        "page-folder (clears if moved to blocks/)",
      ],
    },
    "src/components/pages/DashboardPage/TopLearners/index.tsx": {
      classification: "connected data/wiring",
      export: "TopLearners",
      owns: ["useQueryGlobalLeaderboardSwr", "useMutateSetFollowSwr", "i18n labels", "router see-more"],
      warningsBefore: {
        errors: 0,
        warnings: 1,
        byRule: { "starci-fe/page-folder-two-files-only": 1 },
      },
      canonNote:
        "Connected half is valid at block tier (tiers/split.md). Presentational purity keeps fetch in index.tsx after move.",
    },
    "src/components/pages/DashboardPage/TopLearners/TopLearnersSkeleton/index.tsx": {
      classification: "skeleton implementation (orphan twin)",
      export: "TopLearnersSkeleton",
      liveImports: 0,
      warningsBefore: {
        errors: 0,
        warnings: 13,
        byRule: {
          "starci-fe/page-folder-two-files-only": 1,
          "starci-fe/no-skeleton-twin-component": 1,
          "starci-fe/no-heroui-outside-vocabulary": 1,
          "starci-fe/require-identity-root": 1,
          "starci-fe/no-classname-at-sentence-tier": 1,
          "starci-fe/no-public-classname-prop": 7,
          "starci-fe/no-cn-above-vocabulary": 1,
        },
      },
      destinationRecommendation:
        "DELETE — unused; loading is co-located isSkeleton in component.tsx; twin violates no-skeleton-twin-component",
    },
  },
  consumers: {
    astOpenTag: [
      {
        file: "src/components/pages/DashboardPage/CommunityTab/index.tsx",
        line: 25,
        import: 'from "../TopLearners"',
        jsx: "<TopLearners />",
        classNamePassed: false,
      },
    ],
    jsdocOnly: [
      "src/components/pages/DashboardPage/LeagueCard/component.tsx",
      "src/components/pages/DashboardPage/LeagueCard/LeagueCardContent/index.tsx",
      "src/components/pages/LeaguePage/GlobalBoard/index.tsx (prose mention only)",
    ],
    pageOwner: {
      file: "src/components/pages/DashboardPage/index.tsx",
      note: "composes CommunityTab; does not import TopLearners directly",
      warningsBefore: {
        errors: 0,
        warnings: 2,
        byRule: {
          "starci-fe/no-raw-shape-at-sentence-tier": 1,
          "starci-fe/require-frame-self-declare": 1,
        },
      },
      pageFolderExempt: true,
    },
  },
  destinationShapeIfUnblocked: {
    "src/components/blocks/dashboard/TopLearners/component.tsx": "presentational _TopLearners",
    "src/components/blocks/dashboard/TopLearners/index.tsx": "connected TopLearners",
    deleted: [
      "src/components/pages/DashboardPage/TopLearners/**",
      "TopLearnersSkeleton twin (unused)",
    ],
    noCompatibilityBarrelAtOldPath: true,
    communityTabImportAfter:
      'from "@/components/blocks/dashboard/TopLearners"',
  },
  completionBlockers: [
    {
      id: "community-tab-import-ratchet",
      severity: "atomic",
      detail:
        "The only live import site is CommunityTab/index.tsx under pages/DashboardPage/. page-folder-two-files-only always fires on rest=CommunityTab/index.tsx. Import-only edit leaves ≥1 warning. Promoting/inlining CommunityTab is forbidden (no CommunityTab refactor beyond mechanically required import). Therefore no changed-set can include the required import update at 0 warnings.",
      eslint: {
        "starci-fe/page-folder-two-files-only": 1,
        "starci-fe/require-identity-root": 1,
        "starci-fe/no-raw-shape-at-sentence-tier": 1,
      },
      noteOnGap6:
        "block-boundary owns gap step 6 (=gap-6) — raw-shape is fixable with StackV principle=block-boundary + identity, but page-folder remains.",
    },
    {
      id: "top-learners-colocated-skeleton-classname",
      severity: "family-zero-warn",
      detail:
        "After page-folder clears at blocks/, co-located skeleton still passes className to Skeleton bars (size-12 rounded-xl IconTile stand-in, h-3 w-6 rank slot, h-3 w-10 value, h-8 w-24 follow) and classNames to StackV/Typography. Skeleton.Avatar size=lg is size-12 but rounded-full — not exact IconTile chrome. No typed Skeleton.* preserves exact shimmer without redesign. Batch forbids skeleton redesign → stop.",
    },
  ],
  proposedWorkerManifests: {
    "filing-inventory": { sourceEdits: [], status: "complete" },
    "storybook-top-learners": {
      sourceEdits: [],
      status: "hold",
      reason: "no twin/story",
    },
    "src-top-learners-promotion": {
      sourceEdits: [],
      status: "blocked",
      reason: "community-tab-import-ratchet + skeleton classname debt",
    },
    "coordinator-gates": {
      sourceEdits: [
        ".artifacts/fe-refactor-audit/2026-08-09-b31a-inventory.json",
        ".artifacts/fe-refactor-audit/2026-08-09-b31a-status.json",
        ".artifacts/fe-refactor-audit/2026-08-09-b31a-status.md",
        ".artifacts/fe-refactor-audit/2026-08-09-b31a-worker-*.json",
        ".claude/fe/decision-ledger.json",
      ],
    },
  },
  overlapCheck: "pass — no LeaderboardListCard/Nivo/locked edits attempted",
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-09-b31a-inventory.json",
  JSON.stringify(inventory, null, 2),
)

const emptyWorker = (name, extra) => ({
  manifest: [],
  classification: extra.classification || {},
  importsBefore: extra.importsBefore || [],
  importsAfter: null,
  warningsBefore: extra.warningsBefore || {},
  warningsAfter: null,
  changed: [],
  moved: [],
  deleted: [],
  skipped: extra.skipped || [],
  holds: extra.holds || [],
  publicDoorsRemoved: [],
  rawPayloadResiduals: extra.rawPayloadResiduals || [],
  skeletonParity: extra.skeletonParity || "n/a — no product edits",
  storybookParity: extra.storybookParity || "none",
  verification: { productEdits: false },
  regressions: [],
  overlapCheck: "pass",
  ...extra.more,
})

const workers = {
  "filing-inventory": emptyWorker("filing-inventory", {
    classification: inventory.currentFamily,
    importsBefore: inventory.consumers.astOpenTag,
    warningsBefore: {
      component: 10,
      index: 1,
      skeletonTwin: 13,
      communityTab: 3,
    },
    skipped: Object.keys(inventory.currentFamily),
    holds: inventory.completionBlockers.map((b) => b.id),
    more: { status: "complete-read-only" },
  }),
  "storybook-top-learners": emptyWorker("storybook-top-learners", {
    storybookParity: "none",
    holds: ["no TopLearners Storybook twin or story — hold with scan evidence"],
    skipped: [],
    more: { status: "hold-absent" },
  }),
  "src-top-learners-promotion": emptyWorker("src-top-learners-promotion", {
    skipped: [
      "src/components/pages/DashboardPage/TopLearners/component.tsx",
      "src/components/pages/DashboardPage/TopLearners/index.tsx",
      "src/components/pages/DashboardPage/TopLearners/TopLearnersSkeleton/index.tsx",
      "src/components/pages/DashboardPage/CommunityTab/index.tsx",
    ],
    holds: [
      "community-tab-import-ratchet",
      "top-learners-colocated-skeleton-classname",
    ],
    rawPayloadResiduals: [
      "CommunityTab flex flex-col gap-6 (untouched)",
      "TopLearners skeleton Skeleton className bars (untouched)",
    ],
    skeletonParity: "preserved by non-edit",
    more: {
      status: "blocked-no-product-edits",
      leaderboardListCardClassName: "remains-open",
    },
  }),
  "coordinator-gates": emptyWorker("coordinator-gates", {
    changed: [
      ".artifacts/fe-refactor-audit/2026-08-09-b31a-inventory.json",
      ".artifacts/fe-refactor-audit/2026-08-09-b31a-status.json",
      ".artifacts/fe-refactor-audit/2026-08-09-b31a-status.md",
    ],
    more: {
      status: "artifacts-only",
      proofs: {
        oldPathAbsent: false,
        oldPathImports: "unchanged (≥1)",
        compatibilityExports: 0,
        productDiff: "empty",
      },
    },
  }),
}

for (const [name, body] of Object.entries(workers)) {
  fs.writeFileSync(
    `.artifacts/fe-refactor-audit/2026-08-09-b31a-worker-${name}.json`,
    JSON.stringify(body, null, 2),
  )
}

const status = {
  batch: "B31a",
  complete: false,
  status: "blocked",
  checkpoint: inventory.checkpoint,
  productEdits: false,
  retracted: false,
  reason: "atomic completion impossible under touched-file zero-warning ratchet",
  blockers: inventory.completionBlockers,
  publicDoorsRemoved: [],
  leaderboardListCardClassName: "remains open (B31a does not touch LeaderboardListCard)",
  oldTopLearnersPath: "still present — no move performed",
  importsFromOldPath: 1,
  compatibilityExportsAtOldPath: 0,
  changedSetWarnings: "n/a — no product TS/TSX changes",
  overlappingEdits: 0,
  next: [
    "Promote or inline CommunityTab (and/or other DashboardPage nested peers) under an explicit page-folder batch so the TopLearners import site can be zero-warn",
    "Add typed Skeleton vocabulary for IconTile-sized rounded-xl shimmer (and rank/value/follow bars) OR accept a dedicated skeleton-contract batch before TopLearners promotion",
    "Then re-run B31a promotion; LeaderboardListCard.className stays for B31b",
  ],
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-09-b31a-status.json",
  JSON.stringify(status, null, 2),
)

const md = `# BATCH 31a — Promote TopLearners

**Status:** blocked (no product edits)  
**Checkpoint:** \`18f84f5b\` — refactor(fe): enforce semantic closure ratchet

## Verdict

TopLearners cannot move under the touched-file zero-warning ratchet without out-of-band unblocks. **No partial move.** Old path remains. \`LeaderboardListCard.className\` remains open.

## Blockers

### 1. CommunityTab import ratchet (atomic)

Only live JSX consumer:

\`src/components/pages/DashboardPage/CommunityTab/index.tsx\` → \`from "../TopLearners"\`

That file always carries \`page-folder-two-files-only\` (\`rest=CommunityTab/index.tsx\`). An import-only update cannot reach 0 warnings. Promoting/inlining CommunityTab is forbidden in B31a beyond a mechanical import.

### 2. Co-located skeleton \`className\` debt (family zero-warn)

Even after a blocks/ move clears page-folder on TopLearners itself, the presentational \`isSkeleton\` branch still needs \`Skeleton className=\"size-12 … rounded-xl\"\` (and similar bars) with no exact typed \`Skeleton.*\` matching IconTile chrome. Redesign is out of scope → stop.

## Classification

| File | Kind | Destination if unblocked |
|---|---|---|
| \`TopLearners/component.tsx\` | presentational | \`blocks/dashboard/TopLearners/component.tsx\` |
| \`TopLearners/index.tsx\` | connected | \`blocks/dashboard/TopLearners/index.tsx\` |
| \`TopLearnersSkeleton/\` | orphan twin (0 imports) | delete |
| Storybook twin | **none** | hold |

## Proofs (this run)

- old TopLearners path: **present** (unchanged)
- imports from old path: **1** (CommunityTab)
- compatibility exports at old path: **0**
- product TS/TSX diff: **empty**
- \`LeaderboardListCard\` edits: **0**

## Next

1. Explicit page-folder batch for CommunityTab (and peers as needed)
2. Skeleton vocabulary/contract for IconTile-sized shimmer
3. Re-run B31a, then B31b for LeaderboardListCard door
`

fs.writeFileSync(".artifacts/fe-refactor-audit/2026-08-09-b31a-status.md", md)

// ledger
const ledgerPath = ".claude/fe/decision-ledger.json"
const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"))
const id = "b31a-promote-top-learners-2026-08-09"
if (!ledger.decisions.some((d) => d.id === id)) {
  ledger.decisions.push({
    id,
    date: "2026-08-09",
    status: "blocked",
    summary:
      "BATCH 31a: TopLearners promotion blocked. CommunityTab import site cannot hit 0 warnings under page-folder-two-files-only without forbidden CommunityTab refactor; co-located skeleton Skeleton className lacks exact typed vocabulary. No product move. LeaderboardListCard.className remains open.",
    reason:
      "Atomic zero-warning ratchet + forbid on CommunityTab refactor beyond import + skeleton redesign stop.",
    artifact: ".artifacts/fe-refactor-audit/2026-08-09-b31a-status.md",
    next: "page-folder CommunityTab (or inline) batch + IconTile skeleton vocabulary, then re-run B31a",
  })
  fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + "\n")
}

console.log("B31a blocked artifacts written")
