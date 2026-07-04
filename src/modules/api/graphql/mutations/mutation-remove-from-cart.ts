import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { RemoveFromCartRequest, MutateRemoveFromCartResponse } from "./types/cart"

const mutation1 = gql`
  mutation RemoveFromCart($request: RemoveFromCartRequest!) {
    removeFromCart(request: $request) {
      success
      message
      error
      data {
        removed
      }
    }
  }
`

export enum MutationRemoveFromCart {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationRemoveFromCart, DocumentNode> = {
    [MutationRemoveFromCart.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateRemoveFromCart}. */
export type MutateRemoveFromCartParams = MutateParams<MutationRemoveFromCart, RemoveFromCartRequest>

/**
 * Removes one course from the viewer's shopping cart.
 *
 * Mirrors backend `removeFromCart`.
 */
export const mutateRemoveFromCart = async ({
    mutation = MutationRemoveFromCart.Mutation1,
    request,
    debug,
    signal,
}: MutateRemoveFromCartParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateRemoveFromCartResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
