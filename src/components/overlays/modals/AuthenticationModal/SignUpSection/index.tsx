"use client"

/**
 * Sign-up section inside {@link AuthenticationModal}.
 *
 * Mirrors {@link SignInSection}: router on Redux `state.signUpState`.
 * Flow: **Registration** (`signUpInit`) → **Otp** (`signUpVerifyOtp`).
 *
 * ### Data layer
 * - {@link useMutateSignUpSwr} — GraphQL `signUpInit` (SWR singleton).
 * - {@link useMutateSignUpVerifyOtpSwr} — GraphQL `signUpVerifyOtp`.
 * - {@link useSignUpForm} — submit branches + `challengeId` / `otp` values.
 */
import React from "react"
import { RegistrationState } from "./RegistrationState"
import { OtpState } from "./OtpState"
import { useAppSelector } from "@/redux/hooks"
import { SignUpState } from "@/redux/slices/state"

/** Props for {@link SignUpSection}. */
export interface SignUpSectionProps {
    /** Hides `Modal.CloseTrigger` on both steps when hosted outside a dismissible modal (the `/login` page). */
    hideCloseButton?: boolean
}

/**
 * Renders the active sign-up step from `signUpState`.
 */
export const SignUpSection = ({ hideCloseButton }: SignUpSectionProps = {}) => {
    const signUpState = useAppSelector((state) => state.state.signUpState)
    switch (signUpState) {
    case SignUpState.Registration:
        return <RegistrationState hideCloseButton={hideCloseButton} />
    case SignUpState.Otp:
        return <OtpState hideCloseButton={hideCloseButton} />
    default:
        return null
    }
}
