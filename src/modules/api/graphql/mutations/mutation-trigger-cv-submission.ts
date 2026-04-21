import { createApolloClient } from "../clients"
import type { GraphQLResponse } from "../types"
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

export interface MutateTriggerCvSubmissionVariables {
    request: TriggerCvSubmissionRequest
}

export interface MutateTriggerCvSubmissionParams {
    mutation?: MutationTriggerCvSubmission
    variables: MutateTriggerCvSubmissionVariables
    token: string
}

export interface MutateTriggerCvSubmissionResponse {
    triggerCvSubmission: GraphQLResponse
}

export const mutateTriggerCvSubmission = async ({
    mutation = MutationTriggerCvSubmission.Mutation1,
    variables,
    token,
}: MutateTriggerCvSubmissionParams) => {
    const apollo = createApolloClient({
        auth: true,
        cache: false,
        token,
    })

    return apollo.mutate<MutateTriggerCvSubmissionResponse>({
        mutation: mutationMap[mutation],
        variables,
    })
}
