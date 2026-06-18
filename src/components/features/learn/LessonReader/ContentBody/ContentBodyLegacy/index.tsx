"use client"

import React, {
    useCallback,
} from "react"
import {
    MarkdownContent,
} from "@/components/reuseable"
import {
    useTranslations,
} from "next-intl"
import {
    useAppSelector,
} from "@/redux"
import {
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types"
import {
    useContentOverlayState,
    useMutateToggleFavoriteSwr,
    useQueryContentStatusSwr,
    useQueryContentSwr,
    useShareOverlayState,
} from "@/hooks"
import {
    useGraphQLWithToast,
} from "@/modules/toast"
import {
    ActionToolbar,
} from "../ActionToolbar"
import {
    ContentBodySkeleton,
} from "../../ContentBodySkeleton"
import {
    useAutoMarkContentRead,
} from "../useAutoMarkContentRead"

export type ContentBodyLegacyProps = WithClassNames<undefined>

/**
 * Legacy (V1) content body: action toolbar, markdown article and an intersection
 * sentinel that marks the content as read once scrolled into view. Selected by {@link ContentBody}
 * when the content is NOT verified.
 *
 * @param props.className - Optional wrapper class.
 */
export const ContentBodyLegacy = ({ className }: ContentBodyLegacyProps) => {
    const t = useTranslations()
    const runGraphQL = useGraphQLWithToast()
    const queryContentSwr = useQueryContentSwr()
    const contentFromRedux = useAppSelector((state) => state.content.entity)
    const content = contentFromRedux ?? queryContentSwr.data
    const queryContentStatusSwr = useQueryContentStatusSwr()
    const mutateToggleFavoriteSwr = useMutateToggleFavoriteSwr()
    const contentOverlay = useContentOverlayState()
    const shareOverlay = useShareOverlayState()
    const isLoading = queryContentSwr.isLoading && !content

    // Auto mark-as-read on scroll: silent progress tick at the bottom sentinel,
    // dwell-gated XP + feed grant. Returns the ref for the sentinel element below.
    const sentinelRef = useAutoMarkContentRead({
        contentId: content?.id,
        isRead: queryContentStatusSwr.data?.isRead,
        isLoading,
    })

    /** Toggle the favorite flag, then re-fetch the content status on success. */
    const onToggleFavorite = useCallback(async () => {
        if (!content?.id) return
        await runGraphQL(
            async () => {
                const env = await mutateToggleFavoriteSwr.trigger({
                    contentId: content.id,
                    isFavorite: !queryContentStatusSwr.data?.isFavorite,
                })
                if (!env?.success) {
                    throw new Error("Toggle favorite failed")
                }
                // re-fetch the content status
                queryContentStatusSwr.mutate()
                return env
            },
            {
                showSuccessToast: true,
                showErrorToast: true,
            },
        )
    }, [content?.id, mutateToggleFavoriteSwr, queryContentStatusSwr, runGraphQL])

    /** Open the share overlay. */
    const onShare = useCallback(
        () => shareOverlay.setOpen(true),
        [shareOverlay],
    )

    /** Open the fullscreen content overlay. */
    const onFullscreen = useCallback(
        () => contentOverlay.setOpen(true),
        [contentOverlay],
    )

    if (isLoading) {
        return <ContentBodySkeleton className={className} variant="legacy" />
    }

    return (
        <div className={cn("text-sm text-muted overflow-x-auto", className)}>
            <ActionToolbar
                isFavorite={Boolean(queryContentStatusSwr.data?.isFavorite)}
                isShareVisible={!content?.isPremium}
                isFavoritePending={mutateToggleFavoriteSwr.isMutating}
                onToggleFavorite={onToggleFavorite}
                onShare={onShare}
                onFullscreen={onFullscreen}
            />
            <div className="h-3" />
            <MarkdownContent markdown={content?.body || t("content.empty")} />
            <div className="h-6" />
            {/* Sentinel element for IntersectionObserver — triggers mark-as-read */}
            <div ref={sentinelRef} className="h-1" />
        </div>
    )
}
