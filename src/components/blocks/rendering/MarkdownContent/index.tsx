"use client"

import React, { useMemo } from "react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { buildMarkdownRenderers } from "./map"
import {
    _MarkdownContent,
    extractMermaidCaptions,
    holdBackIncompleteMermaidFence,
    type MarkdownContentProps,
} from "./component"

// Re-export the colocated sub-renderers so the reuseable barrel surface stays identical.
export * from "./CodeToHtml"
export * from "./LayoutWidget"
export * from "./MermaidDiagram"

/** Props the connected {@link MarkdownContent} takes from its caller. */
export type MarkdownContentConnectedProps = Omit<MarkdownContentProps, "components"> & {
    /**
     * Plain-text mode: render authored content with INLINE markdown decoration
     * stripped to raw text (inline code, bold, italic, links) while keeping block
     * structure + `:::muted` arc labels + cloze. Opt-in for flashcard + mock-interview
     * surfaces; lesson/challenge content keeps full markdown.
     */
    plain?: boolean
    /**
     * Render fenced code blocks as RAISED cards (`bg-surface` + shadow) rather
     * than the default recessed wells (`bg-background`). Opt-in for surfaces that
     * render markdown on the bare page CANVAS (e.g. the Playground left pane).
     */
    codeElevated?: boolean
}

/**
 * Renders markdown with GFM and shared typography aligned with the app theme —
 * the CONNECTED half: reads the active theme/translator and memoizes the
 * element-renderer map (see {@link buildMarkdownRenderers}). See
 * `design/storybook/architecture/split.md`.
 * @param props - {@link MarkdownContentConnectedProps}
 */
export const MarkdownContent = ({ markdown, reading = false, arcSections = false, plain = false, codeElevated = false, className }: MarkdownContentConnectedProps) => {
    const theme = useTheme()
    const t = useTranslations()
    // hold back an unterminated trailing mermaid fence FIRST (same rule the
    // presentational half applies) so the caption scan never reads a mid-fence
    // partial diagram as an already-closed one.
    const stableMarkdown = useMemo(() => holdBackIncompleteMermaidFence(markdown), [markdown])
    const mermaidCaptions = useMemo(() => extractMermaidCaptions(stableMarkdown), [stableMarkdown])
    const components = useMemo(
        () => buildMarkdownRenderers({
            isDark: theme.theme === "dark",
            t,
            mermaidCaptions,
            reading,
            plain,
            codeElevated,
        }),
        [
            theme.theme,
            t,
            mermaidCaptions,
            reading,
            plain,
            codeElevated,
        ],
    )
    return (
        <_MarkdownContent
            markdown={markdown}
            reading={reading}
            arcSections={arcSections}
            components={components}
            className={className}
        />
    )
}
