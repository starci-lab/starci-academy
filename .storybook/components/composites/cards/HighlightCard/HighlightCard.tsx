import React from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "HighlightCard" } as const

/**
 * `HighlightCard` — wraps a card with a single accent-colored arc sweeping around it, on its
 * own layer behind the card (peeking 2px past the edges). A pure standout decoration, not a
 * data signal. Use for the one card that must stand out on a surface; multiple highlighted
 * cards cancel each other's emphasis. Leaf: `isSkeleton`.
 */

/** Props for {@link HighlightCard}. */
export interface HighlightCardProps {
    /** The wrapped card (e.g. a `SectionCard`/`Card`) — `HighlightCard` only adds the sweeping-light layer, it renders no card chrome of its own. */
    body: React.ReactNode
    /** `true` → MUTE the sweep layer (no `highlight-card-sweep` behind the body). Use while the wrapped content is still loading — a skeleton has no "verdict" yet, so it shouldn't read as emphasized. The body still renders as passed (e.g. its own skeleton state). */
    isSkeleton?: boolean
    /**
     * Where the wrapper sits inside its parent. Appearance is not passable — it is
     * already a prop. Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * Wraps a card with a single accent-colored arc SWEEPING around it, sitting as its
 * own layer BEHIND it (peeking out past the edges by 2px) — a pure "standout"
 * decoration, NOT a data signal (contrast with `SectionCard`'s `withVerdict`).
 * Use for the ONE card that genuinely needs to stand out on a surface — multiple
 * highlighted cards on the same screen cancel each other's emphasis out.
 *
 * @param props - {@link HighlightCardProps}
 */
export const HighlightCard = ({ body, isSkeleton = false, classNames }: HighlightCardProps) => (
    <div
        className={cn("relative", classNames)}

        data-tier="composite"
        data-component="HighlightCard"
    >
        {!isSkeleton && <div aria-hidden className="highlight-card-sweep" />}
        {body}
    </div>
)
