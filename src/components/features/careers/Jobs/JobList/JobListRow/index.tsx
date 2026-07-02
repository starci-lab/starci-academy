"use client"

import React, { useMemo } from "react"
import { Chip, Typography } from "@heroui/react"
import { BuildingsIcon, MapPinIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import { pathConfig } from "@/resources/path"
import type { JobPostingEntity } from "@/modules/types/entities/job-posting"
import { WorkMode } from "@/modules/types/enums/work-mode"
import { SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { IconTile } from "@/components/blocks/identity/IconTile"

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

    return (
        <SurfaceListCardItem
            href={pathConfig().locale(locale).jobs(job.displayId).build()}
            hover="underline"
        >
            <div className="flex items-center gap-3">
                <IconTile
                    icon={<BuildingsIcon aria-hidden focusable="false" />}
                    src={job.company.logoUrl}
                    alt={job.company.title}
                    tone="neutral"
                    size="sm"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Typography type="body-sm" weight="medium" className="group-hover:underline">
                        {job.title}
                    </Typography>
                    <Typography type="body-xs" color="muted" truncate>
                        {job.company.title}
                    </Typography>
                    <div className="flex flex-wrap items-center gap-2">
                        {job.location ? (
                            <span className="inline-flex items-center gap-1 text-xs text-muted">
                                <MapPinIcon aria-hidden focusable="false" className="size-3" />
                                {job.location}
                            </span>
                        ) : null}
                        {job.workMode ? (
                            <Chip size="sm" variant="soft" color="default">
                                <Chip.Label>{t(WORK_MODE_LABEL_KEY[job.workMode])}</Chip.Label>
                            </Chip>
                        ) : null}
                    </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                    <Typography type="body-sm" weight="medium">
                        {salaryLabel}
                    </Typography>
                    <Typography type="body-xs" color="muted">
                        {postedAgo}
                    </Typography>
                </div>
            </div>
        </SurfaceListCardItem>
    )
}
