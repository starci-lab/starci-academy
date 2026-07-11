"use client"

import React from "react"
import { Typography, cn } from "@heroui/react"
import { BackLink } from "../BackLink"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Identity chip shown after the back link — an avatar (optional) + a name. */
export interface WorkSessionHeaderIdentity {
    /** Avatar image (e.g. an interviewer persona's face). Omit for a text-only identity (e.g. a course name). */
    avatarSrc?: string
    /** Display name — the interviewer's name, or the course/deck being worked. */
    name: string
}

/** Props for the {@link WorkSessionHeader} block. */
export interface WorkSessionHeaderProps extends WithClassNames<undefined> {
    /** Label for the leading {@link BackLink} ("Rời phỏng vấn" / "Thoát"…). */
    backLabel: string
    /** Fired when the back link is pressed — the caller owns the routing/confirm-modal. */
    onBack: () => void
    /** Optional identity chip (avatar + name) between the back link and the counter. */
    identity?: WorkSessionHeaderIdentity
    /** Step counter text ("Câu 3/6", "2/4 · Thiết kế"…). */
    counter: React.ReactNode
    /** Current step position (0-indexed) — drives the progress-segment bar. */
    current: number
    /** Total steps — segment count of the progress bar. */
    total: number
    /**
     * Optional small chips right after the counter (level/topic tags…) — part of
     * the ONE header row, not a separate line below it (thầy 2026-07-11: "bỏ mấy
     * cái tag lên cái thanh navbar phụ").
     */
    meta?: React.ReactNode
    /** Optional trailing content pinned to the row's right edge (timer, tool-toggle, combo chip…). */
    rightSlot?: React.ReactNode
}

/**
 * The shared WORK-SURFACE header band for a focused, timed/paced work session
 * (a mock-interview round, a flashcard quiz run…): a back link, an optional
 * identity chip, a step counter, optional right-aligned tools, and a full-width
 * progress-segment bar as the band's bottom edge. Sticky under the navbar so
 * every surface using it shares one aligned top instead of each hand-rolling
 * its own HUD row. Segments read `current` (0-indexed) against `total`:
 * before → `success` (done), at → `accent` (in progress), after → `default`
 * (upcoming). Extracted from `MockInterviewSession`'s own `renderWorkHeader`
 * so `QuizSession`'s "Hỏi nhanh" run can share the exact same shell.
 * @param props - {@link WorkSessionHeaderProps}
 */
export const WorkSessionHeader = ({
    backLabel,
    onBack,
    identity,
    counter,
    current,
    total,
    meta,
    rightSlot,
    className,
}: WorkSessionHeaderProps) => (
    <div className={cn("sticky top-16 z-10 border-b border-default bg-surface", className)}>
        <div className="flex items-center gap-3 px-4 py-2.5 sm:px-6">
            <BackLink label={backLabel} onPress={onBack} />
            {identity ? (
                <>
                    <span className="hidden h-5 w-px shrink-0 bg-default sm:block" aria-hidden />
                    <span className="flex min-w-0 items-center gap-2">
                        {identity.avatarSrc ? (
                            <img
                                src={identity.avatarSrc}
                                alt=""
                                className="size-7 shrink-0 rounded-full object-cover"
                                aria-hidden
                            />
                        ) : null}
                        <Typography type="body-sm" weight="medium" className="hidden truncate sm:block">
                            {identity.name}
                        </Typography>
                    </span>
                </>
            ) : null}
            <span className="hidden h-5 w-px shrink-0 bg-default sm:block" aria-hidden />
            <Typography type="body-sm" weight="medium" color="muted" className="whitespace-nowrap">
                {counter}
            </Typography>
            {meta}
            <span className="flex-1" />
            {rightSlot}
        </div>
        {/* progress meter = bottom edge, full width (goal-gradient) */}
        <div className="flex gap-1 px-4 pb-2 sm:px-6" role="presentation">
            {Array.from({ length: total }, (_, position) => (
                <span
                    key={position}
                    className={cn(
                        "h-1 flex-1 rounded-full",
                        position < current ? "bg-success" : position === current ? "bg-accent" : "bg-default",
                    )}
                />
            ))}
        </div>
    </div>
)
