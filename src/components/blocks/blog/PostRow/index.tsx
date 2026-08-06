"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Chip } from "@/components/atoms/chips/Chip"
import { StackH, StackV } from "@/components/frames/Stack"
import { Link } from "@/i18n/navigation"
import { type QueryBlogPostListItem } from "@/modules/api/graphql/queries/types/blog"

/** Props for {@link PostRow}. */
export interface PostRowProps {
    /** The list-item post to render. */
    post: QueryBlogPostListItem
    /** Localized, preformatted publish date (the caller owns locale formatting). */
    formattedDate: string
}

/**
 * One text-first blog row for the listing / related strips. Whole row is a link
 * (`group`); the title underlines on hover while the meta line stays muted. No
 * cover dependency — typography carries the row.
 */
export const PostRow = ({ post, formattedDate }: PostRowProps) => {
    const t = useTranslations("blog")
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group cursor-pointer border-b border-default py-4 last:border-b-0"
        >
            <StackV
                gap={2}
                principle="title-subtitle"
                explain="Title over excerpt/meta — not label-field (no form control), not name-handle (not an identity pair), not icon-text (no leading icon)."
                items={[
                    () => (
                        <h3 className="text-lg font-semibold text-foreground underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">
                            {post.title}
                        </h3>
                    ),
                    () => (post.excerpt ? (
                        <p className="line-clamp-2 text-sm text-muted">{post.excerpt}</p>
                    ) : null),
                    () => (
                        <StackH
                            gap={2}
                            principle="separator-dot"
                            explain="Places a middle-dot separator between short meta peers so category, date, and reading time read as one inline list."
                            align="center"
                            items={[
                                () => (
                                    <span className="text-xs text-accent-soft-foreground">
                                        {t(`categories.${post.category}`)}
                                    </span>
                                ),
                                () => <span aria-hidden className="text-xs text-muted">·</span>,
                                () => <span className="text-xs text-muted">{formattedDate}</span>,
                                ...(post.readingMinutes != null
                                    ? [
                                        () => <span aria-hidden className="text-xs text-muted">·</span>,
                                        () => {
                                            const minutes = post.readingMinutes as number
                                            return (
                                                <span className="text-xs text-muted">
                                                    {t("readingMinutes", { minutes })}
                                                </span>
                                            )
                                        },
                                    ]
                                    : []),
                                ...(post.isPremium
                                    ? [() => <Chip tone="warning" text={t("premium")} />]
                                    : []),
                            ]}
                        />
                    ),
                ]}
            />
        </Link>
    )
}
