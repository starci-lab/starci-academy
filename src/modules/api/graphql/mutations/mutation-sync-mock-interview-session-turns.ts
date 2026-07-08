import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    SyncMockInterviewSessionTurnsRequest,
    MutateSyncMockInterviewSessionTurnsResponse,
} from "./types/sync-mock-interview-session-turns"

const mutation1 = gql`
  mutation SyncMockInterviewSessionTurns($request: SyncMockInterviewSessionTurnsRequest!) {
    syncMockInterviewSessionTurns(request: $request) {
      success
      message
      error
      data {
        success
      }
    }
  }
`

export enum MutationSyncMockInterviewSessionTurns {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSyncMockInterviewSessionTurns, DocumentNode> = {
    [MutationSyncMockInterviewSessionTurns.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateSyncMockInterviewSessionTurns}. */
export type MutateSyncMockInterviewSessionTurnsParams = MutateParams<
    MutationSyncMockInterviewSessionTurns,
    SyncMockInterviewSessionTurnsRequest
>

/**
 * Best-effort, fire-and-forget persistence of an in-progress mock-interview
 * session's transcript — called after every turn so the session can be
 * resumed later within its 24h TTL (`myInProgressMockInterviewSession`).
 * Mirrors backend `mutations/interview/sync-mock-interview-session-turns`.
 */
export const mutateSyncMockInterviewSessionTurns = async ({
    mutation = MutationSyncMockInterviewSessionTurns.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateSyncMockInterviewSessionTurnsParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateSyncMockInterviewSessionTurnsResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
