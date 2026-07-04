"use client"

import React from "react"
import { Chip, Typography, cn } from "@heroui/react"
import { SealCheckIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { JobReadinessBand, JobReadinessTrackItem } from "@/modules/api/graphql/queries/types/job-readiness"
import { useProfileUsername } from "../../hooks/useProfileUsername"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryUserJobReadinessSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserJobReadinessSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { pathConfig } from "@/resources/path"

/** Props for {@link OverviewJobReadiness}. */
export type OverviewJobReadinessProps = WithClassNames<undefined>

/** Band → chip color, mirrors the pass/borderline/fail convention used elsewhere. */
const bandColorOf = (band: JobReadinessBand): "success" | "warning" | "danger" =>
    band === "jobReady" ? "success" : band === "building" ? "warning" : "danger"

/**
 * Profile job-readiness portfolio — the recruiter-facing headline metric: a
 * single composite score + band, the "AI-verified" credibility line, the two
 * global foundation pillars (CV · challenge strength), and one badge per
 * verified track (course), each linking to the course. Self-fetches the viewed
 * user (same pattern as the other overview cards); the parent
 * {@link import("@/components/blocks").LabeledCard} supplies the frame.
 * @param props - optional root class name (placement only)
 */
export const OverviewJobReadiness = ({ className }: OverviewJobReadinessProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const { data, isLoading, error, mutate } = useQueryUserJobReadinessSwr(userId)

    /** Builds a track's "Capstone X% · Interview Y" subtitle from whichever pillars have data. */
    const trackSubtitle = (track: JobReadinessTrackItem): string => {
        const parts: Array<string> = []
        if (track.capstoneScore !== null) {
            parts.push(`${t("jobReadiness.trackCapstone")} ${track.capstoneScore}%`)
        }
        if (track.interviewScore !== null) {
            parts.push(`${t("jobReadiness.trackInterview")} ${track.interviewScore}`)
        }
        return parts.join(" · ")
    }

    return (
        <AsyncContent
            isLoading={(isLoading || !userId) && !data}
            skeleton={(
                <div className="flex flex-col gap-6">
                    <Skeleton.Metric />
                    <div className="flex flex-col gap-3">
                        <Skeleton.ProgressBar />
                        <Skeleton.ProgressBar />
                    </div>
                    <SurfaceListCard>
                        <SurfaceListCardRow title={<Skeleton.Typography type="body-sm" width="1/2" />} />
                    </SurfaceListCard>
                </div>
            )}
            isEmpty={!data}
            emptyContent={{ title: t("jobReadiness.empty") }}
            error={!data ? error : undefined}
            errorContent={{
                title: t("jobReadiness.error"),
                onRetry: () => { void mutate() },
                retryLabel: t("publicProfile.loadErrorRetry"),
            }}
        >
            {data ? (
                <div className={cn("flex flex-col gap-6", className)}>
                    {/* composite headline + band + AI-verified credibility line */}
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-baseline gap-2">
                                <Typography className="text-4xl font-medium text-foreground">{data.compositeScore}</Typography>
                                <Typography type="body-xs" color="muted">/100</Typography>
                            </div>
                            <Chip size="md" variant="soft" color={bandColorOf(data.band)}>
                                <Chip.Label>{t(`jobReadiness.band.${data.band}`)}</Chip.Label>
                            </Chip>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted">
                            <SealCheckIcon className="size-4 shrink-0 text-success" aria-hidden focusable="false" />
                            <Typography type="body-xs" color="muted">{t("jobReadiness.aiVerified")}</Typography>
                        </div>
                    </div>

                    {/* person-level foundation: CV and challenge strength */}
                    <div className="flex flex-col gap-3">
                        <Typography type="body-xs" color="muted">{t("jobReadiness.foundationTitle")}</Typography>
                        <div className="flex items-center gap-3">
                            <Typography type="body-sm" className="w-32 shrink-0">{t("jobReadiness.pillar.cv")}</Typography>
                            {data.cvScore === null ? (
                                <Typography type="body-sm" color="muted" className="flex-1">{t("jobReadiness.notStarted")}</Typography>
                            ) : (
                                <ProgressMeter value={data.cvScore} max={100} className="flex-1" />
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <Typography type="body-sm" className="w-32 shrink-0">{t("jobReadiness.pillar.challenge")}</Typography>
                            {data.challengeScore === null ? (
                                <Typography type="body-sm" color="muted" className="flex-1">{t("jobReadiness.notStarted")}</Typography>
                            ) : (
                                <ProgressMeter value={data.challengeScore} max={100} className="flex-1" />
                            )}
                        </div>
                    </div>

                    {/* verified tracks — one badge per course, links to the course */}
                    <div className="flex flex-col gap-3">
                        <Typography type="body-xs" color="muted">{t("jobReadiness.tracksTitle")}</Typography>
                        {data.tracks.length === 0 ? (
                            <Typography type="body-sm" color="muted">{t("jobReadiness.tracksEmpty")}</Typography>
                        ) : (
                            <SurfaceListCard>
                                {data.tracks.map((track) => (
                                    <SurfaceListCardRow
                                        key={track.courseSlug}
                                        title={track.courseTitle}
                                        subtitle={trackSubtitle(track) || undefined}
                                        meta={(
                                            <Chip size="sm" variant="soft" color="accent">
                                                <Chip.Label>{track.depthScore}</Chip.Label>
                                            </Chip>
                                        )}
                                        href={pathConfig().locale(locale).course(track.courseSlug).build()}
                                        hover="underline"
                                    />
                                ))}
                            </SurfaceListCard>
                        )}
                    </div>
                </div>
            ) : null}
        </AsyncContent>
    )
}
