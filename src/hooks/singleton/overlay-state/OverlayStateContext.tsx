"use client"
import React, { PropsWithChildren, useMemo } from "react"
import { createContext } from "react"
import {
    useAuthenticationOverlayStateCore,
    useChallengeOverlayStateCore,
    useChallengeSubmissionOverlayStateCore,
    useContentOverlayStateCore,
    useLivestreamCalendarOverlayStateCore,
    useLessonVideoOverlayStateCore,
    usePaymentOverlayStateCore,
    useAccountMenuOverlayStateCore,
    useLanguageOverlayStateCore,
    useSubmissionAttemptsOverlayStateCore,
    useFeedbackDetailsOverlayStateCore,
} from "./core"

export interface OverlayStateContextType {
    authentication: ReturnType<typeof useAuthenticationOverlayStateCore>
    payment: ReturnType<typeof usePaymentOverlayStateCore>
    content: ReturnType<typeof useContentOverlayStateCore>
    livestreamCalendar: ReturnType<typeof useLivestreamCalendarOverlayStateCore>
    lessonVideo: ReturnType<typeof useLessonVideoOverlayStateCore>
    challenge: ReturnType<typeof useChallengeOverlayStateCore>
    challengeSubmission: ReturnType<typeof useChallengeSubmissionOverlayStateCore>
    accountMenu: ReturnType<typeof useAccountMenuOverlayStateCore>
    language: ReturnType<typeof useLanguageOverlayStateCore>
    submissionAttempts: ReturnType<typeof useSubmissionAttemptsOverlayStateCore>
    feedbackDetails: ReturnType<typeof useFeedbackDetailsOverlayStateCore>
}

export const OverlayStateContext = createContext<OverlayStateContextType | null>(null)

export const OverlayStateProvider = ({ children }: PropsWithChildren) => {
    const authentication = useAuthenticationOverlayStateCore()
    const payment = usePaymentOverlayStateCore()
    const content = useContentOverlayStateCore()
    const livestreamCalendar = useLivestreamCalendarOverlayStateCore()
    const lessonVideo = useLessonVideoOverlayStateCore()
    const challenge = useChallengeOverlayStateCore()
    const challengeSubmission = useChallengeSubmissionOverlayStateCore()
    const accountMenu = useAccountMenuOverlayStateCore()
    const language = useLanguageOverlayStateCore()
    const submissionAttempts = useSubmissionAttemptsOverlayStateCore()
    const feedbackDetails = useFeedbackDetailsOverlayStateCore()
    const value = useMemo(() => ({
        authentication,
        payment,
        content,
        livestreamCalendar,
        lessonVideo,
        challenge,
        challengeSubmission,
        accountMenu,
        language,
        submissionAttempts,
        feedbackDetails,
    }), [
        authentication,
        payment,
        content,
        livestreamCalendar,
        lessonVideo,
        challenge,
        challengeSubmission,
        accountMenu,
        language,
        submissionAttempts,
        feedbackDetails,
    ])
    return (
        <OverlayStateContext.Provider value={value}>
            {children}
        </OverlayStateContext.Provider>
    )
}
