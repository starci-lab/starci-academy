import fs from "fs"

const inventory = {
  batch: "B31r",
  checkpoint: {
    head: "18f84f5b15528163e9fca10cfb7252323f02f013",
    subject: "refactor(fe): enforce semantic closure ratchet",
  },
  editsAllowed: false,
  productEdits: false,
  tierLaw: {
    atom: "leaf/value renderer; no caller-owned child it places",
    composite:
      "receives ReactNode/child or icon and positions it; owns chrome/fallback relationships; domain-blind",
    frame: "reusable layout relationships / principles",
    block: "domain/sentence meaning",
  },
  preferredCompositeHomeWithoutNewFolder:
    "src/components/composites/lists/IconTile (alongside UserCell/AvatarGroup/IdentityContentRow) — no composites/identity or composites/display shelf exists; creating one is forbidden tidy-folder invention",
  iconTile: {
    decision: "composite by ownership law",
    moveStatus: "held",
    holdReasons: [
      "Two live house components share the public name IconTile with incompatible sm chrome: atom size-10+rounded-full vs block size-12+rounded-xl. Unifying without visual redesign is impossible; inventing a size token is forbidden.",
      "Atom Storybook path is imported by nivo/nivoexpert trees — updating those imports is a locked/Nivo edit → hold (do not partially move).",
      "Block path has ~30+ src consumers including many pages/* files that cannot hit 0 warnings under page-folder-two-files-only if touched for import-only rewires.",
      "LeaderboardListCard imports blocks/identity/IconTile; batch forbids LeaderboardListCard internals — even a mechanical import rewrite still couples to the dual-chrome merge problem.",
      "No compatibility forwarder allowed at retired paths; cannot leave atom path as a shim for nivo while moving the canonical file.",
    ],
    trees: {
      "src/components/atoms/display/IconTile/index.tsx": {
        exportedNames: [
          "IconTile",
          "IconTileProps",
          "IconTileTone",
          "IconTileSize",
          "IconComponent",
          "IconWeight",
          "meta",
        ],
        callerOwnedChildren: ["icon: IconComponent (placed + scaled inside chrome)"],
        ReactNodeComponentTypeInputs: ["ComponentType SVG icon", "optional src image"],
        childPlacementDecisions: [
          "centers icon in tinted tile",
          "SIZE_ICON derived from size",
          "image cover replaces icon when src loads",
        ],
        fallbackBranches: ["src → onError → icon", "isSkeleton → HeroSkeleton box"],
        domainMeaning: "none (vocabulary)",
        currentTier: "atom (misfiled)",
        proposedTier: "composite",
        proposedPathIfUnblocked: "src/components/composites/lists/IconTile/index.tsx",
        directConsumersSrcCount: 9,
        storybookTwin: ".storybook/components/atoms/display/IconTile/IconTile.tsx",
        identityMetadata: 'meta = { tier: "atom", name: "IconTile" }',
        skeletonContract: "isSkeleton:true → HeroSkeleton with SIZE_BOX[size] + rounded-full",
        publicCssDoors: ["classNames?: AllowedClassName[]"],
        smChrome: "size-10 + rounded-full",
        lockedVendorTeacher: "SB consumers include nivo + nivoexpert (locked)",
        eslintBefore: {
          "starci-fe/no-public-classname-prop": 2,
        },
      },
      ".storybook/components/atoms/display/IconTile/IconTile.tsx": {
        parityWithSrcAtom: "aligned (isSkeleton, size-10 round, IconComponent API)",
        story: ".storybook/stories/atoms/display/IconTile/IconTile.stories.tsx",
        nivoConsumers: [
          ".storybook/components/nivo/blocks/dashboard/KpiTile/KpiTile.tsx",
          ".storybook/components/nivo/blocks/landing/OperatingLoopVisual/OperatingLoopVisual.tsx",
          ".storybook/components/nivo/blocks/landing/SystemFlow/SystemFlow.tsx",
          ".storybook/components/nivo/blocks/agent-os/ChannelList/ChannelList.tsx",
          ".storybook/components/nivoexpert/blocks/landing/OutcomesList/OutcomesList.tsx",
          ".storybook/components/nivoexpert/pages/ExpertDashboardOverview/ExpertDashboardOverview.tsx",
        ],
      },
      "src/components/blocks/identity/IconTile/index.tsx": {
        exportedNames: ["IconTile", "IconTileProps", "IconTileTone", "IconTileSize"],
        callerOwnedChildren: ["icon: ReactNode (already-scaled JSX placed in chrome)"],
        ReactNodeComponentTypeInputs: ["ReactNode icon", "optional src image"],
        childPlacementDecisions: [
          "centers icon/image in tinted rounded-xl tile",
          "SIZE map embeds [&_svg] scale",
        ],
        fallbackBranches: ["src → onError → icon"],
        domainMeaning: "none — should not be a block; sentence-tier leaf drawing shape",
        currentTier: "block (misfiled duplicate)",
        proposedTier: "composite (same canonical as atom twin after reconcile)",
        storybookTwin: "none",
        identityMetadata: "missing; require-identity-root warns",
        skeletonContract: "absent",
        publicCssDoors: ["WithClassNames / className"],
        smChrome: "size-12 + rounded-xl (TopLearners / Leaderboard standing target)",
        classNameOpenTagConsumers: 0,
        eslintBefore: {
          "starci-fe/no-heroui-outside-vocabulary": 1,
          "starci-fe/require-identity-root": 1,
          "starci-fe/no-classname-at-sentence-tier": 1,
          "starci-fe/no-public-classname-prop": 2,
          "starci-fe/no-cn-above-vocabulary": 1,
        },
        lockedVendorTeacher: "none specific; many page consumers page-folder-blocked",
      },
    },
    apiReconcileNote: {
      atomIconApi: "IconComponent (typed component; atom scales)",
      blockIconApi: "ReactNode (caller scales via SIZE [&_svg] or passes prebuilt node)",
      speculativeRewrite: "forbidden unless every consumer migrates without behavior change",
      topLearnersSmExact: "block sm (size-12 rounded-xl), NOT atom sm",
    },
    remainingBlockersForTopLearners: [
      "Canonical IconTile must own isSkeleton at size-12 rounded-xl chrome (block geometry) after reconcile",
      "TopLearners still under pages/ (page-folder) — B31a",
      "CommunityTab still under pages/ — B31a0 inline proposal",
      "LeaderboardListCard.className still open — later B31",
    ],
  },
  otherCandidates: {
    note: "Expand only with clear evidence; vendor HeroUI wrappers that take children stay ambiguous/held — not mass-moved",
    scannedShelves: [
      "display",
      "navigation",
      "overlay",
      "forms",
      "feedback",
      "buttons",
      "chips",
      "text",
    ],
    scanArtifact: ".artifacts/fe-refactor-audit/_b31r-atom-candidate-scan.json",
    held: [
      {
        path: "src/components/atoms/display/Avatar/AvatarBase.tsx",
        reason:
          "Places fallback icon/image chain; historically vendor atom. AvatarGroup already demoted to composite. Full Avatar demotion is ambiguous without dedicated batch; not IconTile-clear.",
        proposedTier: "hold-ambiguous",
      },
      {
        path: "src/components/atoms/buttons/Button/ButtonBase.tsx",
        reason: "Vendor vocabulary atom wrapping HeroUI; label/icon slots are atom value API, not a new composite shelf move in B31r",
        proposedTier: "hold-vendor-atom",
      },
      {
        path: "src/components/atoms/chips/Chip/ChipBase.tsx",
        reason: "Vendor vocabulary atom; mass-move forbidden",
        proposedTier: "hold-vendor-atom",
      },
      {
        path: "src/components/atoms/navigation/Tabs/TabsBase.tsx",
        reason: "Vendor vocabulary atom; mass-move forbidden",
        proposedTier: "hold-vendor-atom",
      },
      {
        path: "src/components/atoms/overlay/Menu/index.tsx",
        reason: "Vendor overlay atom; locked-style complexity; hold",
        proposedTier: "hold-vendor-atom",
      },
      {
        path: "src/components/atoms/feedback/Alert/index.tsx",
        reason: "Vendor atom with icon slot; ambiguous vs composite Callout family",
        proposedTier: "hold-ambiguous",
      },
    ],
    provenMoves: [],
  },
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-09-b31r-inventory.json",
  JSON.stringify(inventory, null, 2),
)

