"use client"

import React, {
    useCallback,
    useMemo,
    useState,
} from "react"
import {
    Button,
    Tabs,
    cn,
} from "@heroui/react"
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
    ActivityFeed,
    AsyncContent,
    ExtendedTabs,
    Skeleton,
} from "@/components/blocks"
import {
    TrendingContents,
} from "../TrendingContents"
import {
    useQueryMyFeedSwr,
    useMutateReactActivitySwr,
} from "@/hooks"
import {
    MyFeedTab,
    MyFeedCategory,
    queryResolveRoute,
} from "@/modules/api"
import type {
    ReactionType,
} from "@/modules/api"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link FeedTabs}. */
export type FeedTabsProps = WithClassNames<undefined>

/**
 * Explore feed cockpit: ONE tab strip for the audience SCOPE ("Khám phá / For you"
 * vs "Đang theo dõi / Following") — each scope fetches its own cursor-paginated
 * `myFeed` — plus a lightweight single-select CHIP row for the category filter
 * (all / courses / achievements / people). Both axes are just `myFeed` params, so
 * the second tab layer is gone (flatter, less clumsy). The stream itself renders
 * through the shared {@link ActivityFeed} block, identical to the profile Activity
 * timeline. `"use client"` for tab/filter state + SWR + route resolution.
 *
 * @param props - optional className for the root element
 */
export const FeedTabs = ({
    className,
}: FeedTabsProps = {}) => {
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

    /** Single-select category filter chips shown under the scope tabs. */
    const filters = useMemo(
        () => [
            { key: MyFeedCategory.All, label: t("dashboard.feedFilter.all"), Icon: ListBulletsIcon },
            { key: MyFeedCategory.Courses, label: t("dashboard.feedFilter.courses"), Icon: BookOpenIcon },
            { key: MyFeedCategory.Achievements, label: t("dashboard.feedFilter.achievements"), Icon: MedalIcon },
            { key: MyFeedCategory.People, label: t("dashboard.feedFilter.people"), Icon: UsersIcon },
        ],
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
        <div className={cn("flex flex-col gap-3", className)}>
            {/* scope — the only tab layer (audience), block-styled underline */}
            <ExtendedTabs
                selectedKey={tab}
                onSelectionChange={(key) => setTab(key as MyFeedTab)}
            >
                <Tabs.ListContainer>
                    <Tabs.List aria-label={t("dashboard.feedTabsAria")}>
                        <Tabs.Tab key={MyFeedTab.ForYou} id={MyFeedTab.ForYou}>
                            {t("dashboard.tabs.forYou")}
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab key={MyFeedTab.Following} id={MyFeedTab.Following}>
                            {t("dashboard.tabs.following")}
                            <Tabs.Indicator />
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>
            </ExtendedTabs>

            {/* discovery — only on the recommendation scope, so the stream opens with
                what's trending before the social feed */}
            {tab === MyFeedTab.ForYou ? <TrendingContents /> : null}

            {/* category filter — a single-select chip row, NOT a second tab layer */}
            <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label={t("dashboard.feedTabsAria")}
            >
                {filters.map((filter) => (
                    <Button
                        key={filter.key}
                        size="sm"
                        variant={category === filter.key ? "secondary" : "ghost"}
                        aria-pressed={category === filter.key}
                        onPress={() => setCategory(filter.key)}
                    >
                        <filter.Icon aria-hidden focusable="false" className="size-5 shrink-0" />
                        {filter.label}
                    </Button>
                ))}
            </div>

            <AsyncContent
                isLoading={isLoading && items.length === 0}
                skeleton={(
                    <div className="flex flex-col gap-6">
                        {[0, 1].map((group) => (
                            <div key={group} className="flex flex-col gap-3">
                                <Skeleton.Typography type="body-xs" width="1/4" />
                                {[0, 1, 2].map((row) => (
                                    <div key={row} className="flex items-start gap-2">
                                        <Skeleton className="size-9 shrink-0 rounded-full" />
                                        <div className="flex flex-1 flex-col gap-0">
                                            <Skeleton.Typography type="body-sm" width="3/4" />
                                            <Skeleton.Typography type="body-xs" width="1/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
                isEmpty={items.length === 0}
                emptyContent={{
                    title: t("dashboard.feedEmpty"),
                }}
                error={items.length === 0 ? error : undefined}
                errorContent={{
                    title: t("dashboard.feedError"),
                    onRetry: () => { void mutate() },
                    retryLabel: t("dashboard.feedRetry"),
                }}
            >
                <div className="flex flex-col gap-6">
                    <ActivityFeed items={items} onResolve={onResolve} onReact={onReact} />
                    {hasMore ? (
                        <div className="flex justify-center">
                            <Button
                                variant="secondary"
                                size="sm"
                                isPending={isLoadingMore}
                                onPress={() => setSize(size + 1)}
                            >
                                {t("dashboard.loadMore")}
                            </Button>
                        </div>
                    ) : null}
                </div>
            </AsyncContent>
        </div>
    )
}
