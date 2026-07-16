"use client"

import React from "react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { useCvPreviewOverlayState } from "@/hooks/zustand/overlay/hooks"
import { WithClassNames } from "@/modules/types/base/class-name"
import { ModalShell } from "@/components/blocks/layout/ModalShell"

const PDFView = dynamic(
    () => import("@/components/blocks/rendering/PDFView").then((module) => module.PDFView),
    { ssr: false },
)

/** Props for {@link CvPreviewModal}. */
type CvPreviewModalProps = WithClassNames<undefined>

/**
 * Full-screen CV preview modal — shows whichever CV the caller opened it for
 * ({@link useCvPreviewOverlayState}'s `open(url)` stashes the URL), the same
 * presigned/rendered URL the inline preview already renders.
 */
export const CvPreviewModal = ({ className }: CvPreviewModalProps = {}) => {
    const t = useTranslations()
    const { isOpen, setOpen, context: previewPdfUrl } = useCvPreviewOverlayState()

    return (
        <ModalShell
            isOpen={isOpen}
            onOpenChange={setOpen}
            className={className}
            containerClassName="h-[92vh] w-[96vw] max-w-[96vw]"
            title={t("cv.preview.title")}
        >
            <PDFView
                src={previewPdfUrl ?? ""}
                title={t("cv.preview.title")}
                heightClassName="h-[84vh]"
                pageWidth={900}
                showAllPages={true}
                allowVerticalScroll={true}
            />
        </ModalShell>
    )
}
