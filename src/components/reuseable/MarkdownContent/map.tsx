import React from "react"
import type { Components } from "react-markdown"
import { isInlineCode } from "react-shiki"
import { Link, Table, Text } from "@heroui/react"
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
import type { MarkdownRenderersParams } from "./types"

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
}: MarkdownRenderersParams): Components => ({
    h1: ({ children }) => (
        <Text elementType="div" size="xl" className="font-semibold">{children}</Text>
    ),
    h2: ({ children }) => (
        <Text elementType="div" size="lg" className="font-semibold">{children}</Text>
    ),
    h3: ({ children }) => (
        <Text elementType="div" size="base" className="font-semibold">{children}</Text>
    ),
    h4: ({ children }) => (
        <Text elementType="div" size="sm" className="font-semibold text-muted">{children}</Text>
    ),
    h5: ({ children }) => (
        <Text elementType="div" size="sm" className="font-semibold text-muted">{children}</Text>
    ),
    h6: ({ children }) => (
        <Text elementType="div" size="xs" className="font-semibold text-muted">{children}</Text>
    ),
    // Custom `:::muted` directive tags (see remarkMuted in ./index): small, muted label text.
    // `[&_*]:text-muted` forces the muted colour onto any inner `<p>` the container wraps.
    mutedblock: ({ children }: { children?: React.ReactNode }) => (
        <Text elementType="div" size="sm" className="font-semibold text-muted [&_*]:text-muted">{children}</Text>
    ),
    mutedtext: ({ children }: { children?: React.ReactNode }) => (
        <Text elementType="span" size="sm" className="font-semibold text-muted">{children}</Text>
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
        <blockquote className="space-y-1 rounded-r-xl border-l-2 border-accent bg-default/40 px-4 py-2 text-muted">
            {children}
        </blockquote>
    ),
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    hr: () => <hr className="border-default" />,
    ol: ({ children }) => <ol className="list-decimal space-y-0.5 pl-5 marker:text-muted">{children}</ol>,
    ul: ({ children }) => <ul className="list-disc space-y-0.5 pl-5 marker:text-muted">{children}</ul>,
    li: ({ children }) => (
        <Text elementType="li" size="sm" className="space-y-1 leading-relaxed">{children}</Text>
    ),
    p: ({ children }) => (
        <Text elementType="div" size="sm" className="leading-relaxed">{children}</Text>
    ),
    a: ({ href, children }) => (
        <Link href={href} target="_blank" className="!inline text-accent underline underline-offset-2">
            {children}
        </Link>
    ),
} as Components)
