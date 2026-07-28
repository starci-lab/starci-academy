import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputOtp } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Form } from "@sb-components/composites/form/Form/Form"
import { TitledText } from "@sb-components/composites/text/TitledText/TitledText"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `SignInOtp`: the SECOND step of signing in, on its own card. The screen
 * has already collected an address and asked the server to mail a code; this
 * block is the whole of what happens next, from the sentence that names the
 * inbox down to the button that submits the six digits.
 *
 * WHY A BLOCK AND NOT A FORM THE SCREEN ASSEMBLES: two things here are domain
 * judgements, not layout.
 *
 * 1. IT OWNS THE SENTENCE THAT CARRIES THE ADDRESS (§14d.1). The caller hands
 *    over `email` as a bare string and nothing else. It never passes
 *    `"Chúng tôi vừa gửi mã gồm 6 chữ số tới an@vd.com."`, because a caller that
 *    could pass that string would also own the wording, the digit count and the
 *    punctuation, and the same step would read differently on every screen that
 *    mounts it. The number six appears in exactly one place, right here, next to
 *    the field that enforces it.
 *
 * 2. IT OWNS THE RULE THAT A RESEND IN FLIGHT LEAVES THE LINK INERT. While
 *    `isResending` is on, the resend affordance stops being a link at all: it
 *    goes muted and loses its handler, so a second press cannot queue a second
 *    mail. Dimming a link that still fires is the worse of the two failures,
 *    because the reader gets a signal that says "wait" from a control that says
 *    "press me".
 *
 * ⛔ NO SPINNER ON THE RESEND LINE. The verify button already carries the one
 * busy affordance on this card (`isPending`). A second spinner beside it turns a
 * quiet secondary action into a competing focal point, and the muted, unpressable
 * wording says the same thing without adding weight.
 *
 * 📐 SUBMITTING LOCKS THE WHOLE FIELDSET, NOT EACH CONTROL. `isSubmitting` goes
 * to `Form` as `isDisabled`, and `Form` renders a native `<fieldset disabled>` —
 * so the code cells lock without this block threading a flag into every control
 * it composes. The verify button takes `isPending` on top of that, because the
 * lock says "you cannot type" while the spinner says "something is happening".
 *
 * 📐 SEAMS, read as relationships and not as tiers. The header and the entry
 * cluster are two REGIONS of one card, so `Form` spaces them at `section`. Inside
 * the cluster the resend line is a CAPTION hanging under the cells, so that seam
 * is `grouped`. The two halves of the resend line are fragments of one sentence,
 * so their seam is `tight`, the width of a word space rather than a peer gap.
 *
 * 📐 THE VERIFY BUTTON SPANS THE CARD. This step has exactly one way forward, and
 * a small right-aligned button on a card this narrow reads as one option among
 * several. Full width is the honest weight for the only thing there is to do.
 *
 * ⛔ NO `autoFocus` ON THE CELLS. Landing the caret in the first cell is right in
 * the product and wrong here, where several instances of this block mount on one
 * documentation page and fight each other for focus. That belongs to whatever
 * screen mounts this block once.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link SignInOtp}. */
export interface SignInOtpProps {
    /**
     * The address the code was mailed to, as a bare string. The block builds the
     * sentence around it (§14d.1) — never pass a pre-formatted line.
     */
    email: string
    /** The digits typed so far. Six of them make the code complete. */
    code: string
    /** Fired on every keystroke in the code cells. */
    onCodeChange: (value: string) => void
    /**
     * Set → the code was rejected. An error line grows under the cells and every
     * cell takes the invalid border, because the fault belongs to the whole code
     * rather than to one digit.
     */
    codeError?: string
    /** Fired when the learner submits the code, by button or by ENTER in a cell. */
    onSubmit: () => void
    /** `true` → the code is being checked; the fieldset locks and verify goes busy. */
    isSubmitting?: boolean
    /** Fired when the learner asks for a new code. */
    onResend: () => void
    /** `true` → a new code is on its way; the resend line goes muted and inert. */
    isResending?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * The verification step of signing in. See the file header for the full contract.
 *
 * @param props - {@link SignInOtpProps}
 */
const SignInOtp = ({
    email,
    code,
    onCodeChange,
    codeError,
    onSubmit,
    isSubmitting = false,
    onResend,
    isResending = false,
    anatPart,
    showAnatomy = false,
}: SignInOtpProps) => (
    <div data-anat-part={anatPart}>
        <SurfaceCard anatPart={showAnatomy ? "SurfaceCard" : undefined}>
            {/* `Form` carries no `anatPart` of its own, so the block names the node it
                mounts here. Without this the composite renders and stays invisible in
                the Structure tree, which reads as though the card held loose fields. */}
            <div data-anat-part={showAnatomy ? "Form" : undefined}>
                <Form
                    onSubmit={onSubmit}
                    isDisabled={isSubmitting}
                    gap="section"
                    actions={
                        <Button
                            label="Xác minh"
                            variant="primary"
                            onPress={onSubmit}
                            isPending={isSubmitting}
                            className="w-full"
                            anatPart={showAnatomy ? "Button" : undefined}
                        />
                    }
                >
                    {/* The block writes the sentence from `email`; the caller never sees it.
                        `header` scale, because this is the title of the card the reader is
                        looking at, not a row label inside it. */}
                    <TitledText
                        size="header"
                        title="Nhập mã xác minh"
                        subtitle={`Chúng tôi vừa gửi mã gồm 6 chữ số tới ${email}.`}
                        anatPart={showAnatomy ? "TitledText" : undefined}
                    />
                    <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                        {/* The atom exposes `showAnatomy` but no `anatPart`, so the block
                            names the node from outside and stops there: one level of tree
                            per door (§11a.1). */}
                        <div data-anat-part={showAnatomy ? "InputOtp" : undefined}>
                            <InputOtp
                                value={code}
                                onValueChange={onCodeChange}
                                errorMessage={codeError}
                                ariaLabel="Mã xác minh"
                            />
                        </div>
                        <StackH gap="tight" anatPart={showAnatomy ? "StackH" : undefined}>
                            <Typography
                                size="sm"
                                color="muted"
                                text="Chưa nhận được mã?"
                                anatPart={showAnatomy ? "Typography" : undefined}
                            />
                            {isResending ? (
                                // Muted AND handler-less: a dimmed control that still fires
                                // would let a second press queue a second mail.
                                <Typography
                                    size="sm"
                                    color="muted"
                                    text="Đang gửi lại…"
                                    anatPart={showAnatomy ? "Typography" : undefined}
                                />
                            ) : (
                                <Typography
                                    size="sm"
                                    isLink
                                    onPress={onResend}
                                    text="Gửi lại"
                                    anatPart={showAnatomy ? "Typography" : undefined}
                                />
                            )}
                        </StackH>
                    </StackV>
                </Form>
            </div>
        </SurfaceCard>
    </div>
)

export { SignInOtp }
