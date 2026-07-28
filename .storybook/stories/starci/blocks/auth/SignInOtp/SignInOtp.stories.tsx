import type { Meta, StoryObj } from "@storybook/nextjs"
import { SignInOtp } from "@sb-components/starci/blocks/auth/SignInOtp/SignInOtp"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `SignInOtp`: the second step of signing in, alone on its card. It names
 * the inbox the code went to, takes the six digits, offers a resend, and submits.
 *
 * IT OWNS THE SENTENCE. `email` arrives as a bare string and the block writes
 * "Chúng tôi vừa gửi mã gồm 6 chữ số tới …" around it. A caller that could pass
 * the finished line would own the wording and the digit count too, and the same
 * step would read differently on every screen that mounts it.
 *
 * IT OWNS THE RESEND RULE. While a resend is in flight the link is not dimmed, it
 * is replaced by muted text with no handler, so a second press cannot queue a
 * second mail. That is why `isResending` is a LEAF and not a state: the caller
 * flips a prop and a node changes identity.
 *
 * 📐 LEAF by what the CALLER flips (rules/2 §0). `code` is data, so an empty field
 * and a full one are two STATES of `Default`. `codeError`, `isSubmitting` and
 * `isResending` are optional props the caller turns on, and each one changes the
 * shape, so each gets its own leaf.
 *
 * ⛔ There is deliberately NO leaf for "resend already succeeded". Nothing on this
 * card changes when a new code lands — the cells are still empty and the link is
 * live again, which is exactly `Default` (§14d.3, do not invent a case no screen
 * asks for).
 */
