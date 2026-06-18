"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import numeral from "numeral"
import {
    StatPair,
} from "@/components/blocks"
import {
    useAppSelector,
} from "@/redux"
import {
    useCourseTotals,
} from "../hooks/useCourseTotals"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link CourseTrustStats}. */
export type CourseTrustStatsProps = WithClassNames<undefined>

/**
 * Marketing trust-stats strip: learners enrolled (social proof) + module / lesson
 * / reading-hours / challenge counts, all derived client-side from the loaded
 * course. Self-contained (reads redux + {@link useCourseTotals}); challenge stat
 * hides when the course has none.
 *
 * @param props - optional className (placement only).
 */
export const CourseTrustStats = ({ className }: CourseTrustStatsProps) => {
    const t = useTranslations()
    const totals = useCourseTotals()
    const enrollmentCount = useAppSelector((state) => state.course.entity?.enrollmentCount) ?? 0
    const hours = Math.max(1, Math.round(totals.totalMinutes / 60))

    return (
        <div className={cn("flex flex-wrap gap-x-8 gap-y-4", className)}>
            <StatPair
                value={numeral(enrollmentCount).format("0,0")}
                label={t("courseLanding.stats.learners")}
            />
            <StatPair
                value={totals.moduleCount}
                label={t("courseLanding.stats.modules")}
            />
            <StatPair
                value={totals.lessonCount}
                label={t("courseLanding.stats.lessons")}
            />
            <StatPair
                value={hours}
                label={t("courseLanding.stats.hours")}
            />
            {totals.challengeCount > 0 ? (
                <StatPair
                    value={totals.challengeCount}
                    label={t("courseLanding.stats.challenges")}
                />
            ) : null}
        </div>
    )
}
