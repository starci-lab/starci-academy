# BATCH 31h — Sentence host ownership and Footer vertical closure

Repo: `D:\Repositories\starci-academy`

Read first:

- `.claude/fe/contracts/sentence-hosts.md`
- `.claude/fe/contracts/frame-items.md`
- `.storybook/components/frames/FooterFrame/FooterFrame.tsx`
- `src/components/frames/FooterFrame/index.tsx`
- `plugins/eslint/sentence-hosts.mjs`

The architectural decision is final: blocks, pages, layouts, and overlays do
not render raw structural host elements (`div`, `footer`, `aside`, `section`,
`main`, `header`, `nav`). A sentence tier composes typed vocabulary owners.
Removing `className` while leaving the raw host is a false closure.

## Phase A — protect in-flight work

The worktree may contain unrelated edits. Inventory all modified files first.
Do not reset, checkout, overwrite, format, or absorb unrelated diffs. Build
disjoint edit manifests and exclude every file owned by another in-flight
batch unless it is explicitly assigned below and its current diff has been
read in full.

## Phase B — complete the FooterFrame contract

Storybook first, then src:

1. Verify FooterFrame owns the semantic `<footer>` landmark, border/surface
   chrome, xl measure, and padding.
2. Add/update its Storybook story and frame barrels using direct named exports.
3. Keep `body: ComponentTypeWithSkeleton`; no ReactNode, children, className,
   classNames, free-form element, or CSS-shaped prop.
4. Ensure Storybook/src public APIs and intrinsic output are equivalent.
5. Add frame audit/parity coverage if the existing audit does not discover it.

## Phase C — Footer vertical migration

Migrate `.storybook/components/starci/blocks/navigation/Footer/**` first, then
the src twin.

- Root must be FooterFrame with block identity `Footer`.
- Delete the Footer public `className`/`classNames` door and `cn` dependency.
- Replace every remaining raw structural host in Footer with an existing honest
  frame/composite owner (Stack, Grid, Hide/Show responsive owner, navigation or
  list vocabulary as applicable).
- Preserve landmark semantics, links, text, responsive behavior, visual chrome,
  ordering, and skeleton behavior.
- Do not replace one raw host with another raw host or use Box as a generic
  escape hatch.
- Do not add a principle merely to silence lint. Each frame node has at most one
  singular honest principle, and that principle owns all applicable layout CSS.
- If a semantic owner is genuinely absent, stop only that subtree and propose a
  finite typed owner. Do not invent it inside the block.

Footer is retained only if both twins reach zero warnings. Otherwise retract
the Footer product edits while keeping the independent lint/frame contract if
those files remain zero-warning.

## Phase D — mass inventory and safe partitions

Run the new rule across product trees and record every hit. Then use parallel,
disjoint workers for:

1. Storybook blocks
2. src blocks
3. Storybook pages
4. src pages
5. Storybook layouts and overlays
6. src layouts and overlays
7. frame stories/barrels/parity
8. coordinator, overlap check, and reports

Workers may close only a complete semantic vertical slice using existing
vocabulary. Prioritize exact replacements such as landmark frames, Stack/Grid
composition, typed responsive owners, and established shells. Hold ambiguous
domain hosts and report the missing owner precisely.

## Touched-file ratchet

Every retained changed TS/TSX/MJS file must have exactly zero ESLint errors and
zero warnings. Do not fix unrelated in-flight files merely to make global tsc
green. Report baseline failures separately with exact paths and diagnostics.

## Forbidden

- no raw `div/footer/aside/section/main/header/nav` in sentence tiers;
- no public className/classNames or per-part CSS door;
- no `cn` in blocks/pages/layouts/overlays;
- no Box or fragment laundering;
- no fake principles, raw spacing, arbitrary tokens, inline styles, or CSS props;
- no ReactNode composition slot where ComponentType is possible;
- no vendor/Nivo/Nivoexpert/locked-path edits;
- no a11y/ARIA/keyboard/contrast changes;
- no ESLint disable, severity/config/allowlist relaxation;
- no page-folder moves or skeleton redesign;
- no commit, push, reset, checkout, branch, or history operation.

## Artifacts

Write:

- `.artifacts/fe-refactor-audit/2026-08-09-b31h-host-inventory.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31h-worker-<name>.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31h-status.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31h-status.md`

Report before/after hits by tag and tier, exact files changed, Footer API before
and after, Storybook/src parity, complete closures, holds with missing owners,
overlaps, unrelated baseline failures, and gate results.

## Verification

```text
npx eslint --max-warnings=0 <all retained changed TS/TSX/MJS files in bounded chunks>
node --test plugins/eslint/sentence-hosts.test.mjs
node --test plugins/eslint/public-contracts.test.mjs
node --test plugins/eslint/frame-items.test.mjs
node --test plugins/eslint/sentence-tier.test.mjs
node --test .storybook/test-runner/principle-style.test.mjs
node --test .storybook/test-runner/semantic-contracts.test.mjs
npx tsc --noEmit
npm run audit:fe
git diff --check -- <files owned by B31h only>
```

Do not commit.
