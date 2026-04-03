import { createApolloClient } from "../clients"
import type { GraphQLHeaders, GraphQLResponse } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const mutation1 = gql`
  mutation SyncChallengeSubmissions($request: SyncSubmissionsRequest!) {
    syncChallengeSubmissions(request: $request) {
      success
      message
      error
    }
  }
`

export enum MutationSyncChallengeSubmissions {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSyncChallengeSubmissions, DocumentNode> = {
    [MutationSyncChallengeSubmissions.Mutation1]: mutation1,
}

/** One row: challenge submission id + URL (`SyncSubmissionItemInput`). */
export interface SyncSubmissionItemInput {
    id: string
    url: string
}

/** Request for `syncChallengeSubmissions` (`ref/sync-submissions`). */
export interface SyncSubmissionsRequest {
    items: Array<SyncSubmissionItemInput>
}

export interface MutateSyncChallengeSubmissionsVariables {
    request: SyncSubmissionsRequest
}

export interface MutateSyncChallengeSubmissionsParams {
    mutation?: MutationSyncChallengeSubmissions
    variables: MutateSyncChallengeSubmissionsVariables
    token: string
    headers?: GraphQLHeaders
}

export interface MutateSyncChallengeSubmissionsResponse {
    syncChallengeSubmissions: GraphQLResponse
}

/**
 * Upserts submission URLs for the current user (`syncChallengeSubmissions`).
 *
 * Mirrors `ref/sync-submissions`.
 */
export const mutateSyncChallengeSubmissions = async ({
    mutation = MutationSyncChallengeSubmissions.Mutation1,
    variables,
    token,
    headers,
}: MutateSyncChallengeSubmissionsParams) => {
    const apollo = createApolloClient({
        auth: true,
        cache: false,
        token,
        headers,
    })

    return apollo.mutate<MutateSyncChallengeSubmissionsResponse>({
        mutation: mutationMap[mutation],
        variables,
    })
}
