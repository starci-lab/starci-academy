import React, { useEffect, useMemo, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkDirective from "remark-directive"
import remarkGfm from "remark-gfm"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { buildMarkdownRenderers } from "@sb-components/composites/viewers/MarkdownContent/map"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * VIEWER — `MarkdownContent`: paint an authored markdown document faithfully.
 *
 * WHY IT IS A VIEWER AND NOT A COMPOSITE OF ITS OWN SHAPE (§4b): every other
 * composite KNOWS its shape before it renders — a card has a label and rows, a
 * header has a title and meta. This one CANNOT: the shape is decided by the
 * payload. It receives a document written somewhere else and repeats it without
 * understanding what it says.
 *
 * SCOPE OF THIS PASS (teacher's call 2026-07-29, in priority order): Shiki
 * syntax-highlighted fenced code · mermaid diagrams (SVG, click-to-zoom, caption
 * pairing, streaming-safe truncation) · `:::tab`/`:::code`/`:::preview` →
 * Preview↔Code tabs (confirmed used in authored lesson content) · GFM tables →
 * real HeroUI `Table` · `::::accordion`/`:::panel` → the CORRECT HeroUI
 * `Accordion` compound with surface chrome · `:::muted` + `:::chip` + image
 * captions + link routing + heading anchors. Still NOT ported: `arcSections`
 * (flashcard/mock-interview answer boxing), `plain` mode ("render thô"), the
 * ` ```mdx ` live-render fence, the ` ```layout ` fence — each is a viewer/runtime
 * of its own and half-porting one leaves a body that looks finished and renders
 * wrong, which every gate here would pass.
 *
 * ⚠️ THE CLASSES IN `map.tsx` ARE THE ONE PLACE HAND-WRITTEN SPACING IS CORRECT. A
 * viewer cannot reach for frames: it never sees its own children as nodes, only
 * as whatever the parser hands back. This is the same exemption §13z gives the
 * atom tier, for the same reason — there is no seam to own when the tree is not
 * yours.
 *
 * TWO MEASURES. `reading` is the lesson body: bigger type, generous rhythm.
 * `compact` is for markdown quoted inside another surface, such as a chat answer
 * or a card, where the document is a passenger rather than the page.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** How much room the document gets. */
export type MarkdownMeasure = "reading" | "compact"

/**
 * A directive node as `remark-directive` parses it — shared shape for the
 * `:::muted` / `:::tab`/`:::code`/`:::preview` / `::::accordion`/`:::panel`
 * rewriters below (they all only ever read/write these same four fields).
 */
interface DirectiveNode {
    /** mdast node type (`"containerDirective"` / `"leafDirective"` / `"textDirective"` for a directive). */
    type?: string
    /** Directive name as authored (`"muted"`, `"tab"`, `"code"`, `"preview"`, `"chip"`, `"accordion"`, `"panel"`). */
    name?: string
    /** Directive attributes (`{title="…"}`). */
    attributes?: Record<string, string>
    /** hast rewrite instructions (`hName`/`hProperties`) this pass writes into. */
    data?: Record<string, unknown>
    /** Child mdast nodes. */
    children?: Array<unknown>
}

/** A directive's inline content node, as read by {@link collectDirectiveText}. */
interface DirectiveTextNode {
    /** mdast node type (`"text"`, `"break"`, or a container). */
    type?: string
    /** Text value (only on `"text"` nodes). */
    value?: string
    /** Child mdast nodes. */
    children?: Array<unknown>
}

/**
 * Recursively rewrites `:::muted` directives (container/leaf/text, parsed by `remark-directive`)
 * into custom hast tags the renderer map styles as small muted text. Container/leaf → block-level
 * `mutedblock`; inline `:muted[…]` → `mutedtext`. Directives with any other name are left untouched
 * (and dropped by the hast conversion since they have no handler).
 * @param node - Current mdast node being walked.
 */
const applyMutedDirective = (node: DirectiveNode): void => {
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
            applyMutedDirective(child as DirectiveNode)
        }
    }
}

/** remark transformer: turn `:::muted` directives into styled custom tags. */
const remarkMuted = () => (tree: unknown): void => {
    applyMutedDirective(tree as DirectiveNode)
}

/**
 * Recursively rewrites the `:::tab` / `:::code` / `:::preview` container directives into custom
 * hast tags the renderer map turns into a [Preview|Code] tabs block (see `TabsBlock`):
 * `tab`→`tabblock`, `code`→`tabcode`, `preview`→`tabpreview`. Each pane's child fence
 * (` ```tsx ` / ` ```mdx `) still renders through the normal `pre` handler. Other directive names
 * are left untouched.
 *
 * Note: container nesting needs MORE colons on the outer fence — `::::tab` wraps `:::code` /
 * `:::preview`.
 * @param node - Current mdast node being walked.
 */
const applyTabDirective = (node: DirectiveNode): void => {
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
            applyTabDirective(child as DirectiveNode)
        }
    }
}

