import fs from "fs"

const eslint = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/_b31-eslint-phase1-summary.json", "utf8"),
)
const byNorm = Object.fromEntries(
  Object.entries(eslint).map(([k, v]) => [k.replace(/\\/g, "/"), v]),
)

const inventory = {
  batch: "B31",
  phase: 1,
  editsAllowed: false,
  title: "Leaderboard vertical closure — Phase 1 inventory",
  objectiveSlice: "LeaderboardListCard -> TopLearners -> direct page owner",
  precondition: {
    required: "B30c checkpoint committed",
    status: "pass",
    head: "18f84f5b15528163e9fca10cfb7252323f02f013",
    headShort: "18f84f5b",
    headSubject: "refactor(fe): enforce semantic closure ratchet",
    b30cEvidence: [
      "plugins/eslint/sentence-tier.test.mjs",
      "src/components/blocks/lists/LabeledList/index.tsx",
      "src/components/blocks/learn/lesson/ContentTabBar/index.tsx",
      ".claude/fe/decision-ledger.json entry b30c-touched-file-zero-warning-2026-08-09",
    ],
    workingTreeAtStart: [
      "?? .artifacts/",
      "?? .claude/fe/prompts/cursor/31-leaderboard-vertical-closure.md",
    ],
  },
  astConsumerScan: {
    method:
      "babel parse + traverse JSXOpeningElement where imported local === LeaderboardListCard",
    bareApiStatus:
      "exported bare?: boolean with live branch, but AST finds zero open-tag bare=true consumers in src/.storybook",
    bareConsumers: [],
    typeOnlyImports: [
      "src/components/pages/DashboardPage/TopLearners/index.tsx (LeaderboardRow type)",
    ],
    nestedClassNameNotRootConsumers: [
      "UserCell internal classNames",
      "Typography className on value cell",
      "Link className on profile wrap",
      "RankDeltaCaret className from LeagueCard toRow trailing",
      "row/standing host div flex payloads",
    ],
    openTagConsumers: [
      {
        file: "src/components/pages/DashboardPage/TopLearners/component.tsx",
        line: 132,
        classNameDoor: true,
        classNameValue: "passthrough identifier className from _TopLearners props",
        note: "Connected TopLearners/index.tsx never passes className into _TopLearners. Live painted root className payload is empty on non-bare path because LabeledCard does not receive className.",
        attrs: {
          className: "{className}",
          title: "labels.title",
          onSeeMore: "{onSeeMore}",
          seeMoreLabel: "labels.seeMoreLabel",
          standing: "{standing}",
          rows: "{rows}",
          selfRow: "{selfRow}",
          ellipsisLabel: "{ellipsisLabel}",
          meLabel: "labels.meLabel",
        },
      },
      {
        file: "src/components/pages/DashboardPage/LeagueCard/component.tsx",
        line: 188,
        classNameDoor: false,
        attrs: [
          "title",
          "onSeeMore",
          "seeMoreLabel",
          "standing",
          "rows",
          "selfRow",
          "ellipsisLabel",
          "meLabel",
        ],
      },
      {
        file: "src/components/pages/DashboardPage/LeagueCard/LeagueCardContent/index.tsx",
        line: 113,
        classNameDoor: false,
        note: "Second live content path under LeagueCard; page-folder structural finding",
        attrs: [
          "title",
          "onSeeMore",
          "seeMoreLabel",
          "standing",
          "rows",
          "selfRow",
          "ellipsisLabel",
          "meLabel",
        ],
      },
    ],
  },
  overlapCheck: {
    result:
      "no overlap with locked/Nivo/teacher-held edit paths — but page-folder + skeleton + vocabulary-gap blockers apply",
    nivo: "none in proposed slice",
    nivoexpert: "none",
    lockedPaths: "none in slice",
    teacherHold:
      "none specific to LeaderboardListCard door; CommunityTab comment cites teacher identical-sections intent (preserve behavior)",
    coreButtonChipStackGridBox: "must not edit APIs",
  },
  completionForecast: {
    statusIfStopNow: "blocked-at-inventory",
    zeroWarningChangedSet: false,
    honestDoorGone: false,
    primaryBlockers: [
      "page-folder-two-files-only on every TopLearners/LeagueCard/CommunityTab page-folder file required for vertical consumer closure",
      "LeaderboardListCard internal raw-shape payloads lack honest existing principles/composites at exact seams",
      "HeroUI Link vocabulary gap",
      "B30c already retracted the same vertical attempt under identical ratchet",
    ],
  },
  files: {
    "src/components/blocks/dashboard/LeaderboardListCard/index.tsx": {
      role: "semantic block — shared leaderboard preview",
      storybookTwin: "none (src-only)",
      publicCssDoors: [
        "WithClassNames<undefined> on LeaderboardListCardProps",
        "destructured className",
        'cn("flex flex-col gap-3", className) on bare root',
      ],
      eslintBefore: byNorm["src/components/blocks/dashboard/LeaderboardListCard/index.tsx"],
      herouiImports: ["Link", "Typography", "cn"],
      starciEquivalents: {
        Typography: {
          exists: true,
          path: "src/components/atoms/text/Typography",
          notes:
            "type/color/weight/truncate/tabularNums/align closed props cover current HeroUI usage; shrink-0 is placement not Typography",
        },
        Link: {
          exists: false,
          gap: "house Link atoms are LinkBack/LinkSeeMore only — no profile/href row Link with hover opacity semantics",
          action: "vocabulary-gap proposal; do not wrap HeroUI locally",
        },
        cn: { exists: false, notes: "must leave with door burn; no sentence-tier cn" },
      },
      identityRoot: {
        cardBranch:
          'LabeledCard identity={{ tier: "block", component: "LeaderboardListCard" }}',
        bareBranch: "missing — bare returns raw div with no identity",
      },
      skeletonOwnership:
        "none inside LeaderboardListCard; consumers mirror loading co-located",
      pageFolderFindings: null,
      lockedVendorTeacher: [],
      b30cLesson:
        "Door-only burn left bare flex flex-col gap-3 (false closure). Full rewrite blocked by className door law residuals, Typography classNames, Box self-declare vs escape, HeroUI Link gap, raw-shape row internals.",
      layoutPayloads: [
        {
          payload: 'bare root: cn("flex flex-col gap-3", className)',
          classification: "child relationship owned by the component",
          honestExisting: true,
          ownerProposal:
            'StackV principle="sibling-stack" shared with card branch; no gap prop; no className door',
          blocker: null,
        },
        {
          payload: 'card branch StackV gap={3} principle="sibling-stack"',
          classification: "child relationship owned by the component",
          honestExisting: true,
          ownerProposal: "keep StackV sibling-stack; drop gap={3} (principle owns step 3)",
          blocker: null,
        },
        {
          payload: "row host div.flex.items-center.gap-3",
          classification: "unresolved contract",
          candidatePrinciples: [
            {
              token: "flex-action-center",
              gapStep: 3,
              align: "center",
              honesty:
                "spacing/align match visually; semantic name is action-bar not ranked list row — questionable",
            },
            {
              token: "content-row",
              gapStep: 4,
              honesty: "wrong seam (gap-4 vs gap-3) — visual regression if used",
            },
            {
              token: "identity",
              gapStep: 3,
              honesty: "no center align ownership",
            },
          ],
          missingContractProposal:
            "ranked-row or list-row horizontal principle (gap step 3 + align center) OR reuse/prove flex-action-center as honest for medal+identity+meta rows",
          blocker: "no invent token in B31",
        },
        {
          payload: "span.flex.w-6.shrink-0.items-center.justify-center (medal/rank/ellipsis)",
          classification: "intrinsic leaf chrome",
          ownerProposal:
            "medal/rank slot composite or vocabulary IconSlot; not parent placement",
          missingContractProposal:
            "fixed-width centered rank/medal slot (w-6) — no existing composite found",
          blocker: "missing composite; do not invent in B31",
        },
        {
          payload:
            "Link className flex min-w-0 flex-1 items-center text-foreground no-underline hover:opacity-60",
          classification: "vendor boundary + unresolved contract",
          ownerProposal:
            "StarCi profile Link atom with flex-fill participation owned by parent Stack item",
          blocker:
            "vocabulary gap for Link; flex-1/min-w-0 placement needs frame item contract",
        },
        {
          payload: "div.flex.min-w-0.flex-1.items-center (non-link identity)",
          classification: "child relationship / unresolved",
          blocker: "same flex participation as link wrap — needs frame fill contract",
        },
        {
          payload: "Typography className shrink-0 text-right tabular-nums",
          classification: "mixed",
          semanticPart: 'align="end" tabularNums on StarCi Typography',
          placementPart: "shrink-0 owned by parent frame item",
          blocker:
            "parent frame must accept shrink without public className door on Typography",
        },
        {
          payload: "standing host flex items-center gap-3 + IconTile + text column flex-col",
          classification: "unresolved contract",
          candidate:
            "StackH icon-text is gap-2 (visual change); identity gap-3 no center; title-subtitle for text column is gap-2 vs current tight flex-col",
          missingContractProposal:
            "standing header: icon-tile + primary/secondary stack with exact current seams",
          blocker: "no invent token",
        },
        {
          payload: "ellipsis row flex min-h-8 items-center gap-3",
          classification: "unresolved contract",
          blocker: "same as row host + min-h-8 intrinsic",
        },
      ],
    },
    "src/components/pages/DashboardPage/TopLearners/component.tsx": {
      role: "presentational TopLearners — direct LeaderboardListCard consumer + className passthrough",
      storybookTwin: "none",
      publicCssDoors: [
        "WithClassNames on TopLearnersProps",
        "className destructure",
        "pass className to LeaderboardListCard",
      ],
      eslintBefore: byNorm["src/components/pages/DashboardPage/TopLearners/component.tsx"],
      openTagClassNameToLeaderboard:
        "{className} passthrough — only root className consumer in AST",
      parentPlacement: {
        owner: "src/components/pages/DashboardPage/CommunityTab/index.tsx",
        payload: "sibling in flex flex-col gap-6; no className passed to <TopLearners />",
        connected: "TopLearners/index.tsx passes no className",
      },
      identityRoot: {
        empty: "AsyncContentEmpty identity TopLearners",
        skeleton: "StackV identity TopLearners",
        content:
          "delegated to LeaderboardListCard LabeledCard identity (LeaderboardListCard, not TopLearners)",
      },
      skeletonOwnership:
        "inline isSkeleton branch in same file (co-located mirror); also TopLearnersSkeleton twin file exists",
      pageFolderFindings:
        "page-folder-two-files-only — cannot clear without forbidden page-folder migration",
      lockedVendorTeacher: [],
      layoutPayloads: [
        {
          payload:
            "skeleton StackV sibling-stack + StackH content-row classNames min-w-0 flex-1 + Skeleton className sizes",
          classification: "skeleton/loading — out of B31 redesign scope",
          blocker:
            "zero-warn requires clearing Skeleton/Stack className props without redesign OR keep file out of edit set",
        },
      ],
      zeroWarningPath:
        "BLOCKED under B31 ratchet: page-folder-two-files-only remains after any door/skeleton cleanup unless page structure migrates (forbidden)",
    },
    "src/components/pages/DashboardPage/TopLearners/index.tsx": {
      role: "connected fetch/follow owner",
      usesLeaderboardListCard: "type-only LeaderboardRow",
      classNameDoor: false,
      eslintBefore: byNorm["src/components/pages/DashboardPage/TopLearners/index.tsx"],
      zeroWarningPath: "BLOCKED — page-folder-two-files-only only",
      editRecommendation:
        "exclude from edit manifest (type-only; cannot reach 0 warnings)",
    },
    "src/components/pages/DashboardPage/TopLearners/TopLearnersSkeleton/index.tsx": {
      role: "hand-mirrored skeleton twin",
      eslintBefore:
        byNorm["src/components/pages/DashboardPage/TopLearners/TopLearnersSkeleton/index.tsx"],
      holds: [
        "no-skeleton-twin-component",
        "skeleton/loading redesign forbidden",
        "page-folder-two-files-only",
        "HeroUI cn",
      ],
      editRecommendation: "exclude — parallel-skeleton / hold",
    },
    "src/components/pages/DashboardPage/LeagueCard/component.tsx": {
      role: "presentational LeagueCard — LeaderboardListCard consumer (no className)",
      openTagClassNameToLeaderboard: false,
      skeletonInline: true,
      eslintBefore: byNorm["src/components/pages/DashboardPage/LeagueCard/component.tsx"],
      holds: [
        "page-folder-two-files-only",
        "inline skeleton className props",
        "RankDeltaCaret className",
        "WithClassNames on props",
      ],
      zeroWarningPath: "BLOCKED — page-folder + skeleton",
      editRecommendation:
        "read-only in B31; exclude from edit manifest unless zero-warn proven without skeleton/page-folder work",
    },
    "src/components/pages/DashboardPage/LeagueCard/index.tsx": {
      eslintBefore: byNorm["src/components/pages/DashboardPage/LeagueCard/index.tsx"],
      editRecommendation: "exclude",
    },
    "src/components/pages/DashboardPage/LeagueCard/LeagueCardContent/index.tsx": {
      role: "alternate connected content mapper → LeaderboardListCard",
      openTagClassNameToLeaderboard: false,
      eslintBefore:
        byNorm["src/components/pages/DashboardPage/LeagueCard/LeagueCardContent/index.tsx"],
      holds: [
        "page-folder-two-files-only",
        "require-identity-root",
        "RankDeltaCaret className",
      ],
      zeroWarningPath: "BLOCKED — page-folder at minimum",
      editRecommendation: "exclude",
    },
    "src/components/pages/DashboardPage/LeagueCard/LeagueCardSkeleton/index.tsx": {
      holds: ["skeleton twin", "page-folder", "HeroUI cn"],
      editRecommendation: "exclude",
    },
    "src/components/pages/DashboardPage/CommunityTab/index.tsx": {
      role: "immediate page owner of LeagueCard + TopLearners",
      placement: "div.flex.flex-col.gap-6 wrapping both cards",
      passesClassNameToTopLearners: false,
      layoutPayload: {
        payload: "flex flex-col gap-6",
        classification: "placement owned by the immediate parent",
        ownerProposal:
          'StackV principle="group-boundary" (gap step 5) or block-boundary (step 6) — neither is exact gap-6; marketing-beat is 8',
        blocker:
          "exact gap-6 has no honest existing principle; page-folder also blocks zero-warn",
      },
      eslintBefore: {
        errors: 0,
        warnings: 3,
        byRule: {
          "starci-fe/page-folder-two-files-only": 1,
          "starci-fe/require-identity-root": 1,
          "starci-fe/no-raw-shape-at-sentence-tier": 1,
        },
      },
      editRecommendation:
        "exclude unless placement migration is exact and page-folder cleared (forbidden)",
    },
  },
  proposedWorkerManifests: {
    note: "Disjoint edit manifests for Phase 3 IF and only IF coordinator accepts a zero-warn path. Current inventory recommends empty edit manifests / blocked status.",
    "leaderboard-contract": {
      proposed: ["src/components/blocks/dashboard/LeaderboardListCard/index.tsx"],
      storybookTwin: [],
      canReachZeroWarningsAlone: false,
      reasons: [
        "9× raw-shape row/standing hosts need principles/composites not inventable in B31",
        "HeroUI Link has no StarCi equivalent (vocabulary gap)",
        "removing className requires TopLearners consumer edit (blocked below)",
        "bare identity strategy must stamp proven root without wrapper div",
      ],
    },
    "top-learners-consumer": {
      proposed: ["src/components/pages/DashboardPage/TopLearners/component.tsx"],
      parentPlacement: "CommunityTab — also page-folder blocked; no live className to migrate",
      canReachZeroWarningsAlone: false,
      reasons: [
        "starci-fe/page-folder-two-files-only cannot clear without forbidden page-folder migration",
        "inline skeleton className props require skeleton redesign or remain warnings",
        "door passthrough removal alone leaves page-folder + skeleton warnings",
      ],
    },
    "league-card-consumers": {
      readFirst: [
        "src/components/pages/DashboardPage/LeagueCard/component.tsx",
        "src/components/pages/DashboardPage/LeagueCard/LeagueCardContent/index.tsx",
      ],
      proposed: [],
      editCapableOfZeroWarningClosure: false,
      reasons: [
        "page-folder-two-files-only",
        "inline/parallel skeleton",
        "RankDeltaCaret className",
      ],
    },
    "coordinator-gates": {
      sourceEdits: [],
      proposed: [
        ".artifacts/fe-refactor-audit/2026-08-09-b31-inventory.json",
        ".artifacts/fe-refactor-audit/2026-08-09-b31-status.json",
        ".artifacts/fe-refactor-audit/2026-08-09-b31-status.md",
        ".artifacts/fe-refactor-audit/2026-08-09-b31-worker-*.json",
      ],
    },
  },
  contractDesignDraft: {
    root: {
      bare: "controls LabeledCard chrome only",
      sharedContent:
        'one StackV principle="sibling-stack" items={contentItems} — no gap; no duplicated map',
      publicDoor:
        "delete WithClassNames/className/cn only after zero open-tag consumers AND no private flex flex-col gap-3 residual",
      identity:
        "stamp on proven exported root: LabeledCard when !bare; bare needs identity-capable frame root (StackV identity) — not a wrapper div",
    },
    doorConsumerMigration: {
      "TopLearners.className":
        "dead passthrough — drop WithClassNames; no parent placement to migrate (CommunityTab passes nothing)",
      blockedBy:
        "editing TopLearners/component.tsx cannot hit 0 warnings under page-folder rule",
    },
    internalRows: {
      doNotInvent: true,
      stopSubparts: [
        "row host gap-3 centered",
        "w-6 medal/rank slot",
        "profile Link vocabulary",
        "flex-1 identity participation",
        "standing header seams",
        "ellipsis min-h-8 row",
      ],
    },
    heroui: {
      Typography: "replace with StarCi Typography where behaviorally identical",
      Link: "exact vocabulary gap — stop; do not wrap",
      cn: "remove with door",
    },
    skeleton: "read-only parity; no redesign; keep skeleton files outside edit manifest",
  },
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-09-b31-inventory.json",
  JSON.stringify(inventory, null, 2),
)

