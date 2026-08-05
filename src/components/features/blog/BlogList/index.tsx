"use client"

import React, { useMemo, useState } from "react"
import useSWR from "swr"
import { useLocale, useTranslations } from "next-intl"
import { _BlogList } from "./component"
import { queryBlogPosts } from "@/modules/api/graphql/queries/query-blog-posts"
import { BlogCategory } from "@/modules/api/graphql/queries/types/blog"

/** Posts fetched per page / "load more" step (mirrors the backend default). */
const PAGE_SIZE = 12

/** Slug of the pinned "start here" entry point (the backend monorepo tour). */
const START_HERE_SLUG = "start-here-monorepo-tour"

/**
 * Public `/blog` — the CONNECTED half: it fetches the page of posts, derives pagination and
 * the pillar-filter state, formats every date for the current locale, and resolves every
 * label, handing them to the presentational {@link _BlogList}. See `tiers/split.md`.
 *
 * Reframed as StarCi's engineering publication ("the backend, taken apart"): an operational
 * 3D infra masthead → reframed header → a real-subsystem topics strip → a pinned "start here"
 * anchor → editorial lead → text-first list. The pillar filter only appears once more than one
 * pillar actually has posts (today every post is a `codebase` deep-dive, so it stays hidden —
 * no dead buckets). Cover images are used only when present.
 */
export const BlogList = () => {
    const t = useTranslations("blog")
    const locale = useLocale()
    // active editorial-pillar filter (null = all)
    const [category, setCategory] = useState<BlogCategory | null>(null)
    // grows by PAGE_SIZE on "load more"; reset when the filter changes
    const [limit, setLimit] = useState(PAGE_SIZE)

    // keepPreviousData → old posts stay visible while the next page/filter loads,
    // so the skeleton only ever shows on the very first paint
    const { data, isLoading, isValidating, error, mutate } = useSWR(
        ["blog-posts", category, limit],
        async () => {
            const response = await queryBlogPosts({
                request: { ...(category ? { category } : {}), limit, offset: 0 },
            })
            return response.data?.blogPosts.data ?? []
        },
        { keepPreviousData: true },
    )

    // localized publish-date formatter (short, calendar style)
    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
        })

    const posts = data ?? []

    // pin the "start here" tour only on the unfiltered view, and drop it from the
    // chronological flow so it isn't shown twice
    const pinned = category === null ? posts.find((post) => post.slug === START_HERE_SLUG) ?? null : null
    const flow = pinned ? posts.filter((post) => post.slug !== pinned.slug) : posts
    const [featured, ...rest] = flow
    const restItems = rest.map((post) => ({ post, formattedDate: formatDate(post.publishedAt) }))

    // a full page came back → there may be more to load
    const hasMore = posts.length >= limit

    // only the pillars that actually have posts — never render a filter into an empty
    // bucket. With a single pillar present the row is pointless, so the caller hides it.
    const availableCategories = useMemo(
        () => Array.from(new Set(posts.map((post) => post.category))),
        [posts],
    )
    const showFilter = availableCategories.length >= 2

    // switching pillar resets pagination back to the first page
    const changeCategory = (next: BlogCategory | null) => {
        setCategory(next)
        setLimit(PAGE_SIZE)
    }

    return (
        <_BlogList
            // first load, nothing in hand → shimmer (loading-and-skeleton.md's first-load formula)
            isSkeleton={isLoading && posts.length === 0}
            isEmpty={posts.length === 0}
            error={error}
            onRetry={() => {
                void mutate()
            }}
            category={category}
            onChangeCategory={changeCategory}
            availableCategories={availableCategories}
            showFilter={showFilter}
            pinnedPost={pinned}
            featuredPost={featured ?? null}
            featuredFormattedDate={featured ? formatDate(featured.publishedAt) : undefined}
            restPosts={restItems}
            hasMore={hasMore}
            isLoadingMore={isValidating}
            onLoadMore={() => setLimit((current) => current + PAGE_SIZE)}
            labels={{
                title: t("title"),
                subtitle: t("subtitle"),
                errorTitle: t("errorTitle"),
                errorHint: t("errorHint"),
                retry: t("retry"),
                empty: t("empty"),
                emptyHint: t("emptyHint"),
                emptyInFilter: t("emptyInFilter"),
                emptyInFilterHint: t("emptyInFilterHint"),
                clearFilter: t("clearFilter"),
                loadMore: t("loadMore"),
            }}
        />
    )
}
