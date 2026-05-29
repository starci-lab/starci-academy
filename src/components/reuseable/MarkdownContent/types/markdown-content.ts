import type {
    useTranslations,
} from "next-intl"

/** Translator returned by next-intl's `useTranslations`, passed to the renderers factory. */
export type MarkdownTranslator = ReturnType<typeof useTranslations>

/** Params for {@link buildMarkdownRenderers} — theme + translator drive the code blocks. */
export interface MarkdownRenderersParams {
    /** True when the app theme is dark; selects mermaid/shiki themes. */
    isDark: boolean
    /** Translator for table aria labels and diagram loading text. */
    t: MarkdownTranslator
}
