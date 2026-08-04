"use client"

import React, { useId } from "react"
import mermaid from "mermaid"
import useSWR from "swr"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { _MermaidDiagram } from "./component"

/** Props the connected {@link MermaidDiagram} takes from its caller. */
export interface MermaidDiagramConnectedProps extends WithClassNames<undefined> {
    /** Mermaid source string. */
    code: string
    /** Mermaid theme key resolved from the app theme. */
    theme: "default" | "dark"
    /** Translated loading text while the diagram is rendering. */
    loadingLabel: string
    /** Translated accessible label for the click-to-zoom trigger. */
    expandLabel: string
    /** Figure caption paragraph that follows the diagram (e.g. "Figure 1: ..."), if any. */
    caption?: string
    /** Translated generic caption shown when the diagram has no authored caption. */
    fallbackLabel: string
}

/**
 * Renders mermaid code blocks to SVG, cached per theme + source via SWR — the
 * CONNECTED half: owns the (browser-only) `mermaid.render()` call, keyed by
 * theme + source so it's computed once per diagram and cached across
 * re-renders. See `design/storybook/architecture/split.md`.
 * @param props - {@link MermaidDiagramConnectedProps}
 */
export const MermaidDiagram = ({ code, theme, loadingLabel, expandLabel, caption, fallbackLabel, className }: MermaidDiagramConnectedProps) => {
    // Stable id so concurrent diagrams never collide on mermaid's render target id.
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
        <_MermaidDiagram
            svg={data ?? null}
            loadingLabel={loadingLabel}
            expandLabel={expandLabel}
            caption={caption}
            fallbackLabel={fallbackLabel}
            className={className}
        />
    )
}
