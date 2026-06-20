"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    MarkdownContent,
} from "@/components/reuseable"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useAppSelector,
} from "@/redux"
import {
    cn,
} from "@heroui/react"
import {
    listContentBodyLangs,
    pickContentBodyByLang,
    resolveActiveProgrammingLang,
    resolveContentBody,
    type WithClassNames,
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
// ActionToolbar is no longer rendered here — it lives inside ContentDiscussion/InteractionBar
import {
    ContentBodySkeleton,
} from "../../ContentBodySkeleton"
import {
    useAutoMarkContentRead,
} from "../useAutoMarkContentRead"
import {
    ContentDiscussion,
} from "./Discussion"

export type ContentBodyV2Props = WithClassNames<undefined>

/**
 * SCHEMA V2 content body. Selected by {@link ContentBody} when the content is verified. Shares the
 * toolbar / favorite / mark-as-read behaviour with the legacy body; the body itself is the V2 entry
 * point and will render the per-language `@starci/replace` payload once that format lands. For now
 * it renders the resolved markdown body.
 *
 * @param props.className - Optional wrapper class.
 */
export const ContentBodyV2 = ({ className }: ContentBodyV2Props) => {
    const t = useTranslations()
    const locale = useLocale()
    const runGraphQL = useGraphQLWithToast()
    const queryContentSwr = useQueryContentSwr()
    const contentFromRedux = useAppSelector((state) => state.content.entity)
    const routeContentId = useAppSelector((state) => state.content.id)
    const contentSnapshot = contentFromRedux ?? queryContentSwr.data
    const content =
        contentSnapshot?.id && routeContentId && contentSnapshot.id === routeContentId
            ? contentSnapshot
            : undefined
    const queryContentStatusSwr = useQueryContentStatusSwr()
    const mutateToggleFavoriteSwr = useMutateToggleFavoriteSwr()
    const contentOverlay = useContentOverlayState()
    const shareOverlay = useShareOverlayState()
    const isLoading = queryContentSwr.isLoading && !content

    // SCHEMA V2 lesson body: all languages fetched up-front as `bodies`; a tab switches which one
    // is rendered, resolved to the active locale.
    const langs = useMemo(
        () => listContentBodyLangs(content?.bodies),
        [content?.bodies],
    )
    const selectedLang = useAppSelector((state) => state.content.selectedProgrammingLang)
    const activeLang = useMemo(
        () => resolveActiveProgrammingLang(selectedLang, langs),
        [
            selectedLang,
            langs,
        ],
    )
    const activeBody = useMemo(
        () => resolveContentBody(pickContentBodyByLang(content?.bodies, activeLang), locale),
        [content?.bodies, activeLang, locale],
    )

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
        return <ContentBodySkeleton className={className} variant="v2" />
    }

    return (
        <div className={cn("text-sm text-muted overflow-x-auto", className)}>
            {/* the per-language switcher now lives in the tab toolbar (LessonReader →
                ContentTabBar rightSlot); this body just renders the active language. */}
            <MarkdownContent reading markdown={activeBody || t("content.empty")} />
            {/* Locked premium teaser: stop right after the (truncated) body so the parent fades the
                tail and shows the paywall — hide references / toolbar / comments below. */}
            {contentFromRedux?.isPremium ? null : (
                <>
                    <div className="h-6" />
                    {/* Sentinel element for IntersectionObserver — triggers mark-as-read */}
                    <div ref={sentinelRef} className="h-1" />
                    <div className="h-6" />
                    {/* Reactions + threaded comments (includes bookmark/share/fullscreen bar). */}
                    <ContentDiscussion
                        isFavorite={Boolean(queryContentStatusSwr.data?.isFavorite)}
                        isShareVisible={!contentFromRedux?.isPremium}
                        isFavoritePending={mutateToggleFavoriteSwr.isMutating}
                        onToggleFavorite={onToggleFavorite}
                        onShare={onShare}
                        onFullscreen={onFullscreen}
                    />
                </>
            )}
        </div>
    )
}
