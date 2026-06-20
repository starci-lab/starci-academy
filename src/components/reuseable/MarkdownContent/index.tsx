"use client"

import React, { useMemo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkDirective from "remark-directive"
import { cn } from "@heroui/react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types"
import { buildMarkdownRenderers } from "./map"

// Re-export the colocated sub-renderers so the reuseable barrel surface stays identical.
export * from "./CodeToHtml"
export * from "./LayoutWidget"
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

/**
 * Recursively rewrites the `:::tab` / `:::code` / `:::preview` container directives into custom hast
 * tags the renderer map turns into a [Preview|Code] tabs block (see TabsBlock): `tab`→`tabblock`,
 * `code`→`tabcode`, `preview`→`tabpreview`. Each pane's child fence (` ```tsx ` / ` ```mdx `) still
 * renders through the normal `pre` handler. Other directive names are left untouched.
 *
 * Note: container nesting needs MORE colons on the outer fence — `::::tab` wraps `:::code` /
 * `:::preview`.
 * @param node - Current mdast node being walked.
 */
const applyTabDirective = (node: { type?: string, name?: string, data?: Record<string, unknown>, children?: Array<unknown> }): void => {
    if (node.type === "containerDirective") {
        const tag = node.name === "tab"
            ? "tabblock"
            : node.name === "code"
                ? "tabcode"
                : node.name === "preview"
                    ? "tabpreview"
                    : null
        if (tag) {
            const data = node.data || (node.data = {})
            data.hName = tag
            data.hProperties = {}
        }
    }
    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            applyTabDirective(child as Parameters<typeof applyTabDirective>[0])
        }
    }
}

/** remark transformer: turn `::::tab`/`:::code`/`:::preview` directives into tabs-block tags. */
const remarkTab = () => (tree: unknown): void => {
    applyTabDirective(tree as Parameters<typeof applyTabDirective>[0])
}

/**
 * Recursively collects the raw text of a directive subtree, preserving line breaks so each
 * authored line (one keyword per line) can be split back out into a separate chip.
 * @param node - Current mdast node.
 */
const collectDirectiveText = (node: { type?: string, value?: string, children?: Array<unknown> }): string => {
    if (node.type === "text") {
        return node.value ?? ""
    }
    if (node.type === "break") {
        return "\n"
    }
    if (Array.isArray(node.children)) {
        return node.children
            .map((child) => collectDirectiveText(child as Parameters<typeof collectDirectiveText>[0]))
            .join("\n")
    }
    return ""
}

/**
 * Rewrites the `:::chip` container directive into a custom `chipblock` tag (see map.tsx),
 * carrying its keywords (one per authored line) as a newline-split, `|`-joined `items` prop so the
 * renderer can render each as its own Chip. Other directive names are left untouched.
 * @param node - Current mdast node being walked.
 */
const applyChipDirective = (node: { type?: string, name?: string, data?: Record<string, unknown>, children?: Array<unknown> }): void => {
    if (node.type === "containerDirective" && node.name === "chip") {
        const items = collectDirectiveText(node)
            .split(/[\n·]+/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
        const data = node.data || (node.data = {})
        data.hName = "chipblock"
        data.hProperties = {
            items: items.join("|"),
        }
    }
    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            applyChipDirective(child as Parameters<typeof applyChipDirective>[0])
        }
    }
}

/** remark transformer: turn `:::chip` directives into a chips-row tag. */
const remarkChip = () => (tree: unknown): void => {
    applyChipDirective(tree as Parameters<typeof applyChipDirective>[0])
}

/**
 * Module-level constant — NOT recreated every render. If `remarkPlugins={[...]}` were inline, each
 * MarkdownContent re-render would hand ReactMarkdown a new array → re-parse the whole markdown.
 */
/**
 * Rewrites the `::::accordion` / `:::panel` container directives into custom hast tags the renderer
 * map turns into a HeroUI Accordion (see map.tsx): `accordion`→`accordionblock`; each
 * `:::panel{title="…"}`→`accordionpanel` carrying its `title` attribute. Inner panel content
 * (bullets, code fences) still renders through the normal handlers.
 *
 * Note: nesting needs MORE colons on the outer fence — `::::accordion` wraps `:::panel`.
 * @param node - Current mdast node being walked.
 */
const applyAccordionDirective = (node: { type?: string, name?: string, attributes?: Record<string, string>, data?: Record<string, unknown>, children?: Array<unknown> }): void => {
    if (node.type === "containerDirective") {
        if (node.name === "accordion") {
            const data = node.data || (node.data = {})
            data.hName = "accordionblock"
            data.hProperties = {}
        } else if (node.name === "panel") {
            const data = node.data || (node.data = {})
            data.hName = "accordionpanel"
            data.hProperties = {
                title: node.attributes?.title ?? "",
            }
        }
    }
    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            applyAccordionDirective(child as Parameters<typeof applyAccordionDirective>[0])
        }
    }
}

/** remark transformer: turn `::::accordion`/`:::panel` directives into accordion tags. */
const remarkAccordion = () => (tree: unknown): void => {
    applyAccordionDirective(tree as Parameters<typeof applyAccordionDirective>[0])
}

const REMARK_PLUGINS = [remarkGfm, remarkDirective, remarkMuted, remarkTab, remarkChip, remarkAccordion]

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
export interface MarkdownContentProps extends WithClassNames<undefined> {
    /** Markdown source string. */
    markdown: string
    /**
     * Reading-grade typography for full lesson articles: 16px body, looser line
     * rhythm and a stronger heading ladder. Off by default (compact scale used in
     * cards, chat, flashcards and modals).
     */
    reading?: boolean
}

/**
 * Renders markdown with GFM and shared typography aligned with the app theme.
 *
 * Presentational: reads the active theme/translator and memoizes the element-renderer map
 * (see {@link buildMarkdownRenderers}); no business logic. Marked `"use client"` for the
 * theme hook and client-side markdown rendering.
 * @param props - {@link MarkdownContentProps}
 */
export const MarkdownContent = ({ markdown, reading = false, className }: MarkdownContentProps) => {
    const theme = useTheme()
    const t = useTranslations()
    const mermaidCaptions = useMemo(() => extractMermaidCaptions(markdown), [markdown])
    const components = useMemo(
        () => buildMarkdownRenderers({
            isDark: theme.theme === "dark",
            t,
            mermaidCaptions,
            reading,
        }),
        [
            theme.theme,
            t,
            mermaidCaptions,
            reading,
        ],
    )
    return (
        <div
            className={cn(
                "min-w-0 text-foreground",
                reading
                    ? "space-y-4 text-base leading-7"
                    : "space-y-1.5 text-sm leading-relaxed",
                className,
            )}
        >
            <ReactMarkdown
                remarkPlugins={REMARK_PLUGINS}
                components={components}
            >
                {markdown}
            </ReactMarkdown>
        </div>
    )
}
