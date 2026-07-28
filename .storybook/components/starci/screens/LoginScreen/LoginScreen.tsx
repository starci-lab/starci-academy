import { AuthPageIntro } from "@sb-components/starci/blocks/auth/AuthPageIntro/AuthPageIntro"
import { OtpConfirmForm, type SignInOtpError } from "@sb-components/starci/blocks/auth/OtpConfirmForm/OtpConfirmForm"
import { PasswordSignInForm, type SignInEmailError, type SignInPasswordError } from "@sb-components/starci/blocks/auth/PasswordSignInForm/PasswordSignInForm"
import type { SignInProvider } from "@sb-components/starci/blocks/auth/SocialSignInOptions/SocialSignInOptions"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `LoginScreen`: get an existing learner back into the app.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else. It calls blocks, places
 * them in frames, and hands each one typed data. It draws no shape of its own:
 * every `div` written here would be a shape it had no right to decide, and every
 * `flex` string would be a seam with no owner (rules/1 §B2).
 *
 * THREE FUNCTIONS, and two of them are the same door at two moments: say where
 * the visitor is and why they were sent here, sign in with an email and a
 * password, confirm the code that was mailed out.
 *
 * THE STEP IS THE SCREEN'S ONE DECISION. `step` swaps the whole panel, because
 * the two steps share nothing but the measure they sit in — one holds two
 * fields, a remember row and a provider column, the other holds a row of code
 * cells and a resend line. Those are two trees, so they are two blocks, and
 * choosing between them is a list-of-functions decision, which is what a screen
 * is for. The intro above them does NOT swap: the visitor is on the same page
 * throughout, and redrawing the brand line mid-flow would read as a navigation
 * that did not happen.
 *
 * THE MAILBOX SENTENCE REUSES `email`. The address the code went to is the
 * address that was typed on the step before, so it is one prop, not two. Two
 * props would let a caller show a code sent to one mailbox while claiming
 * another, which is the class of bug nobody finds by reading.
 *
 * MEASURE `sm`, NOT `md`. A sign-in panel is a single column of controls, and
 * 40rem is about as wide as one can be before the eye stops treating the label
 * and its field as one thing. The seam between the intro and the panel is
 * `section`: they are two REGIONS of one page, not two features that merely
 * share it (rules/3 §1.0).
 *
 * ⭐ `showAnatomy` STOPS HERE, ON PURPOSE. It gates only the frame this screen
 * owns; the blocks are handed their own `anatPart` and nothing else. Passing the
 * flag down would open each block's insides and leak its `SurfaceCard`, its
 * fields and its buttons out as SIBLINGS of the blocks themselves, and a tree
 * that deep stops describing this screen's composition (§11a.1, deps one level).
 * Each block documents its own insides in its own story.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Which half of signing in the visitor is looking at.
 *
 * `credentials` — the email, the password and the provider shortcuts.
 * `otp` — the six-digit code that was mailed after those were accepted.
 */
export type LoginStep = "credentials" | "otp"

/** Props for {@link LoginScreen}. */
export interface LoginScreenProps {
    /** Press on the brand line: back to the marketing home. */
    onBrandPress: () => void
    /**
     * `true` → the edge guard sent this visitor here from a protected route, so
     * the intro explains the bounce. A visitor who typed `/login` themselves
     * needs no explaining.
     */
    isResumingProtectedRoute?: boolean

    /** Which step the visitor is on. It swaps the whole panel under the intro. */
    step: LoginStep

    /**
     * The address being signed in with. ONE prop for both steps: the code goes
     * to the mailbox that was typed here, so the OTP step writes its sentence
     * around this same value.
     */
    email: string
    /** Fires with the new email on every keystroke. */
    onEmailChange: (value: string) => void
    /** Which email rule failed. Omit while the field is valid or untouched. */
    emailError?: SignInEmailError
    /** Current password value. */
    password: string
    /** Fires with the new password on every keystroke. */
    onPasswordChange: (value: string) => void
    /** Which password rule failed. Omit while the field is valid or untouched. */
    passwordError?: SignInPasswordError
    /** `true` → keep the session alive past this browser run. */
    isRemembered: boolean
    /** Fires with the new remember state. */
    onRememberedChange: (value: boolean) => void
    /**
     * Identity providers this deployment has configured, as a SET. An empty
     * array drops the provider column and the rule under it.
     */
    providers: Array<SignInProvider>
    /** Fires with the provider the visitor picked. */
    onProviderPress: (provider: SignInProvider) => void
    /** Send the credentials. Reached from the button and from ENTER in a field. */
    onSignIn: () => void
    /** `true` while the credentials are in flight. */
    isSigningIn?: boolean
    /**
     * `true` when the captcha is enabled and unsolved. The submit is refused
     * while the fields stay live.
     */
    isSignInBlocked?: boolean
    /**
     * Start account recovery. OPTIONAL, and its absence is what removes the
     * link: a deployment with no recovery route must not show a way to one.
     */
    onForgotPassword?: () => void
    /** Move the visitor to the sign-up side. */
    onSwitchToSignUp: () => void

