import type { GraphQLResponse } from "../../types"

/** One tag's full review-retention breakdown, worst-first. */
export interface QueryFlashcardWeakTag {
    /** The technology tag (e.g. "NestJS"). */
    tag: string
    /** Retention for this tag = graded Good/Easy / total graded, 0..100. */
    retention: number
    /** Distinct cards (not reviews) carrying this tag that were graded at least once. */
    cardCount: number
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

/** A "leech FOCUS" card — the reason-tagged card the learner keeps forgetting or getting stuck on. */
export interface QueryFlashcardLeechFocusCard {
    /** The card id (open it in the reviewer). */
    cardId: string
    /** The card's question text (default-locale snapshot). */
    question: string
    /** Owning deck id (deep-link target). */
    deckId: string
    /** Owning deck title (default-locale snapshot). */
    deckTitle: string
    /** Times this card exhibited its `reason` (Again-after-a-prior-recall count, or repeated-Hard count). */
    lapseCount: number
    /** `"lapsed"` = forgot after once recalling it; `"stuckHard"` = repeatedly graded Hard, never Again but never firms up either. */
    reason: "lapsed" | "stuckHard"
}

/** Payload inside `myFlashcardReviewStats.data` after the standard API wrapper. */
export interface QueryMyFlashcardReviewStatsData {
    /** Reason-tagged leech cards (lapsed vs stuck-on-Hard), worst first — the "viết lại" fix-list. */
    leechFocus: Array<QueryFlashcardLeechFocusCard>
    /** EVERY tag's review retention, worst first. */
    weakTags: Array<QueryFlashcardWeakTag>
    /** Review retention for cards with `interval_days >= 21` (recall on already-committed cards), 0..100. */
    matureRetention: number
    /** Review retention for cards with `interval_days < 21` (recall while still spacing a card out), 0..100. */
    youngRetention: number
    /**
     * Graded review events for THIS COURSE only — the course-scoped sibling of the
     * per-USER lifetime `myFlashcardStats.totalReviewed`. The stats tab is
     * course-scoped, so its empty-state floor reads THIS, never lifetime.
     */
    reviewedTotal: number
    /**
     * Review retention for THIS COURSE only, 0..100 — what the memory-health hero
     * shows, instead of the per-USER lifetime `myFlashcardStats.retentionRate`
     * (which blends every course the learner has ever reviewed in).
     */
    courseRetention: number
    /** Per-deck review retention (outcome), weakest first. */
    deckRetention: Array<QueryFlashcardDeckRetention>
}

/** Apollo response shape for the `myFlashcardReviewStats` query. */
export interface QueryMyFlashcardReviewStatsResponse {
    /** Top-level `myFlashcardReviewStats` field wrapping the standard API response. */
    myFlashcardReviewStats: GraphQLResponse<QueryMyFlashcardReviewStatsData>
}
