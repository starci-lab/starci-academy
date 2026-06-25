"use client"

import React from "react"
import type { ReactNode } from "react"
import { Link, Typography, cn } from "@heroui/react"
import { CaretRightIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Line colour of a track (token-based). */
export type MetroLineColor = "accent" | "success" | "warning"

/** One track = one metro line running through the shared stations. */
export interface RoadmapMetroTrack {
    /** Stable key. */
    key: string
    /** Leading identity icon. */
    icon: ReactNode
    /** Track title (e.g. "Fullstack thực chiến"). */
    title: string
    /** Meta line under the title (e.g. "23 module · 20 hệ thống"). */
    meta: string
    /** Line colour. */
    color: MetroLineColor
    /** Topic at each station (aligned 1:1 with {@link RoadmapMetroProps.stations}). */
    stops: ReadonlyArray<string>
    /** CTA label (e.g. "Vào khóa"). */
    viewLabel: string
    /** Fired when the CTA is pressed. */
    onView: () => void
}

/** Props for the {@link RoadmapMetro} block. */
export interface RoadmapMetroProps extends WithClassNames<undefined> {
    /** The ONE shared progression axis (tier labels) every track runs through. */
    stations: ReadonlyArray<string>
    /** The tracks (metro lines). */
    tracks: ReadonlyArray<RoadmapMetroTrack>
}

/** colour → rail / node-ring / destination-fill / text classes. */
const LINE: Record<MetroLineColor, { rail: string, node: string, dest: string, text: string }> = {
    accent: { rail: "bg-accent/40", node: "border-accent", dest: "bg-accent", text: "text-accent" },
    success: { rail: "bg-success/40", node: "border-success", dest: "bg-success", text: "text-success" },
    warning: { rail: "bg-warning/40", node: "border-warning", dest: "bg-warning", text: "text-warning" },
}

/** Grid template: identity column + one column per station. */
const GRID = "grid grid-cols-[150px_repeat(4,minmax(0,1fr))] gap-x-6"

/**
 * Metro-map roadmap: ONE shared station axis (the progression tiers) with each
 * track rendered as a coloured LINE running through the same stations — "ba lộ
 * trình · một tư duy" made literal (three lines, four shared stations). Each stop
 * shows the track's topic at that tier; the final stop is the emphasised
 * destination, with a hover "Vào khóa" link (caret slides right). Scrolls
 * horizontally on narrow screens so the stations stay column-aligned. Tier-3 block
 * — owns all styling; content via props.
 *
 * @param props - {@link RoadmapMetroProps}
 */
export const RoadmapMetro = ({ stations, tracks, className }: RoadmapMetroProps) => (
    <div className={cn("overflow-x-auto", className)}>
        <div className="min-w-[680px]">
            {/* shared station axis — the "one mindset" */}
            <div className={cn(GRID, "border-b border-default pb-3")}>
                <span aria-hidden />
                {stations.map((label, index) => (
                    <Typography key={label} type="body-xs" color="muted">
                        <span className="text-accent">{index + 1}</span>
                        {" · "}
                        {label}
                    </Typography>
                ))}
            </div>

            {/* one line per track */}
            {tracks.map((track) => {
                const line = LINE[track.color]
                return (
                    <div key={track.key} className={cn(GRID, "items-start border-b border-default py-4 last:border-b-0")}>
                        {/* identity + CTA */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className={cn("[&>svg]:size-5", line.text)}>{track.icon}</span>
                                <Typography type="body-sm" weight="semibold">{track.title}</Typography>
                            </div>
                            <Typography type="body-xs" color="muted">{track.meta}</Typography>
                            <Link
                                onPress={track.onView}
                                className="group inline-flex w-fit cursor-pointer items-center gap-1 pt-0.5 text-sm text-accent"
                            >
                                <span className="group-hover:underline">{track.viewLabel}</span>
                                <CaretRightIcon
                                    aria-hidden
                                    focusable="false"
                                    className="size-4 transition-transform group-hover:translate-x-1"
                                />
                            </Link>
                        </div>

                        {/* stations on this line */}
                        {track.stops.map((topic, index) => {
                            const isDestination = index === track.stops.length - 1
                            return (
                                <div key={index} className="relative pt-0.5">
                                    {/* rail to the next station (bridges the column gap) */}
                                    {isDestination ? null : (
                                        <span aria-hidden className={cn("absolute left-1 -right-6 top-[8px] h-0.5 rounded", line.rail)} />
                                    )}
                                    {/* station node — ring for stops, filled for the destination */}
                                    <span
                                        aria-hidden
                                        className={cn(
                                            "relative z-10 block size-4 rounded-full border-2",
                                            isDestination ? cn(line.dest, "border-transparent") : cn("bg-background", line.node),
                                        )}
                                    />
                                    <Typography type="body-sm" className={cn("mt-2", isDestination && "font-medium")}>
                                        {topic}
                                    </Typography>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    </div>
)
