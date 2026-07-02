import type { MutateParams } from "../types"
import { createNoAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    IndexRagPlaygroundRequest,
    MutateIndexRagPlaygroundResponse,
} from "./types/index-rag-playground"

const mutation1 = gql`
  mutation IndexRagPlayground($request: IndexRagPlaygroundRequest!) {
    indexRagPlayground(request: $request) {
      success
      message
      error
      data {
        sessionId
        chunkCount
        sourceLabel
      }
    }
  }
`

export enum MutationIndexRagPlayground {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationIndexRagPlayground, DocumentNode> = {
    [MutationIndexRagPlayground.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateIndexRagPlayground}. */
export type MutateIndexRagPlaygroundParams = MutateParams<
    MutationIndexRagPlayground,
    IndexRagPlaygroundRequest
>

/**
 * Indexes a code sample (paste / upload / sample / GitHub repo) into an
 * ephemeral, session-scoped Qdrant collection for the public RAG Playground.
 * PUBLIC — no auth, no `userId`; mirrors backend
 * `mutations/rag-playground/index-rag-playground`.
 */
export const mutateIndexRagPlayground = async ({
    mutation = MutationIndexRagPlayground.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateIndexRagPlaygroundParams) => {
    const apollo = createNoAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.mutate<MutateIndexRagPlaygroundResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