/** remark transformer: turn `::::tab`/`:::code`/`:::preview` directives into tabs-block tags. */
const remarkTab = () => (tree: unknown): void => {
    applyTabDirective(tree as DirectiveNode)
}

/**
 * Recursively collects the raw text of a directive subtree, preserving line breaks so each
 * authored line (one keyword per line) can be split back out into a separate chip.
 * @param node - Current mdast node.
 */
const collectDirectiveText = (node: DirectiveTextNode): string => {
    if (node.type === "text") {
        return node.value ?? ""
    }
    if (node.type === "break") {
        return "\n"
    }
    if (Array.isArray(node.children)) {
        return node.children
            .map((child) => collectDirectiveText(child as DirectiveTextNode))
            .join("\n")
    }
    return ""
}

/**
 * Rewrites the `:::chip` container directive into a custom `chipblock` tag (see `map.tsx`),
 * carrying its keywords (one per authored line) as a newline-split, `|`-joined `items` prop so the
 * renderer can render each as its own Chip. Other directive names are left untouched.
 * @param node - Current mdast node being walked.
 */
const applyChipDirective = (node: DirectiveNode): void => {
    if (node.type === "containerDirective" && node.name === "chip") {
        const items = collectDirectiveText(node as DirectiveTextNode)
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
            applyChipDirective(child as DirectiveNode)
        }
    }
}

/** remark transformer: turn `:::chip` directives into a chips-row tag. */
const remarkChip = () => (tree: unknown): void => {
    applyChipDirective(tree as DirectiveNode)
}

/**
 * Rewrites the `::::accordion` / `:::panel{title="…"}` container directives into custom hast tags
 * the renderer map turns into a HeroUI Accordion (see `map.tsx`): `accordion`→`accordionblock`;
 * each `:::panel{title="…"}`→`accordionpanel` carrying its `title` attribute. Inner panel content
 * (bullets, code fences) still renders through the normal handlers.
 *
 * Note: nesting needs MORE colons on the outer fence — `::::accordion` wraps `:::panel`.
 * @param node - Current mdast node being walked.
 */
const applyAccordionDirective = (node: DirectiveNode): void => {
    if (node.type === "containerDirective") {
        if (node.name === "accordion") {
            const data = node.data || (node.data = {})
            data.hName = "accordionblock"
            data.hProperties = {}
        } else if (node.name === "panel") {
            const data = node.data || (node.data = {})
            data.hName = "accordionpanel"
            data.hProperties = { title: node.attributes?.title ?? "" }
        }
    }
    if (Array.isArray(node.children)) {
        for (const child of node.children) applyAccordionDirective(child as DirectiveNode)
    }
}

/** remark transformer: `::::accordion`/`:::panel` become accordion tags. */
const remarkAccordion = () => (tree: unknown): void => {
    applyAccordionDirective(tree as DirectiveNode)
}

/**
 * Module-level constant — NOT recreated every render. If `remarkPlugins={[...]}` were inline, each
 * `MarkdownContent` re-render would hand `ReactMarkdown` a new array → re-parse the whole markdown.
 */
const REMARK_PLUGINS = [remarkGfm, remarkDirective, remarkMuted, remarkTab, remarkChip, remarkAccordion]

// Matches each ```mermaid fence and the figure caption paragraph that follows it.
// Group 1 = diagram source; group 2 = the first non-blank line after the fence.
const MERMAID_CAPTION_REGEX = /```mermaid[ \t]*\r?\n([\s\S]*?)\r?\n```[ \t]*\r?\n+[ \t]*([^\r\n]+)/g

/**
 * Cuts off a trailing ```mermaid fence that hasn't been closed yet — markdown fed in
 * progressively (a typewriter reveal, an AI stream) walks THROUGH every partial length of the
 * diagram source one tick at a time, and `mermaid.render()` throws "Syntax error in text" for
 * every one of those incomplete snapshots. Since a reveal only ever GROWS the text, at most the
 * LAST fence can be unterminated — any earlier one already has content (and therefore its closing
 * fence) after it.
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
 * Scans markdown for mermaid blocks and pairs each with the caption paragraph that
 * immediately follows it (a line starting with "Hình"/"Figure"), keyed by trimmed source.
 * @param markdown - Raw markdown source.
 * @returns Caption text keyed by trimmed mermaid source.
 */
const extractMermaidCaptions = (markdown: string): Record<string, string> => {
    const captions: Record<string, string> = {}
    MERMAID_CAPTION_REGEX.lastIndex = 0
    for (let match = MERMAID_CAPTION_REGEX.exec(markdown); match; match = MERMAID_CAPTION_REGEX.exec(markdown)) {
        const code = match[1].trim()
        const caption = match[2].trim().replace(/^\*+|\*+$/g, "").trim()
        if (/^(Hình|Figure)\b/i.test(caption)) {
            captions[code] = caption
        }
    }
    return captions
}

