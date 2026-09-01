# Proven contract decisions — inventory 2026-08-08 (BATCH 14)

HEAD: `22f28f4e`. Prior: BATCH 13 contract-hold-status.

## Applied (proven)

| ID | Classification | Proof |
|---|---|---|
| WeeklyChallengeCard SB identity | twin-parity | src stamps identity on SurfaceCard; SB SurfaceCard Base now accepts `identity` (existing src API) then stamps |
| SB SurfaceCard Base `identity` | twin-parity | src SurfaceCard already has CallerIdentity; SB twin was missing |
| HeroUI vendor-boundary ledger | documentation | BATCH 13's 30 non-identical cases recorded as open hold — no migrations |

## Attempted then reverted

| ID | Classification | Proof |
|---|---|---|
| SB DrawerShell `contentClassName` removal | dead-prop (false) | Claimed 0 callers; **LessonEditorPanel** still passes it. Restored. Hold until nivo-allowed migrate. |

## Explicitly out of scope (proposed / held)

- dialogWidth, viewportFit, height enums, bodyVariant
- 30 HeroUI non-identical migrations
- 29 unclear identity hosts
- skeleton redesigns
- MiniCart/CvPreview/PDF live per-part props
- ModalShell `bodyClassName` (story consumers)
- DrawerShell `contentClassName` (nivoexpert LessonEditorPanel)
- ChipBase / handleSide / teacher / Nivo / a11y

## Partitions

1. weekly-challenge-parity — SurfaceCard SB identity + WeeklyChallengeCard SB stamp
2. identity-proven-roots — empty (no additional clear roots beyond prior applies)
3. dead-per-part-props — no removals after corrected consumer proof
4. consumer-barrel-cleanup — empty / audit only
5. vendor-boundary-ledger — document BATCH 13 heroui holds in ledger
6. storybook-parity-audit — record remaining SB/src shell prop drifts
