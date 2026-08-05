"use client"

import React, { useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { useQueryJobPostingSwr } from "@/hooks/swr/api/graphql/queries/useQueryJobPostingSwr"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"
import { JobApplyMethod } from "@/modules/types/enums/job-apply-method"
import { WorkMode } from "@/modules/types/enums/work-mode"
import { getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import { isJobPostingExpired } from "@/modules/utils/careers/jobs"
import { _JobDetailPage } from "./component"

/** i18n key per {@link WorkMode} (reuses the existing profile labels). */
const WORK_MODE_LABEL_KEY: Record<WorkMode, string> = {
    [WorkMode.Remote]: "publicProfile.workMode.remote",
    [WorkMode.Hybrid]: "publicProfile.workMode.hybrid",
    [WorkMode.Onsite]: "publicProfile.workMode.onsite",
}

/**
 * Job posting detail — `/jobs/[displayId]`. Full posting (title, company,
 * markdown description + requirements, salary, work-mode/employment-type chips)
 * and the apply CTA — opens `applyUrl` in a new tab, or a `mailto:` link, per
 * `applyMethod`. Public — works for anonymous viewers. Reads the `displayId`
 * route param directly (no server-passed props, mirrors the talent/headhunting
 * feature containers) so the page shell can stay a thin server component.
 *
 * The CONNECTED half (see `tiers/split.md`): fetches the posting, resolves
 * every label (incl. interpolation), and hands them to the presentational
 * {@link _JobDetailPage}.
 */
export const JobDetailPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const params = useParams()
    const displayId = typeof params.displayId === "string" ? params.displayId : undefined
    // best-effort deep link to the (course-scoped) company page — only resolvable
    // when a course happens to be active in redux; there is no global company
    // detail route independent of a course.
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    const { data: job, isLoading, error, mutate } = useQueryJobPostingSwr(displayId)

    const salaryLabel = useMemo(() => {
        if (!job) {
            return ""
        }
        if (job.salaryMin == null && job.salaryMax == null) {
            return t("jobs.list.row.salaryNegotiable")
        }
        const format = (value: number) => value.toLocaleString(locale)
        if (job.salaryMin != null && job.salaryMax != null) {
            return t("jobs.list.row.salaryRange", {
                min: format(job.salaryMin),
                max: format(job.salaryMax),
            })
        }
        const single = job.salaryMin ?? job.salaryMax
        return single != null ? format(single) : t("jobs.list.row.salaryNegotiable")
    }, [job, locale, t])

    const postedAgoLabel = job ? t("jobs.detail.postedAgo", { time: getTimeAgoLabel(getTimeAgoMessage(job.createdAt), t) }) : undefined
    // an expired posting is served like any other (no BE expiry filter) — the FE
    // closes it: the Apply CTA is replaced with a "no longer accepting" notice
    const expired = job ? isJobPostingExpired(job) : false

    const companyHref = job && courseDisplayId
        ? pathConfig().locale(locale).course(courseDisplayId).headhuntingCompanies(job.companyId).build()
        : undefined

    return (
        <_JobDetailPage
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={isLoading && !job}
            // settled with no posting for this displayId
            isEmpty={!isLoading && !job}
            // error beats loading + empty; only a settled fetch error (nothing in hand) reaches the block
            error={!job ? error : undefined}
            onRetry={() => { void mutate() }}
            title={job?.title}
            workModeLabel={job && job.workMode ? t(WORK_MODE_LABEL_KEY[job.workMode]) : undefined}
            employmentTypeLabel={job && job.employmentType ? t(`jobs.employmentType.${job.employmentType}`) : undefined}
            location={job?.location ?? undefined}
            postedAgoLabel={postedAgoLabel}
            company={job ? {
                title: job.company.title,
                description: job.company.description ?? undefined,
                logoUrl: job.company.logoUrl,
                href: companyHref,
            } : undefined}
            salaryLabel={salaryLabel}
            description={job?.description}
            requirements={job?.requirements ?? undefined}
            expired={expired}
            canApplyExternal={Boolean(job && job.applyMethod === JobApplyMethod.ExternalUrl && job.applyUrl)}
            canApplyByEmail={Boolean(job && job.applyMethod === JobApplyMethod.Email && job.applyEmail)}
            onApplyExternal={() => {
                if (job?.applyUrl) {
                    window.open(job.applyUrl, "_blank", "noopener,noreferrer")
                }
            }}
            onApplyByEmail={() => {
                if (job?.applyEmail) {
                    window.location.href = `mailto:${job.applyEmail}`
                }
            }}
            labels={{
                notFound: t("jobs.detail.notFound"),
                error: t("jobs.detail.error"),
                retry: t("common.retry"),
                descriptionLabel: t("jobs.detail.descriptionLabel"),
                requirementsLabel: t("jobs.detail.requirementsLabel"),
                expired: t("jobs.detail.expired"),
                apply: t("jobs.detail.apply"),
                applyByEmail: job && job.applyEmail ? t("jobs.detail.applyByEmail", { email: job.applyEmail }) : undefined,
            }}
        />
    )
}