/**
 * Removes each mermaid figure-caption paragraph ("Hình N: …" / "Figure N: …") from the source
 * so it isn't rendered twice — the diagram now shows it as a real `<figcaption>`.
 * @param markdown - Raw markdown source.
 * @returns Markdown with figure-caption paragraphs stripped.
 */
const stripMermaidCaptions = (markdown: string): string => {
    MERMAID_CAPTION_REGEX.lastIndex = 0
    return markdown.replace(MERMAID_CAPTION_REGEX, (match: string, _code: string, caption: string) => {
        const clean = caption.trim().replace(/^\*+|\*+$/g, "").trim()
        if (/^(Hình|Figure)\b/i.test(clean)) {
            return match.slice(0, match.lastIndexOf(caption))
        }
        return match
    })
}

/**
 * Storybook has no `next-themes` provider (unlike `src`) — the toolbar's Light/Dark
 * global instead stamps a `"light"`/`"dark"` class on an ANCESTOR wrapper div (see
 * `.storybook/preview.tsx`). Read it off the DOM the same way `BlockAnatomy` already
 * does (`host.closest(".dark")`), and keep it live with a `MutationObserver` so
 * flipping the toolbar mid-session re-themes Mermaid/Shiki without a remount.
 * @param ref - Ref on (or inside) the element whose nearest themed ancestor to watch.
 */
const useIsDarkTheme = (ref: React.RefObject<HTMLDivElement | null>): boolean => {
    const [isDark, setIsDark] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) {
            return
        }
        const themeHost = el.closest(".light, .dark") ?? document.documentElement
        const read = () => setIsDark(themeHost.classList.contains("dark"))
        read()
        const observer = new MutationObserver(read)
        observer.observe(themeHost, { attributes: true, attributeFilter: ["class"] })
        return () => observer.disconnect()
    }, [ref])
    return isDark
}

/** Props for {@link MarkdownContent}. */
export interface MarkdownContentProps {
    /** The document, as authored. This is the payload that decides the shape. */
    source: string
    /** How much room the document gets. Defaults to `"reading"`. */
    measure?: MarkdownMeasure
    /** Extra classes on the article wrapper. */
    className?: string
    /**
     * `true` → render a 2-line shimmer mirror instead of the real document
     * (§12c: the owner of the shape owns the skeleton). Added 2026-07-29 —
     * before this, callers faked it by swapping in an unrelated `Typography
     * isSkeleton`, the one call-site left doing that (`MockInterviewScorecard`)
     * has since been switched to this prop instead.
     */
    isSkeleton?: boolean
    /** When on, the article (and the reused `SnippetIcon`/`Chip` atoms) emit `data-anat-part`. */
    showAnatomy?: boolean
    /** Anatomy tag: names this viewer so a BlockAnatomy panel can badge it. */
    anatPart?: string
}

/**
 * Render an authored markdown document. See the file header for the scope of
 * this port and why a viewer is allowed to write its own spacing.
 *
 * @param props - {@link MarkdownContentProps}
 */
const MarkdownContent = ({
    source,
    measure = "reading",
    className,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: MarkdownContentProps) => {
    const reading = measure === "reading"
    const rootRef = useRef<HTMLDivElement>(null)
    const isDark = useIsDarkTheme(rootRef)

    // Hold back an unterminated trailing mermaid fence FIRST — see the helper's own JSDoc.
    // Hooks run UNCONDITIONALLY even on a skeleton call (rules of hooks) — `source` is
    // just "" on that path (see the call-site), so this is cheap, not wasted real work.
    const stableSource = useMemo(() => holdBackIncompleteMermaidFence(source), [source])
    const mermaidCaptions = useMemo(() => extractMermaidCaptions(stableSource), [stableSource])
    // Strip mermaid figure-captions — they render as a real `<figcaption>` instead.
    const renderedSource = useMemo(() => stripMermaidCaptions(stableSource), [stableSource])

    const components = useMemo(
        () => buildMarkdownRenderers({ isDark, reading, mermaidCaptions, showAnatomy }),
        [isDark, reading, mermaidCaptions, showAnatomy],
    )

    // Skeleton mirror owned by THIS composite (§12c) — AFTER every hook above has run
    // (rules of hooks: an early return before a hook call would skip it conditionally).
    if (isSkeleton) {
        return (
            <div
                className={cn("flex flex-col gap-2", className)}
                data-anat-part={anatPart ?? (showAnatomy ? "Skeleton" : undefined)}
            >
                <HeroSkeleton className="h-4 w-full rounded" />
                <HeroSkeleton className="h-4 w-2/3 rounded" />
            </div>
        )
    }

    return (
        <article
            ref={rootRef}
            data-anat-part={anatPart ?? (showAnatomy ? "MarkdownContent" : undefined)}
            className={cn("first:*:mt-0 last:*:mb-0", className)}
        >
            <ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={components as never}>
                {renderedSource}
            </ReactMarkdown>
        </article>
    )
}

export { MarkdownContent }
