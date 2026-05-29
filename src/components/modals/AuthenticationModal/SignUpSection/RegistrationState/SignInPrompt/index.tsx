"use client"

import React from "react"
import {
    Link,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"

/** Props for {@link SignInPrompt}. */
export interface SignInPromptProps {
    /** Fired when the user chooses to switch back to the sign-in tab. */
    onSwitchToSignIn: () => void
}

/**
 * "Already have an account? Sign in" footer link for the sign-up step.
 *
 * Presentational: forwards the switch-tab intent via `onSwitchToSignIn`.
 * @param props - the switch-to-sign-in callback
 */
export const SignInPrompt = ({
    onSwitchToSignIn,
}: SignInPromptProps) => {
    const t = useTranslations()
    return (
        <div className="flex justify-center items-center gap-1">
            <div className="text-xs text-muted">
                {t("auth.signUp.haveAccount")}
            </div>
            <Link
                className="text-xs"
                onPress={onSwitchToSignIn}
            >
                {t("auth.signUp.signIn")}
            </Link>
        </div>
    )
}
