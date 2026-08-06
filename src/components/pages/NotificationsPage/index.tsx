"use client"

import React, {
    useCallback,
    useMemo,
    useState,
} from "react"
import {
    ArrowRightIcon,
    BellIcon,
    ChatCircleIcon,
    ChecksIcon as CheckDoubleIcon,
    CircleIcon,
    CodeIcon,
    FlameIcon,
    FlagIcon,
    MegaphoneIcon,
    PuzzlePieceIcon,
    SparkleIcon,
    UserPlusIcon,
    UsersThreeIcon,
} from "@phosphor-icons/react"
import {
    Button,
    Card,
    CardContent,
    Typography,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import type {
    Key,
    ReactNode,
} from "react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { mutateMarkAllNotificationsAsRead } from "@/modules/api/graphql/mutations/mutation-mark-all-notifications-as-read"
import { mutateMarkNotificationAsRead } from "@/modules/api/graphql/mutations/mutation-mark-notification-as-read"
import {
    NotificationType,
    type QueryNotificationData,
} from "@/modules/api/graphql/queries/types/notifications"
import { resolveNotificationTargetPath } from "@/modules/notifications/resolve-notification-target"
import { useQueryMyNotificationsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyNotificationsSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/composites/feedback/EmptyState"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { ResponsiveBreadcrumb } from "@/components/blocks/navigation/ResponsiveBreadcrumb"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { pathConfig } from "@/resources/path"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"

/** Props for {@link NotificationsPage}. */
export type NotificationsPageProps = WithClassNames<undefined>

/** Page size for the notification center's pager (bigger than the bell's popover page). */
const PAGE_SIZE = 20

/** The "All" tab has no `type` filter — a dedicated key distinct from any real
 *  {@link NotificationType} so it round-trips through the tab strip cleanly. */
const ALL_TAB = "all"

/** One filter tab: 1:1 with a real {@link NotificationType} (plus the "All"
 *  catch-all) — every type stays reachable, nothing is silently grouped away. */
type TabKey = typeof ALL_TAB | NotificationType

/** Icon per {@link NotificationType} — mirrors the motif each type's action carries
 *  elsewhere in the app (challenge = puzzle piece, streak = flame, …). */
const TYPE_ICONS: Record<NotificationType, ReactNode> = {
    [NotificationType.System]: <BellIcon aria-hidden focusable="false" />,
    [NotificationType.ChallengeGraded]: <PuzzlePieceIcon aria-hidden focusable="false" />,
    [NotificationType.CodingGraded]: <CodeIcon aria-hidden focusable="false" />,
    [NotificationType.MilestoneGraded]: <FlagIcon aria-hidden focusable="false" />,
    [NotificationType.NewFollower]: <UserPlusIcon aria-hidden focusable="false" />,
    [NotificationType.CommentReply]: <ChatCircleIcon aria-hidden focusable="false" />,
    [NotificationType.CommunityReply]: <UsersThreeIcon aria-hidden focusable="false" />,
    [NotificationType.SubscriptionGranted]: <SparkleIcon aria-hidden focusable="false" />,
    [NotificationType.Announcement]: <MegaphoneIcon aria-hidden focusable="false" />,
    [NotificationType.StreakMilestone]: <FlameIcon aria-hidden focusable="false" />,
}

/**
 * "Notification Center" — the full notification feed the bell's "View all"
 * deep-links into. Same query/mutations/deep-link resolution as
 * `NotificationBell` (`components/features/navbar/Navbar/NotificationBell`),
 * just with type filter tabs + a bigger offset-paginated page instead of the
 * popover's fixed recent slice. `"use client"` for the SWR hook, tab/page state,
 * and navigation.
 * @param props - optional root class name
 */
export const NotificationsPage = ({ className }: NotificationsPageProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const runGraphQL = useGraphQLWithToast()

    const [tab, setTab] = useState<TabKey>(ALL_TAB)
    const [page, setPage] = useState(1)

    const type = tab === ALL_TAB ? undefined : tab
    const offset = (page - 1) * PAGE_SIZE
    const { data, isLoading, error, mutate } = useQueryMyNotificationsSwr({
        limit: PAGE_SIZE,
        offset,
        type,
    })

    const items = data?.items ?? []
    const total = data?.total ?? 0
    const unreadCount = data?.unreadCount ?? 0
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    /** Locale-aware relative-time formatter for the item timestamps — same
     *  formatting rule as the bell. */
    const relativeFormat = useMemo(
        () => new Intl.RelativeTimeFormat(locale, { numeric: "auto" }),
        [locale],
    )

    const formatRelative = useCallback(
        (iso: string): string => {
            const diffMs = new Date(iso).getTime() - Date.now()
            const diffMin = Math.round(diffMs / 60_000)
            const absMin = Math.abs(diffMin)
            if (absMin < 60) {
                return relativeFormat.format(diffMin, "minute")
            }
            const diffHour = Math.round(diffMin / 60)
            if (Math.abs(diffHour) < 24) {
                return relativeFormat.format(diffHour, "hour")
            }
            const diffDay = Math.round(diffHour / 24)
            return relativeFormat.format(diffDay, "day")
        },
        [relativeFormat],
    )

    /** Switching tabs re-queries from the first page — a filtered set may have
     *  fewer pages than the one the viewer was on. */
    const onSelectTab = useCallback((key: Key) => {
        setTab(String(key) as TabKey)
        setPage(1)
    }, [])

    /** Mark a single notification read and navigate to its resolved target —
     *  identical flow to the bell's `onPressItem`, sharing the same helper. */
    const onPressItem = useCallback(
        async (notification: QueryNotificationData) => {
            if (!notification.isRead) {
                await runGraphQL(
                    async () => {
                        const env = await mutateMarkNotificationAsRead({
                            request: { notificationId: notification.id },
                        })
                        return env.data!.markNotificationAsRead
                    },
                    { showSuccessToast: false, showErrorToast: false },
                )
                await mutate()
            }
            const { target } = notification
            if (!target) {
                return
            }
            const path = await resolveNotificationTargetPath(target)
            if (path) {
                router.push(`/${locale}${path}`)
            }
        },
        [locale, mutate, router, runGraphQL],
    )

    const onMarkAllRead = useCallback(
        async () => {
            await runGraphQL(
                async () => {
                    const env = await mutateMarkAllNotificationsAsRead({
                        request: undefined,
                    })
                    return env.data!.markAllNotificationsAsRead
                },
                { showSuccessToast: false, showErrorToast: true },
            )
            await mutate()
        },
        [mutate, runGraphQL],
    )

    const goToCourses = () => router.push(pathConfig().locale(locale).course().build())

    return (
        <Box identity={{ tier: "page", component: "NotificationsPage" }} principle="center-measure" className={cn("mx-auto max-w-3xl p-6", className)}
            explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport."
        >
            <StackV gap={7} principle="layout-split"
                explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
                items={[
                    () => (
                        <PageHeader
                            breadcrumb={(
                                <ResponsiveBreadcrumb
                                    items={[
                                        {
                                            key: "home",
                                            label: t("nav.home"),
                                            onPress: () => router.push(pathConfig().locale(locale).build()),
                                        },
                                        {
                                            key: "notifications",
                                            label: t("notifications.title"),
                                        },
                                    ]}
                                />
                            )}
                            title={t("notifications.title")}
                            description={t("notifications.description")}
                            actions={unreadCount > 0 ? (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onPress={onMarkAllRead}
                                >
                                    <CheckDoubleIcon className="size-4" aria-hidden focusable="false" />
                                    {t("notifications.markAllRead")}
                                </Button>
                            ) : undefined}
                        />
                    ),

                    () => (
                        <StackV gap={6} principle="block-boundary"
                            explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                            items={[
                                () => (
                                    <TabsCard
                                        leftTabs={{
                                            items: [
                                                { key: ALL_TAB, label: t("notifications.tabs.all") },
                                                {
                                                    key: NotificationType.CommentReply,
                                                    label: t("notifications.tabs.commentReply"),
                                                    icon: <ChatCircleIcon className="size-4" aria-hidden focusable="false" />,
                                                },
                                                {
                                                    key: NotificationType.CommunityReply,
                                                    label: t("notifications.tabs.communityReply"),
                                                    icon: <UsersThreeIcon className="size-4" aria-hidden focusable="false" />,
                                                },
                                                {
                                                    key: NotificationType.MilestoneGraded,
                                                    label: t("notifications.tabs.milestoneGraded"),
                                                    icon: <FlagIcon className="size-4" aria-hidden focusable="false" />,
                                                },
                                                {
                                                    key: NotificationType.ChallengeGraded,
                                                    label: t("notifications.tabs.challengeGraded"),
                                                    icon: <PuzzlePieceIcon className="size-4" aria-hidden focusable="false" />,
                                                },
                                                {
                                                    key: NotificationType.CodingGraded,
                                                    label: t("notifications.tabs.codingGraded"),
                                                    icon: <CodeIcon className="size-4" aria-hidden focusable="false" />,
                                                },
                                                {
                                                    key: NotificationType.NewFollower,
                                                    label: t("notifications.tabs.newFollower"),
                                                    icon: <UserPlusIcon className="size-4" aria-hidden focusable="false" />,
                                                },
                                                {
                                                    key: NotificationType.SubscriptionGranted,
                                                    label: t("notifications.tabs.subscriptionGranted"),
                                                    icon: <SparkleIcon className="size-4" aria-hidden focusable="false" />,
                                                },
                                                {
                                                    key: NotificationType.StreakMilestone,
                                                    label: t("notifications.tabs.streakMilestone"),
                                                    icon: <FlameIcon className="size-4" aria-hidden focusable="false" />,
                                                },
                                                {
                                                    key: NotificationType.Announcement,
                                                    label: t("notifications.tabs.announcement"),
                                                    icon: <MegaphoneIcon className="size-4" aria-hidden focusable="false" />,
                                                },
                                                {
                                                    key: NotificationType.System,
                                                    label: t("notifications.tabs.system"),
                                                    icon: <BellIcon className="size-4" aria-hidden focusable="false" />,
                                                },
                                            ],
                                            selectedKey: tab,
                                            ariaLabel: t("notifications.tabsAria"),
                                            onSelectionChange: onSelectTab,
                                        }}
                                        className="overflow-x-auto"
                                    />
                                ),

                                () => (
                                    <AsyncContent
                                        isLoading={isLoading && !data}
                                        skeleton={(
                                            <SurfaceListCard>
                                                {[0, 1, 2, 3, 4].map((row) => (
                                                    <Box key={row} principle="row-pad" className="px-4 py-4"
                                                        explain="Row content inset — not cell-pad, because this pads a horizontal content row rather than a dense table cell.">
                                                        <StackH gap={4} principle="content-row" align="center"
                                                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                            items={[
                                                                () => <Skeleton className="size-9 shrink-0 rounded-full" />,
                                                                () => (
                                                                    <StackV gap={3} principle="sibling-stack" classNames={["flex-1"]}
                                                                        explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                                                        items={[
                                                                            () => <Skeleton className="h-4 w-2/3 rounded-medium" />,
                                                                            () => <Skeleton className="h-3 w-1/3 rounded-medium" />,
                                                                        ]} />
                                                                ),
                                                            ]} />
                                                    </Box>
                                                ))}
                                            </SurfaceListCard>
                                        )}
                                        error={error}
                                        errorContent={{
                                            title: t("notifications.loadError"),
                                            onRetry: () => { void mutate() },
                                            retryLabel: t("notifications.retry"),
                                        }}
                                    >
                                        {items.length === 0 ? (
                                        // `EmptyState` intentionally omits its own frame — wrap it in `<Card>` to
                                        // match the shape of the list card when there is data (`components/card.md` §2).
                                            <Card>
                                                <CardContent>
                                                    <EmptyState
                                                        icon={BellIcon}
                                                        title={tab === ALL_TAB ? t("notifications.empty") : t("notifications.emptyFiltered")}
                                                        action={() => tab === ALL_TAB ? (
                                                        // Genuinely platform-empty (never had any notification) — the CTA must be
                                                        // a primary funnel invitation, not a quiet secondary one (canon §Conversion).
                                                            <Button size="sm" variant="primary" onPress={goToCourses}>
                                                                {t("notifications.emptyCta")}
                                                                <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
                                                            </Button>
                                                        ) : (
                                                        // Filtered-empty (a filtered tab that's empty) — the CTA must go back to
                                                        // viewing everything (clear the filter), not push out to the course page
                                                        // (canon §State-matrix: 2 different reasons for empty → 2 CTAs with different meaning).
                                                            <Button size="sm" variant="secondary" onPress={() => onSelectTab(ALL_TAB)}>
                                                                {t("notifications.clearFilters")}
                                                            </Button>
                                                        )}
                                                    />
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            <StackV gap={4} principle="content-row"
                                                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                items={[
                                                    () => (
                                                        <SurfaceListCard>
                                                            {items.map((notification) => (
                                                                <SurfaceListCardRow
                                                                    key={notification.id}
                                                                    leading={() => (
                                                                        <span
                                                                            className={cn(
                                                                                "flex size-9 shrink-0 items-center justify-center rounded-full [&>svg]:size-4",
                                                                                notification.isRead
                                                                                    ? "bg-default text-muted"
                                                                                    : "bg-accent-soft text-accent-soft-foreground",
                                                                            )}
                                                                        >
                                                                            {TYPE_ICONS[notification.type]}
                                                                        </span>
                                                                    )}
                                                                    title={t(
                                                                        notification.title.key,
                                                                        notification.title.params ?? undefined,
                                                                    )}
                                                                    subtitle={notification.body
                                                                        ? t(
                                                                            notification.body.key,
                                                                            notification.body.params ?? undefined,
                                                                        )
                                                                        : undefined}
                                                                    meta={() => (
                                                                        <Typography type="body-xs" color="muted" className="whitespace-nowrap">
                                                                            {formatRelative(notification.createdAt)}
                                                                        </Typography>
                                                                    )}
                                                                    // unread dot moves here from beside the title: `title` is plain
                                                                    // text now (never a built element) and `titleClassName` stays
                                                                    // lint-forbidden, so the unread signal — already echoed by the
                                                                    // leading badge's accent tint — rides the row's one remaining slot.
                                                                    trailing={!notification.isRead ? () => (
                                                                        <CircleIcon
                                                                            weight="fill"
                                                                            aria-hidden
                                                                            focusable="false"
                                                                            className="size-1.5 shrink-0 text-accent-soft-foreground"
                                                                        />
                                                                    ) : undefined}
                                                                    onPress={() => onPressItem(notification)}
                                                                />
                                                            ))}
                                                        </SurfaceListCard>
                                                    ),

                                                    () => (totalPages > 1 ? (
                                                        <StackH gap={4} principle="content-row" justify="between" align="center"
                                                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                            items={[
                                                                () => (
                                                                    <Typography type="body-xs" color="muted">
                                                                        {t("notifications.pageInfo", {
                                                                            from: offset + 1,
                                                                            to: Math.min(offset + PAGE_SIZE, total),
                                                                            total,
                                                                        })}
                                                                    </Typography>
                                                                ),
                                                                () => (
                                                                    <StackH gap={3} principle="flex-action" align="center"
                                                                        explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                                                                        items={[
                                                                            () => (
                                                                                <Button
                                                                                    variant="secondary"
                                                                                    size="sm"
                                                                                    isDisabled={page <= 1}
                                                                                    onPress={() => setPage((current) => Math.max(1, current - 1))}
                                                                                >
                                                                                    {t("common.pagination.previous")}
                                                                                </Button>
                                                                            ),
                                                                            () => (
                                                                                <Button
                                                                                    variant="secondary"
                                                                                    size="sm"
                                                                                    isDisabled={page >= totalPages}
                                                                                    onPress={() => setPage((current) => Math.min(totalPages, current + 1))}
                                                                                >
                                                                                    {t("common.pagination.next")}
                                                                                </Button>
                                                                            ),
                                                                        ]} />
                                                                ),
                                                            ]} />
                                                    ) : null),
                                                ]} />
                                        )}
                                    </AsyncContent>
                                ),
                            ]} />
                    ),
                ]} />
        </Box>
    )
}
