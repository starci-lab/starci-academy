import { createAuthApolloClient } from "../clients"
import { type GraphQLResponse, type MutateParams, type QueryVariables } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const mutation1 = gql`
  mutation MarkContentAsReaded($request: MarkAsReadedRequest!) {
    markContentAsReaded(request: $request) {
      success
      message
      error
      data {
        id
        isRead
      }
    }
  }
`

export enum MutationMarkContentAsReaded {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationMarkContentAsReaded, DocumentNode> = {
    [MutationMarkContentAsReaded.Mutation1]: mutation1,
}

export interface MarkContentAsReadedRequest {
    contentId: string
    readed: boolean
}

export interface MarkContentAsReadedData {
    id: string
    isRead: boolean
}

export type MutateMarkContentAsReadedVariables = QueryVariables<MarkContentAsReadedRequest>

export type MutateMarkContentAsReadedParams = MutateParams<MutationMarkContentAsReaded, MarkContentAsReadedRequest>

export interface MutateMarkContentAsReadedResponse {
    markContentAsReaded: GraphQLResponse<MarkContentAsReadedData>
}

export const mutateMarkContentAsReaded = async ({
    mutation = MutationMarkContentAsReaded.Mutation1,
    request,
    debug,
    signal,
}: MutateMarkContentAsReadedParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })
    return apollo.mutate<MutateMarkContentAsReadedResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
