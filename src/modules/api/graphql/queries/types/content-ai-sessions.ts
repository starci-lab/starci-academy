import type { GraphQLResponse } from "../../types"

/** GraphQL `ContentAiSessionsRequest` body. */
export interface ContentAiSessionsRequest {
    /** Which grounding surface to list: "content" | "task" | "challenge" | "quiz" | "foundation" | "course". The BE derives it from whichever anchor id is present (content > task > challenge > quiz > foundation > course) when omitted, but the FE sends it explicitly. */
    scope?: string
    /** Current content — lists THAT lesson's conversations. Omit it and pass `courseId` to list every conversation of the course (lesson-anchored + course-general mixed). */
    contentId?: string
    /** Capstone task — lists THAT task's conversations. */
    taskId?: string
    /** Hands-on challenge — lists THAT challenge's conversations. */
    challengeId?: string
    /** Flashcard-quiz deck — lists THAT quiz's conversations. */
    quizId?: string
    /** Foundation doc — lists THAT foundation's conversations. */
    foundationId?: string
    /** Course to list all conversations of, when `contentId` is omitted. */
    courseId?: string
    /** When set, search ALL conversations in the course by title + message text. */
    search?: string
    /** Page size (recency-first). Defaults to 20. */
    limit?: number
    /** Rows to skip for pagination. Defaults to 0. */
    offset?: number
    /** Include archived conversations in the list. Defaults to false. (Ignored when searching — search always spans archived.) */
    includeArchived?: boolean
}

/** One content-AI conversation in the list / search results. */
export interface ContentAiSessionSummary {
    /** Conversation (session) id. */
    id: string
    /** Conversation title (null until the first question titles it). */
    title: string | null
    /** Last-activity timestamp (ISO string). */
    updatedAt: string
    /** Number of turns in the conversation. */
    messageCount: number
    /** Grounding surface of the conversation: "content" | "task" | "challenge" | "quiz" | "foundation" | "course". */
    scope: string
    /** Content the conversation is anchored to; null for task/foundation/course-general conversations. */
    originContentId: string | null
    /** Title of the anchoring content (search results only); null for a course-general conversation. */
    originContentTitle: string | null
    /** First matching message (search results only). */
    snippet: string | null
}

/** Payload inside `contentAiSessions.data` after the standard API wrapper. */
export interface ContentAiSessionsData {
    /** The conversations, recency-first. */
    sessions: Array<ContentAiSessionSummary>
}

/** Apollo response shape for the `contentAiSessions` query. */
export interface QueryContentAiSessionsResponse {
    /** Top-level `contentAiSessions` field wrapping the standard API response. */
    contentAiSessions: GraphQLResponse<ContentAiSessionsData>
}
