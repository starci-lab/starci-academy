"use client"

import React from "react"
import {
    Link,
    Modal,
    ScrollShadow,
} from "@heroui/react"
import { MarkdownContent } from "@/components/reuseable"
import {
    useCvSubmissionAttemptAnalysisOverlayState,
} from "@/hooks/singleton"
import {
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    clearSelectedCvSubmissionAttemptAnalysis,
} from "@/redux/slices"
import { useTranslations } from "next-intl"

/**
 * Shows the full AI analysis for a selected CV submission attempt.
 */
export const CvSubmissionAttemptAnalysisModal = () => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const {
        isOpen,
        setOpen,
    } = useCvSubmissionAttemptAnalysisOverlayState()
    const selectedAttempt = useAppSelector(
        (state) => state.cvSubmissionAttemptAnalysis.selectedAttempt,
    )
    const markdown = selectedAttempt?.detailFeedback?.trim()
        || t("cv.submission.attemptAnalysis.empty")

    const handleOpenChange = (open: boolean) => {
        setOpen(open)
        if (!open) {
            dispatch(clearSelectedCvSubmissionAttemptAnalysis())
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={handleOpenChange}
        >
            <Modal.Backdrop>
                <Modal.Container size="lg">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <div className="text-base font-semibold">
                                {selectedAttempt
                                    ? t("cv.submission.attemptAnalysis.titleWithAttempt", {
                                        number: selectedAttempt.attemptNumber,
                                    })
                                    : t("cv.submission.attemptAnalysis.title")}
                            </div>
                            {selectedAttempt ? (
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                                    <span>{selectedAttempt.submittedAtLabel}</span>
                                    <span>/</span>
                                    <span>{selectedAttempt.status}</span>
                                </div>
                            ) : null}
                        </Modal.Header>
                        <Modal.Body>
                            {selectedAttempt ? (
                                <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-default-50 p-3">
                                    <div className="min-w-0">
                                        <div className="text-xs text-muted">
                                            {t("cv.submission.attempts.file")}
                                        </div>
                                        <div className="truncate text-sm font-medium">
                                            {selectedAttempt.fileLabel}
                                        </div>
                                    </div>
                                    {selectedAttempt.fileUrlIsPublic ? (
                                        <Link
                                            className="inline-flex h-8 items-center justify-center rounded-medium bg-default-100 px-3 text-sm font-medium text-foreground no-underline hover:opacity-90"
                                            href={selectedAttempt.fileUrl}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            {t("cv.submission.attemptAnalysis.openFile")}
                                        </Link>
                                    ) : null}
                                </div>
                            ) : null}
                            <ScrollShadow
                                className="max-h-[60vh] rounded-2xl bg-surface p-4 text-sm"
                                hideScrollBar
                            >
                                <MarkdownContent markdown={markdown} />
                            </ScrollShadow>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
