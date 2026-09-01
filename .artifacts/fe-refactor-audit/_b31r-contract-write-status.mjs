import fs from "fs"

const inv = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-09-b31r-contract-inventory.json", "utf8"),
)

const workerBase = {
  changed: [],
  held: [],
  retracted: [],
  storybookParity: "unchanged",
  verification: { productEdits: false },
  regressions: [],
  overlapCheck: "pass",
}

const workers = {
  "icontile-contract-inventory": {
    ...workerBase,
    manifest: [".artifacts/fe-refactor-audit/2026-08-09-b31r-contract-inventory.json"],
    sizeEvidence: inv.sizeMaps,
    radiusEvidence: {
      atomAllSizes: "rounded-full",
      blockSm: "rounded-xl",
      blockMdLg: "rounded-2xl",
      proposed: inv.proposedCanonicalMap,
    },
    consumerCountBefore: inv.consumerCount,
    consumerCountAfter: inv.consumerCount,
    oldPathsBefore: inv.oldPaths,
    oldPathsAfter: inv.oldPaths,
    canonicalPath: inv.canonicalPathProposed,
    canonicalTier: "composite (proposed; not applied)",
    skeletonContract: {
      atom: "isSkeleton present",
      block: "absent",
      proposed: "isSkeleton per size on canonical composite",
    },
    held: inv.completionForecast.primaryBlockers,
    changed: [".artifacts/fe-refactor-audit/2026-08-09-b31r-contract-inventory.json"],
    summary: inv.summary,
  },
  "storybook-canonical": {
    ...workerBase,
    manifest: [],
    sizeEvidence: inv.proposedCanonicalMap,
    radiusEvidence: inv.proposedCanonicalMap,
    consumerCountBefore: null,
    consumerCountAfter: null,
    oldPathsBefore: inv.oldPaths,
    oldPathsAfter: inv.oldPaths,
    canonicalPath: ".storybook/components/composites/identity/IconTile (not created)",
    canonicalTier: "composite",
    skeletonContract: "not applied",
    held: [
      "Phase 1 proved atomic completion impossible — do not author SB composite until contract conflicts + nivo unlock resolved",
    ],
  },
  "src-canonical": {
    ...workerBase,
    manifest: [],
    sizeEvidence: inv.proposedCanonicalMap,
    radiusEvidence: inv.proposedCanonicalMap,
    consumerCountBefore: null,
    consumerCountAfter: null,
    oldPathsBefore: inv.oldPaths,
    oldPathsAfter: inv.oldPaths,
    canonicalPath: "src/components/composites/identity/IconTile (not created)",
    canonicalTier: "composite",
    skeletonContract: "not applied",
    held: ["blocked with storybook-canonical"],
  },
  "consumer-migration-a": {
    ...workerBase,
    manifest: [],
    sizeEvidence: {
      unlocked: inv.summary.byLockStatus["unlocked-candidate"],
      conflicts: inv.summary.sizeMapConflicts,
      blockSmToMd: inv.summary.blockSmMustBecomeMd,
    },
    radiusEvidence: {},
    consumerCountBefore: inv.consumerCount,
    consumerCountAfter: inv.consumerCount,
    oldPathsBefore: inv.oldPaths,
    oldPathsAfter: inv.oldPaths,
    canonicalPath: null,
    canonicalTier: null,
    skeletonContract: null,
    held: [
      "no migration — canonical composite not landed",
      "15 CONFLICT size remaps need separate approved decision",
    ],
  },
  "consumer-migration-b": {
    ...workerBase,
    manifest: [],
    sizeEvidence: {
      lockedNivo: inv.summary.lockedNivo,
      pageFolderLikely: inv.summary.pageFolderLikely,
      leaderboardListCard: inv.summary.leaderboardListCard,
    },
    radiusEvidence: {},
    consumerCountBefore: inv.consumerCount,
    consumerCountAfter: inv.consumerCount,
    oldPathsBefore: inv.oldPaths,
    oldPathsAfter: inv.oldPaths,
    canonicalPath: null,
    canonicalTier: null,
    skeletonContract: null,
    held: [
      "nivo/nivoexpert locked — cannot edit",
      "page-folder consumers — cannot zero-warn",
      "LeaderboardListCard internals forbidden",
    ],
  },
  "coordinator-gates": {
    ...workerBase,
    manifest: [
      ".artifacts/fe-refactor-audit/2026-08-09-b31r-contract-inventory.json",
      ".artifacts/fe-refactor-audit/2026-08-09-b31r-contract-status.json",
      ".artifacts/fe-refactor-audit/2026-08-09-b31r-contract-status.md",
      ".claude/fe/decision-ledger.json",
    ],
    sizeEvidence: inv.summary,
    radiusEvidence: inv.proposedCanonicalMap,
    consumerCountBefore: inv.consumerCount,
    consumerCountAfter: inv.consumerCount,
    oldPathsBefore: inv.oldPaths,
    oldPathsAfter: inv.oldPaths,
    canonicalPath: "not created",
    canonicalTier: "composite (decision only)",
    skeletonContract: "deferred",
    changed: [
      ".artifacts/fe-refactor-audit/2026-08-09-b31r-contract-inventory.json",
      ".artifacts/fe-refactor-audit/2026-08-09-b31r-contract-status.json",
      ".artifacts/fe-refactor-audit/2026-08-09-b31r-contract-status.md",
      ".claude/fe/decision-ledger.json",
    ],
    held: inv.completionForecast.primaryBlockers,
  },
}

