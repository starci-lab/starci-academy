"use client"

import React from "react"
import { Badge, Button, cn } from "@heroui/react"
import { ShoppingCartIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useCart } from "@/components/features/cart/hooks/useCart"
import { useCartEntry } from "@/components/features/cart/hooks/useCartEntry"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Largest cart count rendered verbatim on the badge before showing "9+". */
const MAX_BADGE = 9

/**
 * Props for {@link CartButton}.
 */
export type CartButtonProps = WithClassNames<undefined>

/**
 * Navbar shopping-cart button: a tertiary icon button ALWAYS shown (guests included,
 * so the cart is discoverable) with an accent count badge only when the cart is
 * non-empty. Tapping opens the mini-cart drawer for a signed-in viewer, or the
 * authentication modal for a guest (remembering the "open cart" intent to replay
 * after sign-in). Reads {@link useCart} + {@link useCartEntry} directly (no props).
 * @param props - optional root class name (placement only)
 */
export const CartButton = ({ className }: CartButtonProps) => {
    const t = useTranslations()
    const { count } = useCart()
    const { openCartOrAuth } = useCartEntry()

    /** Badge label, capped at {@link MAX_BADGE} (e.g. "9+"). */
    const badgeLabel = count > MAX_BADGE ? `${MAX_BADGE}+` : `${count}`

    return (
        <Button
            isIconOnly
            variant="tertiary"
            className={cn("rounded-full", className)}
            aria-label={t("cart.title")}
            onPress={openCartOrAuth}
        >
            {count > 0 ? (
                <Badge.Anchor>
                    <ShoppingCartIcon className="size-5" />
                    <Badge size="sm" color="accent">{badgeLabel}</Badge>
                </Badge.Anchor>
            ) : (
                <ShoppingCartIcon className="size-5" />
            )}
        </Button>
    )
}
