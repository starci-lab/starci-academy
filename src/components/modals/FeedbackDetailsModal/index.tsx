import { 
    StarCiModal, 
    StarCiModalHeader, 
    StarCiModalContent, 
    StarCiModalBody, 
    StarCiScrollShadow
} from "@/components/atomic"
import React from "react"
import { useFeedbackDetailsOverlayState } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import { FeedbackCard } from "./FeedbackCard"
import { Spacer } from "@/components/reuseable"
/**
 * FeedbackDetailsModal is a modal component that is used to display the feedback details.
 */
export const FeedbackDetailsModal = () => {
    const { isOpen, onOpenChange } = useFeedbackDetailsOverlayState()
    const submissionFeedbacks = useAppSelector((state) => state.submissionFeedback.submissionFeedbacks)
    return (
        <StarCiModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <StarCiModalContent size="lg">
                <StarCiModalHeader title="Feedback Details"/>
                <StarCiModalBody>
                    <StarCiScrollShadow hideScrollBar className="max-h-[500px]">
                        <div className="flex flex-col gap-3">
                            {
                                submissionFeedbacks.map((submissionFeedback) => (
                                    <FeedbackCard key={submissionFeedback.id} submissionFeedback={submissionFeedback} />
                                )
                                )
                            }
                        </div>
                        <Spacer y={6} />
                    </StarCiScrollShadow>
                </StarCiModalBody>
            </StarCiModalContent>
        </StarCiModal>
    )
}