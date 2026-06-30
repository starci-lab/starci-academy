import type { GraphQLResponse } from "../../types"

/** One mock-interview RUN (the 5/10 questions of a single session), aggregated. */
export interface InterviewSessionItem {
    /** The run's session id. */
    sessionId: string
    /** ISO timestamp the run started (earliest answer). */
    startedAt: string
    /** How many questions were answered in the run. */
    questionCount: number
    /** Mean score (0–100) across the run, one decimal. */
    averageScore: number
    /** Best (highest) score in the run. */
    bestScore: number
    /** How many answers passed. */
    passCount: number
    /** How many answers were borderline. */
    borderlineCount: number
    /** How many answers failed. */
    failCount: number
    /** Dominant seniority level across the run's questions, or null. */
    level: string | null
}

/** A page of interview runs plus the total run count for pagination. */
export interface QueryInterviewSessionsData {
    /** The runs on this page, newest first. */
    items: Array<InterviewSessionItem>
    /** Total number of runs in scope (for pagination). */
    totalCount: number
}

/** Apollo response shape for the `interviewSessions` query. */
export interface QueryInterviewSessionsResponse {
    /** Top-level `interviewSessions` field wrapping the standard API response. */
    interviewSessions: GraphQLResponse<QueryInterviewSessionsData>
}
