"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import { Input } from "@/components/atoms/forms/Input"

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
 * toggle is owned by the `Input.Password` atom — and forwards the change
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
        <Input.Password
            label={t("auth.signIn.password.label")}
            placeholder={t("auth.signIn.password.placeholder")}
            value={value}
            onValueChange={onChangeValue}
            isInvalid={invalid}
            errorMessage={invalid ? error : undefined}
        />
    )
}
