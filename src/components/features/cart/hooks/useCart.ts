"use client"

import { useCallback, useMemo } from "react"
import { useSWRConfig } from "swr"
import { useTranslations } from "next-intl"
import { QUERY_MY_CART_SWR, useQueryMyCartSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCartSwr"
import { useMutateAddToCartSwr } from "@/hooks/swr/api/graphql/mutations/useMutateAddToCartSwr"
import { useMutateRemoveFromCartSwr } from "@/hooks/swr/api/graphql/mutations/useMutateRemoveFromCartSwr"
import { useMutateClearCartSwr } from "@/hooks/swr/api/graphql/mutations/useMutateClearCartSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { useMiniCartOverlayState } from "@/hooks/zustand/overlay/hooks"
import type { CartItemEntity } from "@/modules/api/graphql/queries/types/my-cart"

/** Result of {@link useCart}. */
export interface UseCartResult {
    /** Every cart row with its full course. */
    items: Array<CartItemEntity>
    /** Number of courses in the cart. */
    count: number
    /** True while the first cart load is in flight (no cached data yet). */
    isLoading: boolean
    /** SWR fetch error (only when there is no cached data to fall back to). */
    error: unknown
    /** Whether a cart write is in flight (disables the affordance while true). */
    isMutating: boolean
    /** Whether the given course is already in the cart. */
    isInCart: (courseId: string) => boolean
    /** Add a course to the cart (toasted), then revalidate. */
    addToCart: (courseId: string) => Promise<boolean>
    /** Remove a course from the cart (toasted), then revalidate. */
    removeFromCart: (courseId: string) => Promise<boolean>
    /** Empty the cart (toasted), then revalidate. */
    clearCart: () => Promise<boolean>
    /** Force a cart refetch (e.g. on return from the gateway). */
    refresh: () => void
}

/**
 * Facade over the shopping-cart data layer: the `myCart` list plus toasted
 * add / remove / clear mutations that revalidate the shared cart key. Any
 * component reads this directly (no prop-drilling) so the navbar badge, course
 * cards, and the cart page all stay in sync off one SWR cache.
 *
 * @returns {@link UseCartResult}
 */
export const useCart = (): UseCartResult => {
    const t = useTranslations()
    const { mutate } = useSWRConfig()
    const cartSwr = useQueryMyCartSwr()
    const addSwr = useMutateAddToCartSwr()
    const removeSwr = useMutateRemoveFromCartSwr()
    const clearSwr = useMutateClearCartSwr()
    const runGraphQL = useGraphQLWithToast()
    const { open: openMiniCart } = useMiniCartOverlayState()

    const items = useMemo(() => cartSwr.data ?? [], [cartSwr.data])
    const count = items.length
    const isLoading = cartSwr.isLoading && items.length === 0
    const isMutating = addSwr.isMutating || removeSwr.isMutating || clearSwr.isMutating

    // revalidate the shared cart key after any write (keeps navbar/cards/page in sync)
    const refresh = useCallback(() => { void mutate([QUERY_MY_CART_SWR]) }, [mutate])

    const isInCart = useCallback(
        (courseId: string) => items.some((item) => item.courseId === courseId),
        [items],
    )

    const addToCart = useCallback(
        async (courseId: string) => {
            // no success toast: the mini-cart drawer IS the persistent confirmation
            // (per the cart UX brainstorm); errors are still toasted by the wrapper.
            const success = await runGraphQL(
                async () => {
                    const response = await addSwr.trigger({ courseId })
                    if (!response.data?.addToCart) {
                        throw new Error(response.error?.message)
                    }
                    return response.data.addToCart
                },
            )
            if (success) {
                refresh()
                openMiniCart()
            }
            return success
        },
        [addSwr, runGraphQL, refresh, openMiniCart],
    )

    const removeFromCart = useCallback(
        async (courseId: string) => {
            const success = await runGraphQL(
                async () => {
                    const response = await removeSwr.trigger({ courseId })
                    if (!response.data?.removeFromCart) {
                        throw new Error(response.error?.message)
                    }
                    return response.data.removeFromCart
                },
                { successMessage: t("cart.removed") },
            )
            if (success) {
                refresh()
            }
            return success
        },
        [removeSwr, runGraphQL, refresh, t],
    )

    const clearCart = useCallback(
        async () => {
            const success = await runGraphQL(
                async () => {
                    const response = await clearSwr.trigger()
                    if (!response.data?.clearCart) {
                        throw new Error(response.error?.message)
                    }
                    return response.data.clearCart
                },
                { successMessage: t("cart.cleared") },
            )
            if (success) {
                refresh()
            }
            return success
        },
        [clearSwr, runGraphQL, refresh, t],
    )

    return {
        items,
        count,
        isLoading,
        error: cartSwr.error,
        isMutating,
        isInCart,
        addToCart,
        removeFromCart,
        clearCart,
        refresh,
    }
}
