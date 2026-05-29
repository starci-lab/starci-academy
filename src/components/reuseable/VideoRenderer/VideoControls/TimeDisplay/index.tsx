"use client"

import React, { useMemo } from "react"
import { formatTime } from "../utils"

/** Props for {@link TimeDisplay}. */
export interface TimeDisplayProps {
    /** Current playback position in seconds. */
    currentTime: number
    /** Total media duration in seconds. */
    duration: number
}

/**
 * Monospace `current / total` time readout.
 *
 * Presentational: derives formatted strings only.
 * @param props - Current time and duration in seconds.
 */
export const TimeDisplay = ({
    currentTime,
    duration,
}: TimeDisplayProps) => {
    /** Formatted current playback position. */
    const current = useMemo(
        () => formatTime(currentTime),
        [
            currentTime,
        ],
    )

    /** Formatted total duration. */
    const total = useMemo(
        () => formatTime(duration),
        [
            duration,
        ],
    )

    return (
        <span className="select-none text-xs font-mono text-white/80">
            {current}{" "}
            <span className="text-white/40">/</span>{" "}
            {total}
        </span>
    )
}
