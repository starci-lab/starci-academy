"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { HeadhuntingCompanyBreadcrumbs } from "./HeadhuntingCompanyBreadcrumbs"
import { HeadhuntingCompanyConsultants } from "./HeadhuntingCompanyConsultants"
import { HeadhuntingCompanyProfile } from "./HeadhuntingCompanyProfile"
import { HeadhuntingCompanyLoadingState } from "./LoadingState"
import {
    useHeadhuntingCompanyDetail,
} from "./hooks"

/**
 * Learn headhunting company detail: company profile and consultants at that company.
 * Container — owns data + breadcrumb orchestration via hooks; renders presentational children.
 */
export const HeadhuntingCompanyLayout = () => {
    const t = useTranslations()
    const {
        companyId,
        company,
        companies,
        consultants,
        companyConsultants,
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
        <div className="p-3">
            <HeadhuntingCompanyBreadcrumbs />
            <div className="h-6" />
            <HeadhuntingCompanyProfile />
            <div className="h-8" />
            <HeadhuntingCompanyConsultants
                consultants={consultants}
                companyConsultants={companyConsultants}
            />
        </div>
    )
}

/** @deprecated Use `HeadhuntingCompanyLayout` */
export const HeadhuntingCompanyDetailLayout = HeadhuntingCompanyLayout
