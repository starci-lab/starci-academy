"use client"

import React from "react"
import { Button } from "@heroui/react"
import { PauseIcon, PlayIcon } from "@phosphor-icons/react"

/** Props for {@link PlayPauseButton}. */
export interface PlayPauseButtonProps {
    /** Whether playback is currently active (renders the pause icon). */
    isPlaying: boolean
    /** Fired when the user toggles play/pause. */
    onPlayPause: () => void
}

/**
 * Icon button that toggles between play and pause.
 *
 * Presentational: derives only its icon from `isPlaying`, no logic.
 * @param props - Playing state and the toggle callback.
 */
export const PlayPauseButton = ({
    isPlaying,
    onPlayPause,
}: PlayPauseButtonProps) => {
    return (
        <Button
            isIconOnly
            variant="ghost"
            aria-label={isPlaying ? "Pause" : "Play"}
            onPress={onPlayPause}
            className="text-white hover:bg-white/20 border-none min-w-8 h-8"
        >
            {isPlaying ? (
                <PauseIcon className="h-4 w-4" />
            ) : (
                <PlayIcon className="h-4 w-4" />
            )}
        </Button>
    )
}
