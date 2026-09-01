# READY TO COMMIT

Batch **B32c** certifies Batch **B32** against checkpoint **`9e86cbdf`**.  
Do **not** include the hold-out files below. Do **not** treat freeze-audit or original B32 inventory totals as the before baseline.

## Exact B32 file manifest (203)

See `.artifacts/fe-refactor-audit/_b32c-commit-manifest.json` → `commit`.

Ownership: every file is `b32-worker`, `coordinator-repair`, or
`coordinator-required-consumer-repair` in `2026-08-10-b32c-scope.json`.

### Nivoexpert transitive repairs (keep in commit)

Exception id: **`b32-button-group-nivoexpert-transitive-repair`**  
Classification: **`coordinator-required-consumer-repair`**  
Ledger: `.claude/fe/decision-ledger.json`

| File | Change |
|---|---|
| `.storybook/components/nivoexpert/blocks/studio/ConfirmDialog/ConfirmDialog.tsx` | removed `classNames={["w-full"]}` after `ButtonGroup.classNames` deleted |
| `.storybook/components/nivoexpert/overlays/modals/RefundOrderModal/RefundOrderModal.tsx` | same |

These are required compile repairs for a deleted house API. They are **not** a
Nivo architectural migration and do **not** broaden the Nivo unlock. No Nivo
behavior, structure, identity, principle, styling, or public contract was redesigned.

### Hold out of this commit

| File | Reason |
|---|---|
| `.storybook/components/nivo/blocks/instances/InstanceList/InstanceList.tsx` | unrelated locked/nivo |
| `.storybook/stories/nivo/blocks/instances/InstanceList/InstanceList.stories.tsx` | unrelated locked/nivo |
| `.storybook/stories/mia-mia/blocks/marketing/SiteFooter/SiteFooter.stories.tsx` | unrelated / pre-B32 dirty |
| `CLAUDE.md` | pre-B32 dirty |
| `src/components/blocks/learn/ReactionButton/types.ts` | pre-B32 dirty |

## Normalized before / after

Command (identical both sides):

`npx eslint --format json --no-error-on-unmatched-pattern src .storybook`

| Metric | Before (`9e86cbdf`) | After (worktree) | Δ |
|---|---:|---:|---:|
| Raw messages | 7444 | 7136 | −308 |
| Affected files | 1437 | 1260 | −177 |
| Errors | 0 | 0 | 0 |
| Warnings | 7444 | 7136 | −308 |
| Actionable (hold class) | 6721 | 6417 | −304 |
| Locked | 712 | 708 | −4 |
| A11y observed | 11 | 11 | 0 |

Full rule/path deltas: `2026-08-10-b32c-eslint-delta.md`.

## Real clusters

Method: `twinFamily + exportHint + ruleKind + lineBand20` (multiple rules on one owner key = one cluster). Partial consumer migrations are **not** counted closed.

| Status | Count |
|---|---:|
| Closed | **231** |
| Partially closed | 18 |
| Unchanged actionable | **4050** |
| Introduced-key noise (message/line-band) | 2 (not new debt) |

Worker heterogeneous “58 closed claims” superseded by this inventory.

## Remaining actionable / holds

- **~4050** unchanged actionable semantic clusters remain product-wide.
- Live-consumer doors still held: Button/Chip/Avatar/Typography; Stack/Flex/Cluster/Container; EnumChip/ProgressMeter/Markdown; page-folder Auth helpers; HeroUI sentence debt.
- `npm run audit:fe`: **29** explicit ledger holds.
- Locked messages after: **708**.

## Gate results

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | **pass** (re-verified after certification correction) |
| `node --test plugins/eslint/*.test.mjs` | **22/22 pass** |
| `node --test .storybook/test-runner/principle-style.test.mjs .storybook/test-runner/semantic-contracts.test.mjs` | **15/15 pass** |
| `npm run audit:fe` | **pass** (re-verified after certification correction) |
| `git diff --check` | **pass** (re-verified after certification correction) |
| Changed-file ESLint certification | **pass** — introduced errors 0, introduced warnings 0, closed-cluster door warnings 0, unclassified 0 |

## Recommended commit message

```
refactor(fe): close B32 topology-safe dead CSS-door and authoring clusters

Remove proven-dead classNames/className APIs across atom/frame/composite twins,
migrate live consumers, and harden the ESLint oracle without inventing new doors
or wrappers.
```

## Staging hint (when you ask to commit)

Stage only the 203 paths in `_b32c-commit-manifest.json` (includes the two
nivoexpert transitive repairs). Leave hold-outs and regenerable `.artifacts/`
unstaged unless you explicitly want audit evidence in-tree. Include
`.claude/fe/decision-ledger.json` so the applied exception is recorded with the commit.
