"use client"

import React, { useMemo, useState } from "react"
import useSWR from "swr"
import { Button } from "@heroui/react"
import { motion } from "framer-motion"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { queryFlashcardDeck } from "@/modules/api/graphql"
import { type FlashcardCardEntity } from "@/modules/types"
import { useAppSelector } from "@/redux"
import { pathConfig } from "@/resources"
import { FlashcardReviewerSkeleton } from "../FlashcardReviewerSkeleton"

/** Props for {@link FlashcardReviewer}. */
export interface FlashcardReviewerProps {
    /** Deck id being reviewed. */
    deckId: string
}

/** Shared surface for both faces — a plain (borderless) card. */
const FACE_CLASS =
    "flex min-h-64 flex-col gap-4 rounded-2xl bg-default-100 p-8 shadow-sm"
/** Keeps both faces stacked in the same grid cell + hides the away-facing side. */
const FACE_STYLE: React.CSSProperties = {
    gridArea: "1 / 1",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
}

/**
 * Open-ended flashcard reviewer over a deck. One card at a time: the Markdown
 * question on the front, flipped (on click) with a framer-motion 3D rotateY to
 * reveal the model answer plus optional depth. Prev/Next step through the deck.
 * Pure review — no multiple choice, no scoring, nothing persisted server-side.
 */
