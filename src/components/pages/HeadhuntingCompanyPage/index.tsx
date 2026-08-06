"use client"

import React from "react"
import { Typography } from "@heroui/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { HeadhuntingCompanyBreadcrumbs } from "./HeadhuntingCompanyBreadcrumbs"
import { HeadhuntingCompanyConsultants } from "./HeadhuntingCompanyConsultants"
import { HeadhuntingCompanyProfile } from "./HeadhuntingCompanyProfile"
import { HeadhuntingCompanyLoadingState } from "./HeadhuntingCompanyLoadingState"
import { useHeadhuntingCompanyDetail } from "@/hooks/headhunting"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Box } from "@/components/frames/Box"
import { StackV } from "@/components/frames/Stack"

/** Props for {@link HeadhuntingCompanyPage}. */
export type HeadhuntingCompanyPageProps = WithClassNames<undefined>

/**
 * Headhunting company detail: company profile and the consultants at that company.
 * Container — owns data + breadcrumb orchestration via hooks; renders presentational children.
 * @param props - {@link HeadhuntingCompanyPageProps}
 */
export const HeadhuntingCompanyPage = ({ className }: HeadhuntingCompanyPageProps) => {
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
        <Box className={className}>
            <StackV gap={6} principle="block-boundary"
                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                items={[
                    HeadhuntingCompanyBreadcrumbs,
                    HeadhuntingCompanyProfile,
                    HeadhuntingCompanyConsultants,
                ]} />
        </Box>
    )
}

