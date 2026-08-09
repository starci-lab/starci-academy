import { InputOtp } from "@/components/atoms/forms"
import React, { type ReactNode } from "react"
import { Typography } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"

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
 * Content only: hosts supply chrome (`ModalShell` or page card).
 *
 * @param props - {@link OtpStateProps}
 */
export const _OtpState = ({
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

    const resendRow = [
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
    ]

    const otpFieldItems = [
        () => (
            <InputOtp
                length={6}
                value={otp}
                onValueChange={onChangeOtp}
                isInvalid={showError}
                errorMessage={showError ? error : undefined}
            />
        ),
        () => (
            <StackH
                principle="flex-action-center"
                explain="Resend OTP sits on one centered action baseline — not flex-action, because the row is cross-aligned to the midline rather than start."
                items={resendRow}
            />
        ),
    ]

    const formBodyItems = [
        () => <Typography size="xs" color="muted" align="center" text={labels.desc} />,
        () => (
            <StackV
                principle="sibling-stack"
                explain="OTP digit fields are same-kind peers in one column — not group-boundary, because they are repeating controls rather than section groups."
                items={otpFieldItems}
            />
        ),
    ]

    return (
        <StackV
            identity={{ tier: "block", component: "SignUpOtpState" }}
            principle="block-boundary"
            explain="Title over the OTP form — not group-boundary, because this is the panel body's major section seam."
            items={[
                () => (
                    <Box
                        className="pr-8"
                        principle="control-pad"
                        explain="Reserves room for ModalShell close trigger — not card-padding, because this is chrome inset beside the dismiss control rather than card body pad; not page-pad, because the inset is single-sided."
                    >
                        <Typography weight="semibold" align="center" text={labels.title} />
                    </Box>
                ),
                () => (
                    <Form
                        onSubmit={onSubmit}
                        gap={6}
                        body={() => (
                            <StackV
                                principle="block-boundary"
                                explain="Description over the OTP field stack — not sibling-stack, because the copy and the fields are different kinds of content."
                                items={formBodyItems}
                            />
                        )}
                        actions={() => (
                            <Button
                                variant="primary"
                                isDisabled={!isValid}
                                isPending={isSubmitting}
                                label={labels.submit}
                                onPress={onSubmit}
                            />
                        )}
                    />
                ),
            ]}
        />
    )
}
