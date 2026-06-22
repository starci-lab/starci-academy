"use client"

import React, { useMemo, useState } from "react"
import useSWR from "swr"
import {
    Button,
    Chip,
    Input,
    TextField,
    Typography,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { queryFlashcardDecksByCourse } from "@/modules/api/graphql"
import { AsyncContent, PressableCard, ProgressMeter } from "@/components/blocks"
import { ChallengeDifficulty, type FlashcardDeckEntity, type WithClassNames } from "@/modules/types"
import { useAppSelector } from "@/redux"
import { FlashcardDeckListSkeleton } from "./FlashcardDeckListSkeleton"

/** HeroUI Chip color per difficulty tier. */
const DIFFICULTY_COLOR: Record<ChallengeDifficulty, "success" | "warning" | "danger"> = {
    [ChallengeDifficulty.Easy]: "success",
    [ChallengeDifficulty.Medium]: "warning",
    [ChallengeDifficulty.Hard]: "danger",
    [ChallengeDifficulty.Insane]: "danger",
    [ChallengeDifficulty.Expert]: "danger",
}

/** Props for {@link FlashcardDeckList}. */
export interface FlashcardDeckListProps extends WithClassNames<undefined> {
    /** Called with the chosen deck id when the learner opens a deck. */
    onSelectDeck: (deckId: string) => void
    /** CTA label on each deck card. Defaults to the study label. */
    ctaLabel?: string
    /** Show the per-viewer spaced-repetition chrome (due chip + mastery meter).
     * The interview tab passes `false` — SR state is irrelevant when picking a
     * topic to drill aloud. Defaults to `true`. */
    showProgress?: boolean
}

/**
 * Lists the flashcard decks owned by the active course as a topic picker, shared
 * by both the study and interview tabs. Each deck card shows its difficulty + card
 * count and (in study mode) the viewer's due/mastery; the CTA label and SR chrome
 * are caller-controlled so the same list drives "Study" and "Interview". Reads the
 * owning course id from the course Redux slice; data states go through
 * {@link AsyncContent}.
 * @param props - {@link FlashcardDeckListProps}
 */
export const FlashcardDeckList = ({
    onSelectDeck,
    ctaLabel,
    showProgress = true,
}: FlashcardDeckListProps) => {
    const t = useTranslations()
    // read the owning course id from the store — no prop drilling needed
    const courseId = useAppSelector((state) => state.course.entity?.id)
    // live search query filtering decks by title/description
    const [query, setQuery] = useState("")

    // fetch the decks for this course; null key suspends until the course hydrates
    const { data, isLoading, error, mutate } = useSWR(
        courseId ? ["flashcard-decks-by-course", courseId] : null,
        async () => {
            const response = await queryFlashcardDecksByCourse({
                request: { courseId: courseId as string },
            })
            return response.data?.flashcardDecksByCourse.data ?? null
        },
    )

    const decks = data ?? []

    // decks in display order, narrowed by the (case-insensitive) search query
    const filteredDecks = useMemo(() => {
        const sorted = [...decks].sort((prev, next) => prev.sortIndex - next.sortIndex)
        const normalized = query.trim().toLowerCase()
        if (!normalized) {
            return sorted
        }
        return sorted.filter((deck) => {
            const haystack = `${deck.title ?? ""} ${deck.description ?? ""}`.toLowerCase()
            return haystack.includes(normalized)
        })
    }, [decks, query])

    return (
        <AsyncContent
            isLoading={(isLoading || !courseId) && decks.length === 0}
            skeleton={<FlashcardDeckListSkeleton />}
            isEmpty={decks.length === 0}
            emptyContent={{ title: t("flashcard.empty") }}
            error={decks.length === 0 ? error : undefined}
            errorContent={{
                title: t("flashcard.empty"),
                onRetry: () => { void mutate() },
            }}
        >
            <div className="flex flex-col gap-3">
                {/* search box: filters the deck list client-side by title/description */}
                <TextField variant="secondary" className="w-full sm:max-w-sm">
                    <Input
                        type="search"
                        aria-label={t("flashcard.searchPlaceholder")}
                        placeholder={t("flashcard.searchPlaceholder")}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </TextField>

                {filteredDecks.length === 0 ? (
                    <Typography type="body-sm" color="muted">
                        {t("flashcard.searchEmpty", { query: query.trim() })}
                    </Typography>
                ) : (
                    <div className="flex flex-col gap-3">
                        {/* decks sorted by display order, filtered by the search query */}
                        {filteredDecks.map((deck: FlashcardDeckEntity) => (
                            <PressableCard key={deck.id} onPress={() => onSelectDeck(deck.id)}>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <Typography type="body" weight="medium">
                                            {deck.title}
                                        </Typography>
                                        <div className="flex items-center gap-2">
                                            {/* viewer's cards due in this deck (per-user) — study only */}
                                            {showProgress && deck.dueCount ? (
                                                <Chip size="sm" variant="soft" color="warning">
                                                    {t("flashcard.deck.due", { count: deck.dueCount })}
                                                </Chip>
                                            ) : null}
                                            <Chip
                                                size="sm"
                                                variant="soft"
                                                color={DIFFICULTY_COLOR[deck.difficulty]}
                                            >
                                                {t(`flashcard.difficulty.${deck.difficulty}`)}
                                            </Chip>
                                        </div>
                                    </div>
                                    {/* short description preview */}
                                    {deck.description ? (
                                        <Typography type="body-sm" color="muted" className="line-clamp-2">
                                            {deck.description}
                                        </Typography>
                                    ) : null}
                                    {/* per-viewer mastery (cards with repetitions >= 2) — study only */}
                                    {showProgress && (deck.cards?.length ?? 0) > 0 ? (
                                        <ProgressMeter
                                            value={deck.masteredCount ?? 0}
                                            max={deck.cards?.length ?? 0}
                                            label={t("flashcard.deck.mastered", {
                                                mastered: deck.masteredCount ?? 0,
                                                total: deck.cards?.length ?? 0,
                                            })}
                                        />
                                    ) : null}
                                    <div className="flex items-center justify-between gap-3">
                                        <Typography type="body-xs" color="muted">
                                            {t("flashcard.cardCount", { count: deck.cards?.length ?? 0 })}
                                        </Typography>
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            onPress={() => onSelectDeck(deck.id)}
                                        >
                                            {ctaLabel ?? t("flashcard.study")}
                                        </Button>
                                    </div>
                                </div>
                            </PressableCard>
                        ))}
                    </div>
                )}
            </div>
        </AsyncContent>
    )
}
