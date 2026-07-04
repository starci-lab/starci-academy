import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { AddToCartRequest, MutateAddToCartResponse } from "./types/cart"

const mutation1 = gql`
  mutation AddToCart($request: AddToCartRequest!) {
    addToCart(request: $request) {
      success
      message
      error
      data {
        id
        userId
        courseId
        createdAt
      }
    }
  }
`

export enum MutationAddToCart {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationAddToCart, DocumentNode> = {
    [MutationAddToCart.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateAddToCart}. */
export type MutateAddToCartParams = MutateParams<MutationAddToCart, AddToCartRequest>

/**
 * Adds one course to the viewer's shopping cart. Returns the created cart row.
 *
 * Mirrors backend `addToCart`.
 */
export const mutateAddToCart = async ({
    mutation = MutationAddToCart.Mutation1,
    request,
    debug,
    signal,
}: MutateAddToCartParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateAddToCartResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
