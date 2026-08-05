"use client"

import React, {
    useMemo,
} from "react"
import {
    useTranslations,
} from "next-intl"
import { AccordionSkeleton } from "@/components/blocks/skeleton/AccordionSkeleton"
import { SkeletonText } from "@/components/blocks/skeleton/SkeletonText"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Number of placeholder modules shown while the content-map loads. */
const SKELETON_MODULE_COUNT = 3

/** Props for {@link ContentMapSkeleton}. */
export type ContentMapSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link import("../").ContentMap}: mirrors the
 * {@link OutlineRail} accordion — collapsed module rows (title bar + indicator)
 * with only the first expanded to show its lesson lines — via
 * {@link AccordionSkeleton}, matching its sibling {@link MilestoneOutlineSkeleton}
 * so the rail does not jump when the outline arrives.
 *
 * @param props - {@link ContentMapSkeletonProps}
 */
export const ContentMapSkeleton = ({ className }: ContentMapSkeletonProps) => {
    const t = useTranslations()
    const items = useMemo(
        () => Array.from({ length: SKELETON_MODULE_COUNT }, (_, index) => ({
            ariaLabel: t("module.aria", { index: index + 1 }),
            expanded: index === 0,
            titleSize: "base" as const,
            showIndicator: true,
        })),
        [t],
    )
    const renderExpandedBody = useMemo(
        () => () => (
            <div className="flex flex-col gap-2">
                <SkeletonText size="sm" className="w-3/4" />
                <SkeletonText size="xs" className="w-full" />
                <SkeletonText size="xs" className="w-3/4" />
            </div>
        ),
        [],
    )
    return (
        <AccordionSkeleton
            className={className}
            items={items}
            renderExpandedBody={renderExpandedBody}
        />
    )
}
