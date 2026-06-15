"use client"

import { Bookmark as BookmarkSimpleIcon, BookmarkFill, NodesRight as ShareNetworkIcon, SquareDashedText as ArrowsOutIcon } from "@gravity-ui/icons"
import React from "react"
import {
    Button,
    Spinner,
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types"

/** Props for {@link ActionToolbar}. */
export interface ActionToolbarProps extends WithClassNames<undefined> {
    /** Whether the content is currently favorited (controls the bookmark fill). */
    isFavorite: boolean
    /** Whether the share button should be shown (hidden for premium content). */
    isShareVisible: boolean
    /** Whether the favorite toggle request is in flight. */
    isFavoritePending: boolean
    /** Toggle the favorite/bookmark state of the content. */
    onToggleFavorite: () => void
    /** Open the share overlay. */
    onShare: () => void
    /** Open the fullscreen content overlay. */
    onFullscreen: () => void
}

/**
 * Row of icon actions above the content body: bookmark, share and fullscreen.
 *
 * Presentational: renders the buttons and forwards `onXXX` callbacks; the
 * favorite mutation + overlay state live in the {@link ContentBody} container.
 * @param props - favorite/share visibility, pending state and action callbacks
 */
export const ActionToolbar = ({
    isFavorite,
    isShareVisible,
    isFavoritePending,
    onToggleFavorite,
    onShare,
    onFullscreen,
    className,
}: ActionToolbarProps) => {
    return (
        <div className={cn("flex items-center gap-1.5", className)}>
            <Button
                isIconOnly
                variant="secondary"
                onPress={onToggleFavorite}
                isPending={isFavoritePending}
                id="content-save-btn"
            >
                {({ isPending }) => (
                    <>
                        {isPending ? (
                            <Spinner className="size-5" />
                        ) : isFavorite ? (
                            <BookmarkFill className="size-5" />
                        ) : (
                            <BookmarkSimpleIcon className="size-5" />
                        )}
                    </>
                )}
            </Button>
            {isShareVisible && (
                <Button
                    isIconOnly
                    variant="secondary"
                    onPress={onShare}
                    id="content-share-btn"
                >
                    <ShareNetworkIcon className="size-5" />
                </Button>
            )}
            <Button
                isIconOnly
                variant="secondary"
                onPress={onFullscreen}
                id="content-fullscreen-btn"
            >
                <ArrowsOutIcon className="size-5" />
            </Button>
        </div>
    )
}
