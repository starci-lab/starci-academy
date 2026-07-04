import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { MutateClearCartResponse } from "./types/cart"

const mutation1 = gql`
  mutation ClearCart {
    clearCart {
      success
      message
      error
      data {
        removedCount
      }
    }
  }
`

export enum MutationClearCart {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationClearCart, DocumentNode> = {
    [MutationClearCart.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateClearCart} (no request body). */
export type MutateClearCartParams = MutateParams<MutationClearCart, void>

/**
 * Empties the viewer's shopping cart in one call. Returns how many rows were removed.
 *
 * Mirrors backend `clearCart`.
 */
export const mutateClearCart = async ({
    mutation = MutationClearCart.Mutation1,
    debug,
    signal,
}: MutateClearCartParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateClearCartResponse>({
        mutation: mutationMap[mutation],
    })
}
