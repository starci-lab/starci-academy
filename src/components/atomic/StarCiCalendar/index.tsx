"use client"

import { Calendar, type CalendarProps } from "@heroui/react"
import type { DateValue } from "@react-types/calendar"
import React from "react"

/**
 * Thin wrapper around HeroUI {@link Calendar} for consistent sizing and styling.
 */
export const StarCiCalendar = <T extends DateValue>(props: CalendarProps<T>) => {
    return (
        <Calendar
            color="primary"
            showShadow
            {...props}
        />
    )
}
