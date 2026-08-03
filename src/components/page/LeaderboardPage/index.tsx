"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
    categoryEntryXp,
    categoryMyXp,
    parseCategoryParam,
    rankEntriesByCategory,
    type LeaderboardCategoryKey,
} from "@/components/features/learn/Leaderboard/categories"
import { useLeaderboardSwr } from "@/components/features/learn/Leaderboard/useLeaderboardSwr"
import { useQueryCourseSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseSwr"
import { useAppSelector } from "@/redux/hooks"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { PaymentFlow } from "@/modules/types/payment"
import { pathConfig } from "@/resources/path"
import { _LeaderboardPage } from "./component"
import type { LeaderboardHeaderCrumb } from "@/components/starci/blocks/learn/LeaderboardHeader"
import type { LeaderboardCategoryOption } from "@/components/starci/blocks/learn/LeaderboardCategoryNav"
import type { LeaderboardStanding, LeaderboardPodiumEntry, LeaderboardRow } from "@/components/starci/blocks/learn/LeaderboardBoard"

/**
 * Course-level leaderboard screen — the CONNECTED half of the `/learn/leaderboard` page.
 * Mirrors the data wiring of `@/components/features/learn/Leaderboard`: hydrates the course
 * from the URL slug, reads the `?category=` param (shared with the desktop rail living in a
 * different layout slot), fetches `courseLeaderboard` (SWR, deduped with that rail), ranks
 * entries client-side by the selected category, and resolves the ambient trial → enroll nudge
 * off the same Redux enrollment status. Everything is resolved into typed data and handed to
 * the presentational {@link _LeaderboardPage}.
 *
 * src twin of `.storybook/components/starci/pages/LeaderboardPage/LeaderboardPage.tsx`,
 * wired to the same v1 data source as `@/components/features/learn/Leaderboard`
 * (`/src/app/[locale]/courses/[courseId]/learn/leaderboard/page.tsx`).
 */
export const LeaderboardPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    // hydrate the course entity from the URL slug so this route works on a direct load / refresh
    useQueryCourseSwr()
    const course = useAppSelector((state) => state.course.entity)
    const courseId = course?.id
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    // viewer identity highlights their own podium/row
    const viewer = useAppSelector((state) => state.user.user)
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const enrollKnown = useAppSelector((state) => state.user.enrollKnown)
    const { open } = usePaymentOverlayState()

    // the selected category lives in the URL so the left rail (a different layout
    // slot) and this screen stay in sync without shared React state
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
        username: ranked.entry.username ?? "",
        avatar: ranked.entry.avatar,
        valueLabel: t("leaderboard.xp", { xp: categoryEntryXp(ranked.entry, selectedCategory) }),
        isMe: isMine(ranked.entry.userId),
        profileHref: ranked.entry.username
            ? pathConfig().locale(locale).profile(ranked.entry.username).build()
            : undefined,
    }))

    // top-3 dais — the page is spacious (unlike the compact dashboard cards)
    const podiumEntries: Array<LeaderboardPodiumEntry> = rankedEntries.slice(0, 3).map((ranked) => ({
        rank: ranked.displayRank as 1 | 2 | 3,
        username: ranked.entry.username ?? "",
        avatar: ranked.entry.avatar,
        pointsLabel: t("leaderboard.xp", { xp: categoryEntryXp(ranked.entry, selectedCategory) }),
        isMe: isMine(ranked.entry.userId),
    }))

    const standing: LeaderboardStanding | undefined = viewerRank
        ? {
            rank: viewerRank,
            primaryLabel: `${t("leaderboard.rankPrefix")} #${viewerRank}`,
            secondaryLabel: t("leaderboard.xp", { xp: viewerXp }),
        }
        : undefined

    // viewer outside the fetched window → a pinned self-row (mirrors the dashboard)
    const showSelfRow = !viewerRow && Boolean(data?.myRank)
    const selfRow: LeaderboardRow | undefined = showSelfRow && data?.myRank
        ? {
            key: "self",
            rank: data.myRank.rank,
            username: viewer?.username ?? "",
            avatar: viewer?.avatar,
            valueLabel: t("leaderboard.xp", { xp: viewerXp }),
            isMe: true,
        }
        : undefined
    const hiddenBetweenCount = showSelfRow && data?.myRank
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

    // mobile chip row + toolbar data — the viewer's own XP composition per category
    const myRank = data?.myRank ?? null
    const categoryItems: Array<LeaderboardCategoryOption> = (["total", "challenge", "reading", "milestone"] as const)
        .map((key) => ({ key, xp: categoryMyXp(myRank, key) }))

    /** Merge `?category=` into the existing query, same idiom as the desktop rail. */
    const onCategorySelect = useCallback(
        (key: LeaderboardCategoryKey) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set("category", key)
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        },
        [router, pathname, searchParams],
    )

    /** Open the shared payment modal in the course-enroll flow. */
    const onEnroll = useCallback(
        () => open({ flow: PaymentFlow.CourseEnroll }),
        [open],
    )

    // Home › Courses › <course> › Leaderboard — same trail `LearnBreadcrumb` builds,
    // as DATA (this block builds its own `Breadcrumbs` atom rather than taking a node).
    const breadcrumbItems: Array<LeaderboardHeaderCrumb> = [
        {
            key: "home",
            label: t("nav.home"),
            onPress: () => router.push(pathConfig().locale().build()),
        },
        {
            key: "courses",
            label: t("nav.courses"),
            onPress: () => router.push(pathConfig().locale(locale).course().build()),
        },
        {
            key: "course",
            label: course?.title || t("nav.courses"),
            onPress: () => router.push(pathConfig().locale(locale).course(courseDisplayId).build()),
        },
        {
            key: "current",
            label: t("leaderboard.title"),
        },
    ]

    return (
        <_LeaderboardPage
            breadcrumbItems={breadcrumbItems}
            title={t("leaderboard.title")}
            description={t("leaderboard.subtitle")}
            isEnrollmentKnown={enrollKnown}
            isEnrolled={enrolled}
            onEnroll={onEnroll}
            categoryItems={categoryItems}
            selectedCategory={selectedCategory}
            onCategorySelect={onCategorySelect}
            categoryAriaLabel={t("leaderboard.categories.label")}
            categoryLabel={categoryLabels[selectedCategory]}
            updatedAt={data ? new Date(data.computedAt) : undefined}
            onRefresh={() => { void mutate() }}
            isRefreshing={isValidating}
            refreshLabel={t("leaderboard.refresh")}
            isBoardLoading={waiting}
            isBoardEmpty={entries.length === 0}
            boardError={error}
            onBoardRetry={() => { void mutate() }}
            standing={standing}
            podiumEntries={podiumEntries}
            rows={rows.slice(3)}
            selfRow={selfRow}
            hiddenBetweenCount={hiddenBetweenCount}
            celebrateKey={celebrateKey}
            meLabel={t("leaderboard.you")}
        />
    )
}

export default LeaderboardPage
