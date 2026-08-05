"use client"

import React from "react"
import { Typography } from "@heroui/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { HeadhuntingCompanyBreadcrumbs } from "./HeadhuntingCompanyBreadcrumbs"
import { HeadhuntingCompanyConsultants } from "./HeadhuntingCompanyConsultants"
import { HeadhuntingCompanyProfile } from "./HeadhuntingCompanyProfile"
import { HeadhuntingCompanyLoadingState } from "./HeadhuntingCompanyLoadingState"
import { useHeadhuntingCompanyDetail } from "../hooks"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"

/** Props for {@link HeadhuntingCompany}. */
export type HeadhuntingCompanyProps = WithClassNames<undefined>

/**
 * Headhunting company detail: company profile and the consultants at that company.
 * Container — owns data + breadcrumb orchestration via hooks; renders presentational children.
 * @param props - {@link HeadhuntingCompanyProps}
 */
export const HeadhuntingCompany = ({ className }: HeadhuntingCompanyProps) => {
    const t = useTranslations()
    const {
        companyId,
        company,
        companies,
        error,
        retry,
    } = useHeadhuntingCompanyDetail()

    // an errored query never lands in Redux, so `companies` stays undefined — the
    // loading gate below would otherwise spin forever; surface a retry instead
    if (error && !companies) {
        return (
            <AsyncContentError
                title={t("headhuntings.error")}
                onRetry={retry}
                retryLabel={t("common.retry")}
            />
        )
    }

    if (!companies) {
        return <HeadhuntingCompanyLoadingState />
    }

    if (!company && companyId) {
        return (
            <div>
                <Typography type="body-sm" color="muted">{t("headhuntings.companyNotFound")}</Typography>
            </div>
        )
    }

    return (
        <div className={className}>
            <div className="flex flex-col gap-6">
                <HeadhuntingCompanyBreadcrumbs />
                <HeadhuntingCompanyProfile />
                <HeadhuntingCompanyConsultants />
            </div>
        </div>
    )
}

/** @deprecated Use {@link HeadhuntingCompany}. */
export const HeadhuntingCompanyLayout = HeadhuntingCompany
