"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    useRouter,
} from "next/navigation"
import {
    useQuerySavedContentsSwr,
} from "@/hooks"
import {
    pathConfig,
} from "@/resources/path"
import {
    BookmarkCard,
} from "../BookmarkCard"

/**
 * List of saved-content cards, or an empty-state message when there are none.
 *
 * Self-contained section (single-use): reads its own saved contents from the
 * SWR singleton and owns the open-content navigation handler — so the Bookmarks
 * container only renders `<BookmarksList />` and the logic lives next to where
 * it is used. The repeated rows are rendered via the presentational
 * {@link BookmarkCard} (list-style), which takes the local `onOpen` handler as a
 * prop. `"use client"` for the router + open action.
 */
export const BookmarksList = () => {
    const router = useRouter()
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

    /** Navigate to the public page for the saved content. */
    const onOpen = useCallback(
        (displayId: string) => {
            router.push(pathConfig().locale().publicContent(displayId).build())
        },
        [
            router,
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
        <div className="flex flex-col gap-4">
            {contents.map((content) => (
                <BookmarkCard
                    key={content.id}
                    content={content}
                    onOpen={onOpen}
                />
            ))}
        </div>
    )
}
