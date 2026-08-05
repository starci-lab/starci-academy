import React, { type ReactNode } from "react"
import { Modal } from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"
import { Input } from "@/components/atoms/forms/Input"
import { Box } from "@/components/frames/Box"
import { StackV, StackH } from "@/components/frames/Stack"
import { Form } from "@/components/composites/form/Form"

/** Already-translated strings {@link _OtpState} renders — resolved by the connected `OtpState`, never `t()`/`t.rich()` itself. */
export interface OtpStateLabels {
    title: string
    /** `t.rich(...)`-resolved description with the email highlighted — already a built node. */
    desc: ReactNode
    resend: string
    resendLink: string
    submit: string
}

/** Props for {@link _OtpState}. */
export interface OtpStateProps {
    /** Hides `Modal.CloseTrigger` when hosted outside a dismissible modal (the `/login` page). */
    hideCloseButton?: boolean
    /** Current 6-digit code value. */
    otp: string
    error?: string
    touched?: boolean
    /** True once the code passes format validation — gates the submit button. */
    isValid: boolean
    /** True while `signUpVerifyOtp` is in flight. */
    isSubmitting: boolean
    /** True while `signUpResendOtp` is in flight — locks the resend link. */
    isResending: boolean
    /** Already-translated strings — see {@link OtpStateLabels}. */
    labels: OtpStateLabels
    onChangeOtp: (value: string) => void
    /** Submit the form (the connected half runs `signUpVerifyOtp`). */
    onSubmit: () => void
    /** Request a fresh code (the connected half runs `signUpResendOtp`). */
    onResend: () => void
}

/**
 * Presentational OTP form — the second sign-up step, after `signUpInit`.
 * Renders its OWN `Modal.CloseTrigger` / `Modal.Header` / `Modal.Body` chrome
 * (not `ModalShell`): this section is also mounted bare on `/login`, where
 * there is no surrounding `<Modal>` at all — see {@link OtpState}.
 *
 * @param props - {@link OtpStateProps}
 */
export const _OtpState = ({
    hideCloseButton,
    otp,
    error,
    touched,
    isValid,
    isSubmitting,
    isResending,
    labels,
    onChangeOtp,
    onSubmit,
    onResend,
}: OtpStateProps) => {
    const showError = Boolean(touched && error)
    return (
        <>
            {!hideCloseButton && <Modal.CloseTrigger />}
            <Modal.Header>
                <Box className="pr-8">
                    <Typography weight="semibold" align="center" text={labels.title} />
                </Box>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={onSubmit}
                    gap={6}
                    body={() => (
                        <StackV
                            gap={6}
                            items={[
                                () => <Typography size="xs" color="muted" align="center" text={labels.desc} />,
                                () => (
                                    <StackV
                                        gap={3}
                                        items={[
                                            () => (
                                                <Input.Otp
                                                    length={6}
                                                    value={otp}
                                                    onValueChange={onChangeOtp}
                                                    isInvalid={showError}
                                                    errorMessage={showError ? error : undefined}
                                                />
                                            ),
                                            () => (
                                                <StackH
                                                    gap={3}
                                                    justify="center"
                                                    items={[
                                                        () => <Typography size="xs" color="muted" text={labels.resend} />,
                                                        () => (
                                                            <Typography
                                                                size="xs"
                                                                color={isResending ? "muted" : "accent-soft"}
                                                                isButton
                                                                onPress={() => {
                                                                    if (!isResending) onResend()
                                                                }}
                                                                text={labels.resendLink}
                                                            />
                                                        ),
                                                    ]}
                                                />
                                            ),
                                        ]}
                                    />
                                ),
                            ]}
                        />
                    )}
                    actions={() => (
                        <Button
                            variant="primary"
                            classNames={["w-full"]}
                            isDisabled={!isValid}
                            isPending={isSubmitting}
                            label={labels.submit}
                            onPress={onSubmit}
                        />
                    )}
                />
            </Modal.Body>
        </>
    )
}
