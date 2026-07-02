"use client"

import React, { useEffect, useRef, useState } from "react"
import { cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { LATEX_BASE_CSS } from "./latex-base-css"

/** Props for {@link LatexCvRenderer}. */
export interface LatexCvRendererProps {
    /** Raw LaTeX (`.tex`) source to render read-only. */
    latexSource: string
    /** Fired when latex.js throws (unsupported LaTeX) so the parent can show a fallback. */
    onError?: (error: unknown) => void
    /** Extra classes for the outer paper surface. */
    className?: string
}

/**
 * Client-only latex.js renderer. Parses the `.tex` source into a DOM fragment and mounts it
 * inside a **shadow root** on a white "paper" surface, so latex.js's own stylesheet (which
 * targets `body`/`.page`/`:root`) is fully isolated from — and does not leak into — the
 * dark-themed app chrome.
 *
 * latex.js needs browser DOM APIs (it touches `document` at construction), so this component
 * is only ever loaded via `next/dynamic` with `ssr: false`. On a parse error it clears the
 * container and notifies {@link LatexCvRendererProps.onError} so the parent can degrade to a
 * "download the .tex instead" message.
 *
 * @param props - {@link LatexCvRendererProps}
 */
export const LatexCvRenderer = ({ latexSource, onError, className }: LatexCvRendererProps) => {
    const t = useTranslations()
    const hostRef = useRef<HTMLDivElement>(null)
    const shadowRef = useRef<ShadowRoot | null>(null)
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        let cancelled = false
        const host = hostRef.current
        if (!host) {
            return
        }

        // Attach the shadow root once; reuse it on subsequent source changes.
        if (!shadowRef.current) {
            shadowRef.current = host.shadowRoot ?? host.attachShadow({ mode: "open" })
        }
        const shadow = shadowRef.current

        const render = async () => {
            setFailed(false)
            try {
                // Dynamic import so the heavy latex.js bundle only loads in the browser.
                const latexjs = await import("latex.js")
                if (cancelled) {
                    return
                }
                const generator = new latexjs.HtmlGenerator({ hyphenate: false })
                latexjs.parse(latexSource, { generator })

                // latex.js emits `.body`/margin columns that expect a grid parent (`.page`).
                const page = document.createElement("div")
                page.className = "page"
                page.appendChild(generator.domFragment())

                const style = document.createElement("style")
                style.textContent = LATEX_BASE_CSS

                shadow.replaceChildren(style, page)
            } catch (error) {
                if (cancelled) {
                    return
                }
                shadow.replaceChildren()
                setFailed(true)
                onError?.(error)
            }
        }

        void render()

        return () => {
            cancelled = true
        }
    }, [
        latexSource,
        onError,
    ])

    return (
        <div
            className={cn(
                "min-h-0 flex-1 overflow-auto rounded-2xl bg-white p-4 text-black shadow-inner sm:p-6",
                className,
            )}
        >
            {/* latex.js output is mounted into this element's shadow root (CSS-isolated). */}
            <div ref={hostRef} aria-label={t("cv.generate.previewAria")} />
            {failed && (
                <p className="text-sm text-neutral-500">
                    {t("cv.generate.renderFallback")}
                </p>
            )}
        </div>
    )
}
