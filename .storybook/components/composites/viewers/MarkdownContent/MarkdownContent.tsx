import React from "react"
import ReactMarkdown from "react-markdown"
import remarkDirective from "remark-directive"
import remarkGfm from "remark-gfm"
import { cn } from "@heroui/react"
import { Accordion, type AccordionItem } from "@sb-components/atoms/navigation/Accordion/Accordion"
import { SnippetIcon } from "@sb-components/atoms/display/SnippetIcon/SnippetIcon"

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
 * SCOPE OF THIS PORT (teacher's call 2026-07-28). The standard document grammar
 * plus the accordion directive — headings, paragraphs, lists, emphasis, links,
 * inline code, fenced code, quotes, rules, images, tables, and
 * `::::accordion`/`:::panel`. The heavy widgets from the legacy renderer
 * (Mermaid, layout widgets, live React previews, code-preview tabs) are NOT
 * ported: each is a viewer in its own right and each carries its own runtime.
 * Half-porting one would leave a body that looks finished and renders wrong,
 * which every gate here would pass.
 *
 * TWO MEASURES. `reading` is the lesson body: bigger type, generous rhythm.
 * `compact` is for markdown quoted inside another surface, such as a chat answer
 * or a card, where the document is a passenger rather than the page.
 *
 * ⚠️ THE CLASSES BELOW ARE THE ONE PLACE HAND-WRITTEN SPACING IS CORRECT. A
 * viewer cannot reach for frames: it never sees its own children as nodes, only
 * as whatever the parser hands back. This is the same exemption §13z gives the
 * atom tier, for the same reason — there is no seam to own when the tree is not
 * yours.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** How much room the document gets. */
export type MarkdownMeasure = "reading" | "compact"

/**
 * Rewrite the `::::accordion` / `:::panel{title="…"}` container directives into
 * tags the renderer map can pick up. Ported from the legacy renderer unchanged:
 * the authoring syntax is already in written lessons, so it is not ours to change.
 */
interface DirectiveNode {
    type?: string
    name?: string
    attributes?: Record<string, string>
    data?: Record<string, unknown>
    children?: Array<unknown>
}

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

const REMARK_PLUGINS = [remarkGfm, remarkDirective, remarkAccordion]

/** Anything the parser hands back with only children — most of the grammar. */
interface MarkdownNodeProps {
    /** Whatever the parser put inside this element. */
    children?: React.ReactNode
}

/** A link node: the payload decides the target, the viewer only decides the skin. */
interface MarkdownLinkProps extends MarkdownNodeProps {
    /** Link target as authored. */
    href?: string
}

/** An image node — a raw URL plus its alt text, both straight from the payload. */
interface MarkdownImageProps {
    /** Image source as authored. */
    src?: string
    /** Alt text as authored; missing alt renders an empty string, never a guess. */
    alt?: string
}

/** A code node. A fenced block arrives with `language-*`; anything else is inline. */
interface MarkdownCodeProps extends MarkdownNodeProps {
    /** `language-*` for a fenced block, absent for inline code. */
    className?: string
}

/** One `:::panel{title="…"}` inside an `::::accordion` block. */
interface MarkdownPanelProps extends MarkdownNodeProps {
    /** Trigger-row title carried by the directive attribute. */
    title?: string
}

/** Props for {@link MarkdownContent}. */
export interface MarkdownContentProps {
    /** The document, as authored. This is the payload that decides the shape. */
    source: string
    /** How much room the document gets. Defaults to `"reading"`. */
    measure?: MarkdownMeasure
    /** Extra classes on the article wrapper. */
    className?: string
    /** When on, the article emits `data-anat-part` for a BlockAnatomy panel. */
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
    showAnatomy = false,
    anatPart,
}: MarkdownContentProps) => {
    const reading = measure === "reading"

    const components = {
        h1: ({ children }: MarkdownNodeProps) => (
            <h1 className={cn("font-semibold text-foreground", reading ? "mt-8 mb-3 text-2xl" : "mt-6 mb-2 text-xl")}>{children}</h1>
        ),
        h2: ({ children }: MarkdownNodeProps) => (
            <h2 className={cn("font-semibold text-foreground", reading ? "mt-8 mb-3 text-xl" : "mt-6 mb-2 text-lg")}>{children}</h2>
        ),
        h3: ({ children }: MarkdownNodeProps) => (
            <h3 className={cn("font-semibold text-foreground", reading ? "mt-6 mb-2 text-lg" : "mt-4 mb-2 text-base")}>{children}</h3>
        ),
        h4: ({ children }: MarkdownNodeProps) => (
            <h4 className={cn("font-semibold text-foreground", reading ? "mt-6 mb-2 text-base" : "mt-4 mb-2 text-sm")}>{children}</h4>
        ),
        p: ({ children }: MarkdownNodeProps) => (
            <p className={cn("text-foreground", reading ? "my-3 text-base leading-7" : "my-2 text-sm leading-6")}>{children}</p>
        ),
        ul: ({ children }: MarkdownNodeProps) => (
            <ul className={cn("list-disc pl-6", reading ? "my-3 space-y-1" : "my-2 space-y-1")}>{children}</ul>
        ),
        ol: ({ children }: MarkdownNodeProps) => (
            <ol className={cn("list-decimal pl-6", reading ? "my-3 space-y-1" : "my-2 space-y-1")}>{children}</ol>
        ),
        li: ({ children }: MarkdownNodeProps) => (
            <li className={cn("text-foreground", reading ? "text-base leading-7" : "text-sm leading-6")}>{children}</li>
        ),
        strong: ({ children }: MarkdownNodeProps) => (
            <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }: MarkdownNodeProps) => <em className="italic">{children}</em>,
        a: ({ href, children }: MarkdownLinkProps) => (
            <a href={href} className="text-accent underline underline-offset-2 hover:no-underline">{children}</a>
        ),
        blockquote: ({ children }: MarkdownNodeProps) => (
            <blockquote className={cn("border-l-2 border-default pl-4 text-muted", reading ? "my-4" : "my-3")}>{children}</blockquote>
        ),
        hr: () => <hr className={cn("border-default", reading ? "my-8" : "my-6")} />,
        img: ({ src, alt }: MarkdownImageProps) => (
            // A document's image is a raw URL from the payload, so `next/image` cannot
            // size it ahead of time — a plain tag is the honest renderer here.
            <img src={src} alt={alt ?? ""} className={cn("w-full rounded-2xl", reading ? "my-4" : "my-3")} />
        ),
        table: ({ children }: MarkdownNodeProps) => (
            // A document's table is as wide as its widest row, and that width is not
            // ours to decide — so it scrolls INSIDE its own box rather than making the
            // whole article scroll sideways.
            <div className={cn("overflow-x-auto rounded-2xl border border-default", reading ? "my-4" : "my-3")}>
                <table className="w-full border-collapse text-sm">{children}</table>
            </div>
        ),
        thead: ({ children }: MarkdownNodeProps) => <thead className="bg-default/40">{children}</thead>,
        tbody: ({ children }: MarkdownNodeProps) => <tbody>{children}</tbody>,
        tr: ({ children }: MarkdownNodeProps) => <tr className="border-b border-default last:border-0">{children}</tr>,
        th: ({ children }: MarkdownNodeProps) => <th className="px-3 py-2 text-left font-semibold text-foreground">{children}</th>,
        td: ({ children }: MarkdownNodeProps) => <td className="px-3 py-2 align-top text-foreground">{children}</td>,
        code: ({ className: codeClassName, children }: MarkdownCodeProps) => {
            // A fenced block arrives with `language-*`; anything else is inline code.
            if (codeClassName?.startsWith("language-")) {
                return <code className={codeClassName}>{children}</code>
            }
            return <code className="rounded bg-default/60 px-2 font-mono text-[0.9em] text-foreground">{children}</code>
        },
        pre: ({ children }: MarkdownNodeProps) => {
            const child = React.Children.only(children) as React.ReactElement<MarkdownCodeProps>
            const lang = /language-(\w+)/.exec(child.props.className ?? "")?.[1] ?? "text"
            const code = String(child.props.children ?? "").replace(/\n$/, "")
            return (
                <div className={cn("overflow-hidden rounded-2xl border border-default bg-default/30", reading ? "my-4" : "my-3")}>
                    <div className="flex items-center justify-between border-b border-default px-3 py-2">
                        <span className="font-mono text-xs text-muted">{lang}</span>
                        <SnippetIcon copyString={code} />
                    </div>
                    <pre className="overflow-x-auto px-3 py-3"><code className="font-mono text-xs leading-6 text-foreground">{code}</code></pre>
                </div>
            )
        },
        accordionblock: ({ children }: MarkdownNodeProps) => {
            // The parser hands back CHILDREN; the `Accordion` atom takes DATA. Reading
            // each panel's props here is the bridge — and it is the only place it can
            // happen, because nothing upstream ever sees these as panels.
            const items: Array<AccordionItem> = React.Children
                .toArray(children)
                .filter((child): child is React.ReactElement<MarkdownPanelProps> => React.isValidElement(child))
                .map((child, index) => ({
                    key: `panel-${index}`,
                    title: child.props.title ?? "",
                    content: child.props.children,
                }))
            return <div className={reading ? "my-4" : "my-3"}><Accordion items={items} /></div>
        },
        // Never rendered on its own — `accordionblock` above reads its props instead.
        accordionpanel: ({ children }: MarkdownNodeProps) => <>{children}</>,
    }

    return (
        <article
            data-anat-part={anatPart ?? (showAnatomy ? "MarkdownContent" : undefined)}
            className={cn("first:*:mt-0 last:*:mb-0", className)}
        >
            <ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={components as never}>
                {source}
            </ReactMarkdown>
        </article>
    )
}

export { MarkdownContent }
