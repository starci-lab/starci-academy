import { createApolloClient } from "../clients"
import {
    type GraphQLResponse,
    type MutateParams,
    type QueryVariables,
} from "../types"
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

/** GraphQL `ProcessCVRequest` body. */
export type ProcessCVRequest = {
    s3Key: string
    fileName: string
}

export type MutateProcessCVVariables = QueryVariables<ProcessCVRequest>

export type MutateProcessCVParams = MutateParams<MutationProcessCV, ProcessCVRequest>

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
    request,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
    signal,
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
        signal,
    })

    return apollo.mutate<MutateProcessCVResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
