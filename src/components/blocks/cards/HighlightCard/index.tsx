"use client"

import React from "react"
/** Props for {@link HighlightCard}. */
export interface HighlightCardProps {
    /** The wrapped card (e.g. a `SectionCard`/`Card`) — `HighlightCard` only adds the sweeping-light layer, it renders no card chrome of its own. */
    children: React.ReactNode
}

/**
 * Wraps a card with a single accent-colored arc SWEEPING around it, sitting as its own
 * layer BEHIND it (peeking out past the edges by 2px) — a pure "stand-out"
 * decoration, NOT a data signal (contrast with `SectionCard`'s `withVerdict`, a static
 * left band that DOES encode band/tier/zone data — `card.md` §3i vs §3j). Renders as 2
 * stacked cards: the INNER layer (bigger, behind, carries the sweeping-light effect) and
 * the wrapped card itself (OUTER, in front, 2px smaller in radius) — see `card.md` §3j
 * for why this is 2 layers and not a `SectionCard` prop. Use for the ONE card that
 * genuinely needs to stand out on a surface (e.g. a "resume your session" hero) —
 * multiple highlighted cards on the same screen cancel each other's emphasis out.
 *
 * @param props - {@link HighlightCardProps}
 * @see Story: .storybook/stories/blocks/cards/HighlightCard/HighlightCard.stories
 */
export const HighlightCard = ({ children}: HighlightCardProps) => (
    <div className={"relative"}>
        <div aria-hidden className="highlight-card-sweep" />
        {children}
    </div>
)
