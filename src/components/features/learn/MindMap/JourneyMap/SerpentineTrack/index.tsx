"use client"

import React, {
    useEffect,
    useMemo,
    useRef,
} from "react"
import {
    Button,
    cn,
} from "@heroui/react"
import {
    ArrowRightIcon,
    ArrowDownIcon,
    LockSimpleIcon,
} from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import type {
    Journey,
    JourneyWaypoint,
} from "../journey"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Fixed content column width; the serpentine weaves inside it (centered, scrolls). */
const W = 760
/** Vertical gap between consecutive waypoints. */
const DY = 156
const TOP_PAD = 140
const BOT_PAD = 120
/** Horizontal weave amplitude (how far the path swings left/right). */
const AMP = W * 0.27

/** Themed emoji per waypoint index (purely presentational; data carries no icon). */
const LEARN_ICONS = ["🧱", "🗄️", "🔌", "🔐", "🧪", "📨", "⚡", "📈", "🐳", "☸️", "🧩", "🔗", "📡", "🔎", "🛡️", "🚀", "📊", "🔀", "☁️", "🏛️"]
const CAPSTONE_ICONS = ["📐", "🏗️", "🔐", "⚡", "☁️", "🧩", "📊", "🚀"]

/** Props for {@link SerpentineTrack}. */
export interface SerpentineTrackProps extends WithClassNames<undefined> {
    /** The normalised journey to render (one tab: learning or capstone). */
    journey: Journey
}

/**
 * The scrolling serpentine canvas for ONE journey tab — a winding path that auto-lays
 * out N waypoints (module/milestone) with a sine weave, glows the travelled segment,
 * blooms the CURRENT waypoint's children (lessons/tasks) + side-quests (challenges),
 * and floats a fixed HUD + "you are here" avatar + resume CTA. Auto-centers the current
 * waypoint on mount/tab-switch; a jump button re-centers. Scales to any N via scroll +
 * progressive detail (only the current waypoint expands). Every node navigates.
 *
 * @param props - {@link SerpentineTrackProps}
 */
