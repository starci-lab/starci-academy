import { createAuthApolloClient } from "../clients"
import {
    type GraphQLResponse,
    type MutateParams,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

const mutation1 = gql`
  mutation SyncPersonalProjectGithub($request: SyncPersonalProjectGithubRequest!) {
    syncPersonalProjectGithub(request: $request) {
      success
      message
      error
    }
  }
`

export enum MutationSyncPersonalProjectGithub {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSyncPersonalProjectGithub, DocumentNode> = {
    [MutationSyncPersonalProjectGithub.Mutation1]: mutation1,
}

/** Request for `syncPersonalProjectGithub`. */
export interface SyncPersonalProjectGithubRequest {
    /** Course ID. */
    courseId: string
    /** GitHub repository URL (omit when only syncing branch). */
    githubUrl?: string
    /** Git branch (omit when only syncing URL). */
    branch?: string
}

export type MutateSyncPersonalProjectGithubParams = MutateParams<
    MutationSyncPersonalProjectGithub,
    SyncPersonalProjectGithubRequest
>

export interface MutateSyncPersonalProjectGithubResponse {
    syncPersonalProjectGithub: GraphQLResponse
}

/**
 * Syncs (upserts) the user's personal project GitHub URL.
 *
 * Mirrors backend `sync-personal-project-github`.
 */
export const mutateSyncPersonalProjectGithub = async ({
    mutation = MutationSyncPersonalProjectGithub.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateSyncPersonalProjectGithubParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateSyncPersonalProjectGithubResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
