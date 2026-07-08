import type { GraphQLResponse } from "../../types"

/** One completed flashcard review ("Học thẻ") session in the learner's history. */
export interface QueryFlashcardReviewHistoryItem {
    /** Id of the completed session. */
    id: string
    /** ISO timestamp of the session's last update (completion time). */
    updatedAt: string
    /** The deck this session reviewed. */
    deckId: string
    /** The deck's title. */
    deckTitle: string
    /** How many cards this session's deck snapshot carried. */
    cardCount: number
    /** Cards actually graded this session. */
    reviewedCount: number
    /** XP bookkeeping snapshot for this session (not a server grant). */
    xpEarned: number
}

/** Payload inside `myFlashcardReviewHistory.data` after the standard API wrapper. */
export interface QueryMyFlashcardReviewHistoryData {
    /** Total number of completed sessions matching the query (for pagination). */
    totalCount: number
    /** The page of history items (bounded by `limit`/`offset`). */
    items: Array<QueryFlashcardReviewHistoryItem>
}

/** Apollo response shape for the `myFlashcardReviewHistory` query. */
export interface QueryMyFlashcardReviewHistoryResponse {
    /** Top-level `myFlashcardReviewHistory` field wrapping the standard API response. */
    myFlashcardReviewHistory: GraphQLResponse<QueryMyFlashcardReviewHistoryData>
}
