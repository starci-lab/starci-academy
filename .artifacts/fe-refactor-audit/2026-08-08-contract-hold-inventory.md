# Contract hold closure — inventory 2026-08-08 (BATCH 13)

Checkpoint context: BATCH 12 on `db1f7a11` / HEAD `22f28f4e` (+ uncommitted reconcile). Fresh ESLint: `2026-08-08-contract-hold-eslint-raw.json`.

## Totals

| Metric | Count |
|---|---:|
| starci-fe (repo) | 4679 |
| a11y untouched | 11 |
| scoped manifest files | 113 |

### Scoped classifications

| Classification | Count |
|---|---:|
| `ambiguous` | 243 |
| `identity-decision` | 72 |
| `new-named-slot-required` | 60 |
| `vendor-boundary` | 39 |
| `skeleton-decision` | 35 |
| `safe-consumer-migration` | 6 |

## Candidate areas → partitions

### `per-part-props`

- files: **17**
- by class: `new-named-slot-required(54)`, `safe-consumer-migration(6)`
- seeded decisions:
  - **DrawerShell-dialog-footer**: new-named-slot-required — MiniCart uses dialogClassName=sm:max-w-md and footerClassName flex-col stretch — real layout; needs named size/footerVariant or keep prop
  - **ModalShell-container-CvPreview**: new-named-slot-required — CvPreview containerClassName near-fullscreen + PDF heightClassName — not equivalent to size=cover/full without proof
  - **PDFView-heightClassName**: new-named-slot-required — Multiple story/viewport heights; propose height token enum only if canon already has sizes
  - **SurfaceCard-contentClassName**: new-named-slot-required — ContinueCard/LeagueCard/Leaderboard use contentClassName for stack chrome — stacking-layout owns ContinueCard; SurfaceCard prop may stay until named bodyVariant

### `stacking-layout`

- files: **11**
- by class: `ambiguous(18)`, `new-named-slot-required(6)`

### `heroui-boundaries`

- files: **30**
- by class: `ambiguous(124)`, `vendor-boundary(30)`, `identity-decision(26)`, `skeleton-decision(1)`

### `identity-hosts`

- files: **30**
- by class: `identity-decision(30)`, `ambiguous(20)`, `skeleton-decision(1)`

### `skeleton-contracts`

- files: **25**
- by class: `ambiguous(81)`, `skeleton-decision(33)`, `identity-decision(16)`, `vendor-boundary(9)`

### `twin-parity`

- files: **0**
- by class: (none)

## Hard holds

- 27 teacher pattern holds / Nivo / locked paths / a11y
- ChipBase API / handleSide vendor boundary
- No invented principle tokens / no eslint-disable / no generic className escapes
- No HeroUI conversion when atom API non-identical
- No prop removal while real consumers depend on it