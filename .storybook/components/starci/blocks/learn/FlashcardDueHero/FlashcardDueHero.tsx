import React from "react"
import { ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { FeedbackEmpty } from "@sb-components/composites/feedback/Feedback/Feedback"
import { ContinueCardHero } from "@sb-components/starci/blocks/learn/ContinueCard/ContinueCard"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `FlashcardDueHero`: the flashcard landing's single focal card — how
 * many cards are due today across every enrolled course, and the ONE primary
 * action that follows from that number. Maps to the real `DueReviewHero`.
 *
 * ⭐ REUSE-FIRST, the reason this run exists at all (file header of
 * `ContentModeNav` names the sibling mistake this is written against): the
 * job here is "point a domain hero at existing shapes", not "draw a stat
 * card + a CTA row from scratch". Three composites already draw everything
 * this block needs — `SurfaceCard`'s `label` slot for the section frame,
 * `ContinueCardHero` for "resume something already in flight", and
 * `FeedbackEmpty` for "there is nothing here" — so this file contains no new
 * card chrome, no new empty-state layout, no hand-rolled `flex gap-*`.
 *
 * ⚠️ `FeedbackEmpty` WASN'T in this task's compose-from list but IS the
 * canonical composite the same block family already reaches for — see
 * `ContinueCardHero.{Progress,NoProgress}.stories.tsx`'s `LoadError` leaf,
 * which drops `FeedbackEmpty` straight inside a `SurfaceCard`. "Nothing due"
 * is that exact shape (frame stays, body swaps to a message), so building a
 * second hand-rolled empty state next to an existing one would be the same
 * mistake this run exists to correct, just aimed at a different composite.
 *
 * 📐 THREE LEAVES BY STRUCTURE (§14d.2), not one leaf with two booleans:
 *
 *   1. **No resume in progress** — `SurfaceCard` (labelled "Ôn tập hôm nay")
 *      ⊃ the due-count text cluster + a primary `Button` that starts a fresh
 *      batch.
 *   2. **Resume in progress** — the due summary steps ASIDE and
 *      `ContinueCardHero` becomes the WHOLE card. This mirrors
 *      `ContinueLearningBase` (`components/starci/blocks/learn/ContinueLearning`):
 *      once a batch is paused mid-way, "how many are due overall" is
 *      redundant next to "finish what you started" — the reader is already
 *      inside the queue. Nesting `ContinueCardHero` (which renders its OWN
 *      `isHighlight` `SurfaceCard`) *inside* this block's `SurfaceCard`
 *      would double the card chrome for no reason; swapping the whole shape
 *      is what `ContinueLearningBase` already does for the identical reason.
 *   3. **Nothing due** — the due-count cluster and the Start button both
 *      disappear; `SurfaceCard`'s frame stays (so the section never
 *      vanishes), and `FeedbackEmpty` replaces the body with a "you're
 *      caught up" message. No `action` — there is nothing left to start.
 *
 * `isSkeleton` is a STATE inside leaf 1, not a fourth leaf: before the load
 * resolves the caller does not yet know whether a resume batch exists or
 * whether today is empty, so the block always shimmers the "No resume in
 * progress" shape (same call `ContinueCardHero.NoProgress`'s own `Skeleton`
 * story makes for the identical reason) and swaps once real data lands.
 *
 * ⭐ THE HEADLINE SENTENCE IS BUILT HERE (§14d.1). The caller hands over
 * three numbers (`dueCount`/`dueReviewCount`/`newCount`); this block decides
 * the copy, the split, and which of the two sub-counts get news value. A
 * zero sub-count is dropped from the breakdown line rather than printed as
 * "0 thẻ mới" — same "a zero is not news" rule `ContentModeNav` applies to
 * its own tab counts.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** `FeedbackEmpty` takes its icon as a COMPONENT ref and forces `size-8` itself (§4/§5) — `weight="duotone"` can't ride along on a bare import, so it's pinned here. */
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** The section label every non-resume leaf shares — a section always answers "what is this card". */
const SECTION_LABEL = "Ôn tập hôm nay"

/**
 * Builds the "N cần ôn lại · M thẻ mới" line. A sub-count of zero carries no
 * news (§ rule shared with `ContentModeNav`'s tab counts), so it is dropped
 * instead of printed.
 */
const buildBreakdown = (dueReviewCount: number, newCount: number): string =>
    [
        dueReviewCount > 0 ? `${dueReviewCount} cần ôn lại` : null,
        newCount > 0 ? `${newCount} thẻ mới` : null,
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
    showAnatomy = false,
    anatPart,
}: FlashcardDueHeroProps) => {
    // LEAF 2 — a paused batch always wins: finishing it is the one thing left
    // to do, so the due-count cluster steps aside entirely rather than
    // competing with it for the reader's attention.
    if (resume && !isSkeleton) {
        return (
            <ContinueCardHero
                anatPart={anatPart ?? (showAnatomy ? "ContinueCardHero" : undefined)}
                title="Tiếp tục đợt ôn dở"
                meta={[`${resume.current}/${resume.total} thẻ đã ôn trong đợt này`]}
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
                anatPart={anatPart ?? (showAnatomy ? "SurfaceCard" : undefined)}
                showAnatomy={showAnatomy}
            >
                <FeedbackEmpty
                    anatPart={showAnatomy ? "FeedbackEmpty" : undefined}
                    icon={CheckCircleDuotone}
                    title="Đã ôn hết thẻ đến hạn hôm nay!"
                    description="Quay lại vào ngày mai để giữ chuỗi ôn tập của bạn."
                />
            </SurfaceCard>
        )
    }

    // LEAF 1 (also the isSkeleton mirror) — the due-count cluster + Start CTA.
    const breakdown = buildBreakdown(dueReviewCount, newCount)
    return (
        <SurfaceCard
            label={SECTION_LABEL}
            anatPart={anatPart ?? (showAnatomy ? "SurfaceCard" : undefined)}
            isSkeleton={isSkeleton}
            showAnatomy={showAnatomy}
        >
            <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                <StackV gap="tight" anatPart={showAnatomy ? "StackV" : undefined}>
                    <Typography
                        size="h2"
                        weight="bold"
                        tabularNums
                        isSkeleton={isSkeleton}
                        anatPart={showAnatomy ? "Typography" : undefined}
                        text={String(dueCount)}
                    />
                    <Typography
                        size="sm"
                        color="muted"
                        isSkeleton={isSkeleton}
                        anatPart={showAnatomy ? "Typography" : undefined}
                        text="thẻ đến hạn hôm nay"
                    />
                    {breakdown ? (
                        <Typography
                            size="xs"
                            color="muted"
                            isSkeleton={isSkeleton}
                            anatPart={showAnatomy ? "Typography" : undefined}
                            text={breakdown}
                        />
                    ) : null}
                </StackV>
                <Button
                    variant="primary"
                    label="Bắt đầu ôn tập"
                    suffixIcon={ArrowRightIcon}
                    iconSlide
                    onPress={onStart}
                    isPending={isStarting}
                    isSkeleton={isSkeleton}
                    anatPart={showAnatomy ? "Button" : undefined}
                    classNames={["w-fit"]}
                />
            </StackV>
        </SurfaceCard>
    )
}

export { FlashcardDueHero }
