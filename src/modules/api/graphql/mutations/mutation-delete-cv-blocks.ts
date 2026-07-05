import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { DeleteCvBlocksRequest, MutateDeleteCvBlocksResponse } from "./types/delete-cv-blocks"

const mutation1 = gql`
  mutation DeleteCvBlocks($request: DeleteCvBlocksRequest!) {
    deleteCvBlocks(request: $request) {
      success
      message
      error
      data {
        id
      }
    }
  }
`

export enum MutationDeleteCvBlocks {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationDeleteCvBlocks, DocumentNode> = {
    [MutationDeleteCvBlocks.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateDeleteCvBlocks}. */
export type MutateDeleteCvBlocksParams = MutateParams<
    MutationDeleteCvBlocks,
    DeleteCvBlocksRequest
>

/** Deletes a CV block-editor document the caller owns (row + its rendered PDF, server-side). */
export const mutateDeleteCvBlocks = async ({
    mutation = MutationDeleteCvBlocks.Mutation1,
    request,
    debug,
    signal,
}: MutateDeleteCvBlocksParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateDeleteCvBlocksResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
