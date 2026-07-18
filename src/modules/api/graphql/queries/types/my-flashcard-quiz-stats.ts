import type { GraphQLResponse } from "../../types"

/** Aggregate coverage for one tag across all the learner's completed sessions. */
export interface QueryFlashcardQuizTagStat {
    /** The tag/topic label. */
    tag: string
    /** Aggregate coverage ratio for this tag (0..1). */
    coverage: number
}

/** How many of the course's technology tags the learner has attempted at least once, vs how many exist. */
export interface QueryFlashcardQuizConceptCoverage {
    /** Distinct tags touched by at least one scanned quiz session's cards. */
    covered: number
    /** Distinct tags across every card in this course's decks. */
    total: number
}

/** Payload inside `myFlashcardQuizStats.data` after the standard API wrapper. */
export interface QueryMyFlashcardQuizStatsData {
    /** True when the viewer has scanned too few completed quiz sessions for a trustworthy aggregate. */
    insufficientData: boolean
    /** Aggregate coverage broken down by tag. */
    byTag: Array<QueryFlashcardQuizTagStat>
    /** Distinct tags attempted vs distinct tags existing in this course, or null when the course has no tag data at all. */
    conceptCoverage: QueryFlashcardQuizConceptCoverage | null
}

/** Apollo response shape for the `myFlashcardQuizStats` query. */
export interface QueryMyFlashcardQuizStatsResponse {
    /** Top-level `myFlashcardQuizStats` field wrapping the standard API response. */
    myFlashcardQuizStats: GraphQLResponse<QueryMyFlashcardQuizStatsData>
}
