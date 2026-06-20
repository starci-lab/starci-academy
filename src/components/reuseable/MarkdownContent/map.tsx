import React from "react"
import type { Components } from "react-markdown"
import { isInlineCode } from "react-shiki"
import * as HeroUI from "@heroui/react"
import {
    MarkdownTable,
    MarkdownTableBody,
    MarkdownTableColumn,
    MarkdownTableHead,
    MarkdownTableRow,
} from "./MarkdownTableParts"
import { CodeToHtml } from "./CodeToHtml"
import { LayoutWidget } from "./LayoutWidget"
import { MermaidDiagram } from "./MermaidDiagram"
import { RenderReactComponent } from "./RenderReactComponent"
import { TabsBlock, TabPane } from "./TabsBlock"
import { Link as IntlLink } from "@/i18n/navigation"
import type { MarkdownRenderersParams } from "./types"

// Named handles used by the markdown element renderers below.
const { Link, Table } = HeroUI

// Tailwind size class per the old HeroUI `Text` `size` token. HeroUI v3.0.5 renamed
// `Text` → `Typography` and its root no longer accepts `size`/`elementType`, so prose
// blocks render through this tiny local helper instead — keeping visuals pixel-identical
// and decoupled from the renamed component.
const PROSE_SIZE: Record<string, string> = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
}

/**
 * Minimal prose text node: renders `elementType` with a size class plus extra classes.
 * Drop-in for the former HeroUI `<Text elementType size className>` used by the markdown
 * heading/paragraph/list renderers.
 * @param props.elementType - HTML element/tag to render (default `div`).
 * @param props.size - Size token mapped to a Tailwind text-size class (default `sm`).
 * @param props.className - Extra classes appended after the size class.
 * @param props.children - Inline content.
 */
const ProseText = ({
    elementType: As = "div",
    size = "sm",
    className,
    children,
}: {
    elementType?: React.ElementType
    size?: keyof typeof PROSE_SIZE
    className?: string
    children?: React.ReactNode
}) => <As className={[PROSE_SIZE[size], className].filter(Boolean).join(" ")}>{children}</As>

/**
 * Recursively flattens a React children tree to its plain-text content — used to
 * derive a stable heading slug (and the "on this page" outline label) from the
 * rendered heading nodes.
 * @param node - The React node to read text from.
 * @returns The concatenated text content.
 */
const getNodeText = (node: React.ReactNode): string => {
    if (node === null || node === undefined || typeof node === "boolean") {
        return ""
    }
    if (typeof node === "string" || typeof node === "number") {
        return String(node)
    }
    if (Array.isArray(node)) {
        return node.map(getNodeText).join("")
    }
    if (React.isValidElement(node)) {
        return getNodeText((node.props as { children?: React.ReactNode }).children)
    }
    return ""
}

/**
 * Slugify heading text into a URL-safe anchor id (diacritics stripped, Vietnamese
 * `đ`→`d`, non-alphanumerics collapsed to single hyphens). Deterministic so the
 * rendered heading id and any "on this page" outline reading it from the DOM agree.
 * @param text - The raw heading text.
 * @returns The anchor slug.
 */
const slugify = (text: string): string =>
    text
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[đĐ]/g, "d")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

/**
 * Heading renderer factory: renders a section heading carrying a slug `id` +
 * `data-toc` markers so an "on this page" rail can scan the rendered article
 * (`#lesson-article [data-toc]`) and anchor-scroll to it. `scroll-mt-20` clears
 * the sticky navbar when jumped to.
 * @param level - The heading depth surfaced in the outline (2 or 3).
 * @param sizeClass - The prose size class keeping the visual identical to {@link ProseText}.
 */
const buildTocHeading = (level: 2 | 3, sizeClass: string) =>
    ({ children }: { children?: React.ReactNode }) => {
        // real heading tag (not a div) so the body keeps semantic outline for SEO
        const Tag = `h${level}` as "h2" | "h3"
        return (
            <Tag
                id={slugify(getNodeText(children))}
                data-toc=""
                data-toc-level={level}
                className={`${sizeClass} scroll-mt-20 font-semibold`}
            >
                {children}
            </Tag>
        )
    }

