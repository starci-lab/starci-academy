import React from "react"
import type { Components } from "react-markdown"
import { isInlineCode } from "react-shiki"
import { Chip, cn, Link, Table } from "@heroui/react"
import {
    flattenMarkdownTableHeaderChildren,
    isMarkdownHeaderTableRowNode,
} from "./utils"
import { CodeToHtml } from "./CodeToHtml"
import { MermaidDiagram } from "./MermaidDiagram"
import type { MarkdownRenderersParams } from "./types"

/**
 * Builds the element-renderer map handed to `ReactMarkdown` so headings, tables, code
 * blocks, mermaid diagrams and inline elements use the app's HeroUI typography.
 * @param params - {@link MarkdownRenderersParams} theme flag + translator.
 * @returns A `Components` map keyed by markdown element name.
 */
export const buildMarkdownRenderers = ({
    isDark,
    t,
}: MarkdownRenderersParams): Components => ({
    h1: ({ children }) => (
        <div className="my-3 text-xl font-semibold text-foreground">{children}</div>
    ),
    h2: ({ children }) => (
        <div className="my-3 text-lg font-semibold text-foreground">{children}</div>
    ),
    h3: ({ children }) => (
        <div className="my-3 text-base font-semibold text-foreground">{children}</div>
    ),
    table: ({ children }) => (
        <Table className="my-2 bg-background" variant="primary">
            <Table.ScrollContainer>
                <Table.Content aria-label={t("markdown.tableAriaLabel")}>
                    {children}
                </Table.Content>
            </Table.ScrollContainer>
        </Table>
    ),
    thead: ({ children }) => (
        <Table.Header className="bg-background">
            {flattenMarkdownTableHeaderChildren(children)}
        </Table.Header>
    ),
    img: ({ src, alt }) => (
        <img src={src} alt={alt} className="my-2 bg-inherit rounded-3xl p-3" />
    ),
    tbody: ({ children }) => <Table.Body>{children}</Table.Body>,
    th: ({ children }) => <Table.Column>{children}</Table.Column>,
    td: ({ children }) => <Table.Cell>{children}</Table.Cell>,
    tr: ({ children, node }) =>
        isMarkdownHeaderTableRowNode(node) ? (
            <>{children}</>
        ) : (
            <Table.Row>{children}</Table.Row>
        ),
    code: (
        { children, className, node }
    ) => {
        const code = String(children).trim()
        const isInline = node ? isInlineCode(node) : undefined
        if (!isInline) {
            return children
        }
        return (
            <Chip
                size="sm"
                variant="secondary"
                color="accent"
                className={cn("font-mono text-sm", className)}
            >
                {code}
            </Chip>
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
                />
            )
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
    strong: ({ children }) => <strong className="font-semibold text-sm text-foreground">{children}</strong>,
    hr: () => <hr className="h-px my-3 " />,
    ol: ({ children }) => <ol className="list-decimal pl-5 my-2">{children}</ol>,
    p: ({ children }) => <div className="text-sm my-2 gap-1 leading-relaxed">{children}</div>,
    ul: ({ children }) => <ul className="list-disc pl-5 my-2">{children}</ul>,
    li: ({ children }) => <li className="my-2 leading-relaxed">{children}</li>,
    a: ({ href, children }) => (
        <Link href={href} target="_blank" className="text-sm text-accent inline my-2">
            {children}
        </Link>
    ),
})
