"use client"

import React, { useId } from "react"
import mermaid from "mermaid"
import useSWR from "swr"

/** Props for {@link MermaidDiagram}. */
export interface MermaidDiagramProps {
    /** Mermaid source string. */
    code: string
    /** Mermaid theme key resolved from the app theme. */
    theme: "default" | "dark"
    /** Translated loading text while the diagram is rendering. */
    loadingLabel: string
}

/**
 * Renders mermaid code blocks to SVG, cached per theme + source via SWR.
 *
 * Presentational: uses only UI-local hooks (`useId`) plus SWR's local cache to render the
 * diagram; no business logic. Marked `"use client"` for the browser-side mermaid renderer.
 * @param props - {@link MermaidDiagramProps}
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
        <div className="my-2 rounded-xl border  bg-background p-3 dark:border-zinc-600">
            {data ? (
                <div className="[&_svg]:h-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: data }} />
            ) : (
                <div className="text-sm text-muted">{loadingLabel}</div>
            )}
        </div>
    )
}
