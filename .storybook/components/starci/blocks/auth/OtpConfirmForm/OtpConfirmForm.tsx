import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputOtp } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Form } from "@sb-components/composites/form/Form/Form"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `OtpConfirmForm`: step two of signing in, where the learner types the
 * code that just landed in their mailbox.
 *
 * WHY THIS IS A BLOCK AND NOT A LEAF OF THE CREDENTIALS FORM. `SignInSection`
 * switches between the two steps on `SignInState`, and the two steps share
 * nothing but the surface they sit on: one holds an email field, a password
 * field, a remember switch and a forgot link, the other holds a row of code
 * cells and a resend pair. A leaf is the same tree under a different prop, and
 * these are two different trees, so they are two blocks (rules/2 §0).
 *
 * WHAT IT OWNS — THE SENTENCE. The caller hands down `email` as data and this
 * block writes "Kiểm tra hộp thư {email} rồi nhập mã xác nhận bên dưới." itself,
 * the same shape `t.rich("auth.signIn.otp.desc")` produces in `src`, with the
 * address carrying the accent tone so the reader can check at a glance that the
 * code went where they expected. Handing the finished sentence in as a prop
 * would move that decision to the caller, which §14d.1 forbids.
 *
 * WHAT IT OWNS — THE ERROR WORDING. `codeError` arrives as an enum, never as a
 * message. {@link OTP_ERROR_TEXT} is the one place "required" becomes "Vui lòng
 * nhập mã OTP", so a second caller cannot word the same failure differently.
 *
 * THE RESEND PAIR IS ONE NODE IN BOTH STATES, NOT TWO. While a resend is in
 * flight the action keeps its place in the row and swaps to muted text with no
 * handler, so it reads as unavailable rather than missing. Rendering a second,
 * different node for the busy case would make the row jump width mid-request,
 * and a control that moves while you are waiting on it invites a second click.
 *
 * WHY THE WHOLE FORM LOCKS WHILE SUBMITTING. `Form` is given `isDisabled`
 * instead of each control being told separately, because the composite locks by
 * native `<fieldset disabled>` — one flag, one owner, every control inside it.
 * The resend link is an anchor rather than a form control, so it deliberately
 * survives that lock: a verify that is taking too long is exactly when someone
 * wants a fresh code.
 *
 * WHY THE SUBMIT BUTTON CARRIES `onPress` AND THE FORM CARRIES `onSubmit`. The
 * `Button` atom renders a plain button, not a submit button, so the click path
 * needs its own handler; the `<form>` keeps its own handler so that pressing
 * Enter inside the code cells also confirms. Both roads call the same prop, and
 * a click never travels down both.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Why the typed code was rejected. An ENUM, not a message: the block turns it
 * into the sentence under the cells (see {@link OTP_ERROR_TEXT}).
 *
 * `required` — the reader confirmed with nothing typed.
 * `invalid` — the reader confirmed with fewer than six digits.
 */
export type SignInOtpError = "required" | "invalid"

/** Rejection reason to the line the reader sees under the cells. */
const OTP_ERROR_TEXT: Record<SignInOtpError, string> = {
    required: "Vui lòng nhập mã OTP",
    invalid: "Mã OTP phải gồm 6 chữ số",
}

/**
 * Six cells, matching the code the sign-in mail sends. A constant rather than a
 * prop: the length is a fact about the mail this product sends, so a caller has
 * nothing to decide here.
 */
const CODE_LENGTH = 6

const TITLE = "Nhập mã OTP"
const SUBMIT_LABEL = "Xác nhận"
const RESEND_QUESTION = "Không nhận được email?"
const RESEND_ACTION = "Gửi lại mã"
/**
 * The in-flight wording of the resend action. It is written here rather than
 * taken from `src/messages` because that file has no key for it — the original
 * only greyed the same words out, which leaves the reader unsure whether their
 * press registered. The present-progressive form matches the sibling wording
 * already in the same message block ("Đang kiểm tra email…").
 */
const RESEND_IN_FLIGHT = "Đang gửi lại…"