/**
 * Builds the element-renderer map handed to `ReactMarkdown` so headings, tables, code
 * blocks, mermaid diagrams and inline elements use the app's HeroUI typography.
 *
 * Vertical rhythm is owned by the single `space-y` wrapper in {@link MarkdownContent}; block
 * renderers here stay margin-free and only carry size/weight/colour tokens.
 * @param params - {@link MarkdownRenderersParams} theme flag + translator + mermaid captions.
 * @returns A `Components` map keyed by markdown element name.
 */
export const buildMarkdownRenderers = ({
    isDark,
    t,
    mermaidCaptions,
    reading = false,
}: MarkdownRenderersParams): Components => {
    // Long-form lessons read the larger scale; cards / chat / modals keep the compact one.
    const bodySize = reading ? "base" : "sm"
    const h2Size = reading ? PROSE_SIZE["2xl"] : PROSE_SIZE.lg
    const h3Size = reading ? PROSE_SIZE.xl : PROSE_SIZE.base
    return ({
        h1: ({ children }) => (
            <ProseText elementType="h1" size={reading ? "2xl" : "xl"} className="font-semibold">{children}</ProseText>
        ),
        h2: buildTocHeading(2, h2Size),
        h3: buildTocHeading(3, h3Size),
        h4: ({ children }) => (
            reading
                ? <ProseText elementType="h4" size="base" className="font-semibold">{children}</ProseText>
                : <ProseText elementType="h4" size="sm" className="font-semibold text-muted">{children}</ProseText>
        ),
        h5: ({ children }) => (
            <ProseText elementType="h5" size="sm" className="font-semibold text-muted">{children}</ProseText>
        ),
        h6: ({ children }) => (
            <ProseText elementType="h6" size="xs" className="font-semibold text-muted">{children}</ProseText>
        ),
        // Custom `:::muted` directive tags (see remarkMuted in ./index): small, muted label text.
        // `[&_*]:text-muted` forces the muted colour onto any inner `<p>` the container wraps.
        mutedblock: ({ children }: { children?: React.ReactNode }) => (
            <ProseText elementType="div" size="sm" className="font-semibold text-muted [&_*]:text-muted">{children}</ProseText>
        ),
        mutedtext: ({ children }: { children?: React.ReactNode }) => (
            <ProseText elementType="span" size="sm" className="font-semibold text-muted">{children}</ProseText>
        ),
        // Custom `:::chip` directive tag (see remarkChip in ./index): a wrapped row of soft chips,
        // one per authored keyword line. `items` is the `|`-joined keyword list.
        chipblock: ({ items }: { items?: string }) => (
            <span className="my-1 flex flex-wrap gap-1.5">
                {String(items ?? "").split("|").filter(Boolean).map((keyword, index) => (
                    <HeroUI.Chip key={index} size="sm" variant="soft" color="default">{keyword}</HeroUI.Chip>
                ))}
            </span>
        ),
        // :::tab → [ Preview | Code ] tabs; code/preview panes carry `kind` so TabsBlock can match them.
        tabblock: ({ children }: { children?: React.ReactNode }) => <TabsBlock>{children}</TabsBlock>,
        tabcode: ({ children }: { children?: React.ReactNode }) => <TabPane kind="code">{children}</TabPane>,
        tabpreview: ({ children }: { children?: React.ReactNode }) => <TabPane kind="preview">{children}</TabPane>,
        // ::::accordion / :::panel{title} → HeroUI collapsible accordion (see remarkAccordion in ./index).
        accordionblock: ({ children }: { children?: React.ReactNode }) => (
            <HeroUI.Accordion variant="surface" className="my-1.5">{children}</HeroUI.Accordion>
        ),
        accordionpanel: ({ title, children }: { title?: string, children?: React.ReactNode }) => (
            <HeroUI.Accordion.Item aria-label={String(title ?? "")}>
                <HeroUI.Accordion.Heading>
                    <HeroUI.Accordion.Trigger>
                        <div className="flex w-full items-center justify-between gap-3 text-start">
                            <span className="text-sm font-semibold">{title}</span>
                            <HeroUI.Accordion.Indicator />
                        </div>
                    </HeroUI.Accordion.Trigger>
                </HeroUI.Accordion.Heading>
                <HeroUI.Accordion.Panel>
                    <HeroUI.Accordion.Body>
                        <div className="space-y-1.5">{children}</div>
                    </HeroUI.Accordion.Body>
                </HeroUI.Accordion.Panel>
            </HeroUI.Accordion.Item>
        ),
        table: ({ children }) => (
            <MarkdownTable ariaLabel={t("markdown.tableAriaLabel")}>
                {children}
            </MarkdownTable>
        ),
        thead: MarkdownTableHead,
        img: ({ src, alt }) => (
            <img src={src} alt={alt} className="w-full rounded-xl border border-default" />
        ),
        tbody: MarkdownTableBody,
        th: MarkdownTableColumn,
        td: ({ children }) => <Table.Cell>{children}</Table.Cell>,
        tr: MarkdownTableRow,
        code: (
            { children, node }
        ) => {
            const code = String(children).trim()
            const isInline = node ? isInlineCode(node) : undefined
            if (!isInline) {
                return children
            }
            return (
                <code className="rounded-md bg-default px-1.5 py-0.5 font-mono text-sm text-accent">
                    {code}
                </code>
            )
        },
        pre: ({ children }) => {
            const child = React.Children.only(children) as React.ReactElement
            const className = (child.props as { className?: string }).className || ""
            const match = /language-(\w+)/.exec(className)
            const lang = match?.[1] || "bash"
            const code = String((child.props as { children?: React.ReactNode }).children || "").replace(/\n$/, "")
            if (lang.toLowerCase() === "mermaid") {
                return (
                    <MermaidDiagram
                        code={code}
                        theme={isDark ? "dark" : "default"}
                        loadingLabel={t("markdown.mermaidRendering")}
                        expandLabel={t("markdown.mermaidExpand")}
                        caption={mermaidCaptions[code.trim()]}
                        fallbackLabel={t("markdown.mermaidFigureLabel")}
                    />
                )
            }
            // ```mdx fence → live HeroUI render (render-only; tabs come from a :::tab block).
            if (lang.toLowerCase() === "mdx") {
                return <RenderReactComponent code={code} />
            }
            if (lang.toLowerCase() === "layout") {
                return <LayoutWidget html={code} />
            }
            return (
                <CodeToHtml
                    code={code}
                    language={lang}
                    theme={isDark
                        ? "material-theme-darker"
                        : "material-theme-lighter"}
                />
            )
        },
        blockquote: ({ children }) => (
            <blockquote className="space-y-1.5 rounded-r-xl border-l-2 border-accent bg-default/40 px-4 py-2 text-muted">
                {children}
            </blockquote>
        ),
        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        hr: () => <hr className="border-default" />,
        ol: ({ children }) => <ol className="list-decimal space-y-1.5 pl-5 marker:text-muted">{children}</ol>,
        ul: ({ children }) => <ul className="list-disc space-y-1.5 pl-5 marker:text-muted">{children}</ul>,
        li: ({ children }) => (
            <ProseText elementType="li" size={bodySize} className="space-y-1.5 leading-relaxed">{children}</ProseText>
        ),
        p: ({ children }) => (
            <ProseText elementType="div" size={bodySize} className="leading-relaxed">{children}</ProseText>
        ),
        a: ({ href, children }) => {
        // Internal links (e.g. related-problem `/practice/<slug>`) navigate in-app
        // (same tab, locale-aware) via the next-intl Link; external links open a new tab.
            const isInternal = typeof href === "string" && href.startsWith("/")
            if (isInternal) {
                return (
                    <IntlLink href={href} className="!inline text-accent underline underline-offset-2">
                        {children}
                    </IntlLink>
                )
            }
            return (
                <Link href={href} target="_blank" className="!inline text-accent underline underline-offset-2">
                    {children}
                </Link>
            )
        },
    } as Components)
}
