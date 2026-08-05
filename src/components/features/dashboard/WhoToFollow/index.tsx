"use client"

import React, {
    useCallback,
    useState,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    pathConfig,
} from "@/resources/path"
import { useMutateSetFollowSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSetFollowSwr"
import { useQuerySuggestedUsersSwr } from "@/hooks/swr/api/graphql/queries/useQuerySuggestedUsersSwr"
import {
    _WhoToFollow,
    type WhoToFollowUserItem,
} from "./component"

/**
 * `WhoToFollow` — the connected half of `_WhoToFollow` (see `./component.tsx`
 * for the presentational half). Self-fetches the backend's suggested-users
 * list, owns the `setFollow` mutation, and tracks which rows the viewer has
 * just followed / has in flight from THIS card so the toggle feels instant.
 *
 * Computes `isSkeleton` from the first-load formula (loading, nothing in hand
 * yet) and `isEmpty` from the resolved list, then hands both — plus the
 * already-translated strings and the resolved row data — to `_WhoToFollow`.
 */
export const WhoToFollow = () => {
    const t = useTranslations()
    const locale = useLocale()
    const { data, isLoading } = useQuerySuggestedUsersSwr()
    // owns the follow mutation; FollowButton rows stay presentational
    const { trigger: triggerSetFollow } = useMutateSetFollowSwr()
    // globalIds the viewer has just followed from this card (optimistic)
    const [followed, setFollowed] = useState<Set<string>>(new Set())
    // globalIds with a follow request currently in flight
    const [pending, setPending] = useState<Set<string>>(new Set())

    /** Follow the suggested user; flip the row to "following" on success. */
    const onFollow = useCallback(
        async (globalId: string) => {
            setPending((current) => new Set(current).add(globalId))
            try {
                const result = await triggerSetFollow({
                    userId: globalId,
                    follow: true,
                })
                if (result?.data?.setFollow?.success) {
                    setFollowed((current) => new Set(current).add(globalId))
                }
            } finally {
                setPending((current) => {
                    const next = new Set(current)
                    next.delete(globalId)
                    return next
                })
            }
        },
        [
            triggerSetFollow,
        ],
    )

    const users: ReadonlyArray<WhoToFollowUserItem> = (data ?? []).map((user) => ({
        globalId: user.globalId,
        username: user.username,
        displayName: user.displayName ?? undefined,
        avatar: user.avatar,
        openToWork: user.openToWork,
        profileHref: pathConfig().locale(locale).profile(user.username).build(),
        following: followed.has(user.globalId),
        isPending: pending.has(user.globalId),
    }))

    return (
        <_WhoToFollow
            title={t("dashboard.whoToFollow.title")}
            openToWorkLabel={t("dashboard.whoToFollow.openToWork")}
            users={users}
            onFollow={onFollow}
            // first load, nothing in hand yet — a background revalidation must not
            // re-flash the shimmer over rows the viewer is already reading
            isSkeleton={isLoading && !data}
            isEmpty={!data || data.length === 0}
        />
    )
}
