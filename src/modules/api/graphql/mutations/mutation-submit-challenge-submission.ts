import { createApolloClient } from "../clients"
import type { GraphQLHeaders, GraphQLResponse } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const mutation1 = gql`
  mutation SubmitChallengeSubmission($request: SubmitChallengeSubmissionRequest!) {
    submitChallengeSubmission(request: $request) {
      success
      message
      error
      data {
        jobId
      }
    }
  }
`

export enum MutationSubmitChallengeSubmission {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSubmitChallengeSubmission, DocumentNode> = {
    [MutationSubmitChallengeSubmission.Mutation1]: mutation1,
}

/** Request for `submitChallengeSubmission` (`challenge-submissions/submit-challenge-submission`). */
export interface SubmitChallengeSubmissionRequest {
    /** `challenge_submissions.id` to enqueue grading for. */
    challengeSubmissionId: string
}

export interface MutateSubmitChallengeSubmissionVariables {
    request: SubmitChallengeSubmissionRequest
}

export interface MutateSubmitChallengeSubmissionParams {
    mutation?: MutationSubmitChallengeSubmission
    variables: MutateSubmitChallengeSubmissionVariables
    token?: string
    getAccessToken?: () => string | undefined
    refreshAccessToken?: (minValiditySeconds?: number) => Promise<boolean>
    minValiditySeconds?: number
    headers?: GraphQLHeaders
    /** When `true`, logs the Apollo link chain flow to console. */
    debug?: boolean
}

export interface MutateSubmitChallengeSubmissionResponse {
    submitChallengeSubmission: GraphQLResponse<{
        jobId: string
    }>
}

/**
 * Queues grading for one challenge submission row for the authenticated user.
 *
 * Mirrors backend `challenge-submissions/submit-challenge-submission`.
 */
export const mutateSubmitChallengeSubmission = async ({
    mutation = MutationSubmitChallengeSubmission.Mutation1,
    variables,
    token,
    headers,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
}: MutateSubmitChallengeSubmissionParams) => {
    const hasAuth = Boolean(token) || Boolean(getAccessToken)
    if (!hasAuth) {
        throw new Error("Not authenticated")
    }
    const apollo = createApolloClient({
        auth: true,
        cache: false,
        token,
        getAccessToken,
        refreshAccessToken,
        minValiditySeconds,
        headers,
        debug,
    })

    return apollo.mutate<MutateSubmitChallengeSubmissionResponse>({
        mutation: mutationMap[mutation],
        variables,
    })
}
