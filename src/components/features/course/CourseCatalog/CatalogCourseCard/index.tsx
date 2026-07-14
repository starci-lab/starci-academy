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
            // no `iconOnly` — the view CTA is now a real primary Button (not a
            // subtle Link), so this secondary cart action gets a label+icon
            // too instead of reading as a stray icon (starci-fe-block-variants
            // round-2 direction "C"). `flex-1` so it splits the action row
            // evenly with the primary "view/continue" button — without it the
            // row was uneven card-to-card (button width = own content only,
            // not the row's real available width).
            action={(
                <AddToCartButton
                    course={course}
                    isEnrolled={course.isEnrolled ?? undefined}
                    variant="secondary"
                    className="flex-1"
                />
            )}
        />
    )
}
