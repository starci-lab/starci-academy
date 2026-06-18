"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    Button,
    Typography,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    BookOpenIcon,
    BookmarkSimpleIcon,
    ChatCircleIcon,
    CodeIcon,
    FlagIcon,
    GraduationCapIcon,
    PulseIcon,
    SealCheckIcon,
    SparkleIcon,
    UserPlusIcon,
} from "@phosphor-icons/react"
import {
    ActivityType,
    queryResolveRoute,
} from "@/modules/api"
import type {
    QueryMyFeedItemData,
} from "@/modules/api"
import {
    useQueryUserFeedSwr,
    useQueryUserProfileSwr,
} from "@/hooks"
import {
    useProfileUsername,
} from "../../hooks/useProfileUsername"
import {
    formatDateTime,
    getTimeAgoLabel,
    getTimeAgoMessage,
} from "@/modules/dayjs"
import {
    ActivityAvatar,
    AsyncContent,
    EntityLink,
    FeedItem,
    LabeledCard,
    Skeleton,
} from "@/components/blocks"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link ProfileActivity}. */
export type ProfileActivityProps = WithClassNames<undefined>

/** Activity-type → badge icon (phosphor `*Icon`) shown over the actor avatar. */
const TYPE_ICON: Record<ActivityType, typeof BookOpenIcon> = {
    [ActivityType.LessonRead]: BookOpenIcon,
    [ActivityType.LessonBookmarked]: BookmarkSimpleIcon,
    [ActivityType.ChallengePassed]: SealCheckIcon,
    [ActivityType.CodingSolved]: CodeIcon,
    [ActivityType.MilestonePassed]: FlagIcon,
    [ActivityType.AiLabPassed]: SparkleIcon,
    [ActivityType.CourseEnrolled]: GraduationCapIcon,
    [ActivityType.DiscussionCommented]: ChatCircleIcon,
    [ActivityType.UserFollowed]: UserPlusIcon,
}

/** One rendered row: a single item, or a roll-up of consecutive milestone passes. */
interface FeedRow {
    /** Newest item in the row (drives actor + timestamp + icon). */
    head: QueryMyFeedItemData
    /** How many milestone passes were rolled up (1 for a normal row). */
    count: number
}

/** A day bucket of feed rows under a relative day header. */
interface DayGroup {
    /** Stable key (start-of-day ms). */
    key: string
    /** Header label ("Hôm nay" / "Hôm qua" / a formatted date). */
    label: string
    /** Rows in this day, newest first. */
    rows: Array<FeedRow>
}

/** Start-of-day epoch ms for a date (local). */
const startOfDayMs = (date: Date): number =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

/**
 * Activity-tab section — the profile owner's timeline, Facebook-style: each row is
 * an {@link ActivityAvatar} (avatar + activity-type icon badge) beside a sentence
 * (actor + action + target, both clickable when routable) and a relative timestamp,
 * grouped under relative day headers (Hôm nay / Hôm qua / date). Consecutive
 * milestone passes roll up into one line. A null target renders a generic-noun
 * fallback phrase — never blank. Self-contained: resolves username → id, drives its
 * own infinite SWR, and owns route resolution (passes a press handler to
 * {@link EntityLink}). Self-hides when empty.
 *
 * @param props - optional className (placement only).
 */
