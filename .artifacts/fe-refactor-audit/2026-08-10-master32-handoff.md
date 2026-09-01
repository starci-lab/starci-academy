# MASTER 32 session handoff

Date: 2026-08-10
Base checkpoint: `5c570642 refactor(fe): enforce sentence host ownership`
Status: **ready to commit**

## Closed in this session

- Added `starci-fe/no-css-door-type-laundering` and regression tests.
- Enabled the rule as a warning under the repository ratchet.
- Removed `InnerLayoutProps` inheritance from Navbar/Footer prop contracts.
- Replaced routed `ReactNode` composition with explicit `ComponentTypeWithSkeleton` slots: `navbar`, `body`, and optional `footer`.
- Removed broad Navbar/Footer prop spreading from InnerLayout.
- Added Storybook/src `ViewportShell`, which privately owns the established `min-h-dvh`, vertical direction, and `gap-1` shell seam.
- Removed InnerLayout's `Box className` escape and the parallel `StackV gap + principle` decision.
- Kept connected src wiring explicit: it builds Navbar/Footer slots and passes them to the presentational layout.
- Updated InnerLayout stories to the typed slot contract.

## Deliberate retraction

The partial Storybook Navbar migration and unused NavbarFrame draft were removed. Src Navbar was also restored. Navbar remains exactly at the base checkpoint and is not falsely claimed as closed.

Reason: Storybook still needed several missing vocabulary owners while src carried a larger independent warning set. Keeping one migrated tree would violate parity and leave `audit:fe` red.

## Owned files

- `plugins/eslint/css-door-laundering.mjs`
- `plugins/eslint/css-door-laundering.test.mjs`
- `plugins/eslint/index.mjs`
- `eslint.config.mjs`
- `.storybook/components/frames/ViewportShell/ViewportShell.tsx`
- `src/components/frames/ViewportShell/index.tsx`
- `.storybook/components/starci/layouts/InnerLayout/InnerLayout.tsx`
- `.storybook/stories/starci/layouts/InnerLayout/InnerLayout.stories.tsx`
- `src/components/layouts/InnerLayout/component.tsx`
- `src/components/layouts/InnerLayout/index.tsx`

## Verification

- Focused ESLint with `--max-warnings=0`: pass.
- CSS-door laundering tests: 2/2 pass.
- All plugin tests: 15/15 pass.
- Principle and semantic tests: 15/15 pass.
- `npx tsc --noEmit`: pass.
- `npm run audit:fe`: pass; 29 documented teacher holds, 0 failures.
- `git diff --check`: pass.
- Storybook/src ViewportShell API and implementation: equivalent.
- Navbar product diff: none.

## Honest residual scope

The new lint rule is an initial enforceable ratchet for direct Omit/Pick/Exclude CSS keys, direct Navbar/Footer prop inheritance, and broad Navbar/Footer spreads at layout/page tier. General alias and mapped/conditional-type data-flow analysis is a future tooling enhancement, not debt created by this session.

Navbar remains a dedicated future vertical slice. It requires consumer-proven owners for logo trigger, responsive search measure, mobile-only visibility, and notification popover before Storybook and src can migrate together.

## Commit boundary

Commit only the owned files above plus this handoff and the continuation prompt. Do not stage unrelated historical `.artifacts/**` files or old untracked prompts.

Suggested commit message:

```text
refactor(fe): close InnerLayout composition contract
```
