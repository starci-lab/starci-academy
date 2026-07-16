import React from "react"
import {
    Card,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { StatPair } from "@/components/blocks/stats/StatPair"

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
export interface StatRibbonProps extends WithClassNames<undefined> {
    /**
     * The stats to lay out (2–4), in order. Each becomes one {@link StatPair}
     * cell.
     */
    items: ReadonlyArray<StatRibbonItem>
}

/**
 * A profile / hero stat strip: N {@link StatPair}s inside ONE `Card` — a single
 * horizontal row separated by vertical dividers when width is generous (`sm+`),
 * falling back to a 2-column grid on mobile where a 4-cell divider row won't fit.
 * The card + dividers live here (the StatPair story's "Row" / "Grid" pattern made
 * reusable), so features feed `items` instead of hand-rolling the frame — replaces
 * the old per-stat {@link import("../MetricCard").MetricCard} grid on the profile
 * Challenges / Skills tabs.
 *
 * @param props - {@link StatRibbonProps}
 * @see Story: .storybook/stories/blocks/stats/StatRibbon/StatRibbon.stories
 */
export const StatRibbon = ({
    items,
    className,
}: StatRibbonProps) => {
    return (
        <Card variant="default" className={className}>
            <div className="grid grid-cols-2 gap-4 sm:flex sm:items-stretch sm:gap-0 sm:divide-x sm:divide-default">
                {items.map((item) => (
                    <div
                        key={item.key}
                        className="min-w-0 sm:flex-1 sm:px-6 sm:first:pl-0 sm:last:pr-0"
                    >
                        <StatPair value={item.value} label={item.label} />
                    </div>
                ))}
            </div>
        </Card>
    )
}
