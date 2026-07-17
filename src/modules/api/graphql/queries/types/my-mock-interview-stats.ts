import type { GraphQLResponse } from "../../types"

/** One point on the viewer's overall-score trend line. */
export interface MockInterviewStatsTrendPoint {
    /** ISO timestamp of when the attempt behind this point was graded. */
    completedAt: string
    /** The attempt's overall score, 0-100. */
    overallScore: number
    /** The attempt's mode ("qna" | "design"). */
    mode: string
    /** The attempt's coarse verdict band ("pass" | "borderline" | "fail"). */
    verdict: string
}

/** One phase (design) or kind (qna) breakdown entry, aggregated across the viewer's scanned attempts. */
export interface MockInterviewStatsBreakdownItem {
    /** The phase literal (design) or kind literal (qna) this entry aggregates. */
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

/** The single weakest phase/kind across both axes, when it qualifies. */
export interface MockInterviewStatsWeakest {
    /** The weak phase/kind literal. */
    key: string
    /** Which axis this key belongs to — "phase" (design) or "kind" (qna). */
    axis: string
    /** Average score across every attempt carrying this key. */
    avgScore: number
    /** Average max across every attempt carrying this key. */
    avgMax: number
    /** Count of attempts where this key fell below the weak threshold. */
    weakCount: number
    /** Best-effort matched course content (lesson) id to deep-link "study this" to; null when no confident match exists. */
    matchedContentId: string | null
}

/** One normalized-and-tallied recurring gap across the viewer's scanned attempts, most-frequent first. */
export interface MockInterviewStatsRecurringGap {
    /** Display text for this recurring gap (most-recently-seen original casing). */
    text: string
    /** How many scanned attempts recorded this (normalized) gap. */
    count: number
}

/** Mode split across the viewer's scanned mock-interview attempts. */
export interface MockInterviewStatsModeSplit {
    /** Completed mode="qna" attempts in the scanned window. */
    qnaCount: number
    /** Completed mode="design" (or null-mode legacy) attempts in the scanned window. */
    designCount: number
}

/** Tally of the viewer's scanned mock-interview attempts by coarse verdict band. */
export interface MockInterviewStatsVerdictCounts {
    /** Attempts graded "pass". */
    pass: number
    /** Attempts graded "borderline". */
    borderline: number
    /** Attempts graded "fail". */
    fail: number
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
    /** Per-kind aggregate, mode="qna" attempts only. */
    byKind: Array<MockInterviewStatsBreakdownItem>
    /** Per-attribute aggregate (communication/structuredThinking/tradeoffAwareness), across every attempt regardless of mode. */
    byAttribute: Array<MockInterviewStatsBreakdownItem>
    /** Per-seniority-level aggregate (junior/middle/senior), across every attempt regardless of mode. */
    byLevel: Array<MockInterviewStatsBreakdownItem>
    /** Per-drawn-language aggregate — mode="qna" code questions only, grouped by the language the question was drawn in; low-sample languages are dropped. */
    byLanguage: Array<MockInterviewStatsBreakdownItem>
    /** Top recurring gaps across every scanned attempt's gaps[], most-frequent first; only gaps seen at least twice qualify. */
    recurringGaps: Array<MockInterviewStatsRecurringGap>
    /** The single weakest phase/kind/attribute across all three axes, when it qualifies; null otherwise. */
    weakest: MockInterviewStatsWeakest | null
    /** Tally of the viewer's scanned attempts by coarse verdict band. */
    verdictCounts: MockInterviewStatsVerdictCounts
}

/** Apollo response shape for the `myMockInterviewStats` query. */
export interface QueryMyMockInterviewStatsResponse {
    /** Top-level `myMockInterviewStats` field wrapping the standard API response. */
    myMockInterviewStats: GraphQLResponse<QueryMyMockInterviewStatsResponseData>
}
