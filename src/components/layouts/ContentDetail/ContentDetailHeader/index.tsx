"use client"

import { Clock as ClockIcon } from "@gravity-ui/icons"
import React from "react"
import {
    useAppSelector,
} from "@/redux"

/**
 * Title, description and reading-time line for a public content article.
 *
 * Self-contained section (single-use): reads its own article metadata from the
 * `publicContent` redux slice (kept in sync from the `[contentId]` route param),
 * so the container renders `<ContentDetailHeader />` with no props. No logic.
 */
export const ContentDetailHeader = () => {
    const title = useAppSelector((state) => state.publicContent.entity?.title)
    const description = useAppSelector((state) => state.publicContent.entity?.description)
    const minutesRead = useAppSelector((state) => state.publicContent.entity?.minutesRead)
    return (
        <div className="mb-6">
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="h-1.5" />
            <p className="text-sm text-muted">{description}</p>
            <div className="h-3" />
            <div className="flex items-center gap-1.5 text-sm text-muted">
                <ClockIcon className="size-4" />
                <span>{minutesRead} min read</span>
            </div>
        </div>
    )
}
