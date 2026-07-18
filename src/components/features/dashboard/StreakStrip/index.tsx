"use client"

import React from "react"
import {
    Button,
    Chip,
    Typography,
    cn,
} from "@heroui/react"
import {
    FlameIcon,
} from "@phosphor-icons/react"
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
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useQueryMyWeeklyStatsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyWeeklyStatsSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { InfoTooltip } from "@/components/blocks/feedback/InfoTooltip"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

/** Props for {@link StreakStrip}. */
export type StreakStripProps = WithClassNames<undefined>

/**
 * "Đà học" content — the last-7-days streak strip + current/longest streak, and a
 * daily-goal nudge when today is still idle. Content only (the parent
 * {@link import("@/components/blocks").LabeledCard} frames it). Self-fetches the
 * weekly-stats leaf query through {@link AsyncContent}.
 * @param props - optional root class name (placement only)
 */
export const StreakStrip = ({
    className,
}: StreakStripProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const {
        data: weekly,
        isLoading,
        error,
        mutate,
    } = useQueryMyWeeklyStatsSwr()

    const streak = weekly?.streak ?? 0
    const longest = weekly?.longestStreak ?? 0
    const days = weekly?.days ?? []
    const hasAny = streak > 0 || days.some((day) => day.active)
    const activeToday = days.at(-1)?.active === true

    /** Navigate to the courses list so the viewer can start some content. */
    const onLearn = () => {
        router.push(pathConfig().locale(locale).course().build())
    }

    return (
        <AsyncContent
            isLoading={weekly === null || weekly === undefined || isLoading}
            error={error}
            errorContent={{
                title: t("dashboard.streak.error"),
                onRetry: () => { void mutate() },
                retryLabel: t("dashboard.streak.retry"),
            }}
            skeleton={(
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* 7 day dots, each with a weekday label under it */}
                    <div className="flex items-center gap-2">
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <Skeleton className="size-6 rounded-full" />
                                <Skeleton className="h-2 w-4 rounded" />
                            </div>
                        ))}
                    </div>
                    {/* right cluster: flame + streak text + longest-streak chip */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-4 shrink-0 rounded-full" />
                        <Skeleton.Typography type="body-sm" width="1/4" />
                        <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
                    </div>
                </div>
            )}
        >
            <div className={cn("flex flex-col gap-3", className)}>
                {/* last 7 days + current/longest */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        {days.map((day) => {
                            const date = new Date(`${day.date}T00:00:00Z`)
                            return (
                                <div key={day.date} className="flex flex-col items-center gap-2">
                                    <div
                                        title={date.toLocaleDateString(locale)}
                                        className={cn(
                                            "size-6 rounded-full",
                                            day.active ? "bg-accent/80" : "bg-muted/20",
                                        )}
                                    />
                                    <Typography type="body-xs" color="muted">
                                        {date.toLocaleDateString(locale, { weekday: "narrow" })}
                                    </Typography>
                                </div>
                            )
                        })}
                    </div>
                    {hasAny ? (
                        <div className="flex items-center gap-2">
                            <FlameIcon aria-hidden focusable="false" className="size-5 shrink-0 text-accent-soft-foreground" />
                            <InfoTooltip
                                className="text-sm font-medium"
                                title={t("dashboard.streakLabel")}
                                description={t("dashboard.streak.help")}
                            >
                                {t("dashboard.streak.current", { count: streak })}
                            </InfoTooltip>
                            <Chip color="accent" variant="soft" size="sm">
                                <Chip.Label>{t("dashboard.streak.longest", { count: longest })}</Chip.Label>
                            </Chip>
                        </div>
                    ) : (
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <Typography type="body-sm" color="muted">
                                {t("dashboard.streak.empty")}
                            </Typography>
                            <Button variant="primary" size="sm" onPress={onLearn}>
                                {t("dashboard.dailyGoal.cta")}
                            </Button>
                        </div>
                    )}
                </div>

                {/* daily-goal nudge — only when today is still idle (actionable) */}
                {hasAny && !activeToday ? (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Typography type="body-sm" weight="medium">
                            {t("dashboard.dailyGoal.nudge")}
                        </Typography>
                        <Button variant="primary" size="sm" onPress={onLearn}>
                            {t("dashboard.dailyGoal.cta")}
                        </Button>
                    </div>
                ) : null}
            </div>
        </AsyncContent>
    )
}
