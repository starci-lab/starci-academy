import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { DeleteCvGenerationRequest, MutateDeleteCvGenerationResponse } from "./types/delete-cv-generation"

const mutation1 = gql`
  mutation DeleteCvGeneration($request: DeleteCvGenerationRequest!) {
    deleteCvGeneration(request: $request) {
      success
      message
      error
      data {
        id
      }
    }
  }
`

export enum MutationDeleteCvGeneration {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationDeleteCvGeneration, DocumentNode> = {
    [MutationDeleteCvGeneration.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateDeleteCvGeneration}. */
export type MutateDeleteCvGenerationParams = MutateParams<
    MutationDeleteCvGeneration,
    DeleteCvGenerationRequest
>

/** Deletes a CV generation the caller owns (removes the row + its CDN objects, server-side). */
export const mutateDeleteCvGeneration = async ({
    mutation = MutationDeleteCvGeneration.Mutation1,
    request,
    debug,
    signal,
    headers,
}: MutateDeleteCvGenerationParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
        headers,
    })

    return apollo.mutate<MutateDeleteCvGenerationResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
