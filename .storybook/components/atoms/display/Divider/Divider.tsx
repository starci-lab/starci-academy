import type { ReactNode } from "react"
import { Separator as HeroSeparator, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Divider`: the ONE constrained divider atom over HeroUI Separator.
 *
 * A dividing line, distinguished by PROP (leaf = composition):
 *   • horizontal            → `<Divider />` (default)
 *   • vertical              → `<Divider orientation="vertical" />` (needs a parent with height)
 *   • with a centered label → `<Divider label="OR" />` (rule | label | rule)
 *
 * HeroUI has NO `Divider` — the atom wraps `Separator` (renamed for the app's
 * vocabulary). A label is only valid when `orientation="horizontal"` (ignored on
 * vertical). The atom has NO skeleton (a static line, nothing to load).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Divider orientation. */
export type DividerOrientation = "horizontal" | "vertical"

/** Line weight/tone (HeroUI Separator `variant`). */
export type DividerVariant = "default" | "secondary" | "tertiary"

/** Props for {@link DividerBase}. */
export interface DividerBaseProps {
    /** Orientation. Default `horizontal`. */
    orientation?: DividerOrientation
    /** Line tone. Default `default`. */
    variant?: DividerVariant
    /** Optional centered label (horizontal only) → rule · label · rule. */
    label?: ReactNode
    /**
     * Anatomy tag for THIS component itself — so a PARENT can badge it as ONE node (§11a.1).
     *
     * ⭐ 2026-07-27 (deep-scan): without this prop, a parent can't name it, so the parent is
     * forced to pass `showAnatomy` down — which OPENS UP the child's insides, leaking its
     * grandchildren out as siblings. This is the ROOT cause of that whole class of bug, not
     * a symptom of it.
     */
    anatPart?: string
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    className?: string
}

/**
 * The base divider atom. See file header for the orientation + label contract.
 *
 * @param props - {@link DividerBaseProps}
 */
const DividerBase = ({ orientation = "horizontal", variant = "default", label, showAnatomy = false, anatPart, className }: DividerBaseProps) => {
    // A labelled divider (horizontal only): a rule on each side of centered text.
    if (label !== undefined && orientation === "horizontal") {
        return (
            <div data-anat-part={anatPart} className={cn("flex w-full items-center gap-3", className)}>
                <HeroSeparator orientation="horizontal" variant={variant} className="flex-1" data-anat-part={showAnatomy ? "Separator" : undefined} />
                {/* Caller slot (§ LOAI 3) — `label` is free-form content the caller passed in,
                    not a part of Divider's own anatomy, so this span stays unbadged. */}
                <span className="text-muted shrink-0 text-xs">
                    {label}
                </span>
                <HeroSeparator orientation="horizontal" variant={variant} className="flex-1" data-anat-part={showAnatomy ? "Separator" : undefined} />
            </div>
        )
    }
    return <HeroSeparator orientation={orientation} variant={variant} className={cn(className)} data-anat-part={anatPart ?? (showAnatomy ? "Separator" : undefined)} />
}

/**
 * `Divider.*` — the divider ATOM namespace. `Divider` is the single
 * constrained divider; orientation / label are LEAVES of it (prop-driven).
 */
export { DividerBase as Divider }
