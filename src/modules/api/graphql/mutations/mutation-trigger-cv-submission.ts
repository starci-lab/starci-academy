import { createApolloClient } from "../clients"
import {
    withAbortContext,
    type GraphQLResponse,
    type MutateParams,
    type QueryVariables,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

const mutation1 = gql`
  mutation TriggerCvSubmission($request: TriggerCvSubmissionRequest!) {
    triggerCvSubmission(request: $request) {
      success
      message
      error
    }
  }
`

export enum MutationTriggerCvSubmission {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationTriggerCvSubmission, DocumentNode> = {
    [MutationTriggerCvSubmission.Mutation1]: mutation1,
}

export interface TriggerCvSubmissionRequest {
    cvSubmissionId: string
    cvSubmissionAttemptId?: string
}

export type MutateTriggerCvSubmissionVariables = QueryVariables<TriggerCvSubmissionRequest>

export type MutateTriggerCvSubmissionParams = MutateParams<
    MutationTriggerCvSubmission,
    TriggerCvSubmissionRequest
>

export interface MutateTriggerCvSubmissionResponse {
    triggerCvSubmission: GraphQLResponse
}

export const mutateTriggerCvSubmission = async ({
    mutation = MutationTriggerCvSubmission.Mutation1,
    request,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
    signal,
}: MutateTriggerCvSubmissionParams) => {
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
        debug,
    })

    return apollo.mutate<MutateTriggerCvSubmissionResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
        ...withAbortContext(signal),
    })
}
