"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import numeral from "numeral"
import {
    BookOpenIcon,
    ClockIcon,
    PuzzlePieceIcon,
    StackIcon,
    UsersIcon,
} from "@phosphor-icons/react"
import {
    useCourseTotals,
} from "@/hooks/useCourseTotals"
import { HighlightChip } from "@/components/composites/chips/HighlightChip"
import { useAppSelector } from "@/redux/hooks"
import { Cluster } from "@/components/frames/Cluster"

/**
 * Marketing trust-stats strip: learners enrolled (social proof) + module / lesson
 * / reading-hours / challenge counts, all derived client-side from the loaded
 * course. Self-contained (reads redux + {@link useCourseTotals}); challenge stat
 * hides when the course has none.
 */
export const CourseTrustStats = () => {
    const t = useTranslations()
    const totals = useCourseTotals()
    const enrollmentCount = useAppSelector((state) => state.course.entity?.enrollmentCount) ?? 0
    const hours = Math.max(1, Math.round(totals.totalMinutes / 60))

    return (
        <Cluster
            identity={{ tier: "page", component: "CourseTrustStats" }}
            gap={2}
            principle="chip-row"
            explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
            items={[
                ...(enrollmentCount > 0 ? [() => (
                    <HighlightChip
                        icon={UsersIcon}
                        value={numeral(enrollmentCount).format("0,0")}
                        label={t("courseLanding.stats.learners")}
                    />
                )] : []),
                () => (
                    <HighlightChip
                        icon={StackIcon}
                        value={totals.moduleCount}
                        label={t("courseLanding.stats.modules")}
                    />
                ),
                () => (
                    <HighlightChip
                        icon={BookOpenIcon}
                        value={totals.lessonCount}
                        label={t("courseLanding.stats.lessons")}
                    />
                ),
                () => (
                    <HighlightChip
                        icon={ClockIcon}
                        value={hours}
                        label={t("courseLanding.stats.hours")}
                    />
                ),
                ...(totals.challengeCount > 0 ? [() => (
                    <HighlightChip
                        icon={PuzzlePieceIcon}
                        value={totals.challengeCount}
                        label={t("courseLanding.stats.challenges")}
                    />
                )] : []),
            ]}
        />
    )
}
