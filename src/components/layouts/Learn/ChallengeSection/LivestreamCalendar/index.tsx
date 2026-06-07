"use client"

import { Calendar as CalendarBlankIcon, Calendar as CalendarIcon } from "@gravity-ui/icons"
import React, { useEffect, useMemo, useState } from "react"
import { useFormatter, useTranslations } from "next-intl"
import { Button, Skeleton } from "@heroui/react"
import { useLivestreamCalendarOverlayState, useQueryLivestreamSessionsSwr } from "@/hooks"
import { useAppSelector } from "@/redux"
import { DayOfWeek } from "@/modules/types"
import { countdownParts, nearestUpcomingLivestream } from "./utils"


/**
 * Promo card + button opening the livestream schedule modal (HeroUI calendar).
 *
 * Client component: holds the per-second countdown tick and reads sessions
 * from redux / SWR.
 */
export const LivestreamCalendar = () => {
    const t = useTranslations()
    const format = useFormatter()
    const { open } = useLivestreamCalendarOverlayState()
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
                        <div className="text-muted text-xs">
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
                    onPress={open}
                >
                    <CalendarBlankIcon className="w-5 h-5" />
                    {t("livestream.calendar.button")}
                </Button>
            </div>
        </div>
    )
}
