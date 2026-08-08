"use client"

import { InputPassword } from "@/components/atoms/forms"
import React from "react"
import { useTranslations } from "next-intl"
import { Box } from "@/components/frames/Box"


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
 * show/hide reveal toggle is owned by the `InputPassword` atom itself.
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
        <Box
            identity={{ tier: "overlay", component: "PasswordField" }}
            principle="label-field"
            explain="Single labelled field root — not title-subtitle, because the caption names a form control rather than a heading pair; not icon-text, because there is no leading glyph."
        >
            <InputPassword
                label={label}
                placeholder={placeholder}
                isInvalid={showError}
                errorMessage={showError ? error : undefined}
                value={value}
                onValueChange={onChangeValue}
                revealLabel={revealLabel}
                hideLabel={hideLabel}
            />
        </Box>
    )
}
