import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { RenderCvBlocksRequest, MutateRenderCvBlocksResponse } from "./types/render-cv-blocks"

const mutation1 = gql`
  mutation RenderCvBlocks($request: RenderCvBlocksRequest!) {
    renderCvBlocks(request: $request) {
      success
      message
      error
      data {
        url
        cdnKey
        format
      }
    }
  }
`

export enum MutationRenderCvBlocks {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationRenderCvBlocks, DocumentNode> = {
    [MutationRenderCvBlocks.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateRenderCvBlocks}. */
export type MutateRenderCvBlocksParams = MutateParams<
    MutationRenderCvBlocks,
    RenderCvBlocksRequest
>

/**
 * Compiles a CV document to PDF: the FE builds the `.tex` (from blocks+style, or
 * the user's own edits to it) and sends it; the server compiles with `tectonic`
 * → MinIO, synchronous (no BullMQ queue). Feeds the live PDF preview (debounced
 * ~1-2s after an edit) and the "Tải PDF" download button.
 */
export const mutateRenderCvBlocks = async ({
    mutation = MutationRenderCvBlocks.Mutation1,
    request,
    debug,
    signal,
}: MutateRenderCvBlocksParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateRenderCvBlocksResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
