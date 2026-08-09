# FINAL HANDOFF — MASTER 32 FE actionable-debt closure

Repo: `D:\Repositories\starci-academy`

Start from HEAD:

```text
9e86cbdf refactor(fe): close safe sentence-tier seams
6d9c157f style(fe): normalize semantic contract tooling
5b30acf1 refactor(fe): close InnerLayout composition contract
5c570642 refactor(fe): enforce sentence host ownership
```

This checkpoint is verified. Do not redo these commits or ask the teacher decisions settled below.

## Current state

- TypeScript: pass.
- `npm run audit:fe`: pass; 29 documented teacher holds, 0 failures.
- Plugin and Storybook contract tests: pass.
- Full ESLint inventory: 7,347 messages / 1,358 files / 0 errors.
- Preserve and exclude unrelated untracked `.storybook/components/nivo/blocks/instances/**`.

Top remaining rules:

```text
1744 no-host-element-at-sentence-tier
1494 no-public-classname-prop
835  no-raw-shape-at-sentence-tier
762  require-frame-self-declare
592  require-identity-root
448  no-heroui-outside-vocabulary
377  no-cn-above-vocabulary
354  page-folder-two-files-only
216  no-classname-at-sentence-tier
96   no-frame-fragment-item
68   no-parallel-skeleton
63   no-helper-folder-in-components
63   no-inline-parameter-type
53   no-emoji-in-source
47   no-inline-skeleton-branch
```

## Architecture law

- Atoms own intrinsic appearance and vendor behavior.
- Composites combine atoms into reusable semantic units.
- Frames own layout, landmarks, responsive visibility and structural chrome.
- Blocks/pages/layouts/overlays compose typed vocabulary only.
- Parent owns placement; child owns intrinsic appearance.
- Buildable slots use `ComponentTypeWithSkeleton`, never ReactNode or built JSX.
- House components expose no public className/classNames.
- No Omit/Pick/Exclude or alias laundering of CSS doors.
- No broad prop spreading or component-prop inheritance at composition tiers.
- No raw div/footer/aside/section/main/header/nav in sentence tiers.
- No cn, raw layout CSS, Box laundering or fragment laundering there.
- Each frame node has zero or one singular principle.
- A principle-owning node receives no gap/padding/align/justify/classNames.
- HeroUI namespaces are allowed; house runtime namespaces are forbidden.
- Storybook first, then src parity.

## Ratchet

For every retained changed file:

1. no errors;
2. no new warning rule;
3. warning count cannot increase;
4. owned rules reach zero;
5. unrelated historical warnings may remain but are reported before/after;
6. retract only for behavior, type, parity failure or a genuinely missing owner.

New tooling and vocabulary files must pass `--max-warnings=0`.

## Execution

### Wave 1 — vocabulary owners

Implement only finite, consumer-proven owners for logo trigger, mobile-only
visibility, responsive search measure, notification/popover viewport,
Dropdown/Kbd/richer Popover, inline Link gaps, and root identity support on
capable PageHeader/Toolbar/StatRibbon/ImplementationCard/AsyncContent/Tabs.
Storybook first, src mirror, tests before consumers. No CSS-shaped prop.

### Wave 2 — subsystem migrations

Use disjoint manifests:

1. Storybook navigation/shell
2. src navigation/shell
3. Storybook learning
4. src learning/content
5. src learning/practice
6. dashboard/community
7. profile/identity
8. commerce/course
9. admin/architecture
10. remaining Storybook blocks
11. pages A–M
12. pages N–Z

Navbar must land in Storybook and src together.

### Wave 3 — page-folder ownership

- reusable UI -> blocks;
- page-only arrangement -> inline into component.tsx;
- hook/fetch -> hooks;
- helper -> modules/utils;
- type -> modules/types;
- copy/config -> resources.

Update imports atomically and delete only proven orphans.

### Wave 4 — skeleton/final ratchet

Replace parallel skeletons with leaf isSkeleton threading, use zero-prop
ComponentType skeleton controls, retire old AsyncContent patterns, close frame
fragments and identity roots, then raise rules to error only at actionable zero.

## Locked

Do not edit Nivo/Nivoexpert, the 29 teacher holds, InputTags caret,
ArchitectureRail/PracticeRail asymmetric insets, ledger-locked paths, or
a11y/ARIA/keyboard/contrast behavior without explicit approval.

No fake principles, variants, wrappers, lint disables or allowlist relaxation.

## Worker protocol

Create non-overlapping manifests first. One owner edits shared vocabulary;
consumer workers wait. Preserve user changes. Do not commit, push, reset,
checkout, stash, clean or branch.

## Final gates

```text
npx tsc --noEmit
npx eslint --max-warnings=0 plugins/eslint/**/*.mjs eslint.config.mjs
node --test plugins/eslint/*.test.mjs
node --test .storybook/test-runner/principle-style.test.mjs
node --test .storybook/test-runner/semantic-contracts.test.mjs
npm run audit:fe
git diff --check
```

Rerun full ESLint JSON. Completion means zero errors, zero actionable warnings,
only explicit locked/teacher/vendor holds, proven parity, and no false closure.

Write only:

```text
.artifacts/fe-refactor-audit/FINAL-MASTER32-STATUS.json
.artifacts/fe-refactor-audit/FINAL-MASTER32-STATUS.md
```

Do not stop at inventory/proposals. Continue through implementation and
verification until actionable debt is zero. Do not commit.

