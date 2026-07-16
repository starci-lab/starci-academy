import type { GraphQLResponse } from "../../types"
import type { CodingLanguage, CodingProblem, CodingVerdict } from "./coding"

/** Variables for the `userCodingProblemDetail` query. */
export interface QueryUserCodingProblemDetailRequest {
    /** Id of the profile owner (target user) whose submission summary to fetch. */
    userId: string
    /** Stable URL slug of the coding problem (e.g. `two-sum`). */
    slug: string
}

/**
 * A target user's accepted-submission summary for one coding problem. Deliberately
 * trimmed — never carries `sourceCode` / `perCaseResults` / reference solutions.
 */
export interface QueryUserCodingProblemDetailSubmission {
    /** Distinct languages the user solved this problem in, across all accepted attempts. */
    languages: Array<CodingLanguage>
    /** Always Accepted — this summary only exists when the user has at least one accepted attempt. */
    verdict: CodingVerdict
    /** Passed-testcase count from the earliest accepted attempt. */
    passedCount: number
    /** Total-testcase count from the earliest accepted attempt. */
    totalCount: number
    /** When the user first solved this problem (ISO). */
    firstSolvedAt: string
}

/** Payload inside `userCodingProblemDetail.data`. */
export interface QueryUserCodingProblemDetailData {
    /** The problem detail (sample testcases only, localized) — same shape as the `codingProblem` query. */
    problem: CodingProblem
    /** The target user's accepted-submission summary for this problem, or null when unsolved. */
    submission: QueryUserCodingProblemDetailSubmission | null
}

/** Apollo response shape for the `userCodingProblemDetail` query. */
export interface QueryUserCodingProblemDetailResponse {
    /** Top-level `userCodingProblemDetail` field wrapping the standard API response. */
    userCodingProblemDetail: GraphQLResponse<QueryUserCodingProblemDetailData>
}
