import React from "react"
import { ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { ContinueCardHero } from "@sb-components/starci/blocks/learn/ContinueCard/ContinueCard"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `FlashcardDueHero` — the flashcard landing's single focal card: how many cards
 * are due today with the primary Start CTA, or a resume card when a batch was
 * left mid-way. Three leaves: no resume (due count + Start), resume in progress
 * (the card becomes `ContinueCardHero`), and nothing due (empty message).
 * `isSkeleton` stays a state of the first leaf — before data lands the block
 * shimmers the base shape.
 */

/** `EmptyState` takes its icon as a COMPONENT ref and forces `size-8` itself (§4/§5) — `weight="duotone"` can't ride along on a bare import, so it's pinned here. */
const CheckCircleDuotone = (props: React.SVGProps<SVGSVGElement>) => <CheckCircleIcon {...props} weight="duotone" />

/** The paused due-batch the reader can pick back up. */
export interface FlashcardDueHeroResume {
    /** Cards already answered in the paused batch. */
    current: number
    /** Total cards in the paused batch. */
    total: number
    /** Fired when the reader resumes the paused batch. */
    onPress: () => void
}

/** Props for {@link FlashcardDueHero}. */
export interface FlashcardDueHeroProps {
    /** Total cards due today across every enrolled course. */
    dueCount: number
    /** Of `dueCount`, cards coming back for another review. */
    dueReviewCount: number
    /** Of `dueCount`, cards being seen for the first time. */
    newCount: number
    /**
     * A due batch the reader started earlier and never finished. Present →
     * the card becomes `ContinueCardHero`; the "start fresh" CTA never shows
     * alongside an unfinished batch.
     */
    resume?: FlashcardDueHeroResume
    /** Fired when the reader starts a fresh review batch. */
    onStart: () => void
    /** `true` → the Start button shows its busy state while the batch is being prepared. */
    isStarting?: boolean
    /** `true` → the "No resume in progress" shape renders with every text/button part shimmering. */
    isSkeleton?: boolean
}

/** The section label every non-resume leaf shares — a section always answers "what is this card". */
const SECTION_LABEL = "Review today"

/**
 * Builds the "N due for review · M new cards" line. A sub-count of zero carries no
 * news (§ rule shared with `ContentModeNav`'s tab counts), so it is dropped
 * instead of printed.
 */
const buildBreakdown = (dueReviewCount: number, newCount: number): string =>
    [
        dueReviewCount > 0 ? `${dueReviewCount} due for review` : null,
        newCount > 0 ? `${newCount} new cards` : null,
    ]
        .filter((part): part is string => part != null)
        .join(" · ")

/**
 * The flashcard landing's due-review focal card. See the file header for why
 * each of the three leaves is its own shape rather than a shared one with
 * flags.
 *
 * @param props - {@link FlashcardDueHeroProps}
 */
const FlashcardDueHero = ({
    dueCount,
    dueReviewCount,
    newCount,
    resume,
    onStart,
    isStarting = false,
    isSkeleton = false,
}: FlashcardDueHeroProps) => {
    // LEAF 2 — a paused batch always wins: finishing it is the one thing left
    // to do, so the due-count cluster steps aside entirely rather than
    // competing with it for the reader's attention.
    if (resume && !isSkeleton) {
        return (
            <ContinueCardHero

                title="Continue your unfinished review"
                meta={[`${resume.current}/${resume.total} cards reviewed in this batch`]}
                value={resume.current}
                max={resume.total}
                onPress={resume.onPress}
            />
        )
    }

    // LEAF 3 — nothing due: the frame stays (a section never disappears just
    // because it's empty today), the body becomes a caught-up message with
    // no action — there is nothing left to start.
    if (dueCount === 0 && !isSkeleton) {
        return (
            <SurfaceCard
                label={SECTION_LABEL}


                body={() => (
                    <EmptyState

                        icon={CheckCircleDuotone}
                        title="You've reviewed every card due today!"
                        description="Come back tomorrow to keep your review streak going."
                    />
                )}
            />
        )
    }

    // LEAF 1 (also the isSkeleton mirror) — the due-count cluster + Start CTA.
    const breakdown = buildBreakdown(dueReviewCount, newCount)

    const dueCountLines = (
        <>
            <Typography
                size="h2"
                weight="bold"
                tabularNums
                isSkeleton={isSkeleton}

                text={String(dueCount)}
            />
            <Typography
                size="sm"
                color="muted"
                isSkeleton={isSkeleton}

                text="cards due today"
            />
            {breakdown ? (
                <Typography
                    size="xs"
                    color="muted"
                    isSkeleton={isSkeleton}

                    text={breakdown}
                />
            ) : null}
        </>
    )

    const heroBody = (
        <>
            <StackV gap={2} items={[() => dueCountLines]} />
            <Button
                variant="primary"
                label="Start reviewing"
                suffixIcon={ArrowRightIcon}
                iconSlide
                onPress={onStart}
                isPending={isStarting}
                isSkeleton={isSkeleton}

                classNames={["w-fit"]}
            />
        </>
    )

    return (
        <SurfaceCard
            label={SECTION_LABEL}

            isSkeleton={isSkeleton}

            body={() => <StackV gap={4} items={[() => heroBody]} />}
        />
    )
}

export { FlashcardDueHero }
