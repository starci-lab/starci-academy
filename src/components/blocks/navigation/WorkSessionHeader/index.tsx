"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Button, ScrollShadow, Typography, cn } from "@heroui/react"
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
    /**
     * Optional bold label right after the back link, BEFORE the identity chip —
     * disambiguates which WORK MODE this session is (e.g. "Hỏi nhanh" vs "Học
     * thẻ") when a caller shares this shell across several modes with an
     * otherwise-identical header row. NEVER hidden on mobile (short, and more
     * essential for orientation than `identity`, which already hides at that
     * breakpoint). Omit for a single-mode caller (e.g. Mock Interview) — no
     * visual change without it.
     */
    title?: React.ReactNode
    /** Optional identity chip (avatar + name) between the back link and the counter. */
    identity?: WorkSessionHeaderIdentity
    /**
     * Step counter text ("Câu 3/6", "2/4 · Thiết kế"…). Hidden below `sm:`
     * (chốt 2026-07-12, joins `identity`/`meta`) — the progress-segment bar at
     * the band's bottom edge already conveys position/total visually on every
     * viewport; the text label is a desktop nicety, not load-bearing on mobile.
     */
    counter: React.ReactNode
    /**
     * Currently-VIEWED step (0-indexed) — its segment reads `accent` (pink).
     * With free navigation this is "which card am I looking at", NOT "how far
     * I've progressed" — the done/green state comes from {@link doneSet}, not
     * from `position < current` (that linear fallback only applies when
     * `doneSet` is omitted).
     */
    current: number
    /** Total steps — segment count of the progress bar. */
    total: number
    /**
     * Optional set of COMPLETED step positions (0-indexed) — each listed
     * segment reads `success` (green) regardless of order, so a card graded
     * out of sequence (jump ahead, grade, jump back) still shows green
     * (2026-07-12, thầy: free-nav "chưa tới vẫn click được, cả trước và sau").
     * When OMITTED the bar falls back to the old linear model (`position <
     * current` = done) for callers that haven't adopted per-step tracking.
     */
    doneSet?: ReadonlyArray<number>
    /**
     * Optional — makes EVERY segment clickable to jump straight to that step
     * (2026-07-12: free navigation, "cả trước và sau, chưa tới vẫn click
     * được" — the old `position <= current` gate is gone). The thin 4px bar is
     * wrapped in a taller transparent hit-zone so it's actually tappable (the
     * old bare 4px target was the real reason "bấm hồng không đổi"). Omit for a
     * read-only bar.
     */
    onSegmentClick?: (position: number) => void
    /**
     * Optional — renders a "Kết thúc" completion button pinned to the header's
     * right edge (after {@link rightSlot}). Ends the session NOW (grade what's
     * done → results), distinct from the back-link's "Thoát" (leave, keep the
     * session resumable). `secondary` tone — a completion, not the primary
     * in-session action. Omit for a session that only finishes by reaching the
     * last step.
     */
    onFinish?: () => void
    /** Label for the {@link onFinish} button (e.g. "Kết thúc"). Required to render it. */
    finishLabel?: React.ReactNode
    /**
     * Optional small chips right after the counter (level/topic tags…) — part of
     * the ONE header row, not a separate line below it (thầy 2026-07-11: "bỏ mấy
     * cái tag lên cái thanh navbar phụ"). Hidden below `sm:` (mirrors `identity`
     * — 2026-07-12, the least-essential piece, dropped at the SAME breakpoint
     * `identity` already uses) so the common case fits without scrolling; the
     * row is ALSO wrapped in a `ScrollShadow` as a fallback underneath that for
     * whatever still overruns (long `identity`/`counter` text, `rightSlot`
     * carrying both a timer and a combo chip).
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
 * its own HUD row. Each of `total` segments FILLS `success` (green) when in
 * {@link doneSet} (order-independent), else `default` (gray) — and INDEPENDENTLY
 * gets a pink `accent` ring when it `=== current` (viewed), regardless of its
 * fill, so "which step am I on" never disappears just because that step is
 * already graded. With {@link onSegmentClick} every segment jumps to that step
 * (free nav); with {@link onFinish} a "Kết thúc" button ends the session. Extracted
 * from `MockInterviewSession`'s own `renderWorkHeader` so the flashcard sessions
 * can share the exact same shell.
 * @param props - {@link WorkSessionHeaderProps}
 */
