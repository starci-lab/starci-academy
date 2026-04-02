import { createApolloClient } from "../clients"
import type { GraphQLHeaders, GraphQLResponse } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const mutation1 = gql`
  mutation SyncChallengeSubmissionUrls($request: SyncSubmissionUrlsRequest!) {
    syncChallengeSubmissionUrls(request: $request) {
      success
      message
      error
    }
  }
`

export enum MutationSyncChallengeSubmissionUrls {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSyncChallengeSubmissionUrls, DocumentNode> = {
    [MutationSyncChallengeSubmissionUrls.Mutation1]: mutation1,
}

/** One row: challenge submission id + URL (`SyncSubmissionUrlItemInput`). */
export interface SyncSubmissionUrlItemInput {
    id: string
    url: string
}

/** Request for `syncChallengeSubmissionUrls` (`ref/sync-submission-urls`). */
export interface SyncSubmissionUrlsRequest {
    items: Array<SyncSubmissionUrlItemInput>
}

export interface MutateSyncChallengeSubmissionUrlsVariables {
    request: SyncSubmissionUrlsRequest
}

export interface MutateSyncChallengeSubmissionUrlsParams {
    mutation?: MutationSyncChallengeSubmissionUrls
    variables: MutateSyncChallengeSubmissionUrlsVariables
    token: string
    headers?: GraphQLHeaders
}

export interface MutateSyncChallengeSubmissionUrlsResponse {
    syncChallengeSubmissionUrls: GraphQLResponse<boolean>
}

/**
 * Upserts submission URLs for the current user (enrolled + course header).
 *
 * Mirrors `ref/sync-submission-urls` (`syncChallengeSubmissionUrls`).
 */
export const mutateSyncChallengeSubmissionUrls = async ({
    mutation = MutationSyncChallengeSubmissionUrls.Mutation1,
    variables,
    token,
    headers,
}: MutateSyncChallengeSubmissionUrlsParams) => {
    const apollo = createApolloClient({
        auth: true,
        cache: false,
        token,
        headers,
    })

    return apollo.mutate<MutateSyncChallengeSubmissionUrlsResponse>({
        mutation: mutationMap[mutation],
        variables,
    })
}
