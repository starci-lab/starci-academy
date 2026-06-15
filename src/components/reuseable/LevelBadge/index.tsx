"use client"

import React, {
    useMemo,
} from "react"
import {
    cn,
    ProgressBar,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    getLevel,
} from "@/modules/utils"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link LevelBadge}. */
export interface LevelBadgeProps extends WithClassNames<undefined> {
    /** The user's unified points balance the level is derived from. */
    points: number
}

/**
 * Account-level indicator: the level number in a chip + a progress bar toward the
 * next level, derived purely from `points` via {@link getLevel}. Reusable on the
 * profile and dashboard.
 * @param props - the points balance + optional className.
 */
export const LevelBadge = ({
    points,
    className,
}: LevelBadgeProps) => {
    const t = useTranslations()
    const {
        level,
        into,
        needed,
        progress,
    } = useMemo(
        () => getLevel(points),
        [
            points,
        ],
    )

    return (
        <div className={cn("flex items-center gap-3", className)}>
            {/* level chip */}
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
                {level}
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-foreground">
                        {t("profile.level",
                            {
                                level,
                            })}
                    </span>
                    <span className="text-muted">
                        {into}/{needed}
                    </span>
                </div>
                {/* progress toward the next level */}
                <ProgressBar
                    aria-label={t("profile.level",
                        {
                            level,
                        })}
                    value={Math.round(progress * 100)}
                    maxValue={100}
                    color="accent"
                    size="sm"
                >
                    <ProgressBar.Track>
                        <ProgressBar.Fill />
                    </ProgressBar.Track>
                </ProgressBar>
            </div>
        </div>
    )
}
