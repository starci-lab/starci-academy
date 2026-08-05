"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux/hooks"
import { useQueryHeadhunterCompaniesSwr } from "@/hooks/swr/api/graphql/queries/useQueryHeadhunterCompaniesSwr"
import { useQueryHeadhuntersSwr } from "@/hooks/swr/api/graphql/queries/useQueryHeadhuntersSwr"
import { _HeadhuntingCompanyConsultants } from "./component"

/**
 * `HeadhuntingCompanyConsultants` — the CONNECTED half: grid of consultant
 * cards for one headhunting company. Self-contained section (single-use): it
 * reads all consultants and the active company id from the `headhunter` redux
 * slice (synced by the parent hook), computes the skeleton/empty/error state,
 * and hands them to the presentational {@link _HeadhuntingCompanyConsultants}
 * — so the container renders `<HeadhuntingCompanyConsultants />` with no
 * props. See `design/storybook/architecture/split.md`.
 */
export const HeadhuntingCompanyConsultants = () => {
    const t = useTranslations()
    const consultants = useAppSelector((state) => state.headhunter.entities)
    const companyId = useAppSelector((state) => state.headhunter.companyId)
    // read the loader queries' error/retry so a failed query surfaces error+retry
    // rather than a perpetual skeleton (Redux stays `undefined` on failure). SWR
    // dedupes with the container's own calls.
    const { error: companiesError, mutate: mutateCompanies } = useQueryHeadhunterCompaniesSwr()
    const { error: consultantsError, mutate: mutateConsultants } = useQueryHeadhuntersSwr()
    const error = companiesError ?? consultantsError

    const companyConsultants = useMemo(() => {
        if (!consultants?.length || !companyId) {
            return []
        }
        return consultants
            .filter((entry) => (entry.company?.id ?? entry.companyId) === companyId)
            .sort((a, b) => a.sortIndex - b.sortIndex)
    }, [companyId, consultants])

    return (
        <_HeadhuntingCompanyConsultants
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={!consultants}
            isEmpty={companyConsultants.length === 0}
            error={error}
            onRetry={() => {
                void mutateCompanies()
                void mutateConsultants()
            }}
            consultants={companyConsultants}
            labels={{
                emptyTitle: t("headhuntings.empty"),
                errorTitle: t("headhuntings.error"),
                retry: t("common.retry"),
            }}
        />
    )
}
