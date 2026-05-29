"use client"

import React from "react"
import {
    Skeleton,
} from "@heroui/react"
import {
    BOOKMARK_SKELETON_PLACEHOLDERS,
} from "../constants"

/**
 * Loading placeholder shown while the saved-contents query is in flight.
 *
 * Presentational: a title bar plus a fixed set of card skeletons, no logic.
 */
export const BookmarksSkeleton = () => {
    return (
        <div className="flex flex-col gap-4 p-6 max-w-4xl mx-auto">
            <Skeleton className="h-8 w-1/3 rounded-lg" />
            {BOOKMARK_SKELETON_PLACEHOLDERS.map((placeholder) => (
                <Skeleton
                    key={placeholder}
                    className="h-32 w-full rounded-xl"
                />
            ))}
        </div>
    )
}
