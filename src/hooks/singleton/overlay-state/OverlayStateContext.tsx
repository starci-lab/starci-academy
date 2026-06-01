"use client"
import React, { PropsWithChildren } from "react"
import { createContext } from "react"
import {
    useAIProcessingOverlayStateCore,
    useAuthenticationOverlayStateCore,
    useChallengeOverlayStateCore,
    useCvPreviewOverlayStateCore,
    useCvReviewLevelDetailsOverlayStateCore,
    useCvUpdateOverlayStateCore,
    useContentOverlayStateCore,
    useLivestreamCalendarOverlayStateCore,
    useLessonVideoOverlayStateCore,
    usePaymentOverlayStateCore,
    useAccountMenuOverlayStateCore,
    useLanguageOverlayStateCore,
    useSubmissionAttemptsOverlayStateCore,
    useFeedbackDetailsOverlayStateCore,
    useSearchOverlayStateCore,
    useLinkGithubOverlayStateCore,
    useShareOverlayStateCore,
    useCvSubmissionAttemptsDrawerOverlayStateCore,
    useCvSubmissionAttemptAnalysisOverlayStateCore,
    usePersonalProjectTaskAttemptsDrawerOverlayStateCore,
    useUserMilestoneTaskFeedbacksModalOverlayStateCore,
    useFoundationOverlayStateCore,
    useHeadhunterOverlayStateCore,
    useAiQuotaOverlayStateCore,
    usePremiumGateOverlayStateCore,
} from "./core"

/**
 * Shape of the singleton overlay-state context; each field is a HeroUI overlay-state
 * handle created once in {@link OverlayStateProvider} and consumed via the accessor hooks.
 */
export interface OverlayStateContextType {
    aiProcessing: ReturnType<typeof useAIProcessingOverlayStateCore>
    authentication: ReturnType<typeof useAuthenticationOverlayStateCore>
    payment: ReturnType<typeof usePaymentOverlayStateCore>
    content: ReturnType<typeof useContentOverlayStateCore>
    livestreamCalendar: ReturnType<typeof useLivestreamCalendarOverlayStateCore>
    lessonVideo: ReturnType<typeof useLessonVideoOverlayStateCore>
    challenge: ReturnType<typeof useChallengeOverlayStateCore>
    cvPreview: ReturnType<typeof useCvPreviewOverlayStateCore>
    cvReviewLevelDetails: ReturnType<typeof useCvReviewLevelDetailsOverlayStateCore>
    cvUpdate: ReturnType<typeof useCvUpdateOverlayStateCore>
    accountMenu: ReturnType<typeof useAccountMenuOverlayStateCore>
    language: ReturnType<typeof useLanguageOverlayStateCore>
    submissionAttempts: ReturnType<typeof useSubmissionAttemptsOverlayStateCore>
    feedbackDetails: ReturnType<typeof useFeedbackDetailsOverlayStateCore>
    search: ReturnType<typeof useSearchOverlayStateCore>
    linkGithub: ReturnType<typeof useLinkGithubOverlayStateCore>
    share: ReturnType<typeof useShareOverlayStateCore>
    cvSubmissionAttemptsDrawer: ReturnType<typeof useCvSubmissionAttemptsDrawerOverlayStateCore>
    cvSubmissionAttemptAnalysis: ReturnType<typeof useCvSubmissionAttemptAnalysisOverlayStateCore>
    personalProjectTaskAttemptsDrawer: ReturnType<typeof usePersonalProjectTaskAttemptsDrawerOverlayStateCore>
    userMilestoneTaskFeedbacksModal: ReturnType<typeof useUserMilestoneTaskFeedbacksModalOverlayStateCore>
    foundation: ReturnType<typeof useFoundationOverlayStateCore>
    headhunter: ReturnType<typeof useHeadhunterOverlayStateCore>
    aiQuota: ReturnType<typeof useAiQuotaOverlayStateCore>
    premiumGate: ReturnType<typeof usePremiumGateOverlayStateCore>
}

export const OverlayStateContext = createContext<OverlayStateContextType | null>(null)

/**
 * Mounts all singleton overlay-state instances once at the top of the app tree.
 * @param props.children - app content
 */
export const OverlayStateProvider = ({ children }: PropsWithChildren) => {
    const aiProcessing = useAIProcessingOverlayStateCore()
    const authentication = useAuthenticationOverlayStateCore()
    const payment = usePaymentOverlayStateCore()
    const content = useContentOverlayStateCore()
    const livestreamCalendar = useLivestreamCalendarOverlayStateCore()
    const lessonVideo = useLessonVideoOverlayStateCore()
    const challenge = useChallengeOverlayStateCore()
    const cvPreview = useCvPreviewOverlayStateCore()
    const cvReviewLevelDetails = useCvReviewLevelDetailsOverlayStateCore()
    const cvUpdate = useCvUpdateOverlayStateCore()
    const accountMenu = useAccountMenuOverlayStateCore()
    const language = useLanguageOverlayStateCore()
    const submissionAttempts = useSubmissionAttemptsOverlayStateCore()
    const feedbackDetails = useFeedbackDetailsOverlayStateCore()
    const search = useSearchOverlayStateCore()
    const linkGithub = useLinkGithubOverlayStateCore()
    const share = useShareOverlayStateCore()
    const cvSubmissionAttemptsDrawer = useCvSubmissionAttemptsDrawerOverlayStateCore()
    const cvSubmissionAttemptAnalysis = useCvSubmissionAttemptAnalysisOverlayStateCore()
    const personalProjectTaskAttemptsDrawer = usePersonalProjectTaskAttemptsDrawerOverlayStateCore()
    const userMilestoneTaskFeedbacksModal = useUserMilestoneTaskFeedbacksModalOverlayStateCore()
    const foundation = useFoundationOverlayStateCore()
    const headhunter = useHeadhunterOverlayStateCore()
    const aiQuota = useAiQuotaOverlayStateCore()
    const premiumGate = usePremiumGateOverlayStateCore()
    return (
        <OverlayStateContext.Provider value={{
            aiProcessing,
            authentication,
            payment,
            content,
            livestreamCalendar,
            lessonVideo,
            challenge,
            cvPreview,
            cvReviewLevelDetails,
            cvUpdate,
            accountMenu,
            language,
            submissionAttempts,
            feedbackDetails,
            search,
            linkGithub,
            share,
            cvSubmissionAttemptsDrawer,
            cvSubmissionAttemptAnalysis,
            personalProjectTaskAttemptsDrawer,
            userMilestoneTaskFeedbacksModal,
            foundation,
            headhunter,
            aiQuota,
            premiumGate,
        }}>
            {children}
        </OverlayStateContext.Provider>
    )
}
