"use client"

import React, { useMemo } from "react"
import { Chip, Typography } from "@heroui/react"
import { BuildingsIcon, MapPinIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import { pathConfig } from "@/resources/path"
import { isJobPostingExpired } from "@/modules/utils/careers/jobs"
import type { JobPostingEntity } from "@/modules/types/entities/job-posting"
import { WorkMode } from "@/modules/types/enums/work-mode"
import { SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"

/** i18n key per {@link WorkMode} (reuses the existing profile labels). */
const WORK_MODE_LABEL_KEY: Record<WorkMode, string> = {
    [WorkMode.Remote]: "publicProfile.workMode.remote",
    [WorkMode.Hybrid]: "publicProfile.workMode.hybrid",
    [WorkMode.Onsite]: "publicProfile.workMode.onsite",
}

/** Props for {@link JobListRow}. */
export interface JobListRowProps {
    /** The job posting to render. */
    job: JobPostingEntity
}

/**
 * One row of the job board list — the company logo (via {@link IconTile}), title,
 * location + work-mode chip, salary range (or "negotiable"), and a relative
 * "posted N ago" timestamp. The whole row navigates to the posting's detail page
 * (a nav row, not a select-in-place row), so hover underlines the title rather
 * than filling the row.
 *
 * @param props - {@link JobListRowProps}
 */
export const JobListRow = ({ job }: JobListRowProps) => {
    const t = useTranslations()
    const locale = useLocale()

    const salaryLabel = useMemo(() => {
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
    }, [job.salaryMin, job.salaryMax, locale, t])

    const postedAgo = useMemo(
        () => getTimeAgoLabel(getTimeAgoMessage(job.createdAt), t),
        [job.createdAt, t],
    )

    const expired = isJobPostingExpired(job)

    const metaItems = [
        ...(expired ? [() => (
            <Chip size="sm" variant="soft" color="danger">
                <Chip.Label>{t("jobs.list.row.expired")}</Chip.Label>
            </Chip>
        )] : []),
        ...(job.location ? [() => (
            <StackH
                gap={2}
                principle="icon-text"
                inline
                align="center"
                items={[
                    () => <MapPinIcon aria-hidden focusable="false" className="size-3" />,
                    () => <span className="text-xs text-muted">{job.location}</span>,
                ]}
            />
        )] : []),
        ...(job.workMode ? [() => (
            <Chip size="sm" variant="soft" color="default">
                <Chip.Label>{t(WORK_MODE_LABEL_KEY[job.workMode!])}</Chip.Label>
            </Chip>
        )] : []),
    ]

    return (
        <SurfaceListCardItem
            href={pathConfig().locale(locale).jobs(job.displayId).build()}
            hover="underline"
        >
            <StackH
                gap={4}
                principle="content-row"
                align="center"
                items={[
                    () => (
                        <IconTile
                            icon={<BuildingsIcon aria-hidden focusable="false" />}
                            src={job.company.logoUrl}
                            alt={job.company.title}
                            tone="neutral"
                            size="sm"
                        />
                    ),
                    () => (
                        <StackV
                            gap={2}
                            principle="title-subtitle"
                            classNames={["min-w-0", "flex-1"]}
                            items={[
                                () => (
                                    <Typography type="body-sm" weight="medium" className="underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">
                                        {job.title}
                                    </Typography>
                                ),
                                () => (
                                    <Typography type="body-xs" color="muted" truncate>
                                        {job.company.title}
                                    </Typography>
                                ),
                                ...(metaItems.length > 0 ? [() => (
                                    <Cluster gap={3} principle="chip-row" items={metaItems} />
                                )] : []),
                            ]}
                        />
                    ),
                    () => (
                        <StackV
                            gap={2}
                            principle="title-subtitle"
                            align="end"
                            classNames={["shrink-0"]}
                            items={[
                                () => (
                                    <Typography type="body-sm" weight="medium">
                                        {salaryLabel}
                                    </Typography>
                                ),
                                () => (
                                    <Typography type="body-xs" color="muted">
                                        {postedAgo}
                                    </Typography>
                                ),
                            ]}
                        />
                    ),
                ]}
            />
        </SurfaceListCardItem>
    )
}
