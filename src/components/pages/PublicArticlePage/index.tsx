"use client"

import React from "react"
import { Typography } from "@heroui/react"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import type { ContentEntity } from "@/modules/types/entities/content"
import { Box } from "@/components/frames/Box"
import { StackV } from "@/components/frames/Stack"

/** Props for {@link PublicArticlePage}. */
export interface PublicArticleProps {
    /** The public content to render (fetched server-side by the route). */
    content: ContentEntity
}

/**
 * Server-rendered public article for `/contents/[id]` — the lesson title as a real
 * `<h1>`, its description, then the markdown body rendered into HTML on the server
 * so crawlers + social unfurls receive the full content (interactive bits in the
 * body hydrate on the client). A Server Component: no store / fetching, the route
 * fetches the content and passes it in.
 *
 * @param props - {@link PublicArticleProps}
 */
export const PublicArticlePage = ({ content }: PublicArticleProps) => (
    <Box as="article" principle="center-measure" className="mx-auto max-w-4xl p-6"
        explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport.">
        <StackV gap={4} principle="content-row"
            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
            items={[
                () => (
                    <Typography.Heading level={1} weight="bold">
                        {content.title}
                    </Typography.Heading>
                ),
                () => (content.description ? (
                    <Typography type="body" color="muted">
                        {content.description}
                    </Typography>
                ) : null),
                () => <div className="h-3" />,
                () => <MarkdownContent markdown={content.body || ""} />,
            ]} />
    </Box>
)
