"use client"

import React from "react"
import { Chip, Typography } from "@heroui/react"
import { RocketLaunchIcon, TrendUpIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { UserJobReadinessBand, UserJobReadinessTrack } from "@/modules/api/graphql/queries/types/user-job-readiness"
import { useProfileUsername } from "../../hooks/useProfileUsername"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryUserJobReadinessSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserJobReadinessSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { StatPair } from "@/components/blocks/stats/StatPair"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { pathConfig } from "@/resources/path"

/** Props for {@link ProfileJobReadiness}. */
export interface ProfileJobReadinessProps extends WithClassNames<undefined> {
    /** Section label, rendered outside the card (owned here, like every other self-contained section). */
    label: React.ReactNode
}

/** Maps a readiness band to the `Chip` color that reads correctly. */
const bandColorOf = (band: UserJobReadinessBand): "success" | "warning" | "default" =>
    band === "jobReady" ? "success" : band === "building" ? "warning" : "default"

/**
 * One purchased-course depth card: title + band chip + capstone/interview/CV
 * bars, each pillar rendered only when the learner has attempted it. Whole row links
 * to the course. Content only — the parent {@link SurfaceListCard} supplies the
 * bounded frame.
 *
 * @param props.track - the track to render
 * @param props.locale - active locale, for building the course link
 * @param props.t - translation function
 */
const TrackCard = ({
    track,
    locale,
    t,
}: {
    track: UserJobReadinessTrack
    locale: string
    t: ReturnType<typeof useTranslations>
}) => {
    return (
        <SurfaceListCardItem href={pathConfig().locale(locale).course(track.courseSlug).build()}>
            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <Typography type="body-sm" weight="medium" truncate className="min-w-0">
                        {track.courseTitle}
                    </Typography>
                    <div className="flex shrink-0 items-center gap-2">
                        {track.isQualified ? (
                            <Chip size="sm" variant="soft" color="success">
                                <RocketLaunchIcon aria-hidden focusable="false" className="size-4" />
                                <Chip.Label>{t("jobReadiness.qualified")}</Chip.Label>
                            </Chip>
                        ) : null}
                        <Chip size="sm" variant="soft" color={bandColorOf(track.band)}>
                            <Chip.Label>{t(`jobReadiness.band.${track.band}`)}</Chip.Label>
                        </Chip>
                    </div>
                </div>
                {track.capstoneScore !== null ? (
                    <ProgressMeter
                        label={t("jobReadiness.trackCapstone")}
                        value={track.capstoneScore}
                        max={100}
                        showValue
                    />
                ) : null}
                {track.interviewScore !== null ? (
                    <ProgressMeter
                        label={t("jobReadiness.trackInterview")}
                        value={track.interviewScore}
                        max={100}
                        showValue
                    />
                ) : null}
                {track.cvScore !== null ? (
                    <ProgressMeter
                        label={t("jobReadiness.trackCv")}
                        value={track.cvScore}
                        max={100}
                        showValue
                    />
                ) : null}
            </div>
        </SurfaceListCardItem>
    )
}

/**
 * Job-readiness snapshot — the recruiter-facing headline section, placed at the
 * very TOP of the profile Overview tab: a headline (strongest track + band +
 * global foundation), then one bounded depth card per purchased course track.
 * Deliberately has NO blended composite score — every track stands alone (see
 * `.workflows/00-INDEX.md` fairness model): a 1-course learner reads as
 * complete, a 3-course learner reads as broad. Self-fetches the viewed user
 * (same pattern as the other overview cards). Owns its own `LabeledCard`, with
 * `frameless` computed HERE (not hardcoded) so the loaded track list (self-framed
 * as a `SurfaceListCard`) skips the outer `Card` — but the skeleton/empty/error
 * states, which have no bounded surface of their own, still get one.
 *
 * @param props - {@link ProfileJobReadinessProps}
 */
export const ProfileJobReadiness = ({ className, label }: ProfileJobReadinessProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const { data, isLoading, error, mutate } = useQueryUserJobReadinessSwr(userId)

    const tracks = data?.tracks ?? []
    const strongestTrack = tracks[0]
    const hasTracks = !(isLoading || !userId) && !error && tracks.length > 0

    return (
        <LabeledCard className={className} label={label} frameless={hasTracks}>
            <AsyncContent
                isLoading={(isLoading || !userId) && tracks.length === 0}
                skeleton={(
                    <div className="flex flex-col gap-3">
                        <Skeleton.Metric />
                        <SurfaceListCard>
                            <SurfaceListCardItem>
                                <div className="flex flex-col gap-3">
                                    <Skeleton.Typography type="body-sm" width="1/2" />
                                    <Skeleton.ProgressBar />
                                    <Skeleton.ProgressBar />
                                </div>
                            </SurfaceListCardItem>
                        </SurfaceListCard>
                    </div>
                )}
                isEmpty={tracks.length === 0}
                emptyContent={{
                    title: t("jobReadiness.empty"),
                    description: t("jobReadiness.emptyHint"),
                    icon: <TrendUpIcon aria-hidden focusable="false" className="size-8 text-muted" />,
                }}
                error={tracks.length === 0 ? error : undefined}
                errorContent={{
                    title: t("jobReadiness.error"),
                    onRetry: () => { void mutate() },
                    retryLabel: t("publicProfile.loadErrorRetry"),
                }}
            >
                <div className="flex flex-col gap-3">
                    {/* headline: strongest track + its band + the global foundation strip */}
                    {strongestTrack ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-3">
                                <StatPair
                                    value={strongestTrack.depthScore ?? 0}
                                    label={strongestTrack.courseTitle}
                                />
                                <Chip size="md" variant="soft" color={bandColorOf(strongestTrack.band)}>
                                    <Chip.Label>{t(`jobReadiness.band.${strongestTrack.band}`)}</Chip.Label>
                                </Chip>
                            </div>
                            {data?.foundation.codingPercentile !== null && data?.foundation.codingPercentile !== undefined ? (
                                <Typography type="body-xs" color="muted">
                                    {t("jobReadiness.foundationPercentile", { percent: data.foundation.codingPercentile })}
                                </Typography>
                            ) : null}
                        </div>
                    ) : null}

                    {/* one bounded card per track — never blended, strongest first */}
                    {tracks.length > 0 ? (
                        <SurfaceListCard>
                            {tracks.map((track) => (
                                <TrackCard key={track.courseId} track={track} locale={locale} t={t} />
                            ))}
                        </SurfaceListCard>
                    ) : null}
                </div>
            </AsyncContent>
        </LabeledCard>
    )
}
