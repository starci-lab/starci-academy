import React from "react"
import type { ReactNode } from "react"
import { cn, Typography } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/feed/FeedItem`. A generic activity-row layout built on
 * HeroUI `Typography` — a structural row, close to a PRIMITIVE. Synced to `src` later.
 */

/** Props for {@link FeedItem}. */
export interface FeedItemProps {
    /**
     * Optional leading visual rendered at the row's start (e.g. a small avatar or
     * an activity-type icon). Shrinks to its content and never compresses the text
     * column. Omit for a text-only row.
     */
    leading?: ReactNode
    /** The activity / action text describing what happened. Caller-localized. */
    children: ReactNode
    /**
     * Relative or absolute time the activity occurred, shown muted beneath the
     * action text. Caller-formatted (e.g. "2 hours ago").
     */
    timestamp: ReactNode
    /**
     * Optional footer rendered under the timestamp — e.g. a reaction bar. Omit for
     * a plain row.
     */
    footer?: ReactNode
    /** Extra classes merged onto the root. */
    className?: string
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /**
     * When on, FeedItem emits `data-anat-part="Typography"` on the two Typography
     * elements it renders directly (the action text, the timestamp) so a
     * BlockAnatomy panel can badge them (§ granularity — every Typography a block
     * writes itself is its own node). `leading`/`footer` slot content (e.g.
     * ActivityAvatar, ReactionBar) takes its own `showAnatomy`/`anatPart` directly
     * from the caller — FeedItem doesn't know what's inside those slots.
     */
    showAnatomy?: boolean
}

/**
 * Generic activity / timeline row. Lays out an optional leading visual beside a
 * text column: the action text on top, a muted timestamp below, and an optional
 * footer (e.g. a reaction bar) beneath that.
 *
 * Purely presentational and self-contained — it holds no state and performs no
 * data access. The owning feature maps an activity type to the `leading` and
 * `children` content and passes a pre-formatted `timestamp`.
 *
 * @param props - {@link FeedItemProps}
 */
export const FeedItem = ({ leading, children, timestamp, footer, className, anatPart, showAnatomy }: FeedItemProps) => {
    return (
        <div className={cn("flex items-start gap-2", className)} data-anat-part={anatPart}>
            {leading ? <div className="shrink-0">{leading}</div> : null}
            <div className="flex flex-col gap-1 min-w-0">
                <div className="flex flex-col gap-0">
                    <Typography type="body-sm" data-anat-part={showAnatomy ? "Typography" : undefined}>{children}</Typography>
                    <Typography type="body-xs" color="muted" data-anat-part={showAnatomy ? "Typography" : undefined}>{timestamp}</Typography>
                </div>
                {footer ? <div>{footer}</div> : null}
            </div>
        </div>
    )
}