export const WorkSessionHeader = ({
    backLabel,
    onBack,
    title,
    identity,
    counter,
    current,
    total,
    doneSet,
    meta,
    rightSlot,
    onSegmentClick,
    onFinish,
    finishLabel,
    className,
}: WorkSessionHeaderProps) => {
    const t = useTranslations()
    // per-step done lookup — `doneSet` (green regardless of order) when the
    // caller tracks it, else the old linear "everything before current" model.
    const doneLookup = doneSet ? new Set(doneSet) : null
    const isDone = (position: number): boolean =>
        doneLookup ? doneLookup.has(position) : position < current
    return (
        <div className={cn("sticky top-16 z-10 border-b border-default bg-surface", className)}>
            {/* `meta` already drops below `sm:` (least-essential piece, mirrors
            `identity`'s own breakpoint) so the row fits the common case without
            scrolling — `ScrollShadow` is the SAFETY NET underneath that, not the
            primary fix: a long `identity`/`counter` string, or `rightSlot`
            carrying both a timer AND a combo chip, can still outrun even the
            trimmed row. `hideScrollBar` keeps the nav band from growing a
            visible scrollbar — the fade edge alone signals "more this way". */}
            <ScrollShadow
                orientation="horizontal"
                hideScrollBar
                className="flex items-center gap-3 px-4 py-2.5 sm:px-6"
            >
                <BackLink label={backLabel} onPress={onBack} />
                {title ? (
                    <>
                        <span className="h-5 w-px shrink-0 bg-default" aria-hidden />
                        <Typography type="body-sm" weight="bold" className="shrink-0 whitespace-nowrap">
                            {title}
                        </Typography>
                    </>
                ) : null}
                {identity ? (
                    <>
                        <span className="hidden h-5 w-px shrink-0 bg-default sm:block" aria-hidden />
                        <span className="flex shrink-0 items-center gap-2">
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
                <Typography
                    type="body-sm"
                    weight="medium"
                    color="muted"
                    className="hidden shrink-0 whitespace-nowrap sm:block"
                >
                    {counter}
                </Typography>
                {meta ? <span className="hidden shrink-0 items-center gap-2 sm:flex">{meta}</span> : null}
                <span className="flex-1" />
                {rightSlot ? <span className="shrink-0">{rightSlot}</span> : null}
                {/* "Kết thúc" — end the session NOW (→ results), distinct from the
                    back-link's "Thoát" (leave, keep it resumable). ALWAYS visible
                    (a completion action, not hidden on mobile like `meta`). */}
                {onFinish && finishLabel ? (
                    <Button variant="secondary" size="sm" className="shrink-0" onPress={onFinish}>
                        {finishLabel}
                    </Button>
                ) : null}
            </ScrollShadow>
            {/* progress meter = bottom edge, full width (goal-gradient). When
                `onSegmentClick` is given EVERY segment is clickable — jump to any
                step, "cả trước và sau, chưa tới vẫn click được" (2026-07-12). The
                thin bar sits inside a taller transparent hit-zone (`py-2`) so
                it's actually tappable — the bare 4px target was why "bấm hồng
                không đổi". FILL (`doneSet` → success/green, else default/gray) and
                CURRENT are 2 INDEPENDENT signals (2026-07-12 fix, thầy: "cái màu
                xanh mà click vào là màu hồng" — before, `current` fell back to
                the done color whenever the viewed step was already graded, so
                "which step am I on" disappeared the moment you revisited a
                graded card). success keeps meaning "graded" (matches the
                mastery bar elsewhere, [[elements/color]]); accent keeps meaning
                "viewing" ([[accent-system]]) — neither overrides the other. 2
                earlier tries added a SEPARATE decoration (a ring around the bar,
                then a dot above it) — thầy rejected both as "phèn" ("cái này
                nhìn phèn lắm"), wanting the plain bar shape kept with NO added
                element. Final: `current` is just a TALLER bar (`h-1.5` vs `h-1`)
                — no new shape, no extra color, the SAME rectangle just reads
                more prominent (mirrors how a waveform/equalizer highlights the
                active bar by height alone). */}
            <div className="flex items-center gap-1 px-4 sm:px-6">
                {Array.from({ length: total }, (_, position) => {
                    const fillClass = isDone(position) ? "bg-success" : "bg-default"
                    const isCurrent = position === current
                    const content = (
                        <span className={cn("block w-full rounded-full", isCurrent ? "h-1.5" : "h-1", fillClass)} />
                    )
                    return onSegmentClick ? (
                        <button
                            key={position}
                            type="button"
                            aria-label={t("common.workSessionHeaderSegmentAria", { step: position + 1 })}
                            aria-current={isCurrent ? "step" : undefined}
                            onClick={() => onSegmentClick(position)}
                            className="flex flex-1 cursor-pointer items-center rounded py-2 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                            {content}
                        </button>
                    ) : (
                        <span key={position} aria-hidden className="flex flex-1 items-center py-2">{content}</span>
                    )
                })}
            </div>
        </div>
    )
}
