"use client"

import { InputText } from "@/components/atoms/forms"
import React from "react"
import {
    useTranslations,
} from "next-intl"
import { Box } from "@/components/frames/Box"


/** Props for {@link EmailField}. */
export interface EmailFieldProps {
    /** Current email value. */
    value: string
    /** Validation error message, if any. */
    error?: string
    /** Whether the field has been touched (controls error visibility). */
    touched?: boolean
    /** Fired with the new email value on change. */
    onChangeValue: (value: string) => void
}

/**
 * Email input row for the sign-in credentials step.
 *
 * Presentational: renders the labelled email field and forwards the change
 * event upward. No business logic.
 * @param props - value, validation state, and the change callback
 */
export const EmailField = ({
    value,
    error,
    touched,
    onChangeValue,
}: EmailFieldProps) => {
    const t = useTranslations()
    const invalid = !!(touched && error)
    return (
        <Box
            identity={{ tier: "overlay", component: "EmailField" }}
            principle="label-field"
            explain="Single labelled field root — not title-subtitle, because the caption names a form control rather than a heading pair; not icon-text, because there is no leading glyph."
        >
            <InputText
                variant="secondary"
                label={t("auth.signIn.email.label")}
                placeholder={t("auth.signIn.email.placeholder")}
                value={value}
                onValueChange={onChangeValue}
                isInvalid={invalid}
                errorMessage={invalid ? error : undefined}
            />
        </Box>
    )
}
