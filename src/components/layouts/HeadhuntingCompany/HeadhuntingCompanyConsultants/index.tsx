"use client"

import type { ConsultantEntity } from "@/modules/types"
import { useTranslations } from "next-intl"
import { ConsultantCard } from "@/components/layouts/Headhuntings/ConsultantCard"
import { ConsultantCardSkeleton } from "@/components/layouts/Headhuntings/ConsultantCardSkeleton"

export interface HeadhuntingCompanyConsultantsProps {
    /** All consultants from Redux; undefined while loading. */
    consultants: Array<ConsultantEntity> | undefined
    /** Consultants filtered for the current company. */
    companyConsultants: Array<ConsultantEntity>
}

/**
 * Grid of consultant cards for one headhunting company.
 * @param props.consultants - Full consultant list from Redux (loading state).
 * @param props.companyConsultants - Consultants belonging to the current company.
 */
export const HeadhuntingCompanyConsultants = ({
    consultants,
    companyConsultants,
}: HeadhuntingCompanyConsultantsProps) => {
    const t = useTranslations()

    if (!consultants) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <ConsultantCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (companyConsultants.length === 0) {
        return <p className="text-muted text-sm">{t("headhuntings.empty")}</p>
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companyConsultants.map((consultant) => (
                <ConsultantCard
                    key={consultant.id}
                    consultant={consultant}
                />
            ))}
        </div>
    )
}
