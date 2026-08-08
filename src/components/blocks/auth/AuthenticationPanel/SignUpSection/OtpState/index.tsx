"use client"

/**
 * **Sign-up step 2** — OTP after `signUpInit`; resend uses {@link useMutateSignUpResendOtpSwr}.
 *
 * Submit runs `signUpVerifyOtp` via {@link useSignUpForm} while `signUpState === Otp`.
 * Container: owns the sign-up formik singleton, the resend mutation, and i18n;
 * hands resolved props to the presentational {@link _OtpState}. See `tiers/split.md`.
 */
import React, { useCallback } from "react"
import { useTranslations } from "next-intl"
import { Typography } from "@/components/atoms/text/Typography"
import { _OtpState } from "./component"
import { useMutateSignUpResendOtpSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSignUpResendOtpSwr"
import { useSignUpForm } from "@/hooks/zustand/signUp/useSignUpForm"
import { useGraphQLWithToast } from "@/modules/toast/hooks"

/**
 * OTP entry for completing GraphQL sign-up (mirrors sign-in `OtpState`).
 */
export const OtpState = () => {
    const t = useTranslations()
    const runGraphQL = useGraphQLWithToast()
    const { trigger: mutateSignUpResendOtp, isMutating: isResending } = useMutateSignUpResendOtpSwr()
    const {
        values,
        errors,
        touched,
        submitForm,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
        isValid,
    } = useSignUpForm()

    const onResend = useCallback(
        async () => {
            const challengeId = values.challengeId
            if (!challengeId) {
                return
            }
            await runGraphQL(
                async () => {
                    const apolloResult = await mutateSignUpResendOtp({
                        request: {
                            challengeId,
                        },
                    })
                    const env = apolloResult.data?.signUpResendOtp
                    if (!env?.success || !env.data?.challengeId) {
                        throw new Error(
                            env?.error ?? env?.message ?? "signUpResendOtp failed"
                        )
                    }
                    await setFieldValue("challengeId", env.data.challengeId)
                    await setFieldValue("otp", "", true)
                    return env
                },
                {
                    showErrorToast: true,
                    showSuccessToast: true,
                }
            )
        },
        [
            values.challengeId,
            runGraphQL,
            mutateSignUpResendOtp,
            setFieldValue,
        ],
    )

    // `InputOtp` carries no `onBlur` — mark touched on the first edit instead
    // (same combined value+touch shape used across the sign-up fields).
    const onChangeOtp = useCallback(
        (value: string) => {
            setFieldValue("otp", value)
            setFieldTouched("otp", true)
        },
        [
            setFieldValue,
            setFieldTouched,
        ],
    )

    const onSubmit = useCallback(
        () => {
            submitForm()
        },
        [
            submitForm,
        ],
    )

    return (
        <_OtpState
            otp={values.otp}
            error={errors.otp}
            touched={touched.otp}
            isValid={isValid}
            isSubmitting={isSubmitting}
            isResending={isResending}
            onChangeOtp={onChangeOtp}
            onSubmit={onSubmit}
            onResend={onResend}
            labels={{
                title: t("auth.signUp.otp.title"),
                desc: t.rich("auth.signUp.otp.desc", {
                    emailHighlight: (chunks) => (
                        <Typography isInline size="xs" color="accent-soft" text={chunks} />
                    ),
                    email: values.email,
                }),
                resend: t("auth.signUp.otp.resend"),
                resendLink: t("auth.signUp.otp.resendLink"),
                submit: t("auth.signUp.otp.submit"),
            }}
        />
    )
}
