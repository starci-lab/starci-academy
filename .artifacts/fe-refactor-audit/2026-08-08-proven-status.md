# BATCH 14 — Apply proven contract decisions

**HEAD:** `22f28f4e` · **branch:** `mtp` · **committed:** no

## Verdict

Applied Storybook/src identity parity for WeeklyChallengeCard (via SurfaceCard Base `identity` port). No dead per-part props removed after a false zero-consumer claim on DrawerShell `contentClassName` was corrected. Vendor-boundary holds documented only. All required gates green.

## Changed files (product)

| File | Change |
|---|---|
| `.storybook/components/composites/cards/SurfaceCard/SurfaceCard.tsx` | Port `identity?: CallerIdentity` + `resolveIdentity` on **Base** (matches src API) |
| `.storybook/components/starci/blocks/dashboard/WeeklyChallengeCard/WeeklyChallengeCard.tsx` | Stamp `identity={{ tier: "block", component: "WeeklyChallengeCard" }}` |
| `.storybook/components/composites/layout/DrawerShell/DrawerShell.tsx` | JSDoc only — `contentClassName` **kept** (live consumer) |
| `.claude/fe/decision-ledger.json` | Applied identity + vendor-boundary; reverted dead-prop; opened contentClassName hold |

## Removed props — proof

**None removed.**

| Prop | Attempted | Outcome | Consumer proof |
|---|---|---|---|
| `DrawerShell.contentClassName` | yes | restored / held | `.storybook/components/nivoexpert/blocks/studio/LessonEditorPanel/LessonEditorPanel.tsx:150` (`contentClassName="w-full sm:max-w-[560px]"`) |

Per-part re-scan: `2026-08-08-proven-per-part-scan.json` — every listed prop has ≥1 consumer; MiniCart/CvPreview/ModalShell bodyClassName held (live layout / stories).

## Storybook / src parity

| Surface | Status |
|---|---|
| WeeklyChallengeCard identity | **aligned** (src + SB stamp; SB SurfaceCard Base accepts identity) |
| SurfaceCard non-Base members | **partial** — Nested/List/Accordion/… still hard-code `data-tier` on SB |
| DrawerShell / ModalShell per-part props | **drift held** — not invented away |

## Remaining holds

- 27 teacher pattern seams (`audit:fe` OK)
- 30 HeroUI vendor-boundary files (no migrate)
- 29 unclear identity hosts
- DrawerShell `contentClassName` (nivoexpert LessonEditorPanel)
- MiniCart `dialogClassName` / `footerClassName`
- CvPreview `containerClassName` + `heightClassName`
- ModalShell `bodyClassName` (story consumers)
- skeleton redesigns; teacher / Nivo / locked paths / a11y

## Proposed APIs (not invented)

`dialogWidth`, `footerVariant`, `viewportFit`, PDF height enum, `bodyVariant`, `contentStack`

## Verification

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | exit 0 |
| `npx eslint --max-warnings=0` (3 product files) | exit 0 |
| `node --test` namespaces + authoring + contentpage | 8 pass |
| `node --test` principle-style | 7 pass |
| `npm run audit:fe` | exit 0; 27 held; 0 failing |

## Workers

- `2026-08-08-proven-worker-weekly-challenge-parity.json`
- `2026-08-08-proven-worker-identity-proven-roots.json`
- `2026-08-08-proven-worker-dead-per-part-props.json`
- `2026-08-08-proven-worker-consumer-barrel-cleanup.json`
- `2026-08-08-proven-worker-vendor-boundary-ledger.json`
- `2026-08-08-proven-worker-storybook-parity-audit.json`
