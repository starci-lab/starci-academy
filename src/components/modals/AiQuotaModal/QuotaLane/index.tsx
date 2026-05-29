"use client"

import React from "react"
import {
    Chip,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    QuotaBar,
} from "../QuotaBar"

/** Per-window pair of counts handed to a {@link QuotaLane}. */
export interface QuotaLaneWindow {
    /** Consumed amount in the window. */
    used: number
    /** Cap for the window. */
    limit: number
}

/** Props for {@link QuotaLane}. */
export interface QuotaLaneProps {
    /** Lane heading (e.g. "Free (Auto)"). */
    title: string
    /** Unit shown next to counts ("uses" / "credits"). */
    unit: string
    /** 5-hour window counts. */
    window5h: QuotaLaneWindow
    /** Weekly window counts. */
    windowWeek: QuotaLaneWindow
    /** Tailwind fill colour for both bars. */
    fillClassName: string
    /** True to render the "active" chip on this lane. */
    isActive?: boolean
    /** Optional note shown under the title (e.g. "No active subscription"). */
    note?: string
}

/**
 * One AI lane block — title (+ active chip), an optional note, and the two
 * usage bars (5h + weekly).
 *
 * Presentational (render-only): all values arrive via props.
 * @param props - lane title, unit, both windows, colour, active flag, note
 */
export const QuotaLane = ({
    title,
    unit,
    window5h,
    windowWeek,
    fillClassName,
    isActive = false,
    note,
}: QuotaLaneProps) => {
    const t = useTranslations()
    return (
        <div className="flex flex-col gap-3 rounded-large bg-default/40 p-4">
            <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-foreground">{title}</span>
                {isActive ? (
                    <Chip
                        size="sm"
                        color="accent"
                        variant="primary"
                    >
                        {t("aiQuota.currentLane")}
                    </Chip>
                ) : null}
            </div>
            {note ? (
                <div className="text-xs text-muted">{note}</div>
            ) : null}
            <QuotaBar
                label={t("aiQuota.window5h")}
                used={window5h.used}
                limit={window5h.limit}
                unit={unit}
                fillClassName={fillClassName}
            />
            <QuotaBar
                label={t("aiQuota.windowWeek")}
                used={windowWeek.used}
                limit={windowWeek.limit}
                unit={unit}
                fillClassName={fillClassName}
            />
        </div>
    )
}
