"use client"

import { ArrowRotateLeft as ArrowClockwiseIcon } from "@gravity-ui/icons"
import React from "react"
import useSWR from "swr"
import { Button, cn } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { useQueryCourseSwr } from "@/hooks"
import { queryCourseLeaderboard } from "@/modules/api/graphql"
import { type WithClassNames } from "@/modules/types"
import { LeaderboardPodium } from "../LeaderboardPodium"
import { LeaderboardTable } from "../LeaderboardTable"
import { MyRankCard } from "../MyRankCard"
import { LeaderboardSkeleton } from "../LeaderboardSkeleton"


export type LeaderboardLayoutProps = WithClassNames<undefined>

/**
 * Course-level leaderboard page. Ranks enrolled learners by total XP (challenge
 * score + lessons read + milestones), shown as a top-3 podium, the ranked rows
 * below it, and the viewer's own standing pinned in a card. Data is fetched from
 * the cached `courseLeaderboard` query; a refresh button revalidates on demand.
 * @param {LeaderboardLayoutProps} props Optional wrapper styling props.
 */
export const LeaderboardLayout = ({ className }: LeaderboardLayoutProps) => {
    const t = useTranslations()
    const locale = useLocale()
    // hydrate the course entity from the URL slug so this route works on a direct
    // load / refresh — unlike the modules layout, nothing upstream fetches it here
    useQueryCourseSwr()
    // owning course id drives which leaderboard is fetched
    const courseId = useAppSelector((state) => state.course.entity?.id)
    // viewer identity highlights their own row / podium and feeds the rank card avatar
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

    // gate: wait for the course to hydrate and the first fetch to settle
    const ready = !!courseId && !isLoading && !!data && !error

    return (
        <div className={cn("p-3", className)}>
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
                {/* page heading + refresh */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-foreground">
                            {t("leaderboard.title")}
                        </h1>
                        <p className="text-sm text-muted">{t("leaderboard.subtitle")}</p>
                        {/* snapshot freshness — the board is cached server-side */}
                        {ready && data && (
                            <span className="text-xs text-muted">
                                {t("leaderboard.updatedAt", {
                                    time: new Date(data.computedAt).toLocaleString(locale),
                                })}
                            </span>
                        )}
                    </div>
                    <Button
                        size="sm"
                        variant="secondary"
                        isPending={isValidating}
                        onPress={() => {
                            void mutate()
                        }}
                    >
                        <ArrowClockwiseIcon className="size-4" />
                        {t("leaderboard.refresh")}
                    </Button>
                </div>

                {error ? (
                    <p className="py-10 text-center text-danger">{t("leaderboard.error")}</p>
                ) : !ready ? (
                    <LeaderboardSkeleton />
                ) : !data || data.entries.length === 0 ? (
                    <p className="py-10 text-center text-muted">{t("leaderboard.empty")}</p>
                ) : (
                    <div className="flex flex-col gap-6">
                        {/* top 3 on the podium */}
                        <LeaderboardPodium
                            entries={data.entries}
                            viewerUserId={viewer?.id}
                        />
                        {/* everyone from rank 4 down */}
                        <LeaderboardTable
                            entries={data.entries.slice(3)}
                            viewerUserId={viewer?.id}
                        />
                    </div>
                )}

                {/* viewer's own standing, shown below the board */}
                {ready && data && (
                    <MyRankCard
                        myRank={data.myRank}
                        username={viewer?.username}
                        avatar={viewer?.avatar}
                    />
                )}
            </div>
        </div>
    )
}
