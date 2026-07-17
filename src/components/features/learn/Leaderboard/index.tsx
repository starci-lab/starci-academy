"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Button, Typography, cn } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { LearnBreadcrumb } from "../shared/LearnBreadcrumb"
import { TrialEnrollHook } from "../shared/TrialEnrollHook"
import { LeaderboardCategoryRail } from "./LeaderboardCategoryRail"
import {
    categoryEntryXp,
    categoryMyXp,
    parseCategoryParam,
    rankEntriesByCategory,
    type LeaderboardCategoryKey,
} from "./categories"
import { useLeaderboardSwr } from "./useLeaderboardSwr"
import { useAppSelector } from "@/redux/hooks"
import { useQueryCourseSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import {
    LeaderboardListCard,
    LeaderboardRow,
} from "@/components/features/dashboard/league/LeaderboardListCard"
import { Podium } from "@/components/features/dashboard/league/Podium"
import { Confetti } from "@/components/features/dashboard/league/Confetti"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link Leaderboard}. */
export type LeaderboardProps = WithClassNames<undefined>

/**
 * Course-level leaderboard board. The XP-category selector lives in the learn
 * shell's left rail (a sidebar, like the content page) on desktop and as a chip
 * row here on mobile; both drive the `?category=` URL param. This board reads that
 * param and ranks learners by the selected category (client-side): a top-3 podium
 * + ranked list when there are enough, a single champion card when the course has
 * one learner. A text "refresh" revalidates the cached `courseLeaderboard` query.
 *
 * @param props - optional className for the root element.
 */
