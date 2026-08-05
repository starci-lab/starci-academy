"use client"

import React from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    pathConfig,
} from "@/resources/path"
import { useQueryMyWeeklyStatsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyWeeklyStatsSwr"
import { _StreakStrip, type StreakStripDay } from "./component"

/**
 * "Learning streak" — the CONNECTED half: self-fetches the weekly-stats leaf query, resolves each
 * of the last 7 days into a locale-formatted dot label (native tooltip date + narrow weekday), and
 * hands the result to the presentational {@link _StreakStrip}. See `tiers/split.md`.
 */
export const StreakStrip = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const {
        data: weekly,
        error,
        mutate,
    } = useQueryMyWeeklyStatsSwr()

    const streak = weekly?.streak ?? 0
    const longest = weekly?.longestStreak ?? 0

    // locale-dependent formatting is i18n — it stays here, next to the fetch (tiers/split.md),
    // so `_StreakStrip` only ever renders already-resolved strings.
    const days: Array<StreakStripDay> = (weekly?.days ?? []).map((day) => {
        const date = new Date(`${day.date}T00:00:00Z`)
        return {
            date: day.date,
            active: day.active,
            title: date.toLocaleDateString(locale),
            weekday: date.toLocaleDateString(locale, { weekday: "narrow" }),
        }
    })

    /** Navigate to the courses list so the viewer can start some content. */
    const onLearn = () => {
        router.push(pathConfig().locale(locale).course().build())
    }

    return (
        <_StreakStrip
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={!weekly && !error}
            error={error}
            onRetry={() => { void mutate() }}
            streak={streak}
            days={days}
            onLearn={onLearn}
            labels={{
                errorTitle: t("dashboard.streak.error"),
                retry: t("dashboard.streak.retry"),
                streakLabel: t("dashboard.streakLabel"),
                streakHelp: t("dashboard.streak.help"),
                current: t("dashboard.streak.current", { count: streak }),
                longest: t("dashboard.streak.longest", { count: longest }),
                empty: t("dashboard.streak.empty"),
                dailyGoalCta: t("dashboard.dailyGoal.cta"),
                dailyGoalNudge: t("dashboard.dailyGoal.nudge"),
            }}
        />
    )
}