export const SerpentineTrack = ({
    journey,
    className,
}: SerpentineTrackProps) => {
    const t = useTranslations()
    const router = useRouter()
    const viewportRef = useRef<HTMLDivElement>(null)

    const isCapstone = journey.kind === "capstone"
    const icons = isCapstone ? CAPSTONE_ICONS : LEARN_ICONS
    const count = journey.waypoints.length
    const current = journey.currentIndex
    const trackHeight = TOP_PAD + count * DY + BOT_PAD

    /** Serpentine coordinates: i=0 sits at the bottom, i=count-1 near the top. */
    const px = (i: number) => W / 2 + AMP * Math.sin(i * 0.85)
    const py = (i: number) => trackHeight - BOT_PAD - i * DY
    const summitX = W / 2
    const summitY = py(count - 1) - 104

    /** Split the path into the travelled (glowing) part and the road ahead (dim). */
    const { travelled, ahead } = useMemo(
        () => {
            let done = ""
            let rest = ""
            for (let i = 0; i < count - 1; i += 1) {
                const x1 = px(i)
                const y1 = py(i)
                const x2 = px(i + 1)
                const y2 = py(i + 1)
                const midY = (y1 + y2) / 2
                const seg = `M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2} `
                if (i + 1 <= current) {
                    done += seg
                } else {
                    rest += seg
                }
            }
            return { travelled: done, ahead: rest }
        },
        // px/py are pure fns of count+trackHeight; current gates the split
        [count, current, trackHeight],
    )

    // center the current waypoint when the journey (tab) changes
    useEffect(
        () => {
            const viewport = viewportRef.current
            if (viewport && current >= 0) {
                viewport.scrollTop = py(current) - viewport.clientHeight / 2
            }
        },
        [journey.kind, count],
    )

    const navigate = (href: string | null) => {
        if (href) {
            router.push(href)
        }
    }
    const recenter = () => {
        const viewport = viewportRef.current
        if (viewport && current >= 0) {
            viewport.scrollTo({ top: py(current) - viewport.clientHeight / 2, behavior: "smooth" })
        }
    }

    return (
        <div className={cn("relative h-full w-full overflow-hidden", className)}>
            <div ref={viewportRef} className="absolute inset-0 overflow-y-auto overflow-x-hidden">
                <div className="relative mx-auto" style={{ width: W, height: trackHeight }}>
                    {/* the road: travelled (accent glow) + ahead (dashed muted) */}
                    <svg
                        className="pointer-events-none absolute inset-0 h-full w-full text-accent"
                        viewBox={`0 0 ${W} ${trackHeight}`}
                        preserveAspectRatio="none"
                    >
                        <path
                            d={ahead}
                            fill="none"
                            className="stroke-default"
                            strokeWidth={11}
                            strokeLinecap="round"
                            strokeDasharray="2 18"
                        />
                        <path
                            d={travelled}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={11}
                            strokeLinecap="round"
                            style={{ filter: "drop-shadow(0 0 7px rgba(214,0,110,.45))" }}
                        />
                        <path
                            d={`M${px(count - 1)},${py(count - 1)} L${summitX},${summitY + 44}`}
                            fill="none"
                            className="stroke-default"
                            strokeWidth={11}
                            strokeLinecap="round"
                            strokeDasharray="2 18"
                        />
                    </svg>

                    {/* waypoints */}
                    {journey.waypoints.map((waypoint, i) => (
                        <Waypoint
                            key={waypoint.id}
                            waypoint={waypoint}
                            icon={icons[i % icons.length]}
                            index={i}
                            left={px(i)}
                            top={py(i)}
                            isCapstone={isCapstone}
                            onNavigate={navigate}
                            youAreHereLabel={t("mindMap.journey.youAreHere")}
                            childLabel={isCapstone ? t("mindMap.journey.tasks") : t("mindMap.journey.lessons")}
                        />
                    ))}

                    {/* summit — course graduation / capstone demo */}
                    <button
                        type="button"
                        onClick={() => navigate(journey.resumeHref)}
                        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
                        style={{ left: summitX, top: summitY }}
                    >
                        <span className="flex size-20 items-center justify-center rounded-full border-[3px] border-warning bg-warning-soft text-4xl shadow-[0_6px_24px_rgba(234,179,8,.35)]">
                            {isCapstone ? "🚀" : "🏆"}
                        </span>
                        <span className="mt-2 text-sm font-bold">
                            {isCapstone ? t("mindMap.journey.summitCapstone") : t("mindMap.journey.summitLearn")}
                        </span>
                    </button>
                </div>
            </div>

            {/* fixed overlays (do not scroll) */}
            <div className="absolute right-4 top-4 z-20 flex items-center gap-4 rounded-2xl border border-default bg-surface/80 px-4 py-2 shadow-surface backdrop-blur">
                <div className="text-xs text-muted">
                    {t("mindMap.journey.completed")}
                    <b className="block text-base text-foreground">{journey.progressPercent}%</b>
                </div>
            </div>

            {current >= 0 ? (
                <button
                    type="button"
                    onClick={recenter}
                    className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-2xl bg-accent px-4 py-2 text-xs font-bold text-accent-foreground shadow-[0_6px_18px_rgba(214,0,110,.4)]"
                >
                    <ArrowDownIcon aria-hidden focusable="false" className="size-4" weight="bold" />
                    {t("mindMap.journey.myPosition")}
                </button>
            ) : null}

            {journey.resumeHref ? (
                <Button
                    variant="primary"
                    className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 shadow-[0_8px_22px_rgba(214,0,110,.4)]"
                    onPress={() => navigate(journey.resumeHref)}
                >
                    {t("mindMap.journey.continue")}
                    <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                </Button>
            ) : null}
        </div>
    )
}

