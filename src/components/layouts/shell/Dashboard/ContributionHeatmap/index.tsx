"use client"

import React, {
    useMemo,
    useState,
} from "react"
import {
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useQueryMyContributionCalendarSwr,
} from "@/hooks"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link ContributionHeatmap}. */
export type ContributionHeatmapProps = WithClassNames<undefined>

/** One rendered cell of the calendar grid. */
interface HeatmapCell {
    /** Calendar day, `YYYY-MM-DD`. */
    dateStr: string
    /** Whether the day falls inside the selected year (off-year pad cells are blank). */
    inYear: boolean
    /** Total contributions that day (0 when none). */
    total: number
}

/** Tailwind fill per intensity level (0 = none → 4 = most), brand `primary` ramp. */
const LEVEL_CLASS = [
    "bg-default-200",
    "bg-primary/30",
    "bg-primary/55",
    "bg-primary/80",
    "bg-primary",
]

/** How many recent years the selector offers (current + 2 back). */
const YEAR_SPAN = 3

/**
 * Maps a day's total to an intensity level (0–4) for the cell colour.
 * @param total - the day's contribution count.
 * @returns the intensity bucket index.
 */
const levelOf = (total: number): number => {
    // no activity → the empty track colour
    if (total <= 0) {
        return 0
    }
    // fixed buckets keep the scale stable across users (not relative to a max)
    if (total <= 2) {
        return 1
    }
    if (total <= 5) {
        return 2
    }
    if (total <= 9) {
        return 3
    }
    return 4
}

/**
 * GitHub-style learning-activity heatmap ("Hoạt động học") for one year — a
 * 7-row × ~53-column grid coloured by daily contributions (contents read /
 * challenges passed / milestones), with a year switcher + legend. Self-fetches
 * its own leaf query per year (layout container — no data props).
 * @param props - optional className for the root element.
 */
