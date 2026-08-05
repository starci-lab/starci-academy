"use client"

import React, {
    useState,
} from "react"
import {
    useTranslations,
} from "next-intl"
import { useQueryMyContributionCalendarSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyContributionCalendarSwr"
import { _OverviewContributions } from "./component"

/**
 * DashboardPage contribution heatmap (GitHub-style) for the signed-in viewer — the CONNECTED half: it
 * self-fetches its own contribution leaf query (re-keyed on the selected year), computes the
 * first-load skeleton flag and the settled error, and hands them to the presentational
 * {@link import("./component")._OverviewContributions}. See `tiers/split.md`.
 */
export const OverviewContributions = () => {
    const t = useTranslations()
    const [year, setYear] = useState(() => new Date().getFullYear())
    const { data, isLoading, error, mutate } = useQueryMyContributionCalendarSwr(year)
    const days = data ?? []

    return (
        <_OverviewContributions
            // unchanged from the legacy AsyncContent path: first load, no days in hand yet
            isSkeleton={isLoading && days.length === 0}
            // only surface the error slot when there is no cached day to fall back to
            error={days.length === 0 ? error : undefined}
            onRetry={() => { void mutate() }}
            days={days}
            year={year}
            onYearChange={setYear}
            labels={{
                errorTitle: t("DashboardPage.loadError"),
                retry: t("DashboardPage.retry"),
            }}
        />
    )
}
