import { createApolloClient } from "../clients"
import type { GraphQLHeaders, GraphQLResponse } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const mutation1 = gql`
  mutation SubmitChallengeSubmissions($request: SubmitChallengeSubmissionsRequest!) {
    submitChallengeSubmissions(request: $request) {
      success
      message
      error
    }
  }
`

export enum MutationSubmitChallengeSubmissions {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSubmitChallengeSubmissions, DocumentNode> = {
    [MutationSubmitChallengeSubmissions.Mutation1]: mutation1,
}

/** Request for `submitChallengeSubmissions` (`ref/submit-challenge-submissions`). */
export interface SubmitChallengeSubmissionsRequest {
    challengeId: string
}

export interface MutateSubmitChallengeSubmissionsVariables {
    request: SubmitChallengeSubmissionsRequest
}

export interface MutateSubmitChallengeSubmissionsParams {
    mutation?: MutationSubmitChallengeSubmissions
    variables: MutateSubmitChallengeSubmissionsVariables
    token: string
    headers?: GraphQLHeaders
}

export interface MutateSubmitChallengeSubmissionsResponse {
    submitChallengeSubmissions: GraphQLResponse
}

/**
 * Queues GitHub grading for the learner’s synced rows under one challenge.
 *
 * Mirrors `ref/submit-challenge-submissions` (`submitChallengeSubmissions`).
 */
export const mutateSubmitChallengeSubmissions = async ({
    mutation = MutationSubmitChallengeSubmissions.Mutation1,
    variables,
    token,
    headers,
}: MutateSubmitChallengeSubmissionsParams) => {
    const apollo = createApolloClient({
        auth: true,
        cache: false,
        token,
        headers,
    })

    return apollo.mutate<MutateSubmitChallengeSubmissionsResponse>({
        mutation: mutationMap[mutation],
        variables,
    })
}
