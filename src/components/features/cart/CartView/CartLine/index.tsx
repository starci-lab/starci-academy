"use client"

import React, { useCallback } from "react"
import { Button, Link, Typography } from "@heroui/react"
import { BookOpenIcon, TrashIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"
import { useCourseDisplayPrice } from "@/components/features/cart/hooks/useCourseDisplayPrice"
import { pathConfig } from "@/resources/path"
import type { CartItemEntity } from "@/modules/api/graphql/queries/types/my-cart"
import type { CoursesCheckoutPreviewLine } from "@/modules/api/graphql/queries/types/courses-checkout-preview"

/** Props for {@link CartLine}. */
export interface CartLineProps {
    /** The cart row to render. */
    item: CartItemEntity
    /**
     * This course's checkout-preview line (real charged vs list price, already
     * display-ready). Undefined while the preview loads or on error → the line
     * falls back to the entity-derived display price.
     */
    previewLine?: CoursesCheckoutPreviewLine
    /** Remove this course from the cart. */
    onRemove: (courseId: string) => void
    /** Disables the remove button while a cart write is in flight. */
    isMutating: boolean
}

/**
 * One shopping-cart line (a {@link SurfaceListCardItem}): the course cover
 * ({@link IconTile}), its title linking to the course page, the per-course price
 * ({@link PriceTag}) — the real charged vs list price from the checkout preview,
 * falling back to the entity display price while the preview loads — and a trash
 * button to remove it. List-item component: props-only; the parent
 * {@link import("..").CartView} owns the data + handlers.
 *
 * @param props - {@link CartLineProps}
 */
export const CartLine = ({ item, previewLine, onRemove, isMutating }: CartLineProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { priceVnd, originalVnd } = useCourseDisplayPrice(item.course)

    // prefer the preview (real charged + list, display-ready); fall back to the
    // entity-derived display price until the preview resolves / on error.
    const discounted = previewLine?.chargedVnd ?? priceVnd
    const original = previewLine?.listVnd ?? originalVnd

    const onView = useCallback(
        () => router.push(pathConfig().locale(locale).course(item.course.displayId).build()),
        [router, locale, item.course.displayId],
    )

    return (
        <SurfaceListCardItem>
            <div className="flex items-center gap-3">
                <IconTile
                    size="sm"
                    tone="accent"
                    icon={<BookOpenIcon />}
                    src={item.course.coverImageUrl}
                    alt={item.course.title}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Link onPress={onView} className="min-w-0 text-foreground no-underline hover:underline">
                        <Typography type="body-sm" weight="medium" truncate title={item.course.title}>
                            {item.course.title}
                        </Typography>
                    </Link>
                    <PriceTag discounted={discounted} original={original} size="sm" />
                </div>
                <Button
                    isIconOnly
                    variant="tertiary"
                    aria-label={t("cart.remove")}
                    isDisabled={isMutating}
                    onPress={() => onRemove(item.courseId)}
                    className="shrink-0"
                >
                    <TrashIcon className="size-5" />
                </Button>
            </div>
        </SurfaceListCardItem>
    )
}
