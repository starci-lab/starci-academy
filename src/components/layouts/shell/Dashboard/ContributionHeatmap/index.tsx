"use client"

import React, {
    useState,
} from "react"
import {
    useQueryMyContributionCalendarSwr,
} from "@/hooks"
import {
    ContributionCalendarView,
} from "@/components/reuseable/ContributionCalendarView"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link ContributionHeatmap}. */
export type ContributionHeatmapProps = WithClassNames<undefined>

/**
 * The signed-in viewer's contribution heatmap on the dashboard. Thin container:
 * owns the selected year + self-fetches the viewer's own calendar per year, then
 * renders the shared {@link ContributionCalendarView}. `"use client"` for the
 * year state + SWR.
 *
 * @param props - optional className for the root element.
 */
export const ContributionHeatmap = ({
    className,
}: ContributionHeatmapProps) => {
    /** The year currently shown (defaults to the current calendar year). */
    const [year, setYear] = useState(() => new Date().getFullYear())

    // active days for the selected year (self-fetched, re-keyed on year)
    const { data } = useQueryMyContributionCalendarSwr(year)

    return (
        <ContributionCalendarView
            days={data ?? []}
            year={year}
            onYearChange={setYear}
            className={className}
        />
    )
}
