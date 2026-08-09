"use client"

import React from "react"
import { RocketLaunchIcon, ChartLineUpIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import type { UserJobReadinessBand, UserJobReadinessTrack } from "@/modules/api/graphql/queries/types/user-job-readiness"
import { useProfileUsername } from "@/hooks/profile/useProfileUsername"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryUserJobReadinessSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserJobReadinessSwr"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { StatPair } from "@/components/composites/stats/StatPair"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { Chip, type ChipTone } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { Cluster } from "@/components/frames/Cluster"
import { FillAvailable } from "@/components/frames/FillAvailable"
import { StackV } from "@/components/frames/Stack"
import type { SkeletonProps } from "@/components/frames/_slot"
import { pathConfig } from "@/resources/path"

/** Props for {@link ProfileJobReadiness}. */
export interface ProfileJobReadinessProps {
    /** Section label, rendered outside the card (owned here, like every other self-contained section). */
    label: string
}

/** Maps a readiness band to the house `Chip` tone that reads correctly. */
const bandToneOf = (band: UserJobReadinessBand): ChipTone =>
    band === "jobReady" ? "success" : band === "building" ? "warning" : "default"

/**
 * One purchased-course depth row body: title + band chip + capstone/interview/CV
 * bars, each pillar rendered only when the learner has attempted it. Content only —
 * the parent {@link SurfaceCardList} owns the row chrome and `href`.
 *
 * @param props.track - the track to render (absent while {@link TrackCardProps.isSkeleton})
 * @param props.t - translation function
 * @param props.isSkeleton - first-load shimmer for the same composite tree
 */
const TrackCard = ({
    track,
    t,
    isSkeleton = false,
}: TrackCardProps) => {
    if (isSkeleton) {
        return (
            <StackV
                gap={4}
                principle="sibling-stack"
                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                items={[
                    () => <Typography size="sm" weight="medium" truncate isSkeleton text="" />,
                    () => (
                        <ProgressMeter
                            isSkeleton
                            label={t("jobReadiness.trackCapstone")}
                            showValue
                        />
                    ),
                    () => (
                        <ProgressMeter
                            isSkeleton
                            label={t("jobReadiness.trackInterview")}
                            showValue
                        />
                    ),
                ]}
            />
        )
    }

    if (!track) {
        return null
    }

    const bandChips = [
        ...(track.isQualified
            ? [() => (
                <Chip
                    tone="success"
                    icon={RocketLaunchIcon}
                    text={t("jobReadiness.qualified")}
                />
            )]
            : []),
        () => (
            <Chip
                tone={bandToneOf(track.band)}
                text={t(`jobReadiness.band.${track.band}`)}
            />
        ),
    ]

    const headerItems = [
        () => (
            <FillAvailable
                at="base"
                explain="Course title takes remaining row width beside band chips so truncate can clip without shoving the chips."
                body={() => (
                    <Typography
                        size="sm"
                        weight="medium"
                        truncate
                        text={track.courseTitle}
                    />
                )}
            />
        ),
        () => (
            <Cluster
                gap={3}
                principle="chip-row"
                explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                items={bandChips}
            />
        ),
    ]

    return (
        <StackV
            gap={4}
            principle="sibling-stack"
            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
            items={[
                () => (
                    <Cluster
                        gap={3}
                        principle="flex-action"
                        explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                        justify="between"
                        items={headerItems}
                    />
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
            ]}
        />
    )
}

/**
 * Strongest-track headline: depth StatPair + band chip + optional foundation
 * percentile. Same composite tree while skeleton (StatPair/Chip shimmer).
 */
const StrongestHeadline = ({
    track,
    foundationPercentile,
    t,
    isSkeleton = false,
}: StrongestHeadlineProps) => (
    <StackV
        gap={4}
        principle="sibling-stack"
        explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
        items={[
            () => (
                <Cluster
                    gap={4}
                    principle="content-row"
                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                    items={[
                        () => (
                            isSkeleton
                                ? <StatPair isSkeleton />
                                : (
                                    <StatPair
                                        value={String(track?.depthScore ?? 0)}
                                        label={track?.courseTitle ?? ""}
                                    />
                                )
                        ),
                        () => (
                            isSkeleton
                                ? <Chip isSkeleton />
                                : (
                                    <Chip
                                        tone={bandToneOf(track!.band)}
                                        text={t(`jobReadiness.band.${track!.band}`)}
                                    />
                                )
                        ),
                    ]}
                />
            ),
            ...(isSkeleton || (foundationPercentile !== null && foundationPercentile !== undefined)
                ? [() => (
                    <Typography
                        size="xs"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={t("jobReadiness.foundationPercentile", { percent: foundationPercentile ?? 0 })}
                    />
                )]
                : []),
        ]}
    />
)

/**
 * Job-readiness snapshot — the recruiter-facing headline section, placed at the
 * very TOP of the profile Overview tab: a headline (strongest track + band +
 * global foundation), then one depth row per purchased course track.
 * Deliberately has NO blended composite score — every track stands alone (see
 * `.workflows/00-INDEX.md` fairness model): a 1-course learner reads as
 * complete, a 3-course learner reads as broad. Self-fetches the viewed user
 * (same pattern as the other overview cards). One labeled {@link SurfaceCardList}
 * owns the section header, empty/error, `isSkeleton`, the optional strongest-track
 * headline row, and track rows (href on the list item — B38 Exact A collapse).
 *
 * @param props - {@link ProfileJobReadinessProps}
 */
export const ProfileJobReadiness = ({ label }: ProfileJobReadinessProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const { data, isLoading, error, mutate } = useQueryUserJobReadinessSwr(userId)

    const tracks = data?.tracks ?? []
    const strongestTrack = tracks[0]
    const isFirstLoad = (isLoading || !userId) && tracks.length === 0
    const showError = tracks.length === 0 && Boolean(error)

    const items: Array<SurfaceCardListItem> = isFirstLoad
        ? [
            {
                key: "headline",
                content: ({ isSkeleton: rowSkeleton }: SkeletonProps) => (
                    <StrongestHeadline
                        t={t}
                        isSkeleton={rowSkeleton ?? true}
                    />
                ),
            },
            {
                key: "track-skel",
                content: ({ isSkeleton: rowSkeleton }: SkeletonProps) => (
                    <TrackCard t={t} isSkeleton={rowSkeleton ?? true} />
                ),
            },
        ]
        : [
            ...(strongestTrack
                ? [{
                    key: "headline",
                    content: () => (
                        <StrongestHeadline
                            track={strongestTrack}
                            foundationPercentile={data?.foundation.codingPercentile}
                            t={t}
                        />
                    ),
                } satisfies SurfaceCardListItem]
                : []),
            ...tracks.map((track) => ({
                key: track.courseId,
                href: pathConfig().locale(locale).course(track.courseSlug).build(),
                content: () => <TrackCard track={track} t={t} />,
            })),
        ]

    return (
        <SurfaceCardList
            identity={{ tier: "block", component: "ProfileJobReadiness" }}
            label={label}
            isSkeleton={isFirstLoad}
            error={showError ? error : undefined}
            errorState={() => (
                <AsyncContentError
                    title={t("jobReadiness.error")}
                    onRetry={() => { void mutate() }}
                    retryLabel={t("publicProfile.loadErrorRetry")}
                />
            )}
            emptyState={() => (
                <AsyncContentEmpty
                    title={t("jobReadiness.empty")}
                    description={t("jobReadiness.emptyHint")}
                    icon={ChartLineUpIcon}
                />
            )}
            items={isFirstLoad || tracks.length > 0 ? items : []}
        />
    )
}

type TrackCardProps = {
    track?: UserJobReadinessTrack
    t: ReturnType<typeof useTranslations>
    isSkeleton?: boolean
}

type StrongestHeadlineProps = {
    track?: UserJobReadinessTrack
    foundationPercentile?: number | null
    t: ReturnType<typeof useTranslations>
    isSkeleton?: boolean
}
