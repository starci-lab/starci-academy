import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputOtp } from "@sb-components/atoms/forms"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * `TwoFactorChallenge` — the step that completes a sign-in for an account with
 * 2FA on. The password (or the social identity) is already accepted by the time
 * this renders; the server is holding a short-lived challenge and the only thing
 * still owed is the code. Grounded in the real `AuthPayload`
 * (`requiresTwoFactor` · `twoFactorToken`) and the `verifyTwoFactor` mutation.
 */

/** The confirm field is a fixed 6-digit code, as the authenticator produces. */
const CODE_LENGTH = 6

/** Props for {@link TwoFactorChallenge}. */
export interface TwoFactorChallengeProps {
    /** The 6-digit code being typed. */
    code: string
    /** Fires as the field changes. */
    onCodeChange: (value: string) => void
    /** Submit the code and finish signing in. */
    onSubmit: () => void
    /** Go back to the credentials form (abandons the challenge). */
    onCancel?: () => void
    /** `true` → the code is being checked (field locks, button busy). */
    isVerifying?: boolean
    /**
     * A rejected code, already localized. Rendered inline rather than as a toast
     * because the field that caused it is on screen and about to be retyped.
     */
    errorMessage?: string | null
    /** Already-localized copy. */
    labels: TwoFactorChallengeLabels
}

/** The already-resolved copy the block renders. */
export interface TwoFactorChallengeLabels {
    /** Step heading (e.g. "Two-factor authentication"). */
    title: string
    /** Instruction (e.g. "Enter the 6-digit code from your authenticator app."). */
    instruction: string
    /** Label above the code field. */
    codeLabel: string
    /** Submit-button label (e.g. "Verify & sign in"). */
    submitLabel: string
    /** Back-button label (e.g. "Use a different account"). */
    cancelLabel: string
}

/** Collects the TOTP code that completes a pending sign-in. */
export const TwoFactorChallenge = ({
    code,
    onCodeChange,
    onSubmit,
    onCancel,
    isVerifying,
    errorMessage,
    labels,
}: TwoFactorChallengeProps) => {
    return (
        <div data-tier="block" data-component="TwoFactorChallenge">
            <StackV
                gap={3}
                items={[
                    () => <Typography size="lg" weight="semibold" text={labels.title} />,
                    () => <Typography size="sm" color="muted" text={labels.instruction} />,
                    () => (
                        <InputOtp
                            label={labels.codeLabel}
                            length={CODE_LENGTH}
                            value={code}
                            onValueChange={onCodeChange}
                            isDisabled={isVerifying}
                        />
                    ),
                    ...(errorMessage
                        ? [() => <Typography size="sm" color="danger" text={errorMessage} />]
                        : []),
                    () => (
                        <Button
                            variant="primary"
                            label={labels.submitLabel}
                            onPress={onSubmit}
                            // a code shorter than six digits cannot be right, so the
                            // button stays inert rather than spending a server round-trip
                            isDisabled={code.length < CODE_LENGTH}
                            isPending={isVerifying}
                        />
                    ),
                    ...(onCancel
                        ? [() => (
                            <Button
                                variant="ghost"
                                label={labels.cancelLabel}
                                onPress={onCancel}
                                isDisabled={isVerifying}
                            />
                        )]
                        : []),
                ]}
            />
        </div>
    )
}
