"use client"

import React from "react"
import {
    Label,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    useProfileUsername,
} from "@/hooks/profile/useProfileUsername"
import {
    buildDifficultySegments,
} from "@/modules/utils/challenge-difficulty"
import {
    groupByCourse,
} from "./groupByCourse"
import {
    ChallengeCourseRow,
} from "./ChallengeCourseRow"
import { useQueryUserChallengeStrengthSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserChallengeStrengthSwr"
import { useQueryUserCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCoursesSwr"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryUserSolvedChallengesSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserSolvedChallengesSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { StatRibbon } from "@/components/composites/stats/StatRibbon"
import { SegmentBar } from "@/components/composites/stats/SegmentBar"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { StackH, StackV } from "@/components/frames/Stack"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { getLanguageColor, getLanguageLabel } from "@/modules/utils/language"

/** Props for {@link ProfileChallenges}. */
export type ProfileChallengesProps = WithClassNames<undefined>

/**
 * Challenges tab — the profile owner's graded-challenge proof of work. Leads with
 * a passed count + a 4-tone difficulty {@link SegmentBar} (easy→green /
 * medium→yellow / hard→red / insane→purple), then the submission list rendered as
 * Projects-tab-style rows: one collapsible {@link ChallengeCourseRow} per course
 * (its own difficulty bar + count), expanded on demand to reveal the repo links.
 * Self-contained: reads the username from the route, resolves it to the entity id,
 * and drives its own projection-backed SWR.
 *
 * @param props - optional className for the root element.
 */
export const ProfileChallenges = ({
    className,
}: ProfileChallengesProps) => {
    const t = useTranslations()
    // route carries the username; resolve to the entity id the query keys off
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const {
        data,
        isLoading,
        error,
        mutate,
    } = useQueryUserSolvedChallengesSwr(userId)
    // difficulty-weighted challenge strength: global percentile + rank (null until passed)
    const { data: strength } = useQueryUserChallengeStrengthSwr(userId)
    // joined courses → total challenges per course (for the per-course progress bar)
    const { data: coursesData } = useQueryUserCoursesSwr(userId)
    const totalChallengesByCourse = new Map(
        (coursesData ?? []).map((course) => [course.label, course.challengeTotal]),
    )

    const challenges = data ?? []
    // difficulty distribution across all passed challenges (the headline bar)
    const difficultySegments = buildDifficultySegments(challenges)
    // language breadth: count per language, skipping rows with no language
    const langCounts = challenges.reduce<Record<string, number>>((acc, challenge) => {
        if (!challenge.selectedLang) {
            return acc
        }
        acc[challenge.selectedLang] = (acc[challenge.selectedLang] ?? 0) + 1
        return acc
    }, {})
    const langs = Object.entries(langCounts).sort((a, b) => b[1] - a[1])
    // submission list grouped by course (when the backend resolves titles)
    const groups = groupByCourse(challenges)

    // headline metric row (Coding-tab style): passed + XP + percentile + rank.
    // XP is the REAL ledger sum from the backend (NOT a FE sum of scores).
    const metricStats: Array<{ key: string; value: string }> = [
        { key: "passed", value: String(challenges.length) },
    ]
    if (strength?.xp != null) {
        metricStats.push({ key: "xp", value: String(strength.xp) })
    }
    if (strength?.percentile != null) {
        metricStats.push({ key: "percentile", value: `${strength.percentile}%` })
    }
    if (strength?.rank != null) {
        metricStats.push({ key: "rank", value: `#${strength.rank}` })
    }

    const rootClassNames: Array<AllowedClassName> = []
    if (className) {
        rootClassNames.push(className as AllowedClassName)
    }

    return (
        <AsyncContent
            isLoading={(isLoading || !userId) && challenges.length === 0}
            skeleton={(
                <StackV gap={6} principle="block-boundary" classNames={rootClassNames} items={[
                    () => (
                        <StackV gap={4} items={[
                            () => <Skeleton.Typography type="body-sm" width="1/4" />,
                            () => <Skeleton className="h-20 w-full rounded-2xl" />,
                        ]} />
                    ),
                    () => (
                        <StackV gap={4} items={[
                            () => <Skeleton.Typography type="body-sm" width="1/4" />,
                            () => (
                                <SurfaceListCard>
                                    <SurfaceListCardItem>
                                        <Skeleton.SegmentBar legendItems={4} />
                                    </SurfaceListCardItem>
                                    <SurfaceListCardItem>
                                        <Skeleton.SegmentBar legendItems={4} />
                                    </SurfaceListCardItem>
                                </SurfaceListCard>
                            ),
                        ]} />
                    ),
                    () => (
                        <StackV gap={4} items={[
                            () => <Skeleton.Typography type="body-sm" width="1/4" />,
                            () => (
                                <SurfaceListCard>
                                    {[0, 1, 2].map((row) => (
                                        <SurfaceListCardItem key={row}>
                                            <StackH gap={4} principle="content-row" align="start" items={[
                                                () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
                                                () => (
                                                    <StackV gap={3} principle="sibling-stack" classNames={["min-w-0", "flex-1"]} items={[
                                                        () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                                        () => <Skeleton.ProgressBar />,
                                                        () => <Skeleton.Typography type="body-xs" width="1/3" />,
                                                    ]} />
                                                ),
                                            ]} />
                                        </SurfaceListCardItem>
                                    ))}
                                </SurfaceListCard>
                            ),
                        ]} />
                    ),
                ]} />
            )}
            isEmpty={challenges.length === 0}
            emptyContent={{
                title: t("publicProfile.challengesTab.empty"),
                description: t("publicProfile.challengesTab.emptyHint"),
            }}
            error={challenges.length === 0 ? error : undefined}
            errorContent={{
                title: t("publicProfile.loadError"),
                onRetry: () => { void mutate() },
                retryLabel: t("publicProfile.loadErrorRetry"),
            }}
        >
            <StackV gap={6} principle="block-boundary" classNames={rootClassNames} items={[
                () => (
                    <LabeledCard label={t("publicProfile.challengesTab.metricsHeading")} frameless>
                        <StatRibbon
                            items={metricStats.map((stat) => ({
                                key: stat.key,
                                value: stat.value,
                                label: t(`publicProfile.challengesTab.metric.${stat.key}`),
                            }))}
                        />
                    </LabeledCard>
                ),
                () => (
                    <LabeledCard
                        label={t("publicProfile.challengesTab.statsHeading")}
                        frameless
                    >
                        <SurfaceListCard>
                            {difficultySegments.length > 0 ? (
                                <SurfaceListCardItem>
                                    <StackV gap={3} principle="sibling-stack" items={[
                                        () => <Label>{t("publicProfile.challengesTab.difficultyHeading")}</Label>,
                                        () => (
                                            <SegmentBar
                                                ariaLabel={t("publicProfile.challengesTab.difficultyHeading")}
                                                segments={difficultySegments}
                                            />
                                        ),
                                    ]} />
                                </SurfaceListCardItem>
                            ) : null}
                            {langs.length > 0 ? (
                                <SurfaceListCardItem>
                                    <StackV gap={3} principle="sibling-stack" items={[
                                        () => <Label>{t("publicProfile.challengesTab.languageHeading")}</Label>,
                                        () => (
                                            <SegmentBar
                                                ariaLabel={t("publicProfile.challengesTab.languageHeading")}
                                                segments={langs.map(([lang, count]) => ({
                                                    key: lang,
                                                    label: getLanguageLabel(lang),
                                                    value: count,
                                                    color: getLanguageColor(lang),
                                                }))}
                                            />
                                        ),
                                    ]} />
                                </SurfaceListCardItem>
                            ) : null}
                        </SurfaceListCard>
                    </LabeledCard>
                ),
                () => (
                    <LabeledCard
                        label={t("publicProfile.challengesTab.repoHeading")}
                        frameless
                    >
                        <SurfaceListCard>
                            {groups.map((group, groupIndex) => (
                                <ChallengeCourseRow
                                    key={group.courseTitle ?? `__ungrouped-${groupIndex}`}
                                    username={username}
                                    courseTitle={group.courseTitle}
                                    courseSlug={group.courseSlug}
                                    items={group.items}
                                    totalChallenges={group.courseTitle
                                        ? totalChallengesByCourse.get(group.courseTitle)
                                        : undefined}
                                />
                            ))}
                        </SurfaceListCard>
                    </LabeledCard>
                ),
            ]} />
        </AsyncContent>
    )
}
