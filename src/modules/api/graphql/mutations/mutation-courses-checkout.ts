import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { CoursesCheckoutRequest, MutateCoursesCheckoutResponse } from "./types/cart"

const mutation1 = gql`
  mutation CoursesCheckout($request: CoursesCheckoutRequest!) {
    coursesCheckout(request: $request) {
      success
      message
      error
      data {
        checkoutUrl
        referenceId
        transactionId
        amount
        itemCount
        checkoutFields
      }
    }
  }
`

export enum MutationCoursesCheckout {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationCoursesCheckout, DocumentNode> = {
    [MutationCoursesCheckout.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateCoursesCheckout}. */
export type MutateCoursesCheckoutParams = MutateParams<MutationCoursesCheckout, CoursesCheckoutRequest>

/**
 * Starts a MULTI-course checkout for the given cart courses in one transaction:
 * creates the preflight row and returns the checkout URL / signed fields. On
 * return the backend enrolls the courses + clears them from the cart.
 *
 * Mirrors backend `coursesCheckout`.
 */
export const mutateCoursesCheckout = async ({
    mutation = MutationCoursesCheckout.Mutation1,
    request,
    debug,
    signal,
}: MutateCoursesCheckoutParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateCoursesCheckoutResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
