import { createAuthApolloClient } from "../clients"
import {
    type GraphQLResponse,
    type MutateParams,
    type QueryVariables,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Payload inside `getCVPresignedUrl.data` after the standard API wrapper. */
export interface GetCVPresignedUrlData {
    url: string
    key: string
}

const mutation1 = gql`
  mutation GetCVPresignedUrl($request: GetCVPresignedUrlRequest!) {
    getCVPresignedUrl(request: $request) {
      success
      message
      error
      data {
        url
        key
      }
    }
  }
`

export enum MutationGetCVPresignedUrl {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationGetCVPresignedUrl, DocumentNode> = {
    [MutationGetCVPresignedUrl.Mutation1]: mutation1,
}

/** GraphQL `GetCVPresignedUrlRequest` body. */
export type GetCVPresignedUrlRequest = {
    fileName: string
    fileType: string
}

export type MutateGetCVPresignedUrlVariables = QueryVariables<GetCVPresignedUrlRequest>

export type MutateGetCVPresignedUrlParams = MutateParams<MutationGetCVPresignedUrl, GetCVPresignedUrlRequest>

export interface MutateGetCVPresignedUrlResponse {
    getCVPresignedUrl: GraphQLResponse<GetCVPresignedUrlData>
}

/**
 * Gets a presigned URL for uploading CV to S3.
 *
 * Mirrors `ref/cv-upload/get-presigned-url.resolver.ts` (`getCVPresignedUrl`).
 */
export const mutateGetCVPresignedUrl = async ({
    mutation = MutationGetCVPresignedUrl.Mutation1,
    request,
    debug,
    signal,
}: MutateGetCVPresignedUrlParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateGetCVPresignedUrlResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
