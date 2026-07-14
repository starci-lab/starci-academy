"use client"

import { ClockIcon } from "@phosphor-icons/react"
import { Calendar, Chip, Typography } from "@heroui/react"
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date"
import type { DateValue } from "@heroui/react/rac"
import { useFormatter, useTranslations } from "next-intl"
import React, { useMemo } from "react"
import dayjs from "dayjs"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useLivestreamCalendarOverlayState } from "@/hooks/zustand/overlay/hooks"
import type { LivestreamSessionEntity } from "@/modules/types/entities/livestream-session"
import { DayOfWeek } from "@/modules/types/enums/day-of-week"
import { useAppSelector } from "@/redux/hooks"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { EmptyContent } from "@/components/blocks/async/EmptyContent"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { ModalShell } from "@/components/blocks/layout/ModalShell"

/** JS `Date#getDay()` (0 = Sunday … 6 = Saturday). */
export const dayOfWeekToNumber: Record<DayOfWeek, number> = {
    [DayOfWeek.Sunday]: 0,
    [DayOfWeek.Monday]: 1,
    [DayOfWeek.Tuesday]: 2,
    [DayOfWeek.Wednesday]: 3,
    [DayOfWeek.Thursday]: 4,
    [DayOfWeek.Friday]: 5,
    [DayOfWeek.Saturday]: 6,
}

/**
 * Next calendar date (from today) that falls on the given weekday (wall-clock day).
 */
export const nextOccurrenceForDayOfWeek = (day: DayOfWeek): dayjs.Dayjs => {
    const targetDow = dayOfWeekToNumber[day]
    const now = dayjs()
    const add = (targetDow - now.day() + 7) % 7
    if (add === 0) {
        return now.startOf("day")
    }
    return now.add(add, "day").startOf("day")
}

export const toCalendarDate = (d: dayjs.Dayjs): CalendarDate => {
    return new CalendarDate(d.year(), d.month() + 1, d.date())
}

/**
 * Recurring weekly slots: weekdays that have a livestream (for calendar styling).
 */
const useSessionWeekdaySet = (sessions: Array<LivestreamSessionEntity> | undefined) => {
    return useMemo(() => {
        const set = new Set<number>()
        if (!sessions?.length) {
            return set
        }
        for (const s of sessions) {
            if (s.isOverridable) {
                continue
            }
            const day = s.dayOfWeek as DayOfWeek
            if (day in dayOfWeekToNumber) {
                set.add(dayOfWeekToNumber[day])
            }
        }
        return set
    }, [sessions])
}

const formatTime = (hhmmss: string) => hhmmss.slice(0, 5)

export const LivestreamCalendarModal = ({ className }: WithClassNames<undefined>) => {
    const t = useTranslations()
    const format = useFormatter()
    const { isOpen, setOpen } = useLivestreamCalendarOverlayState()
    const sessions = useAppSelector((state) => state.livestreamSession.entities)
    const sessionDow = useSessionWeekdaySet(sessions)
    const visibleSessions = useMemo(() => {
        if (!sessions?.length) {
            return []
        }
        return [...sessions]
            .filter((session) => !session.isOverridable)
            .sort((prev, next) => prev.sortIndex - next.sortIndex)
    }, [sessions])

    const defaultFocusedValue = useMemo(() => {
        if (visibleSessions.length === 0) {
            return undefined
        }
        const first = visibleSessions[0]
        const day = nextOccurrenceForDayOfWeek(first.dayOfWeek as DayOfWeek)
        return toCalendarDate(day)
    }, [visibleSessions])

    const isDateUnavailable = (date: DateValue) => {
        if (sessionDow.size === 0) {
            return false
        }
        if (!(date instanceof CalendarDate)) {
            return false
        }
        const js = new Date(date.year, date.month - 1, date.day)
        return !sessionDow.has(js.getDay())
    }

    return (
        <ModalShell
            isOpen={isOpen}
            onOpenChange={setOpen}
            className={className}
            containerClassName="max-w-lg"
            size="lg"
            title={t("livestream.calendar.modalTitle")}
            bodyClassName="gap-0"
        >
            {
                visibleSessions.length === 0 ? (
                    <EmptyContent title={t("livestream.calendar.empty")} />
                ) : (
                    <div className="flex w-full flex-col gap-3">
                        <div className="flex w-full flex-col items-center">
                            <Calendar
                                aria-label={t("livestream.calendar.aria")}
                                className="overflow-hidden shadow-none"
                                defaultFocusedValue={defaultFocusedValue}
                                defaultValue={today(getLocalTimeZone())}
                                firstDayOfWeek="mon"
                                isDateUnavailable={isDateUnavailable}
                            />
                        </div>
                        <SurfaceListCard bordered>
                            {
                                visibleSessions
                                    .sort((prev, next) => {
                                        return dayOfWeekToNumber[next.dayOfWeek as DayOfWeek] - dayOfWeekToNumber[prev.dayOfWeek as DayOfWeek]
                                    })
                                    .map((session) => {
                                        const dow = session.dayOfWeek as DayOfWeek
                                        const next = nextOccurrenceForDayOfWeek(dow)
                                        const dayLabel = t(`livestream.calendar.days.${dow}`)
                                        return (
                                            <SurfaceListCardItem key={session.id}>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Chip size="sm" variant="soft">
                                                            <Chip.Label>{dayLabel}</Chip.Label>
                                                        </Chip>
                                                        <ClockIcon aria-hidden focusable="false" className="size-3 text-muted" />
                                                        <Typography type="body-sm" color="muted">
                                                            {t("livestream.calendar.sessionTime", {
                                                                start: formatTime(session.startTime),
                                                                end: formatTime(session.expectedEndTime),
                                                            })}
                                                        </Typography>
                                                    </div>
                                                    <Typography type="body-sm">
                                                        {t("livestream.calendar.nextOn", {
                                                            date: format.dateTime(next.toDate(), {
                                                                dateStyle: "long",
                                                            }),
                                                        })}
                                                    </Typography>
                                                    {session.note?.trim() ? (
                                                        <MarkdownContent markdown={session.note} className="text-sm text-muted" />
                                                    ) : null}
                                                </div>
                                            </SurfaceListCardItem>
                                        )
                                    })
                            }
                        </SurfaceListCard>
                    </div>
                )}
        </ModalShell>
    )
}
