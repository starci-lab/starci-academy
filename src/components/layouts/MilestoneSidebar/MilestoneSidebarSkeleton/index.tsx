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

/** Props for {@link MilestoneSidebarSkeleton}. */
export interface MilestoneSidebarSkeletonProps {
    /** Number of placeholder milestone rows to render. */
    count: number
}

/**
 * Loading placeholder for the milestone list inside {@link MilestoneSidebar}.
 *
 * Mirrors {@link ModuleSidebarSkeleton}: renders only the list (the search +
 * separator stay mounted in the sidebar), using {@link AccordionSkeleton} so the
 * layout matches {@link MilestoneAccordion} — first row expanded with task lines.
 * @param props - the number of placeholder rows to render
 */
export const MilestoneSidebarSkeleton = ({
    count,
}: MilestoneSidebarSkeletonProps) => {
    const t = useTranslations()
    const items = useMemo(
        () => Array.from({ length: count }, (_, index) => ({
            ariaLabel: t("finalProject.aria", { index: index + 1 }),
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
                <div className="h-1.5" />
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
