import useSWRMutation from "swr/mutation"
import { mutateAddToCart } from "@/modules/api/graphql/mutations/mutation-add-to-cart"
import { type AddToCartRequest } from "@/modules/api/graphql/mutations/types/cart"

type MutateAddToCartResult = Awaited<ReturnType<typeof mutateAddToCart>>

/**
 * SWR mutation wrapper for {@link mutateAddToCart} (Bearer from Keycloak).
 */
export const useMutateAddToCartSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateAddToCartResult,
        Error,
        string,
        AddToCartRequest
    >(
        "MUTATE_ADD_TO_CART_SWR",
        async (_key, { arg }) => {
            return mutateAddToCart({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
