import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    AccountSecurity,
    type AccountSecurityLabels,
    type TwoFactorEnrollment,
} from "@sb-components/nivo/blocks/account/AccountSecurity/AccountSecurity"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AccountSecurity` — the 2FA panel, a small state machine: `disabled` →
 * `enrolling` → `enabled`. The status IS the data, so the three phases are states
 * of the single shape. Grounded in the real `UserEntity` (`twoFactorEnabled` ·
 * `twoFactorSecret`).
 */
const meta: Meta<typeof AccountSecurity> = {
    title: "Nivo/Blocks/Account/AccountSecurity/AccountSecurity",
    component: AccountSecurity,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AccountSecurity>

const LABELS: AccountSecurityLabels = {
    title: "Two-factor authentication",
    disabledDescription: "Add a second step at sign-in with an authenticator app.",
    enableLabel: "Enable 2FA",
    enrollingInstruction: "Scan this QR code with your authenticator app.",
    secretLabel: "Or enter this code manually",
    confirmLabel: "Enter the 6-digit code",
    confirmButtonLabel: "Confirm & turn on",
    enabledDescription: "Two-factor authentication is on.",
    disableCodeLabel: "Enter a current code to turn it off",
    disableLabel: "Disable 2FA",
}

const ENROLLMENT: TwoFactorEnrollment = {
    secret: "JBSWY3DPEHPK3PXP",
    otpauthUri: "otpauth://totp/nivo:quang@nivo.vn?secret=JBSWY3DPEHPK3PXP&issuer=nivo",
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the panel; its body switches on the 2FA status" },
    QRCode: { tier: "atom", role: "the otpauth QR shown while enrolling" },
    InputOtp: { tier: "atom", role: "the 6-digit code field — confirms enrolment, and authorises turning 2FA off" },
    Button: { tier: "atom", role: "Enable (disabled) / Confirm (enrolling) / Disable (enabled)" },
    Typography: { tier: "atom", role: "the descriptions, the scan instruction, and the manual secret" },
}

/** LEAF — the panel has one shape; disabled / enrolling / enabled are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AccountSecurity"
                tier="block"
                leaf="Two-factor authentication"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                reason="Blocks take no `className`: 2FA `status` IS the data, so disabled / enrolling / enabled are states of one shape rather than three leaves. The block owns the branch switch (like a block's async switch), rendering the secret + QR + confirm field only while enrolling; the connected layer supplies the generated secret and runs each mutation."
                states={[
                    {
                        name: "status = disabled",
                        why: "2FA is off — the resting phase. Just a short description and an Enable button that generates a secret and moves the panel into enrolling.",
                        code: `<AccountSecurity
    status="disabled"
    confirmCode=""
    onBeginEnroll={begin}
    onConfirmChange={setCode}
    onConfirmEnroll={confirm}
    onDisable={disable}
    labels={labels}
/>`,
                        render: (
                            <AccountSecurity
                                status="disabled"
                                enrollment={null}
                                confirmCode=""
                                onConfirmChange={NOOP}
                                onBeginEnroll={NOOP}
                                onConfirmEnroll={NOOP}
                                onDisable={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "status = enrolling",
                        why: "The secret has been generated but not yet confirmed: the otpauth QR to scan, the same secret for manual entry, and a 6-digit confirm field whose button stays blocked until all six digits are in.",
                        code: "<AccountSecurity status=\"enrolling\" enrollment={enrollment} confirmCode=\"\" … />",
                        render: (
                            <AccountSecurity
                                status="enrolling"
                                enrollment={ENROLLMENT}
                                confirmCode=""
                                onConfirmChange={NOOP}
                                onBeginEnroll={NOOP}
                                onConfirmEnroll={NOOP}
                                onDisable={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "status = enabled",
                        why: "2FA is on. Turning it off proves device ownership exactly like turning it on did, so the phase collects a current code and the danger button stays inert until six digits are in. Without the field the button could only ever fail — the server rejects the call without a code.",
                        code: "<AccountSecurity status=\"enabled\" confirmCode=\"\" onConfirmChange={setCode} onDisable={disable} … />",
                        render: (
                            <AccountSecurity
                                status="enabled"
                                enrollment={null}
                                confirmCode=""
                                onConfirmChange={NOOP}
                                onBeginEnroll={NOOP}
                                onConfirmEnroll={NOOP}
                                onDisable={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "status = enabled, code typed",
                        why: "The six digits are in, so the danger button is live. Shown separately because 'can the user actually press Disable' is the whole point of the phase, and an all-empty state never renders it.",
                        code: "<AccountSecurity status=\"enabled\" confirmCode=\"123456\" onDisable={disable} … />",
                        render: (
                            <AccountSecurity
                                status="enabled"
                                enrollment={null}
                                confirmCode="123456"
                                onConfirmChange={NOOP}
                                onBeginEnroll={NOOP}
                                onConfirmEnroll={NOOP}
                                onDisable={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The panel's own fetch (which 2FA phase?) hasn't resolved yet, so before the phase is known it shows a representative resting shape — the title, a line, and an action — all shimmering, so nothing jumps when the real phase lands.",
                        code: "<AccountSecurity {...props} isSkeleton />",
                        render: (
                            <AccountSecurity
                                status="disabled"
                                enrollment={null}
                                confirmCode=""
                                onConfirmChange={NOOP}
                                onBeginEnroll={NOOP}
                                onConfirmEnroll={NOOP}
                                onDisable={NOOP}
                                isSkeleton
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
