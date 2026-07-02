import type { MutateParams } from "../types"
import { createNoAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    AskRagPlaygroundRequest,
    MutateAskRagPlaygroundResponse,
} from "./types/ask-rag-playground"

const mutation1 = gql`
  mutation AskRagPlayground($request: AskRagPlaygroundRequest!) {
    askRagPlayground(request: $request) {
      success
      message
      error
      data {
        runId
        sources {
          filePath
          snippet
        }
      }
    }
  }
`

export enum MutationAskRagPlayground {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationAskRagPlayground, DocumentNode> = {
    [MutationAskRagPlayground.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateAskRagPlayground}. */
export type MutateAskRagPlaygroundParams = MutateParams<
    MutationAskRagPlayground,
    AskRagPlaygroundRequest
>

/**
 * Retrieves grounding chunks for a question against an indexed session and
 * prepares (but does not yet stream) the model run. The returned `runId` is
 * consumed exactly once by subscribing on the `/rag_playground` socket.
 * PUBLIC — no auth, no `userId`; mirrors backend
 * `mutations/rag-playground/ask-rag-playground`.
 */
export const mutateAskRagPlayground = async ({
    mutation = MutationAskRagPlayground.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateAskRagPlaygroundParams) => {
    const apollo = createNoAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.mutate<MutateAskRagPlaygroundResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
