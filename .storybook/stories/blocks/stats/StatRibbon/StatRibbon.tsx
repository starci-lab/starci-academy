import React from "react"
import { Card, cn } from "@heroui/react"
import { StatPair, type StatPairValueType } from "../StatPair/StatPair"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/StatRibbon`. Authored in Storybook (not `src`);
 * synced to `src` later.
 */

/** One statistic in a {@link StatRibbon} — a headline value with its caption. */
export interface StatRibbonItem {
    /** Stable key for the React list. */
    key: string
    /** Headline statistic (number / short count), rendered large. */
    value: React.ReactNode
    /** Caption describing the value, rendered small + muted. */
    label: React.ReactNode
}

/** Props for {@link StatRibbon}. */
export interface StatRibbonProps {
    /** The stats to lay out (2–4), in order. Each becomes one {@link StatPair} cell. */
    items: ReadonlyArray<StatRibbonItem>
    /** Value (title) size for every pair — defaults to `h4`; `body` = text-base. */
    valueType?: StatPairValueType
    /**
     * Add a border instead of relying on the card's `shadow-surface` — for when
     * the ribbon is NESTED on another surface (surface-in-surface), where the
     * shadow is invisible so a border must delineate it. The `!` beats HeroUI's
     * `.card { border: none !important }`.
     */
    bordered?: boolean
    /** Extra classes on the root element. */
    className?: string
}

/**
 * A profile / hero stat strip: N {@link StatPair}s inside ONE `Card` — a single
 * horizontal row separated by vertical dividers when width is generous (`sm+`),
 * falling back to a 2-column grid on mobile where a 4-cell divider row won't fit.
 * The card + dividers live here, so features feed `items` instead of hand-rolling
 * the frame.
 *
 * @param props - {@link StatRibbonProps}
 */
export const StatRibbon = ({
    items,
    valueType,
    bordered = false,
    className,
}: StatRibbonProps) => {
    return (
        <Card
            variant="default"
            className={cn(bordered && "!border !border-solid !border-default !shadow-none", className)}
        >
            {/* Desktop: bleed the row to the card's inner edges (`@app-sm:-m-3` cancels the
                globals `.card { p-3 !important }`) so the per-cell `border-l` reaches the
                top+bottom border = FULL-HEIGHT. Cells carry their own padding instead. The
                divider is a per-cell `border-l` (Tailwind v4 here emits no `divide-*` rule).
                Mobile keeps the padded 2-col grid (no dividers there). */}
            <div className="grid grid-cols-2 gap-4 @app-sm:-m-3 @app-sm:flex @app-sm:items-stretch @app-sm:gap-0">
                {items.map((item, index) => (
                    <div
                        key={item.key}
                        className={cn(
                            "min-w-0 @app-sm:flex-1 @app-sm:px-6 @app-sm:py-3 @app-sm:first:pl-3 @app-sm:last:pr-3",
                            index > 0 && "@app-sm:border-l @app-sm:border-default",
                        )}
                    >
                        <StatPair value={item.value} label={item.label} valueType={valueType} />
                    </div>
                ))}
            </div>
        </Card>
    )
}
