import type { GraphQLResponse } from "../../types"

/**
 * One turn of the interview transcript being persisted for resume. A local
 * (per-file) copy of the shared backend `MockInterviewTurnInput` shape — this
 * one additionally carries `artifactHint` (unlike the grading mutation's own
 * copy in `grade-mock-interview-session.ts`) so a resumed session can restore
 * the "code loaded into the editor" chip on the right interviewer turn.
 */
export interface MockInterviewTurnInput {
    /** Who spoke this turn — `"interviewer"` or `"candidate"`. */
    role: string
    /** Which of the 5 canonical interview phases this turn belongs to (a `MockInterviewPhase` value). Carries no meaning for Q&A kinds — any valid enum value is accepted. */
    phase: string
    /** The turn's text content (candidate turns are speech-to-text transcribed). */
    content: string
    /** Which question (0-based) this turn belongs to — Q&A kinds only, groups turns into per-question `phaseScores` server-side. Omit for `kind="design"`. */
    questionIndex?: number
    /** Set on an interviewer turn whose question shipped GIVEN code seeded into the editable Code tool — lets a resumed session restore the "code loaded" chip instead of re-showing the code inline. */
    artifactHint?: string | null
}

/**
 * Request body for the `syncMockInterviewSessionTurns` mutation — best-effort,
 * fire-and-forget persistence of the in-progress transcript so the session
 * can be resumed later (24h TTL, see `myInProgressMockInterviewSession`).
 * Mirrors backend `SyncMockInterviewSessionTurnsRequest`.
 */
export interface SyncMockInterviewSessionTurnsRequest {
    /** The in-progress session to persist turns against (from `startMockInterviewSession`). */
    sessionId: string
    /** The full transcript recorded so far, one entry per conversational turn, in order. */
    turns: Array<MockInterviewTurnInput>
    /** Which seed question the session is currently on (Q&A kinds only). */
    questionIndex: number
    /** Which of the 5 phases the session is currently in (`mode="design"` only). */
    phaseIndex: number
}

/** Payload inside `syncMockInterviewSessionTurns.data` after the standard API wrapper. */
export interface SyncMockInterviewSessionTurnsData {
    /** Whether the sync was persisted. */
    success: boolean
}

/** Apollo response shape for `syncMockInterviewSessionTurns`. */
export interface MutateSyncMockInterviewSessionTurnsResponse {
    /** Top-level `syncMockInterviewSessionTurns` field wrapping the standard API response. */
    syncMockInterviewSessionTurns: GraphQLResponse<SyncMockInterviewSessionTurnsData>
}
