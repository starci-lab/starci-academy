"use client"

import React, { useCallback } from "react"
import { Label } from "@heroui/react"
import { useTranslations } from "next-intl"
import { ActionToolbar } from "@/components/blocks/learn/lesson/ContentBody/ActionToolbar"
import { useAppSelector } from "@/redux/hooks"
import { useShareOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useMutateToggleFavoriteSwr } from "@/hooks/swr/api/graphql/mutations/useMutateToggleFavoriteSwr"
import { useQueryContentStatusSwr } from "@/hooks/swr/api/graphql/queries/useQueryContentStatusSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"

/** Props for {@link ContentActions}. */
export type ContentActionsProps = Record<string, never>
/**
 * Right-rail content actions: bookmark/save, share and fullscreen for the content
 * currently open (moved out of the inline interaction bar). Self-contained — owns
 * the favorite mutation + the share / fullscreen overlay state and composes the
 * presentational {@link ActionToolbar}. Hidden until a content is open.
 *
 * @param props - {@link ContentActionsProps}
 */
export const ContentActions = () => {
    const t = useTranslations()
    const runGraphQL = useGraphQLWithToast()
    const contentId = useAppSelector((state) => state.content.id)
    const isPremium = useAppSelector((state) => state.content.entity?.isPremium)
    const statusSwr = useQueryContentStatusSwr()
    const favoriteSwr = useMutateToggleFavoriteSwr()
    const shareOverlay = useShareOverlayState()

    /** Toggle the favorite/bookmark flag, then re-fetch the content status. */
    const onToggleFavorite = useCallback(async () => {
        if (!contentId) {
            return
        }
        await runGraphQL(
            async () => {
                const envelope = await favoriteSwr.trigger({
                    contentId,
                    isFavorite: !statusSwr.data?.isFavorite,
                })
                if (!envelope?.success) {
                    throw new Error("Toggle favorite failed")
                }
                void statusSwr.mutate()
                return envelope
            },
            { showSuccessToast: true },
        )
    }, [contentId, favoriteSwr, statusSwr, runGraphQL])

    /** Open the share overlay. */
    const onShare = useCallback(() => shareOverlay.setOpen(true), [shareOverlay])

    if (!contentId) {
        return null
    }

    return (
        <div className={"flex flex-col gap-3"}>
            <Label>{t("contentActions.title")}</Label>
            <ActionToolbar
                isFavorite={Boolean(statusSwr.data?.isFavorite)}
                isShareVisible={!isPremium}
                isFavoritePending={favoriteSwr.isMutating}
                onToggleFavorite={onToggleFavorite}
                onShare={onShare}
            />
        </div>
    )
}
