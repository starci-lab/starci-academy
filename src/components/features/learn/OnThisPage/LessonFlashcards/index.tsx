"use client"

import React from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useQuerySearchCourseContentSwr } from "@/hooks/swr/api/graphql/queries/useQuerySearchCourseContentSwr"
import { LabeledList } from "@/components/blocks/lists/LabeledList"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"

/** Placeholder deck rows shown while the RAG search is in flight. */
const SKELETON_ROWS = 3

/**
 * Right-rail "review this lesson" panel: flashcard decks RAG-related to the
 * lesson currently being read (`searchCourseContent`, filtered to
 * `kind: "flashcard"` — the `flashcard_deck_contents` M2M this used to read
 * from was dropped; deck↔lesson association is RAG-derived now, same as
 * `RelatedContentList`), with a primary CTA into the Flashcards page to start
 * a spaced-repetition session.
 *
 * Reads the active course + content title from Redux and self-hides once the
 * search settles with no related decks, so it never leaves an empty box in the
 * rail. The label and the CTA are static i18n — known before the search returns —
 * so only the DECK ROWS shimmer, inside the same `LabeledList` the loaded rows
 * use (`loading-and-skeleton.md`).
 */
export const LessonFlashcards = () => {
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

    const isSkeleton = swr.isLoading
    // settled with nothing related → the panel self-hides rather than showing an empty box
    if (!isSkeleton && decks.length === 0) {
        return null
    }

    return (
        <LabeledList
            label={t("lessonRail.flashcards.title")}
            action={(
                <Button
                    label={t("lessonRail.flashcards.review")}
                    size="sm"
                    variant="secondary"
                    onPress={onReview}
                />
            )}
        >
            {isSkeleton
                ? Array.from({ length: SKELETON_ROWS }, (_row, index) => (
                    <Typography key={index} size="sm" color="muted" isSkeleton />
                ))
                : decks.map((deck) => (
                    <Typography key={deck.id} size="sm" color="muted" truncate text={deck.title} />
                ))}
        </LabeledList>
    )
}
