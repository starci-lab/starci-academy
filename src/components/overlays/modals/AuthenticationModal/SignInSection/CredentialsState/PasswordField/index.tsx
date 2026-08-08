"use client"

import { InputPassword } from "@/components/atoms/forms"
import React from "react"
import {
    useTranslations,
} from "next-intl"
import { Box } from "@/components/frames/Box"


/** Props for {@link PasswordField}. */
export interface PasswordFieldProps {
    /** Current password value. */
    value: string
    /** Validation error message, if any. */
    error?: string
    /** Whether the field has been touched (controls error visibility). */
    touched?: boolean
    /** Fired with the new password value on change. */
    onChangeValue: (value: string) => void
}

/**
 * Password input row for the sign-in credentials step.
 *
 * Presentational: renders the labelled password field — the reveal/hide
 * toggle is owned by the `InputPassword` atom — and forwards the change
 * event upward. No business logic.
 * @param props - value, validation state, and the change callback
 */
export const PasswordField = ({
    value,
    error,
    touched,
    onChangeValue,
}: PasswordFieldProps) => {
    const t = useTranslations()
    const invalid = !!(touched && error)
    return (
        <Box
            identity={{ tier: "overlay", component: "PasswordField" }}
            principle="label-field"
            explain="Single labelled field root — not title-subtitle, because the caption names a form control rather than a heading pair; not icon-text, because there is no leading glyph."
        >
            <InputPassword
                label={t("auth.signIn.password.label")}
                placeholder={t("auth.signIn.password.placeholder")}
                value={value}
                onValueChange={onChangeValue}
                isInvalid={invalid}
                errorMessage={invalid ? error : undefined}
                revealLabel={t("auth.signIn.password.show")}
                hideLabel={t("auth.signIn.password.hide")}
            />
        </Box>
    )
}
