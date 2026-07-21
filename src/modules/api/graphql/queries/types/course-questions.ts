import type { GraphQLResponse } from "../../types"
import type { ReactionSummary } from "./discussion"

/**
 * Status/scope filter for the course-wide Q&A roll-up (`courseQuestions`).
 * Mirrors backend `CourseQuestionFilter`. A "question" is a top-level
 * content-comment on any lesson of the course; its "answers" are replies.
 */
export enum CourseQuestionFilter {
    /** Only questions with no replies yet — the founder/peer answer queue. */
    Unanswered = "unanswered",
    /** Only questions that already have at least one reply. */
    Answered = "answered",
    /** Only questions the calling user asked. */
    Mine = "mine",
    /** No status filter — every question, recency-sorted. */
    All = "all",
    /** No status filter; ordered by engagement (reactions + replies) — the hottest first. */
    Engagement = "engagement",
}

/** Minimal author shape attached to a course question (mirrors `UserEntity` selection). */
export interface CourseQuestionAuthor {
    /** Author user id. */
    id: string
    /** Author display username. */
    username: string
    /** Author display name (falls back to username when empty). */
    displayName: string | null
    /** Author avatar url, or null. */
    avatar: string | null
    /** Whether the viewer already follows this author (drives the follow button in the header). */
    isFollowedByMe: boolean
}

/** One question row in the course-wide Q&A roll-up (mirrors `CourseQuestionNodeObject`). */
export interface CourseQuestionNode {
    /** Question (top-level comment) primary id. */
    id: string
    /** Question body (may contain markdown). */
    body: string
    /** ISO creation timestamp. */
    createdAt: string
    /** ISO timestamp of the last edit, or null. */
    editedAt: string | null
    /** Author of the question. */
    author: CourseQuestionAuthor
    /** Id of the lesson (content) this question belongs to; null for a course-general question. */
    contentId: string | null
    /** Title of the lesson this question belongs to (for the "Bài: …" tag); null for a course-general question. */
    contentTitle: string | null
    /** Id of the module owning the lesson (used to build the lesson route); null for a course-general question. */
    moduleId: string | null
    /** Number of replies (answers) to this question. */
    replyCount: number
    /** Whether the founder has replied to this question (drives the founder-answered badge). */
    answeredByFounder: boolean
    /** Whether the question author is the founder (drives the founder author badge). */
    isFounderAuthor: boolean
    /** Reaction summary for the question itself (the question is a top-level comment) from the viewer's view. */
    reactions: ReactionSummary
    /** Whether this question is pinned to the top of the roll-up (founder moderation). */
    isPinned: boolean
}

/** Variables for the `courseQuestions` query (mirrors `CourseQuestionsRequest`). */
export interface CourseQuestionsRequest {
    /** Course whose questions are rolled up. */
    courseId: string
    /** Status/scope filter — defaults to `all` when omitted. */
    filter?: CourseQuestionFilter | null
    /** Optional full-text search over question bodies. */
    search?: string | null
    /** 1-based page number (default 1). */
    page?: number | null
    /** Page size (default 20). */
    limit?: number | null
}

/** Payload inside `courseQuestions.data` (mirrors `CourseQuestionsPageObject`). */
export interface QueryCourseQuestionsPayload {
    /** The page of question nodes. */
    questions: Array<CourseQuestionNode>
    /** Total questions matching the filter + search. */
    total: number
}

/** Apollo response shape for the `courseQuestions` query. */
export interface QueryCourseQuestionsResponse {
    /** Top-level `courseQuestions` field wrapping the standard API response. */
    courseQuestions: GraphQLResponse<QueryCourseQuestionsPayload>
}
