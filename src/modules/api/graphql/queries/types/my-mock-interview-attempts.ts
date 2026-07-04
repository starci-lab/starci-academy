import type { GraphQLResponse } from "../../types"

/** One phase's score breakdown inside a persisted mock-interview attempt. */
export interface MockInterviewAttemptPhaseScoreItem {
    /** One of the 5 canonical mock interview phase literals. */
    phase: string
    /** Score the model assigned to this phase. */
    score: number
    /** Maximum possible score for this phase. */
    max: number
}

/** One named attribute's score inside a persisted mock-interview attempt. */
export interface MockInterviewAttemptAttributeScoreItem {
    /** The named attribute (e.g. "communication", "structuredThinking", "tradeoffAwareness"). */
    key: string
    /** Score 0–100 the model assigned to this attribute. */
    score: number
}

/** One past graded mock-interview session, for the viewer's history list. */
export interface MockInterviewAttemptItem {
    /** Attempt row id. */
    id: string
    /** Client-generated id grouping this attempt into its interview run. */
    sessionId: string
    /** The prompt (capstone milestone-task id or a curated classic slug) worked through. */
    promptId: string
    /** Snapshot of the prompt's title at grade time. */
    promptTitle: string
    /** Seniority level the session was graded against, or null (any level). */
    level: string | null
    /** Integer 0–100 overall score. */
    overallScore: number
    /** Coarse pass/borderline/fail band. */
    verdict: string
    /** Per-phase score breakdown. */
    phaseScores: Array<MockInterviewAttemptPhaseScoreItem>
    /** Per-attribute score breakdown. */
    attributeScores: Array<MockInterviewAttemptAttributeScoreItem>
    /** Concrete things done right. */
    strengths: Array<string>
    /** Concrete gaps to address. */
    gaps: Array<string>
    /** A follow-up an interviewer would ask next, or null. */
    followUpQuestion: string | null
    /** ISO timestamp of when this attempt was graded. */
    createdAt: string
}

/** Payload inside `myMockInterviewAttempts.data` after the standard API wrapper. */
export interface QueryMyMockInterviewAttemptsResponseData {
    /** Total attempts matching the scope, regardless of the requested page. */
    totalCount: number
    /** This page's attempts, newest first. */
    items: Array<MockInterviewAttemptItem>
}

/** Apollo response shape for the `myMockInterviewAttempts` query. */
export interface QueryMyMockInterviewAttemptsResponse {
    /** Top-level `myMockInterviewAttempts` field wrapping the standard API response. */
    myMockInterviewAttempts: GraphQLResponse<QueryMyMockInterviewAttemptsResponseData>
}
