"use client"

import React, { useId } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { isInlineCode } from "react-shiki"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { codeToHtml } from "shiki"
import mermaid from "mermaid"
import { SnippetIcon } from "../SnippetIcon"
import { Chip, cn, Link, Table } from "@heroui/react"
import useSWR from "swr"

/**
 * Props for the CodeToHtml component.
 */
export interface CodeToHtmlProps {
    code: string
    language: string
    theme: string
}

/**
 * Converts code to HTML using Shiki.
 */
export const CodeToHtml = ({ code, language, theme }: CodeToHtmlProps) => {
    const { data } = useSWR(
        code,
        () => codeToHtml(code, { lang: language, theme }),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    )
    return ( 
        <div className="p-3 bg-background rounded-xl relative my-1.5">
            <div className="absolute top-3 right-3">
                <SnippetIcon copyString={code} />
            </div>
            <div className="[&_pre]:!bg-transparent [&_pre]:!p-0 text-sm" dangerouslySetInnerHTML={{ __html: data || "" }} />
        </div>
    )
}

/**
 * Props for Mermaid diagram renderer.
 */
export interface MermaidDiagramProps {
    /** Mermaid source string. */
    code: string
    /** Mermaid theme key resolved from app theme. */
    theme: "default" | "dark"
    /** Translated loading text while diagram is rendering. */
    loadingLabel: string
}

/**
 * Renders mermaid code blocks to SVG with SWR cache.
 */
export const MermaidDiagram = ({ code, theme, loadingLabel }: MermaidDiagramProps) => {
    const renderId = useId().replace(/:/g, "-")
    const { data } = useSWR(
        `mermaid:${theme}:${code}`,
        async () => {
            mermaid.initialize({
                startOnLoad: false,
                theme,
                securityLevel: "strict",
            })
            const { svg } = await mermaid.render(`mermaid-${renderId}`, code)
            return svg
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    return (
        <div className="my-2 rounded-xl border border-divider bg-background p-3 dark:border-zinc-600">
            {data ? (
                <div className="[&_svg]:h-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: data }} />
            ) : (
                <div className="text-sm text-muted">{loadingLabel}</div>
            )}
        </div>
    )
}
/**
 * Props for the MarkdownContent component.
 */
export interface MarkdownContentProps {
    /** Markdown source string. */
    markdown: string
    /** Extra classes on the prose wrapper. */
    className?: string
}

/**
 * Flattens thead row output (e.g. fragment wrapping columns) for `Table.Header`.
 */
function flattenMarkdownTableHeaderChildren(children: React.ReactNode): Array<React.ReactNode> {
    const flattened: Array<React.ReactNode> = []
    React.Children.forEach(children, (row) => {
        if (!React.isValidElement<{ children?: React.ReactNode }>(row)) {
            return
        }
        React.Children.forEach(row.props.children, (column) => {
            flattened.push(column)
        })
    })
    return flattened
}

/**
 * Detects header rows from the original HAST `tr` node (GFM uses `th` cells in thead).
 */
function isMarkdownHeaderTableRowNode(node: unknown): boolean {
    if (!node || typeof node !== "object") {
        return false
    }
    const element = node as {
        type?: string
        children?: Array<{ type?: string; tagName?: string }>
    }
    if (element.type !== "element") {
        return false
    }
    if (!Array.isArray(element.children) || element.children.length === 0) {
        return false
    }
    return element.children.every(
        (child) =>
            child.type === "element" &&
            typeof child.tagName === "string" &&
            child.tagName.toLowerCase() === "th",
    )
}

/**
 * Renders markdown with GFM and shared typography aligned with the app theme.
 */
export const MarkdownContent = ({ markdown }: MarkdownContentProps) => {
    const theme = useTheme()
    const t = useTranslations()
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
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
                                theme={theme.theme === "dark" ? "dark" : "default"}
                                loadingLabel={t("markdown.mermaidRendering")}
                            />
                        )
                    }
                    return (
                        <CodeToHtml
                            code={code}
                            language={lang}
                            theme={theme.theme === "dark"
                                ? "material-theme-darker"
                                : "material-theme-lighter"}
                        />
                    )
                },
                strong: ({ children }) => <strong className="font-semibold text-sm text-foreground">{children}</strong>,
                hr: () => <hr className="h-px my-3 border-divider" />,
                ol: ({ children }) => <ol className="list-decimal pl-5 my-2">{children}</ol>,
                p: ({ children }) => <div className="text-sm my-2 gap-1 leading-relaxed">{children}</div>,
                ul: ({ children }) => <ul className="list-disc pl-5 my-2">{children}</ul>,
                li: ({ children }) => <li className="my-2 leading-relaxed">{children}</li>,
                a: ({ href, children }) => (
                    <Link href={href} target="_blank" className="text-sm text-accent inline my-2">
                        {children}
                    </Link>
                ),
            }}
        >
            {markdown}
        </ReactMarkdown>
    )
}
