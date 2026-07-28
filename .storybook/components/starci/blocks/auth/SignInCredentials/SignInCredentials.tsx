import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import { ChoiceCheckbox } from "@sb-components/atoms/forms/Choice/Choice"
import { InputPassword, InputText } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Form } from "@sb-components/composites/form/Form/Form"
import { TitledText } from "@sb-components/composites/text/TitledText/TitledText"
import { Split } from "@sb-components/frames/Split/Split"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { SignInProviders, type SignInProviderKey } from "@sb-components/starci/blocks/auth/SignInProviders/SignInProviders"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `SignInCredentials`: the whole first step of signing in, on one card.
 * The panel header, the provider column, the labelled rule between the two ways
 * in, the two credential fields, the remember row, the submit, and the exit to
 * sign-up.
 *
 * WHY THIS BLOCK OWNS THE CARD FACE. A screen may compose blocks and frames
 * only, never a composite (rules/1 §2), so the login screen cannot reach
 * `SurfaceCard` and draw the panel itself. The choice is therefore between one
 * block owning the face and several blocks each owning a slice of a face that
 * nobody owns whole. One owner wins: the card, its padding and the rhythm
 * between its regions are a single decision, and a single decision belongs to a
 * single component.
 *
 * WHY IT EARNS ITS LAYER OVER THE BLOCK IT NESTS. `SignInProviders` sits inside
 * this card, which block-imports-block allows since 2026-07-28 provided the
 * wrapper adds something of its own (`check-passthrough-block`). This one adds
 * three things no child holds: the FORM (two fields, a remember flag, a submit
 * that closes both roads while a request is in flight), the WORDING of every
 * line on the panel, and the DECISION that the rule saying HOẶC exists only
 * while there is a provider column above it to close off.
 *
 * ERRORS ARRIVE AS ENUMS, NOT AS SENTENCES — DELIBERATE DEVIATION FROM THE
 * BRIEF. The brief specified `emailError?: string` and `passwordError?: string`.
 * A block that accepts the sentence stops owning the wording, which is the one
 * thing §14d.1 says this tier is for, and rules/3 §5 lists a pre-formatted
 * string among the props a block must refuse. So the props are closed unions and
 * the tables below turn them into the sentences the visitor reads. The visible
 * result is identical; what changes is that two screens can no longer ship two
 * different sentences for the same failure.
 *
 * WHY THE SUBMIT DECISION LIVES HERE. There are two roads into submit: pressing
 * the button, and pressing ENTER inside a field, which submits the native
 * `<form>` that `Form` renders. While `isSubmitting` is on, `Form` locks its
 * `<fieldset disabled>` (which takes every control including the button) AND the
 * handler is unhooked, because a guard on one road is not a guard.
 *
 * WHY THE SUBMIT IS THE ONLY PRIMARY. The provider buttons below the header are
 * all `secondary` by their own block's decision, and this panel is why: a card
 * with two competing primaries tells the visitor nothing about which road the
 * product expects. Email and password is the road this product is built around,
 * so it takes the one strong weight and everything else stays quiet — the
 * recovery link and the sign-up exit are `xs` text rather than buttons for the
 * same reason.
 *
 * SEAMS, READ AS RELATIONS RATHER THAN AS TIERS (rules/3 §1). Between the four
 * regions of the panel it is `section`: the header, the provider group, the form
 * and the sign-up prompt each have their own purpose and the visitor names them
 * separately. Inside the provider group it drops to `grouped`, because the rule
 * is not a peer of the buttons, it is the line that closes them off. Inside the
 * form the field column is `grouped` while `Form`'s own default keeps the fields
 * away from the submit, so the seam around the button cannot drift when a field
 * is added. The remember row is `related`, since its two sides are peers on one
 * line.
 *
 * WHY THE REMEMBER ROW IS A `Split` AND NOT A `StackH`. The two sides are named
 * and behave differently under pressure: the checkbox is the reading anchor and
 * may give way, the recovery link must never be squeezed. That contract is what
 * `Split` exists to state once instead of at every call site, and the row keeps
 * the frame even when the recovery link is absent, so the checkbox does not
 * change its box depending on whether a handler was wired.
 *
 * NO `isSkeleton`. Every other prop on this panel is either typed by the visitor
 * or compiled into the bundle, so there is no request whose arrival a shimmer
 * would be standing in for. A resting mirror here would fake a wait that never
 * happens, and the sibling `SignInProviders` refuses the flag for the same
 * reason.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * What went wrong with the email, as a closed set. A union rather than a string
 * so that adding a case is a compile error in the table below instead of a
 * sentence smuggled in from a call site.
 */
export type SignInEmailError = "required" | "invalid" | "unknownAccount"

