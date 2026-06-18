"use client"

import React from "react"
import {
    cn,
    Button,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    Flame as FlameIcon,
} from "@gravity-ui/icons"
import {
    useQueryMyWeeklyStatsSwr,
} from "@/hooks"
import {
    pathConfig,
} from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link DailyGoal}. */
export type DailyGoalProps = WithClassNames<undefined>

/**
 * Compact "today's goal" strip for the dashboard centre column that turns the
 * passive streak counter into an active prompt. When today is not yet an active
 * day it nudges the viewer to learn one lesson (with a CTA to the courses list);
 * when today is already active it confirms the streak is safe.
 * Self-fetches its own leaf query and renders nothing while still loading.
 * @param props - optional className for the root element.
 */
export const DailyGoal = ({
    className,
}: DailyGoalProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data } = useQueryMyWeeklyStatsSwr()

    // avoid a flash while the weekly stats are still loading
    if (!data) {
        return null
    }

    const days = data.days ?? []
    // today is the last (newest) day in the oldest→today ordered list
    const activeToday = days.at(-1)?.active === true

    /** Navigate to the courses list so the viewer can start a lesson. */
    const onLearn = () => {
        router.push(pathConfig().locale(locale).course().build())
    }

    return (
        <div className={cn("flex flex-wrap items-center justify-between gap-3 p-3",
            className)}
        >
            <div className="flex items-center gap-1.5">
                <FlameIcon className="h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm font-medium text-foreground">
                    {activeToday
                        ? t("dashboard.dailyGoal.done",
                            {
                                count: data.streak,
                            })
                        : t("dashboard.dailyGoal.nudge")}
                </span>
            </div>

            {activeToday ? null : (
                <Button
                    variant="primary"
                    size="sm"
                    onPress={onLearn}
                >
                    {t("dashboard.dailyGoal.cta")}
                </Button>
            )}
        </div>
    )
}
