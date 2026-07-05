import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { UpdateCvBlocksRequest, MutateUpdateCvBlocksResponse } from "./types/update-cv-blocks"

const mutation1 = gql`
  mutation UpdateCvBlocks($request: UpdateCvBlocksRequest!) {
    updateCvBlocks(request: $request) {
      success
      message
      error
      data {
        id
        label
        blocks
        style
        pdfCdnKey
        createdAt
        updatedAt
      }
    }
  }
`

export enum MutationUpdateCvBlocks {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationUpdateCvBlocks, DocumentNode> = {
    [MutationUpdateCvBlocks.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateUpdateCvBlocks}. */
export type MutateUpdateCvBlocksParams = MutateParams<
    MutationUpdateCvBlocks,
    UpdateCvBlocksRequest
>

/** Updates (autosaves) a CV block-editor document the caller owns. */
export const mutateUpdateCvBlocks = async ({
    mutation = MutationUpdateCvBlocks.Mutation1,
    request,
    debug,
    signal,
}: MutateUpdateCvBlocksParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateUpdateCvBlocksResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
