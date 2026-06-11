"use client"

import { Magnifier as MagnifyingGlassIcon } from "@gravity-ui/icons"
import React, { useMemo, useState } from "react"
import useSWR from "swr"
import {
    Button,
    Card,
    CardContent,
    Chip,
    Input,
    TextField,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { queryFlashcardDecksByCourse } from "@/modules/api/graphql"
import { ChallengeDifficulty, type FlashcardDeckEntity } from "@/modules/types"
import { FlashcardDeckListSkeleton } from "./FlashcardDeckListSkeleton"

/** HeroUI Chip color per difficulty tier. */
const DIFFICULTY_COLOR: Record<ChallengeDifficulty, "success" | "warning" | "danger"> = {
    [ChallengeDifficulty.Easy]: "success",
    [ChallengeDifficulty.Medium]: "warning",
    [ChallengeDifficulty.Hard]: "danger",
    [ChallengeDifficulty.Insane]: "danger",
}

/** Props for {@link FlashcardDeckList}. */
export interface FlashcardDeckListProps {
    /** Owning course id whose decks are listed. */
    courseId: string
    /** Called with the chosen deck id when the learner opens a deck. */
    onSelectDeck: (deckId: string) => void
}

/**
 * Lists the interview-prep flashcard decks owned by the active course. Each deck
 * card shows its difficulty + card count and opens the reviewer for that deck.
 */
export const FlashcardDeckList = ({ courseId, onSelectDeck }: FlashcardDeckListProps) => {
    const t = useTranslations()
    // live search query filtering decks by title/description
    const [query, setQuery] = useState("")

    // fetch the decks for this course; re-keys if the course changes
    const { data, isLoading, error } = useSWR(
        ["flashcard-decks-by-course", courseId],
        async () => {
            const response = await queryFlashcardDecksByCourse({
                request: { courseId },
            })
            return response.data?.flashcardDecksByCourse.data ?? null
        },
    )

    // decks in display order, narrowed by the (case-insensitive) search query
    const filteredDecks = useMemo(() => {
        const sorted = [...(data ?? [])].sort((prev, next) => prev.sortIndex - next.sortIndex)
        const normalized = query.trim().toLowerCase()
        if (!normalized) {
            return sorted
        }
        return sorted.filter((deck) => {
            const haystack = `${deck.title ?? ""} ${deck.description ?? ""}`.toLowerCase()
            return haystack.includes(normalized)
        })
    }, [data, query])

    // loading gate: show the content only once the query has settled with data
    // and no error; otherwise mirror the deck list with a content-shaped skeleton.
    const ready = !isLoading && !!data && !error

    if (!ready) {
        return <FlashcardDeckListSkeleton />
    }

    // empty state when no decks are authored for this course
    if (!data || data.length === 0) {
        return (
            <p className="py-10 text-center text-muted">
                {t("flashcard.empty")}
            </p>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {/* search box: filters the deck list client-side by title/description */}
            <TextField aria-label={t("flashcard.searchPlaceholder")} className="w-full sm:max-w-sm">
                <div className="relative">
                    <MagnifyingGlassIcon className="text-muted pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <Input
                        type="search"
                        placeholder={t("flashcard.searchPlaceholder")}
                        className="pl-9"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </div>
            </TextField>

            {filteredDecks.length === 0 ? (
                <p className="text-muted text-sm">{t("flashcard.searchEmpty", { query: query.trim() })}</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {/* decks sorted by display order, filtered by the search query */}
                    {filteredDecks.map((deck: FlashcardDeckEntity) => (
                        <Card
                            key={deck.id}
                            className="w-full transition-colors hover:bg-default-50"
                        >
                            <CardContent className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="font-medium">{deck.title}</span>
                                    <Chip
                                        size="sm"
                                        variant="soft"
                                        color={DIFFICULTY_COLOR[deck.difficulty]}
                                    >
                                        {t(`flashcard.difficulty.${deck.difficulty}`)}
                                    </Chip>
                                </div>
                                {/* short description preview */}
                                {deck.description && (
                                    <p className="line-clamp-2 text-sm text-muted">
                                        {deck.description}
                                    </p>
                                )}
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-xs text-muted">
                                        {t("flashcard.cardCount", { count: deck.cards?.length ?? 0 })}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onPress={() => onSelectDeck(deck.id)}
                                    >
                                        {t("flashcard.study")}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
