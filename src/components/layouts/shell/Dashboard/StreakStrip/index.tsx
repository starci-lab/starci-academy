"use client"

import React from "react"
import {
    Chip,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    Flame as FlameIcon,
} from "@gravity-ui/icons"
import {
    useQueryMyWeeklyStatsSwr,
} from "@/hooks"
import {
    InfoTooltip,
} from "@/components/blocks"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link StreakStrip}. */
export type StreakStripProps = WithClassNames<undefined>

/**
 * Duolingo-style streak strip under the heatmap: the last 7 calendar days as
 * active/inactive squares, plus the current + longest consecutive-day streak.
 * When the user has never been active it shows a learning invite instead of zeros.
 * Self-fetches its own leaf query (layout container — no data props).
 * @param props - optional className for the root element.
 */
export const StreakStrip = ({
    className,
}: StreakStripProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const { data } = useQueryMyWeeklyStatsSwr()

    const streak = data?.streak ?? 0
    const longest = data?.longestStreak ?? 0
    const days = data?.days ?? []

    // any activity at all (a live streak or any active day this week)
    const hasAny = streak > 0 || days.some((day) => day.active)

    return (
        <div className={cn("flex flex-wrap items-center justify-between gap-3 p-3",
            className)}
        >
            {/* last 7 days — active = green, idle = muted; weekday letter below */}
            <div className="flex items-center gap-1.5">
                {days.map((day) => {
                    const date = new Date(`${day.date}T00:00:00Z`)
                    return (
                        <div
                            key={day.date}
                            className="flex flex-col items-center gap-1.5"
                        >
                            <div
                                title={date.toLocaleDateString(locale)}
                                className={cn(
                                    "h-6 w-6 rounded-full",
                                    day.active ? "bg-accent/80" : "bg-muted/20",
                                )}
                            />
                            <span className="text-[10px] text-muted">
                                {date.toLocaleDateString(locale,
                                    {
                                        weekday: "narrow",
                                    })}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* current + longest streak, or a learning invite when never active */}
            {hasAny ? (
                <div className="flex items-center gap-1.5">
                    <FlameIcon className="h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm font-medium text-foreground">
                        <InfoTooltip
                            title={t("dashboard.streakLabel")}
                            description={t("dashboard.streak.help")}
                        >
                            {t("dashboard.streak.current",
                                {
                                    count: streak,
                                })}
                        </InfoTooltip>
                    </span>
                    <Chip className="bg-accent/15" color="accent" variant="secondary" size="sm">
                        {t("dashboard.streak.longest",
                            {
                                count: longest,
                            })}
                    </Chip>
                </div>
            ) : (
                <span className="text-sm text-muted">
                    {t("dashboard.streak.empty")}
                </span>
            )}
        </div>
    )
}
