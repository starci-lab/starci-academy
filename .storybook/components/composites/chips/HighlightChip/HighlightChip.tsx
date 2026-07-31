import React from "react"
import type { ReactNode } from "react"
import { Chip, cn, Skeleton as HeroSkeleton } from "@heroui/react"
import type { ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/chips/HighlightChip`. Authored in Storybook (not
 * `src`); synced to `src` later. The shared `WithClassNames` base is inlined
 * locally to keep the port free of `@/` imports.
 */

/** Local mirror of the shared `WithClassNames` base (avoids a `@/` import). */
interface WithClassNames<T> {
    classNames?: T
    className?: string
}

/**
 * Semantic tone of the highlight chip — drives the soft tint
 * (`bg-<tone>/10 text-<tone>`). Neutral maps to the default color.
 *
 * Alias, not a redeclaration (thầy chốt 2026-07-29): the atom {@link ChipTone}
 * already carries these exact five values in this exact order — a hand-typed
 * copy here was a second source of truth for the same vocabulary.
 */
export type HighlightChipTone = ChipTone

/** Props every {@link HighlightChip} carries regardless of loading state. */
interface HighlightChipOwnProps extends WithClassNames<Array<AllowedClassName>> {
    /**
     * Semantic tone driving the soft-tinted color. Defaults to "default" (trung lập).
     */
    tone?: HighlightChipTone
    /**
     * Optional leading icon (typically a Phosphor `*Icon`) before the value.
     */
    icon?: ReactNode
}

/**
 * Props for the {@link HighlightChip} block. `value`/`label` are REQUIRED unless
 * `isSkeleton` (§12b) — a shimmer pill has no figure to show yet.
 */
export type HighlightChipProps = HighlightChipOwnProps &
    (
        | { isSkeleton: true; value?: ReactNode; label?: ReactNode }
        | { isSkeleton?: false; value: ReactNode; label: ReactNode }
    )

/**
 * Stat / meta chip with a highlighted value: a soft-tinted pill rendering an
 * optional leading icon, a bold `value`, then a `label` — e.g. "24 Module",
 * "276 Bài thực hành". Pure and props-only (tone drives the color). Used in the
 * `PageHeader` meta row to show a course's figures.
 */
export const HighlightChip = ({ tone = "default", icon, value, label, isSkeleton = false, className, classNames }: HighlightChipProps) => {
    if (isSkeleton) {
        // STOPPED (COMPOSITE-10): the real branch below renders `Chip` straight
        // from `@heroui/react` with `size="sm"`, not the house `Chip` atom
        // (`@sb-components/atoms/chips/Chip/Chip`, imported here only for its
        // `ChipTone` type). That atom has no `size` prop — its own skeleton
        // renders the un-sized `.chip` padding (24px tall), not the 20px
        // `size="sm"` box this component actually draws — so forwarding
        // `isSkeleton` to it would change the loading pill's height, not just
        // its shape. Left hand-drawn until the real branch is migrated onto
        // the atom.
        return <HeroSkeleton className={cn("h-6 w-20 rounded-full", className, classNames)} />
    }
    return (
        <Chip
            color={tone}
            variant="soft"
            size="sm"
            className={cn(className, classNames)}
        >
            {icon}
            <Chip.Label>
                <span className="font-medium">{value}</span> {label}
            </Chip.Label>
        </Chip>
    )
}
