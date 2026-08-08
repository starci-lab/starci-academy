import React from "react"
import type { ReactNode } from "react"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"

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
export const FeedItem = ({ leading, children, timestamp, footer }: FeedItemProps) => {
    const textColumn: ComponentTypeWithSkeleton = () => (
        <StackV
            principle="sibling-stack"
            explain="Same-kind peer stack — not group-boundary, because action text, timestamp, and optional footer are repeating vertical siblings in one row."
            items={[
                () => (
                    <StackV
                        principle="title-subtitle"
                        explain="Action line over muted timestamp reads as title over subtitle — not label-field (no form control), not name-handle (no identity pair), not icon-text (no glyph owns this seam)."
                        items={[
                            () => <Typography size="sm" text={children} />,
                            () => <Typography size="xs" color="muted" text={timestamp} />,
                        ]}
                    />
                ),
                ...(footer ? [() => <>{footer}</>] : []),
            ]}
        />
    )

    if (!leading) {
        return (
            <StackV
                identity={{ tier: "block", component: "FeedItem" }}
                principle="sibling-stack"
                explain="Same-kind peer stack — not group-boundary, because this text-only feed row is a single vertical unit."
                items={[textColumn]}
            />
        )
    }

    return (
        <StackH
            identity={{ tier: "block", component: "FeedItem" }}
            principle="content-row"
            explain="Keeps the leading visual and the action column on one baseline so the meta does not drop under the avatar."
            items={[
                () => <>{leading}</>,
                textColumn,
            ]}
        />
    )
}
