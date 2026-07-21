import React from "react"
import type { Components } from "react-markdown"
import { isInlineCode } from "react-shiki"
import * as HeroUI from "@heroui/react"
import { CaretDownIcon } from "@phosphor-icons/react"
// TODO: swap for the next-intl locale-aware Link (`@/i18n/navigation`) when this port syncs to src.
import IntlLink from "next/link"
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
import type { MarkdownRenderersParams } from "./types"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of the src markdown renderer `map`.
 * The only change vs src is the internal-link component: the next-intl locale-aware
 * `Link` is swapped for `next/link` (no i18n routing table in Storybook). Synced to
 * `src` later.
 */

// Named handles used by the markdown element renderers below.
const { Link, Table } = HeroUI

// Tailwind size class per the old HeroUI `Text` `size` token.
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
}) => React.createElement(
    As,
    { className: [PROSE_SIZE[size], className].filter(Boolean).join(" ") },
    children,
)

/**
 * Recursively flattens a React children tree to its plain-text content — used to
 * derive a stable heading slug (and the "on this page" outline label).
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
 * `đ`→`d`, non-alphanumerics collapsed to single hyphens).
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
 * `data-toc` markers so an "on this page" rail can scan the rendered article.
 * @param level - The heading depth surfaced in the outline (2, 3 or 4).
 * @param sizeClass - The prose size class keeping the visual identical to {@link ProseText}.
 */
const buildTocHeading = (level: 2 | 3 | 4, sizeClass: string, marginClass: string, anchorLabel: string) =>
    ({ children }: { children?: React.ReactNode }) => {
        // real heading tag (not a div) so the body keeps semantic outline for SEO
        const Tag = `h${level}` as "h2" | "h3" | "h4"
        const text = getNodeText(children)
        const id = slugify(text)
        return (
            <Tag
                id={id}
                data-toc=""
                data-toc-level={level}
                data-toc-label={text}
                className={`group ${marginClass} ${sizeClass} scroll-mt-20 font-semibold`.trim()}
            >
                {children}
                {/* Hover anchor (#) — copy/share a deep link to the section (reading only). */}
                {anchorLabel ? (
                    <a
                        href={`#${id}`}
                        aria-label={anchorLabel}
                        className="ml-2 text-muted no-underline opacity-0 transition-opacity group-hover:opacity-100"
                    >
                        #
                    </a>
                ) : null}
            </Tag>
        )
    }

/**
 * One "Interview Arc" section: the label (`children[0]`) boxed with its body. The
 * first two sections stay always-expanded and divider-separated; the rest start
 * collapsed behind a label chip. `stopPropagation` on the chip because a `FlipCard`
 * face is a click-to-flip target.
 * @param props.index - 0-based position among arc sections in this answer.
 * @param props.children - `[label, ...body]`, as grouped by the remark transform.
 */
const ArcSection = ({ index, children }: { index?: number, children?: React.ReactNode }) => {
    const position = index ?? 0
    const isCore = position < 2
    const [expanded, setExpanded] = React.useState(isCore)
    const boxClassName = `[&>*:first-child]:!block [&>*:first-child]:!text-muted [&>*:first-child]:!text-xs [&>*:first-child]:!font-medium [&>*:first-child]:!mb-1 border-l-2 border-default pl-3 ${position > 0 ? "mt-3" : ""}`
    if (expanded) {
        const list = React.Children.toArray(children)
        if (typeof list[1] === "string") {
            list[1] = (list[1] as string).replace(/^\s*[—-]\s*/, "")
        }
        return <div className={boxClassName}>{list}</div>
    }
    const label = React.Children.toArray(children)[0]
    return (
        <button
            type="button"
            onClick={(event) => {
                event.stopPropagation()
                setExpanded(true)
            }}
            className="mr-2 mt-2 inline-flex items-center gap-1 rounded-full bg-default px-2 py-1 text-xs text-muted transition-colors hover:bg-default/80"
        >
            {getNodeText(label)}
            <CaretDownIcon weight="bold" className="size-4" />
        </button>
    )
}

/**
 * Builds the element-renderer map handed to `ReactMarkdown` so headings, tables, code
 * blocks, mermaid diagrams and inline elements use the app's HeroUI typography.
 * @param params - {@link MarkdownRenderersParams} theme flag + translator + mermaid captions.
 * @returns A `Components` map keyed by markdown element name.
 */
