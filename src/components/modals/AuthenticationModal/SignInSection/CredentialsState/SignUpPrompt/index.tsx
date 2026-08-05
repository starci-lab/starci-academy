"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH } from "@/components/frames/Stack"

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
    const items = [
        () => <Typography size="xs" color="muted" text={t("auth.signIn.noAccount")} />,
        () => <Typography size="xs" isLink onPress={onSwitchToSignUp} text={t("auth.signIn.signUp")} />,
    ]
    return <StackH gap={3} justify="center" items={items} />
}
