"use client"

import React from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    FOLLOW_LIST_PAGE_LIMIT,
} from "@/hooks/swr/api/graphql/queries/useQueryUserFollowersInfiniteSwr"
import type {
    FollowListTab,
} from "@/hooks/zustand/overlay/store"
import { useFollowListOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryUserFollowersInfiniteSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserFollowersInfiniteSwr"
import { useQueryUserFollowingInfiniteSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserFollowingInfiniteSwr"
import { pathConfig } from "@/resources/path"
import { _FollowListModal, type FollowListRow } from "./component"

/**
 * Global follow-list modal: the followers / following lists for one profile,
 * each an infinite-scroll roster of clickable users. Opened via
 * {@link useFollowListOverlayState} (`open({ username, tab })`) from the
 * profile identity column; mounted once, prop-less, in `ModalContainer`.
 *
 * CONNECTED half (`tiers/split.md`): reads the target username + initial tab
 * from the overlay context, drives a `useSWRInfinite` hook per direction
 * (only the active tab fetches), resolves every label, and hands everything
 * to the presentational {@link _FollowListModal} (`./component`).
 */
export const FollowListModal = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { isOpen, setOpen, context } = useFollowListOverlayState()
    const username = context?.username ?? null

    // active tab is ephemeral UI state; seed it from the context each time the
    // modal opens (or the caller switches which count they clicked)
    const [tab, setTab] = React.useState<FollowListTab>("followers")
    React.useEffect(() => {
        if (isOpen && context?.tab) {
            setTab(context.tab)
        }
    }, [isOpen, context?.tab])

    const { data: profile } = useQueryUserProfileSwr(username)
    // only the visible tab fetches (the hidden one is gated by `enabled`)
    const followers = useQueryUserFollowersInfiniteSwr(username, isOpen && tab === "followers")
    const following = useQueryUserFollowingInfiniteSwr(username, isOpen && tab === "following")
    const active = tab === "followers" ? followers : following

    const items = (active.data ?? []).flat()
    const lastPage = active.data?.[active.data.length - 1]
    // a full last page means there may be more rows behind it
    const hasMore = !!lastPage && lastPage.length === FOLLOW_LIST_PAGE_LIMIT
    // first-load formula ("first load, nothing in hand") — see loading-and-skeleton.md §2
    const isSkeleton = active.isLoading && items.length === 0

    const counts: Record<FollowListTab, number> = {
        followers: profile?.followerCount ?? 0,
        following: profile?.followingCount ?? 0,
    }

    /** Go to a user's profile and close the modal. */
    const onOpenUser = (userName: string) => {
        router.push(pathConfig().locale(locale).profile(userName).build())
        setOpen(false)
    }

    const rows: Array<FollowListRow> = items.map((follow) => ({
        globalId: follow.globalId,
        username: follow.username,
        displayName: follow.displayName ?? follow.username,
        avatar: follow.avatar,
        handle: `@${follow.username}`,
    }))

    return (
        <_FollowListModal
            isOpen={isOpen}
            onOpenChange={setOpen}
            tab={tab}
            onTabChange={setTab}
            counts={counts}
            rows={rows}
            onOpenUser={onOpenUser}
            hasMore={hasMore}
            onLoadMore={() => active.setSize((size) => size + 1)}
            isLoadingMore={active.isValidating}
            isSkeleton={isSkeleton}
            error={active.error}
            onRetry={() => active.mutate()}
            labels={{
                title: t("followList.title"),
                followersTab: t("profile.followers"),
                followingTab: t("profile.following"),
                empty: t(`followList.empty.${tab}`),
                errorTitle: t("publicProfile.loadError"),
                errorRetry: t("publicProfile.loadErrorRetry"),
            }}
        />
    )
}
