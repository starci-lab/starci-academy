import type { GraphQLResponse } from "../../types"

/** Variables for the `userSolvedChallenges` query. */
export interface QueryUserSolvedChallengesRequest {
    /** Id of the user whose solved challenges to fetch. */
    userId: string
}

/** One passed challenge submission with its submitted link + language. */
export interface QueryUserSolvedChallengeItemData {
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
}

/** Apollo response shape for the `userSolvedChallenges` query. */
export interface QueryUserSolvedChallengesResponse {
    /** Top-level `userSolvedChallenges` field wrapping the standard API response. */
    userSolvedChallenges: GraphQLResponse<Array<QueryUserSolvedChallengeItemData>>
}
