"use client"

import React from "react"
import { useLocale, useTranslations } from "next-intl"
import { useQueryPlatformStatsSwr } from "@/hooks/swr/api/graphql/queries/useQueryPlatformStatsSwr"
import { _StatStrip } from "./component"
import type { StatStripStats } from "./component"

/** Fallback figures when the public stats query fails — show 99 for every counter
 * (teacher's choice) so the proof strip still renders instead of vanishing. */
const FALLBACK_STATS: StatStripStats = {
    totalLearners: 99,
    totalLessons: 99,
    totalCourses: 99,
    totalBadgesEarned: 99,
} as const

/** All-zero placeholder handed to `_StatStrip` while `isSkeleton` — never actually
 * shown (every cell renders a shimmer instead of its number), it only satisfies
 * the required `stats` shape while there is nothing real to hand down yet. */
const SKELETON_STATS: StatStripStats = {
    totalLearners: 0,
    totalLessons: 0,
    totalCourses: 0,
    totalBadgesEarned: 0,
} as const

/** Props for {@link StatStrip}. */
export type StatStripProps = Record<string, never>
/**
 * Live platform proof strip — the CONNECTED half of `StatStrip` (`tiers/split.md`):
 * fetches the public `platformStats` query, computes `isSkeleton` from the
 * first-load formula, resolves the fallback-on-error figures and every label, and
 * hands them to the presentational {@link _StatStrip}.
 *
 * @param props - {@link StatStripProps}
 */
export const StatStrip = () => {
    const t = useTranslations()
    const locale = useLocale()
    const { data, isLoading, error } = useQueryPlatformStatsSwr()

    // first load, nothing in hand → shimmer (loading-and-skeleton.md §2)
    const isSkeleton = isLoading && !data && !error
    // settled: real data, or 99-for-every-figure on error so the strip still renders
    const stats = isSkeleton ? SKELETON_STATS : (error ? FALLBACK_STATS : data ?? FALLBACK_STATS)

    return (
        <_StatStrip
            isSkeleton={isSkeleton}
            stats={stats}
            locale={locale}
            labels={{
                learners: t("landing.stats.learners"),
                lessons: t("landing.stats.lessons"),
                courses: t("landing.stats.courses"),
                badges: t("landing.stats.badges"),
            }}
        />
    )
}
