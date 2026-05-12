"use client"

import React, { useMemo, useRef, useEffect, useCallback } from "react"
import { MarkdownContent, ReferenceLinks } from "@/components/reuseable"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { Skeleton, cn, Button, Spinner } from "@heroui/react"
import { WithClassNames } from "@/modules/types"
import _ from "lodash"
import { useQueryContentSwr, useMutateToggleFavoriteSwr, useContentOverlayState, useShareOverlayState, useQueryContentStatusSwr } from "@/hooks/singleton"
import { mutateMarkContentAsReaded } from "@/modules/api"
import { BookmarkSimpleIcon, ShareNetworkIcon, ArrowsOutIcon } from "@phosphor-icons/react"
import { runGraphQLWithToast } from "@/modules/toast"

export type ContentBodyProps = WithClassNames<undefined>

export const ContentBody = ({ className }: ContentBodyProps) => {
    const t = useTranslations()
    const queryContentSwr = useQueryContentSwr()
    const content = useAppSelector((state) => state.content.entity)
    const queryContentStatusSwr = useQueryContentStatusSwr()
    const mutateToggleFavoriteSwr = useMutateToggleFavoriteSwr()
    const contentOverlay = useContentOverlayState()
    const shareOverlay = useShareOverlayState()
    const isLoading = queryContentSwr.isLoading || !content
    const references = useMemo(() => _.cloneDeep(content?.references ?? []).sort((prev, next) => prev.orderIndex - next.orderIndex), [content?.references])

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

    if (isLoading) {
        return (
            <>
                <Skeleton className="h-[18px] my-[17px]"/>
                <div className="my-3" />
                <Skeleton className="h-[14px] my-[3px] w-full rounded-full" />
                <Skeleton className="h-[14px] my-[3px] w-5/6 rounded-full" />
            </>
        )
    }

    return (
        <div className={cn("text-sm text-muted overflow-x-auto", className)}>
            <div className="flex items-center gap-2">
                <Button
                    isIconOnly
                    variant="secondary"
                    onPress={
                        async () => {
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
                                    //re-fetch the content status
                                    queryContentStatusSwr.mutate()
                                    return env
                                },
                                { 
                                    showSuccessToast: true, 
                                    showErrorToast: true 
                                },
                            )
                        }
                    }
                    isPending={mutateToggleFavoriteSwr.isMutating}
                    id="content-save-btn"
                >
                    {
                        ({isPending}) => {
                            return (
                                <>
                                    {isPending ? (
                                        <Spinner className="size-5" />
                                    ) : (
                                        <BookmarkSimpleIcon
                                            className="size-5"
                                            weight={queryContentStatusSwr.data?.isFavorite ? "fill" : "regular"}
                                        />
                                    )}
                                </>
                            )
                        }
                    }
                </Button>
                {!content?.isPremium && (
                    <Button
                        isIconOnly
                        variant="secondary"
                        onPress={() => shareOverlay.setOpen(true)}
                        id="content-share-btn"
                    >
                        <ShareNetworkIcon className="size-5" />
                    </Button>
                )}
                <Button
                    isIconOnly
                    variant="secondary"
                    onPress={() => contentOverlay.setOpen(true)}
                    id="content-fullscreen-btn"
                >
                    <ArrowsOutIcon className="size-5" />
                </Button>
            </div>
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
