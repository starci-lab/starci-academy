"use client"

import React, {
    useMemo,
    useState,
} from "react"
import {
    Button,
    Skeleton,
    Tabs,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    Feed,
} from "../Feed"
import {
    useQueryMyFeedSwr,
} from "@/hooks"
import {
    MyFeedTab,
} from "@/modules/api"

/**
 * Twitter/GitHub-style feed tabs: "For you" (recommended, default — never empty
 * without follows) and "Following". Each tab **fetches its own cursor-paginated
 * feed** (`myFeed`) with infinite "load more" — independent of the dashboard rail.
 * `"use client"` for tab state + SWR.
 */
export const FeedTabs = () => {
    const t = useTranslations()
    const [tab, setTab] = useState<MyFeedTab>(MyFeedTab.ForYou)

    // cursor-paginated feed for the active tab (array of pages)
    const {
        data: pages,
        size,
        setSize,
        isLoading,
        isValidating,
    } = useQueryMyFeedSwr(tab)

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
        <div className="flex flex-col">
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
                            className="rounded-none data-[selected=true]:border-b-2 data-[selected=true]:border-accent data-[selected=true]:text-accent"
                        >
                            {t("dashboard.tabs.forYou")}
                        </Tabs.Tab>
                        <Tabs.Tab
                            key={MyFeedTab.Following}
                            id={MyFeedTab.Following}
                            className="rounded-none data-[selected=true]:border-b-2 data-[selected=true]:border-accent data-[selected=true]:text-accent"
                        >
                            {t("dashboard.tabs.following")}
                        </Tabs.Tab>
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
                {/* infinite "load more" — fetches the next cursor page */}
                {hasMore ? (
                    <div className="flex justify-center pt-4">
                        <Button
                            variant="tertiary"
                            isPending={isLoading || isLoadingMore}
                            onPress={() => setSize(size + 1)}
                        >
                            {t("dashboard.loadMore")}
                        </Button>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
