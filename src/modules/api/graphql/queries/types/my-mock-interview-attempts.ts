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

/**
 * One persisted per-question model-answer review inside a past attempt — the
 * anti-ChatGPT breakdown comparing the candidate's own answer against the seed
 * flashcard's authored model answer, for a `mode="qna"` session. Mirrors backend
 * `MockInterviewAttemptQuestionReviewItem`. Always empty for a `mode="design"`
 * attempt (or one graded before this field existed).
 */
export interface MockInterviewAttemptQuestionReviewItem {
    /** 0-based index of this question within the session. */
    questionIndex: number
    /** This question's cognitive frame ("theory" | "reasoning" | "scenario"), as drawn. */
    kind: string
    /** The interviewer's question text for this question. */
    question: string
    /** The candidate's own answer for this question. */
    candidateAnswer: string
    /** The seed flashcard's authored model answer (Markdown), or null when unavailable. */
    modelAnswer: string | null
    /** A one-line summary of what the candidate's answer was missing relative to the reference. */
    feedback: string
    /** Score assigned to this question. */
    score: number
    /** Maximum possible score for this question (always 100 for qna). */
    max: number
    /** Best-effort matched course content (lesson) id for this question, or null when no confident match exists. */
    matchedContentId: string | null
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
    /** The top-level flow this session ran ("qna" | "design"), or null for an attempt graded before the "mode split" (treated as "design"). */
    mode: string | null
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
    /**
     * Content ids the RAG retrieval matched while grading this attempt (one flat
     * list for the whole session, not per-phase). Empty when the course had no RAG
     * index at grade time, retrieval found nothing, or the attempt predates this field.
     */
    matchedContentIds: Array<string>
    /**
     * Per-question model-answer review — the anti-ChatGPT breakdown, one entry per
     * `mode="qna"` question. Empty for a `mode="design"` attempt (design scores by
     * phase, not per question) or for an attempt graded before this field existed.
     */
    questionReviews: Array<MockInterviewAttemptQuestionReviewItem>
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
