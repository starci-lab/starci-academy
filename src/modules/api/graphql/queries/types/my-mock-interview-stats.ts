import type { GraphQLResponse } from "../../types"

/** One point on the viewer's overall-score trend line. */
export interface MockInterviewStatsTrendPoint {
    /** The attempt's overall score, 0-100. */
    overallScore: number
}

/** One phase (design) breakdown entry, aggregated across the viewer's scanned attempts. */
export interface MockInterviewStatsBreakdownItem {
    /** The phase literal (design) this entry aggregates. */
    key: string
    /** Average score across every attempt carrying this key. */
    avgScore: number
    /** Average max across every attempt carrying this key. */
    avgMax: number
    /** Count of attempts where this key's score/max ratio fell below the weak threshold. */
    weakCount: number
    /** Total attempts carrying this key. */
    attemptCount: number
}

/** Mode split across the viewer's scanned mock-interview attempts. */
export interface MockInterviewStatsModeSplit {
    /** Completed mode="qna" attempts in the scanned window. */
    qnaCount: number
    /** Completed mode="design" (or null-mode legacy) attempts in the scanned window. */
    designCount: number
}

/** Payload inside `myMockInterviewStats.data` after the standard API wrapper. */
export interface QueryMyMockInterviewStatsResponseData {
    /** True when the scanned window has too few attempts for a trustworthy aggregate — every other field is empty/zero when true. */
    insufficientData: boolean
    /** Mode split across the scanned window. */
    modeSplit: MockInterviewStatsModeSplit
    /** Overall-score trend across the most recent attempts (bounded, oldest of the window first). */
    trend: Array<MockInterviewStatsTrendPoint>
    /** Per-phase aggregate, mode="design" attempts only. */
    byPhase: Array<MockInterviewStatsBreakdownItem>
}

/** Apollo response shape for the `myMockInterviewStats` query. */
export interface QueryMyMockInterviewStatsResponse {
    /** Top-level `myMockInterviewStats` field wrapping the standard API response. */
    myMockInterviewStats: GraphQLResponse<QueryMyMockInterviewStatsResponseData>
}
