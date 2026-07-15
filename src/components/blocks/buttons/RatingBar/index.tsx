"use client"

import React from "react"
import { Chip, Typography, cn } from "@heroui/react"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { GroupPressableCard } from "@/components/blocks/cards/GroupPressableCard"
import { DIFFICULTY_COLOR } from "@/components/blocks/chips/DifficultyChip"

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
    /**
     * Accessible name for the grade group, localized by the caller (blocks carry
     * no i18n) — e.g. "Chọn mức độ nhớ". Without it a screen reader hears four
     * loose buttons with nothing tying them together.
     */
    ariaLabel: string
    /** Disables every button while a review is in flight. */
    isPending?: boolean
}

/**
 * Recall-grade ramp, reusing `DifficultyChip`'s `DIFFICULTY_COLOR` SSOT instead
 * of the semantic `danger`/`warning`/`success`/`accent` tokens — a grade is a
 * TIER (like a difficulty level), not a status/alert, and those 5 semantic
 * tokens would collide (only 4 tiers, one token doubles up) or wrongly imply
 * "this failed" for the weakest grade. `DIFFICULTY_COLOR` runs easy→hard
 * (`beginner`→`insane`); this ramp runs weakest→strongest RECALL, the inverse
 * axis — so grade 0 (Quên, hardest to recall) maps to `insane` and grade 3
 * (Dễ, easiest) maps to `beginner`, not the same index.
 */
const GRADE_STRIPE: Record<number, string> = {
    0: DIFFICULTY_COLOR.insane,
    1: DIFFICULTY_COLOR.advanced,
    2: DIFFICULTY_COLOR.intermediate,
    3: DIFFICULTY_COLOR.beginner,
}

/**
 * The SM-2 recall-rating bar: a row of FOUR equal-width grade TILES (Again / Hard
 * / Good / Easy) the learner taps — or presses `1`–`4` — after revealing a
 * flashcard's answer. Each tile carries a tier-colored edge stripe (the shared
 * `DIFFICULTY_COLOR` ramp — see {@link GRADE_STRIPE}), a keyboard-key hint (a
 * neutral `Chip` — canon `elements/chip.md` §1, no hand-rolled `<kbd>` pill),
 * and an optional next-interval preview.
 *
 * The tiles + their grid + the 1–4 shortcut are a `GroupPressableCard`, so
 * this block only owns the tile ANATOMY. Grading is an ACTION — nothing stays
 * selected, no ring, no outline — which is why this is not a
 * `SelectableCardGroup` (that block's accent outline is reserved for a REAL
 * persisted choice; nothing here persists). Restrained "pro reviewer" look
 * (Anki/RemNote), NOT a rainbow of emoji buttons. Labels/hints arrive
 * localized from the caller.
 *
 * @param props - {@link RatingBarProps}
 */
export const RatingBar = ({ options, onRate, ariaLabel, isPending = false, className }: RatingBarProps) => (
    <GroupPressableCard
        ariaLabel={ariaLabel}
        // measured: below a 384px container the hint line wraps and the tiles grow
        // to 104px tall; at 384px (4 × 90px) it settles. So four-across only from
        // `@sm`, two-up below — never the 4 × 58px sliver a viewport breakpoint
        // produced when this sat in a narrow slot on a wide screen.
        columns={{ base: 2, sm: 4 }}
        gap={3}
        keyboardShortcut
        className={className}
        items={options.map((option, position) => ({
            key: String(option.grade),
            onPress: () => onRate(option.grade),
            isDisabled: isPending,
            // `relative overflow-hidden`: the edge stripe below is a flush, square
            // rectangle (`rounded-none`) positioned to the tile's full height — it
            // needs the tile as its positioning root, and `overflow-hidden` clips
            // its top/bottom corners to follow the tile's own `rounded-2xl`
            // instead of poking past it. `pl-4` (not the `pr-3` match) leaves a
            // clear gap between the 8px stripe and the label.
            className: "relative flex flex-col gap-2 overflow-hidden py-2 pr-3 pl-4",
            content: (
                <>
                    <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-foreground">{option.label}</span>
                        <Chip size="sm" variant="soft" color="default">
                            <Chip.Label>{position + 1}</Chip.Label>
                        </Chip>
                    </span>
                    {option.hint !== undefined ? (
                        <Typography type="body-xs" color="muted">
                            {option.hint}
                        </Typography>
                    ) : null}
                    {/* Edge stripe — the grade's ONLY color signal now (the dot was
                        dropped as a redundant duplicate) — a full-height flush bar
                        on the tile's LEADING edge so the grade reads at a glance. */}
                    <span
                        aria-hidden
                        className={cn("absolute inset-y-0 left-0 w-2 rounded-none", GRADE_STRIPE[option.grade] ?? "bg-default")}
                    />
                </>
            ),
        }))}
    />
)
