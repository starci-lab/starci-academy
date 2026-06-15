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
    useParams,
} from "next/navigation"
import {
    useQueryUserFeedSwr,
} from "@/hooks"
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
    // target user id comes from the route segment, not a prop (matches the
    // codebase convention that containers read their own route context)
    const userId = String(useParams().userId)
    const {
        data,
        size,
        setSize,
        isLoading,
        isValidating,
    } = useQueryUserFeedSwr(userId)

    // first page in flight → spinner (no skeleton flash for an empty timeline)
    if (isLoading && !data) {
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
