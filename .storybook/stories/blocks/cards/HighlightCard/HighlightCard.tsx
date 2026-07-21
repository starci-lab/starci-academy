import React from "react"
import { cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/cards/HighlightCard`. Authored in Storybook (not `src`);
 * synced back to `src` later. The sweeping-light effect lives in the global
 * `.highlight-card-sweep` class (globals.css), so this block adds no chrome of
 * its own beyond that layer.
 */

/** Props for {@link HighlightCard}. */
export interface HighlightCardProps {
    /** The wrapped card (e.g. a `SectionCard`/`Card`) — `HighlightCard` only adds the sweeping-light layer, it renders no card chrome of its own. */
    children: React.ReactNode
    /** Extra classes on the wrapper. */
    className?: string
}

/**
 * Wraps a card with a single accent-colored arc SWEEPING around it, sitting as its
 * own layer BEHIND it (peeking out past the edges by 2px) — a pure "nổi bật"
 * decoration, NOT a data signal (contrast with `SectionCard`'s `withVerdict`).
 * Use for the ONE card that genuinely needs to stand out on a surface — multiple
 * highlighted cards on the same screen cancel each other's emphasis out.
 *
 * @param props - {@link HighlightCardProps}
 */
export const HighlightCard = ({ children, className }: HighlightCardProps) => (
    <div className={cn("relative", className)}>
        <div aria-hidden className="highlight-card-sweep" />
        {children}
    </div>
)
