"use client"

/**
 * **Sign-in step 2** — OTP entry after `signInInit` succeeds.
 *
 * Same singleton Formik as credentials step. Description uses `t.rich` so the email can be styled.
 * Submit runs the OTP verify branch in `useSignInForm` while `signInState === OTP`.
 *
 * @see {@link SignInSection} for step routing; mirror this folder when sign-up adds a verify-email step.
 */
import React from "react"
import { Button, cn, FieldError, InputOTP, Link, Modal, Spinner, TextField, Typography } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useMutateSignInResendOtpSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSignInResendOtpSwr"
import { useSignInForm } from "@/hooks/zustand/signIn/useSignInForm"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link OtpState}. */
export interface OtpStateProps extends WithClassNames<undefined> {
    /** Hides `Modal.CloseTrigger` when hosted outside a dismissible modal (the `/login` page). */
    hideCloseButton?: boolean
}

/**
 * OTPState component.
 */
export const OtpState = ({ hideCloseButton }: OtpStateProps = {}) => {
    const t = useTranslations()
    const runGraphQL = useGraphQLWithToast()
    const { trigger: mutateSignInResendOtp, isMutating: isResending } = useMutateSignInResendOtpSwr()
    const {
        values,
        errors,
        touched,
        submitForm,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
    } = useSignInForm()

    const onResend = async () => {
        const challengeId = values.challengeId
        if (!challengeId) {
            return
        }
        await runGraphQL(
            async () => {
                const apolloResult = await mutateSignInResendOtp({
                    request: {
                        challengeId,
                    },
                })
                const env = apolloResult.data?.signInResendOtp
                if (!env?.success || !env.data?.challengeId) {
                    throw new Error(
                        env?.error ?? env?.message ?? "signInResendOtp failed"
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
                <Typography type="body" weight="semibold" className="pr-8 text-center">
                    {t("auth.signIn.otp.title")}
                </Typography>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-6">
                <Typography type="body-xs" color="muted" className="text-center">
                    {t.rich("auth.signIn.otp.desc", {
                        emailHighlight: (chunks) => (
                            <span className="text-accent">{chunks}</span>
                        ),
                        email: values.email,
                    })}
                </Typography>
                <div className="flex flex-col gap-3">
                    <TextField variant="secondary" isInvalid={!!(touched.otp && errors.otp)}>
                        <InputOTP
                            id="sign-in-otp"
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
                    <div className="flex flex-wrap items-center justify-center gap-2 text-center">
                        <Typography type="body-xs" color="muted">{t("auth.signIn.otp.resend")}</Typography>
                        <Link
                            className={cn("text-xs text-accent", isResending ? "text-muted" : "")}
                            data-disabled={isResending ? true : undefined}
                            onPress={() => {
                                if (isResending) return
                                void onResend()
                            }}
                        >
                            {t("auth.signIn.otp.resendLink")}
                        </Link>
                    </div>
                </div>
                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isPending={isSubmitting}
                    onPress={() => submitForm()}
                >
                    {({isPending}) => (
                        <>
                            {isPending ? <Spinner color="current" size="sm" /> : null}
                            {t("auth.signIn.otp.submit")}
                        </>
                    )}
                </Button>
            </Modal.Body>
        </>
    )
}
