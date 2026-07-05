"use client"

import { MagnifyingGlassPlusIcon } from "@phosphor-icons/react"
import React, { useMemo } from "react"
import {
    Button,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useCvPreviewOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryCvGenerationSwr } from "@/hooks/swr/api/graphql/queries/useQueryCvGenerationSwr"
import { CvSource } from "@/modules/api/graphql/queries/types/cv-generation"

const PDFView = dynamic(
    () => import("@/components/reuseable/PDFView").then((module) => module.PDFView),
    { ssr: false },
)

/** Props for {@link CVPreview}. */
export interface CVPreviewProps extends WithClassNames<undefined> {
    /**
     * `cv_generations.id` to preview — shared with the sibling {@link CvScorecard}
     * so picking a CV in the history dial updates the preview too, instead of
     * this pane always showing the latest CV regardless of selection.
     */
    cvId: string | undefined
}

/** Whether a (presigned) URL points at a plain-text upload, by its path extension. */
const isTextFileUrl = (url: string): boolean => {
    try {
        return new URL(url).pathname.toLowerCase().endsWith(".txt")
    } catch {
        return false
    }
}

/**
 * The ONE shared preview for the caller's SELECTED CV (`cvId`) — regardless of
 * source: an uploaded PDF/text file (`uploadedCvUrl`), or a `Generated` CV
 * compiled server-side into a real PDF (`generatedPdfUrl`, `tectonic` — see
 * `/profile/cv/edit`). Rendered as its own full-width "Xem trước" tab in
 * `CvWorkspace` (not a narrow sticky sidebar) so the document gets the whole
 * workspace width instead of sharing a row with the scorecard. A fullscreen
 * entry is still available for reading at full resolution.
 *
 * @param props - {@link CVPreviewProps}
 */
export const CVPreview = ({ className, cvId }: CVPreviewProps) => {
    const t = useTranslations()
    const {
        open: openCvPreviewModal,
    } = useCvPreviewOverlayState()
    const detailSwr = useQueryCvGenerationSwr(cvId)
    const detail = detailSwr.data

    const previewPdfUrl = useMemo(() => {
        if (!detail) {
            return ""
        }
        if (detail.source === CvSource.Uploaded) {
            const url = detail.uploadedCvUrl ?? ""
            return url && !isTextFileUrl(url) ? url : ""
        }
        return detail.generatedPdfUrl ?? ""
    }, [detail])

    const previewTextUrl = useMemo(() => {
        if (!detail || detail.source !== CvSource.Uploaded) {
            return ""
        }
        const url = detail.uploadedCvUrl ?? ""
        return url && isTextFileUrl(url) ? url : ""
    }, [detail])

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {previewTextUrl ? (
                <iframe
                    key={previewTextUrl}
                    src={previewTextUrl}
                    title={t("cv.preview.title")}
                    className="h-[300px] w-full rounded-2xl border border-default bg-surface lg:h-[75vh]"
                />
            ) : (
                <PDFView
                    key={previewPdfUrl || "cv-preview-empty"}
                    src={previewPdfUrl}
                    title={t("cv.preview.title")}
                    heightClassName="h-[300px] lg:h-[75vh]"
                    showAllPages={true}
                    allowVerticalScroll={true}
                    fitToContainer={true}
                />
            )}
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                isDisabled={!previewPdfUrl}
                onPress={() => openCvPreviewModal(previewPdfUrl)}
            >
                <MagnifyingGlassPlusIcon aria-hidden className="size-5" />
                {t("cv.preview.fullscreen")}
            </Button>
        </div>
    )
}
