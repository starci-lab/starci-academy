import React from "react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"

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
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * Props for {@link StatPair}. `value`/`label` are REQUIRED unless `isSkeleton`
 * (§12b) — a shimmer pair has no real stat to show yet.
 */
export type StatPairProps = StatPairOwnProps &
    (
        | { isSkeleton: true; value?: string; label?: string }
        | {
            isSkeleton?: false
            /**
             * The headline statistic — typically a number or short formatted count
             * (e.g. "1,204" or "12"). Rendered large and emphasized. `string`, not
             * `ReactNode` — the composite wraps it in `Typography` itself, so it
             * must be able to build it.
             */
            value: string
            /**
             * The caption describing what the value measures (e.g. "Followers").
             * Rendered small and muted beneath the value. `string` — see
             * {@link StatPairProps.value}.
             */
            label: string
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
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "StatPair" } as const

/** `StatPair`'s `valueType` mapped onto the `Typography` atom's own size axis. */
const VALUE_SIZE: Record<StatPairValueType, "h4" | "h5" | "base"> = { h4: "h4", h5: "h5", body: "base" }

export const StatPair = ({
    value,
    label,
    valueType = "h4",
    isSkeleton = false,
    classNames}: StatPairProps) => {
    return (
        <StackV
            gap={1}
            align="start"
            classNames={classNames}
            items={[
                () => (
                    <Typography
                        size={VALUE_SIZE[valueType]}
                        weight="semibold"
                        isSkeleton={isSkeleton}
                        text={value}
                    />
                ),
                () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={label} />,
            ]}
        />
    )
}
