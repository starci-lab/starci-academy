import React from "react"
import type { ReactNode } from "react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCardPressableGroup, type SurfaceCardPressableGroupItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `RatingBar` — how well did you remember it: four tiles tapped after an answer is
 * revealed, feeding the spaced-repetition schedule. Shared between flashcard review
 * and quiz recap. Grading is an action, not a selection — nothing stays lit after
 * the tap. The colour ramp (rose → emerald) is a tier, not a status: "I forgot" is
 * not an error and "easy" is not a success, just positions on one axis. The hint
 * line and the pending lock are states; `isSkeleton` is its own leaf.
 */

/** One recall grade offered to the learner. */
export interface RatingOption {
    /** SM-2 grade reported to {@link RatingBarProps.onRate}, 0 = forgot … 3 = easy. */
    grade: number
    /** Button label, localized by the caller (blocks carry no i18n). */
    label: string
    /** Optional second line, usually the next-interval preview. */
    hint?: string
}

/**
 * Grade → palette colour for the tile's verdict band. A grade is a TIER, so it
 * uses the difficulty ramp rather than the status palette.
 */
const GRADE_COLOR: Record<number, string> = {
    0: "rose-500",
    1: "orange-500",
    2: "amber-500",
    3: "emerald-500",
}

/** Props for {@link RatingBar}. */
export interface RatingBarProps {
    /** Grades to offer, weakest recall first. */
    options: Array<RatingOption>
    /** Called with the grade the learner picked. */
    onRate: (grade: number) => void
    /**
     * Accessible name for the group, localized by the caller. Without it a screen
     * reader hears four loose buttons with nothing tying them together.
     */
    ariaLabel: string
    /** `true` → a grade is in flight; every tile stops accepting taps. */
    isPending?: boolean
    /** `true` → the group draws its own tile mirror. */
    isSkeleton?: boolean
}

/**
 * One rating tile's content — label + key-hint chip, plus an optional interval
 * hint. Extracted to a helper (rather than hoisted to a const) because it
 * depends on the loop variables `option`/`position` from the `.map()` that
 * calls it.
 */
const ratingTileBody = (option: RatingOption, position: number): ReactNode => (
    <StackV
        gap={3}

        items={[
            () => (
                <StackH
                    gap={3}
                    align="center"
                    justify="between"

                    items={[
                        () => <Typography size="sm" weight="medium" text={option.label} />,
                        // One chip per tile, and it goes to the KEY — that is the classifying
                        // mark. The interval below is a quiet fact, so it stays as text.
                        () => <Chip tone="default" text={String(position + 1)} />,
                    ]}
                />
            ),
            ...(option.hint != null ? [() => (
                <Typography size="xs" color="muted" text={option.hint} />
            )] : []),
        ]}
    />
)

/**
 * The recall-grade row. See the file header for the full contract.
 *
 * @param props - {@link RatingBarProps}
 */
const RatingBar = ({
    options,
    onRate,
    ariaLabel,
    isPending = false,
    isSkeleton = false,
}: RatingBarProps) => {
    const items: Array<SurfaceCardPressableGroupItem> = options.map((option, position) => ({
        key: String(option.grade),
        onPress: () => onRate(option.grade),
        isDisabled: isPending,
        withVerdict: { enable: true, color: GRADE_COLOR[option.grade] },
        content: () => ratingTileBody(option, position),
    }))

    return (
        <div>
            <div>
                <SurfaceCardPressableGroup
                    ariaLabel={ariaLabel}
                    columns={{ base: 2, md: 4 }}
                    gap={4}
                    keyboardShortcut
                    items={items}
                    isSkeleton={isSkeleton}
                />
            </div>
        </div>
    )
}

export { RatingBar }
