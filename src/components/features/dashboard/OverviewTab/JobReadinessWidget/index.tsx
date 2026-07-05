"use client"

import React from "react"
import { Button, Chip, Typography, cn } from "@heroui/react"
import { ArrowRightIcon, BriefcaseIcon, TrendUpIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import type { UserJobReadinessBand, UserJobReadinessTrack } from "@/modules/api/graphql/queries/types/user-job-readiness"
import { useQueryMyJobReadinessSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyJobReadinessSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { StatPair } from "@/components/blocks/stats/StatPair"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link JobReadinessWidget}. */
export type JobReadinessWidgetProps = WithClassNames<undefined>

/** Which pillar to nudge the learner to complete next, for a given track. */
type MissingPillar = "capstone" | "interview" | "cv" | null

/** Maps a readiness band to the `Chip` color that reads correctly. */
const bandColorOf = (band: UserJobReadinessBand): "success" | "warning" | "default" =>
    band === "jobReady" ? "success" : band === "building" ? "warning" : "default"

/**
 * Picks the single most-impactful missing pillar for a track, in the order a
 * learner would naturally tackle them: finish the capstone first, then the
 * mock interview, then the CV tied to this track's course. Returns `null`
 * once every pillar has at least an attempt — never re-suggests a pillar
 * that already has a score, and never suggests buying another course.
 *
 * @param track - the strongest track to inspect (its own `cvScore`, never blended)
 */
const missingPillarOf = (track: UserJobReadinessTrack): MissingPillar => {
    if (track.capstoneScore === null) return "capstone"
    if (track.interviewScore === null) return "interview"
    if (track.cvScore === null) return "cv"
    return null
}

/**
 * Dashboard "Độ sẵn sàng của tôi" self-widget — the growth-loop nudge for the
 * viewer's OWN job-readiness snapshot: a headline (strongest track's depth +
 * band, plus the global foundation percentile), its capstone/interview/CV
 * pillar bars (each rendered only when attempted), and a single CTA aimed at
 * whichever pillar is still missing (capstone → mock interview → CV).
 *
 * Deliberately never suggests buying another course to raise a score (see
 * `.workflows/00-INDEX.md` fairness model + WF-06 copy discipline) — the CTA
 * only ever points at completing real work on the track the learner already
 * owns. Content only — the parent {@link import("@/components/blocks").LabeledCard}
 * supplies the frame. Self-fetches via `myJobReadiness` (no props).
 *
 * @param props.className - optional root class name (placement only)
 */
export const JobReadinessWidget = ({ className }: JobReadinessWidgetProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data, isLoading, error, mutate } = useQueryMyJobReadinessSwr()

    const tracks = data?.tracks ?? []
    const strongestTrack = tracks[0]
    const missingPillar = strongestTrack ? missingPillarOf(strongestTrack) : null

    const ctaHref = strongestTrack
        ? missingPillar === "capstone"
            ? pathConfig().locale(locale).course(strongestTrack.courseSlug).learn().personalProject().build()
            : missingPillar === "interview"
                ? pathConfig().locale(locale).course(strongestTrack.courseSlug).learn().mockInterview().build()
                : missingPillar === "cv"
                    // CV is a USER-level tool (not course-scoped) — `/learn/cv` never
                    // existed as a route (dead builder in pathConfig, unused elsewhere).
                    ? pathConfig().locale(locale).profile().cv().build()
                    : null
        : null

    const ctaLabel = missingPillar === "capstone"
        ? t("jobReadiness.ctaCapstone")
        : missingPillar === "interview"
            ? t("jobReadiness.ctaInterview")
            : missingPillar === "cv"
                ? t("jobReadiness.ctaCv")
                : null

    return (
        <AsyncContent
            isLoading={isLoading && tracks.length === 0}
            skeleton={(
                <div className="flex flex-col gap-3">
                    <Skeleton.Metric />
                    <Skeleton.Typography type="body-sm" width="1/3" />
                    <Skeleton.Button />
                </div>
            )}
            isEmpty={tracks.length === 0}
            emptyContent={{
                title: t("jobReadiness.myEmpty"),
                description: t("jobReadiness.emptyHint"),
                icon: <TrendUpIcon aria-hidden focusable="false" className="size-8 text-muted" />,
            }}
            error={tracks.length === 0 ? error : undefined}
            errorContent={{
                title: t("jobReadiness.error"),
                onRetry: () => { void mutate() },
                retryLabel: t("dashboard.retry"),
            }}
        >
            <div className={cn("flex flex-col gap-3", className)}>
                {strongestTrack ? (
                    <>
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
                        {strongestTrack.capstoneScore !== null ? (
                            <ProgressMeter
                                label={t("jobReadiness.trackCapstone")}
                                value={strongestTrack.capstoneScore}
                                max={100}
                                showValue
                            />
                        ) : null}
                        {strongestTrack.interviewScore !== null ? (
                            <ProgressMeter
                                label={t("jobReadiness.trackInterview")}
                                value={strongestTrack.interviewScore}
                                max={100}
                                showValue
                            />
                        ) : null}
                        {strongestTrack.cvScore !== null ? (
                            <ProgressMeter
                                label={t("jobReadiness.trackCv")}
                                value={strongestTrack.cvScore}
                                max={100}
                                showValue
                            />
                        ) : null}
                        {ctaHref && ctaLabel ? (
                            <Button
                                variant="primary"
                                className="self-start"
                                onPress={() => router.push(ctaHref)}
                            >
                                {ctaLabel}
                                <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                            </Button>
                        ) : null}
                    </>
                ) : null}
            </div>
        </AsyncContent>
    )
}

/** Icon used by the parent `LabeledCard` for this widget's section label. */
export const JobReadinessWidgetIcon = BriefcaseIcon
