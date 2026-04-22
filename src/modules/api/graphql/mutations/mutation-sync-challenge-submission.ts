import { createApolloClient } from "../clients"
import type { GraphQLHeaders, GraphQLResponse } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const mutation1 = gql`
  mutation SyncSubmission($request: SyncSubmissionRequest!) {
    syncSubmission(request: $request) {
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

/** Request for `syncSubmission` (`challenge-submissions/sync-submission`). */
export interface SyncSubmissionRequest {
    /** Challenge submission id. */
    id: string
    /** Submission URL (GitHub/Google Docs per submission type). */
    url: string
}

export interface MutateSyncChallengeSubmissionsVariables {
    request: SyncSubmissionRequest
}

export interface MutateSyncChallengeSubmissionsParams {
    mutation?: MutationSyncChallengeSubmissions
    variables: MutateSyncChallengeSubmissionsVariables
    token: string
    headers?: GraphQLHeaders
}

export interface MutateSyncChallengeSubmissionsResponse {
    syncSubmission: GraphQLResponse
}

/**
 * Upserts one submission URL for the current user (`syncSubmission`).
 *
 * Mirrors backend `challenge-submissions/sync-submission`.
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
