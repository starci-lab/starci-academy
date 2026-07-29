import React from "react"
import type { ReactNode } from "react"
import { Chip, cn, Skeleton as HeroSkeleton } from "@heroui/react"

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
 */
export type HighlightChipTone = "neutral" | "success" | "warning" | "danger" | "accent"

/** Props every {@link HighlightChip} carries regardless of loading state. */
interface HighlightChipOwnProps extends WithClassNames<undefined> {
    /**
     * Semantic tone driving the soft-tinted color. Defaults to "neutral".
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
 * Maps a {@link HighlightChipTone} to the matching HeroUI Chip color
 * (the `soft` variant renders the `bg-<tone>/10 text-<tone>` tint).
 */
const toneToColor: Record<HighlightChipTone, "default" | "success" | "warning" | "danger" | "accent"> = {
    neutral: "default",
    success: "success",
    warning: "warning",
    danger: "danger",
    accent: "accent",
}

/**
 * Stat / meta chip with a highlighted value: a soft-tinted pill rendering an
 * optional leading icon, a bold `value`, then a `label` — e.g. "24 Module",
 * "276 Bài thực hành". Pure and props-only (tone drives the color). Used in the
 * `PageHeader` meta row to show a course's figures.
 */
export const HighlightChip = ({ tone = "neutral", icon, value, label, isSkeleton = false, className }: HighlightChipProps) => {
    if (isSkeleton) {
        return <HeroSkeleton className={cn("h-6 w-20 rounded-full", className)} />
    }
    return (
        <Chip
            color={toneToColor[tone]}
            variant="soft"
            size="sm"
            className={className}
        >
            {icon}
            <Chip.Label>
                <span className="font-medium">{value}</span> {label}
            </Chip.Label>
        </Chip>
    )
}
