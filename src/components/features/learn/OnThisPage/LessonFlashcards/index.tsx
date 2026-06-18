"use client"

import React from "react"
import useSWR from "swr"
import { Button, Label, Separator, Typography, cn } from "@heroui/react"
import { CardsThreeIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { queryFlashcardDecksByCourse } from "@/modules/api/graphql"
import { AsyncContent, Skeleton } from "@/components/blocks"
import { useAppSelector } from "@/redux"
import { pathConfig } from "@/resources"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link LessonFlashcards}. */
export type LessonFlashcardsProps = WithClassNames<undefined>

/**
 * Right-rail "review this lesson" panel: the flashcard decks linked to the lesson
 * currently being read (via the `flashcard_deck_contents` M2M), with a primary CTA
 * into the Flashcards page to start a spaced-repetition session. Reads the active
 * course + content id from Redux and self-hides when the lesson has no linked decks
 * (AsyncContent empty → null), so it never leaves an empty box in the rail.
 * @param props - {@link LessonFlashcardsProps}
 */
export const LessonFlashcards = ({ className }: LessonFlashcardsProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const contentId = useAppSelector((state) => state.content.id)

    // decks linked to THIS lesson; key null until both ids hydrate
    const { data, isLoading } = useSWR(
        courseId && contentId ? ["lesson-flashcard-decks", courseId, contentId] : null,
        async () => {
            const response = await queryFlashcardDecksByCourse({
                request: { courseId: courseId as string, contentId: contentId as string },
            })
            return response.data?.flashcardDecksByCourse.data ?? null
        },
    )

    const decks = data ?? []
    const totalCards = decks.reduce((sum, deck) => sum + (deck.cards?.length ?? 0), 0)

    // open the Flashcards page for this course (deck is chosen there)
    const onReview = () => {
        if (!courseDisplayId) {
            return
        }
        router.push(
            pathConfig().locale(locale).course(courseDisplayId).learn().flashcards().build(),
        )
    }

    return (
        <AsyncContent
            isLoading={isLoading && !data}
            skeleton={
                <div className="flex flex-col gap-3">
                    <Separator />
                    <Skeleton.Typography type="body-sm" width="1/2" />
                    <Skeleton.Typography type="body-xs" width="3/4" />
                    <Skeleton.Button />
                </div>
            }
            isEmpty={decks.length === 0}
        >
            <div className={cn("flex flex-col gap-3", className)}>
                <Separator />
                <div className="flex items-center gap-2">
                    <CardsThreeIcon className="size-5" aria-hidden focusable="false" />
                    <Label>{t("lessonRail.flashcards.title")}</Label>
                </div>
                <div className="flex flex-col gap-2">
                    {decks.map((deck) => (
                        <Typography key={deck.id} type="body-sm" color="muted" truncate>
                            {deck.title}
                        </Typography>
                    ))}
                </div>
                <Typography type="body-xs" color="muted">
                    {t("lessonRail.flashcards.count", { decks: decks.length, cards: totalCards })}
                </Typography>
                <Button size="sm" variant="primary" className="self-start" onPress={onReview}>
                    {t("lessonRail.flashcards.review")}
                </Button>
            </div>
        </AsyncContent>
    )
}
