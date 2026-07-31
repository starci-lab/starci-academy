import React from "react"
import type { ReactNode } from "react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCardPressableGroup, type SurfaceCardPressableGroupItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `RatingBar`: how well did you remember it. Four tiles the learner taps
 * after an answer is revealed, feeding the spaced-repetition schedule.
 *
 * WHY A BLOCK, AND A SHARED ONE: it knows what a RECALL GRADE is — that there are
 * four of them, that they run weakest to strongest, and that the answer decides
 * when the card comes back. Flashcard review and quiz recap both grade recall, so
 * it belongs to neither.
 *
 * ⭐ GRADING IS AN ACTION, NOT A SELECTION. Nothing stays lit after the tap: no
 * ring, no checked state. The learner is not choosing a setting they might come
 * back and change, they are answering once and moving on — a persistent selected
 * skin would invite them to sit and reconsider.
 *
 * ⭐ THE COLOUR RAMP IS A TIER, NOT A STATUS. Grades run rose → emerald like a
 * difficulty scale, because "I forgot" is not an ERROR and "easy" is not a
 * SUCCESS — they are positions on one axis. Using the status palette here would
 * tell the learner they got something wrong by being honest.
 *
 * THE KEY HINT IS A CHIP, THE INTERVAL IS NOT. One chip per tile, and it goes to
 * the keyboard shortcut because that is the classifying mark; the next-interval
 * preview is a quiet fact and rides as muted text.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * One rating tile's content — label + key-hint chip, plus an optional interval
 * hint. Extracted to a helper (rather than hoisted to a const) because it
 * depends on the loop variables `option`/`position` from the `.map()` that
 * calls it.
 */
const ratingTileBody = (option: RatingOption, position: number, showAnatomy: boolean): ReactNode => (
    <StackV
        gap="related"
        anatPart={showAnatomy ? "StackV" : undefined}
        body={
            <>
                <StackH
                    gap="related"
                    align="center"
                    justify="between"
                    anatPart={showAnatomy ? "StackH" : undefined}
                    body={
                        <>
                            <Typography size="sm" weight="medium" text={option.label} anatPart={showAnatomy ? "Typography" : undefined} />
                            {/* One chip per tile, and it goes to the KEY — that is the classifying
                                mark. The interval below is a quiet fact, so it stays as text. */}
                            <Chip tone="default" text={String(position + 1)} anatPart={showAnatomy ? "Chip" : undefined} />
                        </>
                    }
                />
                {option.hint != null ? (
                    <Typography size="xs" color="muted" text={option.hint} anatPart={showAnatomy ? "Typography" : undefined} />
                ) : null}
            </>
        }
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
    showAnatomy = false,
    anatPart,
}: RatingBarProps) => {
    const items: Array<SurfaceCardPressableGroupItem> = options.map((option, position) => ({
        key: String(option.grade),
        onPress: () => onRate(option.grade),
        isDisabled: isPending,
        withVerdict: { enable: true, color: GRADE_COLOR[option.grade] },
        content: ratingTileBody(option, position, showAnatomy),
    }))

    return (
        <div data-anat-part={anatPart}>
            <div data-anat-part={showAnatomy ? "SurfaceCardPressableGroup" : undefined}>
                <SurfaceCardPressableGroup
                    ariaLabel={ariaLabel}
                    columns={{ base: 2, md: 4 }}
                    gap="grouped"
                    keyboardShortcut
                    items={items}
                    isSkeleton={isSkeleton}
                />
            </div>
        </div>
    )
}

export { RatingBar }
