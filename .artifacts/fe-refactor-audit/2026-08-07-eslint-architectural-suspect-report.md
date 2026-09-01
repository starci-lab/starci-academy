# ESLint architectural suspect report — 2026-08-07

**Repo:** `D:\Repositories\starci-academy`  
**Phase:** 1 — scan and classify only (no product repairs in this phase)  
**Commit/push:** none  

## Baselines

| Check | Result |
|---|---|
| `npx eslint src .storybook --format json` | **6974** warnings, **0** errors → `.artifacts/fe-refactor-audit/eslint-product-2026-08-07.json` |
| `npx eslint plugins/eslint scripts` | **0** findings (`.claude/scripts` absent in this repo) |
| `npx tsc --noEmit` | **exit 0** |

Machine classification JSON:

- `.artifacts/fe-refactor-audit/2026-08-07-eslint-architectural-classify.json`
- `.artifacts/fe-refactor-audit/2026-08-07-eslint-architectural-buckets.json`
- `.artifacts/fe-refactor-audit/2026-08-07-eslint-architectural-by-file.json`

## Out of scope (left as debt — do not touch)

| Count | Rule |
|------:|------|
| 8 | `jsx-a11y/aria-role` |
| 2 | `jsx-a11y/no-static-element-interactions` |
| 1 | `jsx-a11y/click-events-have-key-events` |

**Total a11y debt left alone: 11.** No axe / contrast / Storybook a11y work in this batch.

## Classification summary (every finding → exactly one bucket)

| Class | Count | Meaning |
|---|------:|---|
| **confirmed** | 5693 | Real architectural/authoring debt; eligible for Phase 2 repair |
| **hard-case** | 594 | High-risk paths / unsafe to infer; leave until teacher decision |
| **overlap** | 350 | Same line as another root-cause rule; fix once with primary |
| **teacher-hold** | 315 | Path matches an open ledger hold — preserve |
| **content-allowlist** | 11 | Locale/fixture/resources path — widen allowlist, do not rewrite copy |
| **out-of-scope-a11y** | 11 | Explicitly excluded |
| **scope-bug** | (see below) | Heuristic samples folded into hard-case / contract-gap notes |

**Overlap locations (file:line with ≥2 rules):** 470 (350 marked as secondary `overlap`).

## Warning count by rule (full product)

