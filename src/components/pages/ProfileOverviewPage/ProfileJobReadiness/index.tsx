"use client"

import React from "react"
import { Chip, Typography } from "@heroui/react"
import { RocketLaunchIcon, ChartLineUpIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { UserJobReadinessBand, UserJobReadinessTrack } from "@/modules/api/graphql/queries/types/user-job-readiness"
import { useProfileUsername } from "@/hooks/profile/useProfileUsername"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryUserJobReadinessSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserJobReadinessSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { StatPair } from "@/components/composites/stats/StatPair"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { Cluster } from "@/components/frames/Cluster"
import { StackV } from "@/components/frames/Stack"
import { pathConfig } from "@/resources/path"

/** Props for {@link ProfileJobReadiness}. */
export interface ProfileJobReadinessProps extends WithClassNames<undefined> {
    /** Section label, rendered outside the card (owned here, like every other self-contained section). */
    label: string
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
    const bandChips = [
        ...(track.isQualified
            ? [() => (
                <Chip size="sm" variant="soft" color="success">
                    <RocketLaunchIcon aria-hidden focusable="false" className="size-4" />
                    <Chip.Label>{t("jobReadiness.qualified")}</Chip.Label>
                </Chip>
            )]
            : []),
        () => (
            <Chip size="sm" variant="soft" color={bandColorOf(track.band)}>
                <Chip.Label>{t(`jobReadiness.band.${track.band}`)}</Chip.Label>
            </Chip>
        ),
    ]

    const headerItems = [
        () => (
            <Typography type="body-sm" weight="medium" truncate className="min-w-0">
                {track.courseTitle}
            </Typography>
        ),
        () => <Cluster gap={3} principle="chip-row"
            explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
            items={bandChips} />,
    ]

    return (
        <SurfaceListCardItem href={pathConfig().locale(locale).course(track.courseSlug).build()}>
            <StackV gap={4} items={[
                () => (
                    <Cluster gap={3} principle="flex-action"
                        explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                        justify="between" items={headerItems}  />
                ),
                ...(track.capstoneScore !== null
                    ? [() => (
                        <ProgressMeter
                            label={t("jobReadiness.trackCapstone")}
                            value={track.capstoneScore ?? 0}
                            max={100}
                            showValue
                        />
                    )]
                    : []),
                ...(track.interviewScore !== null
                    ? [() => (
                        <ProgressMeter
                            label={t("jobReadiness.trackInterview")}
                            value={track.interviewScore ?? 0}
                            max={100}
                            showValue
                        />
                    )]
                    : []),
                ...(track.cvScore !== null
                    ? [() => (
                        <ProgressMeter
                            label={t("jobReadiness.trackCv")}
                            value={track.cvScore ?? 0}
                            max={100}
                            showValue
                        />
                    )]
                    : []),
            ]} />
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
                    <StackV gap={4} items={[
                        () => <Skeleton.Metric />,
                        () => (
                            <SurfaceListCard>
                                <SurfaceListCardItem>
                                    <StackV gap={4} items={[
                                        () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                        () => <Skeleton.ProgressBar />,
                                        () => <Skeleton.ProgressBar />,
                                    ]} />
                                </SurfaceListCardItem>
                            </SurfaceListCard>
                        ),
                    ]} />
                )}
                isEmpty={tracks.length === 0}
                emptyContent={{
                    title: t("jobReadiness.empty"),
                    description: t("jobReadiness.emptyHint"),
                    icon: <ChartLineUpIcon aria-hidden focusable="false" className="size-8 text-muted" />,
                }}
                error={tracks.length === 0 ? error : undefined}
                errorContent={{
                    title: t("jobReadiness.error"),
                    onRetry: () => { void mutate() },
                    retryLabel: t("publicProfile.loadErrorRetry"),
                }}
            >
                <StackV gap={4} items={[
                    ...(strongestTrack
                        ? [() => (
                            <StackV gap={4} items={[
                                () => (
                                    <Cluster
                                        gap={4}
                                        principle="content-row"
                                        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                        items={[
                                            () => (
                                                <StatPair
                                                    value={String(strongestTrack.depthScore ?? 0)}
                                                    label={strongestTrack.courseTitle}
                                                />
                                            ),
                                            () => (
                                                <Chip size="md" variant="soft" color={bandColorOf(strongestTrack.band)}>
                                                    <Chip.Label>{t(`jobReadiness.band.${strongestTrack.band}`)}</Chip.Label>
                                                </Chip>
                                            ),
                                        ]}
                                    />
                                ),
                                ...(data?.foundation.codingPercentile !== null && data?.foundation.codingPercentile !== undefined
                                    ? [() => (
                                        <Typography type="body-xs" color="muted">
                                            {t("jobReadiness.foundationPercentile", { percent: data.foundation.codingPercentile ?? 0 })}
                                        </Typography>
                                    )]
                                    : []),
                            ]} />
                        )]
                        : []),
                    ...(tracks.length > 0
                        ? [() => (
                            <SurfaceListCard>
                                {tracks.map((track) => (
                                    <TrackCard key={track.courseId} track={track} locale={locale} t={t} />
                                ))}
                            </SurfaceListCard>
                        )]
                        : []),
                ]} />
            </AsyncContent>
        </LabeledCard>
    )
}
