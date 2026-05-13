import React from "react"
import { AIProcessingModal } from "./AIProcessingModal"
import { AuthenticationModal } from "./AuthenticationModal"
import { ChallengeModal } from "./ChallengeModal"
import { ContentModal } from "./ContentModal"
import { LivestreamCalendarModal } from "./LivestreamCalendarModal"
import { LessonVideoModal } from "./LessonVideoModal"
import { PaymentModal } from "./PaymentModal"
import { LanguageModal } from "./LanguageModal"
import { FeedbackDetailsModal } from "./FeedbackDetailsModal"
import { CvPreviewModal } from "./CvPreviewModal"
import { CvReviewLevelDetailsModal } from "./CvReviewLevelDetailsModal"
import { CvUpdateModal } from "./CvUpdateModal"
import { GlobalSearchModal } from "./GlobalSearchModal"
import { LinkGithubModal } from "./LinkGithubModal"
import { ShareModal } from "./ShareModal"

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
            <CvReviewLevelDetailsModal />
            <CvUpdateModal />
            <GlobalSearchModal />
            <LinkGithubModal />
            <ShareModal />
            <AIProcessingModal />
        </>
    )
}