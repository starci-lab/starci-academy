import useSWR from "swr"
import { queryMyCart } from "@/modules/api/graphql/queries/query-my-cart"
import type { CartItemEntity } from "@/modules/api/graphql/queries/types/my-cart"
import { useAppSelector } from "@/redux/hooks"

/** Shared SWR key for the viewer's cart — mutate this after add/remove/clear. */
export const QUERY_MY_CART_SWR = "QUERY_MY_CART_SWR"

/**
 * SWR wrapper for {@link queryMyCart}. `data` is every cart row with its full
 * course, or `[]`. User-scoped — only runs once the viewer is authenticated.
 */
export const useQueryMyCartSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<Array<CartItemEntity>>(
        authenticated ? [QUERY_MY_CART_SWR] : null,
        async () => {
            const result = await queryMyCart({})
            return result.data?.myCart?.data ?? []
        },
    )
}
