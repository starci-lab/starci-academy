import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { CreateCvBlocksRequest, MutateCreateCvBlocksResponse } from "./types/create-cv-blocks"

const mutation1 = gql`
  mutation CreateCvBlocks($request: CreateCvBlocksRequest!) {
    createCvBlocks(request: $request) {
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

export enum MutationCreateCvBlocks {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationCreateCvBlocks, DocumentNode> = {
    [MutationCreateCvBlocks.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateCreateCvBlocks}. */
export type MutateCreateCvBlocksParams = MutateParams<
    MutationCreateCvBlocks,
    CreateCvBlocksRequest | undefined
>

/** Creates a new CV block-editor document (`cv_blocks` row) owned by the caller. */
export const mutateCreateCvBlocks = async ({
    mutation = MutationCreateCvBlocks.Mutation1,
    request,
    debug,
    signal,
}: MutateCreateCvBlocksParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateCreateCvBlocksResponse>({
        mutation: mutationMap[mutation],
        variables: { request: request ?? {} },
    })
}
