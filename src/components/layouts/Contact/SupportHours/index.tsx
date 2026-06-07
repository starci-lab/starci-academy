"use client"

import { Clock as ClockIcon } from "@gravity-ui/icons"
import React from "react"
import {
    SUPPORT_HOURS,
} from "../constants"

/**
 * Support-hours panel: a glass card listing opening hours per day.
 *
 * Self-contained section (single-use): reads its own static support-hours rows
 * from constants; closed days are muted/italic. The container just renders
 * `<SupportHours />`.
 */
export const SupportHours = () => {
    const rows = SUPPORT_HOURS
    return (
        <div className="mt-16 p-8 glass rounded-3xl border-white/5">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-green-500/20 p-2 rounded-lg">
                    <ClockIcon className="w-5 h-5 text-green-500" />
                </div>
                <h4 className="font-bold">Support Hours</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
                {rows.map((row) => (
                    <div
                        key={row.day}
                        className="contents"
                    >
                        <div className="text-white/50">{row.day}</div>
                        <div
                            className={
                                row.closed
                                    ? "text-right text-white/30 italic"
                                    : "text-right"
                            }
                        >
                            {row.hours}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
