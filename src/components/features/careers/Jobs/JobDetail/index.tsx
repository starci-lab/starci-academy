"use client"

import React, { useMemo } from "react"
import { Button, Chip, Typography, cn } from "@heroui/react"
import { ArrowRightIcon, BuildingsIcon, MapPinIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { useQueryJobPostingSwr } from "@/hooks/swr/api/graphql/queries/useQueryJobPostingSwr"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"
import { JobApplyMethod } from "@/modules/types/enums/job-apply-method"
import { WorkMode } from "@/modules/types/enums/work-mode"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"

/** i18n key per {@link WorkMode} (reuses the existing profile labels). */
const WORK_MODE_LABEL_KEY: Record<WorkMode, string> = {
    [WorkMode.Remote]: "publicProfile.workMode.remote",
    [WorkMode.Hybrid]: "publicProfile.workMode.hybrid",
    [WorkMode.Onsite]: "publicProfile.workMode.onsite",
}

/** Props for {@link JobDetail}. */
export type JobDetailProps = WithClassNames<undefined>

/**
 * Job posting detail — `/jobs/[displayId]`. Full posting (title, company,
 * markdown description + requirements, salary, work-mode/employment-type chips)
 * and the apply CTA — opens `applyUrl` in a new tab, or a `mailto:` link, per
 * `applyMethod`. Public — works for anonymous viewers. Reads the `displayId`
 * route param directly (no server-passed props, mirrors the talent/headhunting
 * feature containers) so the page shell can stay a thin server component.
 *
 * @param props - {@link JobDetailProps}
 */
export const JobDetail = ({ className }: JobDetailProps) => {
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

    const postedAgo = job ? getTimeAgoLabel(getTimeAgoMessage(job.createdAt), t) : ""

    const companyHref = job && courseDisplayId
        ? pathConfig().locale(locale).course(courseDisplayId).headhuntingCompanies(job.companyId).build()
        : undefined

    /** Open `applyUrl` in a new tab (external application flow). */
    const onApplyExternal = () => {
        if (job?.applyUrl) {
            window.open(job.applyUrl, "_blank", "noopener,noreferrer")
        }
    }
    /** Hand off to the OS mail client via a `mailto:` link. */
    const onApplyByEmail = () => {
        if (job?.applyEmail) {
            window.location.href = `mailto:${job.applyEmail}`
        }
    }

    return (
        <div className={cn("mx-auto flex max-w-3xl flex-col gap-10 p-6", className)}>
            <AsyncContent
                isLoading={isLoading && !job}
                skeleton={(
                    <div className="flex flex-col gap-6">
                        <div className="h-8 w-2/3 animate-pulse rounded-lg bg-default" />
                        <div className="h-40 w-full animate-pulse rounded-3xl bg-default" />
                    </div>
                )}
                isEmpty={!isLoading && !job}
                emptyContent={{ title: t("jobs.detail.notFound") }}
                error={!job ? error : undefined}
                errorContent={{
                    title: t("jobs.detail.error"),
                    onRetry: () => { void mutate() },
                    retryLabel: t("common.retry"),
                }}
            >
                {job ? (
                    <>
                        <PageHeader
                            title={job.title}
                            meta={(
                                <div className="flex flex-wrap items-center gap-3">
                                    {job.workMode ? (
                                        <Chip size="sm" variant="soft" color="default">
                                            <Chip.Label>{t(WORK_MODE_LABEL_KEY[job.workMode])}</Chip.Label>
                                        </Chip>
                                    ) : null}
                                    {job.employmentType ? (
                                        <Chip size="sm" variant="soft" color="accent">
                                            <Chip.Label>{t(`jobs.employmentType.${job.employmentType}`)}</Chip.Label>
                                        </Chip>
                                    ) : null}
                                    {job.location ? (
                                        <span className="inline-flex items-center gap-1 text-sm text-muted">
                                            <MapPinIcon aria-hidden focusable="false" className="size-4" />
                                            {job.location}
                                        </span>
                                    ) : null}
                                    <Typography type="body-sm" color="muted">
                                        {t("jobs.detail.postedAgo", { time: postedAgo })}
                                    </Typography>
                                </div>
                            )}
                        />

                        <div className="flex items-center gap-3 rounded-3xl bg-surface p-4 shadow-surface">
                            <IconTile
                                icon={<BuildingsIcon aria-hidden focusable="false" />}
                                src={job.company.logoUrl}
                                alt={job.company.title}
                                tone="neutral"
                                size="md"
                            />
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                                {companyHref ? (
                                    <a href={companyHref} className="w-fit">
                                        <Typography type="body" weight="semibold" className="hover:underline">
                                            {job.company.title}
                                        </Typography>
                                    </a>
                                ) : (
                                    <Typography type="body" weight="semibold">
                                        {job.company.title}
                                    </Typography>
                                )}
                                {job.company.description ? (
                                    <Typography type="body-sm" color="muted" className="line-clamp-2">
                                        {job.company.description}
                                    </Typography>
                                ) : null}
                            </div>
                            <Typography type="h4" weight="bold" className="shrink-0">
                                {salaryLabel}
                            </Typography>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <Typography type="body" weight="semibold">
                                    {t("jobs.detail.descriptionLabel")}
                                </Typography>
                                <MarkdownContent markdown={job.description} />
                            </div>
                            {job.requirements ? (
                                <div className="flex flex-col gap-2">
                                    <Typography type="body" weight="semibold">
                                        {t("jobs.detail.requirementsLabel")}
                                    </Typography>
                                    <MarkdownContent markdown={job.requirements} />
                                </div>
                            ) : null}
                        </div>

                        {job.applyMethod === JobApplyMethod.ExternalUrl && job.applyUrl ? (
                            <Button variant="primary" size="lg" onPress={onApplyExternal}>
                                {t("jobs.detail.apply")}
                                <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                            </Button>
                        ) : null}
                        {job.applyMethod === JobApplyMethod.Email && job.applyEmail ? (
                            <Button variant="primary" size="lg" onPress={onApplyByEmail}>
                                {t("jobs.detail.applyByEmail", { email: job.applyEmail })}
                                <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                            </Button>
                        ) : null}
                    </>
                ) : null}
            </AsyncContent>
        </div>
    )
}
