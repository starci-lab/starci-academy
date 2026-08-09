# FE Refactor Handoff

## Current objective

Continue the StarCi FE refactor until non-a11y ESLint warnings reach zero. Do not stop at safe mechanical cleanup when an existing contract and consumer evidence allow the next migration. Do not invent tokens, fake principles, CSS-shaped public APIs, or lint disables.

## Repository

- Repo: `D:\Repositories\starci-academy`
- Branch: `mtp`
- Storybook retirement commit: `cca3a2ff2 chore(fe): retire Storybook and tenant blueprints`
- Previous surface contract commit: `2a096210a refactor(fe): unlock surface contracts and collapse labeled list ownership`
- Current worktree is intentionally dirty. Preserve existing user changes; never reset, checkout, or discard unrelated edits.

## Architecture canon

- One singular `principle` per structural owner.
- Parent owns placement; child/composite owns intrinsic shape.
- No public house `className` / `classNames` / layout CSS props.
- Prefer typed `ComponentType` slots over `ReactNode` for owned render slots.
- Atoms are intrinsic leaves; frames own structure; composites are complete semantic shapes; blocks are domain sentences; pages orchestrate.
- No runtime house namespaces.
- No fake principles, arbitrary tokens, wrapper laundering, or `eslint-disable`.
- A11y/ARIA/contrast/keyboard findings are explicitly out of scope and remain untouched.

## Storybook status

Storybook, mia-mia, Nivo, and Nivoexpert were explicitly retired and committed in `cca3a2ff2`. Two ignored/untracked Nivo residual files may still exist and were causing TypeScript errors:

- `.storybook/components/nivo/blocks/instances/InstanceList/InstanceList.tsx`
- `.storybook/stories/nivo/blocks/instances/InstanceList/InstanceList.stories.tsx`

Remove only these exact residuals if they still exist; verify the target paths before deletion. Do not restore Storybook.

## Direct changes in this session

- Named parameter interfaces added in several CV/learn/page files to reduce `no-inline-parameter-type`.
- Safe handler renames applied where semantics were unambiguous.
- KnowledgeGraph drag handlers changed from `NodeMouseHandler` to `OnNodeDrag` to match `@xyflow/react`.
- Apollo `defaultOptions` type changed to `ApolloClient.DefaultOptions.Input`.
- These edits are uncommitted and belong to the current worktree; review before commit.

## Baseline observed

Full `src` ESLint scan had approximately 5,444 warnings and 0 errors after the previous mechanical pass. Main rule counts included:

- `no-host-element-at-sentence-tier`: 1124
- `no-public-classname-prop`: 983
- `no-raw-shape-at-sentence-tier`: 744
- `require-frame-self-declare`: 563
- `require-identity-root`: 494
- `no-heroui-outside-vocabulary`: 393
- `no-cn-above-vocabulary`: 345
- `page-folder-two-files-only`: 273
- `no-classname-at-sentence-tier`: 173
- `no-parallel-skeleton`: 60
- `no-frame-fragment-item`: 59
- `no-inline-skeleton-branch`: 44
- `no-skeleton-twin-component`: 37
- `no-retired-async-content`: 36

The exact current inventory must be re-run; do not rely on stale counts.

## Parallel worker results

Six workers were spawned with disjoint scopes. They mostly classified holds rather than applying changes:

- Learn/community: many cross-layer warnings; composites still have about 109 warnings.
- Commerce/dashboard: about 75 warnings; most require atoms/frames/API work.
- Atoms/frames: 27 warnings, mostly live consumers outside the scope; 3 a11y findings intentionally held.
- Layouts/modules: about 482 warnings, mostly sentence hosts, HeroUI vocabulary, and CSS-door APIs.
- Pages worker: page partitions were spawned; inspect their final reports before touching their files.

Do not duplicate worker work. Read their final statuses/reports first and inspect diffs before integration.

## Known TypeScript blockers at handoff

- Storybook residual Nivo files listed above.
- GraphQL options was patched locally; re-run `npx tsc --noEmit` to confirm whether it is resolved.
- KnowledgeGraph handler type errors were patched locally; re-run TypeScript.

## Next execution order

1. Re-run `git status`, `npx tsc --noEmit`, and a fresh `npx eslint src --format json`.
2. Remove the two exact Storybook residual files if present.
3. Collect all worker final reports and inspect changed files for overlap/regressions.
4. Process consumer chains in this order: pages → blocks → composites → atoms/frames.
5. For each changed file, require zero non-a11y warnings and zero errors before retaining it.
6. Use existing principles/vocabulary first. If a warning requires a genuinely new contract, record it as a decision hold instead of inventing an API.
7. Run `npx tsc --noEmit`, focused ESLint, plugin tests, `npm run audit:fe`, and `git diff --check` after each wave.
8. Do not commit until the user explicitly requests a checkpoint commit.

## Important caution

The user now wants direct implementation rather than Cursor prompts. Spawn subagents only with disjoint write manifests, but the coordinator must review all returned diffs. A worker claiming “zero warnings” is not sufficient if it used a fake token, changed a public API without consumers, touched a locked path, or ignored a11y scope incorrectly.