export const FlashcardReviewer = ({ deckId }: FlashcardReviewerProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    // owning course slug drives the deep-links to referenced lessons/modules
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    // index of the card currently shown
    const [currentIndex, setCurrentIndex] = useState(0)
    // whether the current card is flipped to its answer side
    const [revealed, setRevealed] = useState(false)

    // load the full deck graph (cards with question + answer)
    const { data, isLoading, error } = useSWR(
        ["flashcard-deck", deckId],
        async () => {
            const response = await queryFlashcardDeck({
                request: { flashcardDeckId: deckId },
            })
            return response.data?.flashcardDeck.data ?? null
        },
    )

    // cards in display order
    const cards = useMemo<Array<FlashcardCardEntity>>(
        () => [...(data?.cards ?? [])].sort((prev, next) => prev.sortIndex - next.sortIndex),
        [data?.cards],
    )

    // move to another card, always landing on its question side
    const goTo = (index: number) => {
        setCurrentIndex(index)
        setRevealed(false)
    }

    const flip = () => setRevealed((flipped) => !flipped)

    // loading gate: show content only once the deck has settled with data and no
    // error; otherwise mirror the flashcard with a content-shaped skeleton.
    const ready = !isLoading && !!data && !error

    if (!ready) {
        return <FlashcardReviewerSkeleton />
    }

    // empty deck guard
    if (cards.length === 0) {
        return (
            <p className="py-10 text-center text-muted">
                {t("flashcard.empty")}
            </p>
        )
    }

    const card = cards[currentIndex]
    const isFirst = currentIndex === 0
    const isLast = currentIndex === cards.length - 1
    // progress by position through the deck
    const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100)

    return (
        <div className="flex flex-col gap-4">
            {/* progress: counter + bar */}
            <div className="flex flex-col gap-2">
                <span className="text-sm text-muted">
                    {t("flashcard.cardProgress", {
                        current: currentIndex + 1,
                        total: cards.length,
                    })}
                </span>
                <div className="h-2 w-full overflow-hidden rounded-full bg-default-200">
                    <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* current card meta: interview level + technology tags (always visible) */}
            {(card.level || (card.tags?.length ?? 0) > 0) ? (
                <div className="flex flex-wrap items-center gap-2">
                    {card.level ? (
                        <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            {t(`flashcard.level.${card.level}`)}
                        </span>
                    ) : null}
                    {card.tags?.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-default-100 px-2.5 py-0.5 text-xs text-muted"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            ) : null}

            {/* the flashcard: click (or Enter/Space) to flip with a real 3D rotation.
                A perspective wrapper gives depth; the inner layer rotates and both
                faces are stacked in one grid cell so the card sizes to the tallest. */}
            <div
                role="button"
                tabIndex={0}
                aria-label={revealed ? t("flashcard.showQuestion") : t("flashcard.showAnswer")}
                onClick={flip}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        flip()
                    }
                }}
                className="cursor-pointer select-none [perspective:1600px]"
            >
                <motion.div
                    initial={false}
                    animate={{ rotateY: revealed ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="grid"
                >
                    {/* front: question */}
                    <div className={FACE_CLASS} style={FACE_STYLE}>
                        <span className="text-xs font-medium uppercase tracking-wide text-muted">
                            {t("flashcard.questionLabel")}
                        </span>
                        <div className="text-lg font-medium text-foreground">
                            <MarkdownContent markdown={card.question} />
                        </div>
                        <span className="mt-auto text-xs text-muted">{t("flashcard.flipHint")}</span>
                    </div>

                    {/* back: answer (+ optional depth), pre-rotated so it reads upright when flipped */}
                    <div
                        className={FACE_CLASS}
                        style={{ ...FACE_STYLE, transform: "rotateY(180deg)" }}
                    >
                        <span className="text-xs font-medium uppercase tracking-wide text-muted">
                            {t("flashcard.answerLabel")}
                        </span>
                        {card.answer ? (
                            <div className="text-foreground">
                                <MarkdownContent markdown={card.answer} />
                            </div>
                        ) : (
                            <p className="text-sm text-muted">{t("flashcard.noAnswer")}</p>
                        )}
                        {card.explanation && (
                            <div className="border-t border-divider/60 pt-4 text-sm text-muted">
                                <MarkdownContent markdown={card.explanation} />
                            </div>
                        )}
                        <span className="mt-auto text-xs text-muted">{t("flashcard.flipBackHint")}</span>
                    </div>
                </motion.div>
            </div>

            {/* navigation: prev / flip / next */}
            <div className="flex items-center justify-between gap-3">
                <Button
                    size="sm"
                    variant="secondary"
                    isDisabled={isFirst}
                    onPress={() => goTo(currentIndex - 1)}
                >
                    {t("flashcard.previous")}
                </Button>
                <Button size="sm" variant="outline" onPress={flip}>
                    {revealed ? t("flashcard.showQuestion") : t("flashcard.showAnswer")}
                </Button>
                <Button
                    size="sm"
                    variant="primary"
                    isDisabled={isLast}
                    onPress={() => goTo(currentIndex + 1)}
                >
                    {t("flashcard.next")}
                </Button>
            </div>

            {/* lessons + modules this deck references (N:N), deep-linked to their pages */}
            {(data?.contents?.length || data?.modules?.length) ? (
                <div className="flex flex-col gap-4 border-t border-divider/60 pt-4">
                    {data?.contents?.length ? (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium uppercase tracking-wide text-muted">
                                {t("flashcard.relatedContents")}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {data.contents.map((content) => (
                                    <button
                                        key={content.id}
                                        type="button"
                                        disabled={!content.module?.id || !courseDisplayId}
                                        onClick={() => {
                                            if (!content.module?.id || !courseDisplayId) {
                                                return
                                            }
                                            router.push(
                                                pathConfig()
                                                    .locale(locale)
                                                    .course(courseDisplayId)
                                                    .learn()
                                                    .module(content.module.id)
                                                    .content(content.id)
                                                    .build(),
                                            )
                                        }}
                                        className="rounded-full bg-default-100 px-3 py-1 text-sm transition-colors hover:bg-default-200 disabled:cursor-default disabled:opacity-60"
                                    >
                                        {content.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}
                    {data?.modules?.length ? (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium uppercase tracking-wide text-muted">
                                {t("flashcard.relatedModules")}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {data.modules.map((module) => (
                                    <button
                                        key={module.id}
                                        type="button"
                                        disabled={!courseDisplayId}
                                        onClick={() => {
                                            if (!courseDisplayId) {
                                                return
                                            }
                                            router.push(
                                                pathConfig()
                                                    .locale(locale)
                                                    .course(courseDisplayId)
                                                    .learn()
                                                    .module(module.id)
                                                    .build(),
                                            )
                                        }}
                                        className="rounded-full bg-default-100 px-3 py-1 text-sm transition-colors hover:bg-default-200 disabled:cursor-default disabled:opacity-60"
                                    >
                                        {module.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    )
}
