"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH } from "@/components/frames/Stack"

/** Props for {@link SignInPrompt}. */
export interface SignInPromptProps {
    /** Fired when the user chooses to switch back to the sign-in tab. */
    onSwitchToSignIn: () => void
}

/**
 * "Already have an account? Sign in" footer row for the sign-up step.
 *
 * Presentational: forwards the switch-tab intent via `onSwitchToSignIn`.
 * @param props - {@link SignInPromptProps}
 */
export const SignInPrompt = ({
    onSwitchToSignIn,
}: SignInPromptProps) => {
    const t = useTranslations()
    return (
        <StackH identity={{ tier: "block", component: "SignInPrompt" }}
            gap={3}
            principle="flex-action"
            explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
            justify="center"
            items={[
                () => <Typography size="xs" color="muted" text={t("auth.signUp.haveAccount")} />,
                () => <Typography size="xs" color="accent" isButton onPress={onSwitchToSignIn} text={t("auth.signUp.signIn")} />,
            ]}
        />
    )
}
