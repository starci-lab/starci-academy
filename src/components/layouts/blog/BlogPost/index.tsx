"use client"

import React from "react"
import useSWR from "swr"
import { Button, Card, CardContent, Chip, Spinner } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { queryBlogPost } from "@/modules/api/graphql"

/**
 * Public `/blog/[slug]` article. Client component: reads the slug from the
 * route, fetches the article via SWR, and renders the cover, meta, markdown
 * body, an optional funnel CTA, and a members-only notice when the body was
 * gated server-side (`isLocked`).
 */
export const BlogPost = () => {
    const t = useTranslations("blog")
    const locale = useLocale()
    // the post slug comes straight from the route segment
    const params = useParams()
    const slug = String(params.slug ?? "")

    // fetch the article; re-keys when the slug changes
    const { data, isLoading } = useSWR(
        ["blog-post", slug],
        async () => {
            const response = await queryBlogPost({ request: { slug } })
            return response.data?.blogPost.data ?? null
        },
    )

    // localized publish-date formatter (long, article style)
    const publishedAt = data
        ? new Date(data.publishedAt).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : ""

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
            {/* ── back to listing ── */}
            <Link href="/blog" className="text-sm text-muted hover:text-foreground">
                ← {t("back")}
            </Link>

            {/* loading */}
            {isLoading && (
                <div className="flex items-center justify-center gap-1.5 py-10 text-muted">
                    <Spinner size="sm" />
                    <span className="text-sm">{t("loading")}</span>
                </div>
            )}

            {/* not found */}
            {!isLoading && !data && (
                <Card className="w-full">
                    <CardContent className="flex flex-col items-center gap-1.5 py-10 text-center">
                        <p className="font-medium">{t("notFound")}</p>
                    </CardContent>
                </Card>
            )}

            {/* article */}
            {!isLoading && data && (
                <article className="flex flex-col gap-6">
                    {/* header: chips, title, meta */}
                    <header className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <Chip size="sm" variant="soft" color="accent">
                                {t(`categories.${data.category}`)}
                            </Chip>
                            {data.isPremium && (
                                <Chip size="sm" variant="soft" color="warning">
                                    {t("premium")}
                                </Chip>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold leading-tight">{data.title}</h1>
                        <div className="flex items-center gap-1.5 text-sm text-muted">
                            <span>{publishedAt}</span>
                            {data.readingMinutes && <span>·</span>}
                            {data.readingMinutes && (
                                <span>{t("readingMinutes", { minutes: data.readingMinutes })}</span>
                            )}
                        </div>
                    </header>

                    {/* cover image (optional) */}
                    {data.coverImageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={data.coverImageUrl}
                            alt=""
                            className="aspect-[16/9] w-full rounded-large object-cover"
                        />
                    )}

                    {/* body (markdown) */}
                    <MarkdownContent markdown={data.body} />

                    {/* members-only notice when the body was gated server-side */}
                    {data.isLocked && (
                        <Card className="w-full border border-warning/40">
                            <CardContent className="flex flex-col items-center gap-1.5 py-8 text-center">
                                <p className="font-semibold">{t("lockedTitle")}</p>
                                <p className="text-sm text-muted">{t("lockedBody")}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* "View on GitHub" — external source link for codebase posts */}
                    {data.sourceUrl && (
                        <a href={data.sourceUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="lg" className="w-full">
                                {t("viewSource")}
                            </Button>
                        </a>
                    )}

                    {/* funnel CTA (optional) — links to the related course */}
                    {data.ctaUrl && (
                        <Link href={data.ctaUrl}>
                            <Button variant="primary" size="lg" className="w-full">
                                {data.ctaLabel ?? t("ctaDefault")}
                            </Button>
                        </Link>
                    )}
                </article>
            )}
        </div>
    )
}
