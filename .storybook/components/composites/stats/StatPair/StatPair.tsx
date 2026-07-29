import React from "react"
import { Typography, Skeleton as HeroSkeleton } from "@heroui/react"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/StatPair`. Authored in Storybook (not `src`);
 * synced to `src` later.
 */

/** Value (title) typography size — `h4` (default) · `h5` · `body` (text-base). */
export type StatPairValueType = "h4" | "h5" | "body"

/** Props {@link StatPair} carries regardless of loading state. */
interface StatPairOwnProps {
    /** Value (title) size — defaults to `h4`; use `body` (text-base) for a smaller title (long strings). */
    valueType?: StatPairValueType
    /** Extra classes on the root element. */
    className?: string
    /** Anatomy tag: names the ROOT part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /**
     * Storybook-only: when true, the value/label `Typography` each emit a
     * `data-anat-part` so the anatomy panel can anchor badges. No visual effect.
     */
    showAnatomy?: boolean
}

/**
 * Props for {@link StatPair}. `value`/`label` are REQUIRED unless `isSkeleton`
 * (§12b) — a shimmer pair has no real stat to show yet.
 */
export type StatPairProps = StatPairOwnProps &
    (
        | { isSkeleton: true; value?: React.ReactNode; label?: React.ReactNode }
        | {
            isSkeleton?: false
            /**
             * The headline statistic — typically a number or short formatted count
             * (e.g. "1,204" or "12"). Rendered large and emphasized.
             */
            value: React.ReactNode
            /**
             * The caption describing what the value measures (e.g. "Followers").
             * Rendered small and muted beneath the value.
             */
            label: React.ReactNode
        }
    )

/**
 * A single count + label statistic, stacked vertically and left-aligned (value
 * `h4` over a muted caption). Presentational only: it takes its content via props
 * and is meant to sit inside a card / stat row alongside sibling pairs. No frame of
 * its own — the surrounding card supplies the surface and any dividers.
 *
 * @param props - {@link StatPairProps}
 */
export const StatPair = ({
    value,
    label,
    valueType = "h4",
    isSkeleton = false,
    className,
    anatPart,
    showAnatomy,
}: StatPairProps) => {
    if (isSkeleton) {
        return (
            <StackV gap="tight" align="start" anatPart={anatPart} className={className}>
                <HeroSkeleton className="h-5 w-14 rounded" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                <HeroSkeleton className="h-3 w-16 rounded" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
            </StackV>
        )
    }
    return (
        <StackV gap="flush" align="start" anatPart={anatPart} className={className}>
            <Typography
                type={valueType}
                weight="semibold"
                data-anat-part={showAnatomy ? "Typography" : undefined}
            >
                {value}
            </Typography>
            <Typography
                type="body-xs"
                color="muted"
                data-anat-part={showAnatomy ? "Typography" : undefined}
            >
                {label}
            </Typography>
        </StackV>
    )
}
