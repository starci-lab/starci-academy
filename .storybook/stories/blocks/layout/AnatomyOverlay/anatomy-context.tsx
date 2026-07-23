import React from "react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL — shared anatomy types + the panel context.
 *
 * When a {@link BlockAnatomy} panel wraps a block, it provides this context. Every
 * {@link AnatomyOverlay} inside then switches from the heavy dashed-box + full tag
 * to a tiny NUMBERED anchor (the panel owns the legend/tree that decodes the
 * numbers) — so labels never overlap the component's content. Outside a panel the
 * overlay keeps its legacy look, so blocks not yet migrated are unaffected.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Which tier the annotated part is — drives dot/badge colour across the anatomy tools. */
export type AnatomyTier = "primitive" | "design" | "block"

/** Value provided by {@link BlockAnatomy} to the overlays nested under it. */
export interface AnatomyPanelValue {
    /** Ordinal for a part `name` (matches the overlay `label`), or `undefined` when not in the spec. */
    numberOf: (name: string) => number | undefined
}

/** Present only while inside a {@link BlockAnatomy} panel (else `null` → legacy overlay). */
export const AnatomyPanelContext = React.createContext<AnatomyPanelValue | null>(null)

/** Read the enclosing {@link BlockAnatomy} panel, if any. */
export const useAnatomyPanel = (): AnatomyPanelValue | null => React.useContext(AnatomyPanelContext)
