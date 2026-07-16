import type { GraphQLResponse } from "../../types"

/** One weak tag surfaced for a completed flashcard quick-quiz session. */
export interface QueryFlashcardQuizWeakTag {
    /** The tag/topic label. */
    tag: string
    /** Coverage ratio for this tag across the session's answered cards (0..1). */
    coverage: number
    /** The module to revisit, when the deck→module mapping is unambiguous. */
    moduleId?: string
    /** The content/lesson to revisit, when the deck→content mapping is unambiguous. */
    contentId?: string
}

/** One completed flashcard quick-quiz session in the learner's history. */
export interface QueryFlashcardQuizHistoryItem {
    /** Id of the completed session. */
    id: string
    /** ISO timestamp of the session's last update (completion time). */
    updatedAt: string
    /** The quiz mode this session was drawn under. */
    mode: string
    /** The difficulty level this session was drawn under, when applicable. */
    level: string | null
    /** Number of cards drawn for this session. */
    cardCount: number
    /** How many cards the learner got fully correct (all cloze blanks) — the discrete score (correctCount/cardCount). */
    correctCount: number
    /** Overall coverage ratio achieved this session (0..1), null when nothing was answered. */
    coverage: number | null
    /** XP awarded for this session. */
    xpEarned: number
    /** Weakest tags this session (ranked worst-first). */
    weakTags: Array<QueryFlashcardQuizWeakTag>
}

/** Payload inside `myFlashcardQuizHistory.data` after the standard API wrapper. */
export interface QueryMyFlashcardQuizHistoryData {
    /** Total number of completed sessions matching the query (for pagination). */
    totalCount: number
    /** The page of history items (bounded by `limit`/`offset`). */
    items: Array<QueryFlashcardQuizHistoryItem>
}

/** Apollo response shape for the `myFlashcardQuizHistory` query. */
export interface QueryMyFlashcardQuizHistoryResponse {
    /** Top-level `myFlashcardQuizHistory` field wrapping the standard API response. */
    myFlashcardQuizHistory: GraphQLResponse<QueryMyFlashcardQuizHistoryData>
}
