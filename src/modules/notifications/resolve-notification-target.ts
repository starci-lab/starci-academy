import { queryResolveRoute } from "@/modules/api/graphql/queries/query-resolve-route"
import type { QueryNotificationTargetData } from "@/modules/api/graphql/queries/types/notifications"

/**
 * Encode a notification target into the opaque global id the route index
 * expects: base64url of `"<entityName>:<id>"`. Shared by {@link NotificationBell}
 * (`components/features/navbar/Navbar/NotificationBell`) and the notification
 * center page so both deep-link the exact same way.
 */
export const encodeNotificationGlobalId = (target: QueryNotificationTargetData): string => {
    const raw = `${target.entityName}:${target.id}`
    // base64 → base64url (route index decodes base64url(`<entityName>:<id>`))
    return btoa(raw)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")
}

/**
 * Resolve a notification's snapshotted target into its canonical, locale-agnostic
 * path via the route index (`resolveRoute`), or `null` when the target can't be
 * resolved (deleted entity, targetless notification).
 */
export const resolveNotificationTargetPath = async (
    target: QueryNotificationTargetData,
): Promise<string | null> => {
    const response = await queryResolveRoute({
        request: { globalId: encodeNotificationGlobalId(target) },
    })
    return response.data?.resolveRoute?.data?.path ?? null
}
