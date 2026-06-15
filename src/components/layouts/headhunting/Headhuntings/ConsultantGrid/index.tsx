"use client"

import React from "react"
import { useTranslations } from "next-intl"
import type { ConsultantEntity } from "@/modules/types"
import { ConsultantCard } from "../ConsultantCard"
import { ConsultantCardSkeleton } from "../ConsultantCardSkeleton"

export interface ConsultantGridProps {
    /** All consultants from Redux; undefined while loading. */
    consultants: Array<ConsultantEntity> | undefined
    /** Consultants sorted by order index, ready to render. */
    sortedConsultants: Array<ConsultantEntity>
}

/**
 * Responsive grid of consultant cards with loading + empty states.
 * @param props.consultants - Full consultant list from Redux (drives loading state).
 * @param props.sortedConsultants - Consultants sorted for display.
 */
export const ConsultantGrid = ({
    consultants,
    sortedConsultants,
}: ConsultantGridProps) => {
    const t = useTranslations()

    if (!consultants) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <ConsultantCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (sortedConsultants.length === 0) {
        return <p className="text-muted text-sm">{t("headhuntings.empty")}</p>
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedConsultants.map((consultant) => (
                <ConsultantCard
                    key={consultant.id}
                    consultant={consultant}
                />
            ))}
        </div>
    )
}
