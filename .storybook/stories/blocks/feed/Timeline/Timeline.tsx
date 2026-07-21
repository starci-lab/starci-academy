import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/feed/Timeline`. A pure wrapper drawing a left connector line
 * around its children — layout glue with no primitive of its own. Synced to `src` later.
 */

/** Props for {@link Timeline}. */
export interface TimelineProps {
    /**
     * The row elements to render inside the timeline. Each child is expected to be
     * a self-contained row block (e.g. FeedItem). The Timeline only provides the
     * vertical connector and spacing — row content and layout are the caller's job.
     */
    children: ReactNode
    /** Extra classes merged onto the root. */
    className?: string
}

/**
 * Vertical timeline wrapper that stacks activity or attempt row blocks beside a
 * continuous left connector line. The line is drawn with `border-l border-separator`
 * on the container; children are indented with `pl-4` so the line runs to their left.
 *
 * Purely presentational: holds no state, performs no data access, applies no visual
 * frame. Pass pre-built row blocks (e.g. FeedItem) as `children`.
 *
 * @param props - {@link TimelineProps}
 */
export const Timeline = ({ children, className }: TimelineProps) => {
    return (
        <div
            className={cn(
                "relative flex flex-col gap-3",
                "border-l border-separator",
                "pl-4",
                className,
            )}
        >
            {children}
        </div>
    )
}
