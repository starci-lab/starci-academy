import React, { useMemo } from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
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
import { ActivityAvatar } from "../ActivityAvatar/ActivityAvatar"
import { EntityLink } from "../EntityLink/EntityLink"
import { FeedItem } from "../FeedItem/FeedItem"
import { ReactionBar, ReactionType } from "../ReactionBar/ReactionBar"
import { SurfaceListCard, SurfaceListCardItem } from "../../cards/SurfaceListCard/SurfaceListCard"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK ported faithfully from
 * `@/components/blocks/feed/ActivityFeed`. Composed from the local feed blocks
 * `ActivityAvatar` + `EntityLink` + `FeedItem` + `ReactionBar` and the card
 * primitive `SurfaceListCard` (per-day surface). `LabeledCard` isn't ported yet, so
 * a faithful local copy of its `frameless subtleLabel` day-header is inlined here.
 * `@/modules` types, dayjs, and next-intl strings are inlined locally. Synced to
 * `src` later.
 */

/** Local mirror of `ActivityType` from `@/modules/api/graphql/queries/types/my-feed`. */
export enum ActivityType {
    LessonRead = "LESSON_READ",
    LessonBookmarked = "LESSON_BOOKMARKED",
    ChallengePassed = "CHALLENGE_PASSED",
    CodingSolved = "CODING_SOLVED",
    MilestonePassed = "MILESTONE_PASSED",
    AiLabPassed = "AI_LAB_PASSED",
    CourseEnrolled = "COURSE_ENROLLED",
    DiscussionCommented = "DISCUSSION_COMMENTED",
    UserFollowed = "USER_FOLLOWED",
}

/** Local mirror of `QueryMyFeedItemData`. */
export interface QueryMyFeedItemData {
    id: string
    actorGlobalId: string
    actorUsername: string
    actorAvatar: string | null
    type: ActivityType
    targetGlobalId: string | null
    targetLabel: string | null
    at: string
    reactionCount: number
    myReaction: ReactionType | null
    isMine: boolean
}

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

/**
 * Inlined mirror of `dashboard.feed.*` — the Vietnamese sentence per activity type,
 * with the actor + target as {@link EntityLink}s. `noTarget` is the generic-noun
 * fallback so a null target is never blank.
 */
const PHRASE: Record<ActivityType, { withTarget: (actor: ReactNode, target: ReactNode) => ReactNode, noTarget: (actor: ReactNode) => ReactNode }> = {
    [ActivityType.LessonRead]: {
        withTarget: (a, t) => <>{a} đã đọc bài học {t}</>,
        noTarget: (a) => <>{a} đã đọc một bài học</>,
    },
    [ActivityType.LessonBookmarked]: {
        withTarget: (a, t) => <>{a} đã lưu bài học {t}</>,
        noTarget: (a) => <>{a} đã lưu một bài học</>,
    },
    [ActivityType.ChallengePassed]: {
        withTarget: (a, t) => <>{a} đã hoàn thành thử thách {t}</>,
        noTarget: (a) => <>{a} đã hoàn thành một thử thách</>,
    },
    [ActivityType.CodingSolved]: {
        withTarget: (a, t) => <>{a} đã giải bài code {t}</>,
        noTarget: (a) => <>{a} đã giải một bài code</>,
    },
    [ActivityType.MilestonePassed]: {
        withTarget: (a, t) => <>{a} đã vượt qua mốc {t}</>,
        noTarget: (a) => <>{a} đã vượt qua một mốc</>,
    },
    [ActivityType.AiLabPassed]: {
        withTarget: (a, t) => <>{a} đã hoàn thành AI Lab {t}</>,
        noTarget: (a) => <>{a} đã hoàn thành một AI Lab</>,
    },
    [ActivityType.CourseEnrolled]: {
        withTarget: (a, t) => <>{a} đã đăng ký khóa {t}</>,
        noTarget: (a) => <>{a} đã đăng ký một khóa học</>,
    },
    [ActivityType.DiscussionCommented]: {
        withTarget: (a, t) => <>{a} đã bình luận trong {t}</>,
        noTarget: (a) => <>{a} đã bình luận trong một thảo luận</>,
    },
    [ActivityType.UserFollowed]: {
        withTarget: (a, t) => <>{a} đã theo dõi {t}</>,
        noTarget: (a) => <>{a} đã theo dõi một người dùng</>,
    },
}

