"use client"

import { cn } from "@heroui/react"
import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"

const markdownComponents: Partial<Components> = {
    h1: ({ children }) => (
        <h1 className="mb-2 text-xl font-bold">{children}</h1>
    ),
    h2: ({ children }) => (
        <h2 className="mb-2 text-lg font-semibold">{children}</h2>
    ),
    p: ({ children }) => <p className="mb-2 text-sm">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
    a: ({ href, children }) => (
        <a href={href} className="text-primary underline">
            {children}
        </a>
    ),
}

export interface MarkdownContentProps {
    /** Markdown source string. */
    markdown: string
    /** Extra classes on the prose wrapper. */
    className?: string
}

/**
 * Renders markdown with GFM and shared typography aligned with the app theme.
 */
export const MarkdownContent = ({ markdown, className }: MarkdownContentProps) => {
    return (
        <div
            className={cn("prose prose-sm max-w-none dark:prose-invert", className)}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
            >
                {markdown}
            </ReactMarkdown>
        </div>
    )
}
