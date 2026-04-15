"use client"

import {
    StarCiCalendar,
    StarCiChip,
    StarCiModal,
    StarCiModalBody,
    StarCiModalContent,
    StarCiModalHeader,
} from "@/components/atomic"
import {
    useLivestreamCalendarOverlayState,
} from "@/hooks/singleton"
import type { LivestreamSessionEntity } from "@/modules/types"
import { DayOfWeek } from "@/modules/types"
import { useAppSelector } from "@/redux"
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date"
import type { DateValue } from "@heroui/react/rac"
import { Spacer } from "@/components/reuseable"
import { ClockIcon } from "@phosphor-icons/react"
import { useFormatter, useTranslations } from "next-intl"
import React, { useMemo } from "react"
import dayjs from "dayjs"

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

export const LivestreamCalendarModal = () => {
    const t = useTranslations()
    const format = useFormatter()
    const { isOpen, onOpenChange } = useLivestreamCalendarOverlayState()
    const sessions = useAppSelector((state) => state.livestreamSession.entities)
    const sessionDow = useSessionWeekdaySet(sessions)
    const visibleSessions = useMemo(() => {
        if (!sessions?.length) {
            return []
        }
        return [...sessions]
            .filter((session) => !session.isOverridable)
            .sort((prev, next) => prev.orderIndex - next.orderIndex)
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
        <StarCiModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <StarCiModalContent size="lg" className="max-w-lg">
                <StarCiModalHeader
                    title={t("livestream.calendar.modalTitle")}
                    description={t("livestream.calendar.modalDescription")}
                />
                <StarCiModalBody>
                    {
                        visibleSessions.length === 0 ? (
                            <div className="text-foreground-500 text-center text-sm">
                                {t("livestream.calendar.empty")}
                            </div>
                        ) : (
                            <>
                                <div className="w-full flex flex-col items-center">
                                    <StarCiCalendar
                                        aria-label={t("livestream.calendar.aria")}
                                        defaultFocusedValue={defaultFocusedValue}
                                        firstDayOfWeek="mon"
                                        className="shadow-none overflow-hidden"
                                        defaultValue={today(getLocalTimeZone())}
                                        isDateUnavailable={isDateUnavailable}
                                    />
                                </div>
                                <Spacer y={3} />
                                <div className="flex flex-col gap-3">
                                    {
                                        visibleSessions
                                            .sort((prev, next) => {
                                            // sort base on day of week
                                                return dayOfWeekToNumber[next.dayOfWeek as DayOfWeek] - dayOfWeekToNumber[prev.dayOfWeek as DayOfWeek]
                                            })
                                            .map((session) => {
                                                const dow = session.dayOfWeek as DayOfWeek
                                                const next = nextOccurrenceForDayOfWeek(dow)
                                                const dayLabel = t(`livestream.calendar.days.${dow}`)
                                                return (
                                                    <div
                                                        key={session.id}
                                                        className="border-divider flex flex-col rounded-large border p-3 gap-3"
                                                    >
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <StarCiChip
                                                                color="accent"
                                                                size="sm"
                                                                variant="soft"
                                                            >
                                                                {dayLabel}
                                                            </StarCiChip>
                                                            <StarCiChip
                                                                color="accent"
                                                                size="sm"
                                                                variant="soft"
                                                            >
                                                                <ClockIcon className="size-4" />{" "}
                                                                {t("livestream.calendar.sessionTime", {
                                                                    start: formatTime(session.startTime),
                                                                    end: formatTime(session.expectedEndTime),
                                                                })}
                                                            </StarCiChip>
                                                        </div>
                                                        <div className="text-sm">
                                                            {t("livestream.calendar.nextOn", {
                                                                date: format.dateTime(next.toDate(), {
                                                                    dateStyle: "long",
                                                                }),
                                                            })}

                                                        </div>
                                                        {session.note?.trim() ? (
                                                            <div className="text-foreground-600 text-sm">
                                                                {session.note}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                )
                                            }
                                            )
                                    }
                                </div>
                            </>
                        )}
                </StarCiModalBody>
            </StarCiModalContent>
        </StarCiModal>
    )
}

