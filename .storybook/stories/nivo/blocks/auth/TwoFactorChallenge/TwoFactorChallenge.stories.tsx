import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    TwoFactorChallenge,
    type TwoFactorChallengeLabels,
} from "@sb-components/nivo/blocks/auth/TwoFactorChallenge/TwoFactorChallenge"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `TwoFactorChallenge` — the step that completes a sign-in for an account with
 * 2FA on. The password (or the social identity) is already accepted by the time
 * this renders; the server is holding a short-lived challenge and the only thing
 * still owed is the code. Grounded in the real `AuthPayload`
 * (`requiresTwoFactor` · `twoFactorToken`) and the `verifyTwoFactor` mutation.
 */
const meta: Meta<typeof TwoFactorChallenge> = {
    title: "Nivo/Blocks/Auth/TwoFactorChallenge/TwoFactorChallenge",
    component: TwoFactorChallenge,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof TwoFactorChallenge>

const LABELS: TwoFactorChallengeLabels = {
    title: "Two-factor authentication",
    instruction: "Enter the 6-digit code from your authenticator app.",
    codeLabel: "Authentication code",
    submitLabel: "Verify & sign in",
    cancelLabel: "Use a different account",
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    StackV: { tier: "frame", role: "stacks the heading, the field and the two actions" },
    InputOtp: { tier: "atom", role: "the 6-digit code field" },
    Button: { tier: "atom", role: "Verify (primary) and the ghost way back out" },
    Typography: { tier: "atom", role: "the heading, the instruction, and a rejected-code message" },
}

/** LEAF — one shape; typed / empty / verifying / rejected are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TwoFactorChallenge"
                tier="block"
                leaf="Two-factor challenge"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="Blocks take no `className`: the challenge has one shape, and empty / typed / verifying / rejected are states of it rather than separate leaves. The block owns neither the challenge token nor the mutation — that is what lets the same step serve password sign-in and the OAuth callback."
                states={[
                    {
                        name: "empty",
                        why: "The step as it first appears. The primary action is inert: a code shorter than six digits cannot be right, so pressing it would only spend a round-trip to be told so.",
                        code: `<TwoFactorChallenge
    code=""
    onCodeChange={setCode}
    onSubmit={verify}
    onCancel={back}
    labels={labels}
/>`,
                        render: (
                            <TwoFactorChallenge
                                code=""
                                onCodeChange={NOOP}
                                onSubmit={NOOP}
                                onCancel={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "code typed",
                        why: "Six digits are in and the primary action is live — the only state in which signing in can actually proceed.",
                        code: "<TwoFactorChallenge code=\"123456\" onSubmit={verify} … />",
                        render: (
                            <TwoFactorChallenge
                                code="123456"
                                onCodeChange={NOOP}
                                onSubmit={NOOP}
                                onCancel={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "verifying",
                        why: "The code is with the server. The field locks and the button carries the pending state, so a second press cannot spend the same one-time code twice.",
                        code: "<TwoFactorChallenge code=\"123456\" isVerifying … />",
                        render: (
                            <TwoFactorChallenge
                                code="123456"
                                onCodeChange={NOOP}
                                onSubmit={NOOP}
                                onCancel={NOOP}
                                isVerifying
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "rejected",
                        why: "The server refused the code. The message sits inline next to the field that produced it — a toast would be gone by the time the next code is typed, and TOTP codes are wrong often enough (clock drift, an expired window) that this is an ordinary state, not an exception.",
                        code: "<TwoFactorChallenge code=\"123456\" errorMessage=\"That code is not valid.\" … />",
                        render: (
                            <TwoFactorChallenge
                                code="123456"
                                onCodeChange={NOOP}
                                onSubmit={NOOP}
                                onCancel={NOOP}
                                errorMessage="That code is not valid — check the app and try again."
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "no way back",
                        why: "`onCancel` omitted: the OAuth callback route has nowhere to go back to (the credentials form was never on screen), so the ghost action is absent rather than dead.",
                        code: "<TwoFactorChallenge code=\"\" onSubmit={verify} labels={labels} />",
                        render: (
                            <TwoFactorChallenge
                                code=""
                                onCodeChange={NOOP}
                                onSubmit={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
