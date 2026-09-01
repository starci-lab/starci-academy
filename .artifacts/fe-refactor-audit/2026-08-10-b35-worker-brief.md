# B35 worker brief (Phase 0 → burn)

Checkpoint: `02011807` · Branch: `mtp` · **Do not commit**

## Standing constraints

- Edit **only** files in your agent key under `.artifacts/fe-refactor-audit/2026-08-10-b35-manifests.json`.
- Every editable candidate appears in exactly one manifest (`overlapPass` must stay true).
- Page files are owned **only** by `pages-and-filing` (agent 9).
- Shared atoms/frames/composites + leftover blocks: `shared-consumer-chains-coordinator` (agent 10).
- Forbidden / pre-dirty (never edit): nivo, nivoexpert, mia-mia, `CLAUDE.md`, `.claude/fe/decision-ledger.json`,
  `.storybook/stories/mia-mia/blocks/marketing/SiteFooter/SiteFooter.stories.tsx`,
  `src/components/blocks/learn/ReactionButton/types.ts`.
- Locked holds (list in manifest but do not burn): MockInterviewSession, QuizSession, LearnLoopScroll, ContentAiChat, ArchitectureScene, BlockAnatomy.
- A11y is observed only — outside architectural burn unless explicitly requested.
- No new vocabulary, fake principles, CSS-shaped public props, eslint-disable, or severity changes.
- Twin parity: Storybook first when both exist; keep src mirrored.
- Prefer vertical closes on high overlap-score clusters (see `2026-08-10-b35-ranked-clusters.md`).
- Touched-file law: tsc clean; no introduced lint on retained changes; zero warnings in clusters claimed closed.
- Agent 10 also owns aggregate gates later (`npm run audit:fe`, focused eslint, story anatomy gates).

## Read before editing

- Backend FE canon: `../starci-academy-backend/.claude/canon/fe/README.md`
- Local topology: `.claude/fe/TOPOLOGY.md`
- ESLint ruleset: `.claude/fe/ESLINT-RULESET.md`
- Inventory: `.artifacts/fe-refactor-audit/2026-08-10-b35-inventory.json`
- Manifests: `.artifacts/fe-refactor-audit/2026-08-10-b35-manifests.json`

## Report path

`.artifacts/fe-refactor-audit/2026-08-10-b35-worker-<agentKey>.json`
