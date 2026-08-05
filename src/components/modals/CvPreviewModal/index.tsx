"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useCvPreviewOverlayState } from "@/hooks/zustand/overlay/hooks"
import { _CvPreviewModal } from "./component"

/**
 * Full-screen CV preview modal — the CONNECTED half: reads the overlay open-state plus
 * whichever CV the caller opened it for ({@link useCvPreviewOverlayState}'s `open(url)`
 * stashes the URL, the same presigned/rendered URL the inline preview already renders),
 * resolves the title text, and hands everything to the presentational {@link _CvPreviewModal}.
 * Mounted prop-less by `ModalContainer`. See `tiers/split.md`.
 */
export const CvPreviewModal = () => {
    const t = useTranslations()
    const { isOpen, setOpen, context: previewPdfUrl } = useCvPreviewOverlayState()

    return (
        <_CvPreviewModal
            isOpen={isOpen}
            onOpenChange={setOpen}
            pdfUrl={previewPdfUrl ?? ""}
            labels={{ title: t("cv.preview.title") }}
        />
    )
}
