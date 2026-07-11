import type { GraphQLResponse } from "../../types"

/** One weak tag from a finished "Hỏi nhanh" run, ranked worst-first, with an
 *  optional lesson/module to revisit (deep link derived server-side). */
export interface FlashcardQuizSessionWeakTag {
    /** The tag/topic label. */
    tag: string
    /** Coverage ratio for this tag across the session's answered cards (0..1). */
    coverage: number
    /** The module to revisit, when the deck→module mapping is unambiguous. */
    moduleId?: string | null
    /** The content/lesson to revisit, when the deck→content mapping is unambiguous. */
    contentId?: string | null
}

/** One card's persisted cloze-blank breakdown — enough to overlay a per-card score
 *  once the card text is re-fetched (by `cardId`) via `flashcardCardsByIds`. */
export interface FlashcardQuizSessionResult {
    /** The flashcard this outcome belongs to (the FE re-fetches its text by this id). */
    cardId: string
    /** How many cloze blanks the learner filled correctly for this card. */
    correctBlanks: number
    /** Total cloze blanks this card had (0 for a fallback card without a cloze). */
    totalBlanks: number
}

/**
 * Payload inside `myFlashcardQuizSessionBySessionId.data` — the persisted snapshot
 * of ONE "Hỏi nhanh" quiz session, resolved by session id alone, owner-scoped and
 * STATUS-AGNOSTIC (resolves `completed`/`abandoned`/`in_progress`). Every field is
 * read straight off the snapshotted row (no recompute); `null` data = not found /
 * not owned by the caller.
 */
export interface MyFlashcardQuizSessionBySessionIdData {
    /** Id of the session (echoes the input). */
    sessionId: string
    /** Session lifecycle: `"in_progress" | "completed" | "abandoned"`. */
    status: string
    /** Practice mode: `"quick" | "deep"`. */
    mode: string
    /** Seniority level filter, or null = "all levels". */
    level: string | null
    /** Final coverage (0..1) — null until the session is completed. */
    coverage: number | null
    /** XP awarded for this run (0 when nothing was earned / daily cap already spent). */
    xpEarned: number
    /** Number of cards drawn for the run (= persisted `card_ids` length). */
    cardCount: number
    /** Number of cards answered (= persisted `results` length). */
    answeredCount: number
    /** Cards where every blank was filled correctly (mastery signal). */
    fullyCorrectCount: number
    /** Wall-clock span of the run in seconds — null when never updated. */
    durationSeconds: number | null
    /** Weakest tags this session, ranked worst-first; `[]` when none. */
    weakTags: Array<FlashcardQuizSessionWeakTag>
    /** Per-card cloze-blank breakdown, in draw order; `[]` when nothing answered. */
    results: Array<FlashcardQuizSessionResult>
}

/** Apollo response shape for `myFlashcardQuizSessionBySessionId`. */
export interface QueryMyFlashcardQuizSessionBySessionIdResponse {
    /** Top-level field wrapping the standard API response — `data` is null when the id is not found / not owned. */
    myFlashcardQuizSessionBySessionId: GraphQLResponse<MyFlashcardQuizSessionBySessionIdData>
}
