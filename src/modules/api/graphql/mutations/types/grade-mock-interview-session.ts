import type { GraphQLResponse } from "../../types"
import type { ModelProvider } from "../../queries/query-my-ai-settings"

/**
 * One recorded turn of a completed mock-interview transcript. The candidate
 * answers across all 5 phases in a single conversation — the server grades
 * the WHOLE ordered list of turns at once, not one question at a time.
 * Mirrors backend `MockInterviewTurnInput`.
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
}

/**
 * Request body for the `gradeMockInterviewSession` mutation. Grades a WHOLE
 * completed mock-interview session against the 5-phase rubric, grounded in
 * what the course actually taught — the server RAG-retrieves course material
 * scoped to `courseId`; the client never sends grading criteria.
 */
export interface GradeMockInterviewSessionRequest {
    /** Course the session belongs to — scopes the RAG grounding + the resolved enrollment. */
    courseId: string
    /** The prompt the learner worked through (a milestone-task id, from mockInterviewPrompts). */
    promptId: string
    /** Snapshot of the prompt's title, so the server does not need to re-look it up. */
    promptTitle: string
    /** Seniority level the session was conducted at, or omitted for "any level". */
    level?: string
    /** The full recorded transcript, one entry per conversational turn, in order. */
    turns: Array<MockInterviewTurnInput>
    /** Client-generated id grouping this attempt into its interview run. */
    sessionId: string
    /** Concrete model name the user picked for grading; omit/null = balancer default. */
    selectedModel?: string
    /** Provider serving {@link GradeMockInterviewSessionRequest.selectedModel}. */
    selectedModelProvider?: ModelProvider
}

/** One phase's score breakdown inside a graded mock-interview session. */
export interface MockInterviewPhaseScoreItem {
    /** One of the 5 canonical mock interview phase literals (e.g. "requirements", "deepDive"). */
    phase: string
    /** Score the model assigned to this phase. */
    score: number
    /** Maximum possible score for this phase (phase maxes sum to 100 across the breakdown). */
    max: number
}

/** One named attribute's score inside a graded mock-interview session. */
export interface MockInterviewAttributeScoreItem {
    /** The named attribute (e.g. "communication", "structuredThinking", "tradeoffAwareness"). */
    key: string
    /** Score 0–100 the model assigned to this attribute. */
    score: number
}

/**
 * One per-question model-answer review inside a freshly graded session — the
 * anti-ChatGPT breakdown comparing the candidate's own answer against the seed
 * flashcard's authored model answer, for a `mode="qna"` question. Mirrors backend
 * `MockInterviewQuestionReviewItem`. Empty for a `mode="design"` session.
 */
export interface MockInterviewQuestionReviewItem {
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

/** Payload inside `gradeMockInterviewSession.data` after the standard API wrapper. */
export interface MockInterviewGradeSessionData {
    /** Overall score for the whole session, integer 0–100. */
    overallScore: number
    /** Coarse pass/borderline/fail band ("pass" | "borderline" | "fail"). */
    verdict: string
    /** Per-phase score breakdown, one entry per phase the model chose to score. */
    phaseScores: Array<MockInterviewPhaseScoreItem>
    /** Per-attribute score breakdown (communication, structured thinking, …). */
    attributeScores: Array<MockInterviewAttributeScoreItem>
    /** Concrete things the candidate got right across the session. */
    strengths: Array<string>
    /** Concrete things missing or wrong, framed as what to add. */
    gaps: Array<string>
    /** A natural follow-up an interviewer would ask next, or null. */
    followUpQuestion?: string | null
    /**
     * Content ids the RAG retrieval matched while grounding this session's grading —
     * one flat list for the WHOLE session (retrieval is a single top-K pass over the
     * candidate's combined answers, not phase-scoped), so a weak phase can only be
     * deep-linked to "related content for this session", not a per-phase citation.
     * Empty when the course has no RAG index, retrieval found nothing, or the field
     * predates this attempt — never fabricate a match when this is empty.
     */
    matchedContentIds: Array<string>
    /**
     * Per-question model-answer review — the anti-ChatGPT breakdown, one entry per
     * `mode="qna"` question. Empty for a `mode="design"` session (design scores by
     * phase, not per question).
     */
    questionReviews: Array<MockInterviewQuestionReviewItem>
}

/** Apollo response shape for `gradeMockInterviewSession`. */
export interface MutateGradeMockInterviewSessionResponse {
    /** Top-level `gradeMockInterviewSession` field wrapping the standard API response. */
    gradeMockInterviewSession: GraphQLResponse<MockInterviewGradeSessionData>
}
