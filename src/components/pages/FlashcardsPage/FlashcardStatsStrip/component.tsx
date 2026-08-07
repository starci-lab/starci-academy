import React from "react"
import { FlameIcon } from "@phosphor-icons/react"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SegmentBar } from "@/components/composites/stats/SegmentBar"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import type { CallerIdentity } from "@/components/frames/_identity"

/** Below this many lifetime reviews, the retention % is noise (e.g. 100% off one
 * review), so the caption is hidden. */
export const RETENTION_MIN_REVIEWS = 5

/** This block's own identity (BLOCK-2/split.md) — handed down to whichever frame stands as the root. */
const IDENTITY: CallerIdentity = { tier: "block", component: "FlashcardStatsStrip" }

/** All display text, already localized by the connected `FlashcardStatsStrip`; a story passes i18n keys. */
export interface FlashcardStatsStripLabels {
    /** Section label above the card. */
    label: string
    /** Error-branch title (the deck-list fetch failed). */
    errorTitle: string
    /** Headline sentence — mastered/total already interpolated, the — · N%" tail already appended. */
    masteredLine: string
    /** Streak chip label, already interpolated with the day count. Only shown once `streak > 0`. */
    streakChip: string
    /** Accessible summary of the maturity bar, already interpolated. */
    barAria: string
    /** Maturity-bar segment label — cards fully mastered. */
    mastered: string
    /** Maturity-bar segment label — cards seen but not yet mastered. */
    learning: string
    /** Maturity-bar segment label — cards never reviewed. */
    new: string
    /** Retention caption, already interpolated with the percent. Shown once `totalReviewed` clears the floor. */
    retentionCaption: string
    /** Nudge shown instead of the retention caption before the learner's first review. */
    firstReviewHint: string
}

/** Props for {@link _FlashcardStatsStrip} — presentational; all data resolved, no fetch/store/i18n. */
export interface FlashcardStatsStripProps {
    /** First load, nothing in hand → the whole strip shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero cards in the course at all → the section renders nothing (matches the legacy
     * `AsyncContent` call, which passed no `emptyContent` for this branch). */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled deck-list fetch error. */
    error?: unknown
    /** Retry handler for the error branch — the connected file re-fetches the deck list. */
    onRetry?: () => void
    /** Cards fully mastered across the course's decks. */
    mastered?: number
    /** Total cards across the course's decks. */
    total?: number
    /** Cards seen but not yet mastered. */
    learning?: number
    /** Cards never reviewed. */
    newCount?: number
    /** Current daily-study streak, in days. */
    streak?: number
    /** Lifetime review count — decides which caption (if any) shows. */
    totalReviewed?: number
    labels: FlashcardStatsStripLabels
}

/**
 * The flashcards home progress block — mastery-first. Leads with how much of the
 * course's deck set the viewer has MASTERED (the quantity that actually grows):
 * a maturity bar (mastered · learning · new) over the total card count, with the
 * review streak as a momentum chip and retention as a quiet caption.
 *
 * The presentational half of {@link import("./index").FlashcardStatsStrip}. Two
 * states in the fixed order error → skeleton/content (BLOCK-8): `error` falls to
 * the shared `AsyncContentError` frame; a settled empty course renders nothing
 * (no message ever existed for it); otherwise the ONE real tree renders, with
 * `isSkeleton` threaded to every leaf so the shimmer mirrors the loaded shape
 * (loading-and-skeleton.md). `SegmentBar` carries no `isSkeleton` of its own, so
 * its slot swaps to a co-located `Skeleton.SegmentBar` mirror while shimmering.
 * See `tiers/split.md` — the connected `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link FlashcardStatsStripProps}
 */
export const _FlashcardStatsStrip = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    mastered = 0,
    total = 0,
    learning = 0,
    newCount = 0,
    streak = 0,
    totalReviewed = 0,
    labels,
}: FlashcardStatsStripProps) => {
    // error beats a stale loading flag; empty only once settled
    if (error) {
        return <AsyncContentError identity={IDENTITY} title={labels.errorTitle} onRetry={onRetry} />
    }
    if (!isSkeleton && isEmpty) {
        return null
    }

    // caption: retention once it's meaningful, else a first-review nudge, else nothing. With the
    // isSkeleton defaults above (totalReviewed=0, mastered=0) this resolves to the nudge, matching
    // the loaded first-visit shape so the shimmer mirrors it (loading-and-skeleton.md §3).
    const showRetention = totalReviewed >= RETENTION_MIN_REVIEWS
    const showFirstReviewHint = !showRetention && mastered === 0

    return (
        <LabeledCard identity={IDENTITY} label={labels.label}>
            <StackV gap={3} principle="sibling-stack" isSkeleton={isSkeleton}
                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                items={[
                    () => (
                        <StackH gap={4} principle="content-row"
                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                            justify="between" isSkeleton={isSkeleton} items={[
                                () => (
                                    <Typography
                                        size="sm"
                                        isSkeleton={isSkeleton}
                                        truncate
                                        classNames={["min-w-0"]}
                                        text={labels.masteredLine}
                                    />
                                ),
                                ...(streak > 0 ? [() => (
                                    <Chip
                                        isSkeleton={isSkeleton}
                                        tone="warning"
                                        icon={FlameIcon}
                                        text={labels.streakChip}
                                        classNames={["shrink-0"]}
                                    />
                                )] : []),
                            ]} />
                    ),
                    // maturity bar: mastered · learning · new, filling toward total. No `isSkeleton` of its
                    // own, so the mirror sits right here (co-located), not in a parallel tree.
                    () => (isSkeleton
                        ? <Skeleton.SegmentBar />
                        : (
                            <SegmentBar
                                max={total}
                                ariaLabel={labels.barAria}
                                segments={[
                                    { key: "mastered", label: labels.mastered, value: mastered, color: "var(--success)" },
                                    { key: "learning", label: labels.learning, value: learning, color: "var(--warning)" },
                                    // light track tone (same as a ProgressBar's empty track) — "untouched",
                                    // NOT a heavy grey slice
                                    { key: "new", label: labels.new, value: newCount, color: "var(--default)" },
                                ]}
                            />
                        )),
                    // retention only once it's meaningful; else a first-review nudge
                    ...(showRetention || showFirstReviewHint ? [() => (
                        <Typography
                            size="xs"
                            color="muted"
                            isSkeleton={isSkeleton}
                            text={showRetention ? labels.retentionCaption : labels.firstReviewHint}
                        />
                    )] : []),
                ]} />
        </LabeledCard>
    )
}
