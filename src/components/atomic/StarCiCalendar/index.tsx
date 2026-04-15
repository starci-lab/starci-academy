"use client"

import { Calendar } from "@heroui/react"
import type { CalendarRootProps } from "@heroui/react"
import React from "react"

export const StarCiCalendar = (props: CalendarRootProps) => {
    return (
        <Calendar
            {...props}
        />
    )
}
