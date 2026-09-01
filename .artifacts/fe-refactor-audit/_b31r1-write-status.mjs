import fs from "fs"

const inv = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-09-b31r1-inventory.json", "utf8"),
)

inv.execution = {
  identityTileCreated: true,
  canonicalPaths: {
    storybook: ".storybook/components/composites/identity/IdentityTile/IdentityTile.tsx",
    src: "src/components/composites/identity/IdentityTile/index.tsx",
    stories: ".storybook/stories/composites/identity/IdentityTile/IdentityTile.stories.tsx",
  },
  atomIconTile: "kept unchanged",
  blockIconTileDeleted: false,
  consumersMigrated: [],
  migrateSkippedAllPreExistingWarnings: [
    "src/components/blocks/auth/GithubTeamGate/index.tsx",
    "src/components/blocks/cards/PlaygroundCard/component.tsx",
    "src/components/blocks/commerce/CartLine/index.tsx",
    "src/components/blocks/feedback/ReadinessChecklist/index.tsx",
    "src/components/blocks/learn/EnrollGate/index.tsx",
    "src/components/blocks/learn/lesson/PremiumPaywall/index.tsx",
    "src/components/blocks/marketing/PitchCard/index.tsx",
  ],
  holdsPreventingDeletion: inv.consumers.filter((c) =>
    c.oldKind === "block-IconTile" && String(c.action).startsWith("hold-"),
  ),
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-09-b31r1-inventory.json",
  JSON.stringify(inv, null, 2),
)

const workerBase = {
  changed: [],
  held: [],
  retracted: [],
  storybookParity: "pass",
  verification: {},
  regressions: [],
  overlapCheck: "pass",
}

const workers = {
  "identity-tile-storybook": {
    ...workerBase,
    manifest: [
      ".storybook/components/composites/identity/IdentityTile/IdentityTile.tsx",
      ".storybook/stories/composites/identity/IdentityTile/IdentityTile.stories.tsx",
    ],
    sizeEvidence: { sm: "48/rounded-xl", md: "64/rounded-2xl", lg: "80/rounded-2xl" },
    changed: [
      ".storybook/components/composites/identity/IdentityTile/IdentityTile.tsx",
      ".storybook/stories/composites/identity/IdentityTile/IdentityTile.stories.tsx",
    ],
    warningsBefore: {},
    warningsAfter: { IdentityTile: 0, stories: 0 },
    oldPathsBefore: ["blocks/identity/IconTile"],
    oldPathsAfter: ["blocks/identity/IconTile"],
  },
  "identity-tile-src": {
    ...workerBase,
    manifest: ["src/components/composites/identity/IdentityTile/index.tsx"],
    sizeEvidence: { sm: "48/rounded-xl", md: "64/rounded-2xl", lg: "80/rounded-2xl" },
    changed: ["src/components/composites/identity/IdentityTile/index.tsx"],
    warningsBefore: {},
    warningsAfter: { IdentityTile: 0 },
    skeletonContract: "isSkeleton → HeroSkeleton SIZE_BOX",
    oldPathsBefore: ["blocks/identity/IconTile"],
    oldPathsAfter: ["blocks/identity/IconTile"],
  },
  "glyph-consumers": {
    ...workerBase,
    manifest: [],
    held: ["atom IconTile consumers kept on atoms/display/IconTile — no remap"],
    consumerClassification: "glyph-only stay on atom",
  },
  "identity-consumers-a": {
    ...workerBase,
    manifest: [],
    held: inv.execution.migrateSkippedAllPreExistingWarnings.map(
      (f) => `${f} — pre-existing warnings; import-only would fail zero-warn ratchet`,
    ),
  },
  "identity-consumers-b": {
    ...workerBase,
    manifest: [],
    held: [
      "page-folder block IconTile consumers",
      "LeaderboardListCard (batch forbid)",
      "nivo/nivoexpert atom consumers untouched",
    ],
  },
  coordinator: {
    ...workerBase,
    manifest: [
      ".artifacts/fe-refactor-audit/2026-08-09-b31r1-inventory.json",
      ".artifacts/fe-refactor-audit/2026-08-09-b31r1-status.json",
      ".artifacts/fe-refactor-audit/2026-08-09-b31r1-status.md",
      ".claude/fe/decision-ledger.json",
    ],
    changed: [
      "src/components/composites/identity/IdentityTile/index.tsx",
      ".storybook/components/composites/identity/IdentityTile/IdentityTile.tsx",
      ".storybook/stories/composites/identity/IdentityTile/IdentityTile.stories.tsx",
      ".claude/fe/decision-ledger.json",
    ],
    verification: {
      eslintChangedSet: "0/0 on IdentityTile family",
      tsc: "pass",
      pluginTests: "pass",
      storybookContractTests: "pass",
      gitDiffCheck: "pass",
      auditFe: "pending-or-see-log",
    },
    oldPathsBefore: { blockIconTileImports: inv.summary.blockPathLive },
    oldPathsAfter: { blockIconTileImports: inv.summary.blockPathLive },
    deletionProof: "NOT deleted — live block-IconTile imports remain",
  },
}

