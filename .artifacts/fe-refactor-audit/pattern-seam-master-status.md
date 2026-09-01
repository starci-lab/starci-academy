# Pattern seam + principle-as-style — batch status

**Branch:** `mtp` · **checkpoint:** `713e01c0` · **no commit/push**

## Phase 1 — approved holds in the gate

`check-pattern-coverage.mjs` now splits seams into:

| Bucket | Meaning | Gate |
|---|---|---|
| **held** | path listed on an `status: "open"` ledger hold | exit 0 |
| **failing** | undocumented | exit 1 |

Report always lists hold id + file. Nothing is silent.

**Current:** 27 held / 0 failing → gate **exit 0** (was exit 1 on the same 27).

Hold ids: `ps-sb-inputtags-input-px1-caret`, `sb-nivo-landing-*`, `sb-nivo-rest-gap3-meta-rows-no-token`, `sb-nivo-rest-gap2-title-meta-row-no-token`.

## Phase 2 — principle-as-style pilot

### Mapping (`frames/_principle-style.ts` · both trees)

| Kind | Tokens (examples) | Resolves to |
|---|---|---|
| **gap** | content-row, identity, flex-action, block-boundary, label-field, … | `GAP_CLASS[step]` |
| **padding** | cell-pad, card-padding, page-pad | `PADDING_CLASS[step]` |
| **padding-xy** | control-pad, row-pad, pill-pad | `px-*` / `py-*` via steps |
| **margin** | push-end, pin-bottom, center-measure | `ml-auto` / `mt-auto` / `mx-auto` |
| **structural** | reel, sticky-top, fixed-bar, stack-below | frame chrome classes |

Flex/Stack: `gap` optional; when `principle` owns gap/padding, classes come from the map (explicit `gap`/`padding` ignored for that axis).

### Pilot files

- `.storybook/components/frames/_principle-style.ts` (+ src twin)
- `.storybook/components/frames/Flex/Flex.tsx` (+ src)
- `.storybook/components/frames/Stack/Stack.tsx` (+ src `Stack/index.tsx`)
- `.storybook/components/nivoexpert/pages/AcademySettingsForm/AcademySettingsForm.tsx` (SB-only; no src twin)
- `.storybook/test-runner/principle-style.test.mjs`
- backend: `check-pattern-coverage.mjs`, `audit-principles.mjs`

### AcademySettingsForm before → after (computed)

| Site | Before | After (principle owns) |
|---|---|---|
| BrandFields column | `gap={4}` + label-field | label-field → `gap-3` (12px) |
| Logo row | `gap={3}` + identity | identity → `gap-2` (8px) |
| Template tile | `gap={2}` unnamed | title-subtitle → `gap-1` (4px) |
| Title \| badge | `gap={3}` + flex-action | flex-action → `gap-2` (8px) |
| Title \| subtitle | `gap={1}` | name-handle → `gap-0` (0px) |
| Cards column | `gap={6}` | block-boundary → `gap-6` (24px) |
| Page shell | raw `flex … gap-6` | outer pad stays `px-4 py-8`; StackV block-boundary for seam |

**Remaining gap/padding in pilot:** `Grid gap={4}` (Grid out of pilot); `Form gap={6}` (composite); outer `px-4 py-8` (asymmetric, no padding principle).

### BrandFields (unresolved)

Ledger `academy-settings-brandfields-label-field` **open** — keep `label-field` until teacher chooses field-column token or retune.

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | pass |
| `node --test …/principle-style.test.mjs` | 5/5 pass |
| `audit-principles` | pass (includes PRINCIPLE_STYLE ↔ patterns.mjs) |
| `check-pattern-coverage` | 27 held / 0 failing · exit 0 |
| `audit:fe` | (run with this batch) |
| atoms / composites / frames | (run with this batch) |
