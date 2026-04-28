"use client"
import React from "react"
import {
    Modal,
    cn,
} from "@heroui/react"
import { WithClassNames } from "@/modules/types"
import { useAppSelector } from "@/redux"
import { SignInState } from "@/redux/slices"
import { CredentialsState } from "./CredentialsState"
import { OTPState } from "./OTPState"

/** 
 * Props for SignInSection component
 */
export type SignInSectionProps = WithClassNames<{
    /**
     * Class name for the container
     */
    container?: string
}>

/**
 * SignInSection component
 */
export const SignInSection = ({ className, classNames }: SignInSectionProps) => {
    const signInState = useAppSelector((state) => state.state.signInState)
    const renderContent = () => {
        switch (signInState) {
        case SignInState.Credentials:
            return <CredentialsState />
        case SignInState.OTP:
            return <OTPState />
        default:
            return null
        }
    }
    return (
        <Modal.Body className={
            cn(
                "overflow-visible p-3", 
                className, 
                classNames?.container
            )
        }>
            {renderContent()}
        </Modal.Body>
    )
}
