"use client"
import React, { PropsWithChildren, useMemo } from "react"
import { createContext } from "react"
import {
    useAuthenticationDisclosureCore,
    useChallengeDisclosureCore,
    useChallengeSubmissionDisclosureCore,
    useContentDisclosureCore,
    usePaymentDisclosureCore,
} from "./core"

export interface DiscloresureContextType {
    authentication: ReturnType<typeof useAuthenticationDisclosureCore>
    payment: ReturnType<typeof usePaymentDisclosureCore>
    content: ReturnType<typeof useContentDisclosureCore>
    challenge: ReturnType<typeof useChallengeDisclosureCore>
}

export const DiscloresureContext = createContext<DiscloresureContextType | null>(null)

export const DiscloresureProvider = ({ children }: PropsWithChildren) => {
    const authentication = useAuthenticationDisclosureCore()
    const payment = usePaymentDisclosureCore()
    const content = useContentDisclosureCore()
    const challenge = useChallengeDisclosureCore()
    const challengeSubmission = useChallengeSubmissionDisclosureCore()
    const value = useMemo(() => ({
        authentication,
        payment,
        content,
        challenge,
        challengeSubmission,
    }), [
        authentication,
        payment,
        content,
        challenge,
        challengeSubmission,
    ])
    return (
        <DiscloresureContext.Provider value={value}>
            {children}
        </DiscloresureContext.Provider>
    )
}