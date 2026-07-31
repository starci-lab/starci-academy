/** @noSkeleton renders a rule between two things — there is no value behind it to wait for. */
import type { ReactNode } from "react"
import { Separator as HeroSeparator, cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Divider`: the ONE constrained divider atom over HeroUI Separator.
 *
 * A dividing line, distinguished by PROP (leaf = composition):
 *   • horizontal            → `<Divider />` (default)
 *   • vertical              → `<Divider orientation="vertical" />` (needs a parent with height)
 *   • with a centered label → `<Divider label="OR" />` (rule | label | rule)
 *   • inline mark           → `<Divider shape="inline" />` (a glyph sitting inside running text)
 *
 * HeroUI has NO `Divider` — the atom wraps `Separator` (renamed for the app's
 * vocabulary). A label is only valid when `orientation="horizontal"` (ignored on
 * vertical). `shape="inline"` skips `Separator` entirely: `orientation` and
 * `variant` describe a line's geometry, and an inline mark has neither — it is a
 * glyph the width of a character, not a track the width of its container. The atom
 * has NO skeleton (a static line, nothing to load).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Divider orientation. */
export type DividerOrientation = "horizontal" | "vertical"

/** Line weight/tone (HeroUI Separator `variant`). Ignored when `shape` is `inline`. */
export type DividerVariant = "default" | "secondary" | "tertiary"

/** Visual form the divider takes. */
export type DividerShape =
    /** A HeroUI Separator line — stretches to fill its track. */
    | "rule"
    /** A small glyph sitting on the surrounding text's baseline, sized and coloured for running text. */
    | "inline"

/** Props for {@link DividerBase}. */
export interface DividerBaseProps {
    /** Orientation. Default `horizontal`. Ignored when `shape` is `inline`. */
    orientation?: DividerOrientation
    /** Line tone. Default `default`. Ignored when `shape` is `inline`. */
    variant?: DividerVariant
    /** Optional centered label (horizontal only) → rule · label · rule. Ignored when `shape` is `inline`. */
    label?: ReactNode
    /**
     * Visual form. Default `rule`. `inline` renders a baseline mark sized for
     * running text and coloured `currentColor`, for a divider that sits between
     * two pieces of text rather than a track spanning a container.
     */
    shape?: DividerShape
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
    shape = "rule",
    className,
    classNames,
}: DividerBaseProps) => {
    // An inline mark: a glyph on the surrounding text's baseline, not a Separator
    // track — it takes `currentColor` and no fixed size, so it tints and scales
    // with whatever row it sits in.
    if (shape === "inline") {
        return (
            <span
                aria-hidden
                className={cn("text-current select-none", className, classNames)}
            >
                ·
            </span>
        )
    }
    // A labelled divider (horizontal only): a rule on each side of centered text.
    if (label !== undefined && orientation === "horizontal") {
        return (
            <div className={cn("flex w-full items-center gap-3", className, classNames)}>
                <HeroSeparator orientation="horizontal" variant={variant} className="flex-1" />
                <span className="text-muted shrink-0 text-xs">
                    {label}
                </span>
                <HeroSeparator orientation="horizontal" variant={variant} className="flex-1" />
            </div>
        )
    }
    return <HeroSeparator orientation={orientation} variant={variant} className={cn(className, classNames)} />
}

/**
 * `Divider.*` — the divider ATOM namespace. `Divider` is the single
 * constrained divider; orientation / label are LEAVES of it (prop-driven).
 */
export { DividerBase as Divider }
