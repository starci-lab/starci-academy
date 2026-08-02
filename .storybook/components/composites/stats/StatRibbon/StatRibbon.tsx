import React from "react"
import { Card, cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { StatPair, type StatPairValueType } from "@sb-components/composites/stats/StatPair/StatPair"
import { ResponsiveRow } from "@sb-components/frames/ResponsiveRow/ResponsiveRow"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/StatRibbon`. Authored in Storybook (not `src`);
 * synced to `src` later.
 */

/** One statistic in a {@link StatRibbon} — a headline value with its caption. */
export interface StatRibbonItem {
    /** Stable key for the React list. */
    key: string
    /**
     * Headline statistic (number / short count), rendered large. `string`, not
     * `ReactNode` — forwarded straight into {@link StatPair}'s `value`, which
     * wraps it in `Typography` itself.
     */
    value: string
    /** Caption describing the value, rendered small + muted. `string` — see {@link StatRibbonItem.value}. */
    label: string
}

/** Props {@link StatRibbon} carries regardless of loading state. */
interface StatRibbonOwnProps {
    /** Value (title) size for every pair — defaults to `h4`; `body` = text-base. */
    valueType?: StatPairValueType
    /**
     * Add a border instead of relying on the card's `shadow-surface` — for when
     * the ribbon is NESTED on another surface (surface-in-surface), where the
     * shadow is invisible so a border must delineate it. The `!` beats HeroUI's
     * `.card { border: none !important }`.
     */
    bordered?: boolean
    /** Cell count to shimmer while `isSkeleton` (no real `items` yet). Defaults to `3`. */
    skeletonCount?: number
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * Props for {@link StatRibbon}. `items` is REQUIRED unless `isSkeleton` (§12b)
 * — a shimmer ribbon has no real stats to show yet.
 */
export type StatRibbonProps = StatRibbonOwnProps &
    (
        | { isSkeleton: true; items?: ReadonlyArray<StatRibbonItem> }
        | { isSkeleton?: false; items: ReadonlyArray<StatRibbonItem> }
    )

/**
 * A profile / hero stat strip: N {@link StatPair}s inside ONE `Card` — a single
 * horizontal row separated by vertical dividers when width is generous (`sm+`),
 * falling back to a 2-column grid on mobile where a 4-cell divider row won't fit.
 * The card + dividers live here, so features feed `items` instead of hand-rolling
 * the frame.
 *
 * @param props - {@link StatRibbonProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "StatRibbon" } as const

export const StatRibbon = ({
    items,
    valueType,
    bordered = false,
    isSkeleton = false,
    skeletonCount = 3,
    classNames,
}: StatRibbonProps) => {
    const cells = isSkeleton
        ? Array.from({ length: skeletonCount }, (_unused, index) => ({ key: String(index) }))
        : (items ?? [])
    return (
        <Card
            variant="default"
            className={cn(bordered && "!border !border-solid !border-default !shadow-none", classNames)}
            data-tier="composite"
            data-component="StatRibbon"
        >
            {/* Desktop: bleed the row to the card's inner edges (`@app-sm:-m-3` cancels the
                globals `.card { p-3 !important }`) so the per-cell `border-l` reaches the
                top+bottom border = FULL-HEIGHT. Cells carry their own padding instead. The
                divider is a per-cell `border-l` (Tailwind v4 here emits no `divide-*` rule).
                Mobile keeps the padded 2-col grid (no dividers there). */}
            <ResponsiveRow
                columns={2}
                at="sm"
                gap={4}
                className="@app-sm:-m-3"
                items={cells.map((item, index) => ({
                    key: item.key,
                    content: (
                        <div

                            className={cn(
                                "min-w-0 @app-sm:flex-1 @app-sm:px-6 @app-sm:py-3 @app-sm:first:pl-3 @app-sm:last:pr-3",
                                index > 0 && "@app-sm:border-l @app-sm:border-default",
                            )}
                        >
                            {isSkeleton ? (
                                <StatPair isSkeleton valueType={valueType} />
                            ) : (
                                <StatPair value={(item as StatRibbonItem).value} label={(item as StatRibbonItem).label} valueType={valueType} />
                            )}
                        </div>
                    ),
                }))}
            />
        </Card>
    )
}