/** What went wrong with the password. Same closed-set rule as {@link SignInEmailError}. */
export type SignInPasswordError = "required" | "tooShort"

/**
 * Email failure to the sentence the reader gets. A TABLE rather than a chain of
 * `if`s, so a new member of the union makes the compiler point at the missing
 * line instead of letting an unworded case fall through in silence.
 */
const EMAIL_ERROR_TEXT: Record<SignInEmailError, string> = {
    required: "Vui lòng nhập email",
    invalid: "Vui lòng nhập địa chỉ email hợp lệ",
    unknownAccount: "Chưa có tài khoản nào dùng email này",
}

/** Password failure to the sentence the reader gets. Same table rule as {@link EMAIL_ERROR_TEXT}. */
const PASSWORD_ERROR_TEXT: Record<SignInPasswordError, string> = {
    required: "Vui lòng nhập mật khẩu",
    tooShort: "Mật khẩu phải có ít nhất 8 ký tự",
}

/**
 * Every fixed line on the panel, gathered in one table. They are constants
 * rather than props for the reason §14d.1 gives: a caller able to pass them in
 * would own the wording, and this block would become a layout with opinions
 * about nothing.
 */
const PANEL_TEXT = {
    title: "Đăng nhập",
    subtitle: "Tiếp tục việc học của bạn tại StarCi Academy.",
    /** The rule between the two ways in. Upper case because it is a divider label, not a sentence. */
    orRule: "HOẶC",
    emailLabel: "Email",
    emailPlaceholder: "Nhập email của bạn",
    passwordLabel: "Mật khẩu",
    passwordPlaceholder: "Nhập mật khẩu của bạn",
    remember: "Ghi nhớ đăng nhập",
    forgotPassword: "Quên mật khẩu?",
    submit: "Đăng nhập",
    signUpPrompt: "Chưa có tài khoản?",
    signUpAction: "Đăng ký",
}

