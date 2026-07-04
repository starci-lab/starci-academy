/**
 * Minimal ambient types for the `latex.js` package (v0.12.6), which ships no type
 * declarations. Covers only the client-side rendering surface used by
 * {@link LatexCvRenderer}: constructing an `HtmlGenerator`, parsing a `.tex` source,
 * and reading the resulting DOM fragment.
 */
declare module "latex.js" {
    /** Options accepted by {@link HtmlGenerator}. */
    export interface HtmlGeneratorOptions {
        /** Disable client-side hyphenation (avoids loading hyphenation patterns). */
        hyphenate?: boolean
    }

    /** Generator that turns parsed LaTeX into browser DOM. */
    export class HtmlGenerator {
        constructor(options?: HtmlGeneratorOptions)
        /** The rendered document body as a detached DOM fragment. */
        domFragment(): DocumentFragment
        /** The rendered document body as a standalone HTML document. */
        htmlDocument(baseURL?: string): Document
        /** `<style>`/`<link>`/`<script>` nodes latex.js needs (optionally under `baseURL`). */
        stylesAndScripts(baseURL?: string): DocumentFragment
    }

    /** Base generator class (superclass of {@link HtmlGenerator}). */
    export class Generator {}

    /** Parse a LaTeX-subset source, driving the supplied generator; returns the generator. */
    export function parse(
        latex: string,
        options: { generator: HtmlGenerator },
    ): HtmlGenerator
}