export const ProfileActivity = ({
    className,
}: ProfileActivityProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const {
        data,
        size,
        setSize,
        isLoading,
        isValidating,
        error,
        mutate,
    } = useQueryUserFeedSwr(userId)

    // flatten every loaded page into a single newest-first item list
    const items = useMemo(
        () => (data ?? []).flatMap((page) => page.items),
        [data],
    )
    const hasMore = Boolean(data && data.length > 0 && data[data.length - 1].nextCursor !== null)
    const isLoadingMore = isValidating && Boolean(data) && size > 0

    /** Resolve an entity's route via the index, then navigate (no-op if unroutable). */
    const onResolve = useCallback(
        (globalId: string | null | undefined): (() => void) | undefined => {
            if (!globalId) {
                return undefined
            }
            return () => {
                void (async () => {
                    const response = await queryResolveRoute({ request: { globalId } })
                    const path = response.data?.resolveRoute?.data?.path
                    if (path) {
                        router.push(`/${locale}${path}`)
                    }
                })()
            }
        },
        [
            locale,
            router,
        ],
    )

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
            const groups: Array<DayGroup> = []
            for (const row of rows) {
                const at = new Date(row.head.at)
                const dayMsValue = startOfDayMs(at)
                let label: string
                if (dayMsValue === todayMs) {
                    label = t("dashboard.feed.today")
                } else if (dayMsValue === todayMs - dayMs) {
                    label = t("dashboard.feed.yesterday")
                } else {
                    label = at.toLocaleDateString(locale, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })
                }
                const key = String(dayMsValue)
                const last = groups[groups.length - 1]
                if (last && last.key === key) {
                    last.rows.push(row)
                } else {
                    groups.push({ key, label, rows: [row] })
                }
            }
            return groups
        },
        [
            items,
            locale,
            t,
        ],
    )

    // resolved-empty + no error → hide the whole section (clean profile)
    if (data && items.length === 0 && !error) {
        return null
    }

    /** Render one feed row as a FeedItem (avatar+badge · sentence · relative time). */
    const renderRow = (row: FeedRow, index: number) => {
        const { head, count } = row
        const Icon = TYPE_ICON[head.type] ?? PulseIcon
        // a "followed someone" row leads with the FOLLOWED user's avatar (the
        // interesting entity) + a follow-icon badge; other rows lead with the actor
        const followedUser = head.type === ActivityType.UserFollowed && head.targetLabel != null
            ? head.targetLabel
            : undefined
        const avatarUsername = followedUser ?? head.actorUsername
        // followed user's avatar isn't in the feed payload → generated from username
        const avatarUrl = followedUser ? null : head.actorAvatar
        const grouped = head.type === ActivityType.MilestonePassed && count > 1
        const noTarget = head.targetLabel == null
        // pick the phrasing: grouped roll-up · generic-noun fallback · normal
        const messageKey = grouped
            ? "milestonePassedGrouped"
            : noTarget
                ? `${head.type}NoTarget`
                : head.type
        const relative = getTimeAgoLabel(getTimeAgoMessage(head.at), t)
        return (
            <FeedItem
                key={`${head.actorGlobalId}-${head.at}-${index}`}
                leading={(
                    <ActivityAvatar
                        username={avatarUsername}
                        avatar={avatarUrl}
                        icon={<Icon aria-hidden focusable="false" weight="bold" />}
                    />
                )}
                timestamp={<span title={formatDateTime(head.at, locale)}>{relative}</span>}
            >
                {t.rich(`dashboard.feed.${messageKey}`, {
                    count,
                    actor: () => (
                        <EntityLink
                            label={head.actorUsername}
                            onPress={onResolve(head.actorGlobalId)}
                        />
                    ),
                    target: () => (
                        <EntityLink
                            label={head.targetLabel ?? ""}
                            onPress={onResolve(head.targetGlobalId)}
                        />
                    ),
                })}
            </FeedItem>
        )
    }

    return (
        <LabeledCard
            className={className}
            label={t("publicProfile.recentActivity")}
            icon={<PulseIcon aria-hidden focusable="false" className="size-5" />}
        >
            <AsyncContent
                debug={true}
                isLoading={(isLoading || !userId) && items.length === 0}
                skeleton={(
                    <div className="flex flex-col gap-6">
                        {[0, 1].map((group) => (
                            <div key={group} className="flex flex-col gap-3">
                                {/* day header */}
                                <Skeleton.Typography type="body-xs" width="1/4" />
                                {[0, 1, 2].map((row) => (
                                    <div key={row} className="flex items-start gap-2">
                                        {/* actor avatar + type badge */}
                                        <Skeleton className="size-9 shrink-0 rounded-full" />
                                        <div className="flex flex-1 flex-col gap-0">
                                            <Skeleton.Typography type="body-sm" width="3/4" />
                                            <Skeleton.Typography type="body-xs" width="1/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
                isEmpty={items.length === 0}
                emptyContent={{
                    title: t("publicProfile.activityEmpty"),
                }}
                error={items.length === 0 ? error : undefined}
                errorContent={{
                    title: t("publicProfile.loadError"),
                    onRetry: () => {
                        void mutate()
                    },
                    retryLabel: t("publicProfile.loadErrorRetry"),
                }}
            >
                <div className="flex flex-col gap-6">
                    {dayGroups.map((group) => (
                        <div key={group.key} className="flex flex-col gap-3">
                            <Typography type="body-xs" color="muted" weight="medium">
                                {group.label}
                            </Typography>
                            <div className="flex flex-col gap-3">
                                {group.rows.map(renderRow)}
                            </div>
                        </div>
                    ))}
                    {hasMore ? (
                        <div className="flex justify-center">
                            <Button
                                variant="secondary"
                                size="sm"
                                isPending={isLoadingMore}
                                onPress={() => setSize(size + 1)}
                            >
                                {t("publicProfile.loadMore")}
                            </Button>
                        </div>
                    ) : null}
                </div>
            </AsyncContent>
        </LabeledCard>
    )
}
