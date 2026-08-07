# BATCH 29 — Fill, media, and markdown contract closure

Repo: `D:\Repositories\starci-academy`

Checkpoint:

`e6066358 refactor(fe): close semantic CSS doors wave one`

BATCH 28 closed 12 live doors and left 1,573 inventory hits. This batch closes
three repeated contracts with direct evidence: responsive available-space
filling, VideoRenderer/player CSS passthroughs, and MarkdownContent block
spacing. Card/list/navigation candidates may be changed only when their value
sets prove a finite contract.

## Decision 1 — FillAvailable frame

The repeated value `min-h-0 @app-lg:flex-1` is parent placement, not child
appearance. Introduce a house frame named `FillAvailable` only if the fresh
scan confirms at least these exact consumers:

- ContentMap
- LeaderboardCategoryRail
- MilestoneOutline
- ArchitectureRail
- PracticeRail

Contract:

- `at="lg"` maps privately to `@app-lg:min-h-0 @app-lg:flex-1`;
- `at="base"` may exist only if an unlocked consumer proves exact
  `min-h-0 flex-1` usage;
- body is a typed `ComponentType` slot and receives `isSkeleton` through the
  shared skeleton slot contract;
- no `className`, `classNames`, gap, padding, align, justify, or raw CSS props;
- the frame declares exactly one internal principle: `flex-fill`;
- add the principle/token/resolver/canon/test wiring in Storybook first, then
  mirror src.

Do not migrate `h-full`, arbitrary percentage heights, or locked
MockInterviewWorkspace into this frame. They are different contracts.

## Decision 2 — VideoRenderer ownership

Re-scan every VideoRenderer, MpegDash, Standard, and Youtube consumer.

If `VideoRenderer.className`, `VideoRenderer.classNames.base`, and
`VideoRenderer.classNames.content` have zero real consumers:

- delete those public doors;
- delete the className door from MpegDash, Standard, and Youtube;
- stop forwarding content classes;
- bake each player's existing intrinsic aspect/size/chrome into the player;
- preserve invalid-URL, controls, fullscreen, and renderer-selection behavior;
- remove stale `WithClassNames`, `cn`, imports, and memo dependencies.

If any real consumer exists, record its exact values and hold only that axis.
Do not add a generic `fit`, `height`, or `variant` prop without a finite value
set proven by consumers.

## Decision 3 — Markdown block spacing

`CodeToHtml` and `MermaidDiagram` currently receive the same `blockMy` value
from MarkdownContent map construction. Vertical block spacing belongs to the
MarkdownContent parent.

After proving those are the only consumers:

- remove public className/WithClassNames doors from CodeToHtml and both halves
  of MermaidDiagram;
- keep the canonical block spacing in a private MarkdownContent-owned boundary
  or private helper;
- use a typed ComponentType slot if that boundary composes a body;
- do not expose `blockMy`, `spacingClass`, className, classNames, or an
  arbitrary spacing prop;
- keep Shiki lazy loading, Mermaid rendering, captions, zoom, themes, and DOM
  behavior unchanged;
- update Storybook/src twins together.

## Secondary candidates

Re-evaluate these only after the three primary contracts are green:

- SectionCard
- TierCardBase
- LeaderboardListCard
- LabeledList
- ListRow
- SidebarNavItem
- TabsCard
- ButtonGroup

Apply only when all consumer values form one finite semantic axis. Separator
chrome may be baked intrinsically. Width, margin, flex/grid participation, and
responsive placement must move to the parent. If an exact existing
principle/frame does not exist, hold the case.

## Parallel workers

Use eight disjoint workers with exact manifests:

1. `fill-frame-contract` — new frame, principle registry, resolver, canon,
   tests, and Storybook/src twin only
2. `fill-learn-consumers` — ContentMap, LeaderboardCategoryRail,
   MilestoneOutline consumers only
3. `fill-page-consumers` — ArchitectureRail and PracticeRail consumers only
4. `video-renderer-contract` — VideoRenderer and three players plus their
   consumers
5. `markdown-block-contract` — CodeToHtml, MermaidDiagram, MarkdownContent map,
   and twins
6. `cards-lists` — SectionCard, TierCardBase, LeaderboardListCard,
   LabeledList, ListRow
7. `navigation-buttons` — SidebarNavItem, TabsCard, ButtonGroup
8. `verification-and-parity` — read-only until workers finish; coordinator
   regression fixes only

No file may occur in two manifests. Workers do not edit the decision ledger;
the coordinator updates it once after aggregation.

## Mandatory rules

- Storybook first, then mirror src;
- one principle per frame node;
- typed ComponentType slots, not ReactNode composition slots;
- no public CSS doors or CSS-shaped semantic names;
- no formatter or line-ending churn;
- no empty destructuring, stale imports, empty interfaces, or placeholder prop
  types after door deletion;
- no fake principles, eslint-disable, or unrelated cleanup;
- no a11y, contrast, axe, ARIA, keyboard, skeleton/loading, Nivo/Nivoexpert,
  locked-path, teacher-hold, or core Button/Chip/Stack/Grid/Box/SurfaceCard
  changes.

Each worker writes:

`.artifacts/fe-refactor-audit/2026-08-09-b29-worker-<name>.json`

Required fields: `manifest`, `consumerEvidence`, `valueSet`, `oldApi`,
`newApi`, `changed`, `holds`, `parity`, `verification`, `regressions`, and
`overlapCheck`.

Aggregate into:

`.artifacts/fe-refactor-audit/2026-08-09-b29-status.json`
`.artifacts/fe-refactor-audit/2026-08-09-b29-status.md`

Report before/after inventory, doors removed, new frame/token contracts,
secondary candidates applied versus held, exact files changed, overlap result,
and Storybook/src parity. Proposals are not fixes.

## Verification

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <changed files, bounded Windows chunks>
node --test plugins/eslint/public-contracts.test.mjs
node --test plugins/eslint/namespaces.test.mjs
node --test plugins/eslint/authoring.test.mjs
node --test plugins/eslint/contentpage.test.mjs
node --test .storybook/test-runner/principle-style.test.mjs
node --test .storybook/test-runner/semantic-contracts.test.mjs
npm run audit:fe
```

Do not commit, reset, checkout, push, create branches, or modify git history.
