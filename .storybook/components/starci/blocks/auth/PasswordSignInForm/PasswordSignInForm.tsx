import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import { ChoiceCheckbox } from "@sb-components/atoms/forms/Choice/Choice"
import { InputPassword, InputText } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Form } from "@sb-components/composites/form/Form/Form"
import { Split } from "@sb-components/frames/Split/Split"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { SocialSignInOptions, type SignInProvider } from "@sb-components/starci/blocks/auth/SocialSignInOptions/SocialSignInOptions"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `PasswordSignInForm`: sign in with an email and a password. One
 * function of the login screen, and the OWNER OF THE CARD FACE that function
 * lives on.
 *
 * WHY THIS BLOCK OWNS THE CARD. In `src` the provider buttons, the rule that
 * says HOẶC, the two fields, the remember row, the submit and the sign-up
 * prompt all sit inside ONE `Card > CardContent`. A screen may import blocks and
 * frames only, so it cannot reach `SurfaceCard` (composite) to draw that face
 * itself. Either the face belongs to the block that IS the panel, or the panel
 * gets torn into pieces that each know half of it. It belongs here.
 *
 * WHY IT NESTS ANOTHER BLOCK. `SocialSignInOptions` renders inside this card,
 * which is legal since block-imports-block opened on 2026-07-28. The rule that
 * replaced the old ban is that a wrapper must EARN its layer, and this one earns
 * it many times over: it decides whether the provider column exists at all, it
 * decides that losing the column also loses the rule below it, it closes both
 * roads into submit when the captcha is unsolved, and it words every error
 * sentence on the panel.
 *
 * WHAT IT DOES NOT OWN — the panel TITLE. `src` puts "Đăng nhập" and its
 * subtitle in `Modal.Header`, ABOVE the card body, and the sibling block
 * `SignInHeader` already carries that region. So this block draws no `label` and
 * no `description` on `SurfaceCard`: a heading it was never handed is a heading
 * it would be inventing, and §14d.1 bans a `heading` prop for the mirror image
 * of the same reason. The consequence is that `SurfaceCard`'s own `isSkeleton`
 * has nothing to drive here — every resting shape in this panel comes from the
 * atoms below it.
 *
 * ERRORS ARRIVE AS ENUMS, NEVER AS SENTENCES (§14d.1). `emailError` is
 * `required · invalid · notExists` and `passwordError` is `required · tooShort`,
 * because the i18n keys under `auth.signIn.*` enumerate exactly that closed set.
 * A caller that could pass the sentence would own the wording, and this block
 * would be a layout with opinions about nothing. Two of the three email cases
 * even read as the same failure to a caller — "we could not use this email" —
 * and it is precisely the block's job to tell the reader whether the address is
 * malformed or simply unknown to us.
 *
 * SEAMS. Inside the card the regions run `section`: the provider column, the
 * form, and the sign-up prompt are REGIONS of one panel, each with its own
 * purpose. Inside the provider column the seam is `grouped`, because the HOẶC
 * rule is not a peer of the buttons above it, it is the line that closes them
 * off. Inside the form the field column is `grouped` while `Form`'s own default
 * `section` keeps the fields away from the submit — one prop each, so the seam
 * around the button cannot drift when a field is added.
 *
 * WHY THE REMEMBER ROW IS A `Split` AND NOT A `StackH`. The two sides are named
 * and behave differently: the checkbox is the reading anchor and may give way,
 * the recovery link must never be squeezed. That is the contract `Split` exists
 * to state once instead of at every call site.
 *
 * SUBMIT HAS TWO ROADS AND BOTH ARE GUARDED. Pressing the button calls
 * `onSubmit`; pressing ENTER inside a field submits the native `<form>` that
 * `Form` renders, which calls it too. `isSubmitBlocked` (the captcha is enabled
 * and unsolved) therefore disables the button AND unhooks the form handler —
 * guarding only the button would leave the keyboard road wide open, and the
 * keyboard road is the one a fast typist takes.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * What went wrong with the email, as a closed set. Mirrors the keys under
 * `auth.signIn.email.*`, so a new case starts as a new key rather than as a
 * string smuggled through the caller.
 */
export type SignInEmailError = "required" | "invalid" | "notExists"

/** What went wrong with the password. Mirrors the keys under `auth.signIn.password.*`. */
export type SignInPasswordError = "required" | "tooShort"

