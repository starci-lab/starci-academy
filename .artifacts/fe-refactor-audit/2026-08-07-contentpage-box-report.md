# ContentPage Box / layout CSS inventory — 2026-08-07

Scope: SB + src ContentPage only. No edits in this phase.

## Storybook — `.storybook/components/starci/pages/ContentPage/ContentPage.tsx`

| # | Site | Classes / API | Classification | Notes |
|---|---|---|---|---|
| SB-1 | Page root | `Container size="md" padding={6}` | *(already semantic)* | Centering + max-w + page pad owned by `Container`. No Box. |
| SB-2 | Section tracks | `StackV gap={6}` / `gap={4}` | *(already semantic)* | Seams owned by gap; no `principle` on these stacks (pre-existing, not this batch’s missing-both pile). |
| SB-3 | Practice nudge | `MilestoneUpNextCard className="@app-lg:hidden"` | **responsive-behavior** | Visibility switch, not spacing. No frame names hide-above-container-step yet (`LeaderboardCategoryNav` keeps the same deprecated `className` for the same reason). **Contract gap** unless a `HideAbove` (or equivalent) frame is added this batch. |
| SB-4 | Locked fade / `select-none` / `relative` | — | *(not in this file)* | Owned by `ContentArticle` (block). Out of ContentPage file scope; sibling debt. |

## Storybook stories — `ContentPage.stories.tsx`

| # | Site | Classification | Notes |
|---|---|---|---|
| ST-1 | Anatomy / fixture chrome | exclude | Story fixture wrappers; must stay allowed by the regression rule. |
| ST-2 | Annotation copy mentioning `@app-lg:hidden` | exclude | Documentation string, not runtime layout CSS. |

## Src — `src/components/pages/ContentPage/component.tsx`

| # | Site | Classes | Classification | Proposed owner |
|---|---|---|---|---|
| SRC-1 | Full-width tab shell | `Box` `relative w-full` | **page-seam** | No absolute child in this branch → drop `relative`. Width → `Container size="full"` (or `classNames={["w-full"]}` on an existing frame). Keep `id` / `data-ai-selectable` host. |
| SRC-2 | Article anchor | `<div id="lesson-article" data-ai-selectable>` (no layout class when unlocked) | **foreign-mount** (attrs only) | Keep plain host for rail scan + AI selection. Not layout CSS. |
| SRC-3 | Paper + locked stack | `Box` `relative` | **visual-overlay** | Positioning context for SRC-5 → dedicated composite (e.g. `LockedContentMask`). |
| SRC-4 | Locked article host | `select-none` when `isLocked` | **state** | No `MarkdownContent` / Body API for selection. Composite owns `isLocked` → selection off. |
| SRC-5 | Paywall tail fade | `Box` `pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-surface/70 to-surface` | **visual-overlay** | Same composite as SRC-3/4. Same class string as `ContentArticle` / `EnrollGate`. Do not delete. |
| SRC-6 | Footer trailing air | `Box` `pb-6` | **hard-case** (likely) | Canon `padding.md`: single-edge pad is not vocabulary; fix is usually gap. Body track is `gap={1}` (`gap-0`) so reading∥footer stay flush — `gap={6}` between them would invent a seam. No honest token for bottom-only page-end air. |
| SRC-7 | Practice nudge | `Box` `@app-lg:hidden` | **responsive-behavior** | Same as SB-3. Prefer `HideAbove at="lg"` if created; else contract-gap hard-case. |
| SRC-8 | Inline ad trailing air | `Box` `pb-6` | **hard-case** | Same as SRC-6. |
| SRC-9 | Measures / stacks | `Container size="md" padding={1}`, `StackV` + `principle` | *(already semantic)* | OK. (`name-handle` on the zero-gap body track looks mis-tokened — out of scope.) |

## Src — `index.tsx`

| # | Site | Classification | Notes |
|---|---|---|---|
| IDX-1 | Tab icon `className="size-4 shrink-0"` | exclude | Atom chrome inside connected half, not page layout / Box. |

## Summary counts

| Class | Count |
|---|---|
| page-seam | 1 (SRC-1) |
| state | 1 (SRC-4) |
| responsive-behavior | 2 (SB-3, SRC-7) |
| visual-overlay | 2 (SRC-3, SRC-5) — one owner |
| foreign-mount | 1 (SRC-2 attrs) |
| hard-case | 2 (SRC-6, SRC-8 `pb-6`) pending confirmation |
| already semantic | SB shell + SRC measures |
| sibling (ContentArticle) | lock mask CSS still live outside ContentPage |

## Contract gaps (no invent-token)

1. **Hide-above container step** — no frame prop for `@app-*:hidden` (FRAME-10 wants a named width prop).
2. **Single-edge trailing pad** — `pb-*` forbidden by padding vocabulary; bottom-only page-end air has no principle.
3. **Locked selection** — no vocabulary leaf API; must be composite-owned state or hard-case.

## Migration intent (Phase 2 — not yet applied)

1. Add smallest frame `HideAbove` (`at: sm|md|lg|xl`) for SB-3 / SRC-7.
2. Add composite `LockedContentMask` (`isLocked` + `body`) for SRC-3/4/5; keep article anchor inside `body`.
3. SRC-1 → `Container size="full"`; drop vestigial `relative`.
4. SRC-6/8 → ledger hard-case if nested frames cannot keep flush reading∥footer.
5. Path-scoped ESLint: ContentPage product files reject `Box` layout `className`; stories fixtures allowed; hard-cases ledger-backed.
