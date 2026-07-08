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
 * Renders a CV document to PDF (blocks+style → 1 shared LaTeX template →
 * tectonic → MinIO, synchronous — no BullMQ queue). Feeds the live preview
 * pane (debounced ~1-2s after an edit) and the "Tải PDF" download button.
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
