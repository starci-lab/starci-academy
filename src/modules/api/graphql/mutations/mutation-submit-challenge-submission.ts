import { createApolloClient } from "../clients"
import {
    type GraphQLResponse,
    type MutateParams,
    type QueryVariables,
} from "../types"
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

export type MutateSubmitChallengeSubmissionVariables =
    QueryVariables<SubmitChallengeSubmissionRequest>

export type MutateSubmitChallengeSubmissionParams = MutateParams<
    MutationSubmitChallengeSubmission,
    SubmitChallengeSubmissionRequest
>

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
    request,
    token,
    headers,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
    signal,
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
        signal,
    })

    return apollo.mutate<MutateSubmitChallengeSubmissionResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