const workerBase = {
  changed: [],
  held: [],
  retracted: [],
  verification: { productEdits: false },
  regressions: [],
  overlapCheck: "pass",
}

const workers = {
  "icon-tile-twins": {
    ...workerBase,
    manifest: [],
    candidateEvidence: inventory.iconTile.trees,
    beforeTier: { atom: "atom", block: "block" },
    afterTier: null,
    destination: inventory.preferredCompositeHomeWithoutNewFolder,
    consumersBefore: {
      srcAtom: 9,
      srcBlock: "30+",
      sbAtomIncludingNivo: "16+",
    },
    consumersAfter: null,
    publicDoorsBefore: {
      atom: ["classNames"],
      block: ["className/WithClassNames"],
    },
    publicDoorsAfter: null,
    skeletonBefore: {
      atom: "isSkeleton HeroSkeleton size-10 round",
      block: "absent",
    },
    skeletonAfter: null,
    storybookParity: "atom twin exists; block twin absent",
    held: inventory.iconTile.holdReasons,
  },
  "identity-display-candidates": {
    ...workerBase,
    manifest: [],
    candidateEvidence: inventory.otherCandidates.held.filter((h) =>
      h.path.includes("/display/"),
    ),
    beforeTier: "atom",
    afterTier: null,
    destination: null,
    consumersBefore: {},
    consumersAfter: null,
    publicDoorsBefore: {},
    publicDoorsAfter: null,
    skeletonBefore: {},
    skeletonAfter: null,
    storybookParity: "n/a",
    held: ["Avatar ambiguous", "no other display moves"],
  },
  "navigation-overlay-candidates": {
    ...workerBase,
    manifest: [],
    candidateEvidence: inventory.otherCandidates.held.filter(
      (h) => h.path.includes("/navigation/") || h.path.includes("/overlay/"),
    ),
    beforeTier: "atom",
    afterTier: null,
    destination: null,
    consumersBefore: {},
    consumersAfter: null,
    publicDoorsBefore: {},
    publicDoorsAfter: null,
    skeletonBefore: {},
    skeletonAfter: null,
    storybookParity: "n/a",
    held: ["vendor atoms — no AST-proven non-vendor moves without mass migration"],
  },
  "form-feedback-candidates": {
    ...workerBase,
    manifest: [],
    candidateEvidence: inventory.otherCandidates.held.filter(
      (h) => h.path.includes("/forms/") || h.path.includes("/feedback/") || h.path.includes("/buttons/") || h.path.includes("/chips/"),
    ),
    beforeTier: "atom",
    afterTier: null,
    destination: null,
    consumersBefore: {},
    consumersAfter: null,
    publicDoorsBefore: {},
    publicDoorsAfter: null,
    skeletonBefore: {},
    skeletonAfter: null,
    storybookParity: "n/a",
    held: ["vendor atoms held"],
  },
  "consumer-barrels-stories": {
    ...workerBase,
    manifest: [],
    candidateEvidence: [],
    beforeTier: null,
    afterTier: null,
    destination: null,
    consumersBefore: {},
    consumersAfter: null,
    publicDoorsBefore: {},
    publicDoorsAfter: null,
    skeletonBefore: {},
    skeletonAfter: null,
    storybookParity: "no moves — no rewires",
    held: ["await IconTile unblock"],
  },
  "coordinator-tier-gates": {
    ...workerBase,
    manifest: [
      ".artifacts/fe-refactor-audit/2026-08-09-b31r-inventory.json",
      ".artifacts/fe-refactor-audit/2026-08-09-b31r-status.json",
      ".artifacts/fe-refactor-audit/2026-08-09-b31r-status.md",
      ".claude/fe/decision-ledger.json",
    ],
    candidateEvidence: "inventory",
    beforeTier: null,
    afterTier: null,
    destination: null,
    consumersBefore: {},
    consumersAfter: null,
    publicDoorsBefore: {},
    publicDoorsAfter: null,
    skeletonBefore: {},
    skeletonAfter: null,
    storybookParity: "unchanged",
    changed: [
      ".artifacts/fe-refactor-audit/2026-08-09-b31r-inventory.json",
      ".artifacts/fe-refactor-audit/2026-08-09-b31r-status.json",
      ".artifacts/fe-refactor-audit/2026-08-09-b31r-status.md",
      ".claude/fe/decision-ledger.json",
    ],
    held: ["IconTile held", "no proven moves"],
  },
}