for (const [name, body] of Object.entries(workers)) {
  fs.writeFileSync(
    `.artifacts/fe-refactor-audit/2026-08-09-b31r-contract-worker-${name}.json`,
    JSON.stringify(body, null, 2),
  )
}

const status = {
  batch: "B31r-contract",
  complete: false,
  status: "blocked-at-inventory",
  checkpoint: inv.checkpoint,
  productEdits: false,
  retracted: false,
  phase1: {
    inventory: ".artifacts/fe-refactor-audit/2026-08-09-b31r-contract-inventory.json",
    openTagConsumers: inv.consumerCount,
    summary: inv.summary,
  },
  proposedCanonicalMap: inv.proposedCanonicalMap,
  storybookBlueprint:
    "SB atom: all sizes rounded-full; sm/md/lg = 40/64/80px — disagrees with proposed md/lg",
  canonicalPath: "not created",
  canonicalTier: "composite (held)",
  duplicatePublicIconTile: true,
  oldPathsDeleted: [],
  skeletonContract: "not landed",
  blockers: inv.completionForecast.primaryBlockers,
  remainingForTopLearners: [
    "Approve a size map that either matches Storybook atom chrome or accepts an explicit visual remap with consumer-by-consumer decisions",
    "Unlock or carve Nivo/Nivoexpert IconTile migration",
    "Then land composites/identity/IconTile + migrate; block sm→md for 48px/rounded-xl",
    "Then B31a0 / B31a / Leaderboard door",
  ],
  next: "Separate contract-approval batch for size map + nivo unlock before implementing composites/identity/IconTile",
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-09-b31r-contract-status.json",
  JSON.stringify(status, null, 2),
)

const md = `# BATCH 31r-contract — Canonical IconTile composite

**Status:** blocked at Phase 1 inventory (no product edits)  
**Checkpoint:** \`18f84f5b\`

## Verdict

Atomic completion is impossible under the proposed size map + locked/page holds. No canonical composite was created; both duplicate \`IconTile\` paths remain.

## Inventory (80 open-tag consumers)

| Kind | Count |
|---|---|
| atom path | 44 |
| block path | 36 |
| \`size="sm"\` | 65 |
| \`size="md"\` | 5 |
| \`size="lg"\` | 10 |
| Nivo/Nivoexpert locked | 6 |
| page-folder-likely | 28 |
| LeaderboardListCard hold | 1 |
| size-map CONFLICT sites | 15 |
| block \`sm\` → must become canonical \`md\` | 30 |

## Proposed map vs live chrome

| size | proposed | atom today | block today |
|---|---|---|---|
| sm | 40 + round | 40 + round ✓ | **48 + rounded-xl** (→ remap to md) |
| md | 48 + rounded-xl | **64 + round** CONFLICT | **64 + rounded-2xl** CONFLICT |
| lg | 64 + rounded-2xl | **80 + round** CONFLICT | **80 + rounded-2xl** CONFLICT |

Storybook atom is the blueprint and currently matches the **atom** column (all round). The proposed md/lg map is **not** Storybook-faithful without an approved visual remap.

## Why no apply

1. Cannot edit Nivo/Nivoexpert → cannot delete atom path (no forwarder).
2. 15 CONFLICT consumers need separate size decisions (do not silently remap).
3. 28 page consumers fail zero-warn ratchet if touched.
4. LeaderboardListCard import held by batch forbid.

## Artifacts

- \`2026-08-09-b31r-contract-inventory.json\`
- \`2026-08-09-b31r-contract-status.{json,md}\`
- \`2026-08-09-b31r-contract-worker-*.json\`
`

fs.writeFileSync(".artifacts/fe-refactor-audit/2026-08-09-b31r-contract-status.md", md)

const ledgerPath = ".claude/fe/decision-ledger.json"
const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"))
const id = "b31r-contract-icontile-canonical-2026-08-09"
if (!ledger.decisions.some((d) => d.id === id)) {
  ledger.decisions.push({
    id,
    date: "2026-08-09",
    status: "blocked",
    summary:
      "BATCH 31r-contract: Phase 1 inventory of 80 IconTile open-tag consumers. Proposed sm/md/lg map conflicts with atom md/lg and block md/lg; 30 block-sm need md remap; 6 nivo locked; 28 page-folder. No canonical composites/identity/IconTile created; duplicates remain.",
    reason:
      "Atomic deletion impossible without nivo edits/forwarder; silent size remap forbidden; Storybook atom chrome ≠ proposed md/lg.",
    artifact: ".artifacts/fe-refactor-audit/2026-08-09-b31r-contract-status.md",
    next: "Approve size map vs Storybook blueprint + nivo unlock, then implement composites/identity/IconTile",
  })
  fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + "\n")
}

console.log("B31r-contract blocked artifacts written")
