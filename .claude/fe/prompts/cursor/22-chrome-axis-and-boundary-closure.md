# BATCH 22 — Chrome axis and remaining boundary closure

Repo: `D:\Repositories\starci-academy`

Checkpoint:

`90009dc5 refactor(fe): close proven list and card css doors`

BATCH 21 closed proven List, KeyValue, and LabeledCard doors. Remaining
findings are narrower contract cases:

- SurfaceCard TILE_CHROME is outer chrome, not body layout;
- ShowcaseMockup is used by locked LearnLoopScroll;
- Storybook DrawerShell has a Nivoexpert LessonEditorPanel consumer;
- PressableGroupItem has a proposed span/press-target decision.

## Objective

Close the proven SurfaceCard chrome contract. Audit the other boundaries without
editing locked or vendor-owned consumers.

## Approved contract

Add one semantic SurfaceCard axis:

```ts
chromeVariant?: "default" | "tile"
```

The `tile` variant owns only the proven outer chrome that was previously passed
through TILE_CHROME content CSS. It must not own body layout or invent a
principle. `bodyVariant` remains responsible only for body layout:

```ts
bodyVariant?: "default" | "stacked" | "tile"
```

Keep the two axes independent. Do not merge `chromeVariant` and `bodyVariant`
into one compound variant.

Migrate both ContinueCard consumers in Storybook and src, then remove only the
matching TILE_CHROME content class strings.

## Boundary holds

Do not edit these code paths:

- `.storybook/components/nivoexpert/**`;
- `ShowcaseMockup` usage from locked `LearnLoopScroll`;
- teacher holds, Nivo/Nivoexpert consumers, or locked paths;
- HeroUI/vendor boundaries;
- a11y, contrast, axe, ARIA, or keyboard behavior.

For these paths, write evidence and a proposal only:

1. DrawerShell `contentClassName` → Nivoexpert LessonEditorPanel migration;
2. ShowcaseMockup `contentClassName` → locked LearnLoopScroll migration;
3. PressableGroupItem span/press-target contract.

## Workflow

Run a fresh inventory before edits. Use disjoint manifests:

1. `surface-card-chrome`
2. `continue-card-twins`
3. `pressable-group-audit`
4. `nivoexpert-boundary-report`
5. `showcase-locked-report`
6. `storybook-parity`

No worker may edit outside its manifest. Storybook and src twins belong to the
same worker. Each worker writes:

`.artifacts/fe-refactor-audit/2026-08-09-b22-worker-<name>.json`

Required fields: `changed`, `skipped`, `holds`, `evidence`, `proposals`,
`verification`, and `regressions`.

## Rules

- Preserve visual behavior and DOM semantics.
- Do not add any variant beyond `chromeVariant="tile"`.
- Do not pass CSS under a renamed prop.
- Do not add a generic `className` or `classNames` escape hatch.
- Do not modify the strict ESLint rule or its vendor allowlist without evidence.
- Do not add eslint-disable.
- Do not commit, reset, checkout, push, or alter branches.

## Verification

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <changed files>
node --test plugins/eslint/public-contracts.test.mjs
node --test plugins/eslint/namespaces.test.mjs
node --test plugins/eslint/authoring.test.mjs
node --test plugins/eslint/contentpage.test.mjs
node --test .storybook/test-runner/principle-style.test.mjs
node --test .storybook/test-runner/semantic-contracts.test.mjs
npm run audit:fe
```

Report the chrome axis implementation separately from the three boundary
proposals. Do not claim locked/vendor holds as fixed. Do not commit.
