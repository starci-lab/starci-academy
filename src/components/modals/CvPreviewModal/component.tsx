import React from "react"
import dynamic from "next/dynamic"
import { ModalShell } from "@/components/composites/layout/ModalShell"

const PDFView = dynamic(
    () => import("@/components/blocks/rendering/PDFView").then((module) => module.PDFView),
    { ssr: false },
)

/** All display text, already localized by the connected `CvPreviewModal`; a story passes i18n keys. */
export interface CvPreviewModalLabels {
    /** `t("cv.preview.title")` — the modal header AND the PDF viewer's accessible title. */
    title: string
}

/** Props for {@link _CvPreviewModal} — presentational; all data resolved, no fetch/store/i18n. */
export interface CvPreviewModalProps {
    /** Whether the modal is currently open. */
    isOpen: boolean
    /** Open-state change handler — backdrop click, Escape, close button. */
    onOpenChange: (open: boolean) => void
    /**
     * The presigned/rendered CV PDF URL the caller opened this modal for, already
     * resolved from the overlay store's context — empty string when none is set
     * yet, the same fallback `PDFView` itself already renders as "No PDF selected".
     */
    pdfUrl: string
    /** All display text, already localized. */
    labels: CvPreviewModalLabels
}

/**
 * Full-screen CV preview modal — the presentational half of {@link CvPreviewModal}: shows whichever
 * CV the caller opened it for inside the shared modal scaffold. There is no fetch here — the URL
 * arrives already resolved from the overlay store's context — so there is no first-load window to
 * skeleton; `PDFView` handles its own internal PDF-render progress.
 *
 * @param props - {@link CvPreviewModalProps}
 */
export const _CvPreviewModal = ({ isOpen, onOpenChange, pdfUrl, labels }: CvPreviewModalProps) => (
    <ModalShell
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        containerClassName="h-[92vh] w-[96vw] max-w-[96vw]"
        title={labels.title}
        identity={{ tier: "overlay", component: "CvPreviewModal" }}
        body={() => (
            <PDFView
                src={pdfUrl}
                title={labels.title}
                heightClassName="h-[84vh]"
                pageWidth={900}
                showAllPages={true}
                allowVerticalScroll={true}
            />
        )}
    />
)
