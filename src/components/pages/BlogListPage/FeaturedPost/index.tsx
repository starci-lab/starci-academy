"use client"

import React from "react"
import { Chip } from "@heroui/react"
import { useTranslations } from "next-intl"
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
            <StackV gap={4} principle="content-row" items={[
                // eyebrow: pillar chip · "latest" · optional premium
                () => (
                    <Cluster gap={3} principle="chip-row" items={[
                        () => (
                            <Chip size="sm" variant="soft" color={CATEGORY_COLOR[post.category]}>
                                {t(`categories.${post.category}`)}
                            </Chip>
                        ),
                        () => (
                            <span className="text-xs font-medium text-accent-soft-foreground">
                                {t("latest")}
                            </span>
                        ),
                        ...(post.isPremium ? [() => (
                            <Chip size="sm" variant="soft" color="warning">
                                {t("premium")}
                            </Chip>
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
                    <StackH gap={3} principle="identity" align="center" items={[
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
