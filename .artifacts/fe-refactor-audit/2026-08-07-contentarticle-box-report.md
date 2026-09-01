# ContentArticle raw CSS inventory — 2026-08-07

Scope: SB + src ContentArticle only. No edits in this phase.

## Trees

| Path | Role |
|---|---|
| `.storybook/components/starci/blocks/learn/ContentArticle/ContentArticle.tsx` | SB impl |
| `.storybook/stories/starci/blocks/learn/ContentArticle/ContentArticle.stories.tsx` | stories |
| `src/components/blocks/learn/ContentArticle/index.tsx` | src twin (presentational one-file) |

## Findings

| # | Site | Classes / markup | Classification | Notes |
|---|---|---|---|---|
| CA-1 | Locked body wrap | `div.relative` | **shared-owner** | Same as ContentPage → reuse `LockedContentMask` |
| CA-2 | Locked selection | `cn(isLocked && "select-none")` | **shared-owner** | Owned by `LockedContentMask.isLocked` |
| CA-3 | Paywall tail fade | `pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-surface/70 to-surface` | **shared-owner** | Byte-identical to `LockedContentMask` (SB fade lacked `aria-hidden`; owner adds it — decorative, same visual) |
| CA-4 | `cn` import | `@heroui/react` | **shared-owner** | Goes away with CA-1–3 |
| CA-5 | Outer shell | bare `<div>` around `SurfaceCard` | **hard-case** (non-layout) | No layout CSS. Possible identity-wrapper smell; out of this batch’s Box/layout contract. Leave unchanged. |
| CA-6 | Card / stack | `SurfaceCard` + `StackV gap={6}` | *(already semantic)* | No change |
| CA-7 | Stories fixtures | `className="p-8"` on `data-tier="fixture"` | exclude | Story fixtures; rule must allow |
| CA-8 | `@app-*` visibility | — | n/a | None |
| CA-9 | `pb-*` / `PageEndPad` | — | n/a | None |
| CA-10 | `Box className` | — | n/a | None today; still gate against regression |
| CA-11 | Article `id` / `data-ai-selectable` | — | n/a | Not present in ContentArticle (lives on ContentPage host) |

## Contract match vs ContentPage

Lock/paywall behavior matches ContentPage’s `LockedContentMask` usage: body stays mounted, selection off when locked, absolute bottom fade into `surface`. **Reuse shared owner; do not invent a second mask.**

## Migration intent (Phase 2)

1. SB ContentArticle: wrap `MarkdownContent` in `LockedContentMask`; drop raw relative/select-none/gradient/`cn`.
2. Mirror src twin.
3. Extend path-scoped Box classname rule to ContentArticle product files.
4. Leave CA-5 bare wrapper; EnrollGate duplicate fade is sibling debt outside this batch.
