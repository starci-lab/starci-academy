"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    useQuerySavedContentsSwr,
} from "@/hooks/singleton"
import {
    BookmarksSkeleton,
} from "./BookmarksSkeleton"
import {
    BookmarksList,
} from "./BookmarksList"

/**
 * Bookmarks feature container.
 *
 * Owns only the page-level concern: gate the loading/error states off the SWR
 * saved-contents singleton. The list is self-contained — `BookmarksList` reads
 * its own saved contents and owns its open-content navigation — so this
 * container just composes it. Mounted by the `/profile/bookmarks` route.
 */
export const Bookmarks = () => {
    const t = useTranslations()
    const {
        isLoading,
        error,
    } = useQuerySavedContentsSwr()

    if (isLoading) {
        return <BookmarksSkeleton />
    }

    if (error) {
        return (
            <div className="p-6 text-center text-danger max-w-4xl mx-auto">
                Error loading bookmarks.
            </div>
        )
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{t("content.saved")}</h1>

            <BookmarksList />
        </div>
    )
}
