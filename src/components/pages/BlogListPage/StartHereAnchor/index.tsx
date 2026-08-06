"use client"

import React from "react"
import { MapPinIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { type QueryBlogPostListItem } from "@/modules/api/graphql/queries/types/blog"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"

/** Props for {@link StartHereAnchor}. */
export interface StartHereAnchorProps {
    /** The pinned "start here" post (the monorepo tour) — the reader's entry point. */
    post: QueryBlogPostListItem
}

/**
 * Pinned entry-point anchor — surfaces the "start here" tour above the chronological flow so a
 * new reader knows where to begin. Accent-tinted to read as an invitation, not a regular row.
 */
export const StartHereAnchor = ({ post }: StartHereAnchorProps) => {
    const t = useTranslations("blog")
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group cursor-pointer rounded-2xl border border-accent/40 bg-accent/5 transition-colors hover:bg-accent-soft"
        >
            <Box principle="row-pad" className="px-4 py-3"
                explain="Row content inset — not cell-pad, because this pads a horizontal content row rather than a dense table cell.">
                <StackH gap={4} principle="content-row"
                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                    align="center" items={[
                        () => <MapPinIcon className="size-5 shrink-0 text-accent-soft-foreground" aria-hidden />,
                        () => (
                            <StackV gap={1} principle="name-handle"
                                explain="Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle."
                                items={[
                                    () => <span className="text-xs font-medium text-accent-soft-foreground">{t("startHere")}</span>,
                                    () => (
                                        <span className="text-sm font-semibold text-foreground underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">
                                            {post.title}
                                        </span>
                                    ),
                                ]} />
                        ),
                    ]} />
            </Box>
        </Link>
    )
}
