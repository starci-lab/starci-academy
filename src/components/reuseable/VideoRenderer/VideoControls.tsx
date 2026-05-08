"use client"

import React, { useCallback, useMemo } from "react"
import {
    Button,
    Slider,
    Popover,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    cn,
} from "@heroui/react"
import {
    Play,
    Pause,
    Volume2,
    VolumeOff,
    Settings,
    Maximize,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QualityLevel {
    /** Bitrate index (0 = lowest). -1 = auto. */
    index: number
    /** Vertical resolution, e.g. 360, 720, 1080. */
    height: number
    /** Bitrate in bps. */
    bitrate: number
}

export interface VideoControlsProps {
    isPlaying: boolean
    currentTime: number
    duration: number
    volume: number
    isMuted: boolean
    onPlayPause: () => void
    onSeek: (time: number) => void
    onVolumeChange: (vol: number) => void
    onMuteToggle: () => void
    onFullscreen?: () => void
    /** DASH-only: available quality levels */
    qualityLevels?: Array<QualityLevel>
    /** DASH-only: currently selected quality index (-1 = auto) */
    selectedQuality?: number
    /** DASH-only: callback to change quality */
    onQualityChange?: (index: number) => void
    /** Whether to hide the control bar */
    hidden?: boolean
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || seconds < 0) return "0:00"
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Shared video control bar overlay.
 * Used by Standard and MpegDash players.
 * Renders play/pause, seek slider, volume, duration, settings (quality), and fullscreen.
 */
export const VideoControls = ({
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    onPlayPause,
    onSeek,
    onVolumeChange,
    onMuteToggle,
    onFullscreen,
    qualityLevels,
    selectedQuality,
    onQualityChange,
    hidden = false,
}: VideoControlsProps) => {
    const hasQuality = !!(qualityLevels && qualityLevels.length > 0 && onQualityChange)

    /** Human-readable label for a quality level. */
    const qualityLabel = useCallback(
        (q: QualityLevel) =>
            q.index === -1
                ? "Auto"
                : `${q.height}p (${Math.round(q.bitrate / 1000)}k)`,
        [],
    )

    /** All quality options including Auto. */
    const allQualities = useMemo(() => {
        if (!qualityLevels) return []
        return [
            { index: -1, height: 0, bitrate: 0 } as QualityLevel,
            ...qualityLevels,
        ]
    }, [qualityLevels])

    return (
        <div
            className={cn(
                "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-3 pt-8 transition-opacity duration-300",
                hidden ? "pointer-events-none opacity-0" : "opacity-100",
            )}
        >
            {/* ── Seek bar ─────────────────────────────────────── */}
            <Slider
                aria-label="Seek"
                step={0.1}
                minValue={0}
                maxValue={duration || 1}
                value={currentTime}
                onChange={(v) => onSeek(v as number)}
                className="mb-2"
            />

            {/* ── Controls row ─────────────────────────────────── */}
            <div className="flex items-center justify-between gap-2">
                {/* Left group */}
                <div className="flex items-center gap-2">
                    {/* Play / Pause */}
                    <Button
                        isIconOnly
                        variant="ghost"
                        aria-label={isPlaying ? "Pause" : "Play"}
                        onPress={onPlayPause}
                        className="text-white hover:bg-white/20 border-none min-w-8 h-8"
                    >
                        {isPlaying ? (
                            <Pause className="h-4 w-4" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                    </Button>

                    {/* Volume */}
                    <Popover>
                        <Popover.Trigger>
                            <Button
                                isIconOnly
                                variant="ghost"
                                aria-label="Volume"
                                onPress={onMuteToggle}
                                className="text-white hover:bg-white/20 border-none min-w-8 h-8"
                            >
                                {isMuted || volume === 0 ? (
                                    <VolumeOff className="h-4 w-4" />
                                ) : (
                                    <Volume2 className="h-4 w-4" />
                                )}
                            </Button>
                        </Popover.Trigger>
                        <Popover.Content className="w-8 bg-black/90 p-2">
                            <Slider
                                aria-label="Volume"
                                orientation="vertical"
                                step={0.01}
                                minValue={0}
                                maxValue={1}
                                value={isMuted ? 0 : volume}
                                onChange={(v) => onVolumeChange(v as number)}
                                className="h-20"
                            />
                        </Popover.Content>
                    </Popover>

                    {/* Duration */}
                    <span className="select-none text-xs font-mono text-white/80">
                        {formatTime(currentTime)}{" "}
                        <span className="text-white/40">/</span>{" "}
                        {formatTime(duration)}
                    </span>
                </div>

                {/* Right group */}
                <div className="flex items-center gap-1">
                    {/* Quality selector (DASH only) */}
                    {hasQuality && (
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    isIconOnly
                                    variant="ghost"
                                    aria-label="Quality"
                                    className="text-white hover:bg-white/20 border-none min-w-8 h-8"
                                >
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Quality levels"
                                selectionMode="single"
                                selectedKeys={
                                    new Set([
                                        String(selectedQuality ?? -1),
                                    ])
                                }
                                onSelectionChange={(keys) => {
                                    const key = Array.from(keys)[0]
                                    if (key !== undefined) {
                                        onQualityChange!(Number(key))
                                    }
                                }}
                            >
                                {allQualities.map((q) => (
                                    <DropdownItem key={String(q.index)}>
                                        {qualityLabel(q)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    )}

                    {/* Fullscreen */}
                    {onFullscreen && (
                        <Button
                            isIconOnly
                            variant="ghost"
                            aria-label="Fullscreen"
                            onPress={onFullscreen}
                            className="text-white hover:bg-white/20 border-none min-w-8 h-8"
                        >
                            <Maximize className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
