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

/** One "leech" card the learner keeps forgetting (graded Again), most-forgotten first. */
export interface QueryFlashcardLeechCard {
    /** The card id (open it in the reviewer). */
    cardId: string
    /** The card's question text (default-locale snapshot). */
    question: string
    /** How many times this card was graded Again (grade 0). */
    forgotCount: number
    /** Owning deck id (deep-link target). */
    deckId: string
    /** Owning deck title. */
    deckTitle: string
}

/** The single weakest technology tag by review retention, or null when none qualifies. */
export interface QueryFlashcardWeakReviewTag {
    /** The technology tag (e.g. "NestJS"). */
    tag: string
    /** Retention for this tag = graded Good/Easy / total graded, 0..100. */
    retention: number
    /** Total graded reviews of cards carrying this tag. */
    reviewCount: number
}

/** One deck's review RETENTION (recalled/total) — the outcome analogue of the footprint deck stat. */
export interface QueryFlashcardDeckRetention {
    /** Id of the deck. */
    deckId: string
    /** Title of the deck. */
    deckTitle: string
    /** Retention = graded Good/Easy / total graded for this deck, 0..100. */
    retention: number
    /** Total graded reviews for this deck. */
    reviewCount: number
}

/** One VN-day's review retention — powers the "đang cải thiện?" trend line. */
export interface QueryFlashcardRetentionTrendPoint {
    /** The VN-calendar day (`YYYY-MM-DD`). */
    date: string
    /** Retention that day = recalled/total, 0..100. */
    retention: number
    /** Reviews graded that day. */
    reviewCount: number
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
    /** Cards the learner keeps forgetting, most-forgotten first — the "cần ôn lại" hero. */
    leechCards: Array<QueryFlashcardLeechCard>
    /** The single weakest tag by review retention, or null when none qualifies. */
    weakReviewTag: QueryFlashcardWeakReviewTag | null
    /** Per-deck review retention (outcome), weakest first. */
    deckRetention: Array<QueryFlashcardDeckRetention>
    /** Per-VN-day review retention across the trailing window — the improvement trend. */
    retentionTrend: Array<QueryFlashcardRetentionTrendPoint>
}

/** Apollo response shape for the `myFlashcardReviewStats` query. */
export interface QueryMyFlashcardReviewStatsResponse {
    /** Top-level `myFlashcardReviewStats` field wrapping the standard API response. */
    myFlashcardReviewStats: GraphQLResponse<QueryMyFlashcardReviewStatsData>
}