/** Grouped roll-up phrasing for consecutive milestone passes. */
const milestoneGrouped = (actor: ReactNode, count: number): ReactNode => <>{actor} đã vượt qua {count} mốc</>

/** Compact Vietnamese relative-time formatter (mirror of the shared time-ago helper). */
const timeAgo = (iso: string): string => {
    const diffMs = Date.now() - new Date(iso).getTime()
    const minute = 60_000
    const hour = 60 * minute
    const day = 24 * hour
    if (diffMs < minute) {
        return "vừa xong"
    }
    if (diffMs < hour) {
        return `${Math.floor(diffMs / minute)} phút trước`
    }
    if (diffMs < day) {
        return `${Math.floor(diffMs / hour)} giờ trước`
    }
    return `${Math.floor(diffMs / day)} ngày trước`
}

/** One rendered row: a single item, or a roll-up of consecutive milestone passes. */
interface FeedRow {
    head: QueryMyFeedItemData
    count: number
}

/** A day bucket of feed rows under a relative day header. */
interface DayGroup {
    key: string
    label: string
    rows: Array<FeedRow>
}

/** Start-of-day epoch ms for a date (local). */
const startOfDayMs = (date: Date): number =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

/**
 * Inlined mirror of `LabeledCard` (frameless + subtleLabel path only, the one
 * ActivityFeed uses): a subtle eyebrow header over frameless content. Not ported to
 * `.storybook/stories` yet — swap for the local LabeledCard block once it exists.
 */
// TODO: swap for LabeledCard local when ported
const DayHeaderSection = ({ label, children, anatPart }: { label: ReactNode, children: ReactNode, anatPart?: string }) => (
    <section className="flex flex-col gap-2" data-anat-part={anatPart}>
        <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
                <span className="truncate text-xs text-muted">{label}</span>
            </div>
        </div>
        {children}
    </section>
)

