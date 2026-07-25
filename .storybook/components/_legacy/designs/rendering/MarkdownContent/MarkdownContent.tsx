"use client"

import React, { useMemo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkDirective from "remark-directive"
import { cn } from "@heroui/react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { buildMarkdownRenderers } from "./map"
import type { WithClassNames } from "./local-types"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of
 * `@/components/blocks/rendering/MarkdownContent` (and its whole colocated
 * sub-tree: map / CodeToHtml / LayoutWidget / MermaidDiagram / RenderReactComponent
 * / TabsBlock / CodePreviewTabs / table parts). Authored in Storybook (not `src`);
 * synced back to `src` later. Only two src imports were rewired: the `@/components`
 * SnippetIcon → a sibling-local copy, and the next-intl locale-aware Link →
 * `next/link`. The `useTranslations`/`useTheme` contexts come from
 * `.storybook/preview.tsx` (NextIntlClientProvider + HeroUIProvider).
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Re-export the colocated sub-renderers so the local barrel surface stays identical.
export * from "./CodeToHtml"
export * from "./LayoutWidget"
export * from "./MermaidDiagram"

/**
 * Recursively rewrites `:::muted` directives into custom hast tags the renderer map styles as
 * small muted text. Container/leaf → block-level `mutedblock`; inline `:muted[…]` → `mutedtext`.
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
 * Recursively rewrites the `:::tab` / `:::code` / `:::preview` container directives into custom
 * hast tags the renderer map turns into a [Preview|Code] tabs block: `tab`→`tabblock`,
 * `code`→`tabcode`, `preview`→`tabpreview`.
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
 * Rewrites the `:::chip` container directive into a custom `chipblock` tag, carrying its keywords
 * (one per authored line) as a newline-split, `|`-joined `items` prop.
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
 * Rewrites the `::::accordion` / `:::panel` container directives into custom hast tags the renderer
 * map turns into a HeroUI Accordion: `accordion`→`accordionblock`; each `:::panel{title="…"}`→
 * `accordionpanel` carrying its `title` attribute.
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

/** True for a `:::muted` directive node — already tagged `hName: "mutedblock"` by {@link remarkMuted}. */
const isMutedLabelNode = (node: { data?: { hName?: unknown } }): boolean => node.data?.hName === "mutedblock"

/**
 * True for the card-catalog authoring idiom: ONE paragraph that OPENS with a `**bold**` span and
 * keeps going as prose on the same block — label and body live in the SAME mdast paragraph node.
 * @param node - Current mdast node.
 */
const isLeadBoldParagraph = (node: { type?: string, children?: Array<{ type?: string }> }): boolean =>
    node.type === "paragraph"
    && Array.isArray(node.children)
    && node.children.length > 0
    && node.children[0]?.type === "strong"

/**
 * True when a `:::muted` directive's ENTIRE content is one {@link isLeadBoldParagraph} — the real
 * catalog shape, where the directive is a pointless extra wrapper around an already-self-contained section.
 * @param node - Current mdast node (already confirmed a muted label via {@link isMutedLabelNode}).
 */
const isSelfContainedLeadBoldMuted = (node: { children?: Array<{ type?: string, children?: Array<{ type?: string }> }> }): boolean =>
    Array.isArray(node.children) && node.children.length === 1 && isLeadBoldParagraph(node.children[0])

/**
 * True when a `:::muted` directive's ENTIRE content is ONE short inline node (label alone, body
 * follows as an external sibling).
 * @param node - Current mdast node (already confirmed a muted label via {@link isMutedLabelNode}).
 */
const isBareLabelMuted = (node: { children?: Array<{ type?: string, children?: Array<unknown> }> }): boolean => {
    const only = node.children?.[0]
    return Array.isArray(node.children) && node.children.length === 1
        && only?.type === "paragraph"
        && Array.isArray(only.children) && only.children.length === 1
}

/**
 * Turns each Interview Arc section into one `arcsection` node so the renderer can box/collapse a
 * whole "label + body" unit. Handles the three authoring shapes found in the card catalog and adds
 * each tagged/wrapped node to `skip` so the second pass never re-descends into it (avoids the
 * unbounded recursion an earlier version hit). Each `arcsection` carries its 0-based `index`.
 * @param node - Current mdast node being walked.
 */
const groupArcSections = (node: { children?: Array<Record<string, unknown>> }): void => {
    if (!Array.isArray(node.children)) {
        return
    }
    const grouped: Array<Record<string, unknown>> = []
    let current: { type: string, children: Array<unknown>, data: Record<string, unknown> } | null = null
    let sectionIndex = 0
    const skip = new Set<unknown>()
    for (const child of node.children) {
        if (isMutedLabelNode(child as Parameters<typeof isMutedLabelNode>[0])) {
            if (isSelfContainedLeadBoldMuted(child as Parameters<typeof isSelfContainedLeadBoldMuted>[0])) {
                const inner = (child.children as Array<Record<string, unknown>>)[0]
                const data = (inner.data as Record<string, unknown>) || (inner.data = {})
                data.hName = "arcsection"
                data.hProperties = { index: sectionIndex }
                sectionIndex += 1
                current = null
                grouped.push(inner)
                skip.add(inner)
            } else if (isBareLabelMuted(child as Parameters<typeof isBareLabelMuted>[0])) {
                current = {
                    type: "arcSection",
                    children: [child],
                    data: { hName: "arcsection", hProperties: { index: sectionIndex } },
                }
                sectionIndex += 1
                grouped.push(current)
                skip.add(current)
            } else {
                const data = (child.data as Record<string, unknown>) || (child.data = {})
                data.hName = "arcsection"
                data.hProperties = { index: sectionIndex }
                sectionIndex += 1
                current = null
                grouped.push(child)
                skip.add(child)
            }
        } else if (isLeadBoldParagraph(child as Parameters<typeof isLeadBoldParagraph>[0])) {
            const data = (child.data as Record<string, unknown>) || (child.data = {})
            data.hName = "arcsection"
            data.hProperties = { index: sectionIndex }
            sectionIndex += 1
            current = null
            grouped.push(child)
            skip.add(child)
        } else if (current) {
            current.children.push(child)
        } else {
            grouped.push(child)
        }
    }
    node.children = grouped
    for (const child of node.children) {
        if (skip.has(child)) {
            continue
        }
        groupArcSections(child as Parameters<typeof groupArcSections>[0])
    }
}

/** remark transformer: box each Interview Arc label + its following body into one `arcsection`. */
const remarkArcSections = () => (tree: unknown): void => {
    groupArcSections(tree as Parameters<typeof groupArcSections>[0])
}

const REMARK_PLUGINS = [remarkGfm, remarkDirective, remarkMuted, remarkTab, remarkChip, remarkAccordion]
// Opt-in variant (flashcard/mock-interview answers, see `arcSections` prop) — same stable
// module-level array so ReactMarkdown never sees a fresh array identity.
const REMARK_PLUGINS_ARC = [...REMARK_PLUGINS, remarkArcSections]

// Matches each ```mermaid fence and the figure caption paragraph that follows it.
// Group 1 = diagram source; group 2 = the first non-blank line after the fence.
const MERMAID_CAPTION_REGEX = /```mermaid[ \t]*\r?\n([\s\S]*?)\r?\n```[ \t]*\r?\n+[ \t]*([^\r\n]+)/g

/**
 * Cuts off a trailing ```mermaid fence that hasn't been closed yet — markdown fed in progressively
 * (typewriter reveal / AI stream) walks THROUGH every partial length of the diagram source, and
 * `mermaid.render()` throws for every incomplete snapshot. Since a reveal only GROWS the text, at
 * most the LAST fence can be unterminated.
 * @param markdown - Raw markdown source, possibly mid-reveal.
 * @returns `markdown` unchanged, or truncated right before an unterminated trailing mermaid fence.
 */
const holdBackIncompleteMermaidFence = (markdown: string): string => {
    const lines = markdown.split("\n")
    let lastOpenLine = -1
    for (let i = 0; i < lines.length; i++) {
        if (/^```mermaid[ \t]*$/.test(lines[i].trimEnd())) {
            lastOpenLine = i
        }
    }
    if (lastOpenLine === -1) {
        return markdown
    }
    const isClosed = lines.slice(lastOpenLine + 1).some((line) => line.trim() === "```")
    return isClosed ? markdown : lines.slice(0, lastOpenLine).join("\n").trimEnd()
}

/**
 * Scans markdown for mermaid blocks and pairs each with the caption paragraph that immediately
 * follows it (a line starting with "Hình"/"Figure"), keyed by trimmed source.
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

/**
 * Removes each mermaid figure-caption paragraph ("Hình N: …" / "Figure N: …") from the source so it
 * isn't rendered twice — the diagram now shows it as a real `<figcaption>`.
 * @param markdown - Raw markdown source.
 * @returns Markdown with figure-caption paragraphs stripped.
 */
const stripMermaidCaptions = (markdown: string): string => {
    MERMAID_CAPTION_REGEX.lastIndex = 0
    return markdown.replace(MERMAID_CAPTION_REGEX, (match: string, _code: string, caption: string) => {
        const clean = caption.trim().replace(/^\*+|\*+$/g, "").trim()
        if (/^(Hình|Figure)\b/i.test(clean)) {
            // keep the fence + the blank line(s) after it, drop only the caption text
            return match.slice(0, match.lastIndexOf(caption))
        }
        return match
    })
}

/** Props for {@link MarkdownContent}. */
export interface MarkdownContentProps extends WithClassNames<undefined> {
    /** Markdown source string. */
    markdown: string
    /**
     * Reading-grade typography for full lesson articles: 16px body, looser line
     * rhythm and a stronger heading ladder. Off by default (compact scale).
     */
    reading?: boolean
    /**
     * Boxes each Interview Arc label (`:::muted` / standalone-bold paragraph) together with its
     * following body into one collapsible `arcsection`. Opt-in (default off).
     */
    arcSections?: boolean
    /**
     * Plain-text mode: render authored content with INLINE markdown decoration stripped to raw text
     * while keeping block structure + `:::muted` arc labels + cloze. Opt-in for flashcard +
     * mock-interview surfaces.
     */
    plain?: boolean
    /**
     * Render fenced code blocks as RAISED cards (`bg-surface` + shadow) rather than the default
     * recessed wells (`bg-background`). Opt-in for markdown on the bare page CANVAS. Off by default.
     */
    codeElevated?: boolean
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Strips Anki-style cloze markers `{{cN::term}}` (or `{{cN::term::distractors}}`) down to just the
 * term, so a flashcard answer renders cleanly everywhere.
 * @param markdown - Raw markdown that may carry cloze markers.
 */
const stripClozeMarkers = (markdown: string): string =>
    markdown.replace(/\{\{c\d+::([\s\S]*?)(?:::[\s\S]*?)?\}\}/g, "$1")

/**
 * Renders markdown with GFM and shared typography aligned with the app theme.
 *
 * Presentational: reads the active theme/translator and memoizes the element-renderer map (see
 * {@link buildMarkdownRenderers}); no business logic. Marked `"use client"` for the theme hook and
 * client-side markdown rendering.
 * @param props - {@link MarkdownContentProps}
 */
export const MarkdownContent = ({ markdown, reading = false, arcSections = false, plain = false, codeElevated = false, className, anatPart }: MarkdownContentProps) => {
    const theme = useTheme()
    const t = useTranslations()
    // hold back an unterminated trailing mermaid fence FIRST (see helper JSDoc).
    const stableMarkdown = useMemo(() => holdBackIncompleteMermaidFence(markdown), [markdown])
    const mermaidCaptions = useMemo(() => extractMermaidCaptions(stableMarkdown), [stableMarkdown])
    // Strip mermaid figure-captions (rendered as `<figcaption>`) + cloze markers (rendered plain).
    const renderedMarkdown = useMemo(
        () => stripClozeMarkers(stripMermaidCaptions(stableMarkdown)),
        [stableMarkdown],
    )
    const components = useMemo(
        () => buildMarkdownRenderers({
            isDark: theme.theme === "dark",
            t,
            mermaidCaptions,
            reading,
            plain,
            codeElevated,
        }),
        [
            theme.theme,
            t,
            mermaidCaptions,
            reading,
            plain,
            codeElevated,
        ],
    )
    return (
        <div
            data-anat-part={anatPart}
            className={cn(
                "min-w-0 text-foreground",
                // Reading lessons: NO uniform space-y — each block renderer carries its own margin.
                // Compact (cards / chat / flashcards) keeps the tight uniform rhythm.
                reading
                    ? "text-base leading-7 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                    : "space-y-2 text-sm leading-relaxed",
                className,
            )}
        >
            <ReactMarkdown
                remarkPlugins={arcSections ? REMARK_PLUGINS_ARC : REMARK_PLUGINS}
                components={components}
            >
                {renderedMarkdown}
            </ReactMarkdown>
        </div>
    )
}
