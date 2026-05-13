import { createAuthApolloClient } from "../clients"
import {
    GraphQLResponse,
    type MutateParams,
    type QueryVariables,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

export interface GenerateSubmitCvPresignUrlData {
    url: string
    cvSubmissionId: string
}

const mutation1 = gql`
  mutation GenerateSubmitCvPresignUrl($request: GenerateSubmitCvPresignUrlRequest!) {
    generateSubmitCvPresignUrl(request: $request) {
      success
      message
      error
      data {
        url
        cvSubmissionId
      }
    }
  }
`

export enum MutationGenerateSubmitCvPresignUrl {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationGenerateSubmitCvPresignUrl, DocumentNode> = {
    [MutationGenerateSubmitCvPresignUrl.Mutation1]: mutation1,
}

export interface GenerateSubmitCvPresignUrlRequest {
    fileName: string
    /** Set when a template is chosen; omit during upload-only flow. */
    templateCvId?: string
}

export type MutateGenerateSubmitCvPresignUrlVariables = QueryVariables<GenerateSubmitCvPresignUrlRequest>

export type MutateGenerateSubmitCvPresignUrlParams = MutateParams<MutationGenerateSubmitCvPresignUrl, GenerateSubmitCvPresignUrlRequest>

export interface MutateGenerateSubmitCvPresignUrlResponse {
    generateSubmitCvPresignUrl: GraphQLResponse<{
        url: string
        cvSubmissionId: string
    }>
}

export const mutateGenerateSubmitCvPresignUrl = async ({
    mutation = MutationGenerateSubmitCvPresignUrl.Mutation1,
    request,
    debug,
    signal,
}: MutateGenerateSubmitCvPresignUrlParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateGenerateSubmitCvPresignUrlResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
