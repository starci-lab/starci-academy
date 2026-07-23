"use client"

import React from "react"
import { Typography, cn } from "@heroui/react"
import type { ReactNode } from "react"
import { GroupPressableCard } from "../GroupPressableCard/GroupPressableCard"
import { StatusChip } from "../../chips/StatusChip/StatusChip"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the target `RatingBar`. Authored in Storybook
 * (not `src`); synced to `src` later. NO `@/components` imports.
 *
 * Composes the local `GroupPressableCard` port (itself over `PressableCard` +
 * the shared `verdict-band`) for the tile grid, and `StatusChip` for the
 * keyboard-shortcut number pill — no more inlined copies of either primitive.
 */

// ── RatingBar ────────────────────────────────────────────────────────────────
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
export interface RatingBarProps {
    /** Ordered grades to offer, weakest recall first (Again → Easy). */
    options: Array<RatingOption>
    /** Called with the chosen grade. */
    onRate: (grade: number) => void
    /**
     * Accessible name for the grade group, localized by the caller (blocks carry
     * no i18n) — e.g. "Chọn mức độ nhớ". Without it a screen reader hears four
     * loose buttons with nothing tying them together.
     */
    ariaLabel: string
    /** Disables every button while a review is in flight. */
    isPending?: boolean
    /**
     * `true` → render the skeleton mirror (same grid, same tile chrome, same
     * per-option hint row) instead of the real pressable tiles. Consumer just
     * flips the flag while the flashcard/answer data is still loading.
     */
    isSkeleton?: boolean
    /** Extra classes on the group. */
    className?: string
}

/**
 * Grade → RAW palette colour for the shared verdict band's `color` escape hatch.
 * A grade is a TIER (like a difficulty level), not a status/alert, so it uses the
 * difficulty HUE ramp (rose→emerald). Runs weakest→strongest RECALL: grade 0 (Quên)
 * = rose, grade 3 (Dễ) = emerald.
 */
const GRADE_COLOR: Record<number, string> = {
    0: "rose-500",
    1: "orange-500",
    2: "amber-500",
    3: "emerald-500",
}

/**
 * The SM-2 recall-rating bar: a row of FOUR equal-width grade TILES (Again / Hard
 * / Good / Easy) the learner taps — or presses `1`–`4` — after revealing a
 * flashcard's answer. Each tile carries a tier-colored LEFT BAND (the shared
 * `withVerdict` band, colours from {@link GRADE_COLOR}), a keyboard-key hint (a
 * neutral `StatusChip`), and an optional next-interval preview.
 *
 * The tiles + their grid + the 1–4 shortcut are a `GroupPressableCard`, so this
 * block only owns the tile ANATOMY. Grading is an ACTION — nothing stays selected,
 * no ring, no outline. Labels/hints arrive localized from the caller.
 *
 * @param props - {@link RatingBarProps}
 */
export const RatingBar = ({
    options,
    onRate,
    ariaLabel,
    isPending = false,
    isSkeleton = false,
    className,
}: RatingBarProps) => {
    if (isSkeleton) {
        // Mirrors GroupPressableCard's own grid + tile chrome (`grid-cols-2
        // @sm:grid-cols-4 gap-3` / `rounded-2xl shadow-field`) literally — this
        // fixed 2/4-column skeleton isn't the responsive `columns` prop the real
        // port takes, so there's nothing to compose here, just the same classes —
        // and swaps only the label/key-chip/hint content for bars, so nothing
        // shifts once the real grades arrive.
        return (
            <div className={cn("@container", className)}>
                <div className="grid grid-cols-2 gap-3 @sm:grid-cols-4">
                    {options.map((option) => (
                        <div key={option.grade} className="flex flex-col gap-2 rounded-2xl py-2 pr-3 pl-3 shadow-field">
                            <span className="flex items-center justify-between gap-2">
                                <Skeleton.Typography type="body-sm" width="1/2" />
                                <Skeleton.Chip className="size-6" />
                            </span>
                            {option.hint !== undefined ? (
                                <Skeleton.Typography type="body-xs" width="1/3" />
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
    return (
        <GroupPressableCard
            ariaLabel={ariaLabel}
            columns={{ base: 2, sm: 4 }}
            gap={3}
            keyboardShortcut
            className={className}
            items={options.map((option, position) => ({
                key: String(option.grade),
                onPress: () => onRate(option.grade),
                isDisabled: isPending,
                withVerdict: { enable: true, color: GRADE_COLOR[option.grade] },
                className: "flex flex-col gap-2 py-2 pr-3 pl-3",
                content: (
                    <>
                        <span className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-foreground">{option.label}</span>
                            <StatusChip tone="neutral">{position + 1}</StatusChip>
                        </span>
                        {option.hint !== undefined ? (
                            <Typography type="body-xs" color="muted">
                                {option.hint}
                            </Typography>
                        ) : null}
                    </>
                ),
            }))}
        />
    )
}
