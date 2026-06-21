"use client"

import React, { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, Chip, Spinner } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
    queryBlogPosts,
    BlogCategory,
    type QueryBlogPostListItem,
} from "@/modules/api/graphql"

/** Category filter options (null = all). */
const CATEGORY_FILTERS: Array<BlogCategory | null> = [
    null,
    BlogCategory.Codebase,
    BlogCategory.DeepDive,
    BlogCategory.BuildInPublic,
    BlogCategory.Career,
    BlogCategory.Ai,
    BlogCategory.CaseStudy,
]

/** HeroUI Chip color per editorial pillar. */
const CATEGORY_COLOR: Record<BlogCategory, "accent" | "success" | "warning" | "danger" | "default"> = {
    [BlogCategory.Codebase]: "accent",
    [BlogCategory.DeepDive]: "accent",
    [BlogCategory.BuildInPublic]: "danger",
    [BlogCategory.Career]: "success",
    [BlogCategory.Ai]: "warning",
    [BlogCategory.CaseStudy]: "default",
}

/**
 * Public `/blog` listing. Client component: fetches published posts via SWR
 * (re-keyed by the active category filter) and renders a responsive card grid.
 * Body is not fetched here — each card links to the `/blog/[slug]` article.
 */
export const BlogList = () => {
    const t = useTranslations("blog")
    const locale = useLocale()
    // active editorial-pillar filter (null = all)
    const [category, setCategory] = useState<BlogCategory | null>(null)

    // fetch the post page; re-keys when the category filter changes
    const { data, isLoading } = useSWR(
        ["blog-posts", category],
        async () => {
            const response = await queryBlogPosts({
                request: {
                    ...(category ? { category } : {}),
                    limit: 24,
                    offset: 0,
                },
            })
            return response.data?.blogPosts.data ?? null
        },
    )

    // localized publish-date formatter (short, calendar style)
    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
        })

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
            {/* ── header ── */}
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold">{t("title")}</h1>
                <p className="text-sm text-muted">{t("subtitle")}</p>
            </div>

            {/* ── category filter chips ── */}
            <div className="flex flex-wrap items-center gap-1.5">
                {CATEGORY_FILTERS.map((filter) => {
                    const selected = filter === category
                    return (
                        <button
                            key={filter ?? "all"}
                            type="button"
                            onClick={() => setCategory(filter)}
                            aria-pressed={selected}
                        >
                            <Chip
                                size="md"
                                variant={selected ? "primary" : "soft"}
                                color={filter ? CATEGORY_COLOR[filter] : "accent"}
                            >
                                {filter ? t(`categories.${filter}`) : t("categories.all")}
                            </Chip>
                        </button>
                    )
                })}
            </div>

            {/* ── loading / empty / grid ── */}
            {(isLoading || !data) && (
                <div className="flex items-center justify-center gap-1.5 py-10 text-muted">
                    <Spinner size="sm" />
                    <span className="text-sm">{t("loading")}</span>
                </div>
            )}

            {!isLoading && !!data && data.length === 0 && (
                <Card className="w-full">
                    <CardContent className="flex flex-col items-center gap-1.5 py-10 text-center">
                        <p className="font-medium">{t("empty")}</p>
                        <p className="text-sm text-muted">{t("emptyHint")}</p>
                    </CardContent>
                </Card>
            )}

            {!isLoading && !!data && data.length > 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {data.map((post: QueryBlogPostListItem) => (
                        <Link key={post.id} href={`/blog/${post.slug}`}>
                            <Card className="h-full w-full transition-colors hover:bg-surface-secondary">
                                {/* cover image (optional) */}
                                {post.coverImageUrl && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={post.coverImageUrl}
                                        alt=""
                                        className="aspect-[16/9] w-full rounded-t-large object-cover"
                                    />
                                )}
                                <CardContent className="flex flex-col gap-3">
                                    {/* category + premium chips */}
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <Chip size="sm" variant="soft" color={CATEGORY_COLOR[post.category]}>
                                            {t(`categories.${post.category}`)}
                                        </Chip>
                                        {post.isPremium && (
                                            <Chip size="sm" variant="soft" color="warning">
                                                {t("premium")}
                                            </Chip>
                                        )}
                                    </div>
                                    {/* title + excerpt */}
                                    <div className="flex flex-col gap-1.5">
                                        <h2 className="line-clamp-2 text-lg font-semibold">{post.title}</h2>
                                        {post.excerpt && (
                                            <p className="line-clamp-3 text-sm text-muted">{post.excerpt}</p>
                                        )}
                                    </div>
                                    {/* meta: reading time · date */}
                                    <div className="flex items-center gap-1.5 text-xs text-muted">
                                        {post.readingMinutes && (
                                            <span>{t("readingMinutes", { minutes: post.readingMinutes })}</span>
                                        )}
                                        {post.readingMinutes && <span>·</span>}
                                        <span>{formatDate(post.publishedAt)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
