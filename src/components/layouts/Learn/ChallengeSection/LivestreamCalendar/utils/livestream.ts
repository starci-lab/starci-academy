import {
    CalendarDate,
} from "@internationalized/date"
import {
    dayjs,
} from "@/modules/dayjs"
import {
    DayOfWeek,
    type LivestreamSessionEntity,
} from "@/modules/types"
import {
    dayOfWeekToNumber,
} from "../map"
import type {
    CountdownParts,
} from "../types"

/**
 * Parse a `HH:MM:SS` time string into numeric parts.
 *
 * @param hhmmss - Time string (e.g. `"19:30:00"`).
 * @returns The hour, minute, and second (each defaulting to 0 when invalid).
 */
const parseTime = (hhmmss: string) => {
    const [hh, mm, ss] = hhmmss.split(":").map((x) => Number(x))
    return {
        hour: Number.isFinite(hh) ? hh : 0,
        minute: Number.isFinite(mm) ? mm : 0,
        second: Number.isFinite(ss) ? ss : 0,
    }
}

/**
 * Compute the next occurrence of a weekly slot at a given weekday + start time.
 * If today is the weekday but the time already passed, returns next week.
 *
 * @param day - Weekday the slot recurs on.
 * @param startTime - Start time as `HH:MM:SS`.
 * @returns The next start moment as a dayjs instance.
 */
export const nextLivestreamStartAt = (day: DayOfWeek, startTime: string) => {
    const now = dayjs()
    const targetDow = dayOfWeekToNumber[day]
    const addDays = (targetDow - now.day() + 7) % 7
    const base = now.add(addDays, "day").startOf("day")
    const { hour, minute, second } = parseTime(startTime)
    const candidate = base.hour(hour).minute(minute).second(second)
    if (candidate.isBefore(now)) {
        return candidate.add(7, "day")
    }
    return candidate
}

/**
 * Find the nearest upcoming (non-overridable) livestream session.
 *
 * @param sessions - All known livestream sessions, if loaded.
 * @returns The nearest session and its next start moment, or `undefined`.
 */
export const nearestUpcomingLivestream = (sessions: Array<LivestreamSessionEntity> | undefined) => {
    if (!sessions?.length) {
        return undefined
    }
    const eligible = sessions.filter((s) => !s.isOverridable)
    if (eligible.length === 0) {
        return undefined
    }
    let best = nextLivestreamStartAt(eligible[0].dayOfWeek as DayOfWeek, eligible[0].startTime)
    let bestSession = eligible[0]
    for (const s of eligible.slice(1)) {
        const next = nextLivestreamStartAt(s.dayOfWeek as DayOfWeek, s.startTime)
        if (next.isBefore(best)) {
            best = next
            bestSession = s
        }
    }
    return { session: bestSession, startAt: best }
}

/**
 * Convert a dayjs date into a `@internationalized/date` {@link CalendarDate}.
 *
 * @param d - The dayjs date to convert.
 * @returns The equivalent CalendarDate (1-based month).
 */
export const toCalendarDate = (d: dayjs.Dayjs): CalendarDate => {
    return new CalendarDate(d.year(), d.month() + 1, d.date())
}

/**
 * Break a total number of seconds into days/hours/minutes/seconds.
 *
 * @param totalSeconds - Total seconds remaining (clamped at 0).
 * @returns The countdown parts.
 */
export const countdownParts = (totalSeconds: number): CountdownParts => {
    const s = Math.max(0, Math.floor(totalSeconds))
    const days = Math.floor(s / 86400)
    const hours = Math.floor((s % 86400) / 3600)
    const minutes = Math.floor((s % 3600) / 60)
    const seconds = s % 60
    return { days, hours, minutes, seconds }
}
