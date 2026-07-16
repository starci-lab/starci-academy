import type { GraphQLResponse } from "../../types"
import type { SubmissionFeedbackSeverity } from "@/modules/types/enums/submission-feedback-severity"

/** Variables for the `userSolvedChallengeDetail` query. */
export interface QueryUserSolvedChallengeDetailRequest {
    /** Id of the user (profile owner) whose solved-challenge detail to fetch. */
    userId: string
    /** Submission id (`user_challenge_submissions.id`) to fetch — from a `userSolvedChallenges` list item's `id`. */
    submissionId: string
}

/** One structured AI feedback item from the passing attempt of a solved challenge submission. */
export interface QueryUserSolvedChallengeDetailFeedbackData {
    /** Short summary message for this feedback item. */
    message: string
    /** More detailed explanation, or null. */
    detail: string | null
    /** Severity of the feedback item. */
    severity: SubmissionFeedbackSeverity
    /** Source location hint, e.g. file:line, or null. */
    location: string | null
    /** Suggested change (code snippet or instruction), or null. */
    suggestion: string | null
}

/** One recorded attempt against a solved challenge submission, newest first. */
export interface QueryUserSolvedChallengeDetailAttemptData {
    /** The sequence number of this attempt for this submission. */
    attemptNumber: number
    /** Score achieved in this attempt, or null when not graded. */
    score: number | null
    /** The link (GitHub repo or Google Docs URL) submitted in this attempt. */
    submissionUrl: string
    /** Short feedback summary for this attempt, or null. */
    shortFeedback: string | null
    /** When this attempt finished processing (ISO), or null. */
    processedAt: string | null
}

/** Detail of one passed challenge submission, including AI feedback from the passing attempt. */
export interface QueryUserSolvedChallengeDetailData {
    /** Submission id (`user_challenge_submissions.id`). */
    id: string
    /** Challenge title (the submission requirement title). */
    title: string
    /** The submitted link (GitHub repo or Google Docs URL). */
    submissionUrl: string
    /** Submission type value (githubUrl / googleDocsUrl). */
    submissionType: string
    /** Language the user chose, or null. */
    selectedLang: string | null
    /** Challenge difficulty value (easy/medium/hard/insane/expert), or null. */
    difficulty: string | null
    /** Score from the passing attempt, or null when not graded. */
    score: number | null
    /** Title of the course the challenge belongs to, or null when unresolved. */
    courseTitle: string | null
    /** When the submission passed (processed), or null. */
    passedAt: string | null
    /** Structured AI feedback items from the passing attempt, ordered by orderIndex. */
    feedbacks: Array<QueryUserSolvedChallengeDetailFeedbackData>
    /** This submission's attempts record, newest first. */
    attempts: Array<QueryUserSolvedChallengeDetailAttemptData>
}

/** Apollo response shape for the `userSolvedChallengeDetail` query. */
export interface QueryUserSolvedChallengeDetailResponse {
    /** Top-level `userSolvedChallengeDetail` field wrapping the standard API response. */
    userSolvedChallengeDetail: GraphQLResponse<QueryUserSolvedChallengeDetailData>
}
