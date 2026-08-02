"use client"

import React, { useEffect, useRef, useState } from "react"
import { codeToHtml } from "shiki"
import { cn } from "@heroui/react"
import { SnippetIcon } from "@/components/atoms/display/SnippetIcon"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of
 * `@/components/blocks/rendering/MarkdownContent/CodeToHtml`. Authored in
 * Storybook (not `src`); synced back to `src` later. The only rewire vs `src`:
 * the copy control is the real `SnippetIcon` ATOM already living in this design
 * system (`atoms/display/SnippetIcon`) instead of `src`'s own
 * `@/components/blocks/identity/SnippetIcon` — same component, just imported
 * from where this repo actually keeps it.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Proper display casing for common fence languages (teacher's call 2026-07-29: map
 * `typescript` to `TypeScript` — a blanket `text-transform: uppercase` reads
 * `TYPESCRIPT`/`DOCKERFILE` for everything, which is wrong for names that are properly
 * MIXED-case, not all-caps).
 * A language missing from this table falls back to the raw fence identifier as authored
 * (see {@link languageLabel}) rather than guessing a casing rule for it.
 */
const LANGUAGE_LABEL_MAP: Record<string, string> = {
    dockerfile: "Dockerfile",
    typescript: "TypeScript",
    ts: "TypeScript",
    tsx: "TSX",
    javascript: "JavaScript",
    js: "JavaScript",
    jsx: "JSX",
    python: "Python",
    py: "Python",
    bash: "Bash",
    sh: "Bash",
    shell: "Shell",
    yaml: "YAML",
    yml: "YAML",
    json: "JSON",
    sql: "SQL",
    go: "Go",
    golang: "Go",
    csharp: "C#",
    cs: "C#",
    java: "Java",
    html: "HTML",
    css: "CSS",
    markdown: "Markdown",
    md: "Markdown"}

/**
 * Resolves the label shown in the code block's header — proper casing for a known
 * language, or the raw fence identifier unchanged for anything not in the table.
 * @param language - The fence's language identifier as authored (e.g. `"dockerfile"`).
 */
const languageLabel = (language: string): string => LANGUAGE_LABEL_MAP[language.toLowerCase()] ?? language

/** Props for {@link CodeToHtml}. */
export interface CodeToHtmlProps {
    /** Source code to highlight. */
    code: string
    /** Shiki language id (e.g. `bash`, `ts`). */
    language: string
    /** Shiki theme id resolved from the current Storybook toolbar theme. */
    theme: string
    /**
     * Where the root element sits inside its parent, from the closed positioning
     * union. The block-rhythm margin between fences (`"my-4"`/`"my-3"`) has no
     * slot here on purpose — margins are excluded from `AllowedClassName` by
     * design (see `_allowed-class-name.ts` and `principles/margin.md`: it is the
     * seam between two things, not a component's own prop). `map.tsx` owns that
     * margin by wrapping this component's output in a plain `<div>` instead of
     * forwarding a free string in.
     */
    classNames?: Array<AllowedClassName>
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
 */
export const CodeToHtml = ({ code, language, theme, classNames }: CodeToHtmlProps) => {
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
            { rootMargin: "300px" })
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
                // A code block is card-like → 3xl. Recessed well (`border` + `bg-background`) is
                // the correct look on a reading surface/card — this composite always renders on
                // one, so (unlike `src`) there is no `elevated` variant to opt into here.
                "w-full max-w-full overflow-hidden rounded-3xl border border-default bg-background",
                classNames)}
        >
            {/* slim header: language label (left) + copy (right) — orients long lessons with many snippets */}
            <div className="flex items-center justify-between border-b border-default px-3 py-2">
                <span className="font-mono text-xs text-muted">{languageLabel(language)}</span>
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
