import { createApolloClient } from "../clients"
import type { GraphQLResponse } from "../types"
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

/** Variables for {@link GetCVPresignedUrlRequest} on the schema. */
export interface MutateGetCVPresignedUrlVariables {
    request: {
        fileName: string
        fileType: string
    }
}

export interface MutateGetCVPresignedUrlParams {
    mutation?: MutationGetCVPresignedUrl
    variables: MutateGetCVPresignedUrlVariables
    /** Required: mutation is guarded by Keycloak. */
    token?: string
    getAccessToken?: () => string | undefined
    refreshAccessToken?: (minValiditySeconds?: number) => Promise<boolean>
    minValiditySeconds?: number
    /** When `true`, logs the Apollo link chain flow to console. */
    debug?: boolean
}

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
    variables,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
}: MutateGetCVPresignedUrlParams) => {
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

    return apollo.mutate<MutateGetCVPresignedUrlResponse>({
        mutation: mutationMap[mutation],
        variables,
    })
}
