"use client"

import React from "react"
import { Modal, ScrollShadow } from "@heroui/react"
import { useFeedbackDetailsOverlayState } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import { FeedbackCard } from "./FeedbackCard"
import { Spacer } from "@/components/reuseable"
import { useTranslations } from "next-intl"
import { AppModalHeader } from "../AppModalHeader"

/**
 * Modal listing feedback entries for the current submission attempt.
 */
export const FeedbackDetailsModal = () => {
    const { isOpen, onOpenChange } = useFeedbackDetailsOverlayState()
    const submissionFeedbacks = useAppSelector((state) => state.submissionFeedback.submissionFeedbacks)
    const t = useTranslations()
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container size="lg">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <AppModalHeader title={t("feedback.detailsTitle")} />
                        <Modal.Body className="gap-0 p-4">
                            <ScrollShadow className="max-h-[500px]" hideScrollBar>
                                <div className="flex flex-col gap-3">
                                    {
                                        submissionFeedbacks.map((submissionFeedback) => (
                                            <FeedbackCard key={submissionFeedback.id} submissionFeedback={submissionFeedback} />
                                        )
                                        )
                                    }
                                </div>
                                <Spacer y={6} />
                            </ScrollShadow>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