for (const [name, body] of Object.entries(workers)) {
  fs.writeFileSync(
    `.artifacts/fe-refactor-audit/2026-08-09-b31r1-worker-${name}.json`,
    JSON.stringify(body, null, 2),
  )
}

const status = {
  batch: "B31r1",
  complete: false,
  status: "blocked-partial",
  checkpoint: "18f84f5b",
  productEdits: true,
  retracted: false,
  reason:
    "IdentityTile canonical composite landed (SB+src, 0 warnings). No consumers migrated (all unlocked block consumers fail zero-warn ratchet with pre-existing debt). blocks/identity/IconTile not deleted (pages + LeaderboardListCard still import). Completion requires zero old-path imports.",
  canonical: {
    IdentityTile: "composites/identity/IdentityTile",
    IconTileAtom: "atoms/display/IconTile (unchanged)",
    blockIconTile: "still present",
  },
  sizeContracts: {
    IconTile: "sm40/md64/lg80 rounded-full",
    IdentityTile: "sm48/xl md64/2xl lg80/2xl",
  },
  consumersMigrated: 0,
  holds: {
    pageFolder: inv.summary.byAction["hold-page-folder"],
    leaderboardListCard: inv.summary.byAction["hold-leaderboard-list-card"],
    nivo: inv.summary.byAction["hold-nivo"],
    migrateSkippedWarnings: inv.execution.migrateSkippedAllPreExistingWarnings.length,
  },
  storybookParity: "pass (IdentityTile twins)",
  next: [
    "Zero-warn unlock batches for held identity consumers (or page-folder promotions)",
    "Migrate block IconTile → IdentityTile",
    "Delete blocks/identity/IconTile when imports === 0",
    "Then TopLearners/CommunityTab/Leaderboard batches",
  ],
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-09-b31r1-status.json",
  JSON.stringify(status, null, 2),
)

const md = `# BATCH 31r1 — IconTile / IdentityTile split

**Status:** blocked-partial (IdentityTile landed; block path not retired)  
**Checkpoint:** \`18f84f5b\`

## Landed

| Component | Path | Size map |
|---|---|---|
| **IdentityTile** (new) | \`composites/identity/IdentityTile\` (+ SB twin/stories) | sm 48/\`rounded-xl\`, md 64/\`rounded-2xl\`, lg 80/\`rounded-2xl\` + \`isSkeleton\` |
| **IconTile** atom | \`atoms/display/IconTile\` | unchanged round 40/64/80 |

Changed-set eslint **0/0**; \`tsc --noEmit\` pass; plugin + SB contract tests pass.

## Not completed

- **0 consumers migrated** — every unlocked \`blocks/**\` identity consumer already has pre-existing ESLint warnings; import-only edits fail the zero-warn ratchet.
- **\`blocks/identity/IconTile\` not deleted** — still imported by page-folder holds + \`LeaderboardListCard\` (forbidden this batch).
- Atom glyph consumers left on \`IconTile\` (correct — no silent remap).

## Holds

| Hold | Count (open-tags) |
|---|---|
| page-folder | ${inv.summary.byAction["hold-page-folder"] || 0} |
| LeaderboardListCard | ${inv.summary.byAction["hold-leaderboard-list-card"] || 0} |
| nivo/nivoexpert | ${inv.summary.byAction["hold-nivo"] || 0} |
| migrate skipped (warnings) | ${inv.execution.migrateSkippedAllPreExistingWarnings.length} |

## Next

Zero-warn unlock → migrate block → IdentityTile → delete \`blocks/identity/IconTile\` → resume TopLearners chain.
`

fs.writeFileSync(".artifacts/fe-refactor-audit/2026-08-09-b31r1-status.md", md)

const ledgerPath = ".claude/fe/decision-ledger.json"
const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"))
const id = "b31r1-identity-tile-split-2026-08-09"
if (!ledger.decisions.some((d) => d.id === id)) {
  ledger.decisions.push({
    id,
    date: "2026-08-09",
    status: "blocked-partial",
    summary:
      "BATCH 31r1: Created composites/identity/IdentityTile (SB+src, isSkeleton, size map sm48/xl md64/2xl lg80/2xl). Atom IconTile kept. No consumer migrations (unlocked files fail zero-warn). blocks/identity/IconTile retained for page+LLC holds.",
    reason:
      "Atomic deletion requires zero block-IconTile imports; holds + pre-existing warnings prevent migration this batch.",
    artifact: ".artifacts/fe-refactor-audit/2026-08-09-b31r1-status.md",
    next: "Unlock identity consumers to 0 warnings, migrate to IdentityTile, delete blocks/identity/IconTile",
  })
  fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + "\n")
}

console.log("B31r1 status written", status.status)
