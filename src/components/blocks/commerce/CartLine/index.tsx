"use client"

import React, { useCallback } from "react"
import { GraduationCapIcon, TrashIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { IdentityTile } from "@/components/atoms/display/IdentityTile"
import { SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { PriceTagInline } from "@/components/blocks/commerce/PriceTag"
import { FillAvailable } from "@/components/frames/FillAvailable"
import { StackH, StackV } from "@/components/frames/Stack"
import { useCourseDisplayPrice } from "@/hooks/useCourseDisplayPrice"
import { pathConfig } from "@/resources/path"
import type { CartItemEntity } from "@/modules/api/graphql/queries/types/my-cart"
import type { CoursesCheckoutPreviewLine } from "@/modules/api/graphql/queries/types/courses-checkout-preview"
import type { SkeletonProps } from "@/components/frames/_slot"

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
 * ({@link IdentityTile}), its title linking to the course page, the per-course price
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

    const TitleColumn = ({ isSkeleton }: SkeletonProps) => (
        <StackV
            gap={1}
            isSkeleton={isSkeleton}
            principle="name-handle"
            explain="Title over price at the tight name-handle step — not title-subtitle, because the second line is a price control rather than a descriptive subtitle."
            items={[
                () => (
                    <Typography
                        size="sm"
                        weight="medium"
                        truncate
                        text={item.course.title}
                        isLink
                        onPress={onView}
                        color="default"
                        underlineOnHover
                    />
                ),
                () => <PriceTagInline discounted={discounted} original={original} />,
            ]}
        />
    )

    return (
        <SurfaceListCardItem identity={{ tier: "block", component: "CartLine" }}>
            <StackH
                gap={3}
                principle="flex-action"
                explain="Cover, title column, and remove control share one action row — not identity, because the remove button is an action peer rather than an identity cluster."
                items={[
                    () => (
                        <IdentityTile
                            size="sm"
                            tone="accent"
                            icon={GraduationCapIcon}
                            src={item.course.coverImageUrl}
                            alt={item.course.title}
                        />
                    ),
                    () => (
                        <FillAvailable
                            at="base"
                            body={TitleColumn}
                        />
                    ),
                    () => (
                        <Button
                            isIconOnly
                            prefixIcon={TrashIcon}
                            variant="danger-soft"
                            ariaLabel={t("cart.remove")}
                            isDisabled={isMutating}
                            onPress={() => onRemove(item.courseId)}
                        />
                    ),
                ]}
            />
        </SurfaceListCardItem>
    )
}
