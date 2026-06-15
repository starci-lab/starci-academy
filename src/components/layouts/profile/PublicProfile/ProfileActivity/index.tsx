"use client"

import React from "react"
import {
    Button,
    cn,
    Spinner,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useQueryUserFeedSwr,
    useQueryUserProfileSwr,
} from "@/hooks"
import {
    useProfileUsername,
} from "../useProfileUsername"
import {
    Feed,
} from "@/components/layouts/shell/Dashboard/Feed"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link ProfileActivity}. */
export type ProfileActivityProps = WithClassNames<undefined>

/**
 * Activity tab of the public profile — the profile owner's own activity
 * timeline, newest first, with cursor-paginated "load more". Self-contained
 * container: reads the target user id from the route (`/profile/[userId]`) and
 * drives its own infinite SWR, then renders the shared {@link Feed} presenter.
 *
 * @param props - optional className for the root element.
 */
export const ProfileActivity = ({
    className,
}: ProfileActivityProps) => {
    const t = useTranslations()
    // route carries the username; resolve it to the entity id the timeline keys
    // off (the profile fetch is SWR-deduped with the parent + tabs)
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const {
        data,
        size,
        setSize,
        isLoading,
        isValidating,
    } = useQueryUserFeedSwr(userId)

    // first page in flight (username not yet resolved, or query running) → spinner
    if (!data && (isLoading || !userId)) {
        return (
            <div className="flex justify-center p-12">
                <Spinner size="lg" />
            </div>
        )
    }

    // flatten every loaded page into a single newest-first item list
    const items = (data ?? []).flatMap((page) => page.items)
    // the last loaded page still carries a cursor → there is another page
    const hasMore = Boolean(data && data.length > 0 && data[data.length - 1].nextCursor !== null)
    // a refetch of the trailing page reads as loading-more
    const isLoadingMore = isValidating && Boolean(data) && size > 0

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <Feed items={items} />
            {hasMore ? (
                <div className="flex justify-center">
                    <Button
                        variant="secondary"
                        size="sm"
                        isPending={isLoadingMore}
                        onPress={() => setSize(size + 1)}
                    >
                        {t("publicProfile.loadMore")}
                    </Button>
                </div>
            ) : null}
        </div>
    )
}
