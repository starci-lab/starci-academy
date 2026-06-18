"use client"

import React, { useMemo, useState } from "react"
import useSWR from "swr"
import { Button, Chip, Typography, cn } from "@heroui/react"
import { motion } from "framer-motion"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { queryFlashcardDeck } from "@/modules/api/graphql"
import { type FlashcardCardEntity } from "@/modules/types"
import { AsyncContent } from "@/components/blocks"
import { useAppSelector } from "@/redux"
import { pathConfig } from "@/resources"
import { FlashcardReviewerSkeleton } from "./FlashcardReviewerSkeleton"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link FlashcardReviewer}. */
export interface FlashcardReviewerProps extends WithClassNames<undefined> {
    /** Deck id being reviewed. */
    deckId: string
}

/** HeroUI Chip color per interview seniority level. */
const LEVEL_COLOR: Record<string, "success" | "warning" | "danger" | "accent"> = {
    junior: "success",
    middle: "warning",
    senior: "danger",
    staff: "accent",
}

/** Shared surface for both faces — a soft, borderless card (semantic tokens, no shadow). */
const FACE_CLASS = "flex min-h-64 flex-col gap-3 rounded-xl bg-default/40 p-8"
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
 * Data states go through {@link AsyncContent}.
 * @param props - {@link FlashcardReviewerProps}
 */
export const FlashcardReviewer = ({ deckId, className }: FlashcardReviewerProps) => {
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
    const { data, isLoading, error, mutate } = useSWR(
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

    const card = cards[currentIndex]
    const isFirst = currentIndex === 0
    const isLast = currentIndex === cards.length - 1
    // progress by position through the deck
    const progressPercent = card
        ? Math.round(((currentIndex + 1) / cards.length) * 100)
        : 0

    return (
        <AsyncContent
            isLoading={(isLoading || !data) && cards.length === 0}
            skeleton={<FlashcardReviewerSkeleton />}
            isEmpty={cards.length === 0}
            emptyContent={{ title: t("flashcard.empty") }}
            error={cards.length === 0 ? error : undefined}
            errorContent={{
                title: t("flashcard.empty"),
                onRetry: () => { void mutate() },
            }}
        >
            <div className={cn("flex flex-col gap-6", className)}>
                {/* progress: counter + bar */}
                <div className="flex flex-col gap-2">
                    <Typography type="body-xs" color="muted">
                        {t("flashcard.cardProgress", {
                            current: currentIndex + 1,
                            total: cards.length,
                        })}
                    </Typography>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-default">
                        <div
                            className="h-full rounded-full bg-accent transition-all"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* current card meta: interview level + technology tags (always visible) */}
                {card && (card.level || (card.tags?.length ?? 0) > 0) ? (
                    <div className="flex flex-wrap items-center gap-2">
                        {card.level ? (
                            <Chip size="sm" variant="soft" color={LEVEL_COLOR[card.level] ?? "default"}>
                                {t(`flashcard.level.${card.level}`)}
                            </Chip>
                        ) : null}
                        {card.tags?.map((tag) => (
                            <Chip key={tag} size="sm" variant="soft" color="default">
                                {tag}
                            </Chip>
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
                            <Typography type="body-xs" weight="medium" color="muted">
                                {t("flashcard.questionLabel")}
                            </Typography>
                            <div className="text-lg font-medium text-foreground">
                                <MarkdownContent markdown={card?.question ?? ""} />
                            </div>
                            <Typography type="body-xs" color="muted" className="mt-auto">
                                {t("flashcard.flipHint")}
                            </Typography>
                        </div>

                        {/* back: answer (+ optional depth), pre-rotated so it reads upright when flipped */}
                        <div
                            className={FACE_CLASS}
                            style={{ ...FACE_STYLE, transform: "rotateY(180deg)" }}
                        >
                            <Typography type="body-xs" weight="medium" color="muted">
                                {t("flashcard.answerLabel")}
                            </Typography>
                            {card?.answer ? (
                                <div className="text-foreground">
                                    <MarkdownContent markdown={card.answer} />
                                </div>
                            ) : (
                                <Typography type="body-sm" color="muted">
                                    {t("flashcard.noAnswer")}
                                </Typography>
                            )}
                            {card?.explanation ? (
                                <div className="border-t border-divider pt-3 text-sm text-muted">
                                    <MarkdownContent markdown={card.explanation} />
                                </div>
                            ) : null}
                            <Typography type="body-xs" color="muted" className="mt-auto">
                                {t("flashcard.flipBackHint")}
                            </Typography>
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
                    <div className="flex flex-col gap-6 border-t border-divider pt-6">
                        {data?.contents?.length ? (
                            <div className="flex flex-col gap-2">
                                <Typography type="body-xs" color="muted">
                                    {t("flashcard.relatedContents")}
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                    {data.contents.map((content) => (
                                        <Button
                                            key={content.id}
                                            size="sm"
                                            variant="secondary"
                                            isDisabled={!content.module?.id || !courseDisplayId}
                                            onPress={() => {
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
                                        >
                                            {content.title}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                        {data?.modules?.length ? (
                            <div className="flex flex-col gap-2">
                                <Typography type="body-xs" color="muted">
                                    {t("flashcard.relatedModules")}
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                    {data.modules.map((module) => (
                                        <Button
                                            key={module.id}
                                            size="sm"
                                            variant="secondary"
                                            isDisabled={!courseDisplayId}
                                            onPress={() => {
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
                                        >
                                            {module.title}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </AsyncContent>
    )
}
