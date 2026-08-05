"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Choice } from "@/components/atoms/forms/Choice"
import { Typography } from "@/components/atoms/text/Typography"
import { pathConfig } from "@/resources/path"

/** Props for {@link AgreeToTermsRow}. */
export interface AgreeToTermsRowProps {
    /** Whether the terms checkbox is checked. */
    isSelected: boolean
    /** Validation error message, if any. */
    error?: string
    /** Whether the field has been touched (controls error visibility). */
    touched?: boolean
    /** Fired with the new checked state. */
    onChangeSelected: (selected: boolean) => void
}

/**
 * Terms-and-privacy agreement checkbox with inline error.
 *
 * Presentational: checked state + validation driven by props. The terms /
 * privacy links open the real `/terms` and `/privacy` pages in a new tab so
 * the in-progress sign-up form isn't lost.
 * @param props - {@link AgreeToTermsRowProps}
 */
export const AgreeToTermsRow = ({
    isSelected,
    error,
    touched,
    onChangeSelected,
}: AgreeToTermsRowProps) => {
    const t = useTranslations()
    const paths = pathConfig().locale()
    const showError = Boolean(touched && error)

    const label = (
        <>
            <Typography size="xs" color="muted" text={t("auth.signUp.agreeToTerms.prefix")} />{" "}
            <Typography size="xs" isLink underlineOnHover href={paths.terms().build()} target="_blank" text={t("auth.signUp.agreeToTerms.terms")} />{" "}
            <Typography size="xs" color="muted" text={t("auth.signUp.agreeToTerms.and")} />{" "}
            <Typography size="xs" isLink underlineOnHover href={paths.privacy().build()} target="_blank" text={t("auth.signUp.agreeToTerms.privacy")} />
        </>
    )

    return (
        <Choice.Checkbox
            isSelected={isSelected}
            onValueChange={onChangeSelected}
            label={label}
            isInvalid={showError}
            errorMessage={showError ? error : undefined}
        />
    )
}
