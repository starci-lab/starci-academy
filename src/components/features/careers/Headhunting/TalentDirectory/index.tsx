"use client"

import React from "react"
import { Chip, Skeleton, Typography } from "@heroui/react"
import { RocketLaunchIcon, TrendUpIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { UserAvatar } from "@/components/reuseable/UserAvatar"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { UserJobReadinessBand } from "@/modules/api/graphql/queries/types/user-job-readiness"
import { useQueryCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursesSwr"
import { useQueryTalentCandidatesSwr } from "@/hooks/swr/api/graphql/queries/useQueryTalentCandidatesSwr"
import { pathConfig } from "@/resources/path"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { PressableCard } from "@/components/blocks/cards/PressableCard"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"

/** Number of placeholder cards shown while the candidate list loads. */
const SKELETON_COUNT = 6

/** Maps a readiness band to the `Chip` color that reads correctly. */
const bandColorOf = (band: UserJobReadinessBand): "success" | "warning" | "default" =>
    band === "jobReady" ? "success" : band === "building" ? "warning" : "default"

/** Props for {@link TalentDirectory}. */
export type TalentDirectoryProps = WithClassNames<undefined>

/**
 * Recruiter marketplace — pick ONE track (course) and browse the open-to-work
 * candidates for it, ranked by that track's depth (strongest first). Each card
 * shows the candidate's identity plus the qualitative `band` / `isQualified`
 * badge for the FILTERED track ONLY: never a blended cross-track score, never a
 * raw meaningless number (per the fair-monetization model — see
 * `.workflows/00-INDEX.md`). Ranking is done server-side per `courseId`, so
 * switching the track re-fetches the freshly re-ranked list.
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

    const { data, isLoading } = useQueryTalentCandidatesSwr(selectedCourseId)
    const candidates = data ?? []

    return (
        <div className={className}>
            <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
                <PageHeader
                    title={t("talentDirectory.title")}
                    description={t("talentDirectory.description")}
                />

                {/* track filter (single-select nav → underline tabs). Changing the
                    track re-keys the SWR query below → server-side re-rank. */}
                {courses.length > 0 && selectedCourseId ? (
                    <TabsCard
                        leftTabs={{
                            items: courses.map((course) => ({
                                key: course.id,
                                label: course.title,
                            })),
                            selectedKey: selectedCourseId,
                            ariaLabel: t("talentDirectory.trackFilterAria"),
                            onSelectionChange: (key) => setSelectedCourseId(String(key)),
                        }}
                    />
                ) : null}

                <AsyncContent
                    isLoading={(coursesLoading || isLoading || !selectedCourseId) && candidates.length === 0}
                    skeleton={(
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                                <Skeleton key={index} className="h-36 w-full rounded-3xl" />
                            ))}
                        </div>
                    )}
                    isEmpty={candidates.length === 0}
                    emptyContent={{
                        title: t("talentDirectory.empty"),
                        description: t("talentDirectory.emptyHint"),
                        icon: <TrendUpIcon aria-hidden focusable="false" className="size-8 text-muted" />,
                    }}
                >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {candidates.map(({ user, track }) => (
                            <PressableCard
                                key={user.id}
                                href={pathConfig().locale(locale).profile(user.username ?? "").build()}
                            >
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <UserAvatar
                                            username={user.displayName ?? user.username}
                                            avatar={user.avatar}
                                            seed={user.username}
                                            className="size-12"
                                        />
                                        <div className="flex min-w-0 flex-col gap-0">
                                            <Typography type="body-sm" weight="semibold" truncate>
                                                {user.displayName?.trim() ? user.displayName : user.username}
                                            </Typography>
                                            <Typography type="body-xs" color="muted" truncate>
                                                {user.roleTitle?.trim() ? user.roleTitle : `@${user.username}`}
                                            </Typography>
                                        </div>
                                    </div>

                                    {/* qualitative track badges ONLY — no blended score, no raw number */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        {track.isQualified ? (
                                            <Chip size="sm" variant="soft" color="success">
                                                <RocketLaunchIcon aria-hidden focusable="false" className="size-3" />
                                                <Chip.Label>{t("talentDirectory.qualified")}</Chip.Label>
                                            </Chip>
                                        ) : null}
                                        <Chip size="sm" variant="soft" color={bandColorOf(track.band)}>
                                            <Chip.Label>{t(`jobReadiness.band.${track.band}`)}</Chip.Label>
                                        </Chip>
                                    </div>

                                    {user.bio?.trim() ? (
                                        <Typography type="body-xs" color="muted" className="line-clamp-2">
                                            {user.bio}
                                        </Typography>
                                    ) : null}
                                </div>
                            </PressableCard>
                        ))}
                    </div>
                </AsyncContent>
            </div>
        </div>
    )
}
