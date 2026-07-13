"use client"

import React from "react"
import { Button, Typography } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useQuerySearchCourseContentSwr } from "@/hooks/swr/api/graphql/queries/useQuerySearchCourseContentSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledList } from "@/components/blocks/lists/LabeledList"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"

/** Props for {@link LessonFlashcards}. */
export type LessonFlashcardsProps = WithClassNames<undefined>

/**
 * Right-rail "review this lesson" panel: flashcard decks RAG-related to the
 * lesson currently being read (`searchCourseContent`, filtered to
 * `kind: "flashcard"` — the `flashcard_deck_contents` M2M this used to read
 * from was dropped; deck↔lesson association is RAG-derived now, same as
 * `RelatedContentList`), with a primary CTA into the Flashcards page to start
 * a spaced-repetition session. Reads the active course + content title from
 * Redux and self-hides when the lesson has no related decks (AsyncContent
 * empty → null), so it never leaves an empty box in the rail.
 * @param props - {@link LessonFlashcardsProps}
 */
export const LessonFlashcards = ({ className }: LessonFlashcardsProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const contentTitle = useAppSelector((state) => state.content.entity?.title)

    const swr = useQuerySearchCourseContentSwr(
        courseId ?? null,
        contentTitle ?? "",
        Boolean(courseId && contentTitle),
    )

    // dedupe by deck — the RAG search can surface several cards from the same deck
    const decks = Array.from(
        new Map(
            (swr.data ?? [])
                .filter((item) => item.kind === "flashcard" && item.deckId)
                .map((item) => [item.deckId as string, { id: item.deckId as string, title: item.title }]),
        ).values(),
    )

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
            isLoading={swr.isLoading}
            skeleton={
                <div className="flex flex-col gap-3">
                    <Skeleton.Typography type="body-sm" width="1/2" />
                    <Skeleton.Typography type="body-xs" width="3/4" />
                    <Skeleton.Button />
                </div>
            }
            isEmpty={decks.length === 0}
        >
            <LabeledList
                className={className}
                label={t("lessonRail.flashcards.title")}
                action={(
                    <Button size="sm" variant="secondary" className="self-start" onPress={onReview}>
                        {t("lessonRail.flashcards.review")}
                    </Button>
                )}
            >
                {decks.map((deck) => (
                    <Typography key={deck.id} type="body-sm" color="muted" truncate>
                        {deck.title}
                    </Typography>
                ))}
            </LabeledList>
        </AsyncContent>
    )
}
