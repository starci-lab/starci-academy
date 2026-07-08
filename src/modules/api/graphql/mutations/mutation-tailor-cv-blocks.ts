import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { TailorCvBlocksRequest, MutateTailorCvBlocksResponse } from "./types/tailor-cv-blocks"

const mutation1 = gql`
  mutation TailorCvBlocks($request: TailorCvBlocksRequest!) {
    tailorCvBlocks(request: $request) {
      success
      message
      error
      data {
        blocks
      }
    }
  }
`

export enum MutationTailorCvBlocks {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationTailorCvBlocks, DocumentNode> = {
    [MutationTailorCvBlocks.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateTailorCvBlocks}. */
export type MutateTailorCvBlocksParams = MutateParams<
    MutationTailorCvBlocks,
    TailorCvBlocksRequest
>

/**
 * AI-adjusts the CV's blocks toward a pasted job description (wording +
 * ordering, same block/item ids) — not persisted; the caller loads the
 * returned blocks into the active document, then autosaves like any other edit.
 */
export const mutateTailorCvBlocks = async ({
    mutation = MutationTailorCvBlocks.Mutation1,
    request,
    debug,
    signal,
}: MutateTailorCvBlocksParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateTailorCvBlocksResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
