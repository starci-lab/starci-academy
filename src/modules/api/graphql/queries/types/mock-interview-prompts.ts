import type { GraphQLResponse } from "../../types"

/** One selectable mock-interview prompt (a course capstone system). */
export interface MockInterviewPromptSummary {
    /** Milestone-task id — pass to the interviewer + grade calls. */
    id: string
    /** System name shown in the picker (the capstone task title). */
    title: string
    /** Relative difficulty (easy / medium / hard / …); medium when unset. */
    difficulty: string
    /** Prompt source — `capstone` (curated) or `classic` (AI-generated). */
    source: string
}

/** Payload inside `mockInterviewPrompts.data` after the standard API wrapper. */
export interface QueryMockInterviewPromptsResponseData {
    /** Selectable systems to design, in curriculum order. */
    prompts: Array<MockInterviewPromptSummary>
}

/** Apollo response shape for the `mockInterviewPrompts` query. */
export interface QueryMockInterviewPromptsResponse {
    /** Top-level `mockInterviewPrompts` field wrapping the standard API response. */
    mockInterviewPrompts: GraphQLResponse<QueryMockInterviewPromptsResponseData>
}
