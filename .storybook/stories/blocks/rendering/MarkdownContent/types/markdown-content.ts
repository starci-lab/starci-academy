import type {
    useTranslations,
} from "next-intl"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of the src markdown-content types.
 * Synced to `src` later.
 */

/** Translator returned by next-intl's `useTranslations`, passed to the renderers factory. */
export type MarkdownTranslator = ReturnType<typeof useTranslations>

/** Params for {@link buildMarkdownRenderers} — theme + translator drive the code blocks. */
export interface MarkdownRenderersParams {
    /** True when the app theme is dark; selects mermaid/shiki themes. */
    isDark: boolean
    /** Translator for table aria labels and diagram loading text. */
    t: MarkdownTranslator
    /** Figure captions keyed by trimmed mermaid source, paired from the following paragraph. */
    mermaidCaptions: Record<string, string>
    /**
     * Reading-grade typography: when true, body/headings render at the larger
     * long-form scale (16px body, stronger heading ladder) for full lesson
     * articles. Defaults to the compact scale used in cards / chat / modals.
     */
    reading?: boolean
    /**
     * Plain-text mode: strip INLINE markdown decoration to unstyled text — inline
     * `code`, `strong`, `em` and links render as their raw text. Block structure is
     * KEPT (paragraphs, lists, tables, fenced code blocks, mermaid, and the `:::muted`
     * arc-section labels). Cloze `{{cN::}}` is untouched (handled upstream).
     */
    plain?: boolean
    /**
     * Render fenced code blocks as RAISED cards (`bg-surface` + shadow) instead
     * of the default recessed wells (`bg-background`). Forwarded to {@link CodeToHtml}'s
     * `elevated` prop. Defaults off.
     */
    codeElevated?: boolean
}
