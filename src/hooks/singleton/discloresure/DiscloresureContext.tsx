"use client"
import React, { PropsWithChildren, useMemo } from "react"
import { createContext } from "react"
import {
    useAuthenticationDisclosureCore,
    useChallengeDisclosureCore,
    useChallengeSubmissionDisclosureCore,
    useContentDisclosureCore,
    useLivestreamCalendarDisclosureCore,
    useLessonVideoDisclosureCore,
    usePaymentDisclosureCore,
} from "./core"

export interface DiscloresureContextType {
    authentication: ReturnType<typeof useAuthenticationDisclosureCore>
    payment: ReturnType<typeof usePaymentDisclosureCore>
    content: ReturnType<typeof useContentDisclosureCore>
    livestreamCalendar: ReturnType<typeof useLivestreamCalendarDisclosureCore>
    lessonVideo: ReturnType<typeof useLessonVideoDisclosureCore>
    challenge: ReturnType<typeof useChallengeDisclosureCore>
    challengeSubmission: ReturnType<typeof useChallengeSubmissionDisclosureCore>
}

export const DiscloresureContext = createContext<DiscloresureContextType | null>(null)

export const DiscloresureProvider = ({ children }: PropsWithChildren) => {
    const authentication = useAuthenticationDisclosureCore()
    const payment = usePaymentDisclosureCore()
    const content = useContentDisclosureCore()
    const livestreamCalendar = useLivestreamCalendarDisclosureCore()
    const lessonVideo = useLessonVideoDisclosureCore()
    const challenge = useChallengeDisclosureCore()
    const challengeSubmission = useChallengeSubmissionDisclosureCore()
    const value = useMemo(() => ({
        authentication,
        payment,
        content,
        livestreamCalendar,
        lessonVideo,
        challenge,
        challengeSubmission,
    }), [
        authentication,
        payment,
        content,
        livestreamCalendar,
        lessonVideo,
        challenge,
        challengeSubmission,
    ])
    return (
        <DiscloresureContext.Provider value={value}>
            {children}
        </DiscloresureContext.Provider>
    )
}