| Count | Rule | Phase-2 lane |
|------:|------|---|
| 1977 | `starci-fe/require-frame-self-declare` | architectural |
| 717 | `starci-fe/no-raw-shape-at-sentence-tier` | architectural |
| 703 | `starci-fe/require-identity-root` | architectural |
| 623 | `starci-fe/no-cn-above-vocabulary` | architectural |
| 555 | `starci-fe/no-classname-at-sentence-tier` | architectural |
| 549 | `starci-fe/no-heroui-outside-vocabulary` | architectural |
| 356 | `starci-fe/page-folder-two-files-only` | architectural |
| 296 | `starci-fe/require-export-jsdoc` | authoring |
| 228 | `starci-fe/no-vietnamese-in-source-authoring` | authoring |
| 197 | `starci-fe/no-emoji-in-source` | authoring |
| 144 | `starci-fe/no-identity-wrapper-div` | architectural |
| 139 | `starci-fe/no-inline-parameter-type` | authoring |
| 92 | `starci-fe/no-parallel-skeleton` | architectural |
| 66 | `starci-fe/no-helper-folder-in-components` | architectural |
| 62 | `starci-fe/no-inline-skeleton-branch` | architectural |
| 53 | `starci-fe/export-matches-folder` | architectural |
| 40 | `starci-fe/no-skeleton-twin-component` | architectural |
| 40 | `starci-fe/no-retired-async-content` | architectural |
| 39 | `starci-fe/handler-on-prefix` | authoring |
| 29 | `starci-fe/prefer-arrow-export` | authoring |
| 26 | `starci-fe/no-per-part-classname-prop` | architectural |
| 16 | `starci-fe/no-arbitrary-token` | authoring |
| 11 | jsx-a11y/* | **out of scope** |
| 8 | `starci-fe/no-hero-heading-class` | authoring (heuristic) |
| 4 | `starci-fe/no-hardcoded-user-text-in-vocabulary` | authoring |
| 3 | `starci-fe/no-anatomy-overlay` | architectural |
| 1 | (other/parse) | hard-case |

`no-public-frame-css-props` remains **error** with **0** debt (already closed).

## Path buckets for the big architectural rules

`componentTier()` / several rules only match `/src/components/**` — they do **not** inspect `.storybook/components/**` even though eslint.config wires those files.

| Rule | src-pages | src-blocks | src-overlays | src-layouts | src-composites | Storybook |
|---|---:|---:|---:|---:|---:|---|
| require-frame-self-declare | 1327 | 417 | 129 | 11 | 93 | **0 (scope gap)** |
| require-identity-root | 194 | 469 | 22 | 18 | — | **0 (scope gap)** |
| no-raw-shape | 150 | 547 | — | 20 | — | **0** |
| no-classname | 176 | 364 | 1 | 14 | — | **0** |
| no-heroui | 172 | 352 | 7 | 18 | — | **0** |
| no-cn | 159 | 450 | — | 14 | — | **0** |
| page-folder-two-files-only | 300 | — | 36 | 20 | — | **0** |

### Contract-gap A — Storybook blueprint invisible to tier rules

- **Root cause:** `componentTier()` regex is `/src/components/([^/]+)/` only. Storybook twins under `.storybook/components/**` never get `vocabulary`/`sentence`.
- **Classification:** `contract-gap`
- **Proposed fix (tooling partition):** extend tier detection to `.storybook/components/**` **after** src debt is understood — otherwise enabling SB scanning will flood new debt overnight.
- **Visual/API risk:** none until enabled; enabling without burn plan is high churn risk.
- **Decision required:** teacher — expand scope now, or keep src-only until src debt burns.

## Known high-risk areas (manual review)

### 1. `.storybook/utils/BlockAnatomy/BlockAnatomy.tsx` — 80 hits

| Rules | Count |
|---|---:|
| no-vietnamese-in-source-authoring | 71 |
| no-emoji-in-source | 7 |
| require-export-jsdoc | 1 |
| handler-on-prefix | 1 |

- **Root cause:** File intentionally documents in Vietnamese JSDoc (“JSDoc/comment thì vẫn tiếng Việt”) while on-screen copy is English. Emoji used as section markers in comments.
- **Classification:** `hard-case` / pending **teacher-hold** (not one of the 27 pattern-coverage holds)
- **Proposed fix:** Do **not** auto-translate. Either (a) ledger hold + path allowlist for `.storybook/utils/BlockAnatomy/**`, or (b) teacher orders English JSDoc rewrite in a dedicated patch.
- **Visual/API risk:** rewriting comments only is low visual risk; allowlisting is zero visual risk.
- **Decision required:** allowlist vs English rewrite.

### 2. `MockInterviewPage/MockInterviewSession/` — 89 hits (excl. a11y)

| Rules | Notes |
|---|---|
| require-frame-self-declare ×54 | Many Stack/Box without principle+explain |
| no-cn / no-raw-shape / no-classname | Overlap cluster — raw layout + cn |
| page-folder-two-files-only ×2 | Extra files in page folder |
| skeleton rules | twin / parallel / inline branch |

- **Classification:** mix of `confirmed` (authoring/skeleton mechanical) + `hard-case` (principle assignment on asymmetric reading pads — several ledger entries already open for this page)
- **Proposed fix:** Storybook twin first if exists; only add registered tokens; preserve open mockinterview ledger holds; no invented principles.
- **Visual/API risk:** **high** if principles retune spacing.
- **Decision required:** which open mockinterview holds stay vs which seams get tokens.

### 3. `FlashcardsPage/QuizSession/` — 102 hits

- Dominated by `require-frame-self-declare` (73) + `page-folder-two-files-only` (7).
- Multiple open flashcards ledger holds (body inset, metric grids, progress pads).
- **Classification:** `hard-case` for principle seams; `confirmed` for pure authoring on the same files if any.
- **Visual/API risk:** high.
- **Decision required:** leave holds; burn only non-hold lines.

### 4. `LandingPage/LearnLoopScroll/` — 42 hits

- Heavy `no-raw-shape` (17) + `no-cn` (12) + frame-self-declare (5) + inline-param (4).
- Marketing scroll composition — raw motion/layout often intentional.
- **Classification:** `hard-case` for layout; `confirmed` for `no-inline-parameter-type` only.
- **Visual/API risk:** high for layout; low for named types.

### 5. `ContentAiChat/` — 55 hits (+1 parse/other)

- Raw-shape / cn / heroui / identity / emoji / vietnamese cluster.
- **Classification:** `hard-case` (chat chrome + vendor) for arch; authoring comments/emoji may be `confirmed` if not product copy.
- **Visual/API risk:** medium–high.

### 6. `ArchitectureScene/` — 23 hits

- 15× `no-inline-parameter-type` (safe mechanical), plus cn/heroui/identity/classname.
- **Classification:** inline-param → `confirmed`; rest → `hard-case` (Three.js/marketing scene).
- **Visual/API risk:** low for types; high for layout/identity.

### 7. `.storybook/main.ts` / `preview.tsx` / `test-runner.ts`

| File | Rules |
|---|---|
| main.ts | no-vietnamese ×2 (alias comments lines 34–35) |
| preview.tsx | no-vietnamese ×1 (stale “thầy” comment) |
| test-runner.ts | no-vietnamese + no-emoji |

- **Classification:** `confirmed` authoring (English comments) — **not** content.
- **Proposed fix:** translate comments to English.
- **Visual/API risk:** none.

### 8. `src/resources/**` / `src/modules/api/**`

- Vietnamese hits in resources (11) and modules (66) under no-vietnamese.
- **Classification:** resources → `content-allowlist` candidate; modules → inspect per file (API error strings / comments).
- **Proposed fix:** widen allowlist for approved content dictionaries under `src/resources/**`; translate module **comments** only; never rewrite user-facing localized payloads without inventory.
- **Visual/API risk:** allowlist = none; rewriting API copy = **forbidden** without inventory.

### 9. Nivo / Nivoexpert / Mia-Mia

| Area | Signal |
|---|---|
| nivoexpert | 43× `no-identity-wrapper-div` (`<div data-tier="block">`) — plain-CSS tenant trees, not Academy HeroUI frames |
| nivo | mostly teacher-hold pattern seams (27 holds include many sb-nivo-*) |
| mia-mia | marketing CSS tokens via preview import — treat as hard-case |

- **Classification:** nivoexpert identity wrappers → `contract-gap` / `hard-case` (do not force Academy `identity` prop onto plain-CSS nivoexpert without teacher ruling). Nivo gap holds → `teacher-hold`.
- **Visual/API risk:** high if forced into Academy frame contract.
- **Decision required:** exempt nivoexpert from `no-identity-wrapper-div`, or port to identity API.

### 10. `no-anatomy-overlay` ×3

- All in `.storybook/stories/utils/AnatomyOverlay/AnatomyOverlay.stories.tsx` (`data-anat`).
- **Classification:** `hard-case` — stories for the anatomy tooling itself; removing attrs breaks the story under test.
- **Proposed fix:** path allowlist for AnatomyOverlay stories **or** retire the stories with the overlay.
- **Decision required:** teacher.

## Overlap clusters (fix once)

Typical same-line clusters in sentence-tier src:

1. `no-raw-shape` + `no-cn` + `no-classname` — raw host layout with `cn(...)` and className props.
2. `require-frame-self-declare` + `no-raw-shape` — should become a principle-bearing frame instead of host flex/gap.
3. `require-identity-root` + `no-identity-wrapper-div` — replace wrapper div with `identity` on root frame.
4. `no-heroui` + `no-cn` — direct vendor import composing classes; needs atom/composite first.

**Proposed fix order per file:** identity/wrapper → heroui→atom → frame principle+explain → remove host layout/cn/classname → skeleton rules → authoring.

## Scope-bug / allowlist corrections proposed (tooling — no product rewrite)

| Issue | Classification | Proposed tooling fix |
|---|---|---|
| Tier rules ignore `.storybook/components` | contract-gap | Extend `componentTier` **after** explicit teacher go-ahead |
| BlockAnatomy Vietnamese/emoji JSDoc | hard-case | Path allowlist under `.storybook/utils/BlockAnatomy/**` |
| AnatomyOverlay stories `data-anat` | hard-case | Allowlist that story file |
| `src/resources/**` locale-like data | content-allowlist | Add to `CONTENT_ALLOWLIST` |
| nivoexpert `data-tier` wrappers | contract-gap | Namespace ignore or separate rule scope |
| emoji in icon/demo fixtures | content-allowlist | Confirm fixture paths; extend allowlist narrowly |

## Teacher holds

- Pattern-coverage gate: **27** approved holds remain (from prior `audit:fe`).
- Open ledger decisions: **62** (includes non-hold design notes).
- Phase 2 must not resolve or edit those 27 holds unless the ledger explicitly closes them.

## Phase 2 partition plan (disjoint files)

| Worker | Owns | Safe first cuts |
|---|---|---|
| 1 atoms | `src/components/atoms/**`, SB atom twins | emoji/vi comments; inline-param; no public classname regressions |
| 2 composites | `**/composites/**` | same + export-jsdoc / arrow / handler |
| 3 frames/layout | `**/frames/**`, `**/layouts/**` | identity API inside frames only; no fake principles |
| 4 blocks | `**/blocks/**` except high-risk list | arch burn where SB twin exists |
| 5 pages | `**/pages/**` except MockInterviewSession, QuizSession, LearnLoopScroll | page-folder / helper-folder first |
| 6 Storybook-only | SB without src twin; nivo/nivoexpert/mia-mia | hold/allowlist only until teacher rulings |
| 7 tooling | `plugins/eslint/**`, `eslint.config.mjs` | allowlists + optional tier-path fix |
| 8 authoring | cross-cutting mechanical: inline-param, handler, arrow, export-jsdoc, vi/emoji **comments** | no copy changes |

**High-risk files locked to worker 6 / hard-case until teacher decisions:** BlockAnatomy, MockInterviewSession, QuizSession, LearnLoopScroll, ContentAiChat, ArchitectureScene (layout half), nivoexpert identity wrappers, AnatomyOverlay stories.

## Suspicious cases (representative)

| File:line | Rules | Root cause | Class | Proposed fix | Risk |
|---|---|---|---|---|---|
| `.storybook/utils/BlockAnatomy/BlockAnatomy.tsx:12+` | no-vietnamese, no-emoji | Intentional VI JSDoc + emoji section marks | hard-case | allowlist or ordered English rewrite | low (comments) / process |
| `.storybook/main.ts:34-35` | no-vietnamese | VI comments on aliases | confirmed | English comments | none |
| `.storybook/preview.tsx:20` | no-vietnamese | “thầy” in comment | confirmed | English | none |
| `.../AnatomyOverlay.stories.tsx:37,63,64` | no-anatomy-overlay | Story demos retired attrs | hard-case | allowlist story | breaks story if removed blindly |
| `.../nivoexpert/.../AuthCard.tsx:108` | no-identity-wrapper-div | plain-CSS `data-tier` shell | contract-gap | exempt namespace or port identity | high |
| `.../MockInterviewSession/index.tsx` (many) | frame-self-declare, cn, raw-shape | undeclared seams + open holds | hard-case / teacher-hold | preserve holds; no invented tokens | high |
| `.../QuizSession/index.tsx` (many) | frame-self-declare, page-folder | page structure + holds | hard-case / teacher-hold | same | high |
| `.../LearnLoopScroll/index.tsx` | raw-shape, cn, frame-self | marketing scroll layout | hard-case | named types only for now | high if layout touched |
| `.../ArchitectureScene/index.tsx` | inline-param ×15 | anonymous destructured types | confirmed (types) | named interfaces | none |
| `src/resources/**` | no-vietnamese | content dictionaries | content-allowlist | allowlist paths | none if allowlisted |

## Hard cases / decisions required before broad repair

1. Expand `componentTier` to Storybook? (contract-gap A)
2. BlockAnatomy VI JSDoc — allowlist vs translate?
3. nivoexpert `data-tier` wrappers — exempt vs migrate?
4. AnatomyOverlay stories — allowlist vs retire?
5. MockInterview / Flashcards / LearnLoopScroll principle seams — which open holds stay?
6. `src/modules/**` Vietnamese — comments vs runtime strings inventory?

A hard case left unchanged is acceptable. A silent spacing/API/copy change is not.

## Stop after Phase 1

No product files were edited in this phase.  

**Awaiting approval** to start Phase 2 on a named partition (recommended first: **tooling allowlists + mechanical authoring** on non-locked files, then **atoms/composites**), with hard-case paths frozen until the decisions above land in the ledger.
