import type { GraphQLResponse } from "../../types"

/** One day's review activity — cards graded that VN-calendar day (0 = rest day). */
export interface QueryFlashcardReviewDailyActivity {
    /** The VN-calendar day (`YYYY-MM-DD`). */
    date: string
    /** Cards graded that day across every deck/mode. */
    cardsReviewed: number
}

/** One deck's aggregate review footprint across the scanned sessions. */
export interface QueryFlashcardReviewDeckStat {
    /** Id of the deck. */
    deckId: string
    /** Title of the deck. */
    deckTitle: string
    /** Completed review sessions scanned for this deck. */
    sessionCount: number
    /** Total cards graded across every scanned session for this deck. */
    cardsReviewed: number
    /** This deck's current total card count. */
    totalCards: number
}

/** One day's forecasted due-card count, in the trailing 7-day-forward window. */
export interface QueryFlashcardDueForecastPoint {
    /** The VN-calendar day (`YYYY-MM-DD`). */
    date: string
    /** Cards due that day (0 = nothing due). */
    count: number
}

/** The viewer's card-maturity breakdown for this course (mastered / learning / new). */
export interface QueryFlashcardMasteryBreakdown {
    /** Cards with `repetitions >= 2` — considered mastered. */
    mastered: number
    /** Cards reviewed at least once but not yet mastered. */
    learning: number
    /** Cards in the course's decks never yet reviewed. */
    new: number
}

/** Payload inside `myFlashcardReviewStats.data` after the standard API wrapper. */
export interface QueryMyFlashcardReviewStatsData {
    /** Cards reviewed per VN-day across the trailing window (zero-filled, oldest first). */
    dailyActivity: Array<QueryFlashcardReviewDailyActivity>
    /** Aggregate stats broken down by deck. */
    byDeck: Array<QueryFlashcardReviewDeckStat>
    /** Cards due for review right now, scoped to the viewer's enrollment. */
    dueToday: number
    /** Cards due per VN-day across the next 7 days (zero-filled, tomorrow first). */
    dueForecast: Array<QueryFlashcardDueForecastPoint>
    /** The viewer's card-maturity breakdown for this course. */
    masteryBreakdown: QueryFlashcardMasteryBreakdown
}

/** Apollo response shape for the `myFlashcardReviewStats` query. */
export interface QueryMyFlashcardReviewStatsResponse {
    /** Top-level `myFlashcardReviewStats` field wrapping the standard API response. */
    myFlashcardReviewStats: GraphQLResponse<QueryMyFlashcardReviewStatsData>
}
