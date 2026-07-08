/**
 * BE contract types for the mock interview (Pha 1 scaffold).
 *
 * These describe the endpoints the FE is BUILT AGAINST but that the backend does
 * NOT expose yet — the feature is wired to them (typed) without faking any data
 * (see the TODO stubs in `index.tsx`). Implement the BE to this shape.
 */

/** The five canonical phases of a mock interview (interview-driven order). Only meaningful for `kind="design"`. */
export type MockInterviewPhaseKey =
    | "requirements"
    | "estimation"
    | "highLevel"
    | "deepDive"
    | "tradeoffs"

/**
 * The TOP-LEVEL flow a mock-interview session runs — "mode split" (2026-07-06).
 * `qna` draws N independent questions, each randomly assigned its own
 * {@link MockInterviewKind} at draw time (mixed within one session, "y như
 * phỏng vấn thật"); `design` keeps the unchanged 5-phase capstone flow,
 * reached from its own setup entry point.
 */
export type MockInterviewMode = "qna" | "design"

/**
 * THIS QUESTION's cognitive frame — lives on each individual drawn seed
 * (`seedTopics[i].kind`), never on the whole session. Every question in a
 * `mode="qna"` session is randomly assigned one of these 3 kinds at draw
 * time, mixing kinds within a single run.
 */
export type MockInterviewKind = "theory" | "reasoning" | "scenario"

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
    /** The phase this turn belongs to (kind="design" only — carries no meaning for Q&A kinds). */
    phase: MockInterviewPhaseKey
    /** Markdown content. */
    content: string
    /** Which seed question (0-based) this turn belongs to — Q&A kinds only, tags the turn for grading's per-question grouping. */
    questionIndex?: number
    /**
     * Set on an interviewer turn whose question shipped GIVEN code that was
     * seeded into the editable Code tool — the bubble shows a "code loaded into
     * the editor" chip instead of the code inline, pointing the candidate at the
     * tool to fix it in place.
     */
    artifactHint?: "code"
}

/**
 * Per-phase score in the scorecard. For `kind="design"` this is one of the 5
 * canonical {@link MockInterviewPhaseKey} values (i18n-resolved via
 * `mockInterview.phase.<key>`). For Q&A kinds the server instead sends a
 * ready-to-render label like `"Câu 1"` — rendered AS-IS, no i18n lookup.
 */
export interface MockInterviewPhaseScore {
    /** Which phase (design), or a server-labeled question ("Câu 1", "Câu 2" …) for Q&A kinds. */
    phase: string
    /** Earned points for the phase/question. */
    score: number
    /** Max points for the phase/question. */
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
