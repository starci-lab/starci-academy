"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux/hooks"
import { useQueryHeadhunterCompaniesSwr } from "@/hooks/swr/api/graphql/queries/useQueryHeadhunterCompaniesSwr"
import { useQueryHeadhuntersSwr } from "@/hooks/swr/api/graphql/queries/useQueryHeadhuntersSwr"
import { _ConsultantGrid } from "./component"

/**
 * Responsive grid of consultant cards with loading + empty + error states — the CONNECTED half
 * (`tiers/split.md`). Reads the full consultant list from the `headhunter` redux slice and derives
 * the sorted order, so the parent renders `<ConsultantGrid />` with no props of its own. The list is
 * loaded into Redux by these two queries; their error/retry is read here too — a failed query leaves
 * Redux `undefined`, so surfacing it explicitly avoids an endless skeleton. SWR dedupes with the
 * parent's own calls to the same queries.
 */
export const ConsultantGrid = () => {
    const t = useTranslations()
    const consultants = useAppSelector((state) => state.headhunter.entities)
    const { error: companiesError, mutate: mutateCompanies } = useQueryHeadhunterCompaniesSwr()
    const { error: consultantsError, mutate: mutateConsultants } = useQueryHeadhuntersSwr()
    const error = companiesError ?? consultantsError

    const sortedConsultants = useMemo(() => {
        if (!consultants?.length) {
            return []
        }
        return [...consultants].sort((a, b) => a.sortIndex - b.sortIndex)
    }, [consultants])

    return (
        <_ConsultantGrid
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={!consultants && !error}
            isEmpty={sortedConsultants.length === 0}
            error={error}
            onRetry={() => {
                void mutateCompanies()
                void mutateConsultants()
            }}
            consultants={sortedConsultants}
            labels={{
                emptyTitle: t("headhuntings.empty"),
                errorTitle: t("headhuntings.error"),
                retry: t("common.retry"),
            }}
        />
    )
}