/** Props for the {@link ActivityFeed} block. */
export interface ActivityFeedProps {
    /** Activity items, newest first (already flattened across pages). */
    items: Array<QueryMyFeedItemData>
    /**
     * Resolve a global id to a press handler that navigates to the entity, or
     * `undefined` when unroutable. Navigation is the owning feature's concern.
     */
    onResolve: (globalId: string | null | undefined) => (() => void) | undefined
    /**
     * React handler for a feed item — `(activityId, emotion | null)`. Omit to make
     * the feed READ-ONLY. Per-item it is auto-suppressed when the activity is the
     * viewer's own (`isMine`).
     */
    onReact?: (activityId: string, type: ReactionType | null) => void
    /**
     * Renders each day's {@link SurfaceListCard} with a border instead of a shadow —
     * pass `true` when the feed sits NESTED inside another surface.
     */
    bordered?: boolean
    /** Extra classes merged onto the root. */
    className?: string
    /** When on, emit `data-anat-part` on each anatomy part for the BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * The shared Facebook-style activity feed renderer: each row is an
 * {@link ActivityAvatar} (avatar + activity-type icon badge) beside a sentence
 * (actor + action + target, both clickable when routable) and a relative timestamp,
 * grouped under relative day headers (Hôm nay / Hôm qua / date). Consecutive
 * milestone passes roll up into one line; a null target falls back to a generic-noun
 * phrase — never blank. Props-only: the owning FEATURE fetches the items + supplies
 * the route resolver.
 *
 * @param props - {@link ActivityFeedProps}
 */
export const ActivityFeed = ({
    items,
    onResolve,
    onReact,
    bordered = false,
    className,
    showAnatomy,
}: ActivityFeedProps) => {
    // roll up consecutive same-actor milestone passes, then bucket rows by day
    const dayGroups = useMemo<Array<DayGroup>>(
        () => {
            const rows: Array<FeedRow> = []
            for (const item of items) {
                const previous = rows[rows.length - 1]
                if (
                    item.type === ActivityType.MilestonePassed
                    && previous
                    && previous.head.type === ActivityType.MilestonePassed
                    && previous.head.actorGlobalId === item.actorGlobalId
                ) {
                    previous.count += 1
                    continue
                }
                rows.push({ head: item, count: 1 })
            }

            const now = new Date()
            const todayMs = startOfDayMs(now)
            const dayMs = 86_400_000
            const groupByKey = new Map<string, DayGroup>()
            for (const row of rows) {
                const at = new Date(row.head.at)
                const dayMsValue = startOfDayMs(at)
                let label: string
                if (dayMsValue === todayMs) {
                    label = "Hôm nay"
                } else if (dayMsValue === todayMs - dayMs) {
                    label = "Hôm qua"
                } else {
                    label = at.toLocaleDateString("vi-VN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })
                }
                const key = String(dayMsValue)
                const existing = groupByKey.get(key)
                if (existing) {
                    existing.rows.push(row)
                } else {
                    groupByKey.set(key, { key, label, rows: [row] })
                }
            }
            return Array.from(groupByKey.values())
        },
        [items],
    )

    /** Render one feed row as a FeedItem (avatar+badge · sentence · relative time). */
    const renderRow = (row: FeedRow) => {
        const { head, count } = row
        const Icon = TYPE_ICON[head.type] ?? PulseIcon
        // a "followed someone" row leads with the FOLLOWED user's avatar + a follow
        // badge; other rows lead with the actor
        const followedUser = head.type === ActivityType.UserFollowed && head.targetLabel != null
            ? head.targetLabel
            : undefined
        const avatarUsername = followedUser ?? head.actorUsername
        const avatarUrl = followedUser ? null : head.actorAvatar
        const grouped = head.type === ActivityType.MilestonePassed && count > 1
        const noTarget = head.targetLabel == null

        const actorEl = (
            <EntityLink
                label={head.actorUsername}
                onPress={onResolve(head.actorGlobalId)}
                anatPart={showAnatomy ? "EntityLink" : undefined}
            />
        )
        const targetEl = (
            <EntityLink
                label={head.targetLabel ?? ""}
                onPress={onResolve(head.targetGlobalId)}
                anatPart={showAnatomy ? "EntityLink" : undefined}
            />
        )
        // pick the phrasing: grouped roll-up · generic-noun fallback · normal
        const sentence = grouped
            ? milestoneGrouped(actorEl, count)
            : noTarget
                ? PHRASE[head.type].noTarget(actorEl)
                : PHRASE[head.type].withTarget(actorEl, targetEl)

        return (
            <FeedItem
                anatPart={showAnatomy ? "FeedItem" : undefined}
                leading={(
                    <ActivityAvatar
                        username={avatarUsername}
                        avatar={avatarUrl}
                        icon={<Icon aria-hidden focusable="false" weight="bold" />}
                        anatPart={showAnatomy ? "ActivityAvatar" : undefined}
                        showAnatomy={showAnatomy}
                    />
                )}
                timestamp={timeAgo(head.at)}
                footer={(
                    <ReactionBar
                        count={head.reactionCount}
                        myReaction={head.myReaction}
                        anatPart={showAnatomy ? "ReactionBar" : undefined}
                        // can't react to your own activity → read-only on own items
                        onReact={onReact && !head.isMine
                            ? (type) => onReact(head.id, type)
                            : undefined}
                    />
                )}
            >
                {sentence}
            </FeedItem>
        )
    }

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {dayGroups.map((group) => (
                <DayHeaderSection key={group.key} label={group.label} anatPart={showAnatomy ? "DayHeaderSection" : undefined}>
                    <SurfaceListCard bordered={bordered} anatPart={showAnatomy ? "SurfaceListCard" : undefined}>
                        {group.rows.map((row, index) => (
                            <SurfaceListCardItem
                                key={`${row.head.actorGlobalId}-${row.head.at}-${index}`}
                                anatPart={showAnatomy ? "SurfaceListCardItem" : undefined}
                            >
                                {renderRow(row)}
                            </SurfaceListCardItem>
                        ))}
                    </SurfaceListCard>
                </DayHeaderSection>
            ))}
        </div>
    )
}
