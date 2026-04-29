import React from "react"
import { AuthenticationModal } from "./AuthenticationModal"
import { ChallengeModal } from "./ChallengeModal"
import { ContentModal } from "./ContentModal"
import { LivestreamCalendarModal } from "./LivestreamCalendarModal"
import { LessonVideoModal } from "./LessonVideoModal"
import { PaymentModal } from "./PaymentModal"
import { LanguageModal } from "./LanguageModal"
import { FeedbackDetailsModal } from "./FeedbackDetailsModal"
import { CvPreviewModal } from "./CvPreviewModal"
import { CvUpdateModal } from "./CvUpdateModal"
import { GlobalSearchModal } from "./GlobalSearchModal"
import { LinkGithubModal } from "./LinkGithubModal"

export const ModalContainer = () => {
    return (
        <>
            <AuthenticationModal />
            <PaymentModal />
            <ContentModal />
            <LivestreamCalendarModal />
            <LessonVideoModal />
            <ChallengeModal />
            <LanguageModal />
            <FeedbackDetailsModal />
            <CvPreviewModal />
            <CvUpdateModal />
            <GlobalSearchModal />
            <LinkGithubModal />
        </>
    )
}