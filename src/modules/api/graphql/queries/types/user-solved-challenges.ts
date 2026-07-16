import type { GraphQLResponse } from "../../types"

/** Variables for the `userSolvedChallenges` query. */
export interface QueryUserSolvedChallengesRequest {
    /** Id of the user whose solved challenges to fetch. */
    userId: string
}

/** One passed challenge submission with its submitted link + language. */
export interface QueryUserSolvedChallengeItemData {
    /** Stable id for this submission (`user_challenge_submissions.id`) — pass as `submissionId` to `userSolvedChallengeDetail`. Null only for a not-yet-recomputed cache row. */
    id: string | null
    /** Challenge / submission-requirement title. */
    title: string
    /** The submitted link (GitHub repo or Google Docs URL). */
    submissionUrl: string
    /** Submission type value (githubUrl / googleDocsUrl). */
    submissionType: string
    /** Language the user chose, or null. */
    selectedLang: string | null
    /** Passed time (ISO), or null. */
    passedAt: string | null
    /** Challenge difficulty value (easy/medium/hard/insane/expert), or null on V1-legacy rows. */
    difficulty: string | null
    /** Score awarded for the passing attempt, or null when not recorded. */
    score: number | null
    /** Title of the course the challenge belongs to, or null when not resolvable. */
    courseTitle: string | null
    /** Opaque global id of the course this challenge belongs to. Null when unresolved. */
    courseGlobalId: string | null
    /** SEO-friendly slug of the course this challenge belongs to — pass to `.challenges().course(courseSlug)` to route to the per-course manage page. Null when the parent course is unresolved or has no slug. */
    courseSlug: string | null
}

/** Apollo response shape for the `userSolvedChallenges` query. */
export interface QueryUserSolvedChallengesResponse {
    /** Top-level `userSolvedChallenges` field wrapping the standard API response. */
    userSolvedChallenges: GraphQLResponse<Array<QueryUserSolvedChallengeItemData>>
}
