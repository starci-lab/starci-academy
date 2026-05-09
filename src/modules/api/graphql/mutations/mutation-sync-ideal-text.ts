import { EnrollmentEntity } from "@/modules/types"
import { createAuthApolloClient } from "../clients"
import {
    type GraphQLResponse,
    type MutateParams,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

const mutation1 = gql`
  mutation SyncIdealText($request: SyncIdealTextRequest!) {
    syncIdealText(request: $request) {
      success
      message
      error
      data {
        ideaText
      }
    }
  }
`

export enum MutationSyncIdealText {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSyncIdealText, DocumentNode> = {
    [MutationSyncIdealText.Mutation1]: mutation1,
}

/** Request for `syncIdealText`. */
export interface SyncIdealTextRequest {
    /** Course ID. */
    courseId: string
    /** The project idea text. */
    ideaText: string
}

export type MutateSyncIdealTextParams = MutateParams<
    MutationSyncIdealText,
    SyncIdealTextRequest
>

export interface MutateSyncIdealTextResponse {
    syncIdealText: GraphQLResponse<EnrollmentEntity>
}

/**
 * Syncs (upserts) the user's personal project idea text.
 *
 * Mirrors backend `sync-ideal-text`.
 */
export const mutateSyncIdealText = async ({
    mutation = MutationSyncIdealText.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateSyncIdealTextParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateSyncIdealTextResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
