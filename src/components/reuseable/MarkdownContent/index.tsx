"use client"

import React, { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { isInlineCode } from "react-shiki"
import { useTheme } from "next-themes"
import { StarCiCode } from "@/components/atomic"
import { codeToHtml } from "shiki"
import { SnippetIcon } from "../SnippetIcon"

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
    const [html, setHtml] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    useEffect(() => {
        setIsLoading(true)
        codeToHtml(
            code, {
            lang: language,
            theme,
        }).then((html) => {
            setHtml(html)
            setIsLoading(false)
        })
    }, [code, language, theme])
    return (
        <>
            {
                isLoading ? (
                    <div className="p-2 bg-default/40 rounded-medium relative mb-2 last:mb-0">
                        <div className="absolute top-2 right-2">
                            <SnippetIcon copyString={code} />
                        </div>
                    </div>
                ) : (
                    <div className="p-2 bg-default/40 rounded-medium relative mb-2 last:mb-0">
                        <div className="absolute top-2 right-2">
                            <SnippetIcon copyString={code} />
                        </div>
                        <div className="[&_pre]:!bg-transparent [&_pre]:!p-0 text-sm" dangerouslySetInnerHTML={{ __html: html }} />
                    </div>
                )
            }
        </>
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
 * Renders markdown with GFM and shared typography aligned with the app theme.
 */
export const MarkdownContent = ({ markdown }: MarkdownContentProps) => {
    const theme = useTheme()
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ children }) => (
                    <div className="mb-2 text-2xl font-semibold last:mb-0">{children}</div>
                ),
                h2: ({ children }) => (
                    <div className="mb-2 text-xl font-semibold last:mb-0">{children}</div>
                ),
                h3: ({ children }) => (
                    <div className="mb-2 text-lg font-semibold last:mb-0">{children}</div>
                ),
                table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                        <table className="min-w-full">
                            {children}
                        </table>
                    </div>
                ),
                thead: ({ children }) => (
                    <thead>
                        {children}
                    </thead>
                ),
                th: ({ children }) => (
                    <th className="border px-4 py-2 text-left font-semibold">
                        {children}
                    </th>
                ),
                td: ({ children }) => (
                    <td className="border px-4 py-2">
                        {children}
                    </td>
                ),
                tr: ({ children }) => (
                    <tr>
                        {children}
                    </tr>
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
                        <StarCiCode className={className}>
                            {code}
                        </StarCiCode>
                    )
                },
                pre: ({ children }) => {
                    const child = React.Children.only(children) as React.ReactElement

                    const className = (child.props as { className?: string }).className || ""
                    const match = /language-(\w+)/.exec(className)
                    const lang = match?.[1] || "bash"

                    const code = String((child.props as { children?: React.ReactNode }).children || "").replace(/\n$/, "")

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
                hr: () => <div className="h-px my-2 border-divider" />,
                ol: ({ children }) => <div className="list-decimal pl-5 mb-2 last:mb-0 text-sm text-foreground-500">{children}</div>,
                p: ({ children }) => <div className="text-sm mb-2 last:mb-0 gap-1 leading-relaxed ">{children}</div>,
                ul: ({ children }) => <div className="list-disc pl-5 mb-2 last:mb-0 text-sm">{children}</div>,
                li: ({ children }) => <div className="mb-2 last:mb-0">{children}</div>,
                a: ({ href, children }) => (
                    <a href={href} className="text-primary underline text-sm">
                        {children}
                    </a>
                ),
            }}
        >
            {markdown}
        </ReactMarkdown>
    )
}