export const Leaderboard = ({ className }: LeaderboardProps) => {
    const t = useTranslations()
    const locale = useLocale()
    // hydrate the course entity from the URL slug so this route works on a direct load / refresh
    useQueryCourseSwr()
    // viewer identity highlights their own podium/row
    const viewer = useAppSelector((state) => state.user.user)
    const courseId = useAppSelector((state) => state.course.entity?.id)

    // the selected category lives in the URL so the left rail (a different layout
    // slot) and this board stay in sync without shared React state
    const searchParams = useSearchParams()
    const selectedCategory = parseCategoryParam(searchParams.get("category"))

    const { data, isLoading, isValidating, error, mutate } = useLeaderboardSwr()

    // gate: wait for the course to hydrate before the fetch can resolve
    const waiting = !courseId || (isLoading && !data)
    const entries = useMemo(() => data?.entries ?? [], [data])
    const rankedEntries = useMemo(
        () => rankEntriesByCategory(entries, selectedCategory),
        [entries, selectedCategory],
    )
    // display label per category (explicit keys — avoids a dynamic i18n lookup)
    const categoryLabels: Record<LeaderboardCategoryKey, string> = {
        total: t("leaderboard.categories.total"),
        challenge: t("leaderboard.categories.challenge"),
        reading: t("leaderboard.categories.reading"),
        milestone: t("leaderboard.categories.milestone"),
    }

    // dashboard-style board: viewer's own standing + a medal-ranked list (top-3 wear
    // place medals), mirroring the dashboard "Top học viên" card, per category.
    const viewerId = viewer?.id
    const isMine = (userId: string) => Boolean(viewerId) && userId === viewerId
    const viewerRow = rankedEntries.find((ranked) => isMine(ranked.entry.userId))
    const viewerRank = viewerRow?.displayRank ?? data?.myRank?.rank
    const viewerXp = viewerRow
        ? categoryEntryXp(viewerRow.entry, selectedCategory)
        : categoryMyXp(data?.myRank ?? null, selectedCategory)

    const rows: Array<LeaderboardRow> = rankedEntries.map((ranked) => ({
        key: ranked.entry.enrollmentId,
        rank: ranked.displayRank,
        username: ranked.entry.username,
        avatar: ranked.entry.avatar,
        valueLabel: t("leaderboard.xp", { xp: categoryEntryXp(ranked.entry, selectedCategory) }),
        isMe: isMine(ranked.entry.userId),
        profileHref: ranked.entry.username
            ? pathConfig().locale(locale).profile(ranked.entry.username).build()
            : undefined,
    }))

    // top-3 dais — the page is spacious (unlike the compact dashboard cards)
    const podiumEntries = rankedEntries.slice(0, 3).map((ranked) => ({
        rank: ranked.displayRank,
        username: ranked.entry.username,
        avatar: ranked.entry.avatar,
        pointsLabel: t("leaderboard.xp", { xp: categoryEntryXp(ranked.entry, selectedCategory) }),
        isMe: isMine(ranked.entry.userId),
    }))

    const standing = viewerRank
        ? {
            rank: viewerRank,
            primary: `${t("leaderboard.rankPrefix")} #${viewerRank}`,
            secondary: t("leaderboard.xp", { xp: viewerXp }),
        }
        : undefined

    // viewer outside the fetched window → a pinned self-row (mirrors the dashboard)
    const showSelfRow = !viewerRow && Boolean(data?.myRank)
    const selfRow: LeaderboardRow | undefined = showSelfRow && data?.myRank
        ? {
            key: "self",
            rank: data.myRank.rank,
            username: viewer?.username ?? null,
            avatar: viewer?.avatar,
            valueLabel: t("leaderboard.xp", { xp: viewerXp }),
            isMe: true,
        }
        : undefined
    const hiddenBetween = showSelfRow && data?.myRank
        ? Math.max(0, data.myRank.rank - rankedEntries.length - 1)
        : 0

    // celebrate a top-3 finish — fires on entry + when switching to another category
    // where the viewer also places top-3 (the board doesn't remount on category change)
    const isTop = Boolean(viewerRank) && (viewerRank ?? 99) <= 3
    const [celebrateKey, setCelebrateKey] = useState(0)
    const lastCelebrated = useRef<string | null>(null)
    useEffect(
        () => {
            if (isTop && lastCelebrated.current !== selectedCategory) {
                lastCelebrated.current = selectedCategory
                setCelebrateKey((key) => key + 1)
            }
        },
        [isTop, selectedCategory],
    )

    return (
        <div className={cn("mx-auto flex w-full max-w-3xl flex-col gap-10", className)}>
            {/* page heading (no top-right action — refresh lives with the board below) */}
            <PageHeader
                breadcrumb={<LearnBreadcrumb current={t("leaderboard.title")} />}
                title={t("leaderboard.title")}
                description={t("leaderboard.subtitle")}
            />

            {/* ambient trial → enroll hook (self-hides for paid learners) */}
            <TrialEnrollHook />

            <div className="flex flex-col gap-6">
                {/* mobile category selector (the desktop rail lives in the shell's left slot) */}
                <LeaderboardCategoryRail variant="chips" className="lg:hidden" />

                {/* board toolbar: what we're ranked by + freshness + a plain refresh */}
                <div className="flex items-center justify-between gap-3">
                    <Typography type="body-sm" weight="medium">
                        {t("leaderboard.rankedBy", { category: categoryLabels[selectedCategory] })}
                    </Typography>
                    <div className="flex shrink-0 items-center gap-3">
                        {data ? (
                            <Typography type="body-xs" color="muted">
                                {t("leaderboard.updatedAt", {
                                    time: new Date(data.computedAt).toLocaleString(locale),
                                })}
                            </Typography>
                        ) : null}
                        <Button
                            size="sm"
                            variant="ghost"
                            isPending={isValidating}
                            onPress={() => {
                                void mutate()
                            }}
                        >
                            {t("leaderboard.refresh")}
                        </Button>
                    </div>
                </div>

                <AsyncContent
                    isLoading={waiting}
                    skeleton={(
                        <div className="flex flex-col gap-2">
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                <div key={index} className="flex items-center gap-3 px-2 py-2">
                                    <Skeleton className="size-5 rounded-md" />
                                    <Skeleton className="size-9 rounded-full" />
                                    <div className="flex flex-1 flex-col gap-2">
                                        <Skeleton.Typography type="body-sm" width="1/3" />
                                        <Skeleton className="h-1.5 w-4/5 rounded-full" />
                                    </div>
                                    <Skeleton.Typography type="body-sm" width="1/4" />
                                </div>
                            ))}
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
                    <>
                        {/* confetti when the viewer places top-3 in this category */}
                        <Confetti fireKey={celebrateKey} />
                        <LeaderboardListCard
                            bare
                            standing={standing}
                            topSlot={rankedEntries.length > 0 ? (
                                <Podium entries={podiumEntries} meLabel={t("leaderboard.you")} />
                            ) : null}
                            rows={rows.slice(3)}
                            selfRow={selfRow}
                            ellipsisLabel={hiddenBetween > 0
                                ? t("dashboard.league.othersCount", { count: hiddenBetween })
                                : undefined}
                            meLabel={t("leaderboard.you")}
                        />
                    </>
                </AsyncContent>
            </div>
        </div>
    )
}
