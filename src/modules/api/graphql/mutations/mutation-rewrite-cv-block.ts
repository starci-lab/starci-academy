import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { RewriteCvBlockRequest, MutateRewriteCvBlockResponse } from "./types/rewrite-cv-block"

const mutation1 = gql`
  mutation RewriteCvBlock($request: RewriteCvBlockRequest!) {
    rewriteCvBlock(request: $request) {
      success
      message
      error
      data {
        block
      }
    }
  }
`

export enum MutationRewriteCvBlock {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationRewriteCvBlock, DocumentNode> = {
    [MutationRewriteCvBlock.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateRewriteCvBlock}. */
export type MutateRewriteCvBlockParams = MutateParams<
    MutationRewriteCvBlock,
    RewriteCvBlockRequest
>

/**
 * AI-rewrites one block's prose, grounded (RAG) on the real capstone data when
 * `capstoneAttemptId` is set. Per-block "✨ AI viết giúp" — never blocks the
 * rest of the form; the caller owns that one block's spinner/retry-in-place UI.
 */
export const mutateRewriteCvBlock = async ({
    mutation = MutationRewriteCvBlock.Mutation1,
    request,
    debug,
    signal,
}: MutateRewriteCvBlockParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateRewriteCvBlockResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
