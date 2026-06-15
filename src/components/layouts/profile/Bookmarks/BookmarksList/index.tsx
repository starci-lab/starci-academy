"use client"

import React, {
    useMemo,
} from "react"
import {
    useQuerySavedContentsSwr,
} from "@/hooks"
import {
    BookmarkCard,
} from "../BookmarkCard"

/**
 * List of saved-content cards, or an empty-state message when there are none.
 *
 * Self-contained section (single-use): reads its own saved contents from the
 * SWR singleton. Each {@link BookmarkCard} self-navigates on press — no open
 * callback needed. `"use client"` for the SWR singleton.
 */
export const BookmarksList = () => {
    const {
        data: savedContents,
    } = useQuerySavedContentsSwr()

    /** Saved content rows (empty until loaded). */
    const contents = useMemo(
        () => savedContents?.contents ?? [],
        [
            savedContents?.contents,
        ],
    )

    if (contents.length === 0) {
        return (
            <div className="text-center text-muted p-12 border rounded-2xl bg-default-50">
                <p>No saved contents yet.</p>
            </div>
        )
    }
    return (
        <div className="flex flex-col gap-3">
            {contents.map((content) => (
                <BookmarkCard
                    key={content.id}
                    content={content}
                />
            ))}
        </div>
    )
}
