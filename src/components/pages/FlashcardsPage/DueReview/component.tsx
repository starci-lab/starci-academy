import React from "react"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip, type ChipTone } from "@/components/atoms/chips/Chip"
import { Spinner } from "@/components/atoms/display/Spinner"
import { Typography } from "@/components/atoms/text/Typography"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Box } from "@/components/frames/Box"
import { Cluster } from "@/components/frames/Cluster"
import { Container } from "@/components/frames/Container"
import { StackH, StackV } from "@/components/frames/Stack"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { WorkSessionHeader } from "@/components/blocks/navigation/WorkSessionHeader"
import { FlipCard } from "@/components/blocks/cards/FlipCard"
import { RatingBar, type RatingOption } from "@/components/blocks/buttons/RatingBar"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { QueryMyDueFlashcardData } from "@/modules/api/graphql/queries/types/my-due-flashcards"

/** HeroUI Chip color per quiz seniority level (mirrors `FlashcardReviewer`). */
const LEVEL_COLOR: Record<string, ChipTone> = {
    junior: "success",
    middle: "warning",
    senior: "danger",
    staff: "accent",
}

/** How many segments the header's progress meter mirrors while shimmering. */
const HEADER_SKELETON_SEGMENT_COUNT = 6

/** How many placeholder chips the level/tag row mirrors while shimmering. */
const SKELETON_CHIP_COUNT = 2

/**
 * A card as rendered in this session — the live "due" shape (carries
 * `nextIntervals`, used for the RatingBar's day-preview hints) OR a card
 * resolved status-agnostically by id during resume (no `nextIntervals` — see
 * `resumeCardsByIdSwr` in the connected `DueReview`). `RatingBar`'s `hint` is
 * already optional, so a card without `nextIntervals` just renders without
 * the preview.
 */
export type DueReviewCard = Omit<QueryMyDueFlashcardData, "nextIntervals"> & {
    nextIntervals?: QueryMyDueFlashcardData["nextIntervals"]
}

/** All display text, already localized by the connected `DueReview`; a story passes i18n keys. */
export interface DueReviewLabels {
    exit: string
    modeTitle: string
    /** Already interpolated for whichever branch is currently rendering (active card OR the finished batch). */
    counter: string
    finish: string
    savingLabel: string
    errorTitle: string
    emptyTitle: string
    emptyDescription: string
    questionLabel: string
    answerLabel: string
    rateHint: string
    rateAria: string
    showAnswer: string
    previous: string
    next: string
}

/** Props for {@link _DueReview} — presentational; all data resolved, no fetch/store/i18n. */
export interface DueReviewProps extends WithClassNames<undefined> {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with an empty due queue → the empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler for the error branch. */
    onRetry?: () => void
    /** Leave the session and return to the flashcards home. */
    onBack: () => void

    /** The batch just finished (explicit "Finish" or ran past the last card) — renders the transient "saving" hand-off instead of the reviewer. */
    done: boolean

    /** The card currently shown. Absent only while `isSkeleton`/`done`. */
    card?: DueReviewCard
    /** Already-resolved label for `card.level` (e.g. "Junior") — undefined when the card has no level. */
    levelLabel?: string
    /** Whether the current card's answer is revealed. */
    revealed: boolean
    /** Reveal the current card's answer. */
    onReveal: () => void
    /** True while a grade is in flight — disables the rating bar. */
    reviewing: boolean
    /** SM-2 grade options for the current card, already localized. */
    ratingOptions: Array<RatingOption>
    /** Grade the current card. */
    onRate: (grade: number) => void

    /** 0-indexed position of the card currently viewed. */
    currentIndex: number
    /** Size of the batch being reviewed. */
    totalCount: number
    /** 0-indexed positions graded this session — drives the header's per-segment green. */
    gradedIndexes: ReadonlyArray<number>
    isFirst: boolean
    isLast: boolean
    /** Free-nav jump to any step. */
    onSegmentClick: (position: number) => void
    /** Step back to re-see an earlier card (no re-grade). */
    onPrev: () => void
    /** Step forward without grading. */
    onNext: () => void
    /** End the session now, regardless of position. */
    onFinish: () => void

    labels: DueReviewLabels
}

