"use client"

import React, {
    useCallback,
    useMemo,
    useState,
} from "react"
import type {
    Key,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    BookOpenIcon,
    ListBulletsIcon,
    MedalIcon,
    UsersIcon,
} from "@phosphor-icons/react"
import {
    _FeedTabs,
} from "./component"
import type {
    TabsCardItem,
} from "@/components/blocks/navigation/TabsCard"
import { useQueryMyFeedSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyFeedSwr"
import { useMutateReactActivitySwr } from "@/hooks/swr/api/graphql/mutations/useMutateReactActivitySwr"
import { MyFeedTab, MyFeedCategory } from "@/modules/api/graphql/queries/types/my-feed"
import { queryResolveRoute } from "@/modules/api/graphql/queries/query-resolve-route"
import type { ReactionType } from "@/modules/api/graphql/queries/types/discussion"

/**
 * Explore feed (ContentBody-style `TabsCard` pattern) — the CONNECTED half: fetches
 * the cursor-paginated feed (SWR), holds the audience-scope + category-filter state,
 * reacts to activities, resolves entity routes, and resolves every label via `t()`,
 * handing them to the presentational {@link _FeedTabs}. See `tiers/split.md`.
 */
export const FeedTabs = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const [tab, setTab] = useState<MyFeedTab>(MyFeedTab.ForYou)
    /** Active filter chip — narrows the feed to a slice of activity types. */
    const [category, setCategory] = useState<MyFeedCategory>(MyFeedCategory.All)

    // cursor-paginated feed for the active scope + filter (array of pages)
    const {
        data: pages,
        size,
        setSize,
        isLoading,
        isValidating,
        error,
        mutate,
    } = useQueryMyFeedSwr(tab, category)
    const { trigger: reactActivity } = useMutateReactActivitySwr()

    /** React to a feed activity, then revalidate so counts/my-reaction refresh. */
    const onReact = useCallback(
        async (activityId: string, type: ReactionType | null) => {
            await reactActivity({ activityId, type })
            await mutate()
        },
        [
            reactActivity,
            mutate,
        ],
    )

    /** Audience-scope tabs (left group). */
    const scopeTabs = useMemo<Array<TabsCardItem>>(
        () => [
            { key: MyFeedTab.ForYou, label: t("dashboard.tabs.forYou") },
            { key: MyFeedTab.Following, label: t("dashboard.tabs.following") },
        ],
        [t],
    )

    /** Single-select category filter chips (right group), shown under the scope tabs. */
    const filterTabs = useMemo<Array<TabsCardItem>>(
        () => [
            { key: MyFeedCategory.All, label: t("dashboard.feedFilter.all"), Icon: ListBulletsIcon },
            { key: MyFeedCategory.Courses, label: t("dashboard.feedFilter.courses"), Icon: BookOpenIcon },
            { key: MyFeedCategory.Achievements, label: t("dashboard.feedFilter.achievements"), Icon: MedalIcon },
            { key: MyFeedCategory.People, label: t("dashboard.feedFilter.people"), Icon: UsersIcon },
        ].map(({ key, label, Icon }) => ({
            key,
            label,
            icon: <Icon aria-hidden focusable="false" className="size-5 shrink-0" />,
        })),
        [t],
    )

    // flatten pages → one newest-first list
    const items = useMemo(
        () => (pages ?? []).flatMap((page) => page.items),
        [pages],
    )
    const hasMore = Boolean(pages?.[pages.length - 1]?.nextCursor)
    const isLoadingMore = isValidating && (pages?.length ?? 0) < size

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

    return (
        <_FeedTabs
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={isLoading && items.length === 0}
            // error beats loading + empty; only a settled fetch error (nothing in hand) reaches the block
            error={items.length === 0 ? error : undefined}
            onRetry={() => { void mutate() }}
            // settled with a resolved page that carries zero items
            isEmpty={items.length === 0}
            isFilteredEmpty={category !== MyFeedCategory.All}
            scopeTabs={scopeTabs}
            selectedScopeKey={tab}
            onScopeChange={(key: Key) => setTab(key as MyFeedTab)}
            filterTabs={filterTabs}
            selectedFilterKey={category}
            onFilterChange={(key: Key) => setCategory(key as MyFeedCategory)}
            onResetFilter={() => setCategory(MyFeedCategory.All)}
            onBrowseCourses={() => router.push(`/${locale}/courses`)}
            items={items}
            onResolve={onResolve}
            onReact={onReact}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={() => setSize(size + 1)}
            // load-more failure (page 2+) doesn't clear existing items — the presentational
            // half shows an inline retry instead of falling back to the full error branch
            hasLoadMoreError={Boolean(error) && items.length > 0}
            labels={{
                scopeTabsAria: t("dashboard.feedTabsAria"),
                filterTabsAria: t("dashboard.feedFilterAria"),
                emptyFilteredTitle: t("dashboard.feedEmptyFiltered.title"),
                emptyFilteredCta: t("dashboard.feedEmptyFiltered.cta"),
                emptyPlatformTitle: t("dashboard.feedEmptyPlatform.title"),
                emptyPlatformDescription: t("dashboard.feedEmptyPlatform.description"),
                emptyPlatformCta: t("dashboard.feedEmptyPlatform.cta"),
                errorTitle: t("dashboard.feedError"),
                retryLabel: t("dashboard.feedRetry"),
                loadMoreLabel: t("dashboard.loadMore"),
            }}
        />
    )
}
