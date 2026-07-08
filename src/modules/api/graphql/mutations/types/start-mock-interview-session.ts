import type { GraphQLResponse } from "../../types"

/**
 * Request body for the `startMockInterviewSession` mutation. Asks the SERVER to
 * draw a mock-interview prompt for one course + seniority level — the client
 * never picks/sends which prompt was drawn (unlike Pha 1's client-side
 * `drawRandomPrompt`). Mirrors backend `StartMockInterviewSessionRequest`.
 */
export interface StartMockInterviewSessionRequest {
    /** Course to draw a prompt for — scopes the capstone pool + the resolved enrollment. */
    courseId: string
    /** Seniority level to draw for ("junior" | "middle" | "senior"); unrecognized falls back to "middle". */
    level: string
    /** Top-level flow to draw for ("qna" | "design"); unrecognized falls back to "qna". */
    mode: string
    /**
     * Number of questions to draw for a `mode="qna"` session — one of `3 | 5 | 10`.
     * Ignored for `mode="design"`. Omitted/unrecognized falls back to `5`.
     */
    questionCount?: number
    /**
     * Subset of cognitive frames ("theory" | "reasoning" | "scenario") to draw
     * questions from for a `mode="qna"` session. Ignored for `mode="design"`.
     * Empty/omitted draws from all 3 kinds (the "Tất cả" default).
     */
    kinds?: Array<string>
    /**
     * Whether this run should count toward job-readiness's rolling interview
     * average. `true` (default) for an "Tự động" (random, mock-exam) run;
     * `false` for a "Tùy chỉnh" (configurable, deliberate-practice) run — the
     * server always forces `true` for `mode="design"` regardless of what's sent.
     */
    countsToReadiness?: boolean
}

/**
 * One authored programming-language variant of a debug/review/optimize
 * question's GIVEN code — same conceptual bug, one entry per language. The
 * candidate freely switches between these client-side (no refetch).
 */
export interface MockInterviewGivenCodeVariant {
    /** Programming language this variant is written in (e.g. "typescript"). */
    lang: string
    /** The given code itself, in {@link lang}. */
    code: string
}

/** One flashcard topic seeding a `mode="qna"` session's questions, in ask order. */
export interface MockInterviewSeedTopic {
    /** The seed flashcard's id. */
    cardId: string
    /** The cognitive frame this ONE question is asked in ("theory" | "reasoning" | "scenario"), randomly assigned per-question at draw time. */
    kind: string
    /** The seed flashcard's topic/title, shown as the current question in the left pane. */
    title: string
    /**
     * GIVEN code the candidate should FIX/read (interview-bank debug/review/optimize
     * questions) — delivered SEPARATELY from the prose so the FE seeds it into an
     * editable code editor instead of showing it read-only in the chat, one entry
     * per authored language. Empty otherwise.
     */
    givenCodes: Array<MockInterviewGivenCodeVariant>
}

/** Payload inside `startMockInterviewSession.data` after the standard API wrapper. */
export interface StartMockInterviewSessionData {
    /** Id of the persisted session draw — pass this to `gradeMockInterviewSession` so grading trusts the server-stored prompt/level/kind. */
    sessionId: string
    /** The drawn prompt's id (a milestone-task id for capstone/design, or a classic-prompt slug). */
    promptId: string
    /** The drawn prompt's title, localized — for Q&A kinds a summary like "4 câu · theory", not a single system name. */
    promptTitle: string
    /** The drawn prompt's difficulty tier ("easy" | "medium" | "hard" | "insane"). */
    difficulty: string
    /** Where the drawn prompt came from — "capstone" | "classic" (design) or "flashcard" (Q&A kinds). */
    source: string
    /** The level the draw was requested for ("junior" | "middle" | "senior"). */
    level: string
    /** Top-level flow this session runs ("qna" | "design"). */
    mode: string
    /** Drawn flashcard-card seed questions, in ask order — one per question, each with its own randomly-assigned kind. Empty for `mode="design"`. */
    seedTopics: Array<MockInterviewSeedTopic>
    /** ISO timestamp of the session's 1-hour ask-loop deadline (createdAt + 1h) — the FE derives its countdown from THIS, never a local clock start. */
    deadlineAt: string
}

/** Apollo response shape for `startMockInterviewSession`. */
export interface MutateStartMockInterviewSessionResponse {
    /** Top-level `startMockInterviewSession` field wrapping the standard API response. */
    startMockInterviewSession: GraphQLResponse<StartMockInterviewSessionData>
}
