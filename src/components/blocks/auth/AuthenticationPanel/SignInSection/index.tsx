"use client"

/**
 * Sign-in section of {@link AuthenticationPanel}.
 *
 * **Blueprint for `SignUpSection`**: mirror this layout when sign-up becomes multi-step.
 *
 * ### Host
 * - Parent `AuthenticationPanel` picks the tab from Redux `tabs.authenticationModalTab`.
 *   This component only renders when the sign-in tab is active.
 *
 * ### Step machine (Redux, not `useState`)
 * - Current screen comes from `state.state.signInState` (`SignInState` in `src/redux/slices/state.ts`):
 *   `Credentials` → email/password (+ OAuth) → submit runs init → `setSignInState(OTP)`;
 *   `OTP` → 6-digit code → verify → `resetSignInState()`.
 * - Keeping the step in Redux keeps `useSignInForm` submit logic and all child trees in sync.
 *
 * ### Folder layout
 * - `index.tsx` — thin switch: which child state to mount.
 * - `CredentialsState/` — step 1 UI (title + form content; no modal chrome).
 * - `OTPState/` — step 2 UI (same content-only contract).
 *
 * ### Formik
 * - Singleton hook `useSignInForm()` from `@/hooks/singleton` — child components call it
 *   directly (no prop-drilling). Core: `hooks/singleton/formik/core/useSignInForm.ts`.
 *
 * ### i18n
 * - Keys under `auth.signIn.*` in `src/messages/en.json` and `vi.json`.
 */
import React from "react"
import { CredentialsState } from "./CredentialsState"
import { OtpState } from "./OtpState"
import { useAppSelector } from "@/redux/hooks"
import { SignInState } from "@/redux/slices/state"

/**
 * Renders the sign-in flow step (`Credentials` or `OTP`) based on `signInState`.
 */
export const SignInSection = () => {
    const signInState = useAppSelector((state) => state.state.signInState)
    switch (signInState) {
    case SignInState.Credentials:
        return <CredentialsState />
    case SignInState.OTP:
        return <OtpState />
    default:
        return null
    }
}
