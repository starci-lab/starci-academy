"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { StackH } from "@/components/frames/Stack"

/** Representative week columns shown (the real grid is ~53, draggable past the viewport). */
const WEEK_COLUMNS = 26

/** Rows per week column (Sun→Sat). */
const WEEK_ROWS = 7

/** Year-switcher button placeholders (current + 2 back). */
const YEAR_BUTTONS = 3

/**
 * Loading placeholder for {@link import("../").OverviewContributions}: mirrors the
 * {@link import("@/components/blocks/profile/ContributionCalendarView").ContributionCalendarView}
 * heatmap — header (count + year switcher), the 7×N cell grid, and the Less→More
 * legend — at the same cell size / gaps so the box does not jump when data resolves.
 *
 * @param props - {@link OverviewContributionsSkeleton}
 */
export const OverviewContributionsSkeleton = ({ className }: WithClassNames<undefined>) => {
    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {/* header: count text (left) + year switcher (right) */}
            <StackH gap={4} principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                justify="between" align="center" items={[
                    () => <Skeleton.Typography type="body-sm" width="1/3" />,
                    () => (
                        <StackH gap={3} principle="flex-action"
                            explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                            align="center" items={
                                Array.from({ length: YEAR_BUTTONS }, (_, index) => () => (
                                    <Skeleton key={index} className="h-5 w-10 rounded-medium" />
                                ))
                            } />
                    ),
                ]} />

            {/* grid: weekday label column + N week columns of 7 cells — gap-[3px] is calendar cell pitch, not a house seam */}
            <div className="flex gap-[3px] overflow-hidden">
                <div className="w-8 shrink-0" />
                {Array.from({ length: WEEK_COLUMNS }).map((_, columnIndex) => (
                    <div key={columnIndex} className="flex shrink-0 flex-col gap-[3px]">
                        {Array.from({ length: WEEK_ROWS }).map((_cell, rowIndex) => (
                            <Skeleton key={rowIndex} className="size-3 shrink-0 rounded-sm" />
                        ))}
                    </div>
                ))}
            </div>

            {/* legend: Less → More (5 cells, right-aligned) */}
            <StackH gap={3} principle="chip-row"
                explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                justify="end" align="center" items={
                    Array.from({ length: 5 }, (_, index) => () => (
                        <Skeleton key={index} className="size-3 shrink-0 rounded-sm" />
                    ))
                } />
        </div>
    )
}
