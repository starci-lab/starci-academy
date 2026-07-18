"use client"

import React, { useEffect, useRef, useState } from "react"
import { codeToHtml } from "shiki"
import { cn } from "@heroui/react"
import { SnippetIcon } from "@/components/blocks/identity/SnippetIcon"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link CodeToHtml}. */
export interface CodeToHtmlProps extends WithClassNames<undefined> {
    /** Source code to highlight. */
    code: string
    /** Shiki language id (e.g. `bash`, `ts`). */
    language: string
    /** Shiki theme id resolved from the app theme. */
    theme: string
    /**
     * Surface treatment (both variants are `rounded-3xl` — a code block is
     * card-like). Default (`false`) = RECESSED well (`border border-default
     * bg-background`) — the correct look when the block sits ON a reading surface /
     * card (a bg-background inset reads as darker than the surface around it). Set
     * `true` for a RAISED card (`bg-surface shadow-surface`, NO border — shadow
     * does the lifting, axis-1 §16/§32) when the block sits on the page CANVAS
     * (`bg-background`), so it "floats up" instead of blending canvas-on-canvas.
     * Only opt in where the container is the bare canvas.
     */
    elevated?: boolean
}

/**
 * Converts a code block to highlighted HTML using Shiki.
 *
 * Presentational: runs Shiki in a `useEffect` and stores the resulting HTML in local state;
 * no business logic. Marked `"use client"` for the browser-side highlighter.
 *
 * PERF: highlighting is LAZY — only run Shiki when the block scrolls near the viewport
 * (IntersectionObserver). A long article with 20+ blocks won't highlight all at once on load
 * (Shiki/WASM is heavy); off-screen blocks show raw code (`<pre>`) until scrolled into view.
 * @param props - {@link CodeToHtmlProps}
 * @see Story: .storybook/stories/blocks/rendering/MarkdownContent/CodeToHtml/CodeToHtml.stories
 */
export const CodeToHtml = ({ code, language, theme, elevated = false, className }: CodeToHtmlProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    /** Whether the block has entered (near) the viewport yet — only then do we highlight. */
    const [isVisible, setIsVisible] = useState(false)
    /** Highlighted HTML; `null` keeps the raw `<pre>` fallback. */
    const [html, setHtml] = useState<string | null>(null)

    useEffect(() => {
        const el = containerRef.current
        if (!el || isVisible) {
            return
        }
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            // rootMargin: start highlighting 300px before the block enters the screen.
            { rootMargin: "300px" },
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [isVisible])

    // Run Shiki via useEffect (no SWR) directly client-side once the block is visible.
    // Changing code/language/theme must re-highlight. `cancelled` blocks setState after unmount /
    // when deps change mid-flight (avoids writing stale HTML over newer HTML).
    useEffect(() => {
        if (!isVisible) {
            return
        }
        let cancelled = false
        codeToHtml(code, { lang: language, theme })
            .then((out) => {
                if (!cancelled) {
                    setHtml(out)
                }
            })
            .catch((error) => {
                // Shiki error (lang/theme/WASM…): keep the raw `<pre>` fallback + log for debugging.
                console.error("CodeToHtml: shiki highlight failed", error)
            })
        return () => {
            cancelled = true
        }
    }, [isVisible, code, language, theme])

    return (
        <div
            ref={containerRef}
            className={cn(
                // BOTH variants = rounded-3xl (a code block is card-like → 3xl
                // regardless of treatment, thầy 2026-07-18). Only bg/shadow differ:
                // raised card ON canvas (`bg-surface shadow`, NO border — shadow
                // lifts, axis-1 §16/§32) vs recessed well ON a surface (`bg-background`
                // inset + border, so it doesn't fill-on-fill the surface around it).
                "w-full max-w-full overflow-hidden rounded-3xl",
                elevated
                    ? "bg-surface shadow-surface"
                    : "border border-default bg-background",
                className,
            )}
        >
            {/* slim header: language label (left) + copy (right) — orients long lessons with many snippets */}
            <div className="flex items-center justify-between border-b border-default px-3 py-2">
                <span className="font-mono text-xs uppercase text-muted">{language}</span>
                <SnippetIcon copyString={code} />
            </div>
            {html ? (
                <div
                    className="p-3 text-sm [&_code]:!whitespace-pre-wrap [&_code]:!break-words [&_pre]:!whitespace-pre-wrap [&_pre]:!break-words [&_pre]:!bg-transparent [&_pre]:!p-0"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            ) : (
                /* Fallback: always show raw code while Shiki hasn't finished / on error (avoids an empty box). */
                <pre className="p-3 text-sm whitespace-pre-wrap break-words">
                    <code>{code}</code>
                </pre>
            )}
        </div>
    )
}
