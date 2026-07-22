import React from "react"
import type { ReactNode } from "react"
import { Typography, cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — a NEW primitive (no `src` yet; synced later).
 * A single inline META ROW: an optional leading SIGNAL chip (the one prominent
 * token — e.g. a `StatusChip`) followed by neutral secondary meta segments joined
 * by a middot `·`, all muted. Consolidates the dot-separated meta line hand-rolled
 * across many blocks. The chip carries the ONE signal; everything after stays
 * muted (principles §2 color-prominence).
 */

/** Props for {@link MetaRow}. */
export interface MetaRowProps {
    /**
     * Optional leading signal chip — the ONE prominent token in the row (e.g. a
     * warning `StatusChip` for a deadline). Omit for a plain muted meta line.
     */
    chip?: ReactNode
    /**
     * Neutral secondary meta segments, rendered muted and joined by a middot `·`.
     * Each entry is one segment (e.g. `["Question 7 / 8", "Middle"]`).
     */
    items: ReactNode[]
    className?: string
}

/**
 * MetaRow — leading signal chip (optional) + dot-joined muted meta segments.
 * @param props - {@link MetaRowProps}
 * @see Story: .storybook/stories/blocks/lists/MetaRow/MetaRow.stories
 */
export const MetaRow = ({ chip, items, className }: MetaRowProps) => (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
        {chip ? <span className="shrink-0">{chip}</span> : null}
        {items.length > 0 ? (
            <Typography type="body-xs" color="muted" truncate className="min-w-0">
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 ? <span aria-hidden className="mx-1">·</span> : null}
                        {item}
                    </React.Fragment>
                ))}
            </Typography>
        ) : null}
    </div>
)
