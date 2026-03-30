import React from "react"
import { AuthenticationModal } from "./AuthenticationModal"
import { PaymentModal } from "./PaymentModal"

export const ModalContainer = () => {
    return (
        <>
            <AuthenticationModal />
            <PaymentModal />
        </>
    )
}