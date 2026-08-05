"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Input } from "@/components/atoms/forms/Input"

/** Which sign-up password field this row renders — picks the i18n key prefix. */
export type PasswordFieldKind = "password" | "confirmPassword"

/** Props for {@link PasswordField}. */
export interface PasswordFieldProps {
    /** Which field this instance renders (`password` or `confirmPassword`) — resolves its own copy. */
    kind: PasswordFieldKind
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
 * Password input row for the sign-up registration step — reused for both the
 * password and confirm-password fields via {@link PasswordFieldKind}. The
 * show/hide reveal toggle is owned by the `Input.Password` atom itself.
 *
 * Presentational: value + validation driven by props, forwards the change
 * event upward. No business logic.
 * @param props - {@link PasswordFieldProps}
 */
export const PasswordField = ({
    kind,
    value,
    error,
    touched,
    onChangeValue,
}: PasswordFieldProps) => {
    const t = useTranslations()
    const label = kind === "password" ? t("auth.signUp.password.label") : t("auth.signUp.confirmPassword.label")
    const placeholder = kind === "password" ? t("auth.signUp.password.placeholder") : t("auth.signUp.confirmPassword.placeholder")
    const revealLabel = kind === "password" ? t("auth.signUp.password.show") : t("auth.signUp.confirmPassword.show")
    const hideLabel = kind === "password" ? t("auth.signUp.password.hide") : t("auth.signUp.confirmPassword.hide")
    const showError = Boolean(touched && error)
    return (
        <Input.Password
            label={label}
            placeholder={placeholder}
            isInvalid={showError}
            errorMessage={showError ? error : undefined}
            value={value}
            onValueChange={onChangeValue}
            revealLabel={revealLabel}
            hideLabel={hideLabel}
        />
    )
}
