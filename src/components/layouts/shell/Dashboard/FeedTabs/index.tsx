"use client"

import React, {
    useMemo,
    useState,
} from "react"
import {
    Bars as AllIcon,
    BookOpen as CourseIcon,
    Medal as AchievementIcon,
    Persons as SocialIcon,
} from "@gravity-ui/icons"
import {
    Skeleton,
    Tabs,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    Feed,
} from "../Feed"
import {
    TrendingContents,
} from "../TrendingContents"
import {
    useQueryMyFeedSwr,
} from "@/hooks"
import {
    MyFeedTab,
    MyFeedCategory,
} from "@/modules/api"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link FeedTabs}. */
export type FeedTabsProps = WithClassNames<undefined>

/**
 * Twitter/GitHub-style feed tabs: "For you" (recommended, default — never empty
 * without follows) and "Following". Each tab **fetches its own cursor-paginated
 * feed** (`myFeed`) with infinite "load more" — independent of the dashboard rail.
 * `"use client"` for tab state + SWR.
 * @param props - optional className for the root element
 */
export const FeedTabs = ({
    className,
}: FeedTabsProps = {}) => {
    const t = useTranslations()
    const [tab, setTab] = useState<MyFeedTab>(MyFeedTab.ForYou)
    /** Active filter chip — narrows the feed to a slice of activity types. */
    const [category, setCategory] = useState<MyFeedCategory>(MyFeedCategory.All)

    // cursor-paginated feed for the active tab + filter (array of pages)
    const {
        data: pages,
        size,
        setSize,
        isLoading,
        isValidating,
    } = useQueryMyFeedSwr(tab,
        category)

    /** Filter chips shown above the feed. */
    const filters = useMemo(
        () => [
            {
                key: MyFeedCategory.All,
                label: t("dashboard.feedFilter.all"),
                Icon: AllIcon,
            },
            {
                key: MyFeedCategory.Courses,
                label: t("dashboard.feedFilter.courses"),
                Icon: CourseIcon,
            },
            {
                key: MyFeedCategory.Achievements,
                label: t("dashboard.feedFilter.achievements"),
                Icon: AchievementIcon,
            },
            {
                key: MyFeedCategory.People,
                label: t("dashboard.feedFilter.people"),
                Icon: SocialIcon,
            },
        ],
        [
            t,
        ],
    )

    // flatten pages → one list
    const items = useMemo(
        () => (pages ?? []).flatMap((page) => page.items),
        [
            pages,
        ],
    )
    // more pages exist while the last loaded page still has a next cursor
    const hasMore = Boolean(pages?.[pages.length - 1]?.nextCursor)
    // loading the next page (size grew but that page isn't back yet)
    const isLoadingMore = isValidating && (pages?.length ?? 0) < size

    return (
        <div className={cn("flex flex-col", className)}>
            <Tabs
                selectedKey={tab}
                className="mt-1.5"
                variant="secondary"
                onSelectionChange={(key) => setTab(String(key) as MyFeedTab)}
            >
                <Tabs.ListContainer>
                    <Tabs.List aria-label={t("dashboard.feedTabsAria")}>
                        <Tabs.Tab
                            key={MyFeedTab.ForYou}
                            id={MyFeedTab.ForYou}
                            className="rounded-none text-foreground data-[selected=true]:border-b-2 data-[selected=true]:border-foreground"
                        >
                            {t("dashboard.tabs.forYou")}
                        </Tabs.Tab>
                        <Tabs.Tab
                            key={MyFeedTab.Following}
                            id={MyFeedTab.Following}
                            className="rounded-none text-foreground data-[selected=true]:border-b-2 data-[selected=true]:border-foreground"
                        >
                            {t("dashboard.tabs.following")}
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>
            </Tabs>

            {/* discovery — only on the recommendation tab, so the explore stream
                opens with what's trending before the social feed */}
            {tab === MyFeedTab.ForYou ? (
                <TrendingContents className="mx-3 mt-3" />
            ) : null}

            {/* filter tabs — narrow the feed to a slice (courses / achievements / people) */}
            <Tabs
                selectedKey={category}
                className="px-3 pt-3"
                variant="secondary"
                onSelectionChange={(key) => setCategory(String(key) as MyFeedCategory)}
            >
                <Tabs.ListContainer>
                    <Tabs.List aria-label={t("dashboard.feedTabsAria")}>
                        {filters.map((filter) => (
                            <Tabs.Tab
                                key={filter.key}
                                id={filter.key}
                                className="rounded-none text-foreground data-[selected=true]:border-b-2 data-[selected=true]:border-foreground"
                            >
                                <span className="flex items-center gap-1.5">
                                    <filter.Icon className="size-4 shrink-0" />
                                    {filter.label}
                                </span>
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </Tabs.ListContainer>
            </Tabs>

            <div className="p-3">
                {/* skeleton on first load so the empty-state text never flashes
                    before the feed arrives; Feed shows "no activity" only once loaded */}
                {isLoading && items.length === 0 ? (
                    <div className="flex flex-col gap-3">
                        {Array.from({
                            length: 5,
                        }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="h-12 w-full rounded-medium"
                            />
                        ))}
                    </div>
                ) : (
                    <Feed items={items} />
                )}
                {/* infinite "load more" — a text link that fetches the next cursor page */}
                {hasMore ? (
                    <div className="flex justify-center pt-4">
                        <button
                            type="button"
                            disabled={isLoading || isLoadingMore}
                            onClick={() => setSize(size + 1)}
                            className="text-sm font-medium text-foreground hover:underline disabled:opacity-60"
                        >
                            {t("dashboard.loadMore")}
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
