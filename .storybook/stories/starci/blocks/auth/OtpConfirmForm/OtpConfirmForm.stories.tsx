import type { Meta, StoryObj } from "@storybook/nextjs"
import { OtpConfirmForm } from "@sb-components/starci/blocks/auth/OtpConfirmForm/OtpConfirmForm"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `OtpConfirmForm`: step two of signing in. The learner has already
 * handed over an email and a password; this is where they type the six-digit
 * code that answered.
 *
 * SEPARATE BLOCK, NOT A LEAF OF THE CREDENTIALS FORM. `SignInSection` switches
 * between the two steps on `SignInState`, and the two hold different trees — a
 * pair of text fields against a row of code cells and a resend line. A leaf is
 * one tree under a different prop, so two trees are two blocks.
 *
 * IT OWNS THE SENTENCE. `email` comes in as data and the block writes "Kiểm tra
 * hộp thư {email} rồi nhập mã xác nhận bên dưới." around it, the shape
 * `t.rich("auth.signIn.otp.desc")` produces in `src`. It owns the rejection
 * wording the same way: `codeError` is an enum, never a message.
 *
 * LEAF by STRUCTURE. Everything the sign-in flow does to this form — typing,
 * failing validation, verifying, asking for a fresh code — leaves the same node
 * tree standing and only changes what those nodes say, so all four are STATES of
 * one leaf. Only `isSkeleton` swaps every atom for its own mirror, which is a
 * shape the block draws itself, so that one earns a leaf.
 *
 * NO "resend failed" LEAF. A failed resend surfaces as a toast in `src`, not
 * inside this card, so building that state here would invent a case no screen
 * asks for.
 */
const meta: Meta<typeof OtpConfirmForm> = {
    title: "StarCi/Blocks/Auth/OtpConfirmForm/OtpConfirmForm",
    component: OtpConfirmForm,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof OtpConfirmForm>

const EMAIL = "hoang.nam@gmail.com"

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the card face the whole step sits on, owning the surface and the padding that holds it away from the edge", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "Form": { tier: "composite", role: "the real form element, so Enter inside the cells confirms, and the one place the step locks itself while a code is being verified", storyId: "composites-form-form-form--default" },
    "StackV": { tier: "frame", role: "a vertical track, once for the title cluster and once for the cells with the resend line under them", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the horizontal track that centres the resend question beside the resend action on one line", storyId: "frames-stack-stackh--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines, being the title, the sentence naming the mailbox, the resend question or the resend action, real or its skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
    "InputOtp": { tier: "atom", role: "the row of code cells, owning the cell geometry, the caret, the error border and the line that carries the rejection reason", storyId: "atoms-forms-input-inputotp--default" },
    "Button": { tier: "atom", role: "the confirm action, full width because it is the only way forward from this step, owning its own busy spinner", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — the live form: one tree, four things the sign-in flow can do to it. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="OtpConfirmForm"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="The tree never changes across these four states. The cells, the resend line and the confirm button are always present, so what moves between states is wording and weight, never a node."
                states={[
                    {
                        name: "code = \"\"",
                        why: "Six empty cells sit under the sentence naming the mailbox, and the confirm button is live rather than greyed. The step opens live because a learner arriving with the code already in view should be able to type and press without the form first telling them what they have not done yet.",
                        code: `<OtpConfirmForm
    email="hoang.nam@gmail.com"
    code=""
    onCodeChange={setCode}
    onSubmit={verify}
    onResend={resend}
/>`,
                        render: (
                            <OtpConfirmForm
                                anatPart="OtpConfirmForm"
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
                        name: "code = \"4821\"",
                        why: "Four cells carry digits and the fifth is the next one to take input, while the rest of the tree stands exactly where it was. Partial typing is the ordinary condition of this step, so nothing about the form reacts to it, and a form that started warning at the fourth digit would be scolding someone who is still typing.",
                        code: `<OtpConfirmForm
    email="hoang.nam@gmail.com"
    code="4821"
    onCodeChange={setCode}
    onSubmit={verify}
    onResend={resend}
/>`,
                        render: (
                            <OtpConfirmForm
                                email={EMAIL}
                                code="4821"
                                onCodeChange={() => {}}
                                onSubmit={() => {}}
                                onResend={() => {}}
                            />
                        ),
                    },
                    {
                        name: "codeError = \"invalid\"",
                        why: "The cells take the error border and a line appears under them reading \"Mã OTP phải gồm 6 chữ số\", pushing the resend row down by exactly that line. The reason is written from the enum by the block, so a short code is described the same way everywhere it can happen, and the message sits under the control it is about rather than at the top of the card.",
                        code: `<OtpConfirmForm
    email="hoang.nam@gmail.com"
    code="4821"
    codeError="invalid"
    onCodeChange={setCode}
    onSubmit={verify}
    onResend={resend}
/>`,
                        render: (
                            <OtpConfirmForm
                                email={EMAIL}
                                code="4821"
                                codeError="invalid"
                                onCodeChange={() => {}}
                                onSubmit={() => {}}
                                onResend={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSubmitting = true",
                        why: "The confirm button trades its label space for a spinner and every control inside the form goes flat, the cells included, because the form locks itself through one native fieldset. A code already sent for checking must not keep being edited underneath the request, and locking in one place is what keeps the cells and the button from disagreeing about whether the step is busy.",
                        code: `<OtpConfirmForm
    email="hoang.nam@gmail.com"
    code="482193"
    isSubmitting
    onCodeChange={setCode}
    onSubmit={verify}
    onResend={resend}
/>`,
                        render: (
                            <OtpConfirmForm
                                email={EMAIL}
                                code="482193"
                                isSubmitting
                                onCodeChange={() => {}}
                                onSubmit={() => {}}
                                onResend={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isResending = true",
                        why: "The resend action keeps its slot on the line but drops its accent and its handler, reading \"Đang gửi lại…\" in muted text until the new code is on its way. It stays in place rather than disappearing so the row never changes width mid-request, because a control that shifts while someone is waiting on it is a control they press twice.",
                        code: `<OtpConfirmForm
    email="hoang.nam@gmail.com"
    code=""
    isResending
    onCodeChange={setCode}
    onSubmit={verify}
    onResend={resend}
/>`,
                        render: (
                            <OtpConfirmForm
                                email={EMAIL}
                                code=""
                                isResending
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

/** LEAF — the caller flips `isSkeleton`, so every atom swaps to its own mirror. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="OtpConfirmForm"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "isSkeleton, email set",
                        why: "Each atom draws its own resting shape in the box it will hand back, and the OTP atom mirrors itself as a row of six cell-shaped squares rather than one long bar. Keeping the exact box of the real control is what stops the card from resizing at the moment the challenge lands, which is also the moment the reader is looking straight at it.",
                        code: "<OtpConfirmForm email=\"hoang.nam@gmail.com\" code=\"\" isSkeleton onCodeChange={setCode} onSubmit={verify} onResend={resend} />",
                        render: (
                            <OtpConfirmForm
                                anatPart="OtpConfirmForm"
                                showAnatomy
                                email={EMAIL}
                                code=""
                                isSkeleton
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
