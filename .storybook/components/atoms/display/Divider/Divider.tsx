/** @noSkeleton renders a rule between two things — there is no value behind it to wait for. */
import type { ReactNode } from "react"
import { Separator as HeroSeparator, cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

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
     * Anatomy tag for this component itself, so a parent can badge it as one
     * node. Without it, a parent would have to pass `showAnatomy` down instead,
     * which exposes the child's own internals as siblings.
     */
    anatPart?: string
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    /** @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * The base divider atom. See file header for the orientation + label contract.
 *
 * @param props - {@link DividerBaseProps}
 */
const DividerBase = ({
    orientation = "horizontal",
    variant = "default",
    label,
    showAnatomy = false,
    anatPart,
    className,
    classNames,
}: DividerBaseProps) => {
    // A labelled divider (horizontal only): a rule on each side of centered text.
    if (label !== undefined && orientation === "horizontal") {
        return (
            <div data-anat-part={anatPart} className={cn("flex w-full items-center gap-3", className, classNames)}>
                <HeroSeparator orientation="horizontal" variant={variant} className="flex-1" data-anat-part={showAnatomy ? "Separator" : undefined} />
                {/* Caller slot — `label` is free-form content the caller passed in,
                    not part of Divider's own anatomy, so this span stays unbadged. */}
                <span className="text-muted shrink-0 text-xs">
                    {label}
                </span>
                <HeroSeparator orientation="horizontal" variant={variant} className="flex-1" data-anat-part={showAnatomy ? "Separator" : undefined} />
            </div>
        )
    }
    return <HeroSeparator orientation={orientation} variant={variant} className={cn(className, classNames)} data-anat-part={anatPart ?? (showAnatomy ? "Separator" : undefined)} />
}

/**
 * `Divider.*` — the divider ATOM namespace. `Divider` is the single
 * constrained divider; orientation / label are LEAVES of it (prop-driven).
 */
export { DividerBase as Divider }
