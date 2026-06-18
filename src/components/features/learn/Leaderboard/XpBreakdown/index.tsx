"use client"

import React from "react"
import { Separator, Typography, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types"

/** XP awarded per lesson read (mirrors backend leaderboard scoring). */
const READING_XP = 3
/** XP awarded per passed milestone task (mirrors backend leaderboard scoring). */
const MILESTONE_XP = 10

/** Props for {@link XpBreakdown}. */
export interface XpBreakdownProps extends WithClassNames<undefined> {
    /** Challenge XP (already an XP value, 1:1). */
    totalScore: number
    /** Lessons read in the course (each worth {@link READING_XP} XP). */
    lessonsRead: number
    /** Milestone tasks passed (each worth {@link MILESTONE_XP} XP). */
    milestoneProgress: number
    /** Total XP — the rank metric; shown as the summed footer. */
    totalXp: number
}

/**
 * Compact "where the XP came from" panel: challenge / reading / milestone
 * contributions and their total. Presentational — reused inside the viewer's
 * rank card and as the XP tooltip on each leaderboard row.
 * @param props - {@link XpBreakdownProps}
 */
export const XpBreakdown = ({
    totalScore,
    lessonsRead,
    milestoneProgress,
    totalXp,
    className,
}: XpBreakdownProps) => {
    const t = useTranslations()
    // each source already converted to its XP contribution for display
    const rows = [
        { key: "challenge", label: t("leaderboard.breakdown.challenge"), value: totalScore },
        { key: "reading", label: t("leaderboard.breakdown.reading"), value: lessonsRead * READING_XP },
        { key: "milestone", label: t("leaderboard.breakdown.milestone"), value: milestoneProgress * MILESTONE_XP },
    ]
    return (
        <div className={cn("flex min-w-44 flex-col gap-2", className)}>
            {rows.map((row) => (
                <div
                    key={row.key}
                    className="flex items-center justify-between gap-6"
                >
                    <Typography type="body-sm" color="muted">{row.label}</Typography>
                    <Typography type="body-sm" weight="medium">
                        {t("leaderboard.xp", { xp: row.value })}
                    </Typography>
                </div>
            ))}
            {/* summed footer, divided from the contributions above */}
            <Separator />
            <div className="flex items-center justify-between gap-6">
                <Typography type="body-sm" weight="semibold">
                    {t("leaderboard.breakdown.total")}
                </Typography>
                <Typography type="body-sm" weight="bold" className="text-accent">
                    {t("leaderboard.xp", { xp: totalXp })}
                </Typography>
            </div>
        </div>
    )
}
