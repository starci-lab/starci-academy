"use client"

import React, { useState } from "react"
import { Button, Chip, Label, Spinner, Typography, cn } from "@heroui/react"
import { CaretLeftIcon, CaretRightIcon, LockIcon } from "@phosphor-icons/react"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { WorkSessionHeader } from "@/components/blocks/navigation/WorkSessionHeader"
import { ConfirmDialog } from "@/components/composites/feedback/ConfirmDialog"
import { FlipCard } from "@/components/blocks/cards/FlipCard"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { RatingBar, type RatingOption } from "@/components/blocks/buttons/RatingBar"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { LEVEL_COLOR } from "../constants"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { type FlashcardCardEntity } from "@/modules/types/entities/flashcard-card"

/** Every translated string {@link _FlashcardReviewer} needs — resolved by the connected `FlashcardReviewer`. */
export interface FlashcardReviewerLabels {
    /** `WorkSessionHeader`'s back-link label, both branches. */
    exit: string
    /** `WorkSessionHeader`'s mode title, both branches. */
    title: string
    /** Already-interpolated "card N/total" — the connected file resolves the pair per `done`. */
    counter: string
    /** Under the spinner in the transient "saving" hand-off (`done` branch). */
    savingLabel: string
    leaveTitle: string
    finishEarlyTitle: string
    leaveConfirm: string
    finishEarlyConfirm: string
    leaveCta: string
    finishEarlyCta: string
    stayIn: string
    questionLabel: string
    answerLabel: string
    premiumLockedTitle: string
    premiumLockedHint: string
    noAnswer: string
    premiumCta: string
    rateHint: string
    rateAria: string
    showAnswer: string
    previous: string
    next: string
    finishEarly: string
    /** Shared by both the empty and the error branch (mirrors the original, which used one key for both). */
    emptyTitle: string
}

/** Props for {@link _FlashcardReviewer} — presentational; every value already resolved by `index.tsx`. */
export interface FlashcardReviewerProps extends WithClassNames<undefined> {
    /** First load, nothing in hand yet (deck query + session resolve both settled) — the whole tree shimmers in place. */
    isSkeleton?: boolean
    /** Settled, sessioned, and the resolved card list is empty. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). */
    error?: unknown
    /** Retries the deck query. */
    onRetry?: () => void
    /** Every translated string this tree draws. */
    labels: FlashcardReviewerLabels

    /** Deck title, once the deck query resolves. */
    deckTitle?: string
    /**
     * Past the last card (or explicitly finished) — the transient "saving" hand-off
     * before the completion mutation resolves and the caller navigates to the result route.
     */
    done: boolean

    /** 0-indexed position of the card currently shown. */
    currentIndex: number
    /** Total cards in this review run. */
    totalCards: number
    /** The card currently shown; absent only transiently (e.g. `done`). */
    card?: FlashcardCardEntity
    /** Translated label for `card.level`, resolved by the connected file (dynamic i18n key). */
    cardLevelLabel?: string
    /** A premium card withheld from a non-enrolled viewer. */
    isLocked: boolean
    isFirst: boolean
    isLast: boolean
    /** Whether the answer side is currently shown. */
    revealed: boolean
    /** True while a grade mutation is in flight — disables the rating bar. */
    reviewing: boolean
    /** Positions already graded (order-independent) — drives the header's per-segment green. */
    gradedIndexes: ReadonlyArray<number>
    /** SM-2 grade options, already localized with their next-interval preview. */
    ratingOptions: Array<RatingOption>

    /** Returns to the study overview. */
    onBack?: () => void
    /** Reveals the answer side of the current card. */
    onReveal: () => void
    /** Grades the current card and advances. */
    onRate: (grade: number) => void
    onPrev: () => void
    onNext: () => void
    /** Free-navigation: jump straight to any step from the progress-segment bar. */
    onSegmentClick: (position: number) => void
    /** Ends the run now (past the confirm dialog). */
    onFinishEarly: () => void
    /** Opens the course page so the viewer can enrol to unlock premium cards. */
    onUnlock: () => void
}

/**
 * Spaced-repetition reviewer over one deck — the presentational half of
 * {@link import("./index").FlashcardReviewer}. Four states in the fixed order
 * error → skeleton → empty → content (`loading-and-skeleton.md`): `error` falls to
 * the shared `AsyncContentError` frame, `isEmpty` to `AsyncContentEmpty`, otherwise
 * the ONE real tree renders with `isSkeleton` threaded through. None of this tree's
 * leaves (`WorkSessionHeader`, `FlipCard`, `SectionCard`, `RatingBar`, `ConfirmDialog`,
 * `MarkdownContent`) take an `isSkeleton` prop of their own, so the shimmer is mirrored
 * INLINE with `Skeleton.*` at the exact spot those leaves would otherwise sit — still
 * co-located (same wrapper, same position), not a second parallel tree. See
 * `tiers/split.md` — the connected `index.tsx` owns the fetch, the session-resolve
 * effects, and every i18n resolution.
 *
 * @param props - {@link FlashcardReviewerProps}
 */
