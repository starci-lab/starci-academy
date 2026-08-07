import React from "react"
import {
    BookOpenIcon,
    BookmarkSimpleIcon,
    ChatCircleIcon,
    CodeIcon,
    FlagIcon,
    GraduationCapIcon,
    PulseIcon,
    PuzzlePieceIcon,
    SparkleIcon,
    UserPlusIcon,
} from "@phosphor-icons/react"
import { formatDateTime } from "@/modules/dayjs"
import { ActivityAvatar } from "../ActivityAvatar"
import { EntityLink } from "../EntityLink"
import { FeedItem } from "../FeedItem"
import { ReactionBar } from "../ReactionBar"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { ActivityType } from "@/modules/api/graphql/queries/types/my-feed"
import type { QueryMyFeedItemData } from "@/modules/api/graphql/queries/types/my-feed"
import type { ReactionType } from "@/modules/api/graphql/queries/types/discussion"

/** Activity-type → badge icon (phosphor `*Icon`) shown over the actor avatar. */
const TYPE_ICON: Record<ActivityType, typeof BookOpenIcon> = {
    [ActivityType.LessonRead]: BookOpenIcon,
    [ActivityType.LessonBookmarked]: BookmarkSimpleIcon,
    [ActivityType.ChallengePassed]: PuzzlePieceIcon,
    [ActivityType.CodingSolved]: CodeIcon,
    [ActivityType.MilestonePassed]: FlagIcon,
    [ActivityType.AiLabPassed]: SparkleIcon,
    [ActivityType.CourseEnrolled]: GraduationCapIcon,
    [ActivityType.DiscussionCommented]: ChatCircleIcon,
    [ActivityType.UserFollowed]: UserPlusIcon,
}

/** One rendered row: a single item, or a roll-up of consecutive milestone passes, already grouped by day. */
export interface ActivityFeedRow {
    /** Newest item in the row (drives actor + timestamp + icon). */
    head: QueryMyFeedItemData
    /** How many milestone passes were rolled up (1 for a normal row). */
    count: number
    /** Already-localized, already-interpolated sentence node (actor + action + target, both clickable when routable). */
    message: React.ReactNode
    /** Already-localized relative timestamp ("3h ago"). */
    relativeLabel: string
}

/** A day bucket of feed rows, already grouped + labeled by the connected half. */
export interface ActivityFeedDayGroup {
    /** Stable key (start-of-day ms). */
    key: string
    /** Already-localized header label ("Today" / "Yesterday" / a formatted date). */
    label: string
    /** Rows in this day, newest first. */
    rows: Array<ActivityFeedRow>
}

/** Props for the {@link _ActivityFeed} block — presentational; grouping + i18n already resolved. */
export interface ActivityFeedProps {
    /** Day-bucketed, already-grouped + already-localized rows. */
    dayGroups: Array<ActivityFeedDayGroup>
    /**
     * Resolve a global id to a press handler that navigates to the entity, or
     * `undefined` when unroutable. Navigation is the owning feature's concern, so
     * the block stays store/router-free and receives this wiring callback.
     */
    onResolve: (globalId: string | null | undefined) => (() => void) | undefined
    /**
     * React handler for a feed item — `(activityId, emotion | null)`. Omit to make
     * the feed READ-ONLY (no reaction picker). Per-item it is auto-suppressed when
     * the activity is the viewer's own (`isMine`) — you can't react to yourself.
     */
    onReact?: (activityId: string, type: ReactionType | null) => void
    /**
     * Renders each day's {@link SurfaceListCard} with a border instead of a
     * shadow — pass `true` when the feed sits NESTED inside another surface.
     * Defaults to `false`.
     */
    bordered?: boolean
    /** Active locale — only used for the timestamp's `title` attribute (a native `Date` format, not `t()`). */
    locale: string
}

/**
 * The shared Facebook-style activity feed renderer: each row is an
 * {@link ActivityAvatar} (avatar + activity-type icon badge) beside a sentence
 * (actor + action + target, both clickable when routable) and a relative timestamp,
 * grouped under relative day headers (Today / Yesterday / date). Props-only: the
 * connected half rolls up consecutive milestone passes, buckets by day, and
 * resolves every localized string; this block only lays the rows out.
 *
 * @param props - {@link ActivityFeedProps}
 */
export const _ActivityFeed = ({
    dayGroups,
    onReact,
    bordered = false,
    locale,
}: ActivityFeedProps) => {
    /** Render one feed row as a FeedItem (avatar+badge · sentence · relative time). */
    const renderRow = (row: ActivityFeedRow) => {
        const { head, message, relativeLabel } = row
        const Icon = TYPE_ICON[head.type] ?? PulseIcon
        // a "followed someone" row leads with the FOLLOWED user's avatar (the
        // interesting entity) + a follow-icon badge; other rows lead with the actor
        const followedUser = head.type === ActivityType.UserFollowed && head.targetLabel != null
            ? head.targetLabel
            : undefined
        const avatarUsername = followedUser ?? head.actorUsername
        // followed user's avatar isn't in the feed payload → generated from username
        const avatarUrl = followedUser ? null : head.actorAvatar
        return (
            <FeedItem
                leading={(
                    <ActivityAvatar
                        username={avatarUsername}
                        avatar={avatarUrl}
                        icon={<Icon aria-hidden focusable="false" weight="bold" />}
                    />
                )}
                timestamp={<span title={formatDateTime(head.at, locale)}>{relativeLabel}</span>}
                footer={(
                    <ReactionBar
                        count={head.reactionCount}
                        myReaction={head.myReaction}
                        // can't react to your own activity → read-only on own items
                        onReact={onReact && !head.isMine
                            ? (type) => onReact(head.id, type)
                            : undefined}
                    />
                )}
            >
                {message}
            </FeedItem>
        )
    }

    // categorized-list: each day is its own labeled surface card (label = day
    // header outside the card, rows joined edge-to-edge with inset separators).
    return (
        <div className="flex flex-col gap-6">
            {dayGroups.map((group) => (
                <LabeledCard key={group.key} label={group.label} frameless subtleLabel>
                    <SurfaceListCard bordered={bordered}>
                        {group.rows.map((row, index) => (
                            <SurfaceListCardItem key={`${row.head.actorGlobalId}-${row.head.at}-${index}`}>
                                {renderRow(row)}
                            </SurfaceListCardItem>
                        ))}
                    </SurfaceListCard>
                </LabeledCard>
            ))}
        </div>
    )
}

// re-export so the connected half can build `t.rich()` actor/target links
// without importing EntityLink a second time.
export { EntityLink }
