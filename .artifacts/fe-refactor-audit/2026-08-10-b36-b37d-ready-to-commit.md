# READY TO COMMIT — B36+B37d

## Package

- Exact product manifest: **134** files (see `_b36-b37d-commit-manifest.json`)
- Checkpoint: `84b92cd77`
- Do **not** include: `CLAUDE.md`, `.claude/fe/decision-ledger.json`, mia-mia SiteFooter, Nivo InstanceList dirt, `.artifacts/**`, `.claude/fe/prompts/**`, `.claude/fe/TOPOLOGY.md`

## Numbers to quote

- ESLint: **6269/1105 → 6174/1084** (Δ −95 / −21), errors 0, a11y 11
- Topology: LabeledCard 97→77, frameless 54→46, SurfaceListCard 87→50, SurfaceCardList 111→146
- Introduced changed-file diagnostics: **0**

## Commit message

```
refactor(fe): unlock surface contracts and collapse labeled list ownership

Land B36 NavbarFrame/GlyphMark/identity/auth panel unlocks with B37 whole-composite
SurfaceCardList ownership collapses; restore ruleset freeze (no new lint rule) and
compress TrendingContents to a single SurfaceCardList.
```

## Evidence roster

- `2026-08-10-b36-b37d-scope.json`
- `2026-08-10-b36-b37d-eslint-before.json` / `...-after.json` / `...-delta.md`
- `2026-08-10-b36-b37d-large-diff-proof.json`
- `2026-08-10-b36-b37d-proofs.json`
- `2026-08-10-b36-b37c-redundant-labeled-surface.json`
- `2026-08-10-b36-b37d-status.json` / `.md`
- `_b36-b37d-commit-manifest.json`
