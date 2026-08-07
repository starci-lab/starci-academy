# BATCH 24 — Ratchet-ready CSS-door burn

Repo: `D:\Repositories\starci-academy`

Checkpoint:

`bf54bc28 refactor(fe): close pressable group span contract`

BATCH 23 closed the proven `SurfaceCardPressableGroupItem.span` contract and
produced the CSS-door inventory. The inventory reported 852 `ratchet-ready`
hits, 1,568 `live-api` hits, and preserved locked, vendor, teacher, and
ambiguous findings. This batch burns only findings that pass a fresh proof.

## Objective

Reduce proven-dead or behavior-neutral `className` / `classNames` doors across
the complete StarCi component tree:

- `src/components/**`;
- `.storybook/components/**`.

Storybook is the contract source. Mirror every approved change into the src
twin when a twin exists. Do not turn the lint rule to `error` in this batch.

## Allowed changes

Apply only when repository-wide search proves the condition:

1. Delete a public `className` / `classNames` prop, `WithClassNames` type, or
   dead passthrough when there are zero consumers and the twin remains aligned.
2. Remove a no-op class merge or destructured CSS door when it has no runtime
   effect and no public consumer.
3. Replace a parent-placement class with an existing semantic principle only
   when the existing token has the same layout meaning and the parent owns the
   placement.
4. Remove a redundant CSS door from a proven internal wrapper when behavior,
   DOM ownership, skeleton behavior, and public API are unchanged.
5. Make mechanical import, export, or type corrections required by the above.

Every change needs evidence in the worker report: consumer search, Storybook /
src parity, and the reason the DOM and visual contract are unchanged.

## Mandatory holds

Classify and leave unchanged:

- `live-api` doors with any real consumer;
- `vendor-boundary` doors, including Box and HeroUI wrappers;
- Nivo/Nivoexpert and locked paths;
- teacher holds and ambiguous identity roots;
- `LearnLoopScroll`, `ContentAiChat`, `QuizSession`, `MockInterviewSession`,
  `ArchitectureScene`, and `src/resources/**`;
- `DrawerShell.contentClassName` used by Nivoexpert LessonEditorPanel;
- `ShowcaseMockup.contentClassName` used by locked LearnLoopScroll;
- MiniCart, CvPreview, PDFView, SurfaceCard chrome/body doors, and any
  approved B19–B23 semantic contract;
- any case requiring a new principle, token, variant, slot, API rename, or
  visual redesign.

Do not work on a11y, contrast, axe, ARIA, keyboard behavior, skeleton/loading
semantics, page-folder moves, raw-shape debt, or pattern-coverage teacher
holds. Do not invent CSS escape hatches. Do not add `eslint-disable`.

## Required workflow

Before editing:

1. Run a fresh `no-public-classname-prop` inventory.
2. Revalidate every candidate previously labelled `ratchet-ready`.
3. Create disjoint file manifests. A file belongs to one worker only.
4. Record each candidate as `applied`, `live-api`, `vendor-boundary`, `locked`,
   `teacher-hold`, or `ambiguous` before changing it.

Use these disjoint workers:

1. `atoms` — `.storybook/components/atoms/**` and `src/components/atoms/**`
2. `composites` — `.storybook/components/composites/**` and
   `src/components/composites/**`
3. `frames` — `.storybook/components/frames/**` and `src/components/frames/**`
4. `blocks` — `.storybook/components/blocks/**` and `src/components/blocks/**`
5. `pages-primary` — learning, commerce, profile, and dashboard page trees
6. `pages-secondary` — all other eligible page trees, excluding locked paths
7. `layouts-and-app` — eligible layouts, app, modules, and utils paths
8. `storybook-only` — eligible `.storybook/components/**` files without a src
   twin; never edit a twin owned by another worker.

Workers must read the complete file and its twin before editing. No worker may
edit outside its manifest or repair another worker's files. If a candidate is
not mechanically safe, hold it and record why.

Each worker writes:

`.artifacts/fe-refactor-audit/2026-08-09-b24-worker-<name>.json`

Required fields: `manifest`, `changed`, `applied`, `skipped`, `holds`,
`evidence`, `parity`, `verification`, and `regressions`.

Aggregate into:

`.artifacts/fe-refactor-audit/2026-08-09-b24-status.json`
`.artifacts/fe-refactor-audit/2026-08-09-b24-status.md`

Report before/after counts by rule and bucket. Report exact files changed,
all holds preserved, Storybook/src parity, and any regressions. Do not count a
proposal or documentation-only handoff as a fix.

## Verification after aggregation

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

Do not commit, reset, checkout, push, create branches, or modify git history.
