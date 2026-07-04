import useSWRMutation from "swr/mutation"
import { mutateRemoveFromCart } from "@/modules/api/graphql/mutations/mutation-remove-from-cart"
import { type RemoveFromCartRequest } from "@/modules/api/graphql/mutations/types/cart"

type MutateRemoveFromCartResult = Awaited<ReturnType<typeof mutateRemoveFromCart>>

/**
 * SWR mutation wrapper for {@link mutateRemoveFromCart} (Bearer from Keycloak).
 */
export const useMutateRemoveFromCartSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateRemoveFromCartResult,
        Error,
        string,
        RemoveFromCartRequest
    >(
        "MUTATE_REMOVE_FROM_CART_SWR",
        async (_key, { arg }) => {
            return mutateRemoveFromCart({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
