"use client"

import React from "react"
import {
    Button,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    ArrowRightIcon,
    GraduationCapIcon,
} from "@phosphor-icons/react"
import {
    usePricingRows,
} from "../hooks/usePricingRows"
import {
    useCourseEnrollment,
} from "../hooks/useCourseEnrollment"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { StickyBottomBar } from "@/components/blocks/layout/StickyBottomBar"
import { useAppSelector } from "@/redux/hooks"
import { useQueryCoursePricePreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursePricePreviewSwr"

/** Props for {@link CourseMobileEnrollBar}. */
export type CourseMobileEnrollBarProps = WithClassNames<undefined>

/**
 * Mobile-only sticky bottom bar (md:hidden): the active price + a single primary
 * action that's always reachable while scrolling the landing on a phone. Reuses
 * the {@link StickyBottomBar} block chrome + the shared pricing / enrollment hooks.
 *
 * @param props - optional className (placement only).
 */
export const CourseMobileEnrollBar = ({ className }: CourseMobileEnrollBarProps) => {
    const t = useTranslations()
    const { active } = usePricingRows()
    const { isEnrolled, onEnroll, onContinueLearning } = useCourseEnrollment()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    // viewer's loyalty price (matches the rail / catalog) — fall back to phase price.
    const { data: preview, isLoading: previewLoading } = useQueryCoursePricePreviewSwr(courseId ?? null)
    const hasLoyalty = preview != null && preview.discountPercent > 0
    // same jump as CoursePricingRail (2026-07-12): don't flash the static price
    // before the loyalty preview resolves — skeleton the price line instead.
    const previewPending = previewLoading && !preview

    return (
        <StickyBottomBar className={className}>
            <div className="flex items-center justify-between gap-3">
                {previewPending ? (
                    <Skeleton.Typography type="body" width="1/4" />
                ) : hasLoyalty && preview ? (
                    <PriceTag
                        discounted={preview.discountedPriceVnd}
                        original={preview.originalPriceVnd}
                        size="sm"
                    />
                ) : active ? (
                    <PriceTag
                        discounted={active.priceVnd}
                        original={active.listPriceVnd}
                        size="sm"
                    />
                ) : null}
                {isEnrolled ? (
                    <Button variant="primary" onPress={onContinueLearning}>
                        <GraduationCapIcon className="size-5" />
                        {t("course.continueLearning")}
                    </Button>
                ) : (
                    <Button variant="primary" onPress={onEnroll}>
                        {t("course.enroll")}
                        <ArrowRightIcon className="size-5" />
                    </Button>
                )}
            </div>
        </StickyBottomBar>
    )
}
