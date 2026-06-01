"use client"

import React, {
    useMemo,
} from "react"
import {
    useTranslations,
} from "next-intl"
import {
    AccordionSkeleton,
    SkeletonText,
} from "@/components/reuseable"

/** Props for {@link ModuleSidebarSkeleton}. */
export interface ModuleSidebarSkeletonProps {
    /** Number of placeholder module rows to render. */
    count: number
}

/**
 * Loading placeholder for {@link ModuleSidebar}.
 *
 * Uses {@link AccordionSkeleton} (no interactive accordion) to mirror
 * {@link ModuleAccordion}: first row expanded with content lines, rest collapsed.
 * @param props - the number of placeholder rows to render
 */
export const ModuleSidebarSkeleton = ({
    count,
}: ModuleSidebarSkeletonProps) => {
    const t = useTranslations()
    const items = useMemo(
        () => Array.from({ length: count }, (_, index) => ({
            ariaLabel: t("module.aria", { index: index + 1 }),
            expanded: index === 0,
            titleSize: "base" as const,
            showIndicator: true,
        })),
        [
            count,
            t,
        ],
    )
    const renderExpandedBody = useMemo(
        () => () => (
            <div>
                <SkeletonText size="sm" className="w-3/4" />
                <div className="h-2" />
                <SkeletonText size="xs" className="w-full" />
                <SkeletonText size="xs" className="w-3/4" />
            </div>
        ),
        [],
    )
    return (
        <AccordionSkeleton
            variant="default"
            items={items}
            renderExpandedBody={renderExpandedBody}
        />
    )
}
