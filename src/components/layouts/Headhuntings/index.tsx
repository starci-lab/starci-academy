"use client"

import React from "react"
import { Skeleton } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { useAppSelector } from "@/redux"
import {
    useQueryHeadhunterCompaniesSwr,
    useQueryHeadhuntersSwr,
} from "@/hooks/singleton"
import { ConsultantGrid } from "./ConsultantGrid"
import { HeadhuntingsBreadcrumbs } from "./HeadhuntingsBreadcrumbs"

/**
 * Learn headhuntings page: grid of consultant cards; card opens profile modal.
 * Container — owns data + breadcrumb orchestration; renders presentational children.
 */
export const HeadhuntingsLearnLayout = () => {
    const t = useTranslations()
    const consultants = useAppSelector((state) => state.headhunter.entities)
    const count = useAppSelector((state) => state.headhunter.count)

    useQueryHeadhunterCompaniesSwr()
    useQueryHeadhuntersSwr()

    const sortedConsultants = useMemo(() => {
        if (!consultants?.length) {
            return []
        }
        return [...consultants].sort((a, b) => a.orderIndex - b.orderIndex)
    }, [consultants])

    return (
        <div className="p-3">
            <HeadhuntingsBreadcrumbs />
            <div className="h-6" />
            <div>
                <div className="text-2xl font-bold">{t("headhuntings.title")}</div>
                <p className="text-muted mt-2 text-sm">{t("headhuntings.description")}</p>
            </div>
            <div className="h-6" />
            {!consultants ? (
                <Skeleton className="h-[14px] w-[150px] my-[3px]" />
            ) : (
                <p className="text-muted text-sm">
                    {t("headhuntings.count", { count: count ?? 0 })}
                </p>
            )}
            <div className="h-6" />
            <ConsultantGrid
                consultants={consultants}
                sortedConsultants={sortedConsultants}
            />
        </div>
    )
}
