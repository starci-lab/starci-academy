# ESLint architectural burn-down — final report (2026-08-07)

**Repo:** `D:\Repositories\starci-academy`  
**Commit/push:** none  

## Summary

| Metric | Before | After | Δ |
|---|---:|---:|---:|
| Product warnings | 6974 | **5466** | **−1508** |
| Product errors | 0 | 0 | 0 |
| Tooling findings | 0 | 0 | 0 |
| a11y (`jsx-a11y/*`) | 11 | **11** | 0 (untouched) |
| Teacher holds (pattern-coverage) | 27 | **27** | preserved |
| `audit:fe` | pass | **pass** | |
| `tsc --noEmit` | pass | **pass** | |
| principle-style tests | pass | **pass** | |

Phase 1 report: `.artifacts/fe-refactor-audit/2026-08-07-eslint-architectural-suspect-report.md`

## Confirmed violations fixed (high level)

| Lane | What |
|---|---|
| Tooling allowlists / scope | BlockAnatomy VI/emoji allowlist; `src/resources/**` allowlist; AnatomyOverlay stories exempt from `no-anatomy-overlay`; nivoexpert exempt from `no-identity-wrapper-div` |
| Authoring mechanical | inline-param −98; handler-on-prefix −34; prefer-arrow −28; vietnamese −213; emoji −163; SB main/preview/test-runner comments English |
| Architectural safe | `require-frame-self-declare` explain-only **−874**; `require-identity-root` clear roots **−67**; `no-identity-wrapper-div` **−43** (mostly nivoexpert exempt); `export-matches-folder` −6; `no-anatomy-overlay` −3 (allowlist) |
| Overlap | explain inserts kept `principle`+spacing `className` on one line after coverage regression fix |

## Remaining warnings by rule

| Count | Rule | Notes |
|------:|------|---|
| 1103 | require-frame-self-declare | mostly missing-both (hard-case — no invented principles) |
| 717 | no-raw-shape-at-sentence-tier | needs frame/composite ownership |
| 636 | require-identity-root | host/`div` roots & incapable roots |
| 623 | no-cn-above-vocabulary | |
| 555 | no-classname-at-sentence-tier | |
| 549 | no-heroui-outside-vocabulary | |
| 356 | page-folder-two-files-only | structural moves |
| 317 | require-export-jsdoc | +21 from new arrow/const exports |
| 101 | no-identity-wrapper-div | non-nivoexpert leftovers |
| 92 | no-parallel-skeleton | |
| 66 | no-helper-folder-in-components | |
| 62 | no-inline-skeleton-branch | |
| 47 | export-matches-folder | |
| 41 | no-inline-parameter-type | locked paths / overloads |
| 40 | no-skeleton-twin-component | |
| 40 | no-retired-async-content | API mismatch — hard-case |
| 34 | no-emoji-in-source | product glyphs / locked |
| 26 | no-per-part-classname-prop | |
| 16 | no-arbitrary-token | |
| 15 | no-vietnamese-in-source-authoring | product/locale strings left |
| 11 | jsx-a11y/* | **out of scope** |
| 8 | no-hero-heading-class | |
| 5 | handler-on-prefix | collisions |
| 4 | no-hardcoded-user-text-in-vocabulary | |
| 1 | prefer-arrow-export | TS overloads |
| 1 | (other) | |

## Scope / allowlist corrections

Recorded in ledger:

- `blockanatomy-vi-jsdoc-allowlist-2026-08-07` (open — teacher keep vs rewrite)
- `nivoexpert-identity-wrapper-exempt-2026-08-07` (applied)
- `anatomy-overlay-stories-allowlist-2026-08-07` (applied)
- `resources-content-allowlist-2026-08-07` (applied)
- `eslint-arch-burn-2026-08-07` (applied)

## Hard cases left unchanged

- Missing-both `require-frame-self-declare` (~764+) — would invent principles
- Identity on host `div`/`section` roots (~291) and non-identity-capable roots (~250)
- Locked paths: MockInterviewSession, QuizSession, LearnLoopScroll, ContentAiChat, ArchitectureScene layout, nivo trees
- `no-retired-async-content` ×40 — composite API mismatch
- Product/locale Vietnamese & reaction emoji strings
- Storybook tier-scan contract-gap (`componentTier` src-only) — not expanded this batch

## Teacher holds

**27** pattern-coverage holds preserved. `check-pattern-coverage`: 0 failing.

## Files changed

Large set across tooling (`plugins/eslint/**`, `eslint.config.mjs`), Storybook config comments, ~500+ product/SB component files (authoring + explain + identity). Helper scripts under `.artifacts/fe-refactor-audit/_*.mjs` only.

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | pass |
| `node --test plugins/eslint/authoring.test.mjs` | pass |
| `npx eslint --max-warnings=0` tooling/config touched | pass |
| `node --test .storybook/test-runner/principle-style.test.mjs` | pass (7) |
| `npm run audit:fe` | pass (27 holds) |

No a11y/axe work. No commit/push.
