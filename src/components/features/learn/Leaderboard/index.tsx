"use client"

import React from "react"
import useSWR from "swr"
import { Button, Separator, cn } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { ArrowsClockwiseIcon } from "@phosphor-icons/react"
import { useAppSelector } from "@/redux"
import { useQueryCourseSwr } from "@/hooks"
import { queryCourseLeaderboard } from "@/modules/api/graphql"
import { AsyncContent, PageHeader, Skeleton } from "@/components/blocks"
import type { WithClassNames } from "@/modules/types"
import { LeaderboardPodium } from "./LeaderboardPodium"
import { LeaderboardTable } from "./LeaderboardTable"
import { MyRankCard } from "./MyRankCard"

/** Props for {@link Leaderboard}. */
export type LeaderboardProps = WithClassNames<undefined>

/**
 * Course-level leaderboard. Ranks enrolled learners by total XP (challenge score
 * + lessons read + milestones) as a top-3 podium, the ranked rows below it, and
 * the viewer's own standing pinned in a card. Reads the owning course id and the
 * viewer identity from Redux and drives the cached `courseLeaderboard` query; a
 * refresh button revalidates on demand. A thin orchestrator — the podium, table,
 * and rank card are composed sub-components; the fetch is wrapped in
 * {@link AsyncContent}.
 *
 * @param props - optional className for the root element.
 */
export const Leaderboard = ({ className }: LeaderboardProps) => {
    const t = useTranslations()
    const locale = useLocale()
    // hydrate the course entity from the URL slug so this route works on a direct
    // load / refresh — unlike the modules layout, nothing upstream fetches it here
    useQueryCourseSwr()
    // owning course id drives which leaderboard is fetched
    const courseId = useAppSelector((state) => state.course.entity?.id)
    // viewer identity highlights their own row / podium
    const viewer = useAppSelector((state) => state.user.user)

    const { data, isLoading, isValidating, error, mutate } = useSWR(
        courseId ? ["course-leaderboard", courseId] : null,
        async () => {
            const response = await queryCourseLeaderboard({
                request: { courseId: courseId as string },
            })
            return response.data?.courseLeaderboard.data ?? null
        },
    )

    // gate: wait for the course to hydrate before the fetch can resolve
    const waiting = !courseId || (isLoading && !data)
    const entries = data?.entries ?? []

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* page heading + refresh */}
            <PageHeader
                title={t("leaderboard.title")}
                description={t("leaderboard.subtitle")}
                actions={(
                    <Button
                        size="sm"
                        variant="secondary"
                        isPending={isValidating}
                        onPress={() => {
                            void mutate()
                        }}
                    >
                        <ArrowsClockwiseIcon
                            aria-hidden
                            focusable="false"
                            className="size-5"
                        />
                        {t("leaderboard.refresh")}
                    </Button>
                )}
            />

            <AsyncContent
                isLoading={waiting}
                skeleton={(
                    <div className="flex flex-col gap-6">
                        {/* podium: three pedestals, the middle one tallest */}
                        <div className="flex items-end justify-center gap-3 sm:gap-6">
                            {["h-16", "h-24", "h-12"].map((height, index) => (
                                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                                    <Skeleton className="size-12 rounded-full" />
                                    <Skeleton.Typography type="body-sm" width="2/3" />
                                    <Skeleton className={cn("w-full rounded-t-xl", height)} />
                                </div>
                            ))}
                        </div>
                        {/* ranked rows */}
                        <div className="flex flex-col gap-3">
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                <div key={index} className="flex items-center gap-3 px-3 py-2">
                                    <Skeleton className="size-6 rounded-md" />
                                    <Skeleton className="size-9 rounded-full" />
                                    <div className="flex flex-1 flex-col gap-2">
                                        <Skeleton.Typography type="body-sm" width="1/3" />
                                        <Skeleton.Typography type="body-xs" width="1/2" />
                                    </div>
                                    <Skeleton.Typography type="body-sm" width="1/4" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                isEmpty={entries.length === 0}
                emptyContent={{
                    title: t("leaderboard.empty"),
                }}
                error={error}
                errorContent={{
                    title: t("leaderboard.error"),
                    onRetry: () => { void mutate() },
                    retryLabel: t("leaderboard.refresh"),
                }}
            >
                <div className="flex flex-col gap-6">
                    {/* top 3 on the podium */}
                    <LeaderboardPodium
                        entries={entries}
                        viewerUserId={viewer?.id}
                    />
                    {/* everyone from rank 4 down */}
                    <LeaderboardTable
                        entries={entries.slice(3)}
                        viewerUserId={viewer?.id}
                    />
                    {/* snapshot freshness — the board is cached server-side */}
                    {data ? (
                        <Separator />
                    ) : null}
                </div>
            </AsyncContent>

            {/* viewer's own standing, shown below the board */}
            {!waiting && data && !error ? (
                <MyRankCard
                    myRank={data.myRank}
                    updatedAtLabel={t("leaderboard.updatedAt", {
                        time: new Date(data.computedAt).toLocaleString(locale),
                    })}
                />
            ) : null}
        </div>
    )
}