const meta: Meta<typeof SignInOtp> = {
    title: "StarCi/Blocks/Auth/SignInOtp/SignInOtp",
    component: SignInOtp,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SignInOtp>

const EMAIL = "an.nguyen@congty.vn"

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the one card face this step lives on, owning the padding and the border so the block never draws a surface of its own", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "Form": { tier: "composite", role: "the real form element, so ENTER inside a cell submits, and the fieldset that locks every control at once while the code is being checked", storyId: "composites-form-form-form--default" },
    "TitledText": { tier: "composite", role: "the panel header, taking the title and the sentence the block wrote from the address and owning the type scale for both lines", storyId: "composites-texts-titledtext--header" },
    "StackV": { tier: "frame", role: "the vertical frame holding the entry cluster, so the resend line sits under the cells as their caption rather than as a separate region", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the horizontal frame for the resend line, keeping the question and the answer on one baseline a word space apart", storyId: "frames-stack-stackh--default" },
    "InputOtp": { tier: "atom", role: "the six code cells, drawing the invalid border and the error line itself when the block hands it a message", storyId: "atoms-forms-input-inputotp--default" },
    "Typography": { tier: "atom", role: "one half of the resend line, either the muted question, the live resend link, or the muted wording that replaces the link while a new code is on its way", storyId: "atoms-text-typography-typography--plain" },
    "Button": { tier: "atom", role: "the single forward action, spanning the card because this step has exactly one way on, and carrying the busy spinner while the code is checked", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — the plain call: an address, the cells, the resend line, the verify button. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SignInOtp"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                reason="The header, the cells and the resend line never move: whatever the caller flips, this card keeps one region for what is going on and one region for entering the code."
                states={[
                    {
                        name: "code = \"\"",
                        why: "All six cells are empty and the verify button sits ready but with nothing to check yet. This is the shape a reader meets the moment they arrive from the address step, while they are still opening their inbox in another window.",
                        code: `<SignInOtp
    email="an.nguyen@congty.vn"
    code=""
    onCodeChange={setCode}
    onSubmit={verify}
    onResend={resend}
/>`,
                        render: (
                            <SignInOtp
                                anatPart="SignInOtp"
                                showAnatomy
                                email={EMAIL}
                                code=""
                                onCodeChange={() => {}}
                                onSubmit={() => {}}
                                onResend={() => {}}
                            />
                        ),
                    },
                    {
                        name: "code = \"482910\"",
                        why: "Every cell now carries a digit and nothing else on the card has moved. The code being complete is a fact about the data rather than a new shape, which is why verify stays exactly where it was instead of appearing once the field fills up.",
                        code: `<SignInOtp
    email="an.nguyen@congty.vn"
    code="482910"
    onCodeChange={setCode}
    onSubmit={verify}
    onResend={resend}
/>`,
                        render: (
                            <SignInOtp
                                email={EMAIL}
                                code="482910"
                                onCodeChange={() => {}}
                                onSubmit={() => {}}
                                onResend={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller reports a rejected code, so an error line grows under the cells. */
export const Invalid: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SignInOtp"
                tier="block"
                leaf="Prop `codeError`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                reason="The message belongs to the whole code, so it lands under the row of cells and every cell takes the invalid border together rather than one digit being singled out."
                states={[
                    {
                        name: "codeError = \"Mã OTP phải gồm 6 chữ số\"",
                        why: "A line of danger text grows under the cells and pushes the resend line down, while all six cells switch to the invalid border. The fault is with the code as a whole, so marking one cell would send the reader hunting for the digit that is wrong when the real answer is that the code is too short.",
                        code: `<SignInOtp
    email="an.nguyen@congty.vn"
    code="4829"
    onCodeChange={setCode}
    codeError="Mã OTP phải gồm 6 chữ số"
    onSubmit={verify}
    onResend={resend}
/>`,
                        render: (
                            <SignInOtp
                                anatPart="SignInOtp"
                                showAnatomy
                                email={EMAIL}
                                code="4829"
                                onCodeChange={() => {}}
                                codeError="Mã OTP phải gồm 6 chữ số"
                                onSubmit={() => {}}
                                onResend={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the code is being checked: the fieldset locks and verify goes busy. */
export const Submitting: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SignInOtp"
                tier="block"
                leaf="Prop `isSubmitting`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                reason="One flag reaches the form rather than every control, because the form draws a native disabled fieldset and the browser locks the cells and the button underneath it."
                states={[
                    {
                        name: "isSubmitting = true",
                        why: "The verify button swaps its label area for a spinner and every control inside the card stops responding, the cells included. The lock and the spinner say two different things on purpose: one tells the reader they cannot type any more, the other tells them the wait is expected.",
                        code: `<SignInOtp
    email="an.nguyen@congty.vn"
    code="482910"
    onCodeChange={setCode}
    onSubmit={verify}
    isSubmitting
    onResend={resend}
/>`,
                        render: (
                            <SignInOtp
                                anatPart="SignInOtp"
                                showAnatomy
                                email={EMAIL}
                                code="482910"
                                onCodeChange={() => {}}
                                onSubmit={() => {}}
                                isSubmitting
                                onResend={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a new code is on its way, so the resend link is replaced by muted wording. */
export const Resending: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SignInOtp"
                tier="block"
                leaf="Prop `isResending`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                reason="Only the second half of the resend line changes; the cells and the verify button stay live, because asking for a new code is not a reason to stop someone typing the one they already have."
                states={[
                    {
                        name: "isResending = true",
                        why: "The accent resend link is gone and muted text stands in its place, with no handler behind it, so a second press cannot queue a second mail. A link that dims but still fires is the worse failure, since the reader is being told to wait by a control that still invites a press.",
                        code: `<SignInOtp
    email="an.nguyen@congty.vn"
    code=""
    onCodeChange={setCode}
    onSubmit={verify}
    onResend={resend}
    isResending
/>`,
                        render: (
                            <SignInOtp
                                anatPart="SignInOtp"
                                showAnatomy
                                email={EMAIL}
                                code=""
                                onCodeChange={() => {}}
                                onSubmit={() => {}}
                                onResend={() => {}}
                                isResending
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