for (const [name, body] of Object.entries(workers)) {
  fs.writeFileSync(
    `.artifacts/fe-refactor-audit/2026-08-09-b31r-worker-${name}.json`,
    JSON.stringify(body, null, 2),
  )
}

const status = {
  batch: "B31r",
  complete: false,
  status: "blocked",
  checkpoint: inventory.checkpoint,
  productEdits: false,
  provenMoves: [],
  ambiguousCandidates: inventory.otherCandidates.held,
  oldPathsDeleted: [],
  compatibilityPaths: "none created (forbidden)",
  iconTile: {
    classification: "composite",
    canonicalPathIfUnblocked: inventory.preferredCompositeHomeWithoutNewFolder,
    finalCanonicalPath: "unresolved — dual live paths remain",
    api: "unreconciled (IconComponent+round size-10 vs ReactNode+rounded-xl size-12)",
    consumerMigration: "not started",
    duplicatePublicName: true,
  },
  remainingBlockersForTopLearners: inventory.iconTile.remainingBlockersForTopLearners,
  next: [
    "Dedicated IconTile chrome-unify batch: pick one sm geometry (likely block size-12 rounded-xl for product parity), update SB atom first, migrate all atom+block consumers including an explicit nivo unlock or dual-write plan, delete duplicate path",
    "Then B31a0 CommunityTab inline + B31a TopLearners promote + skeleton uses composite IconTile isSkeleton",
  ],
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-09-b31r-status.json",
  JSON.stringify(status, null, 2),
)

