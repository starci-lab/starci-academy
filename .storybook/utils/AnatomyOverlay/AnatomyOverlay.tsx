"use client"

import React from "react"
import { type AnatomyTier } from "./anatomy-context"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TOOLING — AnatomyOverlay: marks ONE part so the anatomy tree can identify it.
 *
 * Simplified 2026-07-26 (teacher ruling): anatomy is only a DOM-TREE VIEWING TOOL, so
 * the overlay no longer paints anything — no dashed outline, no corner label, no
 * number badge, no click. It only emits an INVISIBLE marker carrying `data-anat-part`.
 *
 * Why drop paint: the label covered the component it annotated (anchor: smothering a
 * 60px chip so the text was unreadable) — more noise than help.
 *
 * Why KEEP the component instead of deleting it: ~20 call-sites still invoke it, and
 * the tree still needs a marker to identify the part. To reverse course, change ONE place.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type { AnatomyTier }

/** Props for the {@link AnatomyOverlay}. */
export interface AnatomyOverlayProps {
    /** Part name — shown in the anatomy tree. */
    label: string
    /** Kept for legacy call-site compatibility; the tree reads tier from `annotate`. */
    tier?: AnatomyTier
    /** Kept for legacy call-site compatibility; the overlay no longer paints a link. */
    href?: string
}

/** Invisible marker that tags a part for the anatomy tree. */
export const AnatomyOverlay = ({ label }: AnatomyOverlayProps) => (
    <span aria-hidden data-component={label} className="pointer-events-none absolute inset-0" />
)
