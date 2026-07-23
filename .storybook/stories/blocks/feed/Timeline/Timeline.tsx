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
    /** When on, cascade the flag into each row block so its anatomy parts emit `data-anat-part`. */
    showAnatomy?: boolean
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
export const Timeline = ({ children, className, showAnatomy }: TimelineProps) => {
    // Timeline draws no part of its own — in anatomy mode it just cascades the flag
    // into each row block (e.g. FeedItem) so their parts light up. Off by default →
    // children pass through untouched, no behaviour change.
    const rows = showAnatomy
        ? React.Children.map(children, (child) =>
              React.isValidElement(child)
                  ? React.cloneElement(child as React.ReactElement<{ showAnatomy?: boolean }>, {
                        showAnatomy: true,
                    })
                  : child,
          )
        : children
    return (
        <div
            className={cn(
                "relative flex flex-col gap-3",
                "border-l border-separator",
                "pl-4",
                className,
            )}
        >
            {rows}
        </div>
    )
}
