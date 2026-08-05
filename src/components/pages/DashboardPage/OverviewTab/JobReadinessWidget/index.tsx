"use client"

import React from "react"
import { BriefcaseIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import type { UserJobReadinessTrack } from "@/modules/api/graphql/queries/types/user-job-readiness"
import { useQueryMyJobReadinessSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyJobReadinessSwr"
import { pathConfig } from "@/resources/path"
import { _JobReadinessWidget } from "./component"

/** Which pillar to nudge the learner to complete next, for a given track. */
type MissingPillar = "capstone" | "interview" | "cv" | null

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
 * DashboardPage "My job readiness" self-widget — the CONNECTED half: self-fetches
 * the viewer's job-readiness snapshot via `myJobReadiness`, picks the
 * strongest track, resolves the single missing-pillar CTA's route + label,
 * and hands every resolved value to the presentational
 * {@link _JobReadinessWidget}. See `tiers/split.md`.
 */
export const JobReadinessWidget = () => {
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

    const codingPercentile = data?.foundation.codingPercentile

    return (
        <_JobReadinessWidget
            // first-load formula (loading-and-skeleton.md §2): nothing to show yet
            isSkeleton={isLoading && tracks.length === 0}
            isEmpty={tracks.length === 0}
            // only surface the error slot when there is no cached track to fall back to
            error={tracks.length === 0 ? error : undefined}
            onRetry={() => { void mutate() }}
            courseTitle={strongestTrack?.courseTitle}
            depthScore={strongestTrack?.depthScore ?? undefined}
            band={strongestTrack?.band}
            bandLabel={strongestTrack ? t(`jobReadiness.band.${strongestTrack.band}`) : undefined}
            foundationPercentileText={codingPercentile !== null && codingPercentile !== undefined
                ? t("jobReadiness.foundationPercentile", { percent: codingPercentile })
                : undefined}
            capstoneScore={strongestTrack?.capstoneScore}
            interviewScore={strongestTrack?.interviewScore}
            cvScore={strongestTrack?.cvScore}
            onCtaPress={ctaHref ? () => router.push(ctaHref) : undefined}
            ctaLabel={ctaLabel ?? undefined}
            labels={{
                errorTitle: t("jobReadiness.error"),
                retry: t("DashboardPage.retry"),
                emptyTitle: t("jobReadiness.myEmpty"),
                emptyDescription: t("jobReadiness.emptyHint"),
                trackCapstone: t("jobReadiness.trackCapstone"),
                trackInterview: t("jobReadiness.trackInterview"),
                trackCv: t("jobReadiness.trackCv"),
            }}
        />
    )
}

/** Icon used by the parent `LabeledCard` for this widget's section label. */
export const JobReadinessWidgetIcon = BriefcaseIcon
