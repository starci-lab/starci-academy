import { createAuthApolloClient } from "../clients"
import {
    type GraphQLResponse,
    type MutateParams,
    type QueryVariables,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

export interface VerifySubmitCvPresignUrlData {
    uploaded: boolean
}

const mutation1 = gql`
  mutation VerifySubmitCvPresignUrl($request: VerifySubmitCvPresignUrlRequest!) {
    verifySubmitCvPresignUrl(request: $request) {
      success
      message
      error
      data {
        uploaded
      }
    }
  }
`

export enum MutationVerifySubmitCvPresignUrl {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationVerifySubmitCvPresignUrl, DocumentNode> = {
    [MutationVerifySubmitCvPresignUrl.Mutation1]: mutation1,
}

export interface VerifySubmitCvPresignUrlRequest {
    cvSubmissionId: string
}

export type MutateVerifySubmitCvPresignUrlVariables = QueryVariables<VerifySubmitCvPresignUrlRequest>

export type MutateVerifySubmitCvPresignUrlParams = MutateParams<MutationVerifySubmitCvPresignUrl, VerifySubmitCvPresignUrlRequest>

export interface MutateVerifySubmitCvPresignUrlResponse {
    verifySubmitCvPresignUrl: GraphQLResponse<VerifySubmitCvPresignUrlData>
}

export const mutateVerifySubmitCvPresignUrl = async ({
    mutation = MutationVerifySubmitCvPresignUrl.Mutation1,
    request,
    debug,
    signal,
}: MutateVerifySubmitCvPresignUrlParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateVerifySubmitCvPresignUrlResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
