"use client"

import React from "react"
import {
    Link,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"

/** Props for {@link SignUpPrompt}. */
export interface SignUpPromptProps {
    /** Fired when the user chooses to switch to the sign-up tab. */
    onSwitchToSignUp: () => void
}

/**
 * "No account? Sign up" footer link for the sign-in step.
 *
 * Presentational: forwards the switch-tab intent via `onSwitchToSignUp`.
 * @param props - the switch-to-sign-up callback
 */
export const SignUpPrompt = ({
    onSwitchToSignUp,
}: SignUpPromptProps) => {
    const t = useTranslations()
    return (
        <div className="flex justify-center items-center gap-1">
            <div className="text-xs text-muted">
                {t("auth.signIn.noAccount")}
            </div>
            <Link
                className="text-xs"
                onPress={onSwitchToSignUp}
            >
                {t("auth.signIn.signUp")}
            </Link>
        </div>
    )
}
