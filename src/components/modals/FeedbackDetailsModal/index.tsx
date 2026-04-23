"use client"

import React from "react"
import { Modal, ScrollShadow } from "@heroui/react"
import { useFeedbackDetailsOverlayState, useQuerySubmissionFeedbacksSwr } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import { FeedbackCard } from "./FeedbackCard"
import { useTranslations } from "next-intl"
import { AppModalHeader } from "../AppModalHeader"
import { FeedbackDetailsEmpty } from "./Empty"
import { FeedbackCardSkeleton } from "./FeedbackCardSkeleton"

/**
 * Modal listing feedback entries for the current submission attempt.
 */
export const FeedbackDetailsModal = () => {
    const { isOpen, onOpenChange } = useFeedbackDetailsOverlayState()
    const querySubmissionFeedbacksSwr = useQuerySubmissionFeedbacksSwr()
    const submissionFeedbacks = useAppSelector((state) => state.submissionFeedback.submissionFeedbacks)
    const t = useTranslations()
    const showSkeleton =
        isOpen
        && (querySubmissionFeedbacksSwr.isLoading || querySubmissionFeedbacksSwr.isValidating)
        && submissionFeedbacks.length === 0
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container size="lg">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <AppModalHeader title={t("feedback.detailsTitle")} />
                        <Modal.Body>
                            {showSkeleton ? (
                                <ScrollShadow className="max-h-[500px]" hideScrollBar>
                                    <div className="flex flex-col gap-3 p-3">
                                        {
                                            Array.from({ length: 3 }).map((_, index) => (
                                                <FeedbackCardSkeleton key={index} />
                                            ))
                                        }
                                    </div>
                                </ScrollShadow>
                            ) : submissionFeedbacks.length ? (
                                <ScrollShadow className="max-h-[500px]" hideScrollBar>
                                    <div className="flex flex-col gap-3 p-3">
                                        {submissionFeedbacks.map((submissionFeedback) => (
                                            <FeedbackCard
                                                key={submissionFeedback.id}
                                                submissionFeedback={submissionFeedback}
                                            />
                                        ))}
                                    </div>
                                </ScrollShadow>
                            ) : (
                                <FeedbackDetailsEmpty />
                            )}
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