/** Props for {@link OtpConfirmForm}. */
export interface OtpConfirmFormProps {
    /** Mailbox the code was sent to. The block writes the sentence around it. */
    email: string
    /** Digits typed so far, shortest to longest — "" through six characters. */
    code: string
    /** Fired on every cell change with the whole code, not just the new digit. */
    onCodeChange: (value: string) => void
    /** Set → the cells take the error border and the reason appears under them. */
    codeError?: SignInOtpError
    /** Fired by the confirm button and by Enter inside the cells. */
    onSubmit: () => void
    /** `true` → the code is being verified; the form locks and the button spins. */
    isSubmitting?: boolean
    /** Fired when the reader asks for a fresh code. */
    onResend: () => void
    /** `true` → a fresh code is being sent; the resend action goes quiet. */
    isResending?: boolean
    /** `true` → every atom of this block draws its own resting mirror. */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The OTP step of sign-in. See the file header for the full contract.
 *
 * @param props - {@link OtpConfirmFormProps}
 */
const OtpConfirmForm = ({
    email,
    code,
    onCodeChange,
    codeError,
    onSubmit,
    isSubmitting = false,
    onResend,
    isResending = false,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: OtpConfirmFormProps) => {
    // The block builds the sentence out of the address it was handed (§14d.1).
    // The one `span` here is a TONE, not a layout decision: the text atom has no
    // inline-emphasis axis, and the accent on the address is what lets the reader
    // spot a typo in their own mailbox before waiting for a mail that never comes.
    const description = (
        <>
            Kiểm tra hộp thư <span className="text-accent-soft-foreground">{email}</span> rồi nhập mã xác nhận bên dưới.
        </>
    )

    // One node either way (see the file header): the live link and the in-flight
    // line are the same slot of the same row, so the row never changes shape.
    const resendAction = isResending ? (
        <Typography
            size="xs"
            color="muted"
            text={RESEND_IN_FLIGHT}
            isSkeleton={isSkeleton}
            anatPart={showAnatomy ? "Typography" : undefined}
        />
    ) : (
        <Typography
            size="xs"
            isLink
            onPress={onResend}
            text={RESEND_ACTION}
            isSkeleton={isSkeleton}
            anatPart={showAnatomy ? "Typography" : undefined}
        />
    )

    return (
        <div data-anat-part={anatPart}>
            <SurfaceCard anatPart={showAnatomy ? "SurfaceCard" : undefined}>
                {/*
                    `Form` has no anatomy tag of its own, so the badge rides a wrapper here.
                    Its own `showAnatomy` stays off on purpose: the composite's inner column
                    is its geometry, documented in its own story, and nesting two badge tiers
                    only makes this tree harder to read (§11a.1).
                */}
                <div data-anat-part={showAnatomy ? "Form" : undefined}>
                    <Form
                        onSubmit={onSubmit}
                        isDisabled={isSubmitting}
                        gap="section"
                        body={
                            <>
                                {/* flush: the title and the sentence under it are ONE unit of meaning. */}
                                <StackV gap="flush" align="center" anatPart={showAnatomy ? "StackV" : undefined}>
                                    <Typography
                                        size="base"
                                        weight="medium"
                                        align="center"
                                        text={TITLE}
                                        isSkeleton={isSkeleton}
                                        anatPart={showAnatomy ? "Typography" : undefined}
                                    />
                                    <Typography
                                        size="xs"
                                        color="muted"
                                        align="center"
                                        text={description}
                                        isSkeleton={isSkeleton}
                                        anatPart={showAnatomy ? "Typography" : undefined}
                                    />
                                </StackV>
                                {/* grouped: the cells and the resend line are two ROWS of one surface. */}
                                <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                                    {/*
                                        The OTP atom carries no anatomy tag either, and its cells are its
                                        own inner geometry (§13z), so the badge sits on the wrapper and the
                                        atom is left to document its own row of slots.
                                    */}
                                    <div data-anat-part={showAnatomy ? "InputOtp" : undefined}>
                                        <InputOtp
                                            value={code}
                                            onValueChange={onCodeChange}
                                            length={CODE_LENGTH}
                                            ariaLabel={TITLE}
                                            errorMessage={codeError != null ? OTP_ERROR_TEXT[codeError] : undefined}
                                            isSkeleton={isSkeleton}
                                        />
                                    </div>
                                    {/* related: the question and the action are PEERS of one line. */}
                                    <StackH gap="related" justify="center" wrap anatPart={showAnatomy ? "StackH" : undefined}>
                                        <Typography
                                            size="xs"
                                            color="muted"
                                            text={RESEND_QUESTION}
                                            isSkeleton={isSkeleton}
                                            anatPart={showAnatomy ? "Typography" : undefined}
                                        />
                                        {resendAction}
                                    </StackH>
                                </StackV>
                            </>
                        }
                        actions={
                            <Button
                                label={SUBMIT_LABEL}
                                onPress={onSubmit}
                                isPending={isSubmitting}
                                isSkeleton={isSkeleton}
                                className="w-full"
                                anatPart={showAnatomy ? "Button" : undefined}
                            />
                        }
                    />
                </div>
            </SurfaceCard>
        </div>
    )
}

export { OtpConfirmForm }
