"use client"

import React, { useMemo } from "react"
import { useFormatter, useTranslations } from "next-intl"
import dayjs from "dayjs"
import { CalendarDate, type DateValue } from "@internationalized/date"
import { useLivestreamCalendarOverlayState } from "@/hooks/zustand/overlay/hooks"
import type { LivestreamSessionEntity } from "@/modules/types/entities/livestream-session"
import { DayOfWeek } from "@/modules/types/enums/day-of-week"
import { useAppSelector } from "@/redux/hooks"
import { _LivestreamCalendarModal, type LivestreamCalendarSessionRow } from "./component"

/** JS `Date#getDay()` (0 = Sunday … 6 = Saturday). */
const DAY_OF_WEEK_TO_NUMBER: Record<DayOfWeek, number> = {
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
const nextOccurrenceForDayOfWeek = (day: DayOfWeek): dayjs.Dayjs => {
    const targetDow = DAY_OF_WEEK_TO_NUMBER[day]
    const now = dayjs()
    const add = (targetDow - now.day() + 7) % 7
    if (add === 0) {
        return now.startOf("day")
    }
    return now.add(add, "day").startOf("day")
}

/** `dayjs` day → `@internationalized/date` `CalendarDate` (the `Calendar` grid's own value type). */
const toCalendarDate = (d: dayjs.Dayjs): CalendarDate => new CalendarDate(d.year(), d.month() + 1, d.date())

/** `"09:00:00"` → `"09:00"`. */
const formatTime = (hhmmss: string) => hhmmss.slice(0, 5)

/**
 * Recurring weekly slots: weekdays (JS `getDay()` numbers) that have a livestream, for
 * calendar styling (`isDateUnavailable` dims every OTHER weekday).
 */
const useSessionWeekdaySet = (sessions: Array<LivestreamSessionEntity> | undefined) => {
    return useMemo(() => {
        const set = new Set<number>()
        if (!sessions?.length) {
            return set
        }
        for (const session of sessions) {
            if (session.isOverridable) {
                continue
            }
            const day = session.dayOfWeek as DayOfWeek
            if (day in DAY_OF_WEEK_TO_NUMBER) {
                set.add(DAY_OF_WEEK_TO_NUMBER[day])
            }
        }
        return set
    }, [sessions])
}

/**
 * Livestream-calendar modal — the CONNECTED half: reads the overlay open-state
 * ({@link useLivestreamCalendarOverlayState}) and the course's recurring livestream
 * sessions (redux, `state.livestreamSession.entities`), derives the calendar's
 * unavailable-weekday predicate + default focused date, resolves every label (incl.
 * per-row interpolation), and hands the resolved shape to the presentational
 * {@link _LivestreamCalendarModal}. Mounted PROP-LESS by `ModalContainer` — see
 * `tiers/split.md`.
 */
export const LivestreamCalendarModal = () => {
    const t = useTranslations()
    const format = useFormatter()
    const { isOpen, setOpen } = useLivestreamCalendarOverlayState()
    const sessions = useAppSelector((state) => state.livestreamSession.entities)
    const sessionDow = useSessionWeekdaySet(sessions)

    // Recurring (non-overridden) sessions, in their authored display order — the source
    // both the calendar's default focus AND the list rows are built from.
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

    /** `true` for a weekday with no recurring session — dims it in the calendar grid. */
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

    const rows = useMemo<Array<LivestreamCalendarSessionRow>>(
        () => [...visibleSessions]
            .sort((prev, next) => {
                return DAY_OF_WEEK_TO_NUMBER[next.dayOfWeek as DayOfWeek] - DAY_OF_WEEK_TO_NUMBER[prev.dayOfWeek as DayOfWeek]
            })
            .map((session) => {
                const dow = session.dayOfWeek as DayOfWeek
                const next = nextOccurrenceForDayOfWeek(dow)
                // `session.note` is `string | null`; only a non-blank note becomes a row note
                // (kept UNTRIMMED, same as the original `session.note?.trim() ? session.note : null` check).
                const noteSource = session.note
                const note = noteSource != null && noteSource.trim().length > 0 ? noteSource : undefined
                return {
                    id: session.id,
                    dayLabel: t(`livestream.calendar.days.${dow}`),
                    timeRangeLabel: t("livestream.calendar.sessionTime", {
                        start: formatTime(session.startTime),
                        end: formatTime(session.expectedEndTime),
                    }),
                    nextOnLabel: t("livestream.calendar.nextOn", {
                        date: format.dateTime(next.toDate(), { dateStyle: "long" }),
                    }),
                    note,
                }
            }),
        [visibleSessions, t, format],
    )

    return (
        <_LivestreamCalendarModal
            isOpen={isOpen}
            onOpenChange={setOpen}
            defaultFocusedValue={defaultFocusedValue}
            isDateUnavailable={isDateUnavailable}
            rows={rows}
            labels={{
                modalTitle: t("livestream.calendar.modalTitle"),
                calendarAriaLabel: t("livestream.calendar.aria"),
                emptyTitle: t("livestream.calendar.empty"),
            }}
        />
    )
}
