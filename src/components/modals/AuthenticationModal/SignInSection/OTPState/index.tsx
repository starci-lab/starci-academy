"use client"

import React from "react"
import { Button, FieldError, Input, Label, TextField } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useSignInFormik } from "@/hooks/singleton"
import { WithClassNames } from "@/modules/types"

export type OTPStateProps = WithClassNames<undefined>

/**
 * OTPState component.
 *
 * @param props Props for OTPState component.
 */
export const OTPState = () => {
    const t = useTranslations()
    const {
        values,
        errors,
        touched,
        submitForm,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
    } = useSignInFormik()

    return (
        <>
            <div className="text-center">
                <div className="font-medium text-sm">{t("auth.signIn.otp.title")}</div>
                <div className="text-xs text-foreground-500">{t("auth.signIn.otp.desc")}</div>
            </div>

            <div className="h-3" />
            <TextField isInvalid={!!(touched.otp && errors.otp)}>
                <Label htmlFor="sign-in-otp" className="text-sm">
                    {t("auth.signIn.otp.label")}
                </Label>
                <Input
                    id="sign-in-otp"
                    required
                    variant="secondary"
                    inputMode="numeric"
                    pattern="\\d{6}"
                    maxLength={6}
                    placeholder={t("auth.signIn.otp.placeholder")}
                    name="otp"
                    value={values.otp}
                    onChange={(e) => {
                        const next = e.target.value.replace(/\D/g, "").slice(0, 6)
                        setFieldValue("otp", next)
                    }}
                    onBlur={() => setFieldTouched("otp", true)}
                />
                <FieldError>{errors.otp}</FieldError>
            </TextField>

            <div className="h-3" />
            <Button
                type="submit"
                variant="primary"
                fullWidth
                isPending={isSubmitting}
                onPress={() => submitForm()}
            >
                {t("auth.signIn.otp.submit")}
            </Button>
        </>
    )
}