export const buildMarkdownRenderers = ({
    isDark,
    t,
    mermaidCaptions,
    reading = false,
    plain = false,
    codeElevated = false,
}: MarkdownRenderersParams): Components => {
    // Long-form lessons read the larger scale; cards / chat / modals keep the compact one.
    const bodySize = reading ? "base" : "sm"
    const h2Size = reading ? PROSE_SIZE["2xl"] : PROSE_SIZE.lg
    const h3Size = reading ? PROSE_SIZE.xl : PROSE_SIZE.base
    const h2Margin = reading ? "mt-10 mb-3" : ""
    const h3Margin = reading ? "mt-8 mb-3" : ""
    const blockMy = reading ? "my-4" : ""
    // Heading deep-link anchor only in reading mode (cards / chat have no shareable url).
    const anchorLabel = reading ? t("markdown.headingAnchor") : ""
    return ({
        h1: ({ children }) => (
            <ProseText elementType="h1" size={reading ? "2xl" : "xl"} className={reading ? "mb-4 font-semibold" : "font-semibold"}>{children}</ProseText>
        ),
        h2: buildTocHeading(2, h2Size, h2Margin, anchorLabel),
        h3: buildTocHeading(3, h3Size, h3Margin, anchorLabel),
        h4: reading
            ? buildTocHeading(4, PROSE_SIZE.base, "mt-6 mb-2", anchorLabel)
            : ({ children }) => <ProseText elementType="h4" size="sm" className="font-semibold text-muted">{children}</ProseText>,
        h5: ({ children }) => (
            reading
                ? <ProseText elementType="h5" size="sm" className="mt-4 mb-2 font-semibold">{children}</ProseText>
                : <ProseText elementType="h5" size="sm" className="font-semibold text-muted">{children}</ProseText>
        ),
        h6: ({ children }) => (
            reading
                ? <ProseText elementType="h6" size="sm" className="mt-4 mb-2 font-semibold text-muted">{children}</ProseText>
                : <ProseText elementType="h6" size="xs" className="font-semibold text-muted">{children}</ProseText>
        ),
        // Custom `:::muted` directive tags (see remarkMuted in ./MarkdownContent): small, muted label text.
        mutedblock: ({ children }: { children?: React.ReactNode }) => (
            <ProseText elementType="div" size="sm" className="font-semibold text-muted [&_*]:text-muted">{children}</ProseText>
        ),
        mutedtext: ({ children }: { children?: React.ReactNode }) => (
            <ProseText elementType="span" size="sm" className="font-semibold text-muted">{children}</ProseText>
        ),
        // `:::muted`/bold-label + its body, boxed as one Interview Arc section — opt-in via `arcSections`.
        arcsection: ArcSection,
        // Custom `:::chip` directive tag: a wrapped row of soft chips, one per authored keyword line.
        chipblock: ({ items }: { items?: string }) => (
            <span className="my-2 flex flex-wrap gap-2">
                {String(items ?? "").split("|").filter(Boolean).map((keyword, index) => (
                    <HeroUI.Chip key={index} size="sm" variant="soft" color="default">{keyword}</HeroUI.Chip>
                ))}
            </span>
        ),
        // :::tab → [ Preview | Code ] tabs; code/preview panes carry `kind` so TabsBlock can match them.
        tabblock: ({ children }: { children?: React.ReactNode }) => <TabsBlock>{children}</TabsBlock>,
        tabcode: ({ children }: { children?: React.ReactNode }) => <TabPane kind="code">{children}</TabPane>,
        tabpreview: ({ children }: { children?: React.ReactNode }) => <TabPane kind="preview">{children}</TabPane>,
        // ::::accordion / :::panel{title} → HeroUI collapsible accordion (see remarkAccordion in ./MarkdownContent).
        accordionblock: ({ children }: { children?: React.ReactNode }) => (
            <HeroUI.Accordion
                variant="default"
                style={{ "--separator": "color-mix(in oklab, var(--surface-foreground) 6%, transparent)" } as React.CSSProperties}
                className={`${reading ? "my-4" : "my-2"} overflow-hidden rounded-3xl border border-default bg-surface`}
            >{children}</HeroUI.Accordion>
        ),
        accordionpanel: ({ title, children }: { title?: string, children?: React.ReactNode }) => (
            <HeroUI.Accordion.Item aria-label={String(title ?? "")}>
                <HeroUI.Accordion.Heading>
                    <HeroUI.Accordion.Trigger>
                        <div className="flex w-full items-center justify-between gap-3 text-start">
                            <span className={reading ? "text-base font-semibold" : "text-sm font-semibold"}>{title}</span>
                            <HeroUI.Accordion.Indicator />
                        </div>
                    </HeroUI.Accordion.Trigger>
                </HeroUI.Accordion.Heading>
                <HeroUI.Accordion.Panel>
                    <HeroUI.Accordion.Body>
                        <div className="space-y-2">{children}</div>
                    </HeroUI.Accordion.Body>
                </HeroUI.Accordion.Panel>
            </HeroUI.Accordion.Item>
        ),
        table: ({ children }) => (
            <MarkdownTable ariaLabel={t("markdown.tableAriaLabel")} className={blockMy}>
                {children}
            </MarkdownTable>
        ),
        thead: MarkdownTableHead,
        img: ({ src, alt }) => (
            // Markdown `![caption](src)`: a non-empty alt doubles as a real figure caption.
            alt ? (
                <figure className={reading ? "my-4" : undefined}>
                    <img src={src} alt={alt} className="w-full rounded-xl border border-default" />
                    <figcaption className="mt-2 text-center text-sm italic text-muted">{alt}</figcaption>
                </figure>
            ) : (
                <img src={src} alt="" className={`${reading ? "my-4 " : ""}w-full rounded-xl border border-default`} />
            )
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
            // plain mode: inline code renders as its raw text (no mono/background).
            if (plain) {
                return <>{code}</>
            }
            // Neutral inline code (GitHub/Stripe-style): subtle surface + foreground text, NOT the brand accent.
            return (
                <code className="rounded-md bg-default px-1 py-0 font-mono text-sm text-foreground [overflow-wrap:anywhere]">
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
                        className={blockMy}
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
                    elevated={codeElevated}
                    className={blockMy}
                />
            )
        },
        blockquote: ({ children }) => (
            <blockquote className={`${reading ? "my-4 " : ""}space-y-2 rounded-r-xl border-l-2 border-accent bg-default/40 px-4 py-2 text-muted`}>
                {children}
            </blockquote>
        ),
        // Bold = weight only — no colour jump. plain mode drops the weight/italic → raw text.
        strong: ({ children }) => (plain ? <>{children}</> : <strong className="font-semibold">{children}</strong>),
        em: ({ children }) => (plain ? <>{children}</> : <em className="italic">{children}</em>),
        hr: () => <hr className={`${reading ? "my-6 " : ""}border-default`} />,
        ol: ({ children }) => <ol className={`${reading ? "my-4 " : ""}list-decimal space-y-2 pl-5 marker:text-muted`}>{children}</ol>,
        ul: ({ children }) => <ul className={`${reading ? "my-4 " : ""}list-disc space-y-2 pl-5 marker:text-muted`}>{children}</ul>,
        li: ({ children }) => (
            <ProseText elementType="li" size={bodySize} className="space-y-2 leading-relaxed">{children}</ProseText>
        ),
        p: ({ children, node }) => {
            // a paragraph whose ENTIRE content is one `**bold**` span is a "fake heading"
            // authoring idiom — read it as a section LABEL (muted, small), not a loud bold sentence.
            const soleChild = node?.children?.length === 1 ? node.children[0] : null
            const isStandaloneLabel = Boolean(
                soleChild && "tagName" in soleChild && soleChild.tagName === "strong",
            )
            if (isStandaloneLabel) {
                return <div className="text-sm text-muted">{children}</div>
            }
            return (
                <ProseText elementType="div" size={bodySize} className={reading ? "mb-4 leading-relaxed" : "leading-relaxed"}>{children}</ProseText>
            )
        },
        a: ({ href, children }) => {
        // plain mode: strip the link chrome (accent + underline) → raw text.
            if (plain) {
                return <>{children}</>
            }
            // Internal links navigate in-app; external links open a new tab.
            const isInternal = typeof href === "string" && href.startsWith("/")
            if (isInternal) {
                return (
                    <IntlLink href={href} className="!inline text-accent-soft-foreground underline underline-offset-4 decoration-[var(--separator-tertiary)]">
                        {children}
                    </IntlLink>
                )
            }
            return (
                <Link href={href} target="_blank" className="!inline text-accent-soft-foreground underline underline-offset-4 decoration-[var(--separator-tertiary)]">
                    {children}
                </Link>
            )
        },
    } as Components)
}
