import React from "react"
import { cn } from "@heroui/react"
import { ProgressCircle } from "@sb-components/atoms/display/Progress/Progress"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "ProgressRing" } as const

/** Custom label overrides the centered percentage with a fraction when the count reads clearer. */
/** Ring diameter + label type scale that one size step resolves to. */
interface ProgressRingSizeStyle {
    /** `Typography` atom `size` for the centered label. */
    label: "sm" | "base" | "h5"
}
/** Centered-label typography, keyed by the {@link ProgressRingProps.size} step. Ring diameter is owned by the house `ProgressCircle`. */
const SIZE_MAP = {
    sm: { label: "sm" },
    md: { label: "base" },
    lg: { label: "h5" },
} as const satisfies Record<"sm" | "md" | "lg", ProgressRingSizeStyle>
/**
 * A circular progress ring built on the house `ProgressCircle` atom, with a
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
    /** Ring diameter. `"sm"` / `"md"` (default) / `"lg"` — mapped to the house `ProgressCircle` size. */
    size?: "sm" | "md" | "lg"
    /** Fill tone. Defaults to `"accent"`; pass a semantic tone (success / warning / danger) when the VALUE carries meaning. */
    tone?: "accent" | "success" | "warning" | "danger"
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
 * ProgressRing renders a circular completion indicator: a house `ProgressCircle`
 * with a value label centered inside the ring and an optional caption underneath.
 * The circle cannot host arbitrary centered content, so the ring is wrapped in a
 * relative container with the label absolutely centered over the SVG.
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
    
}: ProgressRingProps) => {
    const { label: labelSize } = SIZE_MAP[size]
    // `value` is REQUIRED whenever `isSkeleton` is false (the discriminated union above) —
    // guaranteed by the type at every real call site — the `?? 0` only satisfies narrowing
    // across the destructure, and is never seen while `isSkeleton`.
    const safeValue = Math.min(100, Math.max(0, value ?? 0))
    const resolvedLabel = label ?? `${Math.round(safeValue)}%`
    const ariaLabel = caption ?? `${Math.round(safeValue)}%`

    return (
        <StackV
            gap={3}
            principle="sibling-stack"
            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
            align="center"
            isSkeleton={isSkeleton}
            items={[
                // Relative container: the ring fills it, the label overlays its center
                () => (
                    <div className={cn("relative inline-flex items-center justify-center")}>
                        <ProgressCircle
                            ariaLabel={ariaLabel}
                            value={safeValue}
                            max={100}
                            color={tone}
                            size={size}
                            isSkeleton={isSkeleton}
                        />
                        {isSkeleton ? null : (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <Typography size={labelSize} weight="semibold" text={resolvedLabel} />
                            </div>
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