/**
 * The spaced-repetition (SM-2) review session over the viewer's due cards, drawn
 * across every enrolled course — the presentational half of {@link DueReview}.
 * Four states in the fixed order error → skeleton → empty → content: `error`
 * falls to the shared `AsyncContentError` frame, `isEmpty` to `AsyncContentEmpty`,
 * and otherwise the ONE session tree renders with `isSkeleton` threaded to every
 * leaf that supports it. `WorkSessionHeader`/`FlipCard`/`RatingBar` carry no
 * `isSkeleton` of their own, so their loading state is mirrored minimally with
 * `Skeleton.*`/skeleton-mode atoms right where each sits (loading-and-skeleton.md
 * §1). See `tiers/split.md` — the connected `index.tsx` owns the fetch, the
 * session/resume state machine, and all i18n.
 *
 * @param props - {@link DueReviewProps}
 */
export const _DueReview = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    onBack,
    done,
    card,
    levelLabel,
    revealed,
    onReveal,
    reviewing,
    ratingOptions,
    onRate,
    currentIndex,
    totalCount,
    gradedIndexes,
    isFirst,
    isLast,
    onSegmentClick,
    onPrev,
    onNext,
    onFinish,
    labels,
}: DueReviewProps) => {
    // error beats a stale skeleton flag; empty only once settled (loading-and-skeleton.md §1)
    if (error) {
        return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} />
    }
    if (!isSkeleton && isEmpty) {
        return <AsyncContentEmpty title={labels.emptyTitle} description={labels.emptyDescription} />
    }

    // ── header band — WorkSessionHeader has no `isSkeleton` of its own, so the
    // loading state is a minimal inline mirror, right at this same spot (NOT a
    // separately authored parallel tree) — loading-and-skeleton.md §1.
    const header = isSkeleton ? (
        <Box className="sticky top-16 z-10 border-b border-default bg-surface">
            <Box className="px-4 py-2 @app-sm:px-6">
                <StackH gap={4} align="center" divider classNames={["w-full"]} items={[
                    () => <Skeleton className="h-4 w-16 rounded" />,
                    () => <Skeleton className="h-4 w-24 rounded" />,
                    () => <Skeleton className="h-4 w-20 rounded" />,
                ]} />
            </Box>
            {/* an even-width meter, not a wrapping chip row — `Cluster` wraps each item in an
                unstyled cell that can't distribute `flex-1` evenly, so this stays a raw flex row
                (Box escape hatch, `frames/Box`'s own documented case: "a raw skin box a real
                frame can't reach"). */}
            <Box className="flex gap-1 px-4 pb-2 @app-sm:px-6">
                {Array.from({ length: HEADER_SKELETON_SEGMENT_COUNT }, (_unused, index) => (
                    <Skeleton key={index} className="h-1 flex-1 rounded-full" />
                ))}
            </Box>
        </Box>
    ) : done ? (
        <WorkSessionHeader
            backLabel={labels.exit}
            onBack={onBack}
            title={labels.modeTitle}
            counter={labels.counter}
            current={totalCount}
            total={totalCount}
        />
    ) : (
        // shared header: WorkSessionHeader (current card's OWN deck as identity +
        // counter + progress segments), same shell as FlashcardReviewer/QuizSession
        // (teacher, 2026-07-11: "sync the UI, both should render the navbar" + "render
        // which deck ... whether it's currently due or not"). Identity changes PER CARD here (a due batch
        // spans multiple decks). `title` disambiguates this mode from FlashcardReviewer/QuizSession
        // sharing the exact same shell (teacher, 2026-07-12: "these two pages are identical"). No confirm
        // modal on back (teacher, 2026-07-09: "why isn't there an early-finish, go-back option"): each
        // grade is saved immediately via `reviewFlashcard`, AND the batch/position itself is persisted
        // too — leaving mid-run loses nothing, resumes exactly where it left off.
        <WorkSessionHeader
            backLabel={labels.exit}
            onBack={onBack}
            title={labels.modeTitle}
            identity={card ? { name: card.deckTitle } : undefined}
            counter={labels.counter}
            // `current` = the VIEWED card (→ accent/pink follows what you're looking at); the
            // green/done state is per-card via `doneSet` so a card graded out of order (free-nav
            // jump-ahead → grade → jump-back) still reads green regardless of the cursor.
            current={currentIndex}
            total={totalCount}
            doneSet={gradedIndexes}
            onSegmentClick={onSegmentClick}
            onFinish={onFinish}
            finishLabel={labels.finish}
        />
    )

    // ── level/tag chip row under the question — placeholder pair while shimmering
    // (SAME row shape, fixed count), the real per-card chips otherwise.
    const chipItems = isSkeleton
        ? Array.from({ length: SKELETON_CHIP_COUNT }, () => () => <Chip isSkeleton tone="default" />)
        : card && (card.level || card.tags.length > 0)
            ? [
                ...(card.level ? [() => <Chip tone={LEVEL_COLOR[card.level as string] ?? "default"} text={levelLabel} />] : []),
                ...card.tags.map((tag) => () => <Chip tone="default" text={tag} />),
            ]
            : []

    // ── body — centered column under the header
    const body = isSkeleton ? (
        <Container size="md" padding={1} body={() => (
            <StackV gap={6} items={[
                () => <Cluster gap={3} items={chipItems} />,
                // the flashcard — FlipCard's LabeledCard (label OUTSIDE + Card)
                () => (
                    <StackV gap={4} items={[
                        () => <Typography isSkeleton size="xs" classNames={["w-1/4"]} />,
                        () => (
                            <SurfaceCard isSkeleton body={() => (
                                <StackV gap={4} items={[
                                    () => <Typography isSkeleton size="base" classNames={["w-3/4"]} />,
                                    () => <Typography isSkeleton size="base" classNames={["w-2/3"]} />,
                                ]} />
                            )} />
                        ),
                    ]} />
                ),
                // reveal control flanked by prev/next carets
                () => (
                    <Cluster gap={3} items={[
                        () => <Button isSkeleton size="sm" />,
                        () => <Button isSkeleton isIconOnly size="sm" />,
                        () => <Button isSkeleton isIconOnly size="sm" />,
                    ]} />
                ),
            ]} />
        )} />
    ) : done ? (
        // transient hand-off only — the connected file's "finish" effect
        // `router.replace`s into the dedicated `.../result` route once the completion
        // mutation resolves, so this branch never has a real end state to render — just
        // the "saving" interim until that navigation lands. KEEP the same
        // `WorkSessionHeader` chrome the just-finished ACTIVE phase used.
        <Container size="md" padding={1} body={() => (
            <StackV gap={4} align="center" classNames={["w-full"]} items={[
                () => <Spinner size="lg" />,
                () => <Typography size="sm" color="muted" text={labels.savingLabel} />,
            ]} />
        )} />
    ) : (
        <Container size="md" padding={1} body={() => (
            <StackV gap={6} items={[
                () => (
                    // the flip card: prompt → answer; the level/tag chips ride under the
                    // QUESTION via `belowFront` (teacher, 2026-07-13: "chips gap-3 below the
                    // question" + "due should render the chip label the same as the deck side")
                    // — same per-card level+tag chips as `FlashcardReviewer`.
                    <FlipCard
                        revealed={revealed}
                        questionLabel={labels.questionLabel}
                        answerLabel={labels.answerLabel}
                        front={() => <MarkdownContent plain markdown={card?.front ?? ""} />}
                        belowFront={chipItems.length > 0 ? () => <Cluster gap={3} items={chipItems} /> : undefined}
                        back={() => <MarkdownContent plain markdown={card?.back ?? ""} arcSections />}
                    />
                ),
                // reveal first, then grade recall (which advances)
                () => (
                    revealed ? (
                        <StackV gap={4} items={[
                            () => <Typography size="sm" weight="medium" text={labels.rateHint} />,
                            () => <RatingBar options={ratingOptions} onRate={onRate} ariaLabel={labels.rateAria} isPending={reviewing} />,
                        ]} />
                    ) : (
                        // "Show answer" (primary) · "Next"/"Previous" ICON-ONLY (caret, no text)
                        // — mirrors `FlashcardReviewer` exactly.
                        <Cluster gap={3} items={[
                            () => <Button variant="primary" size="sm" label={labels.showAnswer} onPress={onReveal} />,
                            () => (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    isIconOnly
                                    prefixIcon={CaretLeftIcon}
                                    ariaLabel={labels.previous}
                                    isDisabled={isFirst}
                                    onPress={onPrev}
                                />
                            ),
                            () => (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    isIconOnly
                                    prefixIcon={CaretRightIcon}
                                    ariaLabel={labels.next}
                                    isDisabled={isLast}
                                    onPress={onNext}
                                />
                            ),
                        ]} />
                    )
                ),
            ]} />
        )} />
    )

    return (
        <StackV gap={1} identity={{ tier: "block", component: "DueReview" }} items={[
            () => header,
            () => <Box className="px-4 pb-6 pt-10 @app-sm:px-6">{body}</Box>,
        ]} />
    )
}
