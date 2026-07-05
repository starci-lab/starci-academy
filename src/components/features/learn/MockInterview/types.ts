/**
 * BE contract types for the mock interview (Pha 1 scaffold).
 *
 * These describe the endpoints the FE is BUILT AGAINST but that the backend does
 * NOT expose yet — the feature is wired to them (typed) without faking any data
 * (see the TODO stubs in `index.tsx`). Implement the BE to this shape.
 */

/** The five canonical phases of a mock interview (interview-driven order). */
export type MockInterviewPhaseKey =
    | "requirements"
    | "estimation"
    | "highLevel"
    | "deepDive"
    | "tradeoffs"

/** Where an interview prompt comes from — a curated course capstone, or an AI-generated classic. */
export type MockInterviewPromptSource = "capstone" | "classic"

/**
 * One selectable "system to design" in the setup prompt bank.
 * BE: a `mockInterviewPrompts(courseId)` query — curated from the course's 20 capstone
 * milestones (`milestone_tasks`, source `capstone`), plus AI-generated classics later
 * (source `classic`). Rubric is resolved server-side at grade time (never sent to client).
 */
export interface MockInterviewPromptSummary {
    /** Prompt id (passed to the interviewer + grade calls). */
    id: string
    /** System name shown in the picker (e.g. "Flash sale: trừ tồn kho atomic"). */
    title: string
    /** Difficulty tier (mirrors the backend `ChallengeDifficulty`). */
    difficulty: string
    /** Curated capstone vs AI-generated classic. */
    source: MockInterviewPromptSource
}

/** Who authored one turn of the interview conversation. */
export type MockInterviewTurnRole = "interviewer" | "candidate"

/** One turn in the interview thread (candidate turns are captured client-side via STT). */
export interface MockInterviewTurn {
    /** Interviewer (AI, streamed from BE) or candidate (voice transcript). */
    role: MockInterviewTurnRole
    /** The phase this turn belongs to. */
    phase: MockInterviewPhaseKey
    /** Markdown content. */
    content: string
}

/** Per-phase score in the scorecard. */
export interface MockInterviewPhaseScore {
    /** Which phase. */
    phase: MockInterviewPhaseKey
    /** Earned points for the phase. */
    score: number
    /** Max points for the phase. */
    max: number
}

/** A named evaluation attribute (communication, structured thinking …). */
export interface MockInterviewAttributeScore {
    /** Attribute key (i18n-resolved on the FE). */
    key: string
    /** 0–100. */
    score: number
}

/**
 * The end-of-session grade for one interview run.
 * BE: a `gradeMockInterviewSession` mutation — grades the whole transcript (+ the
 * whiteboard graph, Pha 2) against the prompt's 5-phase rubric. Persists an attempt
 * grouped by a client-generated `sessionId` (mirrors `interview_attempts`).
 */
export interface MockInterviewGradeResult {
    /** Overall 0–100. */
    overallScore: number
    /** Pass / borderline / fail (reuses the interview verdict vocabulary). */
    verdict: "pass" | "borderline" | "fail"
    /** Per-phase breakdown. */
    phaseScores: Array<MockInterviewPhaseScore>
    /** Per-attribute breakdown (communication, structured thinking …). */
    attributeScores: Array<MockInterviewAttributeScore>
    /** Concrete things done right. */
    strengths: Array<string>
    /** Concrete gaps framed as "what to add". */
    gaps: Array<string>
    /** A follow-up an interviewer would ask next (nullable). */
    followUpQuestion: string | null
    /**
     * Content ids the RAG retrieval matched while grading this session (one flat list
     * for the WHOLE session — retrieval isn't phase-scoped). Empty when the course has
     * no RAG index, retrieval found nothing, or the attempt predates this field — never
     * treat empty as an error, and never fabricate a citation when it's empty.
     */
    matchedContentIds: Array<string>
}
