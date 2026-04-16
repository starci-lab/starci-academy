"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useFormatter, useTranslations } from "next-intl"
import { CalendarIcon, CalendarBlankIcon } from "@phosphor-icons/react"
import { Button, Skeleton } from "@heroui/react"
import { useLivestreamCalendarOverlayState, useQueryLivestreamSessionsSwr } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import { dayjs } from "@/modules/dayjs"
import { DayOfWeek, type LivestreamSessionEntity } from "@/modules/types"
import { CalendarDate } from "@internationalized/date"

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
 * Parse time string (HH:MM:SS) into hours, minutes, and seconds.
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
 * Next occurrence for a weekly slot at a given weekday + start time.
 * If today is the weekday but the time already passed, returns next week.
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
 * Find the nearest upcoming livestream session.
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
 * Convert dayjs date to CalendarDate.
 */
export const toCalendarDate = (d: dayjs.Dayjs): CalendarDate => {
    return new CalendarDate(d.year(), d.month() + 1, d.date())
}


/**
 * Countdown parts: days, hours, minutes, and seconds.
 */
export interface CountdownParts {
    /** Days */
    days: number
    /** Hours */
    hours: number
    /** Minutes */
    minutes: number
    /** Seconds */
    seconds: number
}

/**
 * Convert total seconds to days, hours, minutes, and seconds.
 */
export const countdownParts = (totalSeconds: number): CountdownParts => {
    const s = Math.max(0, Math.floor(totalSeconds))
    const days = Math.floor(s / 86400)
    const hours = Math.floor((s % 86400) / 3600)
    const minutes = Math.floor((s % 3600) / 60)
    const seconds = s % 60
    return { days, hours, minutes, seconds }
}


/**
 * Promo card + button opening the livestream schedule modal (HeroUI calendar).
 */
export const LivestreamCalendar = () => {
    const t = useTranslations()
    const format = useFormatter()
    const { onOpen } = useLivestreamCalendarOverlayState()
    const { isLoading, data } = useQueryLivestreamSessionsSwr()
    const sessions = useAppSelector((state) => state.livestreamSession.entities)
    const [nowMs, setNowMs] = useState(() => Date.now())
    useEffect(() => {
        const id = window.setInterval(() => setNowMs(Date.now()), 1000)
        return () => window.clearInterval(id)
    }, [])

    const nearest = useMemo(() => nearestUpcomingLivestream(sessions), [sessions])
    const countdown = useMemo(() => {
        if (!nearest) {
            return undefined
        }
        const totalSeconds = nearest.startAt.toDate().getTime() / 1000 - nowMs / 1000
        return countdownParts(totalSeconds)
    }, [nearest, nowMs])

    return (
        <div className="relative overflow-hidden rounded-large bg-gradient-to-br from-secondary-500/20 to-secondary-100/20 p-3">
            <CalendarIcon
                weight="thin"
                className="pointer-events-none select-none absolute -right-16 -bottom-20 rotate-[-15deg] text-white/5 blur-[0.5px] z-0 w-[240px] h-[240px]"
            />
            <div className="relative z-10 space-y-3">
                <div className="text-sm">{t("livestream.calendar.title")}</div>
                <div className="text-lg font-semibold flex flex-col">
                    {(!nearest || isLoading || !data) ?
                        <Skeleton className="h-[18px] my-[5px] w-[60%]" /> :
                        t("livestream.calendar.nextSession", {
                            day: t(`livestream.calendar.days.${nearest.session.dayOfWeek as DayOfWeek}`),
                            time: nearest.session.startTime.slice(0, 5),
                            date: format.dateTime(nearest.startAt.toDate(), { dateStyle: "medium" }),
                        })
                    }
                </div>
                <div className="space-y-1">
                    {(!countdown || isLoading || !data) ? (
                        <Skeleton className="h-[12px] my-[2px] w-[40%]" />) : (
                        <div className="text-foreground-500 text-xs">
                            {t("livestream.calendar.countdown", {
                                days: countdown.days,
                                hours: countdown.hours,
                                minutes: countdown.minutes,
                                seconds: String(countdown.seconds).padStart(2, "0"),
                            })}
                        </div>
                    )}
                </div>
                <Button
                    variant="tertiary"
                    onPress={onOpen}
                >
                    <CalendarBlankIcon className="w-5 h-5" />
                    {t("livestream.calendar.button")}
                </Button>
            </div>
        </div>
    )
}
