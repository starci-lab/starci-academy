import React from "react"
import { AuthenticationModal } from "./AuthenticationModal"
import { ChallengeModal } from "./ChallengeModal"
import { ChallengeSubmissionModal } from "./ChallengeSubmissionModal"
import { ContentModal } from "./ContentModal"
import { LivestreamCalendarModal } from "./LivestreamCalendarModal"
import { LessonVideoModal } from "./LessonVideoModal"
import { PaymentModal } from "./PaymentModal"

export const ModalContainer = () => {
    return (
        <>
            <AuthenticationModal />
            <PaymentModal />
            <ContentModal />
            <LivestreamCalendarModal />
            <LessonVideoModal />
            <ChallengeModal />
            <ChallengeSubmissionModal />
        </>
    )
}