"use client"

import React, { useEffect } from "react"
import { Chip, Typography, cn } from "@heroui/react"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { PressableCard } from "@/components/blocks/cards/PressableCard"

/** One selectable recall grade in a {@link RatingBar}. */
export interface RatingOption {
    /** SM-2 grade value reported to {@link RatingBarProps.onRate} (0=Again … 3=Easy). */
    grade: number
    /** Localized button label (resolved by the caller — blocks carry no i18n). */
    label: ReactNode
    /** Optional secondary line under the label (e.g. the next-interval preview). */
    hint?: ReactNode
}

/** Props for the {@link RatingBar} block. */
export interface RatingBarProps extends WithClassNames<undefined> {
    /** Ordered grades to offer, weakest recall first (Again → Easy). */
    options: Array<RatingOption>
    /** Called with the chosen grade. */
    onRate: (grade: number) => void
    /** Disables every button while a review is in flight. */
    isPending?: boolean
}

/**
 * Semantic dot per recall grade — the weakest→strongest ramp (danger → warning →
 * success → accent) survives as a small COLOR DOT beside the label, not a full
 * pastel-fill tile. Keeps the 4-step scanability without the toy/gamified look a
 * solid rainbow tile carries (a spaced-repetition grader is a tool, not a sticker
 * — see `learning-surface-grounded-in-pedagogy-not-superficial-gamify`).
 */
const GRADE_DOT: Record<number, string> = {
    0: "bg-danger",
    1: "bg-warning",
    2: "bg-success",
    3: "bg-accent",
}

/**
 * The SM-2 recall-rating bar: a row of FOUR equal-width grade TILES (Again / Hard
 * / Good / Easy) the learner taps — or presses `1`–`4` — after revealing a
 * flashcard's answer. Each tile is a neutral surface card carrying a small
 * semantic dot (weakest→strongest ramp — the strongest grade's dot alone
 * carries the accent, no extra border), a keyboard-key hint (a neutral `Chip`
 * — canon `elements/chip.md` §1, no hand-rolled `<kbd>` pill), and an optional
 * next-interval preview. Each tile is a shared `PressableCard`
 * (`hoverVariant="lift"` — default Card shadow at rest, unchanged on hover,
 * only the tile lifts; pick-and-stay, not a fill/go-there row) instead of a
 * hand-rolled `<button>`, per the no-style-in-features rule. Restrained
 * "pro reviewer" look (Anki/RemNote),
 * NOT a rainbow of emoji buttons. Labels/hints arrive localized from the caller.
 *
 * @param props - {@link RatingBarProps}
 */
export const RatingBar = ({ options, onRate, isPending = false, className }: RatingBarProps) => {
    // press 1–4 to grade without reaching for the mouse — a power-user affordance
    // the toy version lacked. Ignored while a review is in flight or focus is in a
    // text field (defensive — this surface has none today).
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (isPending) {
                return
            }
            const target = event.target as HTMLElement | null
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
                return
            }
            const position = Number(event.key) - 1
            if (Number.isInteger(position) && position >= 0 && position < options.length) {
                event.preventDefault()
                onRate(options[position].grade)
            }
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [options, onRate, isPending])

    return (
        <div className={cn("grid grid-cols-2 gap-2 sm:grid-cols-4", className)}>
            {options.map((option, position) => (
                <PressableCard
                    key={option.grade}
                    onPress={() => onRate(option.grade)}
                    isDisabled={isPending}
                    hoverVariant="lift"
                    className="flex flex-col gap-1.5 rounded-xl px-3 py-2.5"
                >
                    <span className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                            <span
                                aria-hidden
                                className={cn("size-2 shrink-0 rounded-full", GRADE_DOT[option.grade] ?? "bg-default")}
                            />
                            <span className="text-sm font-medium text-foreground">{option.label}</span>
                        </span>
                        <Chip size="sm" variant="soft" color="default">
                            <Chip.Label>{position + 1}</Chip.Label>
                        </Chip>
                    </span>
                    {option.hint !== undefined ? (
                        <Typography type="body-xs" color="muted">
                            {option.hint}
                        </Typography>
                    ) : null}
                </PressableCard>
            ))}
        </div>
    )
}
