"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from "react"
import {
    MarkdownContent,
    ReferenceLinks,
    SkeletonText,
    SkeletonParagraph,
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
import _ from "lodash"
import {
    useContentOverlayState,
    useMutateToggleFavoriteSwr,
    useQueryContentStatusSwr,
    useQueryContentSwr,
    useShareOverlayState,
} from "@/hooks/singleton"
import {
    mutateMarkContentAsReaded,
} from "@/modules/api"
import {
    runGraphQLWithToast,
} from "@/modules/toast"
import {
    ActionToolbar,
} from "../ActionToolbar"

export type ContentBodyLegacyProps = WithClassNames<undefined>

/**
 * Legacy (V1) content body: action toolbar, markdown article, references and an intersection
 * sentinel that marks the content as read once scrolled into view. Selected by {@link ContentBody}
 * when the content is NOT verified.
 *
 * @param props.className - Optional wrapper class.
 */
export const ContentBodyLegacy = ({ className }: ContentBodyLegacyProps) => {
    const t = useTranslations()
    const queryContentSwr = useQueryContentSwr()
    const content = useAppSelector((state) => state.content.entity)
    const queryContentStatusSwr = useQueryContentStatusSwr()
    const mutateToggleFavoriteSwr = useMutateToggleFavoriteSwr()
    const contentOverlay = useContentOverlayState()
    const shareOverlay = useShareOverlayState()
    const isLoading = queryContentSwr.isLoading || !content
    const references = useMemo(
        () => _.cloneDeep(content?.references ?? []).sort(
            (prev, next) => prev.orderIndex - next.orderIndex,
        ),
        [content?.references],
    )

    // Sentinel ref at bottom of content
    const sentinelRef = useRef<HTMLDivElement>(null)
    const hasMarkedRef = useRef(false)

    const markAsRead = useCallback(async () => {
        if (!content?.id || hasMarkedRef.current || queryContentStatusSwr.data?.isRead) return
        hasMarkedRef.current = true
        try {
            await mutateMarkContentAsReaded({
                request: {
                    contentId: content.id,
                    readed: true,
                },
            })
        } catch {
            hasMarkedRef.current = false
        }
    }, [content?.id, queryContentStatusSwr.data?.isRead])

    // Reset when content changes
    useEffect(() => {
        hasMarkedRef.current = false
    }, [content?.id])

    // IntersectionObserver: mark as read when user scrolls to bottom
    useEffect(() => {
        if (isLoading || !sentinelRef.current || queryContentStatusSwr.data?.isRead) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    markAsRead()
                }
            },
            { threshold: 1.0 },
        )

        observer.observe(sentinelRef.current)
        return () => observer.disconnect()
    }, [isLoading, queryContentStatusSwr.data?.isRead, markAsRead])

    /** Toggle the favorite flag, then re-fetch the content status on success. */
    const onToggleFavorite = useCallback(async () => {
        if (!content?.id) return
        await runGraphQLWithToast(
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
    }, [content?.id, mutateToggleFavoriteSwr, queryContentStatusSwr])

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
        return (
            <>
                <SkeletonText size="lg" width="w-2/3" />
                <div className="my-3" />
                <SkeletonParagraph size="sm" lines={2} />
            </>
        )
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
            <ReferenceLinks
                references={references}
                titleKey="reference.title"
            />
            {/* Sentinel element for IntersectionObserver — triggers mark-as-read */}
            <div ref={sentinelRef} className="h-1" />
        </div>
    )
}
