import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { OtpInput } from "@/components/blocks/form/OtpInput"
import { Controlled } from "./components"

/**
 * `OtpInput` — a one-time-code input (2FA / email verification) built on HeroUI
 * `InputOTP`. Controlled: `value` + `onChange` held by the call-site; the block just
 * renders `length` boxes (default 6), a label above and an error line below when
 * `isInvalid`. Tier-3, purely presentational — no store, no fetch.
 */
const meta: Meta<typeof OtpInput> = {
    title: "Core/Form/OtpInput",
    component: OtpInput,
}
export default meta
type Story = StoryObj<typeof OtpInput>

/** A normal 6-digit code + the error state, each with a Label and a short description. */
export const Default: Story = {
    parameters: {
        usage:
            "One-time-code input for 2FA / email verification — `length` defaults to 6, controlled via `value`/`onChange`. " +
            "Pair it with a `Label` (\"Verification code\") and a short hint saying where the code comes from. The error state turns on " +
            "`isInvalid` + `errorMessage` that tells HOW to fix (\"re-enter the code from the email\"), not just that it's 'wrong'.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Default</Label>
                    <Typography type="body-sm" color="muted">
                        Six empty boxes — the code was just sent to the email, the user types each digit.
                    </Typography>
                </div>
                <Controlled
                    label="Verification code"
                    initialValue="12"
                />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Validation error</Label>
                    <Typography type="body-sm" color="muted">
                        The entered code doesn't match — red border and an error line appear below the boxes.
                    </Typography>
                </div>
                <Controlled
                    label="Verification code"
                    initialValue="482913"
                    isInvalid
                    errorMessage="Incorrect code — check the email and enter the latest code."
                />
            </div>
        </div>
    ),
}
