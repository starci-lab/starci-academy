import useSWR from "swr"
import { queryMyNotifications } from "@/modules/api/graphql/queries/query-my-notifications"
import type { NotificationType, QueryMyNotificationsData } from "@/modules/api/graphql/queries/types/notifications"
import { useAppSelector } from "@/redux/hooks"

/** How many recent notifications the bell list fetches at once. */
const BELL_LIMIT = 20

/** Optional paging/filter args — the bell calls with none (bell defaults below);
 *  the notification center page passes its own `limit`/`offset`/`type`. */
export interface UseQueryMyNotificationsSwrParams {
    /** Page size; defaults to {@link BELL_LIMIT} (the bell's popover page). */
    limit?: number
    /** Row offset (0-based); defaults to 0. */
    offset?: number
    /** Restrict to one notification kind (notification-center type filter tabs). */
    type?: NotificationType
}

/**
 * SWR wrapper for {@link queryMyNotifications}. `data` is the requested
 * notification page (newest first) plus the `unreadCount` for the badge, or
 * `null`. User-scoped — only runs once authenticated. Polls in the background so
 * the badge stays roughly fresh even without the realtime socket. Defaults to
 * the bell's `limit`/offset 0/no type filter when called with no args; the
 * notification center page passes its own paging + type filter so its cache key
 * (and therefore its SWR entry) stays distinct from the bell's.
 */
export const useQueryMyNotificationsSwr = ({
    limit = BELL_LIMIT,
    offset = 0,
    type,
}: UseQueryMyNotificationsSwrParams = {}) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<QueryMyNotificationsData | null>(
        authenticated ? ["QUERY_MY_NOTIFICATIONS_SWR", limit, offset, type] : null,
        async () => {
            // unwrap the standard API envelope; null when absent
            const result = await queryMyNotifications({
                request: {
                    limit,
                    offset,
                    type,
                },
            })
            return result.data?.myNotifications?.data ?? null
        },
        {
            // keep the badge roughly fresh between realtime socket pushes
            refreshInterval: 60_000,
        },
    )
}