    /** Digits typed into the code cells so far, "" through six characters. */
    otpCode: string
    /** Fires with the whole code on every cell change. */
    onOtpCodeChange: (value: string) => void
    /** Why the typed code was rejected. Omit while it is untouched or valid. */
    otpError?: SignInOtpError
    /** Confirm the code. Reached from the button and from ENTER in the cells. */
    onConfirmOtp: () => void
    /** `true` while the code is being verified. */
    isConfirmingOtp?: boolean
    /** Ask for a fresh code. */
    onResendOtp: () => void
    /** `true` while a fresh code is being sent. */
    isResendingOtp?: boolean

    /**
     * `true` → the session check has not come back yet, so the intro and the
     * panel each draw their own resting mirror. The flag FLOWS DOWN into the
     * real blocks rather than building a parallel skeleton tree (§12c), which is
     * why nothing on the page moves when the check lands.
     */
    isSkeleton?: boolean
    /**
     * Name this screen's own measure in a BlockAnatomy panel. Left unset in
     * normal use: the panel names the root itself, and only a parent that nested
     * this screen would have a reason to badge it.
     */
    anatPart?: string
    /** When on, the frame this screen owns emits `data-anat-part`. */
    showAnatomy?: boolean
}

/**
 * The sign-in page. See the file header for the function list, why the step
 * swaps only the panel, and why `showAnatomy` stops at this tier.
 *
 * @param props - {@link LoginScreenProps}
 */
const LoginScreen = ({
    onBrandPress,
    isResumingProtectedRoute,
    step,
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
    onSignIn,
    isSigningIn,
    isSignInBlocked,
    onForgotPassword,
    onSwitchToSignUp,
    otpCode,
    onOtpCodeChange,
    otpError,
    onConfirmOtp,
    isConfirmingOtp,
    onResendOtp,
    isResendingOtp,
    isSkeleton = false,
    anatPart,
    showAnatomy = false,
}: LoginScreenProps) => (
    <Container size="sm" padding="roomy" anatPart={anatPart}>
        <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
            <AuthPageIntro
                anatPart="AuthPageIntro"
                onBrandPress={onBrandPress}
                isResumingProtectedRoute={isResumingProtectedRoute}
                isSkeleton={isSkeleton}
            />
            {/* The step swaps the PANEL and leaves the intro standing. The visitor has not
                gone anywhere between the two, so the page keeps its own identity while the
                thing being asked of them changes. */}
            {step === "credentials" ? (
                <PasswordSignInForm
                    anatPart="PasswordSignInForm"
                    email={email}
                    onEmailChange={onEmailChange}
                    emailError={emailError}
                    password={password}
                    onPasswordChange={onPasswordChange}
                    passwordError={passwordError}
                    isRemembered={isRemembered}
                    onRememberedChange={onRememberedChange}
                    providers={providers}
                    onProviderPress={onProviderPress}
                    onSubmit={onSignIn}
                    isSubmitting={isSigningIn}
                    isSubmitBlocked={isSignInBlocked}
                    onForgotPassword={onForgotPassword}
                    onSwitchToSignUp={onSwitchToSignUp}
                    isSkeleton={isSkeleton}
                />
            ) : (
                <OtpConfirmForm
                    anatPart="OtpConfirmForm"
                    email={email}
                    code={otpCode}
                    onCodeChange={onOtpCodeChange}
                    codeError={otpError}
                    onSubmit={onConfirmOtp}
                    isSubmitting={isConfirmingOtp}
                    onResend={onResendOtp}
                    isResending={isResendingOtp}
                    isSkeleton={isSkeleton}
                />
            )}
        </StackV>
    </Container>
)

export { LoginScreen }
