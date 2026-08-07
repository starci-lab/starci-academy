# BATCH 30 — Card, list, and navigation contract closure

Repo: `D:\Repositories\starci-academy`

Checkpoint:

`8c13fd52 refactor(fe): close fill media and markdown contracts`

BATCH 29 reduced the inventory to 1,536 hits. This batch closes the remaining
secondary candidates from B28/B29 using brace-aware consumer evidence. Nested
icon/button className values must never be attributed to the outer component.

## Decision law

- Parent width, margin, alignment, flex/grid participation, and responsive
  visibility stay with the parent.
- Intrinsic card/list chrome may become a finite semantic prop.
- Existing SurfaceCard/List/ButtonGroup contracts must be reused before adding
  anything new.
- Locked or vendor consumers may keep a door open, but unlocked consumers must
  still migrate when their ownership is proven.

## Contract candidates

### TierCardBase

The `popular` tier ring/border is intrinsic merchandising state. If the fresh
scan confirms the only live root class is:

`border-accent ring-2 ring-accent/30`

add a closed boolean semantic prop named `isFeatured`, map that chrome
privately, migrate TierCard, and remove the className door. Do not call the prop
`classVariant`, `ring`, or `accentClass`.

### ListRow

The proven `p-3` checklist row is a density choice, not parent placement. If
all remaining ListRow className values reduce to canonical default versus
`p-3`, add:

`density?: "default" | "comfortable"`

`comfortable` must preserve exact `p-3`. Migrate consumers and twins, then
delete the className door only when zero consumers remain. If other independent
axes exist, hold those separately rather than overloading density.

### ButtonGroup

- Bake the canonical separator chrome
  `!top-0 !h-full !bg-border !opacity-100` into ButtonGroupSeparator if every
  separator consumer expects that shape.
- Remove Separator className after zero-consumer proof.
- `w-fit` and `w-full` are parent placement. Migrate unlocked consumers to the
  owning parent wrapper/frame.
- Do not edit Nivoexpert RefundOrderModal. Its `w-full` usage remains an
  explicit hold, so do not falsely claim the root classNames door is closed.
- Storybook first, then src twin.

### TabsCard

`w-full`, `max-w-*`, and `mx-auto` are parent-owned measure/placement. Migrate
unlocked consumers using existing Container/Box/frame/principle contracts only
when visual dimensions remain exact.

Do not edit locked QuizSession. If that consumer keeps the door live, record
the residual hold. Do not add `width`, `maxWidth`, or `className` aliases to
TabsCard.

### LeaderboardListCard

Re-scan the sole TopLearners passthrough. If the class is root placement, move
it to the TopLearners parent and delete the door. If it changes card-intrinsic
chrome, define the finite semantic axis or hold it.

### SidebarNavItem and LabeledList

Use AST/brace-aware open-tag scanning. Nested icon, Badge, Button, or ListBox
classes do not count as SidebarNavItem/LabeledList consumers. If the apparent
doors have zero real consumers, remove them and clean types/imports. Otherwise
classify the exact values.

### SectionCard

SectionCard already duplicates card skin owned by SurfaceCard. Do not add a
new SectionCard classNames replacement.

Inspect whether SectionCard can compose an existing SurfaceCard member while
preserving:

- accent and verdict band;
- header icon/title/action;
- contentGap;
- fillHeight;
- contentAlign;
- caller identity;
- skeleton behavior and DOM semantics.

Implement the migration only if every behavior has an existing honest
SurfaceCard contract. Otherwise produce an exact missing-contract list and
hold SectionCard. QuizCard's forwarded classNames must be independently
resolved or held; do not hide it inside a new variant.

## Parallel workers

Use eight disjoint workers with exact manifests:

1. `tier-card` — TierCardBase, TierCard, FreeTierCard and twins
2. `list-row` — ListRow, ReadinessChecklist and all real ListRow consumers
3. `button-group` — ButtonGroup/Separator twins and unlocked consumers
4. `tabs-card` — TabsCard and unlocked consumers; locked QuizSession read-only
5. `leaderboard-list-card` — LeaderboardListCard and TopLearners chain
6. `sidebar-labeled-list` — SidebarNavItem and LabeledList brace-aware audit
7. `section-card-surface` — SectionCard/SurfaceCard compatibility audit and
   apply only if complete
8. `coordinator-verification` — overlap/parity, ledger, inventory and bounded
   lint; product edits only for verified regression repair

No file may occur in two manifests. Workers never edit the decision ledger;
the coordinator writes it once after aggregation.

## Mandatory rules

- Storybook first, then mirror src;
- one semantic prop per visual axis;
- typed ComponentType slots, not ReactNode composition slots;
- no public CSS doors, raw token props, arbitrary strings, or CSS-shaped API
  names;
- no fake principles, eslint-disable, formatter, line-ending churn, or
  unrelated cleanup;
- no empty destructuring, stale imports, empty interfaces, or obsolete props
  types after deletion;
- no a11y, contrast, axe, ARIA, keyboard, loading/skeleton, Nivo/Nivoexpert,
  locked-path, teacher-hold, or core Button/Chip/Stack/Grid/Box changes;
- do not change lint severity or vendor allowlists.

Each worker writes:

`.artifacts/fe-refactor-audit/2026-08-09-b30-worker-<name>.json`

Required fields: `manifest`, `openTagConsumers`, `valueSet`, `ownership`,
`oldApi`, `newApi`, `changed`, `holds`, `parity`, `verification`,
`regressions`, and `overlapCheck`.

Aggregate into:

`.artifacts/fe-refactor-audit/2026-08-09-b30-status.json`
`.artifacts/fe-refactor-audit/2026-08-09-b30-status.md`

Report before/after inventory, doors actually removed, residual locked/live
doors, semantic props added, parent-placement migrations, SectionCard decision,
Storybook/src parity, and overlap result. Proposals are not fixes.

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
