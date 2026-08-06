import React from "react"
import { CardsIcon as LayersIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import type { SkeletonProps } from "@/components/frames/_slot"
import { Box } from "@/components/frames/Box"
import { Split } from "@/components/frames/Split"

/** Already-localized text for {@link _FlashcardReview}; the connected `FlashcardReview` interpolates `dueCount`. */
export interface FlashcardReviewLabels {
    /** "N flashcards due today" row label. */
    due: string
    /** CTA button label, e.g. "Review 3". */
    startWithCount: string
}

/** Props for {@link _FlashcardReview} — presentational; all data resolved, no fetch/store/i18n. */
export interface FlashcardReviewProps {
    /** First load, nothing in hand → the row shimmers in place (co-located). Owned by the connected `FlashcardReview`. */
    isSkeleton?: boolean
    /**
     * Settled with nothing to nudge about — zero cards due, or the fetch failed — so
     * the widget self-hides. The two are folded together deliberately: this SECONDARY
     * widget has no error message of its own, the same self-hide contract the old
     * `AsyncContent` had whenever `errorContent`/`emptyContent` were left unpassed.
     */
    isEmpty?: boolean
    /** Navigates into the dedicated review page. */
    onStartReview?: () => void
    labels: FlashcardReviewLabels
}

/**
 * Centre-column "flashcards due today" nudge — the presentational half of
 * {@link FlashcardReview}. Renders ONE row (icon + due-count label ↔ "start
 * review" CTA), with `isSkeleton` threaded to both sides of the {@link Split}
 * so the shimmer mirrors the loaded shape (loading-and-skeleton.md).
 * Settled-and-empty (or a failed fetch) self-hides instead of showing a
 * message — this is a SECONDARY nudge, not a region with its own empty/error
 * voice. See `tiers/split.md` — the connected `FlashcardReview` owns the fetch
 * and resolves i18n.
 *
 * @param props - {@link FlashcardReviewProps}
 */
export const _FlashcardReview = ({
    isSkeleton = false,
    isEmpty = false,
    onStartReview,
    labels,
}: FlashcardReviewProps) => {
    // settled (not skeleton) + nothing to show → self-hide (no error/empty voice for this nudge)
    if (!isSkeleton && isEmpty) {
        return null
    }
    return (
        <Box principle="cell-pad" className="p-3"
            explain="Tight cell inset — not card-padding, because this sits inside a dense table or list cell rather than a card body."
            identity={{ tier: "block", component: "FlashcardReview" }}>
            <Split
                gap={3}
                isSkeleton={isSkeleton}
                start={({ isSkeleton }: SkeletonProps) => (
                    <Typography
                        size="sm"
                        weight="medium"
                        prefixIcon={LayersIcon}
                        truncate
                        text={labels.due}
                        isSkeleton={isSkeleton}
                    />
                )}
                end={({ isSkeleton }: SkeletonProps) => (
                    <Button
                        variant="primary"
                        size="sm"
                        label={labels.startWithCount}
                        onPress={onStartReview}
                        isSkeleton={isSkeleton}
                    />
                )}
            />
        </Box>
    )
}
