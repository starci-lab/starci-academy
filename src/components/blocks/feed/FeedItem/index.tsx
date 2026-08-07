import React from "react"
import type { ReactNode } from "react"
import { Typography } from "@heroui/react"
/** Props for {@link FeedItem}. */
export interface FeedItemProps {
    /**
     * Optional leading visual rendered at the row's start (e.g. a small
     * {@link UserAvatar} or an activity-type icon). Shrinks to its content and
     * never compresses the text column. Omit for a text-only row.
     */
    leading?: ReactNode
    /**
     * The activity / action text describing what happened. The caller is
     * responsible for localization (pass a `t()` result) and for mapping the
     * activity type to its phrasing.
     */
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
 * @see Story: .storybook/stories/blocks/feed/FeedItem/FeedItem.stories
 */
export const FeedItem = ({ leading, children, timestamp, footer}: FeedItemProps) => {
    return (
        <div className={"flex items-start gap-2"}>
            {leading ? <div className="shrink-0">{leading}</div> : null}
            <div className="flex flex-col gap-1 min-w-0">
                <div className="flex flex-col gap-0">
                    <Typography type="body-sm">{children}</Typography>
                    <Typography type="body-xs" color="muted">{timestamp}</Typography>
                </div>
                {footer ? <div>{footer}</div> : null}
            </div>
        </div>
    )
}
