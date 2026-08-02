import React from "react"
import { AuthenticationModal } from "./AuthenticationModal"
import { LivestreamCalendarModal } from "./LivestreamCalendarModal"
import { PaymentModal } from "./PaymentModal"
import { LanguageModal } from "./LanguageModal"
import { FeedbackDetailsModal } from "./FeedbackDetailsModal"
import { CvPreviewModal } from "./CvPreviewModal"
import { CvReviewLevelDetailsModal } from "./CvReviewLevelDetailsModal"
import { GlobalSearchModal } from "./GlobalSearchModal"
import { LinkGithubModal } from "./LinkGithubModal"
import { ShareModal } from "./ShareModal"
import { AiQuotaModal } from "./AiQuotaModal"
import { PremiumGateModal } from "./PremiumGateModal"
import { AdModal } from "./AdModal"
import { ManagePinnedProjectsModal } from "./ManagePinnedProjectsModal"
import { FollowListModal } from "./FollowListModal"
import { CookieConsentModal } from "./CookieConsentModal"
import { MaintenanceModal } from "./MaintenanceModal"

export const ModalContainer = () => {
    return (
        <>
            <AuthenticationModal />
            <PaymentModal />
            <LivestreamCalendarModal />
            <LanguageModal />
            <FeedbackDetailsModal />
            <CvPreviewModal />
            <CvReviewLevelDetailsModal />
            <GlobalSearchModal />
            <LinkGithubModal />
            <ShareModal />
            <AiQuotaModal />
            <PremiumGateModal />
            <AdModal />
            <ManagePinnedProjectsModal />
            <FollowListModal />
            <CookieConsentModal />
            <MaintenanceModal />
        </>
    )
}