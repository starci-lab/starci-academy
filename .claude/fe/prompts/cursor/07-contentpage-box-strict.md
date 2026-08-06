# BATCH — Close the Box CSS escape hatch in ContentPage

Repository:

`D:\Repositories\starci-academy`

Do not commit or push.

## Context

Checkpoint:

`c3273df6 refactor(fe): burn safe ESLint architectural debt`

The previous architectural burn intentionally left `Box` as a documented escape hatch. A mechanical pass in the ContentPage area converted `cn(...)` to a template string but preserved the CSS classes. That is not the final strict contract.

This batch closes the issue only for the ContentPage implementation and its Storybook twin.

Out of scope:

- all a11y and axe work;
- all 764 missing-both-principle cases;
- Nivo/Nivoexpert/Mia-Mia custom-CSS trees;
- MockInterview, QuizSession, LearnLoopScroll, ContentAiChat locked paths;
- unrelated Box call sites;
- teacher holds and pattern-coverage holds.

## Files in scope

- `.storybook/components/starci/pages/ContentPage/ContentPage.tsx`;
- `.storybook/stories/starci/pages/ContentPage/ContentPage.stories.tsx`;
- `src/components/pages/ContentPage/component.tsx`;
- `src/components/pages/ContentPage/index.tsx`;
- the smallest required frame/resolver/test files;
- the corresponding ESLint rule test.

## Contract

ContentPage must not make page layout decisions through raw CSS strings on `Box`, host elements, or strict frames.

Every remaining layout decision must be one of:

1. an existing semantic principle resolved by the frame;
2. an existing named semantic prop whose meaning is not raw CSS;
3. a dedicated component/frame that owns the visual behavior;
4. a documented hard-case/foreign-mount hold with a ledger entry.

Do not use `className` as a disguised fourth option.

## Phase 1 — inventory, no edits

Scan both trees and classify every ContentPage layout/style escape:

- `mx-auto`, `w-full`, `max-w-*`;
- `px-*`, `py-*`, `pb-*`;
- `relative`, `absolute`, `inset-*`, `bottom-*`;
- `overflow-*`, `select-none`, `pointer-events-none`;
- responsive visibility such as `@app-lg:hidden`;
- `Stack gap`, `Grid gap`, `Container padding` beside a principle;
- `Box className` and `Box classNames`;
- host `<div className>` layout decisions.

Write a short report to:

`.artifacts/fe-refactor-audit/2026-08-07-contentpage-box-report.md`

Classify each item:

- `page-seam` — migrate to an existing principle/frame;
- `state` — replace CSS state with a named semantic prop/state owner;
- `responsive-behavior` — use an existing responsive semantic API or record a contract gap;
- `visual-overlay` — move to a dedicated overlay/positioning owner;
- `foreign-mount` — keep only if it is genuinely foreign/vendor-owned and document it;
- `hard-case` — leave unchanged and record why.

Do not edit during the inventory phase.

## Required migration

### Page shell

The page shell currently combines centering, max width, responsive padding, and bottom spacing in one CSS string. Split those decisions into the existing semantic frame/principle structure.

Do not put multiple unrelated spacing decisions into one principle. If one existing token cannot represent the responsive/asymmetric shape, use nested frames or record a contract gap; do not invent a token silently.

### Reading region

For `relative`, width, overflow, and article anchoring:

- keep the `id="lesson-article"` and `data-ai-selectable` behavior;
- move layout ownership to an existing frame/composite where possible;
- do not remove the anchor semantics just to make lint pass.

### Locked/paywall overlay

The gradient overlay is a visual positioning behavior, not ordinary page padding. Do not delete or flatten it.

Move it to a named overlay/positioning owner if one exists. If no honest owner exists, record a hard-case/foreign-mount hold with the exact class and reason.

### Responsive practice nudge

`@app-lg:hidden` is responsive visibility, not a spacing principle. Do not encode it as a fake gap/padding principle.

Use an existing named responsive prop/frame if one exists. Otherwise record a contract gap and leave the behavior unchanged.

### Locked state

Replace `select-none` with an existing semantic locked/read-only behavior if available. If the actual component API does not support it, preserve behavior and record a hard-case rather than deleting the class.

## ESLint enforcement

Do not globally remove the Box escape hatch in this batch.

Instead, add a focused regression rule/test so that in ContentPage:

- `Box className` is rejected for page/layout CSS;
- fixture wrappers in Storybook stories remain allowed;
- documented foreign/overlay hard cases are ledger-backed;
- the rule message refers to singular `principle`, never plural terminology.

If the current rule can express this safely by checking the ContentPage path, extend it narrowly. Do not add a broad `Box` ban that breaks unrelated vendor mounts.

## Workflow

- Storybook implementation first;
- mirror the source implementation;
- use disjoint subagents only if files are disjoint;
- preserve DOM behavior, skeleton behavior, responsive behavior, and public API;
- no a11y work;
- no broad eslint-disable;
- no fake principle tokens.

## Verification

Run:

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <all changed ContentPage/frame/rule-test files>
node --test .storybook/test-runner/principle-style.test.mjs
npm run audit:fe
```

Also run a focused source scan proving that ContentPage has no unclassified `Box`/host layout CSS. Story fixture padding and code-example strings must be excluded from that scan.

Report:

- every removed CSS decision;
- final principle/frame owner;
- every retained hard-case and ledger id;
- Storybook/src parity;
- exact verification results.

Do not commit or push.
