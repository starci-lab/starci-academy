"use client"
import React, { PropsWithChildren } from "react"
import { createContext } from "react"
import {
    useAuthenticationOverlayStateCore,
    useChallengeOverlayStateCore,
    useCvPreviewOverlayStateCore,
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
} from "./core"

export interface OverlayStateContextType {
    authentication: ReturnType<typeof useAuthenticationOverlayStateCore>
    payment: ReturnType<typeof usePaymentOverlayStateCore>
    content: ReturnType<typeof useContentOverlayStateCore>
    livestreamCalendar: ReturnType<typeof useLivestreamCalendarOverlayStateCore>
    lessonVideo: ReturnType<typeof useLessonVideoOverlayStateCore>
    challenge: ReturnType<typeof useChallengeOverlayStateCore>
    cvPreview: ReturnType<typeof useCvPreviewOverlayStateCore>
    cvUpdate: ReturnType<typeof useCvUpdateOverlayStateCore>
    accountMenu: ReturnType<typeof useAccountMenuOverlayStateCore>
    language: ReturnType<typeof useLanguageOverlayStateCore>
    submissionAttempts: ReturnType<typeof useSubmissionAttemptsOverlayStateCore>
    feedbackDetails: ReturnType<typeof useFeedbackDetailsOverlayStateCore>
    search: ReturnType<typeof useSearchOverlayStateCore>
}

export const OverlayStateContext = createContext<OverlayStateContextType | null>(null)

export const OverlayStateProvider = ({ children }: PropsWithChildren) => {
    const authentication = useAuthenticationOverlayStateCore()
    const payment = usePaymentOverlayStateCore()
    const content = useContentOverlayStateCore()
    const livestreamCalendar = useLivestreamCalendarOverlayStateCore()
    const lessonVideo = useLessonVideoOverlayStateCore()
    const challenge = useChallengeOverlayStateCore()
    const cvPreview = useCvPreviewOverlayStateCore()
    const cvUpdate = useCvUpdateOverlayStateCore()
    const accountMenu = useAccountMenuOverlayStateCore()
    const language = useLanguageOverlayStateCore()
    const submissionAttempts = useSubmissionAttemptsOverlayStateCore()
    const feedbackDetails = useFeedbackDetailsOverlayStateCore()
    const search = useSearchOverlayStateCore()
    return (
        <OverlayStateContext.Provider value={{
            authentication,
            payment,
            content,
            livestreamCalendar,
            lessonVideo,
            challenge,
            cvPreview,
            cvUpdate,
            accountMenu,
            language,
            submissionAttempts,
            feedbackDetails,
            search,
        }}>
            {children}
        </OverlayStateContext.Provider>
    )
}