export const _FlashcardReviewer = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    labels,
    deckTitle,
    done,
    currentIndex,
    totalCards,
    card,
    cardLevelLabel,
    isLocked,
    isFirst,
    isLast,
    revealed,
    reviewing,
    gradedIndexes,
    ratingOptions,
    onBack,
    onReveal,
    onRate,
    onPrev,
    onNext,
    onSegmentClick,
    onFinishEarly,
    onUnlock,
    className,
}: FlashcardReviewerProps) => {
    // "leave" (Exit) · "endEarly" (Finish early) — which confirm dialog is open, if any.
    // Pure UI toggle, not fetched/persisted data, so it lives here rather than in the
    // connected file (loading-and-skeleton.md's test: renders with no server/store/session).
    const [confirmAction, setConfirmAction] = useState<null | "leave" | "endEarly">(null)

    // error beats a stale loading flag; empty only once settled (loading-and-skeleton.md §1/§6)
    if (error) {
        return <AsyncContentError title={labels.emptyTitle} onRetry={onRetry} />
    }
    if (!isSkeleton && isEmpty) {
        return <AsyncContentEmpty title={labels.emptyTitle} />
    }

    const identity = deckTitle ? { name: deckTitle } : undefined

    return (
        <div className={cn("flex w-full flex-col", className)}>
            {isSkeleton ? (
                // Mirrors the real shape top-to-bottom: the WorkSessionHeader band
                // (back-link · identity · counter · progress segments), then the
                // max-w-3xl body — level/tag chips, the FlipCard face, and the
                // prev/show-answer controls. Inline, not a second file — the leaves
                // below carry no `isSkeleton` of their own (missingSkeletonSupport).
                <>
                    <div className="border-b border-default bg-surface">
                        <div className="flex items-center gap-3 px-4 py-2 @app-sm:px-6">
                            <Skeleton className="h-4 w-16 rounded" />
                            <span className="hidden h-5 w-px shrink-0 bg-default @app-sm:block" aria-hidden />
                            <Skeleton className="hidden h-4 w-24 rounded @app-sm:block" />
                            <span className="hidden h-5 w-px shrink-0 bg-default @app-sm:block" aria-hidden />
                            <Skeleton className="h-4 w-20 rounded" />
                        </div>
                        <div className="flex gap-1 px-4 pb-2 @app-sm:px-6">
                            {Array.from({ length: 6 }, (_unused, index) => (
                                <Skeleton key={index} className="h-1 flex-1 rounded-full" />
                            ))}
                        </div>
                    </div>
                    <div className="px-4 pb-6 pt-10 @app-sm:px-6">
                        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                            <div className="flex flex-wrap items-center gap-2">
                                <Skeleton.Chip />
                                <Skeleton.Chip />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Skeleton.Typography type="body-xs" width="1/4" />
                                <div className="flex flex-col gap-3 rounded-3xl bg-surface p-6 shadow-surface">
                                    <Skeleton.Typography type="body" width="3/4" />
                                    <Skeleton.Typography type="body" width="2/3" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <Skeleton.Button />
                                <Skeleton.Button />
                            </div>
                        </div>
                    </div>
                </>
            ) : done ? (
                // transient hand-off only — the connected file's "finish" effect
                // navigates to the dedicated `.../result` route once the completion
                // mutation resolves; this never has a real end state to render, just
                // the "saving" interim. KEEPS the active phase's own header chrome.
                <>
                    <WorkSessionHeader
                        backLabel={labels.exit}
                        onBack={onBack ?? (() => {})}
                        title={labels.title}
                        identity={identity}
                        counter={labels.counter}
                        current={totalCards}
                        total={totalCards}
                    />
                    <div className="px-4 pb-6 pt-10 @app-sm:px-6">
                        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 py-10">
                            <Spinner size="lg" />
                            <Typography type="body-sm" color="muted">
                                {labels.savingLabel}
                            </Typography>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* shared header: back-link + deck identity + card counter +
                        level/tag meta chips inline + progress segments. */}
                    <WorkSessionHeader
                        backLabel={labels.exit}
                        onBack={() => setConfirmAction("leave")}
                        title={labels.title}
                        identity={identity}
                        counter={labels.counter}
                        current={currentIndex}
                        total={totalCards}
                        doneSet={gradedIndexes}
                        onSegmentClick={onSegmentClick}
                        onFinish={() => setConfirmAction("endEarly")}
                        finishLabel={labels.finishEarly}
                    />
                    <ConfirmDialog
                        isOpen={confirmAction !== null}
                        onOpenChange={(open) => { if (!open) { setConfirmAction(null) } }}
                        title={confirmAction === "leave" ? labels.leaveTitle : labels.finishEarlyTitle}
                        description={confirmAction === "leave" ? labels.leaveConfirm : labels.finishEarlyConfirm}
                        confirmLabel={confirmAction === "leave" ? labels.leaveCta : labels.finishEarlyCta}
                        cancelLabel={labels.stayIn}
                        onConfirm={() => {
                            const action = confirmAction
                            setConfirmAction(null)
                            if (action === "leave") {
                                onBack?.()
                            } else if (action === "endEarly") {
                                onFinishEarly()
                            }
                        }}
                    />

                    <div className="px-4 pb-6 pt-10 @app-sm:px-6">
                        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                            {/* the flip card: question → answer (+ optional depth); the
                                level/tag chips ride under the QUESTION via `belowFront`. */}
                            <FlipCard
                                revealed={revealed}
                                questionLabel={labels.questionLabel}
                                answerLabel={labels.answerLabel}
                                front={() => <MarkdownContent plain markdown={card?.question ?? ""} />}
                                belowFront={card && (card.level || (card.tags?.length ?? 0) > 0) ? () => (
                                    <div className="flex flex-wrap items-center gap-2">
                                        {card.level ? (
                                            <Chip size="sm" variant="soft" color={LEVEL_COLOR[card.level] ?? "default"}>
                                                {cardLevelLabel}
                                            </Chip>
                                        ) : null}
                                        {card.tags?.map((tag) => (
                                            <Chip key={tag} size="sm" variant="soft" color="default">
                                                {tag}
                                            </Chip>
                                        ))}
                                    </div>
                                ) : undefined}
                                back={() => (
                                    <>
                                        {isLocked ? (
                                            // premium card, viewer not enrolled → withhold the answer
                                            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                                                <LockIcon aria-hidden focusable="false" className="size-8 text-muted" />
                                                <Typography type="body-sm" weight="semibold">
                                                    {labels.premiumLockedTitle}
                                                </Typography>
                                                <Typography type="body-xs" color="muted">
                                                    {labels.premiumLockedHint}
                                                </Typography>
                                            </div>
                                        ) : (
                                            <>
                                                {card?.answer ? (
                                                    <MarkdownContent plain markdown={card.answer} arcSections />
                                                ) : (
                                                    <Typography type="body-sm" color="muted">
                                                        {labels.noAnswer}
                                                    </Typography>
                                                )}
                                                {card?.explanation ? (
                                                    <MarkdownContent plain markdown={card.explanation} />
                                                ) : null}
                                            </>
                                        )}
                                    </>
                                )}
                            />

                            {/* reveal first, then grade recall (which advances) — unless the card is
                                locked premium, where we surface an enrol CTA instead of grading */}
                            {revealed && isLocked ? (
                                <div className="flex justify-center">
                                    <Button size="sm" variant="primary" onPress={onUnlock}>
                                        {labels.premiumCta}
                                    </Button>
                                </div>
                            ) : revealed ? (
                                <SectionCard
                                    withVerdict={{ enable: true, variant: "accent" }}
                                >
                                    <Label>{labels.rateHint}</Label>
                                    <RatingBar
                                        options={ratingOptions}
                                        onRate={onRate}
                                        ariaLabel={labels.rateAria}
                                        isPending={reviewing}
                                    />
                                </SectionCard>
                            ) : (
                                // "Show answer" (primary, fills the rest of the space) · "Next"/"Previous"
                                // ICON-ONLY (caret, no text).
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button size="sm" variant="primary" className="w-full @app-sm:w-auto" onPress={onReveal}>
                                        {labels.showAnswer}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        isIconOnly
                                        isDisabled={isFirst}
                                        aria-label={labels.previous}
                                        onPress={onPrev}
                                    >
                                        <CaretLeftIcon weight="bold" className="size-4" aria-hidden focusable="false" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        isIconOnly
                                        isDisabled={isLast}
                                        aria-label={labels.next}
                                        onPress={onNext}
                                    >
                                        <CaretRightIcon weight="bold" className="size-4" aria-hidden focusable="false" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
