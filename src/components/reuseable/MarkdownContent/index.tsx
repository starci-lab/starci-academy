"use client"

import React, { useMemo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { buildMarkdownRenderers } from "./map"

// Re-export the colocated sub-renderers so the reuseable barrel surface stays identical.
export * from "./CodeToHtml"
export * from "./MermaidDiagram"

/** Props for {@link MarkdownContent}. */
export interface MarkdownContentProps {
    /** Markdown source string. */
    markdown: string
    /** Extra classes on the prose wrapper. */
    className?: string
}

/**
 * Renders markdown with GFM and shared typography aligned with the app theme.
 *
 * Presentational: reads the active theme/translator and memoizes the element-renderer map
 * (see {@link buildMarkdownRenderers}); no business logic. Marked `"use client"` for the
 * theme hook and client-side markdown rendering.
 * @param props - {@link MarkdownContentProps}
 */
export const MarkdownContent = ({ markdown }: MarkdownContentProps) => {
    const theme = useTheme()
    const t = useTranslations()
    const components = useMemo(
        () => buildMarkdownRenderers({
            isDark: theme.theme === "dark",
            t,
        }),
        [
            theme.theme,
            t,
        ],
    )
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={components}
            passNode
        >
            {markdown}
        </ReactMarkdown>
    )
}
