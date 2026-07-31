import React from "react"
import { ProgressCircle, Typography as HeroTypography, cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ProgressCircle as ProgressCircleAtom } from "@sb-components/atoms/display/Progress/Progress"
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
    /** Typography step of the centered label. */
    label: "body-sm" | "body" | "h5"
}
/** Ring diameter + centered-label typography, keyed by the {@link ProgressRingProps.size} step. */
const SIZE_MAP = {
    sm: { ring: "size-16", label: "body-sm" },
    md: { ring: "size-24", label: "body" },
    lg: { ring: "size-32", label: "h5" },
} as const satisfies Record<"sm" | "md" | "lg", ProgressRingSizeStyle>
/**
 * A circular progress ring built on the HeroUI `ProgressCircle` primitive, with a
 * value label centered inside the ring and an optional caption below. Tier-3
 * presentational — every piece of content arrives via props.
 */
interface ProgressRingOwnProps {
    /** Centered label rendered inside the ring. Defaults to the rounded percentage (e.g. `"68%"`). */
    label?: React.ReactNode
    /** Optional caption rendered below the ring — small and muted (`body-xs`). */
    caption?: React.ReactNode
    /** Ring diameter. `"sm"` (64px), `"md"` (96px, default), `"lg"` (128px). */
    size?: "sm" | "md" | "lg"
    /** Fill tone. Defaults to `"accent"`; pass a semantic tone (success / warning / danger) when the VALUE carries meaning. */
    tone?: "accent" | "success" | "warning" | "danger"
    /** @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
    /** Anatomy tag: names the ROOT part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** `true` → tag the ring/caption skeleton bars with `data-anat-part="Skeleton"`. */
    showAnatomy?: boolean
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
export const ProgressRing = ({
    value,
    label,
    caption,
    size = "md",
    tone = "accent",
    isSkeleton = false,
    className,
    classNames,
    anatPart,
    showAnatomy = false,
}: ProgressRingProps) => {
    const { ring, label: labelType } = SIZE_MAP[size]
    if (isSkeleton) {
        return (
            <StackV
                gap="related"
                align="center"
                className={className}
                classNames={classNames}
                anatPart={anatPart}
                body={
                    <>
                        {/*
                         * The real ring below draws the vendor `ProgressCircle` compound
                         * directly (plus a centered label overlay the atom doesn't support),
                         * but a loading ring has no label to overlay yet — so the plain
                         * shimmer circle the `Progress.ProgressCircle` atom already draws
                         * for its own `isSkeleton` is the same shape, just sized to `ring`.
                         */}
                        <ProgressCircleAtom isSkeleton showAnatomy={showAnatomy} className={ring} />
                        {caption !== undefined ? (
                            <Typography size="xs" isSkeleton showAnatomy={showAnatomy} />
                        ) : null}
                    </>
                }
            />
        )
    }
    // `value` is REQUIRED whenever `isSkeleton` is false (the discriminated union above) —
    // already guaranteed by the early return at `isSkeleton` — the `?? 0` only satisfies
    // narrowing across the destructure, it never actually fires.
    const safeValue = Math.min(100, Math.max(0, value ?? 0))
    const resolvedLabel = label ?? `${Math.round(safeValue)}%`
    const ariaLabel = typeof caption === "string" ? caption : `${Math.round(safeValue)}%`
    const ringVisual = (
        <>
            {/* Relative container: the ring fills it, the label overlays its center */}
            <div className={cn("relative inline-flex items-center justify-center", ring)}>
                <ProgressCircle aria-label={ariaLabel} value={safeValue} color={tone}>
                    {/* Inline size stretches the SVG to the wrapper so the overlay stays centered */}
                    <ProgressCircle.Track style={{ width: "100%", height: "100%" }}>
                        <ProgressCircle.TrackCircle />
                        <ProgressCircle.FillCircle />
                    </ProgressCircle.Track>
                </ProgressCircle>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <HeroTypography type={labelType} weight="semibold">
                        {resolvedLabel}
                    </HeroTypography>
                </div>
            </div>
            {/* Optional caption — small + muted, distinct from the centered value */}
            {caption ? (
                <Typography size="xs" color="muted"
 align="center" text={caption} />
            ) : null}
        </>
    )
    return (
        <StackV gap="related" align="center" className={className} classNames={classNames} anatPart={anatPart} body={ringVisual} />
    )
}