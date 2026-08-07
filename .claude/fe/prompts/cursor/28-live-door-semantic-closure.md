# BATCH 28 — Live CSS-door semantic closure, wave 1

Repo: `D:\Repositories\starci-academy`

Checkpoint:

`3afbadda refactor(fe): close proven live-door triage cases`

BATCH 27 reduced the inventory to 1,618 hits and produced 59 live-API plus 36
ambiguous proposals. Mechanical dead-door cleanup is nearly exhausted. This
batch may close a live door only after its consumer values prove a finite,
semantic contract.

## Contract law

For every className/classNames value, decide ownership in this order:

1. **Parent placement** — width in a grid, margin, flex/grid participation,
   ordering, alignment, sticky/fixed placement, or responsive visibility is
   owned by the parent. Migrate it to an existing parent frame/principle or a
   named existing wrapper. Do not add a child placement prop.
2. **Intrinsic appearance** — size, tone, shape, chrome, media fit, or an
   internally owned visual state may become a closed semantic prop only when
   every consumer forms a finite, named set and visual behavior stays exact.
3. **Foreign mount/vendor boundary** — keep the CSS door and document the
   boundary. Do not disguise it as a house semantic prop.
4. **Ambiguous** — hold. Do not guess.

One semantic prop must represent one axis. Never combine unrelated CSS into a
single variant. Never expose raw strings, arrays, arbitrary numbers, or
Tailwind-shaped names.

## Allowed implementation

For a proven finite intrinsic axis, B28 is authorized to:

- add a closed union or enum-like semantic prop;
- map it privately to CSS inside the owning component;
- migrate all in-repo consumers;
- delete the old className/classNames door when no consumer remains;
- update Storybook first, mirror src, tests, canon, and ledger.

For parent placement, use only an already-existing honest principle/wrapper.
If none matches exactly, hold the case. Do not invent a principle in B28.

## Candidate set

Start from `liveApiProposals` in:

`.artifacts/fe-refactor-audit/2026-08-09-b27-status.json`

Do not widen scope to the full 1,618-hit inventory. A candidate may be applied
only after re-scanning every consumer and recording the exact class values.

## Parallel ownership

Use twelve disjoint workers. The coordinator creates exact manifests before
dispatch and keeps each Storybook/src twin pair under one owner:

1. `buttons-actions` — ElementCloseButton, FloatingActionButton,
   AddToCartButton, FollowButton, AiRewriteButton, InfoTooltip
2. `cards-commerce` — SectionCard, PhaseScarcityNote, TierCardBase,
   LeaderboardListCard
3. `community-feed` — CommentComposer, Discussion, Composer
4. `identity-svg` — BadgeImage, BrandLockup, BrandLogo, IconTile, GithubIcon,
   GoogleIcon, LogoMark, TierLevelIcon
5. `layout-shells` — AmbientBackground, PageHeader, StickyBottomBar
6. `learn-content` — ChatToolResult, ContentMap, LeaderboardCategoryRail,
   MilestoneOutline, PlaygroundRagWorkspace
7. `lists-navigation` — LabeledList, ListRow, BackLink, SidebarNavItem,
   TabsCard
8. `media-rendering` — MpegDash, Standard, Youtube, CodeToHtml,
   MermaidDiagram
9. `rails` — CollapsibleSidebar, OutlineRail, ArchitectureRail, PracticeRail
10. `course-pages` — MetricsInline, CourseHero, CourseMobileEnrollBar,
    CoursePricingRail
11. `composite-twins` — ButtonGroup, composite FloatingActionButton, and
    MarkdownContent CodeToHtml/MermaidDiagram Storybook/src twins
12. `hard-holds` — MockInterviewWorkspace and CvPdfPreview; evidence only,
    no code unless the existing approved contract already covers the values

Resolve duplicate component names before dispatch. A file belongs to one
worker only. Workers never edit `.claude/fe/decision-ledger.json`; only the
coordinator updates it after aggregation.

## Worker procedure

For each candidate:

1. list every open-tag consumer and exact CSS value;
2. classify each value as parent placement, intrinsic appearance, vendor, or
   ambiguous;
3. identify an existing principle/prop or define one finite semantic axis;
4. show the before/after API table;
5. edit Storybook first when a twin exists, then mirror src and consumers;
6. prove zero old-door consumers before deleting the prop;
7. run tsc and ESLint on the worker manifest in bounded chunks.

No formatter, line-ending rewrite, empty destructuring, stale imports, empty
interfaces, or unrelated cleanup. Keep diffs minimal. Do not create
`Record<string, never>` merely to preserve an obsolete props type; delete the
type and use a no-argument component when it has no public props left.

Each worker writes:

`.artifacts/fe-refactor-audit/2026-08-09-b28-worker-<name>.json`

Required fields: `manifest`, `consumers`, `valueSet`, `ownership`, `oldApi`,
`newApi`, `changed`, `holds`, `parity`, `verification`, `regressions`, and
`overlapCheck`.

Aggregate into:

`.artifacts/fe-refactor-audit/2026-08-09-b28-status.json`
`.artifacts/fe-refactor-audit/2026-08-09-b28-status.md`

Report separately:

- doors removed;
- semantic props added;
- parent-placement migrations;
- vendor/locked/ambiguous holds;
- before/after inventory;
- Storybook/src parity and overlap result.

Do not count proposals as fixes.

## Hard exclusions

- no a11y, contrast, axe, ARIA, or keyboard work;
- no Nivo/Nivoexpert or locked-path edits;
- no teacher-hold or skeleton/loading edits;
- no changes to core Button, Chip, Stack, Grid, Box, SurfaceCard contracts;
- no generic CSS escape hatches, raw token props, eslint-disable, or fake
  principles;
- no lint severity or vendor allowlist changes.

## Verification after aggregation

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
