"use client"

/**
 * **Sign-up step 2** — OTP after `signUpInit`; resend uses {@link useMutateSignUpResendOtpSwr}.
 *
 * Submit runs `signUpVerifyOtp` via {@link useSignUpForm} while `signUpState === Otp`.
 */
import React from "react"
import { Button, cn, FieldError, InputOTP, Link, Modal, Spinner, TextField } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useMutateSignUpResendOtpSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSignUpResendOtpSwr"
import { useSignUpForm } from "@/hooks/zustand/signUp/useSignUpForm"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link OtpState}. */
export interface OtpStateProps extends WithClassNames<undefined> {
    /** Hides `Modal.CloseTrigger` when hosted outside a dismissible modal (the `/login` page). */
    hideCloseButton?: boolean
}

/**
 * OTP entry for completing GraphQL sign-up (mirrors sign-in `OTPState`).
 */
export const OtpState = ({ hideCloseButton }: OtpStateProps = {}) => {
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

    const onResend = async () => {
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
    }

    return (
        <>
            {!hideCloseButton && <Modal.CloseTrigger />}
            <Modal.Header>
                <div className="text-center">
                    <div className="font-semibold text-lg">{t("auth.signUp.otp.title")}</div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="text-xs text-muted text-center">
                    {
                        t.rich("auth.signUp.otp.desc", {
                            emailHighlight: (chunks) => (
                                <span className="text-accent">{chunks}</span>
                            ),
                            email: values.email,
                        }
                        )
                    }
                </div>
                <div className="h-3" />
                <TextField variant="secondary" isInvalid={!!(touched.otp && errors.otp)}>
                    <InputOTP
                        id="sign-up-otp"
                        name="otp"
                        variant="secondary"
                        maxLength={6}
                        value={values.otp}
                        onChange={(value) => setFieldValue("otp", value)}
                        onBlur={() => setFieldTouched("otp", true)}
                    >
                        <InputOTP.Group>
                            <InputOTP.Slot index={0} />
                            <InputOTP.Slot index={1} />
                            <InputOTP.Slot index={2} />
                        </InputOTP.Group>
                        <InputOTP.Separator />
                        <InputOTP.Group>
                            <InputOTP.Slot index={3} />
                            <InputOTP.Slot index={4} />
                            <InputOTP.Slot index={5} />
                        </InputOTP.Group>
                    </InputOTP>
                    <FieldError className="text-center">{errors.otp}</FieldError>
                </TextField>
                <div className="h-3" />
                <div className="flex flex-wrap items-center justify-center gap-1.5 text-center">
                    <span className="text-xs text-muted">{t("auth.signUp.otp.resend")}</span>
                    <Link
                        className={cn("text-xs text-accent", isResending ? "text-muted" : "")}
                        data-disabled={isResending ? true : undefined}
                        onPress={() => {
                            if (isResending) return
                            onResend()
                        }}
                    >
                        {t("auth.signUp.otp.resendLink")}
                    </Link>
                </div>
                <div className="h-3" />
                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isDisabled={!isValid}
                    isPending={isSubmitting}
                    onPress={() => submitForm()}
                >
                    {({ isPending }) => (
                        <>
                            {isPending ? <Spinner color="current" size="sm" /> : null}
                            {t("auth.signUp.otp.submit")}
                        </>
                    )}
                </Button>
            </Modal.Body>
        </>
    )
}
