import { createApolloClient } from "../clients"
import type { GraphQLResponse } from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Payload inside `processCV.data` after the standard API wrapper. */
export interface ProcessCVData {
    jobId: string
    status: string
}

const mutation1 = gql`
  mutation ProcessCV($request: ProcessCVRequest!) {
    processCV(request: $request) {
      success
      message
      error
      data {
        jobId
        status
      }
    }
  }
`

export enum MutationProcessCV {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationProcessCV, DocumentNode> = {
    [MutationProcessCV.Mutation1]: mutation1,
}

/** Variables for {@link ProcessCVRequest} on the schema. */
export interface MutateProcessCVVariables {
    request: {
        s3Key: string
        fileName: string
    }
}

export interface MutateProcessCVParams {
    mutation?: MutationProcessCV
    variables: MutateProcessCVVariables
    /** Required: mutation is guarded by Keycloak. */
    token?: string
    getAccessToken?: () => string | undefined
    refreshAccessToken?: (minValiditySeconds?: number) => Promise<boolean>
    minValiditySeconds?: number
    /** When `true`, logs the Apollo link chain flow to console. */
    debug?: boolean
}

export interface MutateProcessCVResponse {
    processCV: GraphQLResponse<ProcessCVData>
}

/**
 * Processes the uploaded CV file (parsing, extraction, etc.).
 *
 * Mirrors `ref/cv-upload/process-cv.resolver.ts` (`processCV`).
 */
export const mutateProcessCV = async ({
    mutation = MutationProcessCV.Mutation1,
    variables,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
}: MutateProcessCVParams) => {
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

    return apollo.mutate<MutateProcessCVResponse>({
        mutation: mutationMap[mutation],
        variables,
    })
}
