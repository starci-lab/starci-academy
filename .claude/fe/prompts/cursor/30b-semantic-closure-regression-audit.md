# BATCH 30b — Semantic closure regression audit

Repo: `D:\Repositories\starci-academy`

Continue from the current uncommitted BATCH 30 working tree. Do not discard,
reset, checkout, or overwrite B30 changes.

The coordinator has added the exact regression case to
`plugins/eslint/sentence-tier.test.mjs`. The existing
`starci-fe/no-raw-shape-at-sentence-tier` rule already reports the confirmed
LeaderboardListCard line. Treat every warning from that rule in a B30-changed
product file as a failed semantic closure. Do not delete, weaken, bypass, or
reconfigure the rule.

## Confirmed regression

`src/components/blocks/dashboard/LeaderboardListCard/index.tsx` currently
contains this false closure in the `bare` branch:

```tsx
<div className="flex flex-col gap-3">
    {contentItems.map((Item, index) => (
        <Item key={index} />
    ))}
</div>
```

B30 removed the public `className` door but retained the same private raw
layout CSS. That is not a semantic closure.

`bare` means that the caller/page owns the outer card placement and that
`LeaderboardListCard` omits `LabeledCard` chrome. It does not transfer
ownership of the internal relationship between standing, podium, and list.
Those remain sibling sections owned by `LeaderboardListCard`.

Create one shared internal render using the existing `StackV` and the existing
honest `sibling-stack` principle. Both bare and card branches must use it:

```tsx
const content = (
    <StackV
        principle="sibling-stack"
        explain="Standing, optional podium, and cohort list are peer sections in one leaderboard."
        items={contentItems}
    />
)

if (bare) return content
```

Render the same `content` inside `LabeledCard` for the non-bare branch. Do not
pass `gap`; the principle owns spacing. Preserve behavior, order, keys,
identity, `bare`, title, and see-more behavior.

## Required B30 diff audit

Audit every B30 product-code diff, not the whole repository. Detect every case
where a public CSS door was removed but its class payload was retained or moved
into private raw markup, for example:

```text
className={cn("...", className)} -> className="..."
classNames={...} removed -> raw div/span with equivalent layout classes
component CSS prop removed -> wrapper introduced only to carry the same CSS
semantic component removed -> raw flex/grid/spacing markup retained
```

For each finding classify it as:

1. `intrinsic` — private visual chrome genuinely owned by the leaf/component;
2. `principle-owned` — replace with an existing frame and exactly one honest
   `principle`;
3. `parent-placement` — move placement to the immediate parent using an
   existing frame/semantic owner;
4. `vendor-boundary` — retain only at an already documented foreign mount;
5. `hold` — no honest existing contract; restore the door if removing it would
   merely hide CSS internally.

Do not count a door as closed when the same raw layout CSS remains inside the
house component. Intrinsic leaf chrome is allowed only when it is genuinely
appearance, not spacing between children, width in a parent, alignment,
responsive visibility, flex/grid participation, margin, or measure.

## Scope

- Read `git diff` and the B30 worker reports/status artifacts.
- Fix only regressions introduced by the current B30 diff.
- Storybook first when a changed component has a Storybook twin, then mirror
  src.
- Preserve all correct B30 semantic props and migrations.
- Update the relevant B30 worker report and aggregate status with a
  `semanticClosureAudit` section listing file, old payload, classification,
  owner, action, and verification.
- Record the LeaderboardListCard false closure explicitly; do not hide it in
  aggregate counts.

## Forbidden

- no new principle/token/variant/slot/API;
- no fake principle;
- no public `className`/`classNames` restoration except a proven `hold` where
  B30 falsely claimed closure and no honest contract exists;
- no raw replacement wrapper used solely to carry removed CSS;
- no `gap`, `padding`, `align`, `justify`, `className`, or `classNames` beside a
  principle-owned Stack/Grid/Form;
- no core Button/Chip/Stack/Grid/Box API edits;
- no Nivo/Nivoexpert, locked path, teacher hold, a11y, skeleton/loading, or
  unrelated cleanup;
- no eslint-disable, formatting, line-ending churn, commit, reset, checkout,
  push, branch, or git-history operation.

## Verification

Run after repair:

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <all B30 changed TS/TSX/MJS files in bounded Windows chunks>
node --test plugins/eslint/public-contracts.test.mjs
node --test plugins/eslint/sentence-tier.test.mjs
node --test plugins/eslint/namespaces.test.mjs
node --test plugins/eslint/authoring.test.mjs
node --test plugins/eslint/contentpage.test.mjs
node --test .storybook/test-runner/principle-style.test.mjs
node --test .storybook/test-runner/semantic-contracts.test.mjs
npm run audit:fe
```

Also run a focused diff review and report:

- every removed CSS door in B30;
- whether equivalent raw CSS remains inside that component;
- the semantic owner after 30b;
- unresolved holds without claiming them fixed;
- Storybook/src parity;
- exact errors and warnings, with no sample-only lint claim.

Do not commit.
