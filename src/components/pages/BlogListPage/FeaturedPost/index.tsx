"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Chip } from "@/components/atoms/chips/Chip"
import { Link } from "@/i18n/navigation"
import { CATEGORY_COLOR } from "@/modules/utils/blog-category"
import { type QueryBlogPostListItem } from "@/modules/api/graphql/queries/types/blog"
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"

/** Props for {@link FeaturedPost}. */
export interface FeaturedPostProps {
    /** The newest post, given the editorial-lead treatment. */
    post: QueryBlogPostListItem
    /** Localized, preformatted publish date (the caller owns locale formatting). */
    formattedDate: string
}

/**
 * The editorial lead — the newest post rendered flat (no card) with a serif
 * display title so it anchors the page even when only a few posts exist. The
 * cover is shown only when present (most posts have none → typography leads).
 */
export const FeaturedPost = ({ post, formattedDate }: FeaturedPostProps) => {
    const t = useTranslations("blog")
    const readingMinutes = post.readingMinutes
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group cursor-pointer border-b border-default pb-6"
        >
            <StackV gap={4} principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                items={[
                // eyebrow: pillar chip · "latest" · optional premium
                    () => (
                        <Cluster gap={3} principle="chip-row"
                            explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                            items={[
                                () => (
                                    <Chip tone={CATEGORY_COLOR[post.category]} text={t(`categories.${post.category}`)} />
                                ),
                                () => (
                                    <span className="text-xs font-medium text-accent-soft-foreground">
                                        {t("latest")}
                                    </span>
                                ),
                                ...(post.isPremium ? [() => (
                                    <Chip tone="warning" text={t("premium")} />
                                )] : []),
                            ]} />
                    ),

                    // optional cover — only when the post actually has one
                    () => (post.coverImageUrl ? (
                        <img
                            src={post.coverImageUrl}
                            alt=""
                            className="aspect-[16/9] w-full rounded-large object-cover"
                        />
                    ) : null),

                    // serif display title — the page's visual hero
                    () => (
                        <h2 className="text-3xl font-semibold leading-tight text-foreground underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">
                            {post.title}
                        </h2>
                    ),
                    () => (post.excerpt ? <p className="text-base text-muted">{post.excerpt}</p> : null),

                    () => (
                        <StackH gap={3} principle="identity" align="center"
                            explain="Keeps avatar and identity text as one peer unit so the person label stays beside the face."
                            items={[
                                () => <span className="text-sm text-muted">{formattedDate}</span>,
                                ...(readingMinutes != null ? [
                                    () => <span aria-hidden className="text-sm text-muted">·</span>,
                                    () => <span className="text-sm text-muted">{t("readingMinutes", { minutes: readingMinutes })}</span>,
                                ] : []),
                            ]} />
                    ),
                ]} />
        </Link>
    )
}
