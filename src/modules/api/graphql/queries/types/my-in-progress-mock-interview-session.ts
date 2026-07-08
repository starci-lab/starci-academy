import type { GraphQLResponse } from "../../types"

/** One drawn seed flashcard question for an in-progress `mode="qna"` session. Mirrors backend `MyInProgressMockInterviewSeedQuestionItem`. */
export interface MyInProgressMockInterviewSeedQuestionItem {
    /** The seed flashcard's id. */
    cardId: string
    /** This question's randomly-assigned cognitive frame ("theory" | "reasoning" | "scenario"). */
    kind: string
    /** The seed flashcard's topic/title. */
    title: string
}

/** One recorded turn of an in-progress session's transcript so far. Mirrors backend `MyInProgressMockInterviewSessionTurnItem`. */
export interface MyInProgressMockInterviewSessionTurnItem {
    /** `"interviewer"` or `"candidate"`. */
    role: string
    /** One of the 5 canonical interview phases — carries no meaning for Q&A kinds. */
    phase: string
    /** Turn content. */
    content: string
    /** Which seed question (0-based) this turn belongs to — Q&A kinds only. */
    questionIndex?: number
    /** Set on an interviewer turn whose question shipped GIVEN code seeded into the editable Code tool. */
    artifactHint?: string | null
}

/**
 * Payload inside `myInProgressMockInterviewSession.data` after the standard
 * API wrapper — absent/null when the viewer has no resumable session (24h
 * TTL, `status="in_progress"` only).
 */
export interface MyInProgressMockInterviewSessionData {
    /** The resumable session's id. */
    sessionId: string
    /** The drawn prompt's id. */
    promptId: string
    /** The drawn prompt's title. */
    promptTitle: string
    /** Seniority level the session was drawn for, or null. */
    level?: string | null
    /** Difficulty tier of the drawn prompt. */
    difficulty: string
    /** Where the drawn prompt came from — "capstone" | "classic" | "flashcard". */
    source: string
    /** Top-level flow this session runs ("qna" | "design"), or null. */
    mode?: string | null
    /** Drawn seed questions, in ask order — empty for `mode="design"`. */
    seedQuestions: Array<MyInProgressMockInterviewSeedQuestionItem>
    /** The transcript recorded so far — null/empty for a freshly-drawn session that hasn't synced a turn yet. */
    turns?: Array<MyInProgressMockInterviewSessionTurnItem> | null
    /** Which seed question the session is currently on (Q&A kinds only). */
    questionIndex: number
    /** Which of the 5 phases the session is currently in (`mode="design"` only). */
    phaseIndex: number
    /** ISO timestamp of the session's last synced activity. */
    updatedAt: string
}

/** Apollo response shape for `myInProgressMockInterviewSession`. */
export interface QueryMyInProgressMockInterviewSessionResponse {
    /** Top-level `myInProgressMockInterviewSession` field wrapping the standard API response — `data` is absent/null when there is no resumable session. */
    myInProgressMockInterviewSession: GraphQLResponse<MyInProgressMockInterviewSessionData>
}
