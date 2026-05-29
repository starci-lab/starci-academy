"use client"

import { useCallback, useState } from "react"
import { useOverlayState } from "@heroui/react"
import type { PaymentContext } from "@/modules/types"

/**
 * Core singleton overlay state for the payment overlay.
 *
 * Wraps the HeroUI overlay handle with a {@link PaymentContext} so a single
 * modal can serve multiple purchase flows (course enroll, AI subscription).
 * The opener calls `open(context)` to both stash the flow/payload and reveal
 * the modal; the modal reads `context` to pick the right SWR mutation.
 * @returns overlay handle (`isOpen`, `setOpen`, `close`) plus `context` and a
 * context-aware `open`.
 */
export const usePaymentOverlayStateCore = () => {
    // underlying HeroUI open/close state
    const overlay = useOverlayState()
    // the purchase flow + payload the modal should run on method click
    const [context, setContext] = useState<PaymentContext | null>(null)

    // stash the context first so the modal renders the right flow, then open
    const open = useCallback(
        (nextContext: PaymentContext) => {
            setContext(nextContext)
            overlay.open()
        },
        [
            overlay,
        ],
    )

    // expose the HeroUI handle but override `open` with the context-aware one
    return {
        ...overlay,
        open,
        context,
    }
}