/** Props for {@link SignInCredentials}. */
export interface SignInCredentialsProps {
    /**
     * The identity providers to offer above the fields, in display order. An
     * EMPTY array drops the provider column AND the rule under it, because a
     * rule with nothing above it separates the fields from the top of the card
     * and reads as a heading that lost its words.
     */
    providers: Array<SignInProviderKey>
    /** Fires with the provider the visitor picked. */
    onPressProvider: (provider: SignInProviderKey) => void
    /**
     * The provider whose redirect is already in flight. Passed straight down:
     * the shape it changes is a button inside the nested block, so that block's
     * own story is where the case is documented.
     */
    pendingProvider?: SignInProviderKey
    /** Current email value (controlled). */
    email: string
    /** Fires with the new email on every keystroke. */
    onEmailChange: (value: string) => void
    /** Which email rule failed. Omit while the field is valid or still untouched. */
    emailError?: SignInEmailError
    /** Current password value (controlled). */
    password: string
    /** Fires with the new password on every keystroke. */
    onPasswordChange: (value: string) => void
    /** Which password rule failed. Omit while the field is valid or still untouched. */
    passwordError?: SignInPasswordError
    /** `true` → keep the session alive past this browser run. */
    isRemembered: boolean
    /** Fires with the new remember state. */
    onRememberedChange: (value: boolean) => void
    /** Send the credentials. Reached from the button AND from ENTER inside a field. */
    onSubmit: () => void
    /**
     * `true` while the credentials are in flight: the submit takes a spinner in
     * place of its glyph and the whole fieldset locks, so a second press cannot
     * start a second attempt.
     */
    isSubmitting?: boolean
    /**
     * Start account recovery. OPTIONAL, and its presence is what draws the link:
     * a screen with no recovery route wired up must not offer a way to one.
     */
    onPressForgotPassword?: () => void
    /** Move the visitor to the sign-up side. Always offered, so it is required. */
    onPressSignUp: () => void
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The email-and-password sign-in panel, card and all. See the file header for
 * why this block owns the card face, why the errors arrive as enums, and why the
 * submit is guarded on both roads.
 *
 * @param props - {@link SignInCredentialsProps}
 */
const SignInCredentials = ({
    providers,
    onPressProvider,
    pendingProvider,
    email,
    onEmailChange,
    emailError,
    password,
    onPasswordChange,
    passwordError,
    isRemembered,
    onRememberedChange,
    onSubmit,
    isSubmitting = false,
    onPressForgotPassword,
    onPressSignUp,
    showAnatomy = false,
    anatPart,
}: SignInCredentialsProps) => {
    // The provider column and the rule below it stand or fall together: the rule
    // exists to close off the buttons, so with no buttons there is nothing to
    // close.
    const hasProviders = providers.length > 0

    return (
        // The block names ITSELF on a wrapper and lets the card keep its own name:
        // a frame wearing the name of the thing inside it drops that frame out of
        // the tree and mislabels what is left (rules/1 §4).
        <div data-anat-part={anatPart}>
            <SurfaceCard anatPart={showAnatomy ? "SurfaceCard" : undefined}>
                <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                    <TitledText
                        size="header"
                        title={PANEL_TEXT.title}
                        subtitle={PANEL_TEXT.subtitle}
                        anatPart={showAnatomy ? "TitledText" : undefined}
                    />
                    {hasProviders ? (
                        <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                            <SignInProviders
                                providers={providers}
                                onPressProvider={onPressProvider}
                                pendingProvider={pendingProvider}
                                anatPart={showAnatomy ? "SignInProviders" : undefined}
                            />
                            <Divider
                                label={PANEL_TEXT.orRule}
                                anatPart={showAnatomy ? "Divider" : undefined}
                            />
                        </StackV>
                    ) : null}
                    {/*
                        `Form` takes no `anatPart` of its own, so the badge goes on a
                        wrapper rather than by passing `showAnatomy` down. Passing the
                        flag would open the composite's insides and leak its children
                        out as siblings of this block's own parts (§11a.1).
                    */}
                    <div data-anat-part={showAnatomy ? "Form" : undefined}>
                        <Form
                            // Both roads into submit close together. `isDisabled` locks
                            // the native fieldset, which takes every control including
                            // the button, and unhooking the handler stops the ENTER road
                            // that a fast typist takes.
                            onSubmit={isSubmitting ? undefined : onSubmit}
                            isDisabled={isSubmitting}
                            body={
                                <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                                    {/* The field atoms take no `anatPart`, so their badge rides
                                        on a wrapper the same way `Form`'s does. */}
                                    <div data-anat-part={showAnatomy ? "InputText" : undefined}>
                                        <InputText
                                            label={PANEL_TEXT.emailLabel}
                                            placeholder={PANEL_TEXT.emailPlaceholder}
                                            value={email}
                                            onValueChange={onEmailChange}
                                            errorMessage={emailError != null ? EMAIL_ERROR_TEXT[emailError] : undefined}
                                        />
                                    </div>
                                    <div data-anat-part={showAnatomy ? "InputPassword" : undefined}>
                                        <InputPassword
                                            label={PANEL_TEXT.passwordLabel}
                                            placeholder={PANEL_TEXT.passwordPlaceholder}
                                            value={password}
                                            onValueChange={onPasswordChange}
                                            errorMessage={passwordError != null ? PASSWORD_ERROR_TEXT[passwordError] : undefined}
                                        />
                                    </div>
                                    <Split
                                        gap="related"
                                        anatPart={showAnatomy ? "Split" : undefined}
                                        start={
                                            <div data-anat-part={showAnatomy ? "ChoiceCheckbox" : undefined}>
                                                {/* The label goes in as a PLAIN STRING: the HeroUI
                                                    content slot owns its own text scale, and wrapping
                                                    it in a text atom is what makes that slot throw. */}
                                                <ChoiceCheckbox
                                                    isSelected={isRemembered}
                                                    onValueChange={onRememberedChange}
                                                    label={PANEL_TEXT.remember}
                                                />
                                            </div>
                                        }
                                        end={onPressForgotPassword != null ? (
                                            <Typography
                                                size="xs"
                                                isLink
                                                onPress={onPressForgotPassword}
                                                text={PANEL_TEXT.forgotPassword}
                                                anatPart={showAnatomy ? "Typography" : undefined}
                                            />
                                        ) : null}
                                    />
                                </StackV>
                            }
                            actions={
                                // `w-full` is placement, not restyling, which is the one use
                                // of `className` this tier allows (rules/3 §5). The submit is
                                // the only strong target in a narrow column, so a
                                // shrink-to-fit pill would leave a ragged edge against the
                                // full-width fields above it.
                                <Button
                                    label={PANEL_TEXT.submit}
                                    className="w-full"
                                    isPending={isSubmitting}
                                    onPress={onSubmit}
                                    anatPart={showAnatomy ? "Button" : undefined}
                                />
                            }
                        />
                    </div>
                    {/* Both lines are constants of the panel, so they read as one sentence
                        broken across a prompt and the way out of it. */}
                    <StackH gap="related" justify="center" anatPart={showAnatomy ? "StackH" : undefined}>
                        <Typography
                            size="xs"
                            color="muted"
                            text={PANEL_TEXT.signUpPrompt}
                            anatPart={showAnatomy ? "Typography" : undefined}
                        />
                        <Typography
                            size="xs"
                            isLink
                            onPress={onPressSignUp}
                            text={PANEL_TEXT.signUpAction}
                            anatPart={showAnatomy ? "Typography" : undefined}
                        />
                    </StackH>
                </StackV>
            </SurfaceCard>
        </div>
    )
}

export { SignInCredentials }
