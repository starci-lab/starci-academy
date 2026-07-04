import useSWRMutation from "swr/mutation"
import { mutateClearCart } from "@/modules/api/graphql/mutations/mutation-clear-cart"

type MutateClearCartResult = Awaited<ReturnType<typeof mutateClearCart>>

/**
 * SWR mutation wrapper for {@link mutateClearCart} (no request body; Bearer from Keycloak).
 */
export const useMutateClearCartSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateClearCartResult,
        Error,
        string
    >(
        "MUTATE_CLEAR_CART_SWR",
        async () => {
            return mutateClearCart({ request: undefined })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
