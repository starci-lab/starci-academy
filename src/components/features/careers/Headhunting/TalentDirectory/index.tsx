"use client"

import React from "react"
import { useLocale, useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useQueryCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursesSwr"
import { useQueryTalentCandidatesSwr } from "@/hooks/swr/api/graphql/queries/useQueryTalentCandidatesSwr"
import { pathConfig } from "@/resources/path"
import { _TalentDirectory } from "./component"

/** Props for {@link TalentDirectory}. */
export type TalentDirectoryProps = WithClassNames<undefined>

/**
 * Recruiter marketplace — the CONNECTED half: it fetches the course list and the
 * ranked candidate page for the selected track, resolves every label (incl. the
 * three readiness-band chip strings), and hands them to the presentational
 * {@link _TalentDirectory}. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link TalentDirectoryProps}
 */
export const TalentDirectory = ({ className }: TalentDirectoryProps) => {
    const t = useTranslations()
    const locale = useLocale()

    // the tracks a recruiter can filter on = the real courses (talent depth is
    // per purchased course); the filter panel below swaps with the selection.
    const { data: coursesData, isLoading: coursesLoading } = useQueryCoursesSwr()
    const courses = coursesData?.courses.data?.data ?? []

    const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null)
    // default to the first course once the list resolves
    React.useEffect(() => {
        if (!selectedCourseId && courses.length > 0) {
            setSelectedCourseId(courses[0].id)
        }
    }, [selectedCourseId, courses])

    const candidatesSwr = useQueryTalentCandidatesSwr(selectedCourseId)
    const candidates = candidatesSwr.data ?? []

    return (
        <_TalentDirectory
            className={className}
            // first load, nothing in hand → shimmer (loading-and-skeleton.md); the same
            // condition the legacy `AsyncContent.isLoading` used
            isSkeleton={(coursesLoading || candidatesSwr.isLoading || !selectedCourseId) && candidates.length === 0}
            isEmpty={candidates.length === 0}
            // only a settled fetch error (nothing in hand) reaches the block
            error={candidates.length === 0 ? candidatesSwr.error : undefined}
            onRetry={() => { void candidatesSwr.mutate() }}
            tracks={courses.map((course) => ({ key: course.id, label: course.title }))}
            selectedTrackKey={selectedCourseId}
            onSelectTrack={(key) => setSelectedCourseId(key)}
            candidates={candidates.map(({ user, track }) => ({
                key: user.id,
                href: pathConfig().locale(locale).profile(user.username ?? "").build(),
                // `?.trim()` alone doesn't narrow `user.displayName` for tsc (the truthy
                // check is on the CALL result, not the property) — the plain `&&` form does.
                displayName: user.displayName && user.displayName.trim() ? user.displayName : user.username,
                roleTitle: user.roleTitle && user.roleTitle.trim() ? user.roleTitle : `@${user.username}`,
                avatar: user.avatar,
                seed: user.username,
                isQualified: track.isQualified,
                band: track.band,
                bio: user.bio,
            }))}
            labels={{
                title: t("talentDirectory.title"),
                description: t("talentDirectory.description"),
                trackFilterAria: t("talentDirectory.trackFilterAria"),
                candidatesAria: t("talentDirectory.candidatesAria"),
                emptyTitle: t("talentDirectory.empty"),
                emptyDescription: t("talentDirectory.emptyHint"),
                errorTitle: t("talentDirectory.error"),
                retry: t("common.retry"),
                qualified: t("talentDirectory.qualified"),
                band: {
                    needsWork: t("jobReadiness.band.needsWork"),
                    building: t("jobReadiness.band.building"),
                    jobReady: t("jobReadiness.band.jobReady"),
                },
            }}
        />
    )
}
