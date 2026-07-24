import React from "react"
import type { ReactNode } from "react"
import { Typography, cn } from "@heroui/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the shared `DotChip` primitive. Authored in
 * Storybook (not `src`); synced to `src` later. NO `@/components` imports.
 *
 * The canonical "colored dot + muted label" chip: a small round dot followed by a
 * muted `body-xs` label, GitHub-repo-card style. No pill/box; the dot carries the
 * colour. Domain badges (difficulty, language, AI-model category …) shrink to just
 * their per-value map table + this delegate.
 *
 * Two mutually-exclusive ways to colour the dot:
 * - `dotClassName` — a Tailwind `bg-*` class (semantic/palette ramp), applied via `cn`.
 * - `dotColor` — a raw hex/CSS colour (external brand identity), applied via inline style.
 */

/** Props for {@link DotChip}. */
export interface DotChipProps {
    /** Visible label (already localized / cased by the caller). */
    label: ReactNode
    /** Tailwind `bg-*` class for the dot (e.g. `bg-emerald-500`). Applied via `cn`. */
    dotClassName?: string
    /** Raw hex/CSS colour for the dot (e.g. `#3178c6`). Applied via inline style. */
    dotColor?: string
    /** Extra classes on the wrapper. */
    className?: string
    /** Renders a skeleton mirroring the dot + label shape instead of real content. */
    isSkeleton?: boolean
    /** BlockAnatomy marker name for the root — set by the caller to expose this part. */
    anatPart?: string
}

/**
 * A small colour-coded dot followed by a muted label. Colour is supplied either as a
 * Tailwind `bg-*` class via {@link DotChipProps.dotClassName} or as a raw hex via
 * {@link DotChipProps.dotColor}. Deliberately unopinionated about which value maps to
 * which colour — the domain wrapper owns that.
 *
 * @param props - {@link DotChipProps}
 */
export const DotChip = ({ label, dotClassName, dotColor, className, isSkeleton, anatPart }: DotChipProps) => {
    if (isSkeleton) {
        return (
            <span className={cn("inline-flex items-center gap-2", className)} data-anat-part={anatPart}>
                <Skeleton className="size-3 shrink-0 rounded-full" />
                <Skeleton.Typography type="body-xs" width="w-16" />
            </span>
        )
    }

    return (
        <span className={cn("inline-flex items-center gap-2", className)} data-anat-part={anatPart}>
            <span
                aria-hidden
                className={cn("size-3 shrink-0 rounded-full", dotClassName)}
                style={dotColor ? { backgroundColor: dotColor } : undefined}
            />
            <Typography type="body-xs" color="muted">
                {label}
            </Typography>
        </span>
    )
}
