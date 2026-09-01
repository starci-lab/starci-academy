# BATCH 16 — Remaining contract holds inventory

Checkpoint: `ed86d170`

## Classification summary

| Class | Count | Action |
|---|---:|---|
| safe | see manifests | apply |
| vendor-boundary | 30 | document only |
| API-hold | MiniCart/CvPreview/PDF/bodyClassName/contentClassName | hold |
| teacher-hold | 27 | untouched |
| ambiguous | 29 unclear identity hosts + SectionCard classNames debt | untouched |

## Partition manifests (disjoint)

### 1. clear-identity-roots
- MilestoneUpNextCard (src+SB) — stamp SurfaceCard
- QuizCard — stamp SectionCard
- PitchCard — stamp SectionCard
- VerdictHeroCard — stamp SectionCard
- WeeklyGoals (src+SB blocks) — relocate identity to SurfaceCard; drop inner StackV stamps
- JobReadinessWidget (src+SB blocks) — relocate identity to SurfaceCard; drop inner StackV stamp

### 2. dead-prop-consumers
- SB ModalShell: remove titleClassName, footerClassName, dialogClassName (0 JSX consumers; absent src)
- SB DrawerShell: remove titleClassName, bodyClassName (0 JSX consumers; absent src)
- Keep: ModalShell.bodyClassName; DrawerShell.contentClassName/dialogClassName/footerClassName

### 3. direct-export-and-barrel-consumers
- Remove unused `export const Link = {…}` (src+SB) — LinkBack/LinkSeeMore remain
- Remove unused `export const Stack = {…}` (src+SB) — StackV/StackH remain

### 4. Storybook-src-parity
- SB SurfaceCard: port identity to Nested, PressableGroup, SelectableGroup, List, Accordion, CrossList, Placeholder
- SB SurfaceCardListItem: remove dead titleClassName (0 consumers; absent src)

### 5. HeroUI-vendor-boundaries
- Document-only ledger refresh; no migrations

### 6. skeleton-and-layout-holds
- Document-only; no edits

## Explicit non-goals
dialogWidth, viewportFit, height enum, bodyVariant; MiniCart/CvPreview/PDF/ContinueCard redesign; Nivo; teacher; a11y; unclear hosts.