export const ContributionHeatmap = ({
    className,
}: ContributionHeatmapProps) => {
    const t = useTranslations()
    const locale = useLocale()

    /** The year currently shown (defaults to the current calendar year). */
    const [year, setYear] = useState(() => new Date().getFullYear())

    // active days for the selected year (self-fetched, re-keyed on year)
    const { data } = useQueryMyContributionCalendarSwr(year)

    /** Recent years offered by the selector (current → current − (YEAR_SPAN−1)). */
    const years = useMemo(
        () => {
            const current = new Date().getFullYear()
            return Array.from({
                length: YEAR_SPAN,
            }).map((_, index) => current - index)
        },
        [],
    )

    /** Active-day lookup by date string. */
    const byDate = useMemo(
        () => {
            const map = new Map<string, number>()
            for (const day of data ?? []) {
                map.set(day.date,
                    day.total)
            }
            return map
        },
        [
            data,
        ],
    )

    /** Total contributions across the year (header count). */
    const totalCount = useMemo(
        () => (data ?? []).reduce((sum, day) => sum + day.total,
            0),
        [
            data,
        ],
    )

    /** The year laid out as week columns (each a 7-day Sun→Sat array). */
    const weeks = useMemo<Array<Array<HeatmapCell>>>(
        () => {
            // align the grid start to the Sunday on/before Jan 1 (UTC, no TZ drift)
            const firstDay = new Date(Date.UTC(year,
                0,
                1))
            const cursor = new Date(firstDay)
            cursor.setUTCDate(firstDay.getUTCDate() - firstDay.getUTCDay())
            const lastDay = new Date(Date.UTC(year,
                11,
                31))
            const columns: Array<Array<HeatmapCell>> = []
            // walk week by week until the year is fully covered
            while (cursor <= lastDay) {
                const column: Array<HeatmapCell> = []
                for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
                    const dateStr = cursor.toISOString().slice(0,
                        10)
                    column.push({
                        dateStr,
                        inYear: cursor.getUTCFullYear() === year,
                        total: byDate.get(dateStr) ?? 0,
                    })
                    cursor.setUTCDate(cursor.getUTCDate() + 1)
                }
                columns.push(column)
            }
            return columns
        },
        [
            year,
            byDate,
        ],
    )

    /** Short month label per week column (only at the week a new month starts). */
    const monthLabels = useMemo(
        () => weeks.map((column, index) => {
            // anchor on the first in-year day of the column
            const firstInYear = column.find((cell) => cell.inYear)
            if (!firstInYear) {
                return ""
            }
            const month = new Date(`${firstInYear.dateStr}T00:00:00Z`).getUTCMonth()
            // previous column's month, to detect a change
            const previous = weeks[index - 1]?.find((cell) => cell.inYear)
            const previousMonth = previous
                ? new Date(`${previous.dateStr}T00:00:00Z`).getUTCMonth()
                : -1
            if (month === previousMonth) {
                return ""
            }
            return new Date(Date.UTC(year,
                month,
                1)).toLocaleDateString(locale,
                {
                    month: "short",
                })
        }),
        [
            weeks,
            year,
            locale,
        ],
    )

    /** Weekday labels shown on the left (Mon / Wed / Fri rows). */
    const weekdayLabels = useMemo(
        () => [1,
            3,
            5].map((dayIndex) => ({
            dayIndex,
            // 2025-06-01 is a Sunday → +dayIndex lands on the wanted weekday
            label: new Date(Date.UTC(2025,
                5,
                1 + dayIndex)).toLocaleDateString(locale,
                {
                    weekday: "short",
                }),
        })),
        [
            locale,
        ],
    )

    return (
        <div className={cn("flex flex-col gap-3 p-3",
            className)}
        >
            {/* header: year-scoped count + the year switcher */}
            <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-muted">
                    {t("dashboard.contributions.title",
                        {
                            count: totalCount,
                            year,
                        })}
                </div>
                <div className="flex items-center gap-1.5">
                    {years.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => setYear(option)}
                            className={cn(
                                "rounded-medium px-1.5 py-0.5 text-xs",
                                option === year
                                    ? "bg-primary/15 text-primary"
                                    : "text-muted hover:text-foreground",
                            )}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* scrollable grid (≈53 columns can exceed the column width) */}
            <div className="overflow-x-auto">
                <div className="flex flex-col gap-1.5">
                    {/* month labels aligned to the week columns */}
                    <div className="flex gap-[3px] pl-8">
                        {monthLabels.map((label, index) => (
                            <div
                                key={index}
                                className="w-3 shrink-0 whitespace-nowrap text-[10px] text-muted"
                            >
                                {label}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-[3px]">
                        {/* weekday labels (Mon/Wed/Fri) */}
                        <div className="flex w-8 shrink-0 flex-col gap-[3px] pr-1">
                            {Array.from({
                                length: 7,
                            }).map((_, dayIndex) => {
                                const weekday = weekdayLabels.find(
                                    (entry) => entry.dayIndex === dayIndex,
                                )
                                return (
                                    <div
                                        key={dayIndex}
                                        className="h-3 text-right text-[10px] leading-3 text-muted"
                                    >
                                        {weekday?.label ?? ""}
                                    </div>
                                )
                            })}
                        </div>

                        {/* one column per week */}
                        {weeks.map((column, columnIndex) => (
                            <div
                                key={columnIndex}
                                className="flex shrink-0 flex-col gap-[3px]"
                            >
                                {column.map((cell) => (
                                    <div
                                        key={cell.dateStr}
                                        title={t("dashboard.contributions.cellTitle",
                                            {
                                                count: cell.total,
                                                date: new Date(`${cell.dateStr}T00:00:00Z`)
                                                    .toLocaleDateString(locale),
                                            })}
                                        className={cn(
                                            "size-3 rounded-sm",
                                            cell.inYear ? LEVEL_CLASS[levelOf(cell.total)] : "bg-transparent",
                                        )}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* legend: Less → More */}
            <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted">
                <span>{t("dashboard.contributions.less")}</span>
                {LEVEL_CLASS.map((levelClass, index) => (
                    <span
                        key={index}
                        className={cn("size-3 rounded-sm",
                            levelClass)}
                    />
                ))}
                <span>{t("dashboard.contributions.more")}</span>
            </div>
        </div>
    )
}
