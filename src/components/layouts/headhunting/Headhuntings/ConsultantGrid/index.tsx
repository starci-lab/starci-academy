"use client"

import React, { useMemo } from "react"
import { cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { ConsultantCard } from "../ConsultantCard"
import { ConsultantCardSkeleton } from "../ConsultantCardSkeleton"

/** Props for {@link ConsultantGrid}. */
export type ConsultantGridProps = WithClassNames<undefined>

/**
 * Responsive grid of consultant cards with loading + empty states.
 *
 * Container: reads the full consultant list from the `headhunter` redux slice
 * itself and derives the sorted order, so the parent renders `<ConsultantGrid />`.
 * @param props - {@link ConsultantGridProps}
 */
export const ConsultantGrid = ({ className }: ConsultantGridProps) => {
    const t = useTranslations()
    const consultants = useAppSelector((state) => state.headhunter.entities)

    const sortedConsultants = useMemo(() => {
        if (!consultants?.length) {
            return []
        }
        return [...consultants].sort((a, b) => a.sortIndex - b.sortIndex)
    }, [consultants])

    if (!consultants) {
        return (
            <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <ConsultantCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (sortedConsultants.length === 0) {
        return <p className={cn("text-muted text-sm", className)}>{t("headhuntings.empty")}</p>
    }

    return (
        <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
            {sortedConsultants.map((consultant) => (
                <ConsultantCard
                    key={consultant.id}
                    consultant={consultant}
                />
            ))}
        </div>
    )
}
