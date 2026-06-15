"use client"

import React from "react"
import { cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { HeadhuntingCompanyBreadcrumbs } from "./HeadhuntingCompanyBreadcrumbs"
import { HeadhuntingCompanyConsultants } from "./HeadhuntingCompanyConsultants"
import { HeadhuntingCompanyProfile } from "./HeadhuntingCompanyProfile"
import { HeadhuntingCompanyLoadingState } from "./HeadhuntingCompanyLoadingState"
import {
    useHeadhuntingCompanyDetail,
} from "./hooks"

/** Props for {@link HeadhuntingCompanyLayout}. */
export type HeadhuntingCompanyLayoutProps = WithClassNames<undefined>

/**
 * Learn headhunting company detail: company profile and consultants at that company.
 * Container — owns data + breadcrumb orchestration via hooks; renders presentational children.
 * @param props - {@link HeadhuntingCompanyLayoutProps}
 */
export const HeadhuntingCompanyLayout = ({ className }: HeadhuntingCompanyLayoutProps) => {
    const t = useTranslations()
    const {
        companyId,
        company,
        companies,
    } = useHeadhuntingCompanyDetail()

    if (!companies) {
        return <HeadhuntingCompanyLoadingState />
    }

    if (!company && companyId) {
        return (
            <div className="p-3">
                <p className="text-muted text-sm">{t("headhuntings.companyNotFound")}</p>
            </div>
        )
    }

    return (
        <div className={cn("p-3", className)}>
            <HeadhuntingCompanyBreadcrumbs />
            <div className="h-6" />
            <HeadhuntingCompanyProfile />
            <div className="h-8" />
            <HeadhuntingCompanyConsultants />
        </div>
    )
}

/** @deprecated Use `HeadhuntingCompanyLayout` */
export const HeadhuntingCompanyDetailLayout = HeadhuntingCompanyLayout
