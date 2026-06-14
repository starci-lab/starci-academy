"use client"

import React from "react"
import {
    MarkdownContent,
} from "@/components/reuseable"
import {
    useAppSelector,
} from "@/redux"

/**
 * Markdown body for a public article.
 *
 * Self-contained section (single-use): reads the article body from the
 * `publicContent` redux slice, so the container renders `<ContentDetailBody />`
 * with no props.
 */
export const ContentDetailBody = () => {
    const body = useAppSelector((state) => state.publicContent.entity?.body)
    return (
        <div className="text-sm text-muted overflow-x-auto">
            <MarkdownContent markdown={body || "No content."} />
        </div>
    )
}
