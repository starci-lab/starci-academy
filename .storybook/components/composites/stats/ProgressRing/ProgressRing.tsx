import React from "react"
import { ProgressCircle, cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/ProgressRing`. Authored in Storybook (not `src`);
 * synced to `src` later.
 */
/** Ring diameter + label type scale that one size step resolves to. */
interface ProgressRingSizeStyle {
    /** Diameter class of the ring. */
    ring: string
    /** `Typography` atom `size` for the centered label. */
    label: "sm" | "base" | "h5"
}
/** Ring diameter + centered-label typography, keyed by the {@link ProgressRingProps.size} step. */
const SIZE_MAP = {
    sm: { ring: "size-16", label: "sm" },
    md: { ring: "size-24", label: "base" },
    lg: { ring: "size-32", label: "h5" },
} as const satisfies Record<"sm" | "md" | "lg", ProgressRingSizeStyle>
/**
 * A circular progress ring built on the HeroUI `ProgressCircle` primitive, with a
 * value label centered inside the ring and an optional caption below. Tier-3
 * presentational — every piece of content arrives via props.
 */
interface ProgressRingOwnProps {
    /**
     * Centered label rendered inside the ring. Defaults to the rounded percentage
     * (e.g. `"68%"`). `string`, not `ReactNode` — the composite wraps it in
     * `Typography` itself, so it must be able to build it.
     */
    label?: string
    /**
     * Optional caption rendered below the ring — small and muted (`body-xs`).
     * `string` — see {@link ProgressRingOwnProps.label}.
     */
    caption?: string
    /** Ring diameter. `"sm"` (64px), `"md"` (96px, default), `"lg"` (128px). */
    size?: "sm" | "md" | "lg"
    /** Fill tone. Defaults to `"accent"`; pass a semantic tone (success / warning / danger) when the VALUE carries meaning. */
    tone?: "accent" | "success" | "warning" | "danger"
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
    /** `true` → tag the ring/caption skeleton bars with ``. */
}

/**
 * Props for {@link ProgressRing}. `value` is REQUIRED unless `isSkeleton`
 * (§12b) — a shimmer ring has no real percentage to show yet.
 */
export type ProgressRingProps = ProgressRingOwnProps &
    (
        | { isSkeleton: true; value?: number }
        | { isSkeleton?: false; value: number }
    )

/**
 * ProgressRing renders a circular completion indicator: a HeroUI `ProgressCircle`
 * with a value label centered inside the ring and an optional caption underneath.
 * The HeroUI `ProgressCircle` cannot host arbitrary centered content, so the ring
 * is wrapped in a relative container with the label absolutely centered over the SVG.
 *
 * @param props - {@link ProgressRingProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "ProgressRing" } as const

export const ProgressRing = ({
    value,
    label,
    caption,
    size = "md",
    tone = "accent",
    isSkeleton = false,
    classNames,
}: ProgressRingProps) => {
    const { ring, label: labelSize } = SIZE_MAP[size]
    // `value` is REQUIRED whenever `isSkeleton` is false (the discriminated union above) —
    // guaranteed by the type at every real call site — the `?? 0` only satisfies narrowing
    // across the destructure, and is never seen while `isSkeleton`.
    const safeValue = Math.min(100, Math.max(0, value ?? 0))
    const resolvedLabel = label ?? `${Math.round(safeValue)}%`
    const ariaLabel = caption ?? `${Math.round(safeValue)}%`

    return (
        <StackV
            gap={3}
            align="center"
            classNames={classNames}
            isSkeleton={isSkeleton}
            items={[
                // Relative container: the ring fills it, the label overlays its center
                () => (
                    <div className={cn("relative inline-flex items-center justify-center", ring)}>
                        {isSkeleton ? (
                            // ATOM GAP: `Progress.ProgressCircle`'s own skeleton is fixed to
                            // ITS diameters (10/14/20 for sm/md/lg), narrower than this ring's
                            // scale (16/24/32) — reusing it would shrink the ring then jump to
                            // full size the moment data lands, the exact thing a skeleton
                            // exists to prevent. Kept a plain, correctly-sized real element
                            // instead of a vendor `Skeleton` import.
                            <div className="size-full rounded-full bg-default" />
                        ) : (
                            <>
                                <ProgressCircle aria-label={ariaLabel} value={safeValue} color={tone}>
                                    {/* Inline size stretches the SVG to the wrapper so the overlay stays centered */}
                                    <ProgressCircle.Track style={{ width: "100%", height: "100%" }}>
                                        <ProgressCircle.TrackCircle />
                                        <ProgressCircle.FillCircle />
                                    </ProgressCircle.Track>
                                </ProgressCircle>
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                    <Typography size={labelSize} weight="semibold" text={resolvedLabel} />
                                </div>
                            </>
                        )}
                    </div>
                ),
                // Optional caption — small + muted, distinct from the centered value
                ...(caption !== undefined ? [() => (
                        <Typography size="xs" color="muted" align="center" isSkeleton={isSkeleton} text={caption} />
                )] : []),
            ]}
        />
    )
}