import { CheckCircleIcon, ShieldCheckIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputOtp } from "@sb-components/atoms/forms/Input/Input"
import { QRCode } from "@sb-components/atoms/media/QRCode/QRCode"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `AccountSecurity` — the 2FA panel, a small state machine: `disabled` →
 * `enrolling` → `enabled`. The status IS the data, so the three phases are states
 * of the single shape. Grounded in the real `UserEntity` (`twoFactorEnabled` ·
 * `twoFactorSecret`).
 */

/** The three 2FA phases. */
export type TwoFactorStatusKey = "disabled" | "enrolling" | "enabled"

/** The secret to scan while enrolling — the generated `twoFactorSecret` and its otpauth URI. */
export interface TwoFactorEnrollment {
    /** Base32 shared secret shown for manual entry (`UserEntity.twoFactorSecret`). */
    secret: string
    /** `otpauth://` URI the QR encodes for an authenticator app. */
    otpauthUri: string
}

/** Props for {@link AccountSecurity}. */
export interface AccountSecurityProps {
    /** Which phase the 2FA panel is in. */
    status: TwoFactorStatusKey
    /** The secret + otpauth URI — present only while `status === "enrolling"`. */
    enrollment?: TwoFactorEnrollment | null
    /** The 6-digit confirmation code the user is typing. */
    confirmCode: string
    /** Fires as the confirm field changes. */
    onConfirmChange: (value: string) => void
    /** Begin enrolment — generates a secret (moves `disabled` → `enrolling`). */
    onBeginEnroll: () => void
    /** Confirm the typed code (moves `enrolling` → `enabled`). */
    onConfirmEnroll: () => void
    /** Turn 2FA off (moves `enabled` → `disabled`). */
    onDisable: () => void
    /** `true` → the confirm code is being verified (button busy, field locks). */
    isVerifying?: boolean
    /**
     * `true` → the panel's own first fetch (which phase is 2FA in?) is in flight.
     * Since the phase isn't known yet, the card renders a representative resting
     * shape — title + a line + an action — with every node shimmering (§12b).
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: AccountSecurityLabels
}

/** The already-resolved copy the block renders. */
export interface AccountSecurityLabels {
    /** Card title (e.g. "Two-factor authentication"). */
    title: string
    /** Description shown while disabled. */
    disabledDescription: string
    /** Enable-button label (disabled phase). */
    enableLabel: string
    /** Instruction shown while enrolling (e.g. "Scan this with your authenticator app"). */
    enrollingInstruction: string
    /** Caption above the manual secret (e.g. "Or enter this code manually"). */
    secretLabel: string
    /** Label above the 6-digit confirm field. */
    confirmLabel: string
    /** Confirm-button label (enrolling phase). */
    confirmButtonLabel: string
    /** Confirmation line shown while enabled (e.g. "Two-factor authentication is on."). */
    enabledDescription: string
    /** Label above the 6-digit field that authorises turning 2FA off. */
    disableCodeLabel: string
    /** Disable-button label (enabled phase). */
    disableLabel: string
}

/** The confirm field is a fixed 6-digit code. */
const CONFIRM_LENGTH = 6

/**
 * The 2FA panel. See the file header for why the three phases are states of one
 * shape rather than separate leaves.
 *
 * @param props - {@link AccountSecurityProps}
 */
const AccountSecurity = ({
    status,
    enrollment,
    confirmCode,
    onConfirmChange,
    onBeginEnroll,
    onConfirmEnroll,
    onDisable,
    isVerifying = false,
    isSkeleton = false,
    labels,
}: AccountSecurityProps) => {
    // ── LOADING (§12b): the 2FA phase isn't known before the fetch resolves, so the
    // card shows a representative resting shape (title + a line + an action) shimmering.
    if (isSkeleton) {
        return (
            <div data-tier="block" data-component="AccountSecurity">
                <SurfaceCard
                    padding={3}
                    label={labels.title}
                    isSkeleton
                    body={() => (
                        <StackV
                            gap={3}
                            isSkeleton
                            items={[
                                () => <Typography size="sm" color="muted" isSkeleton text={labels.disabledDescription} />,
                                () => (
                                    <Button
                                        variant="primary"
                                        prefixIcon={ShieldCheckIcon}
                                        label={labels.enableLabel}
                                        isSkeleton
                                        onPress={onBeginEnroll}
                                    />
                                ),
                            ]}
                        />
                    )}
                />
            </div>
        )
    }

    return (
        <div data-tier="block" data-component="AccountSecurity">
            <SurfaceCard
                padding={3}
                label={labels.title}
                body={() => {
                    if (status === "enabled") {
                        return (
                            <StackV
                                gap={3}
                                items={[
                                    () => (
                                        <Typography
                                            size="sm"
                                            color="success"
                                            prefixIcon={CheckCircleIcon}
                                            text={labels.enabledDescription}
                                        />
                                    ),
                                    // Turning 2FA off proves device ownership the same way
                                    // turning it on does — the server rejects the call without
                                    // a current code, so the panel has to collect one. Without
                                    // this field the Disable button is a control that can only
                                    // ever fail.
                                    () => (
                                        <InputOtp
                                            label={labels.disableCodeLabel}
                                            length={CONFIRM_LENGTH}
                                            value={confirmCode}
                                            onValueChange={onConfirmChange}
                                            isDisabled={isVerifying}
                                        />
                                    ),
                                    () => (
                                        <Button
                                            variant="danger"
                                            label={labels.disableLabel}
                                            onPress={onDisable}
                                            isDisabled={confirmCode.length < CONFIRM_LENGTH}
                                            isPending={isVerifying}
                                        />
                                    ),
                                ]}
                            />
                        )
                    }

                    if (status === "enrolling" && enrollment) {
                        return (
                            <StackV
                                gap={3}
                                items={[
                                    () => <Typography size="sm" text={labels.enrollingInstruction} />,
                                    () => (
                                        <StackH
                                            gap={3}
                                            align="start"
                                            items={[
                                                () => <QRCode size={160} data={enrollment.otpauthUri} />,
                                                () => (
                                                    <StackV
                                                        gap={1}
                                                        items={[
                                                            () => <Typography size="xs" color="muted" text={labels.secretLabel} />,
                                                            () => <Typography size="code" text={enrollment.secret} />,
                                                        ]}
                                                    />
                                                ),
                                            ]}
                                        />
                                    ),
                                    () => (
                                        <InputOtp
                                            label={labels.confirmLabel}
                                            length={CONFIRM_LENGTH}
                                            value={confirmCode}
                                            onValueChange={onConfirmChange}
                                            isDisabled={isVerifying}
                                        />
                                    ),
                                    () => (
                                        <Button
                                            variant="primary"
                                            label={labels.confirmButtonLabel}
                                            onPress={onConfirmEnroll}
                                            isDisabled={confirmCode.length < CONFIRM_LENGTH}
                                            isPending={isVerifying}
                                        />
                                    ),
                                ]}
                            />
                        )
                    }

                    // ── DISABLED (the default resting phase).
                    return (
                        <StackV
                            gap={3}
                            items={[
                                () => <Typography size="sm" color="muted" text={labels.disabledDescription} />,
                                () => (
                                    <Button
                                        variant="primary"
                                        prefixIcon={ShieldCheckIcon}
                                        label={labels.enableLabel}
                                        onPress={onBeginEnroll}
                                    />
                                ),
                            ]}
                        />
                    )
                }}
            />
        </div>
    )
}

export { AccountSecurity }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "AccountSecurity" } as const