const status = {
  batch: "B31",
  complete: false,
  status: "blocked-at-inventory",
  head: inventory.precondition.head,
  headSubject: inventory.precondition.headSubject,
  phase: 1,
  sourceEdits: [],
  publicDoorsRemoved: [],
  retainedInDiff: [],
  retracted: [],
  warningsBefore: {
    LeaderboardListCard: 15,
    TopLearnersComponent: 10,
    TopLearnersIndex: 1,
    LeagueCardComponent: 10,
    LeagueCardContent: 3,
    CommunityTab: 3,
  },
  warningsAfter: null,
  blockers: inventory.completionForecast.primaryBlockers,
  overlapCheck: "pass-no-locked-nivo-overlap",
  inventoryArtifact: ".artifacts/fe-refactor-audit/2026-08-09-b31-inventory.json",
  next:
    "Await coordinator/user approval. Recommend empty edit manifests unless page-folder + vocabulary gaps are unblocked out of band. Do not claim door closure.",
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-09-b31-status.json",
  JSON.stringify(status, null, 2),
)

const md = `# BATCH 31 — Leaderboard vertical closure

**Status:** blocked at Phase 1 inventory (no source edits)  
**HEAD:** \`${inventory.precondition.headShort}\` — ${inventory.precondition.headSubject}  
**Precondition:** B30c committed — **pass**

## Verdict

The vertical slice cannot honestly close under the touched-file zero-warning ratchet without out-of-band unblocks.

| Barrier | Effect |
|---|---|
| \`page-folder-two-files-only\` on TopLearners / LeagueCard / CommunityTab | Any consumer/parent edit stays in the diff with ≥1 warning; forbidden to migrate page folders in B31 |
| LeaderboardListCard 9× \`no-raw-shape\` + HeroUI Link | File cannot reach 0 warnings without new principles/composites or a profile Link vocabulary atom |
| Only open-tag \`className\` consumer is TopLearners passthrough | Door burn requires editing a page-folder-blocked file |

## AST open-tag consumers

1. **TopLearners/component.tsx:132** — \`className={className}\` (dead passthrough; connected owner passes nothing)
2. **LeagueCard/component.tsx:188** — no className
3. **LeagueCardContent/index.tsx:113** — no className

\`bare\` has **zero** live consumers. Storybook twin for LeaderboardListCard: **none**.

## Proposed edit manifests (Phase 3)

All workers currently recommend **empty source manifests** / blocked:

- \`leaderboard-contract\` — cannot zero-warn alone
- \`top-learners-consumer\` — page-folder + skeleton
- \`league-card-consumers\` — exclude
- \`coordinator-gates\` — artifacts only

## Contract design (draft only — not applied)

- Shared \`StackV principle="sibling-stack"\` for bare + card (no \`gap\`, no duplicated content)
- Delete public \`className\` only after zero consumers + no private \`flex flex-col gap-3\`
- Stop on missing contracts: row host, w-6 medal slot, profile Link, flex-1 identity wrap, standing seams
- Skeleton files: out of manifest

## Artifacts

- \`.artifacts/fe-refactor-audit/2026-08-09-b31-inventory.json\`
- \`.artifacts/fe-refactor-audit/2026-08-09-b31-status.json\`

No commit. Door remains open.
`

fs.writeFileSync(".artifacts/fe-refactor-audit/2026-08-09-b31-status.md", md)
console.log("wrote inventory + status")
