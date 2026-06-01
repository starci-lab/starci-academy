"use client"

import React, { useMemo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkDirective from "remark-directive"
import { cn } from "@heroui/react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { buildMarkdownRenderers } from "./map"

// Re-export the colocated sub-renderers so the reuseable barrel surface stays identical.
export * from "./CodeToHtml"
export * from "./MermaidDiagram"

/**
 * Recursively rewrites `:::muted` directives (container/leaf/text, parsed by `remark-directive`)
 * into custom hast tags the renderer map styles as small muted text. Container/leaf → block-level
 * `mutedblock`; inline `:muted[…]` → `mutedtext`. Directives with any other name are left untouched
 * (and dropped by the hast conversion since they have no handler).
 * @param node - Current mdast node being walked.
 */
const applyMutedDirective = (node: { type?: string, name?: string, data?: Record<string, unknown>, children?: Array<unknown> }): void => {
    if (
        (node.type === "containerDirective" || node.type === "leafDirective" || node.type === "textDirective")
        && node.name === "muted"
    ) {
        const data = node.data || (node.data = {})
        data.hName = node.type === "textDirective" ? "mutedtext" : "mutedblock"
        data.hProperties = {}
    }
    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            applyMutedDirective(child as Parameters<typeof applyMutedDirective>[0])
        }
    }
}

/** remark transformer: turn `:::muted` directives into styled custom tags. */
const remarkMuted = () => (tree: unknown): void => {
    applyMutedDirective(tree as Parameters<typeof applyMutedDirective>[0])
}

// Matches each ```mermaid fence and the figure caption paragraph that follows it.
// Group 1 = diagram source; group 2 = the first non-blank line after the fence.
const MERMAID_CAPTION_REGEX = /```mermaid[ \t]*\r?\n([\s\S]*?)\r?\n```[ \t]*\r?\n+[ \t]*([^\r\n]+)/g

/**
 * Scans markdown for mermaid blocks and pairs each with the caption paragraph that
 * immediately follows it (a line starting with "Hình"/"Figure"), keyed by trimmed source.
 * @param markdown - Raw markdown source.
 * @returns Caption text keyed by trimmed mermaid source.
 */
const extractMermaidCaptions = (markdown: string): Record<string, string> => {
    const captions: Record<string, string> = {}
    // Reset lastIndex defensively since the regex is module-scoped + global.
    MERMAID_CAPTION_REGEX.lastIndex = 0
    for (let match = MERMAID_CAPTION_REGEX.exec(markdown); match; match = MERMAID_CAPTION_REGEX.exec(markdown)) {
        const code = match[1].trim()
        // Strip surrounding italic markers authors wrap captions in (*...*).
        const caption = match[2].trim().replace(/^\*+|\*+$/g, "").trim()
        // Only adopt lines that read as figure captions, not following prose.
        if (/^(Hình|Figure)\b/i.test(caption)) {
            captions[code] = caption
        }
    }
    return captions
}

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
export const MarkdownContent = ({ markdown, className }: MarkdownContentProps) => {
    const theme = useTheme()
    const t = useTranslations()
    const mermaidCaptions = useMemo(() => extractMermaidCaptions(markdown), [markdown])
    const components = useMemo(
        () => buildMarkdownRenderers({
            isDark: theme.theme === "dark",
            t,
            mermaidCaptions,
        }),
        [
            theme.theme,
            t,
            mermaidCaptions,
        ],
    )
    return (
        <div className={cn("min-w-0 space-y-2 text-sm leading-relaxed text-foreground", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkDirective, remarkMuted]}
                components={components}
            >
                {markdown}
            </ReactMarkdown>
        </div>
    )
}
