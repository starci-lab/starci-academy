"use client"

import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { AuthenticationModalTab, setAuthenticationModalTab } from "@/redux/slices/tabs"
import {
    useAuthenticationOverlayState,
    useMiniCartOverlayState,
    usePendingCartIntent,
} from "@/hooks/zustand/overlay/hooks"
import { useCart } from "./useCart"

/** Result of {@link useCartEntry}. */
export interface UseCartEntryResult {
    /**
     * Add a course to the cart. Authenticated → adds (the drawer opens on success).
     * Guest → stashes the intent + opens the auth modal; it replays after sign-in.
     */
    addToCartOrAuth: (courseId: string) => void
    /**
     * Open the mini-cart. Authenticated → opens the drawer. Guest → stashes an
     * "open" intent + opens the auth modal; the drawer opens after sign-in.
     */
    openCartOrAuth: () => void
}

/**
 * Guest-aware cart entry points shared by the nav cart button and the catalog /
 * detail "add to cart" affordances. For a signed-out viewer any cart action opens
 * the {@link import("@/components/modals/AuthenticationModal").AuthenticationModal}
 * (sign-in tab) and remembers the intended action as a pending intent; the
 * {@link import("@/components/drawers/MiniCartDrawer").MiniCartDrawer} replays it once
 * the viewer authenticates (adds the course + opens, or just opens the drawer). Reads
 * auth state + the cart directly (no prop-drilling).
 *
 * @returns {@link UseCartEntryResult}
 */
export const useCartEntry = (): UseCartEntryResult => {
    const dispatch = useAppDispatch()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const { addToCart } = useCart()
    const { open: openMiniCart } = useMiniCartOverlayState()
    const { open: openAuthentication } = useAuthenticationOverlayState()
    const { setPendingCartIntent } = usePendingCartIntent()

    /** Open the auth modal on the sign-in tab (for a deferred guest action). */
    const openAuth = useCallback(() => {
        dispatch(setAuthenticationModalTab(AuthenticationModalTab.SignIn))
        openAuthentication()
    }, [dispatch, openAuthentication])

    const addToCartOrAuth = useCallback(
        (courseId: string) => {
            if (authenticated) {
                void addToCart(courseId)
                return
            }
            setPendingCartIntent({ type: "add", courseId })
            openAuth()
        },
        [authenticated, addToCart, setPendingCartIntent, openAuth],
    )

    const openCartOrAuth = useCallback(() => {
        if (authenticated) {
            openMiniCart()
            return
        }
        setPendingCartIntent({ type: "open" })
        openAuth()
    }, [authenticated, openMiniCart, setPendingCartIntent, openAuth])

    return { addToCartOrAuth, openCartOrAuth }
}
