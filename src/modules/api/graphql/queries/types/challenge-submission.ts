import type { ChallengeSubmissionEntity } from "@/modules/types"
import type { GraphQLResponse } from "../../types"

/** Apollo response shape for the `challengeSubmission` query. */
export interface QueryChallengeSubmissionResponse {
    /** Top-level `challengeSubmission` field wrapping the standard API response. */
    challengeSubmission: GraphQLResponse<ChallengeSubmissionEntity>
}

/** Request body for the `challengeSubmission` query (mirrors GraphQL `ChallengeSubmissionRequest`). */
export interface ChallengeSubmissionRequest {
    /** Primary identifier of the challenge submission to fetch. */
    challengeSubmissionId: string
}
