"use client"

import React from "react"
import { cn, Modal } from "@heroui/react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { useCvPreviewOverlayState } from "@/hooks/zustand/overlay/hooks"
import { WithClassNames } from "@/modules/types/base/class-name"

const PDFView = dynamic(
    () => import("@/components/reuseable/PDFView").then((module) => module.PDFView),
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
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container className="h-[92vh] w-[96vw] max-w-[96vw]">
                    <Modal.Dialog className={cn(className)}>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <div className="font-semibold">{t("cv.preview.title")}</div>
                        </Modal.Header>
                        <Modal.Body className="p-2">
                            <PDFView
                                src={previewPdfUrl ?? ""}
                                title={t("cv.preview.title")}
                                heightClassName="h-[84vh]"
                                pageWidth={900}
                                showAllPages={true}
                                allowVerticalScroll={true}
                            />
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
