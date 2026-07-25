"use client"

import React, { useEffect, useRef } from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — port of the streamed agent log console rendered
 * inline in `@/components/features/learn/Playground/PlaygroundSession` (the
 * ConnectSheet's connected body: device specs + this log). Authored in
 * Storybook (not `src`); synced back to `src` later. NO `@/components` imports.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Semantic level of one streamed log line — drives its foreground colour. */
export type AgentLogLevel = "info" | "success" | "warn" | "error"

/** One streamed line, as the paired agent reports it over the socket. */
export interface AgentLogLine {
    /** The raw line text. */
    text: string
    /** Defaults to `"info"` (muted). */
    level?: AgentLogLevel
}

const LEVEL_TO_CLASS: Record<AgentLogLevel, string> = {
    info: "text-muted",
    success: "text-success-soft-foreground",
    warn: "text-warning-soft-foreground",
    error: "text-danger-soft-foreground",
}

/** Props for the {@link AgentLogConsole} block. */
export interface AgentLogConsoleProps {
    /**
     * The streamed lines, in order. A bare `string` defaults to level `"info"`;
     * pass an {@link AgentLogLine} for a coloured level. Ignored when
     * `children` is given.
     */
    lines?: Array<AgentLogLine | string>
    /** Fully custom body — overrides `lines` (escape hatch for bespoke content). */
    children?: ReactNode
    /** Shown when there are no `lines` and no `children`. */
    emptyHint?: ReactNode
    /**
     * Pin the scroll position to the newest line whenever `lines`/`children`
     * change — mirrors the real console's "stay pinned while streaming"
     * behaviour. Defaults to `true`.
     */
    autoScroll?: boolean
    /** Extra classes on the console shell. */
    className?: string
    /** `true` → render the skeleton mirror (a few mono placeholder lines), same frame. */
    isSkeleton?: boolean
}

const CONSOLE_SHELL = "max-h-40 overflow-y-auto rounded-2xl border border-default bg-default p-3 font-mono text-xs leading-relaxed"

/** Varying widths so skeleton lines read as log TEXT, not a solid block. */
const SKELETON_LINE_WIDTHS = ["w-4/5", "w-3/5", "w-2/3", "w-1/2"]

/**
 * Streamed agent log console: a mono, scrollable, bordered surface pinned to
 * its newest line as it streams. The block owns the shell (border · radius ·
 * mono scale · autoscroll) — a feature just feeds `lines`.
 *
 * @param props - {@link AgentLogConsoleProps}
 */
export const AgentLogConsole = ({
    lines,
    children,
    emptyHint,
    autoScroll = true,
    className,
    isSkeleton = false,
}: AgentLogConsoleProps) => {
    const scrollRef = useRef<HTMLDivElement>(null)

    // Keep the console pinned to its newest line as new lines stream in.
    useEffect(() => {
        if (!autoScroll) {
            return
        }
        const el = scrollRef.current
        if (el) {
            el.scrollTop = el.scrollHeight
        }
    }, [autoScroll, lines, children])

    if (isSkeleton) {
        return (
            <div className={cn(CONSOLE_SHELL, "flex flex-col gap-2", className)}>
                {SKELETON_LINE_WIDTHS.map((width, index) => (
                    <Skeleton key={index} className={cn("h-3 rounded", width)} />
                ))}
            </div>
        )
    }

    const hasContent = children != null || (lines != null && lines.length > 0)

    return (
        <div ref={scrollRef} className={cn(CONSOLE_SHELL, className)}>
            {hasContent ? (
                children ?? (
                    <>
                        {lines!.map((entry, index) => {
                            const line = typeof entry === "string" ? { text: entry } : entry
                            const level = line.level ?? "info"
                            return (
                                <div key={index} className={cn("break-words", LEVEL_TO_CLASS[level])}>
                                    {line.text}
                                </div>
                            )
                        })}
                    </>
                )
            ) : (
                <span className="text-muted">{emptyHint}</span>
            )}
        </div>
    )
}
