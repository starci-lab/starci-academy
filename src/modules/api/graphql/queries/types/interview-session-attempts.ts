import type { GraphQLResponse } from "../../types"

/** One answered question within a run, with its grade + persisted feedback. */
export interface InterviewSessionAttemptItem {
    /** Attempt id. */
    id: string
    /** Integer 0–100 score. */
    score: number
    /** Coarse verdict band (pass/borderline/fail). */
    verdict: string
    /** Seniority level of the question, or null. */
    level: string | null
    /** Technology tags of the question. */
    tags: Array<string>
    /** The question prompt (Markdown). */
    question: string
    /** Concrete strengths (empty for legacy rows). */
    strengths: Array<string>
    /** Concrete gaps (empty for legacy rows). */
    gaps: Array<string>
    /** One-line nudge toward the model answer, or null. */
    modelAnswerHint: string | null
    /** ISO timestamp the answer was graded. */
    createdAt: string
}

/** The answered questions of one run, in answer order. */
export interface QueryInterviewSessionAttemptsData {
    /** The run's answers, in answer order. */
    items: Array<InterviewSessionAttemptItem>
}

/** Apollo response shape for the `interviewSessionAttempts` query. */
export interface QueryInterviewSessionAttemptsResponse {
    /** Top-level `interviewSessionAttempts` field wrapping the standard API response. */
    interviewSessionAttempts: GraphQLResponse<QueryInterviewSessionAttemptsData>
}