const md = `# BATCH 31r — Non-atom tier placement

**Status:** blocked (inventory only; no product edits)  
**Checkpoint:** \`18f84f5b\`

## Verdict

\`IconTile\` is a **composite** under ownership law, but it cannot be moved in this batch without forbidden or visually redesigning work. No other atom candidate was proven safe to move. Dual public \`IconTile\` paths remain.

## IconTile

| Path | Tier today | sm chrome | isSkeleton | Twin |
|---|---|---|---|---|
| \`atoms/display/IconTile\` | atom (misfiled) | size-10 + round | yes | SB atom |
| \`blocks/identity/IconTile\` | block (misfiled duplicate) | size-12 + rounded-xl | no | none |

**Proposed destination (when unblocked):** \`composites/lists/IconTile\` (existing lists shelf; no new \`identity/\` folder).

### Hold reasons

1. Incompatible sm chrome — unify = visual redesign or new size token (both forbidden here)
2. Nivo/nivoexpert import the SB atom path — locked edits
3. Block consumers include many \`pages/*\` files that fail the zero-warning ratchet on touch
4. No compatibility forwarder allowed while retiring a path

## Other candidates

Vendor HeroUI atoms (Button, Chip, Tabs, Menu, …) and Avatar: **held / ambiguous** — not mass-moved.

## Proven moves

*(none)*

## TopLearners blockers (unchanged)

- Canonical IconTile must own \`isSkeleton\` at **size-12 rounded-xl** after reconcile
- TopLearners still under \`pages/\`
- CommunityTab still under \`pages/\`
- \`LeaderboardListCard.className\` still open

## Artifacts

\`2026-08-09-b31r-{inventory,status,worker-*}\`
`

fs.writeFileSync(".artifacts/fe-refactor-audit/2026-08-09-b31r-status.md", md)

const ledgerPath = ".claude/fe/decision-ledger.json"
const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"))
const id = "b31r-icontile-tier-correction-2026-08-09"
if (!ledger.decisions.some((d) => d.id === id)) {
  ledger.decisions.push({
    id,
    date: "2026-08-09",
    status: "blocked",
    summary:
      "BATCH 31r: IconTile classified composite (not atom/block). Move held — dual incompatible sm chrome, nivo/nivoexpert atom imports locked, page-folder consumers, no forwarder. Proposed destination composites/lists/IconTile. No product edits; no other proven atom moves.",
    reason:
      "Zero-warning ratchet + no visual redesign + no Nivo edits + no new size token + no compatibility shim.",
    artifact: ".artifacts/fe-refactor-audit/2026-08-09-b31r-status.md",
    next: "IconTile chrome-unify + nivo unlock batch, then composite move, then B31a0/B31a",
  })
  fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + "\n")
}

console.log("B31r blocked inventory written")
