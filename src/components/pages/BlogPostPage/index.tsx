"use client"

import React from "react"
import { useLocale, useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { useQueryBlogPostSwr } from "@/hooks/swr/api/graphql/queries/useQueryBlogPostSwr"
import { CATEGORY_COLOR } from "@/modules/utils/blog-category"
import { _BlogPostPage, type BlogPostLabels } from "./component"

/**
 * Public `/blog/[slug]` article — the CONNECTED half: reads the slug from the route, fetches the
 * article via SWR, resolves every label (incl. interpolation) and the locale-formatted publish date,
 * and hands them to the presentational {@link _BlogPostPage}. See `tiers/split.md`.
 */
export const BlogPostPage = () => {
    const t = useTranslations("blog")
    const locale = useLocale()
    // the post slug comes straight from the route segment
    const params = useParams()
    const slug = String(params.slug ?? "")

    // fetch the article; re-keys when the slug changes
    const { data, error, mutate } = useQueryBlogPostSwr(slug)

    // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
    const isSkeleton = !data && !error
    // settled with no matching post
    const isEmpty = !data

    // localized publish-date formatter (long, article style) — only meaningful once the post arrives
    const publishedAt = data
        ? new Date(data.publishedAt).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : ""

    const labels: BlogPostLabels = {
        back: t("back"),
        errorTitle: t("errorTitle"),
        errorHint: t("errorHint"),
        retry: t("retry"),
        notFound: t("notFound"),
        category: data ? t(`categories.${data.category}`) : "",
        premium: t("premium"),
        publishedAt,
        readingMinutes: data?.readingMinutes != null
            ? t("readingMinutes", { minutes: data.readingMinutes })
            : undefined,
        lockedTitle: t("lockedTitle"),
        lockedBody: t("lockedBody"),
        viewSource: t("viewSource"),
        cta: data?.ctaLabel ?? t("ctaDefault"),
    }

    return (
        <_BlogPostPage
            isSkeleton={isSkeleton}
            isEmpty={isEmpty}
            error={error}
            onRetry={() => {
                void mutate()
            }}
            title={data?.title}
            category={data?.category}
            categoryTone={data ? CATEGORY_COLOR[data.category] : undefined}
            isPremium={data?.isPremium}
            coverImageUrl={data?.coverImageUrl}
            body={data?.body}
            isLocked={data?.isLocked}
            sourceUrl={data?.sourceUrl}
            ctaUrl={data?.ctaUrl}
            slug={data?.slug}
            labels={labels}
        />
    )
}
