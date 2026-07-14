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
    FireIcon,
    FlagIcon,
    MegaphoneIcon,
    PuzzlePieceIcon,
    SparkleIcon,
    UserPlusIcon,
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
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { ResponsiveBreadcrumb } from "@/components/blocks/navigation/ResponsiveBreadcrumb"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { pathConfig } from "@/resources/path"

/** Props for {@link NotificationCenter}. */
export type NotificationCenterProps = WithClassNames<undefined>

/** Page size for the notification center's pager (bigger than the bell's popover page). */
const PAGE_SIZE = 20

/** The "Tất cả" tab has no `type` filter — a dedicated key distinct from any real
 *  {@link NotificationType} so it round-trips through the tab strip cleanly. */
const ALL_TAB = "all"

/** One filter tab: 1:1 with a real {@link NotificationType} (plus the "Tất cả"
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
    [NotificationType.SubscriptionGranted]: <SparkleIcon aria-hidden focusable="false" />,
    [NotificationType.Announcement]: <MegaphoneIcon aria-hidden focusable="false" />,
    [NotificationType.StreakMilestone]: <FireIcon aria-hidden focusable="false" />,
}

/**
 * "Trung tâm thông báo" — the full notification feed the bell's "Xem tất cả"
 * deep-links into. Same query/mutations/deep-link resolution as
 * `NotificationBell` (`components/features/navbar/Navbar/NotificationBell`),
 * just with type filter tabs + a bigger offset-paginated page instead of the
 * popover's fixed recent slice. `"use client"` for the SWR hook, tab/page state,
 * and navigation.
 * @param props - optional root class name
 */
export const NotificationCenter = ({ className }: NotificationCenterProps) => {
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
        <div className={cn("mx-auto flex max-w-3xl flex-col gap-6 p-6", className)}>
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
                        className="gap-2"
                    >
                        <CheckDoubleIcon className="size-4" aria-hidden focusable="false" />
                        {t("notifications.markAllRead")}
                    </Button>
                ) : undefined}
            />

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
                            icon: <FireIcon className="size-4" aria-hidden focusable="false" />,
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

            <AsyncContent
                isLoading={isLoading && !data}
                skeleton={(
                    <SurfaceListCard>
                        {[0, 1, 2, 3, 4].map((row) => (
                            <div key={row} className="flex items-center gap-3 px-4 py-4">
                                <Skeleton className="size-9 shrink-0 rounded-full" />
                                <div className="flex flex-1 flex-col gap-2">
                                    <Skeleton className="h-4 w-2/3 rounded-medium" />
                                    <Skeleton className="h-3 w-1/3 rounded-medium" />
                                </div>
                            </div>
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
                    // `EmptyState` intentionally omits its own frame — bọc `<Card>` cho
                    // khớp hình với list card khi có data (`components/card.md` §2).
                    <Card>
                        <CardContent>
                            <EmptyState
                                icon={<BellIcon aria-hidden focusable="false" />}
                                title={tab === ALL_TAB ? t("notifications.empty") : t("notifications.emptyFiltered")}
                                action={tab === ALL_TAB ? (
                                    // Platform-empty thật (chưa từng có thông báo nào) — CTA phải là
                                    // lời mời funnel primary, không phải secondary quiet (canon §Conversion).
                                    <Button size="sm" variant="primary" onPress={goToCourses} className="gap-2">
                                        {t("notifications.emptyCta")}
                                        <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
                                    </Button>
                                ) : (
                                    // Filtered-empty (tab có filter nhưng rỗng) — CTA phải quay lại
                                    // xem đủ (xoá filter), không đẩy ra ngoài trang khóa học (canon
                                    // §State-matrix: 2 lý do rỗng khác nhau → 2 CTA khác nghĩa).
                                    <Button size="sm" variant="secondary" onPress={() => onSelectTab(ALL_TAB)}>
                                        {t("notifications.clearFilters")}
                                    </Button>
                                )}
                            />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-3">
                        <SurfaceListCard>
                            {items.map((notification) => (
                                <SurfaceListCardRow
                                    key={notification.id}
                                    leading={(
                                        <span
                                            className={cn(
                                                "flex size-9 shrink-0 items-center justify-center rounded-full [&>svg]:size-4",
                                                notification.isRead
                                                    ? "bg-default text-muted"
                                                    : "bg-accent/10 text-accent",
                                            )}
                                        >
                                            {TYPE_ICONS[notification.type]}
                                        </span>
                                    )}
                                    title={(
                                        <span
                                            className={cn(
                                                "flex items-center gap-2",
                                                !notification.isRead && "font-medium",
                                            )}
                                        >
                                            {!notification.isRead ? (
                                                <CircleIcon
                                                    weight="fill"
                                                    aria-hidden
                                                    focusable="false"
                                                    className="size-1.5 shrink-0 text-accent"
                                                />
                                            ) : null}
                                            {t(
                                                notification.title.key,
                                                notification.title.params ?? undefined,
                                            )}
                                        </span>
                                    )}
                                    subtitle={notification.body
                                        ? t(
                                            notification.body.key,
                                            notification.body.params ?? undefined,
                                        )
                                        : undefined}
                                    meta={(
                                        <Typography type="body-xs" color="muted" className="whitespace-nowrap">
                                            {formatRelative(notification.createdAt)}
                                        </Typography>
                                    )}
                                    onPress={() => onPressItem(notification)}
                                />
                            ))}
                        </SurfaceListCard>

                        {totalPages > 1 ? (
                            <div className="flex items-center justify-between gap-3">
                                <Typography type="body-xs" color="muted">
                                    {t("notifications.pageInfo", {
                                        from: offset + 1,
                                        to: Math.min(offset + PAGE_SIZE, total),
                                        total,
                                    })}
                                </Typography>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        isDisabled={page <= 1}
                                        onPress={() => setPage((current) => Math.max(1, current - 1))}
                                    >
                                        {t("common.pagination.previous")}
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        isDisabled={page >= totalPages}
                                        onPress={() => setPage((current) => Math.min(totalPages, current + 1))}
                                    >
                                        {t("common.pagination.next")}
                                    </Button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
            </AsyncContent>
        </div>
    )
}
