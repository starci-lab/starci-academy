"use client"

import React, { useCallback, useMemo } from "react"
import { Button, Spinner, Tooltip, cn } from "@heroui/react"
import { ShoppingCartIcon, XIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useCart } from "@/components/features/cart/hooks/useCart"
import { useCartEntry } from "@/components/features/cart/hooks/useCartEntry"
import type { CourseEntity } from "@/modules/types/entities/course"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link AddToCartButton}. */
export interface AddToCartButtonProps extends WithClassNames<undefined> {
    /** The course this button adds to / removes from the cart. */
    course: CourseEntity
    /**
     * Whether the viewer already owns (is enrolled in) this course. When true the
     * button hides — you cannot re-buy a course you own. Omit when unknown (catalog).
     */
    isEnrolled?: boolean
    /**
     * Button variant. Default `"tertiary"` (a lone action beside a course card's
     * View link). Pass `"secondary"` when it sits next to a primary CTA (course
     * detail Enroll), per the button-variant rule.
     */
    variant?: "tertiary" | "secondary"
    /** Render full-width (course-detail CTA cluster). */
    fullWidth?: boolean
    /**
     * Compact icon-only rendering (catalog card footer) — a cart/check/trash icon
     * button with a tooltip, so it doesn't compete with the "View course" link.
     * The detail rail keeps the labelled text button (omit this).
     */
    iconOnly?: boolean
}

/**
 * "Add to cart" toggle for a course. Hides itself for FREE courses or courses the
 * viewer already owns (`isEnrolled`). When already in the cart it flips to a single
 * "Remove from cart" button (leading X icon, no trailing icon) — `variant="danger-soft"`
 * regardless of the caller's `variant` prop (removing a cart line IS a destructive
 * toggle, just a repeated/low-drama one — same family as the repeatable-item delete
 * button, not a lone `danger`-solid action; teacher: "ý là danger-soft ấy trò", after
 * an earlier pass over-corrected to plain `secondary`). Adding routes through
 * {@link useCartEntry} so a GUEST is sent to the auth modal (with the add replayed
 * after sign-in) instead of hitting the auth-only cart mutation; removing (only
 * reachable once signed in + in cart) goes straight to {@link useCart}. `iconOnly`
 * renders a compact tooltip'd icon button.
 *
 * @param props - {@link AddToCartButtonProps}
 */
export const AddToCartButton = ({
    course,
    isEnrolled = false,
    variant = "tertiary",
    fullWidth = false,
    iconOnly = false,
    className,
}: AddToCartButtonProps) => {
    const t = useTranslations()
    const { isInCart, removeFromCart, isMutating } = useCart()
    const { addToCartOrAuth } = useCartEntry()

    // paid = the active-phase price (or the list price) is > 0; free courses are
    // enrolled directly and never enter the cart.
    const isPaid = useMemo(() => {
        const phasePrice = course.pricingPhases?.find(
            (phase) => phase.phase === course.currentPhase,
        )?.price
        const price = phasePrice ?? course.originalPrice ?? 0
        return price > 0
    }, [course.pricingPhases, course.currentPhase, course.originalPrice])

    const inCart = isInCart(course.id)

    const onToggle = useCallback(
        () => {
            if (inCart) {
                void removeFromCart(course.id)
            } else {
                addToCartOrAuth(course.id)
            }
        },
        [inCart, addToCartOrAuth, removeFromCart, course.id],
    )

    // nothing to buy → no cart affordance
    if (isEnrolled || !isPaid) {
        return null
    }

    // compact icon-only (catalog card): a tooltip'd cart/remove icon button.
    if (iconOnly) {
        return (
            <Tooltip>
                <Tooltip.Trigger>
                    <Button
                        isIconOnly
                        variant={inCart ? "danger-soft" : variant}
                        isPending={isMutating}
                        onPress={onToggle}
                        aria-label={inCart ? t("cart.remove") : t("cart.tooltipAdd")}
                        className={cn(className)}
                    >
                        {isMutating ? (
                            <Spinner size="sm" color="current" />
                        ) : inCart ? (
                            <XIcon className="size-5" />
                        ) : (
                            <ShoppingCartIcon className="size-5" />
                        )}
                    </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>{inCart ? t("cart.remove") : t("cart.tooltipAdd")}</Tooltip.Content>
            </Tooltip>
        )
    }

    return (
        <Button
            variant={inCart ? "danger-soft" : variant}
            fullWidth={fullWidth}
            isPending={isMutating}
            onPress={onToggle}
            className={cn(className)}
        >
            {isMutating ? (
                <Spinner size="sm" color="current" />
            ) : inCart ? (
                <XIcon className="size-5" />
            ) : (
                <ShoppingCartIcon className="size-5" />
            )}
            {inCart ? t("cart.remove") : t("cart.add")}
        </Button>
    )
}
