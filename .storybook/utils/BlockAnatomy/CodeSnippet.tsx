"use client"

import { useEffect, useState } from "react"
import { codeToHtml } from "shiki"
import { cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL — a SELF-CONTAINED Shiki code block for the anatomy panel.
 * Deliberately NOT the app's `CodeToHtml` (dev tooling shouldn't import from the
 * app render tree) — same Shiki highlighter, minimal surface. Shows raw `<pre>`
 * until Shiki resolves, then swaps in the highlighted HTML.
 */
export interface CodeSnippetProps {
    /** Source snippet. */
    code: string
    /** Shiki language id. Default `tsx`. */
    language?: string
    /** Pick the dark Shiki theme (caller detects the surrounding `.dark`). */
    isDark?: boolean
    className?: string
}

/**
 * @param props - {@link CodeSnippetProps}
 */
export const CodeSnippet = ({ code, language = "tsx", isDark = false, className }: CodeSnippetProps) => {
    const [html, setHtml] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        codeToHtml(code, { lang: language, theme: isDark ? "material-theme-darker" : "material-theme-lighter" })
            .then((out) => {
                if (!cancelled) {
                    setHtml(out)
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setHtml(null)
                }
            })
        return () => {
            cancelled = true
        }
    }, [code, language, isDark])

    // Highlighted: Shiki emits its own `<pre>` — strip its inline bg, keep our frame.
    if (html) {
        return (
            <div
                className={cn(
                    "overflow-x-auto rounded-xl border border-default-200 text-xs leading-relaxed [&_pre]:m-0 [&_pre]:!bg-transparent [&_pre]:p-3",
                    className,
                )}
                dangerouslySetInnerHTML={{ __html: html }}
            />
        )
    }

    // Fallback until Shiki resolves.
    return (
        <pre className={cn("overflow-x-auto rounded-xl border border-default-200 p-3 font-mono text-xs leading-relaxed text-foreground", className)}>
            <code>{code}</code>
        </pre>
    )
}
