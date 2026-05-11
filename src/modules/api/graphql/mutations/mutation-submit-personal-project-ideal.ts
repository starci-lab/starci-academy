import { createAuthApolloClient } from "../clients"
import {
    type GraphQLResponse,
    type MutateParams,
    type QueryVariables,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

const mutation1 = gql`
  mutation SubmitPersonalProjectIdeal($request: SubmitPersonalProjectIdealRequest!) {
    submitPersonalProjectIdeal(request: $request) {
      success
      message
      error
      data {
        id
      }
    }
  }
`

export enum MutationSubmitPersonalProjectIdeal {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSubmitPersonalProjectIdeal, DocumentNode> = {
    [MutationSubmitPersonalProjectIdeal.Mutation1]: mutation1,
}

/** GraphQL `SubmitPersonalProjectIdealRequest` body. */
export interface SubmitPersonalProjectIdealRequest {
    courseId: string
    ideaText: string
}

/** Minimal payload needed on FE after successful idea submission. */
export interface SubmitPersonalProjectIdealData {
    id: string
}

export type MutateSubmitPersonalProjectIdealVariables =
    QueryVariables<SubmitPersonalProjectIdealRequest>

export type MutateSubmitPersonalProjectIdealParams = MutateParams<
    MutationSubmitPersonalProjectIdeal,
    SubmitPersonalProjectIdealRequest
>

export interface MutateSubmitPersonalProjectIdealResponse {
    submitPersonalProjectIdeal: GraphQLResponse<SubmitPersonalProjectIdealData>
}

/**
 * Saves project idea text for a specific enrollment.
 */
export const mutateSubmitPersonalProjectIdeal = async ({
    mutation = MutationSubmitPersonalProjectIdeal.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateSubmitPersonalProjectIdealParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateSubmitPersonalProjectIdealResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
