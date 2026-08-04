"use client"

import React, { useMemo } from "react"
import { cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { ConsultantCard } from "../../Headhuntings/ConsultantCard"
import { ConsultantCardSkeleton } from "../../Headhuntings/ConsultantCardSkeleton"
import { useAppSelector } from "@/redux/hooks"
import { useQueryHeadhunterCompaniesSwr } from "@/hooks/swr/api/graphql/queries/useQueryHeadhunterCompaniesSwr"
import { useQueryHeadhuntersSwr } from "@/hooks/swr/api/graphql/queries/useQueryHeadhuntersSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"

/** Number of placeholder cards shown while consultants load. */
const SKELETON_COUNT = 3

/** Props for {@link HeadhuntingCompanyConsultants}. */
export type HeadhuntingCompanyConsultantsProps = WithClassNames<undefined>

/**
 * Grid of consultant cards for one headhunting company.
 *
 * Self-contained section (single-use): reads all consultants and the active
 * company id from the `headhunter` redux slice (synced by the parent hook),
 * so the container renders `<HeadhuntingCompanyConsultants />` with no props.
 * @param props - {@link HeadhuntingCompanyConsultantsProps}
 */
export const HeadhuntingCompanyConsultants = ({ className }: HeadhuntingCompanyConsultantsProps) => {
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
        <AsyncContent
            isLoading={!consultants}
            skeleton={(
                <div className={cn("grid grid-cols-1 gap-3 @app-sm:grid-cols-2 @app-lg:grid-cols-3", className)}>
                    {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                        <ConsultantCardSkeleton key={index} />
                    ))}
                </div>
            )}
            isEmpty={companyConsultants.length === 0}
            emptyContent={{ title: t("headhuntings.empty") }}
            error={error}
            errorContent={{
                title: t("headhuntings.error"),
                onRetry: () => {
                    void mutateCompanies()
                    void mutateConsultants()
                },
                retryLabel: t("common.retry"),
            }}
        >
            <div className={cn("grid grid-cols-1 gap-3 @app-sm:grid-cols-2 @app-lg:grid-cols-3", className)}>
                {companyConsultants.map((consultant) => (
                    <ConsultantCard
                        key={consultant.id}
                        consultant={consultant}
                    />
                ))}
            </div>
        </AsyncContent>
    )
}
