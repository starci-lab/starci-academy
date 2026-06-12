"use client"

import React from "react"
import {
    Skeleton,
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types"
import {
    SkeletonParagraph,
    SkeletonText,
} from "@/components/reuseable"

/** Layout variant mirrored from {@link ContentBody} (V2 vs legacy). */
export type ContentBodySkeletonVariant = "v2" | "legacy"

export type ContentBodySkeletonProps = WithClassNames<undefined> & {
    /** `v2` — article (+ references when `showReferences`); `legacy` — toolbar + article. */
    variant?: ContentBodySkeletonVariant
    /** When false, V2 skips the references block. @default true */
    showReferences?: boolean
}

/**
 * Section blocks (heading + body paragraph) standing in for the long-form lesson
 * body. Extra blocks also absorb the vertical space of the removed language-tab
 * row, which not every content renders.
 */
const MARKDOWN_ARTICLE_SECTIONS: Array<{ headingWidth: string; lines: number }> = [
    { headingWidth: "w-2/5", lines: 4 },
    { headingWidth: "w-1/3", lines: 5 },
    { headingWidth: "w-1/4", lines: 4 },
    { headingWidth: "w-2/5", lines: 6 },
    { headingWidth: "w-1/3", lines: 3 },
]

/**
 * Markdown article block: section headings (`text-xl` in prose) + body paragraphs.
 */
const MarkdownArticleSkeleton = () => (
    <>
        {MARKDOWN_ARTICLE_SECTIONS.map((section, index) => (
            <React.Fragment key={index}>
                {/* gap before each section heading except the first */}
                {index > 0 ? <div className="h-3" /> : null}
                <SkeletonText size="xl" width={section.headingWidth} />
                <div className="h-1.5" />
                <SkeletonParagraph size="sm" lines={section.lines} />
            </React.Fragment>
        ))}
    </>
)

/**
 * References block mirroring {@link ReferenceLinks} (title + link rows).
 */
const ReferenceLinksSkeleton = () => (
    <>
        <SkeletonText size="base" width="w-32" />
        <div className="h-3" />
        <div className="flex flex-col gap-3">
            {Array.from({ length: 2 }).map((_unused, index) => (
                <div key={index} className="flex flex-wrap items-center gap-1.5">
                    <Skeleton className="h-[14px] w-24 rounded-sm" />
                    <Skeleton className="h-[14px] w-4 rounded-sm" />
                    <Skeleton className="h-[14px] w-3/5 rounded-sm" />
                </div>
            ))}
        </div>
    </>
)

/**
 * Icon action row mirroring {@link ActionToolbar} (bookmark, share, fullscreen).
 */
const ActionToolbarSkeleton = () => (
    <div className="flex items-center gap-1.5">
        {Array.from({ length: 3 }).map((_unused, index) => (
            <Skeleton
                key={index}
                className="size-9 rounded-xl"
            />
        ))}
    </div>
)

/**
 * Loading placeholder for {@link ContentBody} / {@link ContentBodyV2} / {@link ContentBodyLegacy}.
 * @param props - {@link ContentBodySkeletonProps}
 */
export const ContentBodySkeleton = ({
    className,
    variant = "v2",
    // showReferences = true,
}: ContentBodySkeletonProps) => {
    if (variant === "legacy") {
        return (
            <div className={cn("flex flex-col text-sm text-muted", className)}>
                <ActionToolbarSkeleton />
                <div className="h-3" />
                <MarkdownArticleSkeleton />
                <div className="h-6" />
                <ReferenceLinksSkeleton />
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col overflow-x-auto text-sm text-muted", className)}>
            <MarkdownArticleSkeleton />
            {/* {
                showReferences ? (
                    <>
                        <div className="h-6" />
                        <ReferenceLinksSkeleton />
                    </>
                ) : null
            } */}
        </div>
    )
}
