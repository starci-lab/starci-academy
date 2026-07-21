import type { GraphQLResponse } from "../../types"

/** GraphQL `CreateContentAiSessionRequest` body. */
export interface CreateContentAiSessionRequest {
    /** Content the conversation starts in. */
    contentId?: string
    /** Capstone task the conversation starts in (task scope). */
    taskId?: string
    /** Hands-on challenge the conversation starts in (challenge scope). */
    challengeId?: string
    /** Flashcard-quiz deck the conversation starts in (quiz scope). */
    quizId?: string
    /** Foundation the conversation starts in (foundation scope). */
    foundationId?: string
    /** Course the conversation starts in, when `contentId` is omitted (course-general conversation). */
    courseId?: string
    /** Born-archived: create it already archived (kept out of the default history list, still searchable). Used for selection-passage "explain this" side-threads. */
    archived?: boolean
}

/** Payload inside `createContentAiSession.data` after the standard API wrapper. */
export interface CreateContentAiSessionData {
    /** The new conversation id (null when no enrollment resolves). */
    id: string | null
}

/** Apollo response shape for `createContentAiSession`. */
export interface MutateCreateContentAiSessionResponse {
    /** Top-level `createContentAiSession` field wrapping the standard API response. */
    createContentAiSession: GraphQLResponse<CreateContentAiSessionData>
}
