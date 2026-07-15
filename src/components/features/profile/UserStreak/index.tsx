"use client"
import { FireIcon } from "@phosphor-icons/react"

import {
    cn,
    Card,
    CardContent,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
    Label,
    Typography,
} from "@heroui/react"

import { useTranslations } from "next-intl"

import { dayjs } from "@/modules/dayjs"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useQueryMyWeeklyStatsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyWeeklyStatsSwr"

/** Weekday-initial placeholder while the 7-day stats are loading (no real dates yet). */
const FALLBACK_DAYS: Array<string> = ["M", "T", "W", "T", "F", "S", "S"]

/** Props for {@link UserStreak}. */
export type UserStreakProps = WithClassNames<undefined>

/**
 * UserStreak — navbar streak widget. Reads the viewer's real rolling 7-day
 * stats (current/longest streak + per-day active flags) from
 * {@link useQueryMyWeeklyStatsSwr}; falls back to zeros / inactive days while
 * loading or when unauthenticated. `"use client"` for the dropdown interactivity.
 */
export const UserStreak = ({ className }: UserStreakProps) => {
    const t = useTranslations("common")
    const { data } = useQueryMyWeeklyStatsSwr()

    const current = data?.streak ?? 0
    const longest = data?.longestStreak ?? 0
    const streakStats: Array<{ key: string; labelKey: string; value: number }> = [
        { key: "current", labelKey: "streak.current", value: current },
        { key: "longest", labelKey: "streak.longest", value: longest },
    ]

    // days come oldest → today (7 entries); today is the last one.
    const weekDays = data?.days?.length === 7
        ? data.days.map((day, index) => ({
            label: dayjs(day.date).format("dd").charAt(0).toUpperCase(),
            active: day.active,
            isToday: index === 6,
        }))
        : FALLBACK_DAYS.map((label) => ({ label, active: false, isToday: false }))

    return (
        <Dropdown>
            <DropdownTrigger>
                <div className={cn("group relative flex size-10 cursor-pointer items-center justify-center rounded-full border-4 border-dashed border-accent/50 bg-accent/5 transition-all hover:scale-110 active:scale-95", className)}>
                    <FireIcon aria-hidden weight="fill" className="size-6 text-accent-soft-foreground" />
                </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="User streak information" className="min-w-64">
                <DropdownSection>
                    <DropdownItem key="streaks" className="cursor-default opacity-100 data-[hover=true]:bg-transparent">
                        <div className="grid grid-cols-2 gap-3">
                            {streakStats.map((stat) => (
                                <Card key={stat.key}>
                                    <CardContent className="flex flex-col items-center gap-2 text-center">
                                        <Label>{t(stat.labelKey)}</Label>
                                        <div className="flex items-center justify-center gap-2">
                                            <FireIcon aria-hidden weight="fill" className="size-5 text-accent-soft-foreground" />
                                            <Typography type="h5" weight="bold">{stat.value}</Typography>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </DropdownItem>
                </DropdownSection>

                <DropdownSection className="mt-2 border-t pt-2">
                    <DropdownItem key="weekly" className="cursor-default opacity-100 data-[hover=true]:bg-transparent">
                        <div className="flex justify-between px-1">
                            {weekDays.map((day, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <div
                                        className={cn(
                                            "flex size-7 items-center justify-center rounded-full border-2",
                                            day.active ? "border-accent bg-accent/15" : "border-separator",
                                            day.isToday ? "ring-2 ring-accent/40" : null,
                                        )}
                                    >
                                        <Typography type="body-xs" weight="bold" className={day.active ? "text-accent-soft-foreground" : "text-muted"}>
                                            {day.label}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}
