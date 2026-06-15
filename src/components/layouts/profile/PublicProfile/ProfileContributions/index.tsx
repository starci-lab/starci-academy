"use client"

import React, {
    useState,
} from "react"
import {
    useParams,
} from "next/navigation"
import {
    useQueryUserContributionCalendarSwr,
    useQueryUserProfileSwr,
} from "@/hooks"
import {
    ContributionCalendarView,
} from "@/components/reuseable/ContributionCalendarView"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link ProfileContributions}. */
export type ProfileContributionsProps = WithClassNames<undefined>

/**
 * A profile owner's contribution heatmap (GitHub-style), shown on the public
 * profile so anyone can see another user's learning activity. Self-contained
 * container: reads the username from the route, resolves it to the entity id the
 * calendar query keys off (the profile fetch is SWR-deduped with the parent +
 * tabs), owns the selected year, and renders the shared
 * {@link ContributionCalendarView}.
 *
 * @param props - optional className for the root element.
 */
export const ProfileContributions = ({
    className,
}: ProfileContributionsProps) => {
    // route carries the username; resolve it to the entity id the calendar keys off
    const username = String(useParams().username)
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null

    /** The year currently shown (defaults to the current calendar year). */
    const [year, setYear] = useState(() => new Date().getFullYear())

    // active days for the selected year (null userId → hook is disabled)
    const { data } = useQueryUserContributionCalendarSwr(userId, year)

    return (
        <ContributionCalendarView
            days={data ?? []}
            year={year}
            onYearChange={setYear}
            className={className}
        />
    )
}
