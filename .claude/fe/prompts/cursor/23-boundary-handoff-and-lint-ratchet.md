# BATCH 23 — Boundary handoff and lint ratchet preparation

Repo: `D:\Repositories\starci-academy`

Checkpoint:

`bd09062d refactor(fe): add SurfaceCard chrome contract`

BATCH 22 applied `SurfaceCard.chromeVariant="tile"` and passed all gates. The
remaining CSS-door findings are boundary or contract cases, not mechanical
cleanup.

## Objective

Produce a precise handoff for the remaining boundaries and close only a proven
PressableGroupItem contract. Prepare the strict CSS-door rule for a future
ratchet without hiding unresolved debt.

## Scope

### PressableGroupItem

Inspect the proposed span/press-target change. Implement only if the existing
DOM, event, focus, and consumer contract prove the change is behavior-neutral.
If not, record the required contract and leave code unchanged.

### Nivoexpert DrawerShell boundary

Do not edit `.storybook/components/nivoexpert/**`. Inspect the sole
LessonEditorPanel consumer from outside the boundary and write a migration
handoff for `DrawerShell.contentClassName` → the appropriate semantic contract
in a future Nivo batch.

### ShowcaseMockup boundary

Do not edit locked LearnLoopScroll. Record why its `contentClassName` cannot be
mechanically replaced and identify the owning future composite/variant.

### CSS-door lint ratchet

Run a fresh inventory of `starci-fe/no-public-classname-prop` across:

- `src/components/**`;
- `.storybook/components/**`.

Separate findings into:

`vendor-boundary | locked | teacher-hold | live-api | ambiguous | ratchet-ready`

Do not change the vendor allowlist or turn the rule to `error` in this batch.
The output must prove which paths can be ratcheted later.

## Mandatory rules

- no a11y, contrast, axe, ARIA, or keyboard work;
- no Nivo/Nivoexpert source edits;
- no locked-path edits;
- no teacher-hold edits;
- no new principle tokens;
- no new semantic variant unless PressableGroupItem evidence proves it;
- no renamed CSS doors or generic escape hatches;
- no eslint-disable;
- no git commit, reset, checkout, push, or branch changes.

## Workflow

Use disjoint manifests:

1. `pressable-group-contract`
2. `nivoexpert-handoff`
3. `showcase-locked-handoff`
4. `css-door-ratchet-inventory`
5. `storybook-parity-and-tests`

Each worker writes:

`.artifacts/fe-refactor-audit/2026-08-09-b23-worker-<name>.json`

Required fields: `changed`, `skipped`, `holds`, `evidence`, `handoff`,
`ratchetReady`, `verification`, and `regressions`.

Aggregate into:

`.artifacts/fe-refactor-audit/2026-08-09-b23-status.json`
`.artifacts/fe-refactor-audit/2026-08-09-b23-status.md`

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

Report applied code separately from Nivoexpert/locked handoffs and future
ratchet candidates. Do not claim a boundary hold as fixed. Do not commit.