/**
 * Email failure to the sentence the reader gets. A TABLE, not a chain of `if`s,
 * so adding a member to the union makes the compiler point at the missing line
 * instead of letting an unworded case fall through silently.
 */
const EMAIL_ERROR_TEXT: Record<SignInEmailError, string> = {
    required: "Vui lòng nhập email",
    invalid: "Vui lòng nhập địa chỉ email hợp lệ",
    notExists: "Chưa có tài khoản nào dùng email này",
}

/** Password failure to the sentence the reader gets. Same table rule as {@link EMAIL_ERROR_TEXT}. */
const PASSWORD_ERROR_TEXT: Record<SignInPasswordError, string> = {
    required: "Vui lòng nhập mật khẩu",
    tooShort: "Mật khẩu phải có ít nhất 8 ký tự",
}

/** Props for {@link PasswordSignInForm}. */
export interface PasswordSignInFormProps {
    /** Current email value (controlled). */
    email: string
    /** Fires with the new email on every keystroke. */
    onEmailChange: (value: string) => void
    /** Which email rule failed. Omit while the field is still valid or untouched. */
    emailError?: SignInEmailError
    /** Current password value (controlled). */
    password: string
    /** Fires with the new password on every keystroke. */
    onPasswordChange: (value: string) => void
    /** Which password rule failed. Omit while the field is still valid or untouched. */
    passwordError?: SignInPasswordError
    /** `true` → keep the session alive past this browser run. */
    isRemembered: boolean
    /** Fires with the new remember state. */
    onRememberedChange: (value: boolean) => void
    /**
     * Identity providers to offer above the fields, in display order. An EMPTY
     * array drops the provider column AND the HOẶC rule below it: a rule with
     * nothing above it separates the fields from the top of the card, which
     * reads as a heading that lost its words.
     */
    providers: Array<SignInProvider>
    /** Fires with the provider the visitor picked. */
    onProviderPress: (provider: SignInProvider) => void
    /** Send the credentials. Reached from the button AND from ENTER inside a field. */
    onSubmit: () => void
    /**
     * `true` while the credentials are in flight: a spinner takes the button's
     * leading slot and the whole fieldset locks, so a second press cannot start
     * a second attempt.
     */
    isSubmitting?: boolean
    /**
     * `true` when the captcha is enabled and not yet solved
     * (`publicEnv().captcha.enabled && !captchaToken`). The submit is refused
     * but the FIELDS STAY LIVE — the visitor should be able to finish typing
     * while the challenge loads, and locking the form for a robot check they
     * have not failed reads as a punishment.
     */
    isSubmitBlocked?: boolean
    /**
     * Start account recovery. OPTIONAL, and its presence is what draws the link:
     * a screen with no recovery route wired up must not show a way to it.
     */
    onForgotPassword?: () => void
    /** Move the visitor to the sign-up side. */
    onSwitchToSignUp: () => void
    /**
     * `true` → every atom the panel composes swaps to its own mirror. The flag
     * FLOWS DOWN into those atoms rather than building a parallel skeleton tree
     * (§12c), so each mirror keeps the exact box it will hand back.
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The email-and-password sign-in panel. See the file header for why this block
 * owns the card face, why it nests another block, and why the submit is guarded
 * on two roads.
 *
 * @param props - {@link PasswordSignInFormProps}
 */
const PasswordSignInForm = ({
    email,
    onEmailChange,
    emailError,
    password,
    onPasswordChange,
    passwordError,
    isRemembered,
    onRememberedChange,
    providers,
    onProviderPress,
    onSubmit,
    isSubmitting = false,
    isSubmitBlocked = false,
    onForgotPassword,
    onSwitchToSignUp,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: PasswordSignInFormProps) => {
    const hasProviders = providers.length > 0
    // The ENTER road, closed by the same fact that greys the button. A resting
    // panel is not submittable either: there is nothing typed in it yet.
    const canSubmit = !isSubmitBlocked && !isSkeleton

    // Each control is written as a BRANCH rather than as one call with the flag
    // threaded in, because the form atoms declare `value`/`onValueChange` as
    // REQUIRED unless `isSkeleton` is literally `true`. That union is the atom
    // refusing to hold a value it is not rendering, so the branch is the atom's
    // contract showing through, not a workaround.
    const emailField = isSkeleton ? (
        <InputText isSkeleton label="Email" />
    ) : (
        <InputText
            label="Email"
            placeholder="Nhập email của bạn"
            value={email}
            onValueChange={onEmailChange}
            errorMessage={emailError != null ? EMAIL_ERROR_TEXT[emailError] : undefined}
        />
    )

    const passwordField = isSkeleton ? (
        <InputPassword isSkeleton label="Mật khẩu" />
    ) : (
        <InputPassword
            label="Mật khẩu"
            placeholder="Nhập mật khẩu của bạn"
            value={password}
            onValueChange={onPasswordChange}
            errorMessage={passwordError != null ? PASSWORD_ERROR_TEXT[passwordError] : undefined}
        />
    )

    const forgotPasswordLink = isSkeleton ? (
        <Typography size="xs" isSkeleton anatPart={showAnatomy ? "Typography" : undefined} />
    ) : (
        <Typography
            size="xs"
            isLink
            onPress={onForgotPassword}
            text="Quên mật khẩu?"
            anatPart={showAnatomy ? "Typography" : undefined}
        />
    )

    const submitButton = isSkeleton ? (
        <Button isSkeleton className="w-full" anatPart={showAnatomy ? "Button" : undefined} />
    ) : (
        <Button
            label="Đăng nhập"
            className="w-full"
            isPending={isSubmitting}
            isDisabled={isSubmitBlocked}
            onPress={onSubmit}
            anatPart={showAnatomy ? "Button" : undefined}
        />
    )

    return (
        <div data-anat-part={anatPart}>
            <SurfaceCard anatPart={showAnatomy ? "SurfaceCard" : undefined}>
                <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                    {hasProviders ? (
                        <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                            <SocialSignInOptions
                                providers={providers}
                                onProviderPress={onProviderPress}
                                isSkeleton={isSkeleton}
                                anatPart={showAnatomy ? "SocialSignInOptions" : undefined}
                            />
                            {/* The rule is drawn even at rest. It is a constant of the panel,
                                not something being fetched, so shimmering it would fake a wait
                                that is not happening. */}
                            <Divider label="HOẶC" anatPart={showAnatomy ? "Divider" : undefined} />
                        </StackV>
                    ) : null}
                    {/* `Form` carries no `anatPart` of its own, so the badge goes on a wrapper
                        here rather than by passing `showAnatomy` down — that would open the
                        composite's insides and leak its children out as siblings (§11a.1). */}
                    <div data-anat-part={showAnatomy ? "Form" : undefined}>
                        <Form
                            onSubmit={canSubmit ? onSubmit : undefined}
                            isDisabled={isSubmitting}
                            body={
                                <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                                    <div data-anat-part={showAnatomy ? "InputText" : undefined}>
                                        {emailField}
                                    </div>
                                    <div data-anat-part={showAnatomy ? "InputPassword" : undefined}>
                                        {passwordField}
                                    </div>
                                    <Split
                                        gap="related"
                                        anatPart={showAnatomy ? "Split" : undefined}
                                        start={
                                            <div data-anat-part={showAnatomy ? "ChoiceCheckbox" : undefined}>
                                                {/* The label goes in as a PLAIN STRING. The HeroUI
                                                    content slot owns its own text scale, and wrapping
                                                    it in a text atom is what makes that slot throw. */}
                                                <ChoiceCheckbox
                                                    isSelected={isRemembered}
                                                    onValueChange={onRememberedChange}
                                                    label="Ghi nhớ đăng nhập"
                                                    isSkeleton={isSkeleton}
                                                />
                                            </div>
                                        }
                                        end={onForgotPassword != null ? forgotPasswordLink : null}
                                    />
                                </StackV>
                            }
                            actions={submitButton}
                        />
                    </div>
                    {/* Both lines are constants of the panel, so they stay real text at rest
                        for the same reason the HOẶC rule does. */}
                    <StackH gap="related" justify="center" anatPart={showAnatomy ? "StackH" : undefined}>
                        <Typography
                            size="xs"
                            color="muted"
                            text="Chưa có tài khoản?"
                            anatPart={showAnatomy ? "Typography" : undefined}
                        />
                        <Typography
                            size="xs"
                            isLink
                            onPress={onSwitchToSignUp}
                            text="Đăng ký"
                            anatPart={showAnatomy ? "Typography" : undefined}
                        />
                    </StackH>
                </StackV>
            </SurfaceCard>
        </div>
    )
}

export { PasswordSignInForm }
