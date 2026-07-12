"use client"

import React from "react"
import { CourseCard } from "@/components/blocks/cards/CourseCard"
import { AddToCartButton } from "@/components/features/cart/AddToCartButton"
import { useQueryCoursePricePreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursePricePreviewSwr"
import type { CourseEntity } from "@/modules/types/entities/course"

/** Props for {@link CatalogCourseCard}. */
export interface CatalogCourseCardProps {
    /** The catalog course to render. */
    course: CourseEntity
    /** Card layout — roomy `"grid"` (default) or compact `"line"` row. */
    layout?: "grid" | "line"
}

/**
 * Feature wrapper that enriches a catalog {@link CourseCard} with the viewer's
 * loyalty-discounted price so the catalog shows the SAME personalised price as the
 * rest of the app. Fetches `coursePricePreview` per course (disabled for guests, who
 * then see the phase price). Keeps {@link CourseCard} a pure presentational block.
 *
 * @param props - {@link CatalogCourseCardProps}
 */
export const CatalogCourseCard = ({ course, layout = "grid" }: CatalogCourseCardProps) => {
    const { data, isLoading } = useQueryCoursePricePreviewSwr(course.id)
    return (
        <CourseCard
            course={course}
            loyaltyPriceVnd={data?.discountedPriceVnd ?? null}
            loyaltyOriginalVnd={data?.originalPriceVnd ?? null}
            // 2026-07-12: without this, every card briefly shows the phase price
            // then silently swaps to the loyalty price once the preview lands —
            // N simultaneous jumps across the catalog grid.
            loyaltyPending={isLoading && !data}
            layout={layout}
            action={<AddToCartButton course={course} variant="secondary" iconOnly />}
        />
    )
}
