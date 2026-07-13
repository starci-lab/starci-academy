import type { GraphQLResponse } from "../../types"

/** One point in the coverage/XP trend over completed sessions. */
export interface QueryFlashcardQuizTrendPoint {
    /** ISO timestamp of the session this trend point represents. */
    completedAt: string
    /** Coverage ratio achieved (0..1). */
    coverage: number
    /** XP awarded for this session. */
    xpEarned: number
}

/** Aggregate coverage for one tag across all the learner's completed sessions. */
export interface QueryFlashcardQuizTagStat {
    /** The tag/topic label. */
    tag: string
    /** Aggregate coverage ratio for this tag (0..1). */
    coverage: number
}

/** Aggregate stats for one deck across all the learner's completed sessions. */
export interface QueryFlashcardQuizDeckStat {
    /** Id of the deck. */
    deckId: string
    /** Title of the deck. */
    deckTitle: string
    /** Number of completed sessions that drew from this deck. */
    sessionCount: number
    /** Total cards answered from this deck across all sessions. */
    cardsAnswered: number
    /** Total cards available in this deck. */
    totalCards: number
}

/** One weak tag with a study deep-link, ranked coverage ascending (weakest first). */
export interface QueryFlashcardQuizWeakTagLink {
    /** The tag/topic label. */
    tag: string
    /** This tag's coverage on its most recent occurrence (0..1). */
    coverage: number
    /** The single module this tag's cards map back to; null when ambiguous. */
    moduleId: string | null
    /** The single content (lesson) this tag's cards map back to; null when ambiguous. */
    contentId: string | null
}

/** One "hard" quiz card the learner keeps under-answering — the quiz analogue of a review leech. */
export interface QueryFlashcardQuizHardCard {
    /** Id of the card (deep-link target). */
    cardId: string
    /** The card's question text. */
    question: string
    /** Times this card was answered across scanned sessions (sample size). */
    attempts: number
    /** Times this card was answered with at least one blank wrong (coverage < 1). */
    wrongCount: number
    /** Aggregate coverage for this card across attempts (0..1). */
    coverage: number
    /** Owning deck id (deep-link target). */
    deckId: string
    /** Owning deck title. */
    deckTitle: string
}

/** Payload inside `myFlashcardQuizStats.data` after the standard API wrapper. */
export interface QueryMyFlashcardQuizStatsData {
    /** True when the viewer has scanned too few completed quiz sessions for a trustworthy aggregate. */
    insufficientData: boolean
    /** Coverage/XP trend across completed sessions, oldest first. */
    trend: Array<QueryFlashcardQuizTrendPoint>
    /** Aggregate coverage broken down by tag. */
    byTag: Array<QueryFlashcardQuizTagStat>
    /** Aggregate stats broken down by deck. */
    byDeck: Array<QueryFlashcardQuizDeckStat>
    /** Weakest tags with a study deep-link, each tag's most recent occurrence, ranked coverage ascending. */
    weakTagLinks: Array<QueryFlashcardQuizWeakTagLink>
    /** Cards the learner keeps under-answering (lowest coverage), hardest first — the "câu hay sai" diagnosis. */
    hardCards: Array<QueryFlashcardQuizHardCard>
    /** Completed quiz sessions scanned — a raw count for the "N phiên" tile. */
    completedSessionCount: number
}

/** Apollo response shape for the `myFlashcardQuizStats` query. */
export interface QueryMyFlashcardQuizStatsResponse {
    /** Top-level `myFlashcardQuizStats` field wrapping the standard API response. */
    myFlashcardQuizStats: GraphQLResponse<QueryMyFlashcardQuizStatsData>
}
