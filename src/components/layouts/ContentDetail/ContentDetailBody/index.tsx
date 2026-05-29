"use client"

import React, {
    useMemo,
} from "react"
import _ from "lodash"
import {
    MarkdownContent,
    ReferenceLinks,
} from "@/components/reuseable"
import {
    useAppSelector,
} from "@/redux"
import type {
    ContentDetailReferences,
} from "../types"

/**
 * Markdown body plus the optional reference-links section for a public article.
 *
 * Self-contained section (single-use): reads the article body + references from
 * the `publicContent` redux slice and derives the order-sorted reference list
 * itself, so the container renders `<ContentDetailBody />` with no props.
 */
export const ContentDetailBody = () => {
    const body = useAppSelector((state) => state.publicContent.entity?.body)
    const rawReferences = useAppSelector((state) => state.publicContent.entity?.references)

    /** References cloned + sorted ascending by order index for stable display. */
    const references = useMemo<ContentDetailReferences>(
        () => _.cloneDeep(rawReferences ?? []).sort(
            (a, b) => a.orderIndex - b.orderIndex,
        ),
        [
            rawReferences,
        ],
    )
    return (
        <>
            <div className="text-sm text-muted overflow-x-auto">
                <MarkdownContent markdown={body || "No content."} />
            </div>

            {references.length > 0 && (
                <>
                    <div className="h-6" />
                    <ReferenceLinks
                        references={references}
                        titleKey="reference.title"
                    />
                </>
            )}
        </>
    )
}
