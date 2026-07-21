import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    SetCvBlocksPublicRequest,
    MutateSetCvBlocksPublicResponse,
} from "./types/set-cv-blocks-public"

const mutation1 = gql`
  mutation SetCvBlocksPublic($request: SetCvBlocksPublicRequest!) {
    setCvBlocksPublic(request: $request) {
      success
      message
      error
      data {
        id
        isPublic
      }
    }
  }
`

export enum MutationSetCvBlocksPublic {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSetCvBlocksPublic, DocumentNode> = {
    [MutationSetCvBlocksPublic.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateSetCvBlocksPublic}. */
export type MutateSetCvBlocksPublicParams = MutateParams<
    MutationSetCvBlocksPublic,
    SetCvBlocksPublicRequest
>

/**
 * Flags (or un-flags) one CV as the user's PUBLIC CV — the single résumé shown
 * read-only on their public profile. Auth + owner-only + single-public-per-user
 * are enforced BE-side (turning one on turns any other off), so callers should
 * refetch `myCvBlocks` afterwards to reflect the whole set.
 */
export const mutateSetCvBlocksPublic = async ({
    mutation = MutationSetCvBlocksPublic.Mutation1,
    request,
    debug,
    signal,
}: MutateSetCvBlocksPublicParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateSetCvBlocksPublicResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
