"use client"

import React, { useEffect, useMemo } from "react"
import { Modal } from "@heroui/react"
import { useTranslations } from "next-intl"
import { PDFView } from "@/components/reuseable"
import { useCvApplyFormik, useCvPreviewOverlayState } from "@/hooks/singleton"

const REMOTE_TEST_PDF_URL = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"

interface CvPreviewModalProps {}

/**
 * Full-screen CV preview modal controlled by singleton overlay state.
 * @param {CvPreviewModalProps} _props Modal props (currently unused).
 */
export const CvPreviewModal = (_props: CvPreviewModalProps) => {
    const t = useTranslations()
    const formik = useCvApplyFormik()
    const { isOpen, onOpenChange } = useCvPreviewOverlayState()
    const selectedFileUrl = useMemo(() => {
        if (!formik.values.cvFile) return ""
        return URL.createObjectURL(formik.values.cvFile)
    }, [formik.values.cvFile])
    const previewPdfUrl = selectedFileUrl || REMOTE_TEST_PDF_URL

    useEffect(() => {
        return () => {
            if (selectedFileUrl) URL.revokeObjectURL(selectedFileUrl)
        }
    }, [selectedFileUrl])

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container className="h-[92vh] w-[96vw] max-w-[96vw]">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <div className="font-semibold">{t("cv.preview.title")}</div>
                        </Modal.Header>
                        <Modal.Body className="p-2">
                            <PDFView
                                src={previewPdfUrl}
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