/** One waypoint orb + its "you are here" avatar + (when current) its bloomed children. */
const Waypoint = ({
    waypoint,
    icon,
    index,
    left,
    top,
    isCapstone,
    onNavigate,
    youAreHereLabel,
    childLabel,
}: {
    waypoint: JourneyWaypoint
    icon: string
    index: number
    left: number
    top: number
    isCapstone: boolean
    onNavigate: (href: string | null) => void
    youAreHereLabel: string
    childLabel: string
}) => {
    const isCurrent = waypoint.status === "current"
    const isDone = waypoint.status === "done"

    return (
        <>
            {/* bloom the current waypoint's children (lessons/tasks) + side-quests */}
            {isCurrent ? (
                <>
                    {waypoint.children.slice(0, 6).map((child, c) => {
                        const angle = -1.15 + c * 0.5
                        return (
                            <button
                                key={child.id}
                                type="button"
                                title={child.label}
                                onClick={() => onNavigate(child.href)}
                                className={cn(
                                    "absolute z-[2] size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent",
                                    child.done ? "bg-accent" : "bg-surface",
                                )}
                                style={{ left: left + 70 * Math.cos(angle), top: top + 70 * Math.sin(angle) }}
                            />
                        )
                    })}
                    {!isCapstone && waypoint.quests.slice(0, 4).map((quest, q) => {
                        const angle = 1.4 + q * 0.42
                        return (
                            <button
                                key={quest.id}
                                type="button"
                                title={quest.label}
                                onClick={() => onNavigate(quest.href)}
                                className={cn(
                                    "absolute z-[2] flex size-6 -translate-x-1/2 -translate-y-1/2 rotate-45 items-center justify-center rounded-md text-[9px] shadow-sm",
                                    quest.done ? "bg-success text-white" : "border-2 border-default bg-surface",
                                )}
                                style={{ left: left + 84 * Math.cos(angle), top: top + 84 * Math.sin(angle) }}
                            >
                                <span className="-rotate-45">⚔️</span>
                            </button>
                        )
                    })}
                </>
            ) : null}

            {/* the orb */}
            <button
                type="button"
                onClick={() => onNavigate(waypoint.href)}
                className="absolute z-[3] flex w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
                style={{ left, top }}
            >
                <span className="relative">
                    {isCurrent ? (
                        <span className="absolute -inset-2 animate-ping rounded-full border-[3px] border-accent" />
                    ) : null}
                    <span
                        className={cn(
                            "relative flex size-[66px] items-center justify-center rounded-full border-[3px] bg-surface text-[27px] shadow-surface",
                            isDone && "border-success bg-success-soft",
                            isCurrent && "border-accent bg-accent-soft",
                            waypoint.status === "upcoming" && "border-default",
                            waypoint.premium && "opacity-60",
                        )}
                    >
                        {icon}
                        {/* progress badge */}
                        <span className="absolute -right-2 -top-1 rounded-full border-[1.5px] border-default bg-surface px-2 text-[10px] font-bold text-muted">
                            {waypoint.childrenDone}/{waypoint.childrenTotal}
                            {!isCapstone && waypoint.questsTotal > 0 ? ` · ⚔️${waypoint.questsDone}` : ""}
                        </span>
                        {isDone ? (
                            <span className="absolute -bottom-1 left-1/2 flex size-5 -translate-x-1/2 items-center justify-center rounded-full border-2 border-surface bg-success text-[11px] text-white">
                                ✓
                            </span>
                        ) : null}
                        {waypoint.premium && !isDone ? (
                            <LockSimpleIcon aria-hidden focusable="false" className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 text-muted" weight="fill" />
                        ) : null}
                    </span>
                </span>
                <span className="mt-2 text-[12.5px] font-bold leading-tight">
                    {isCapstone ? "" : `${index + 1}. `}{waypoint.title}
                </span>
                <span className="text-[11px] text-muted">
                    {waypoint.childrenDone}/{waypoint.childrenTotal} {childLabel}
                </span>
            </button>

            {/* you-are-here avatar above the current orb */}
            {isCurrent ? (
                <div
                    className="absolute z-[6] flex -translate-x-1/2 flex-col items-center text-center"
                    style={{ left, top: top - 62 }}
                >
                    <span className="flex size-10 items-center justify-center rounded-full border-[3px] border-surface bg-foreground text-[19px] shadow-md">
                        🧑‍💻
                    </span>
                    <span className="mt-1 whitespace-nowrap rounded-full bg-accent px-3 py-1 text-[10.5px] font-bold text-accent-foreground">
                        {youAreHereLabel}
                    </span>
                </div>
            ) : null}
        </>
    )
}
