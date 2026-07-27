/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FRAME TIER — the SHARED spacing/alignment vocabulary of the khung namespaces
 * (`Stack` · `Split` · `Cluster` · `Grid`). Internal module (`_`-prefixed): it is
 * a type + class table, NOT a component, and never leaves this folder.
 *
 * ⭐ WHY THIS FILE EXISTS (principles §10c): the spacing scale is
 * `flush(0) · tight(1) · related(2) · grouped(3) · section(6) · page(8)` — SIX
 * values, nothing else. A khung that took `gap: number` would let `gap-4`/`gap-5`
 * back in through the front door, so every khung types its `gap` as
 * {@link SpaceScale} — a UNION LITERAL. Off-scale is then a TYPE ERROR at the
 * call site, not a lint finding after the fact. This is the reason the frame
 * tier owns gap at all: it is the enforcement point of §10.
 *
 * §10a also decides WHO owns the seam: `gap` belongs to the PARENT (the khung),
 * never to the child — so children of these frames must not carry `margin`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * The SEAM between two things, named by the RELATIONSHIP instead of by a number
 * (teacher, 2026-07-27: the caller picks a variant, not a step).
 *
 * Why a word and not a number, with the measurement that settled it: 72 percent of every
 * gap call-site in this tree sat on the two steps that are hardest to tell apart, 50 on
 * `3` and 43 on `2`. A number lets the author pick what LOOKS right and the reasoning
 * never reaches the code. A word forces the question, and a wrong answer becomes a wrong
 * WORD that a reader can see: `gap="related"` on a stack of unlike rows is invisible in review,
 * while `gap="related"` on that same stack reads as false at once.
 *
 * Pick by asking these in order, stopping at the first yes:
 *
 * | Ask | Step |
 * |---|---|
 * | are the two things ONE unit of meaning, such as a title and its subtitle? | `flush` |
 * | is one a MARK attached to the other, such as an icon before its label? | `tight` |
 * | are they PEERS in one set, such as a row of chips or two buttons? | `related` |
 * | are they ROWS stacked inside one surface, such as list rows or a caption under its owner? | `grouped` |
 * | are they different REGIONS of one thing, such as header, body and footer? | `section` |
 * | are they separate FEATURES on a page, such as one block beside another? | `page` |
 *
 * For the `related` versus `grouped` case, where most call-sites live: could you reorder the
 * two without changing the meaning? If yes they are peers, so `related`. If the order carries
 * meaning, or each row is a different kind of thing, they are rows of a surface, so `grouped`.
 */
export type SeamScale = "flush" | "tight" | "related" | "grouped" | "section" | "page"

/**
 * Seam step → literal Tailwind class. Written out because Tailwind never emits an
 * interpolated class; a table is the only way the class ships in CSS.
 */
export const GAP_CLASS: Record<SeamScale, string> = {
    flush: "gap-0",
    tight: "gap-1",
    related: "gap-2",
    grouped: "gap-3",
    section: "gap-6",
    page: "gap-8",
}

/**
 * The INSET of a surface, named by HOW MUCH AIR the surface gives its content
 * (teacher, 2026-07-27: "name it now, margin and padding belong to the frame tier too").
 *
 * A separate vocabulary from {@link SeamScale} on purpose. A seam word answers "what are
 * these two things to each other", which says nothing about the inside of one surface, so
 * `padding="related"` would be a sentence with no meaning. An inset word answers a different
 * question: how tightly does this surface hold what it contains.
 *
 * FOUR steps, not six. Measured across the tree before naming: 46 call sites use exactly
 * `0`, `3`, `6`, `8` and NOT ONE uses `1` or `2`. Two steps nobody reached for were two more
 * ways to be arbitrary, so they are gone. A scale earns a step by being chosen, not by
 * existing in Tailwind.
 *
 * | word | class | what it is for |
 * |---|---|---|
 * | `flush` | `p-0` | content touches the edge: a cover image, a table that scrolls |
 * | `cozy`  | `p-3` | the interior of a card, the house rule |
 * | `roomy` | `p-6` | a page measure or a container |
 * | `airy`  | `p-8` | a hero or an empty state that wants to breathe |
 */
export type InsetScale = "flush" | "cozy" | "roomy" | "airy"

/**
 * Cross-axis alignment of a track.
 *
 * `baseline` was added on 2026-07-27 for rows carrying text at SEVERAL sizes: a price in `h4`
 * beside a struck-through price in `sm` beside a chip in `xs` must line up on the LETTER FEET
 * rather than on the centre of each box, because `center` leaves the three numbers sitting at
 * different heights. The frame could not express that before, so `PriceTag` hand-typed
 * `items-baseline`, and migrating it onto a frame without this step would have BROKEN the
 * layout. Adding a value to the union is additive: no live call-site changes, and the compiler
 * forces every `Record<LayoutAlign, …>` table to cover the new member.
 */
export type LayoutAlign = "start" | "center" | "end" | "stretch" | "baseline"

/** Main-axis distribution of a flex track. */
export type LayoutJustify = "start" | "center" | "end" | "between"

/** {@link LayoutAlign} → literal class. */
export const ALIGN_CLASS: Record<LayoutAlign, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
}

/** {@link LayoutJustify} → literal class. */
export const JUSTIFY_CLASS: Record<LayoutJustify, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
}

/**
 * Scale step → literal `p-*` Tailwind class. Same §10c scale as {@link GAP_CLASS},
 * written out for the same reason (Tailwind never emits an interpolated `p-${n}`).
 *
 * 2026-07-26 (thầy): SSOT chuyển về ĐÂY từ `layout/Container/Container.tsx` — nó
 * khai `PADDING_CLASS` cục bộ trước, `cards/SurfaceCard/SurfaceCard.tsx` cần bảng
 * y hệt cho trục `padding` (đổi từ `flushContent?: boolean`) nên gộp về một nguồn
 * thay vì đẻ bản sao thứ hai. `Container.tsx` giờ import từ đây thay vì giữ bảng
 * cục bộ.
 */
export const PADDING_CLASS: Record<InsetScale, string> = {
    flush: "p-0",
    cozy: "p-3",
    roomy: "p-6",
    airy: "p-8",
}
