"use client"

import React from "react"
import {
    Tabs,
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
    FOLLOW_LIST_PAGE_LIMIT,
} from "@/hooks/swr/api/graphql/queries/useQueryUserFollowersInfiniteSwr"
import type {
    FollowListTab,
} from "@/hooks/zustand/overlay/store"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useFollowListOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryUserFollowersInfiniteSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserFollowersInfiniteSwr"
import { useQueryUserFollowingInfiniteSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserFollowingInfiniteSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { InfiniteScrollSentinel } from "@/components/blocks/async/InfiniteScrollSentinel"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { UserCell } from "@/components/blocks/identity/UserCell"
import { pathConfig } from "@/resources/path"
import { ModalShell } from "@/components/blocks/layout/ModalShell"

/** The two follow-graph directions, in tab order. */
const TABS: ReadonlyArray<FollowListTab> = ["followers", "following"]

/**
 * Global follow-list modal: the followers / following lists for one profile,
 * each an infinite-scroll roster of clickable users. Opened via
 * {@link useFollowListOverlayState} (`open({ username, tab })`) from the profile
 * identity column; mounted once in `ModalContainer`.
 *
 * Self-contained: reads the target username + initial tab from the overlay
 * context, drives a `useSWRInfinite` hook per direction (only the active tab
 * fetches), and navigates to a user's profile on click (closing the modal).
 */
export const FollowListModal = ({ className }: WithClassNames<undefined>) => {
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
    const isInitialLoading = active.isLoading && items.length === 0

    const counts: Record<FollowListTab, number> = {
        followers: profile?.followerCount ?? 0,
        following: profile?.followingCount ?? 0,
    }

    /** Go to a user's profile and close the modal. */
    const onOpenUser = (userName: string) => {
        router.push(pathConfig().locale(locale).profile(userName).build())
        setOpen(false)
    }

    return (
        <ModalShell
            isOpen={isOpen}
            onOpenChange={setOpen}
            className={className}
            size="sm"
            bodyStartsWithTabs
            header={(
                <Typography type="body" weight="semibold">
                    {t("followList.title")}
                </Typography>
            )}
        >
            {/* Tabs ↔ list-below = 2 different-function zones (nav vs content) →
                gap-6, not gap-3 (fe/foundations/gap.md's between-block rule). */}
            <div className="flex flex-col gap-6">
                <Tabs
                    variant="secondary"
                    selectedKey={tab}
                    onSelectionChange={(key) => setTab(String(key) as FollowListTab)}
                    className="extended-tabs"
                >
                    <Tabs.ListContainer>
                        <Tabs.List aria-label={t("followList.title")}>
                            {TABS.map((tabId) => (
                                <Tabs.Tab key={tabId} id={tabId}>
                                    <span className="flex items-center gap-2">
                                        {t(`profile.${tabId}`)}
                                        <span className="tabular-nums text-muted">
                                            {counts[tabId]}
                                        </span>
                                    </span>
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>
                    </Tabs.ListContainer>
                </Tabs>

                <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto">
                    <AsyncContent
                        isLoading={isInitialLoading}
                        skeleton={(
                            <div className="flex flex-col gap-2">
                                {[0, 1, 2, 3, 4].map((row) => (
                                    <Skeleton.UserCell key={row} className="p-2" />
                                ))}
                            </div>
                        )}
                        isEmpty={items.length === 0}
                        emptyContent={{
                            title: t(`followList.empty.${tab}`),
                        }}
                        error={active.error}
                        errorContent={{
                            title: t("publicProfile.loadError"),
                            onRetry: () => active.mutate(),
                            retryLabel: t("publicProfile.loadErrorRetry"),
                        }}
                    >
                        {items.map((follow) => (
                            <button
                                key={follow.globalId}
                                type="button"
                                onClick={() => onOpenUser(follow.username)}
                                className="rounded-large p-2 text-left transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                            >
                                <UserCell
                                    username={follow.username}
                                    displayName={follow.displayName ?? follow.username}
                                    avatar={follow.avatar}
                                    handle={`@${follow.username}`}
                                />
                            </button>
                        ))}
                        {/* grow the list as the sentinel scrolls into view */}
                        <InfiniteScrollSentinel
                            onReach={() => active.setSize((size) => size + 1)}
                            disabled={!hasMore || active.isValidating}
                        />
                    </AsyncContent>
                </div>
            </div>
        </ModalShell>
    )
}
