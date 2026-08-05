"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { pathConfig } from "@/resources/path"
import { useShareOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useAppSelector } from "@/redux/hooks"
import { _ShareModal } from "./component"

/**
 * Share modal: opened via {@link useShareOverlayState}, shares whatever
 * content the page has loaded into `state.content.entity` (redux). CONNECTED
 * half — resolves the public share URL (origin + `pathConfig`), the content
 * title, and both translated labels, then hands them to the presentational
 * {@link _ShareModal}. See `tiers/split.md`. Mounted prop-less by
 * `ModalContainer`.
 */
export const ShareModal = () => {
    const t = useTranslations()
    const { isOpen, setOpen } = useShareOverlayState()
    const content = useAppSelector((state) => state.content.entity)

    const shareUrl = useMemo(() => {
        if (!content?.displayId) return ""
        return `${typeof window !== "undefined" ? window.location.origin : ""}${pathConfig().locale().publicContent(content.displayId).build()}`
    }, [content?.displayId])

    return (
        <_ShareModal
            isOpen={isOpen}
            onOpenChange={setOpen}
            shareUrl={shareUrl}
            shareTitle={content?.title ?? ""}
            isEmpty={!shareUrl}
            labels={{
                share: t("content.share"),
                scanQr: t("content.scanQr"),
            }}
        />
    )
}
