import React from "react"
import { AuthenticationModal } from "./AuthenticationModal"
// import { ChallengeModal } from "./ChallengeModal"
// import { ChallengeSubmissionModal } from "./ChallengeSubmissionModal"
// import { ContentModal } from "./ContentModal"
// import { LivestreamCalendarModal } from "./LivestreamCalendarModal"
// import { LessonVideoModal } from "./LessonVideoModal"
// import { PaymentModal } from "./PaymentModal"
// import { LanguageModal } from "./LanguageModal"
// import { FeedbackDetailsModal } from "./FeedbackDetailsModal"

export const ModalContainer = () => {
    return (
        <>
            <AuthenticationModal />
            {/* <PaymentModal />
            <ContentModal />
            <LivestreamCalendarModal />
            <LessonVideoModal />
            <ChallengeModal />
            <ChallengeSubmissionModal />
            <LanguageModal />
            <FeedbackDetailsModal /> */}
        </>
    )
}