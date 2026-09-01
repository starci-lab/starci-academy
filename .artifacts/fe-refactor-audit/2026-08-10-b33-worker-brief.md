# B33 worker standing brief

Checkpoint: `139391b6` · Branch: `mtp` · **Do not commit**

## Hard rules

- StarCi only. Forbidden: nivo, nivoexpert, mia-mia, locked product paths, a11y work.
- Do not edit `CLAUDE.md` or `.claude/fe/decision-ledger.json` (dirty; read-only).
- No new vocabulary, fake principles, CSS-shaped public props, eslint-disable, severity changes.
- Existing frames only: FillAvailable, Box, GridItem, Measure, ShowFrom, PagePad, typed atom props.
- If shared API still needed by forbidden consumers: migrate StarCi away, retain API, hold declaration.
- Twin parity: Storybook first when both exist; keep src mirrored.
- Retention: tsc clean on touched files; no introduced lint; zero warnings in clusters claimed closed.
- Report honestly: partial work is OK.

## Read before editing

- `CLAUDE.md`, `.claude/fe/TOPOLOGY.md`, `.claude/fe/ESLINT-RULESET.md`
- `.artifacts/fe-refactor-audit/2026-08-10-b33-manifests.json` (your agent key only)
- `.artifacts/fe-refactor-audit/2026-08-10-b33-partial-clusters.md`
- `.artifacts/fe-refactor-audit/2026-08-10-b32c-status.md`

## Process

1. Load your file list from manifests.json.
2. For each file: eslint diagnostics → identify cluster → migrate vertically if vocabulary is exact.
3. Prefer closing B32 partial clusters assigned to you.
4. Run `npx eslint --max-warnings=0` on changed chunks (classify remaining pre-existing).
5. Write worker report JSON with required fields.

## Report path

`.artifacts/fe-refactor-audit/2026-08-10-b33-worker-<name>.json`

Required fields: manifest, clusterIds, consumersScanned, consumersMigrated, sharedApiRemovedOrRetained, beforeAfterMessages, closedClusters, partialClusters, holds, forbiddenConsumers, parity, tests, regressions.
