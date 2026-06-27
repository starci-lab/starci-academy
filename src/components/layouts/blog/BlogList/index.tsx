"use client"

import React, { useState } from "react"
import useSWR from "swr"
import { Button } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { CategoryFilter } from "./CategoryFilter"
import { FeaturedPost } from "./FeaturedPost"
import { PostRow } from "../shared/PostRow"
import { BlogListSkeleton } from "./BlogListSkeleton"
import { queryBlogPosts } from "@/modules/api/graphql/queries/query-blog-posts"
import { BlogCategory } from "@/modules/api/graphql/queries/types/blog"

/** Posts fetched per page / "load more" step (mirrors the backend default). */
const PAGE_SIZE = 12

/**
 * Public `/blog` listing (Direction C — featured lead + typographic list).
 *
 * Fetches published posts via SWR (re-keyed by the active pillar + grown limit),
 * then renders an editorial lead (newest post) above a text-first list with
 * load-more pagination. Cover images are used only when present — the layout is
 * built for the coverless reality of the content.
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
    const [featured, ...rest] = posts
    // a full page came back → there may be more to load
    const hasMore = posts.length >= limit

    // switching pillar resets pagination back to the first page
    const changeCategory = (next: BlogCategory | null) => {
        setCategory(next)
        setLimit(PAGE_SIZE)
    }

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
            {/* zone A — identity */}
            <PageHeader title={t("title")} description={t("subtitle")} />

            {/* zone B — browse (filter + results, one cohesive cluster) */}
            <div className="flex flex-col gap-3">
                <CategoryFilter value={category} onChange={changeCategory} />

                <AsyncContent
                    isLoading={isLoading && posts.length === 0}
                    skeleton={<BlogListSkeleton />}
                    error={error}
                    errorContent={{
                        title: t("errorTitle"),
                        description: t("errorHint"),
                        onRetry: () => {
                            void mutate()
                        },
                        retryLabel: t("retry"),
                    }}
                    isEmpty={posts.length === 0}
                    emptyContent={
                        category
                            ? {
                                title: t("emptyInFilter"),
                                description: t("emptyInFilterHint"),
                                onRetry: () => changeCategory(null),
                                retryLabel: t("clearFilter"),
                            }
                            : {
                                title: t("empty"),
                                description: t("emptyHint"),
                            }
                    }
                >
                    <div className="flex flex-col gap-3">
                        {featured && (
                            <FeaturedPost
                                post={featured}
                                formattedDate={formatDate(featured.publishedAt)}
                            />
                        )}
                        {rest.length > 0 && (
                            <div className="flex flex-col">
                                {rest.map((post) => (
                                    <PostRow
                                        key={post.id}
                                        post={post}
                                        formattedDate={formatDate(post.publishedAt)}
                                    />
                                ))}
                            </div>
                        )}
                        {hasMore && (
                            <div className="flex justify-center pt-2">
                                <Button
                                    variant="secondary"
                                    size="md"
                                    isPending={isValidating}
                                    onPress={() => setLimit((current) => current + PAGE_SIZE)}
                                >
                                    {t("loadMore")}
                                </Button>
                            </div>
                        )}
                    </div>
                </AsyncContent>
            </div>
        </div>
    )
}
