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
/**
 * The six tiers of the drawing, lowest first.
 *
 * `frame` + `composite` replaced the single `primitive` tier on 2026-07-27: what used to be
 * one folder was measurably two natures — 7 slot-agnostic frames (`Container`, `Grid`,
 * `Cluster`, `Split`, `Stack`, `DragScrollArea`, `ResizableRail`) versus 37 components that
 * own content roles. `Section`/`Page`/`ModalShell` moved to `composite` because they own a
 * TITLE; the discriminator is "slot-agnostic vs owns content", not the import count.
 *
 * `screen` was added that same day (teacher's call: "the 5 layers are identical in form"):
 * before that the union only had four non-atom tiers, so a screen had to masquerade as
 * `block` — the panel then printed the wrong badge on the very node that anchors the whole
 * tree. Note: this merges what used to be two stale, unmerged JSDoc blocks here — an older
 * one still claimed "five tiers" and "`primitive` is the OLD name of the `layout` tier",
 * both superseded by the six-tier split above.
 */
/**
 * `heroui` added 2026-07-27. Nodes that come straight from `@heroui/react` have no story of
 * OURS to click through to, so the old allowlist excluded them and the tree LIED BY OMISSION:
 * `PriceTag` renders a real `Popover`, openable, and the tree showed nothing.
 *
 * Naming the library tier honestly is better than hiding it. It also makes DRIFT visible: a
 * design-tier node sitting on `heroui` means the atom layer was skipped — exactly what §12
 * exists to catch, and now you can SEE it instead of grepping imports.
 */
/**
 * `design` REMOVED 2026-07-28 (teacher ruling "treat it as block importing block").
 *
 * The old boundary was "complete feature vs UI/UX only", and it was FUZZY: `PhaseScarcityNote`
 * hid itself on a business condition (sounds like a block) while `PriceTag` only formats money
 * (sounds like design), so every case needed a fresh judgement call.
 *
 * Dropping it makes each tier's test the SAME SHAPE of nested question:
 *   frame     does not know CONTENT
 *   composite knows content, does not know DOMAIN
 *   block     knows DOMAIN
 *   screen    composes blocks
 *
 * Costly consequence: `ContinueLearning` lost its reason to exist. It only existed because the
 * old rule forbade design knowing domain, so a wrapping block had to be invented to compose.
 */
export type AnatomyTier = "heroui" | "atom" | "frame" | "composite" | "block" | "screen"

/** Value provided by {@link BlockAnatomy} to the overlays nested under it. */
export interface AnatomyPanelValue {
    /** Ordinal for a part `name` (matches the overlay `label`), or `undefined` when not in the spec. */
    numberOf: (name: string) => number | undefined
}

/** Present only while inside a {@link BlockAnatomy} panel (else `null` → legacy overlay). */
export const AnatomyPanelContext = React.createContext<AnatomyPanelValue | null>(null)

/** Read the enclosing {@link BlockAnatomy} panel, if any. */
export const useAnatomyPanel = (): AnatomyPanelValue | null => React.useContext(AnatomyPanelContext)
