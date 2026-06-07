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
    ProgrammingLanguageTabs,
    ProgrammingLanguageTabsVariant,
} from "@/components/reuseable"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    setContentSelectedProgrammingLang,
} from "@/redux/slices"
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
import _ from "lodash"
import {
    useContentOverlayState,
    useMutateToggleFavoriteSwr,
    useQueryContentStatusSwr,
    useQueryContentSwr,
    useShareOverlayState,
} from "@/hooks"
import {
    mutateMarkContentAsReaded,
} from "@/modules/api"
import {
    runGraphQLWithToast,
} from "@/modules/toast"
// ActionToolbar is no longer rendered here — it lives inside ContentDiscussion/InteractionBar
import {
    ContentBodySkeleton,
} from "../../ContentBodySkeleton"
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
    const dispatch = useAppDispatch()
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
    const references = useMemo(
        () => _.cloneDeep(content?.references ?? []).sort(
            (prev, next) => prev.orderIndex - next.orderIndex,
        ),
        [content?.references],
    )

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
    const onSelectLang = useCallback(
        (lang: string) => {
            dispatch(setContentSelectedProgrammingLang(lang))
        },
        [dispatch],
    )
    const activeBody = useMemo(
        () => resolveContentBody(pickContentBodyByLang(content?.bodies, activeLang), locale),
        [content?.bodies, activeLang, locale],
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

    // Reset read-tracking when the active content row changes (`setContentId` clears lang tab).
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
        return <ContentBodySkeleton className={className} variant="v2" showReferences={false} />
    }

    return (
        <div className={cn("text-sm text-muted overflow-x-auto", className)}>
            {/* per-language lesson body: tab to switch language, rendered for the active locale */}
            {langs.length > 0 ? (
                <ProgrammingLanguageTabs
                    availableLangs={langs}
                    selectedLang={activeLang}
                    onSelectLang={onSelectLang}
                    ariaLabel={t("content.language")}
                    variant={ProgrammingLanguageTabsVariant.Secondary}
                />
            ) : null}
            <div className="h-3" />
            <MarkdownContent markdown={activeBody || t("content.empty")} />
            {/* Locked premium teaser: stop right after the (truncated) body so the parent fades the
                tail and shows the paywall — hide references / toolbar / comments below. */}
            {contentFromRedux?.isPremium ? null : (
                <>
                    <div className="h-6" />
                    <ReferenceLinks
                        references={references}
                        titleKey="reference.title"
                    />
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
