"use client"

import React from "react"
import {
    Checkbox,
    cn,
    Label,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    useTranslations,
} from "next-intl"
import {
    Link,
} from "@/i18n/navigation"
import {
    pathConfig,
} from "@/resources/path"

/** Props for {@link AgreeToTermsRow}. */
export interface AgreeToTermsRowProps extends WithClassNames<undefined> {
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
 * @param props - selected state, validation, and the change callback
 */
export const AgreeToTermsRow = ({
    isSelected,
    error,
    touched,
    onChangeSelected,
    className,
}: AgreeToTermsRowProps) => {
    const t = useTranslations()
    const paths = pathConfig().locale()

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div className="flex items-start gap-2">
                <Checkbox
                    id="sign-up-agree-to-terms"
                    className="w-full"
                    variant="secondary"
                    isSelected={isSelected}
                    onChange={(value) => onChangeSelected(Boolean(value))}
                >
                    <Checkbox.Control>
                        <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Content className="w-full">
                        <Label htmlFor="sign-up-agree-to-terms">
                            <div className="text-xs text-muted">
                                <span>{t("auth.signUp.agreeToTerms.prefix")}{" "}</span>
                                <Link
                                    href={paths.terms().build()}
                                    target="_blank"
                                    className="text-xs underline underline-offset-4 decoration-[var(--separator-tertiary)] inline"
                                >
                                    {t("auth.signUp.agreeToTerms.terms")}
                                </Link>{" "}
                                <span>{t("auth.signUp.agreeToTerms.and")}{" "}</span>
                                <Link
                                    href={paths.privacy().build()}
                                    target="_blank"
                                    className="text-xs underline underline-offset-4 decoration-[var(--separator-tertiary)] inline"
                                >
                                    {t("auth.signUp.agreeToTerms.privacy")}
                                </Link>
                            </div>
                        </Label>
                    </Checkbox.Content>
                </Checkbox>
            </div>
            {touched && error ? (
                <div className="text-xs text-danger-soft-foreground mt-1">
                    {error}
                </div>
            ) : null}
        </div>
    )
}
