import React from "react"
import { AuthenticationModal } from "./AuthenticationModal"
import { ChallengeModal } from "./ChallengeModal"
import { ContentModal } from "./ContentModal"
import { PaymentModal } from "./PaymentModal"

export const ModalContainer = () => {
    return (
        <>
            <AuthenticationModal />
            <PaymentModal />
            <ContentModal />
            <ChallengeModal />
        </>
    )
}