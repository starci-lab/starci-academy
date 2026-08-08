"use client"

import React from "react"
import { Label } from "@heroui/react"
import { useTranslations } from "next-intl"
import { CODING_DIFFICULTY_META } from "@/modules/utils/practice-hub"
import { useQueryUserCodingProgressSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCodingProgressSwr"
import { useQueryUserCodingRankSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCodingRankSwr"
import { useQueryUserCodingSkillsSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCodingSkillsSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { MetricCard } from "@/components/composites/stats/MetricCard"
import { SegmentBar } from "@/components/composites/stats/SegmentBar"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { useAppSelector } from "@/redux/hooks"
import { CodingDifficulty } from "@/modules/api/graphql/queries/types/coding"
import { Box } from "@/components/frames/Box"
import { StackV } from "@/components/frames/Stack"

/** Props for {@link ProgressCockpit}. */
export type ProgressCockpitProps = Record<string, never>
/** Difficulty order for the distribution SegmentBar (easy → hard). */
const COCKPIT_DIFFICULTY: ReadonlyArray<CodingDifficulty> = [
    CodingDifficulty.Easy,
    CodingDifficulty.Medium,
    CodingDifficulty.Hard,
]

/**
 * The PracticeHubPage cockpit — the signed-in user's coding standing at a glance, built
 * from the SAME blocks as the profile Coding tab: a {@link MetricCard} row
 * (solved · points · rank · percentile, the last two hidden when unranked) over a
 * difficulty {@link SegmentBar} (easy/medium/hard solved counts, coding 3-tone
 * scale). Self-contained: reads the signed-in user id from the store and drives
 * its own SWR. Hides entirely for anonymous viewers (no user id → empty cockpit).
 *
 * @param props - optional className for the root element.
 */
export const ProgressCockpit = () => {
    const t = useTranslations()
    // signed-in user id — the rank/skills queries key off it (null when anonymous)
    const userId = useAppSelector((state) => state.user.user?.id) ?? null

    const {
        data: progress,
        isLoading,
        error,
        mutate,
    } = useQueryUserCodingProgressSwr(userId)
    const skillsSwr = useQueryUserCodingSkillsSwr(userId)
    const standingSwr = useQueryUserCodingRankSwr(userId)
    const skills = skillsSwr.data
    const standing = standingSwr.data

    const solved = progress?.solvedProblemIds.length ?? 0
    // `totalPoints` is the user's whole spendable Coin balance, NOT a coding-only
    // figure — the `coding` leaderboard ranks on distinct problems solved instead
    // (points are a different currency). Labelled "Coin" via `metric.points`.
    const totalPoints = progress?.totalPoints ?? 0

    // 2026-07-12: `skills`/`standing` fire alongside `progress` but the outer
    // skeleton only watches `progress` — while they're still in flight, rank/
    // percentile stat cards and the whole difficulty bar used to be silently
    // absent, then pop in a beat after the "solved"/"points" cards had already
    // rendered. Gate each dependent section on its OWN pending state instead of
    // just omitting it.
    const standingPending = standingSwr.isLoading && !standing

    // headline metric row; rank + percentile hide when the user is unranked
    const stats: Array<{ key: string; value: string | null }> = [
        { key: "solved", value: String(solved) },
        { key: "points", value: String(totalPoints) },
    ]
    if (standingPending) {
        stats.push({ key: "rank", value: null }, { key: "percentile", value: null })
    } else {
        if (standing?.rank != null) {
            stats.push({ key: "rank", value: `#${standing.rank}` })
        }
        if (standing?.percentile != null) {
            stats.push({ key: "percentile", value: `${standing.percentile}%` })
        }
    }

    // difficulty distribution (easy→hard), coloured by the coding 3-tone scale
    const skillsPending = skillsSwr.isLoading && !skills
    const solvedByDifficulty = new Map((skills?.byDifficulty ?? []).map((item) => [item.key, item.solved]))
    const difficultySegments = COCKPIT_DIFFICULTY
        .filter((difficulty) => (solvedByDifficulty.get(difficulty) ?? 0) > 0)
        .map((difficulty) => ({
            key: difficulty,
            label: t(CODING_DIFFICULTY_META[difficulty].labelKey),
            value: solvedByDifficulty.get(difficulty) ?? 0,
            color: CODING_DIFFICULTY_META[difficulty].color,
        }))

    // anonymous viewers never fire the queries (key disabled) — bail out
    // instead of `isLoading`/`!userId` feeding `isFirstLoad` forever.
    if (!userId) return null

    // first load in flight only when no progress has resolved yet
    const isFirstLoad = !progress && isLoading

    return (
        <AsyncContent
            isLoading={isFirstLoad}
            skeleton={(
                <div className={"flex flex-col gap-6"}>
                    {/* metric row — solved · points · rank · percentile */}
                    <Box principle="content-row" className="grid grid-cols-2 gap-3 @app-sm:grid-cols-4"
                        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title.">
                        {[0, 1, 2, 3].map((index) => (
                            <Skeleton key={index} className="h-24 w-full rounded-2xl" />
                        ))}
                    </Box>
                    {/* difficulty distribution bar */}
                    <StackV gap={3} principle="sibling-stack"
                        explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                        items={[
                            () => <Skeleton.Typography type="body-sm" width="1/4" />,
                            () => <Skeleton.SegmentBar legendItems={3} />,
                        ]} />
                </div>
            )}
            error={error}
            errorContent={{
                title: t("PracticeHubPage.cockpit.loadError"),
                onRetry: () => { void mutate() },
                retryLabel: t("PracticeHubPage.retry"),
            }}
        >
            <div className={"flex flex-col gap-6"}>
                {/* headline metric row — pending rank/percentile cards skeleton in place */}
                <Box principle="content-row" className="grid grid-cols-2 gap-3 @app-sm:grid-cols-4"
                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title.">
                    {stats.map((stat) => (
                        stat.value === null ? (
                            <Skeleton key={stat.key} className="h-24 w-full rounded-2xl" />
                        ) : (
                            <MetricCard
                                key={stat.key}
                                value={stat.value}
                                label={t(`PracticeHubPage.cockpit.metric.${stat.key}`)}
                            />
                        )
                    ))}
                </Box>

                {/* difficulty distribution — skeleton while resolving, hidden once
                    resolved with nothing solved yet, real bar otherwise */}
                {skillsPending ? (
                    <StackV gap={3} principle="sibling-stack"
                        explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                        items={[
                            () => <Skeleton.Typography type="body-sm" width="1/4" />,
                            () => <Skeleton.SegmentBar legendItems={3} />,
                        ]} />
                ) : difficultySegments.length > 0 ? (
                    <StackV gap={3} principle="sibling-stack"
                        explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                        items={[
                            () => <Label>{t("PracticeHubPage.cockpit.byDifficulty")}</Label>,
                            () => (
                                <SegmentBar
                                    ariaLabel={t("PracticeHubPage.cockpit.byDifficulty")}
                                    segments={difficultySegments}
                                />
                            ),
                        ]} />
                ) : null}
            </div>
        </AsyncContent>
    )
}
