"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import { mutateMarkAllNotificationsAsRead } from "@/modules/api/graphql/mutations/mutation-mark-all-notifications-as-read"
import { mutateMarkNotificationAsRead } from "@/modules/api/graphql/mutations/mutation-mark-notification-as-read"
import { queryResolveRoute } from "@/modules/api/graphql/queries/query-resolve-route"
import type { QueryNotificationData, QueryNotificationTargetData } from "@/modules/api/graphql/queries/types/notifications"
import { useQueryMyNotificationsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyNotificationsSwr"
import { useAppSelector } from "@/redux/hooks"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { _NotificationBell, type NotificationBellItem } from "./component"

/** Props for {@link NotificationBell}. */
export type NotificationBellProps = Record<string, never>
/**
 * Encode a notification target into the opaque global id the route index
 * expects: base64url of `"<entityName>:<id>"`.
 */
const encodeGlobalId = (target: QueryNotificationTargetData): string => {
    const raw = `${target.entityName}:${target.id}`
    // base64 → base64url (route index decodes base64url(`<entityName>:<id>`))
    return btoa(raw)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")
}

/**
 * NotificationBell — the CONNECTED half: fetches its own notification page
 * (newest first) + unread count, resolves each item's title/body/relative-time
 * via `t()`, and wires the mark-read + navigate-on-press behavior. See
 * `design/storybook/architecture/split.md`.
 * @param props - optional root class name
 */
export const NotificationBell = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const { data, isLoading, mutate } = useQueryMyNotificationsSwr()
    const runGraphQL = useGraphQLWithToast()

    const rawItems = data?.items ?? []
    const unreadCount = data?.unreadCount ?? 0

    /** Locale-aware relative-time formatter for the item timestamps. */
    const relativeFormat = useMemo(
        () => new Intl.RelativeTimeFormat(locale, { numeric: "auto" }),
        [locale],
    )

    /** Format an ISO timestamp as a coarse relative string ("3h ago"). */
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

    /** Mark a single notification read and navigate to its resolved target. */
    const onPressItem = useCallback(
        async (notification: QueryNotificationData) => {
            // optimistically mark read in the local cache, then persist
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
            // resolve the snapshotted target into a route, then push to it
            const { target } = notification
            if (!target) {
                return
            }
            const response = await queryResolveRoute({
                request: { globalId: encodeGlobalId(target) },
            })
            const path = response.data?.resolveRoute?.data?.path
            if (path) {
                router.push(`/${locale}${path}`)
            }
        },
        [locale, mutate, router, runGraphQL],
    )

    /** Mark every unread notification read in one bulk action. */
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

    const items = useMemo<Array<NotificationBellItem>>(
        () => rawItems.map((notification) => ({
            id: notification.id,
            isRead: notification.isRead,
            titleText: t(notification.title.key, notification.title.params ?? undefined),
            bodyText: notification.body
                ? t(notification.body.key, notification.body.params ?? undefined)
                : null,
            relativeLabel: formatRelative(notification.createdAt),
            onPress: () => {
                void onPressItem(notification)
            },
        })),
        [rawItems, t, formatRelative, onPressItem],
    )

    return (
        <_NotificationBell
            isAuthenticated={Boolean(authenticated)}
            items={items}
            unreadCount={unreadCount}
            isLoading={isLoading}
            bellAriaLabel={t("notifications.title")}
            titleLabel={t("notifications.title")}
            markAllReadLabel={t("notifications.markAllRead")}
            emptyLabel={t("notifications.empty")}
            onMarkAllRead={() => {
                void onMarkAllRead()
            }}
        />
    )
}
