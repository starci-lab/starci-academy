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
import { Modal } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useMutateSignInResendOtpSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSignInResendOtpSwr"
import { useSignInForm } from "@/hooks/zustand/signIn/useSignInForm"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { Typography } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"
import { Input } from "@/components/atoms/forms/Input"
import { StackV, StackH } from "@/components/frames/Stack"
import { Box } from "@/components/frames/Box"

/** Props for {@link OtpState}. */
export interface OtpStateProps {
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

    const otpInvalid = !!(touched.otp && errors.otp)

    const bodyItems = [
        () => (
            <Typography
                size="xs"
                color="muted"
                align="center"
                text={t.rich("auth.signIn.otp.desc", {
                    emailHighlight: (chunks) => (
                        <span className="text-accent-soft-foreground">{chunks}</span>
                    ),
                    email: values.email,
                })}
            />
        ),
        () => (
            <StackV
                gap={4}
                items={[
                    () => (
                        <Input.Otp
                            value={values.otp}
                            onValueChange={(value) => setFieldValue("otp", value)}
                            isInvalid={otpInvalid}
                            errorMessage={otpInvalid ? errors.otp : undefined}
                        />
                    ),
                    () => (
                        <StackH
                            gap={3}
                            justify="center"
                            items={[
                                () => <Typography size="xs" color="muted" text={t("auth.signIn.otp.resend")} />,
                                () => (
                                    <Typography
                                        size="xs"
                                        isLink
                                        color={isResending ? "muted" : "accent-soft"}
                                        onPress={() => {
                                            if (isResending) return
                                            void onResend()
                                        }}
                                        text={t("auth.signIn.otp.resendLink")}
                                    />
                                ),
                            ]}
                        />
                    ),
                ]}
            />
        ),
        () => (
            <Button
                variant="primary"
                classNames={["w-full"]}
                isPending={isSubmitting}
                label={t("auth.signIn.otp.submit")}
                onPress={() => submitForm()}
            />
        ),
    ]

    return (
        <>
            {!hideCloseButton && <Modal.CloseTrigger />}
            <Modal.Header>
                <Box className="pr-8">
                    <Typography weight="semibold" align="center" text={t("auth.signIn.otp.title")} />
                </Box>
            </Modal.Header>
            <Modal.Body>
                <StackV gap={6} items={bodyItems} />
            </Modal.Body>
        </>
    )
}
