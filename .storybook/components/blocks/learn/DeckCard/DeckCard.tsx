import React from "react"
import type { ReactNode } from "react"
import { Card, Typography, cn } from "@heroui/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { Button } from "../../buttons/Button/Button"
import { StatusChip } from "../../chips/StatusChip/StatusChip"
import { DifficultyChip, type Difficulty } from "../../chips/DifficultyChip/DifficultyChip"
import { ProgressMeter } from "../../stats/ProgressMeter/ProgressMeter"
import { AnatomyOverlay } from "../../layout/AnatomyOverlay/AnatomyOverlay"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported faithfully from the
 * `grid`-view deck card in
 * `@/components/features/learn/Flashcards/FlashcardDeckList` (+ its
 * `FlashcardDeckListSkeleton`). Composed from a HeroUI `Card` frame + the local
 * `DifficultyChip`/`StatusChip` (chips) + `ProgressMeter` (mastery bar, upgrading
 * the old plain "Đã thuộc X/Y" text + `Separator`) + `Button` (CTA) + `Skeleton`
 * (loading mirror). The `@/` runtime deps the real list owns (SWR fetch, search/
 * pager, view toggle, the review-mode modal) stay with the feature — this is only
 * the single repeated card. Synced to `src` later.
 *
 * Note on `difficulty`: the real card colours its chip off `ChallengeDifficulty`
 * (easy/medium/hard/insane/expert → success/warning/danger). This port instead
 * takes the shared {@link Difficulty} tier used by {@link DifficultyChip}
 * everywhere else in the app (beginner/intermediate/advanced/insane) — ONE ramp,
 * not a per-surface reinvention (see `DifficultyChip`'s `DIFFICULTY_COLOR`).
 */

/** Props for {@link DeckCard}. */
export interface DeckCardProps {
    /** Deck title (line-clamped to 2 lines). */
    title: string
    /** Deck topic blurb (line-clamped to 2 lines); omit to collapse the row. */
    description?: string | null
    /** Difficulty tier — drives {@link DifficultyChip}'s dot colour. */
    difficulty: Difficulty
    /** Cards due for review right now (per-viewer). `0`/`undefined` hides the due chip. */
    dueCount?: number
    /** Cards the viewer has mastered so far (per-viewer). Defaults to `0`. */
    masteredCount?: number
    /** Total cards in the deck. */
    cardCount: number
    /**
     * Show the per-viewer spaced-repetition chrome (due chip + mastery meter).
     * The quiz-mode picker passes `false` — SR state is irrelevant when just
     * picking a topic to drill aloud. Defaults to `true`.
     */
    showProgress?: boolean
    /** CTA label. Defaults to `"Học"`. */
    ctaLabel?: ReactNode
    /** Called when the CTA is pressed. */
    onOpen: () => void
    /** `true` → render a skeleton mirror of this exact card instead of real content. */
    isSkeleton?: boolean
    /** Dev/spec: overlay the anatomy annotation (this design + its composed primitives). */
    showAnatomy?: boolean
    /** Extra classes on the card root. */
    className?: string
}

/**
 * A flashcard deck's picker card: title + due/difficulty chips, an optional topic
 * blurb, a mastery meter (per-viewer, study context only), the card count, and a
 * single "Học" CTA. Card itself is not pressable — the CTA is the only action.
 *
 * @param props - {@link DeckCardProps}
 */
export const DeckCard = ({
    title,
    description,
    difficulty,
    dueCount,
    masteredCount = 0,
    cardCount,
    showProgress = true,
    ctaLabel = "Học",
    onOpen,
    isSkeleton = false,
    showAnatomy = false,
    className,
}: DeckCardProps) => {
    if (isSkeleton) {
        return (
            <Card className={cn("rounded-3xl", className)} data-anat-part={showAnatomy ? "Card" : undefined}>
                <Card.Content className="flex h-full flex-col gap-2">
                    {/* title + difficulty chip */}
                    <div className="flex items-start justify-between gap-2">
                        <Skeleton.Typography type="body-sm" width="1/2" anatPart={showAnatomy ? "Skeleton.Typography" : undefined} />
                        <Skeleton.Chip anatPart={showAnatomy ? "Skeleton.Chip" : undefined} />
                    </div>
                    {/* description preview */}
                    <Skeleton.Typography type="body-xs" width="3/4" anatPart={showAnatomy ? "Skeleton.Typography" : undefined} />
                    {showProgress ? (
                        <div className="mt-auto flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-2">
                                <Skeleton.Typography type="body-xs" width="1/3" anatPart={showAnatomy ? "Skeleton.Typography" : undefined} />
                                <Skeleton.Typography type="body-xs" width="w-8" anatPart={showAnatomy ? "Skeleton.Typography" : undefined} />
                            </div>
                            <Skeleton.Meter anatPart={showAnatomy ? "Skeleton.Meter" : undefined} />
                        </div>
                    ) : null}
                    {/* card count + CTA */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                        <Skeleton.Typography type="body-xs" width="1/4" anatPart={showAnatomy ? "Skeleton.Typography" : undefined} />
                        <Skeleton.Button anatPart={showAnatomy ? "Skeleton.Button" : undefined} />
                    </div>
                </Card.Content>
            </Card>
        )
    }

    const showMeter = showProgress && cardCount > 0

    return (
        <Card
            className={cn("rounded-3xl", showAnatomy && "relative", className)}
            data-anat={showAnatomy ? "" : undefined}
            data-anat-part={showAnatomy ? "Card" : undefined}
        >
            {showAnatomy ? <AnatomyOverlay label="DeckCard" tier="design" href="/?path=/docs/design-learn-deckcard--docs" /> : null}
            <Card.Content className="flex h-full flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                    <Typography
                        type="body-sm"
                        weight="medium"
                        className="line-clamp-2"
                        data-anat-part={showAnatomy ? "Typography" : undefined}
                    >
                        {title}
                    </Typography>
                    <div className="flex shrink-0 items-center gap-2">
                        {showProgress && dueCount ? (
                            <StatusChip tone="warning" showAnatomy={showAnatomy}>{`${dueCount} đến hạn`}</StatusChip>
                        ) : null}
                        <DifficultyChip difficulty={difficulty} showAnatomy={showAnatomy} />
                    </div>
                </div>
                {description ? (
                    <Typography
                        type="body-xs"
                        color="muted"
                        className="line-clamp-2"
                        data-anat-part={showAnatomy ? "Typography" : undefined}
                    >
                        {description}
                    </Typography>
                ) : null}
                {/* per-viewer mastery meter (study only) — `mt-auto` pins the footer row
                    to the bottom of the card when present; without it the footer just
                    follows the description (mirrors the real card's layout). */}
                {showMeter ? (
                    <ProgressMeter
                        value={masteredCount}
                        max={cardCount}
                        label={`Đã thuộc ${masteredCount}/${cardCount}`}
                        showValue
                        className="mt-auto"
                        showAnatomy={showAnatomy}
                    />
                ) : null}
                <div className="flex items-center justify-between gap-2 pt-1">
                    <Typography type="body-xs" color="muted" data-anat-part={showAnatomy ? "Typography" : undefined}>
                        {`${cardCount} thẻ`}
                    </Typography>
                    <Button
                        variant="primary"
                        size="sm"
                        onPress={onOpen}
                        className="shrink-0"
                        anatPart={showAnatomy ? "Button" : undefined}
                    >
                        {ctaLabel}
                    </Button>
                </div>
            </Card.Content>
        </Card>
    )
}
