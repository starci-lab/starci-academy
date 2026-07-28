import type { Meta, StoryObj } from "@storybook/nextjs"
import { LoginScreen } from "@sb-components/starci/screens/LoginScreen/LoginScreen"
import type { SignInProvider } from "@sb-components/starci/blocks/auth/SocialSignInOptions/SocialSignInOptions"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * SCREEN — `LoginScreen`: get an existing learner back into the app.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else. It calls blocks, places
 * them in frames, and hands each one typed data — every `div` here would be a
 * shape it had no right to decide.
 *
 * THREE FUNCTIONS, and two of them are the same door at two moments: say where
 * the visitor is and why they were sent here, sign in with an email and a
 * password, confirm the code that was mailed out.
 *
 * ⭐ LEAVES BY STRUCTURE. `step` is the only prop that changes what the SCREEN
 * itself draws: it swaps the whole panel under the intro, so `Credentials` and
 * `Otp` are two leaves. Everything else the caller can vary — the bounce
 * sentence, an empty provider list, a rejected code — changes what a BLOCK draws
 * while the screen keeps its three nodes, so those are STATES inside a leaf
 * (rules/2 §0). `isSkeleton` is a leaf at every tier (§12c).
 *
 * ⚠️ THE TREE IS ONE LEVEL DEEP ON PURPOSE. `showAnatomy` gates only the frame
 * this screen owns; the blocks receive their own name and nothing else. Passing
 * the flag down would leak each block's card, fields and buttons out as siblings
 * of the blocks themselves (§11a.1) — each block documents its own insides in
 * its own story.
 */
const meta: Meta<typeof LoginScreen> = {
    title: "StarCi/Screens/LoginScreen/LoginScreen",
    component: LoginScreen,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LoginScreen>

const PROVIDERS: Array<SignInProvider> = ["google", "github"]

const BASE = {
    onBrandPress: () => {},
    email: "minh.anh@gmail.com",
    onEmailChange: () => {},
    password: "",
    onPasswordChange: () => {},
    isRemembered: true,
    onRememberedChange: () => {},
    providers: PROVIDERS,
    onProviderPress: () => {},
    onSignIn: () => {},
    onForgotPassword: () => {},
    onSwitchToSignUp: () => {},
    otpCode: "",
    onOtpCodeChange: () => {},
    onConfirmOtp: () => {},
    onResendOtp: () => {},
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical track the screen owns, holding the page chrome above the sign-in panel and carrying the one seam between them so neither block sets a margin of its own", storyId: "frames-stack-stackv--default" },
    "AuthPageIntro": { tier: "block", role: "say where the visitor is: the brand line back to the marketing home, plus the sentence that only exists when the edge guard bounced them here", storyId: "starci-blocks-auth-authpageintro-authpageintro--default" },
    "PasswordSignInForm": { tier: "block", role: "sign in with an email and a password, on the card face that also carries the provider shortcuts, the remember row and the way over to signing up", storyId: "starci-blocks-auth-passwordsigninform-passwordsigninform--default" },
    "OtpConfirmForm": { tier: "block", role: "confirm the six-digit code that was mailed out, with the mailbox named back to the reader and a way to ask for a fresh code", storyId: "starci-blocks-auth-otpconfirmform-otpconfirmform--default" },
}

/** LEAF — step one: the credentials panel under the page chrome. */
export const Credentials: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="LoginScreen"
                tier="screen"
                leaf="Credentials"
                parts={[]}
                annotate={ANNOTATE}
                reason="The screen draws three nodes in this leaf and keeps all three across every state below: the track, the page chrome, and the credentials panel. Anything that appears or disappears here does so INSIDE a block, which is why none of these states is a leaf of its own."
                states={[
                    {
                        name: "step = \"credentials\", providers = [\"google\", \"github\"]",
                        why: "The visitor gets the brand line, then one card carrying both ways in: two provider buttons above the rule, the email and password fields below it. This is the shape almost everyone meets, so it is the one the screen is measured against.",
                        code: `<LoginScreen
    step="credentials"
    email={email}
    onEmailChange={setEmail}
    password={password}
    onPasswordChange={setPassword}
    isRemembered={isRemembered}
    onRememberedChange={setRemembered}
    providers={["google", "github"]}
    onProviderPress={signInWith}
    onSignIn={submit}
    onSwitchToSignUp={goToSignUp}
    …
/>`,
                        render: <LoginScreen {...BASE} showAnatomy step="credentials" />,
                    },
                    {
                        name: "isResumingProtectedRoute = true",
                        why: "A second line grows under the brand explaining that the visitor was asked to sign in before continuing, and the panel below it is untouched. The guard sent them here rather than them choosing to come, so the page says so instead of leaving them to work out why their link turned into a form.",
                        code: "<LoginScreen step=\"credentials\" isResumingProtectedRoute … />",
                        render: <LoginScreen {...BASE} step="credentials" isResumingProtectedRoute />,
                    },
                    {
                        name: "providers = []",
                        why: "The provider buttons and the rule under them are both gone, so the card opens straight onto the email field. A deployment with no identity provider configured has nothing to offer there, and a rule with nothing above it reads as a heading that lost its words.",
                        code: "<LoginScreen step=\"credentials\" providers={[]} … />",
                        render: <LoginScreen {...BASE} step="credentials" providers={[]} />,
                    },
                    {
                        name: "emailError = \"notExists\", onForgotPassword = undefined",
                        why: "The email field takes its error border with the reason under it, and the recovery link drops out of the remember row. The address is rejected because no account uses it, which is a different failure from a malformed address and is worded as such, while a screen with no recovery route wired up must not show a way to one.",
                        code: `<LoginScreen
    step="credentials"
    emailError="notExists"
    onForgotPassword={undefined}
    …
/>`,
                        render: <LoginScreen {...BASE} step="credentials" emailError="notExists" onForgotPassword={undefined} />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — step two: the credentials panel is replaced outright by the code panel. */
export const Otp: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="LoginScreen"
                tier="screen"
                leaf="Otp"
                parts={[]}
                annotate={ANNOTATE}
                reason="The panel node is a different block in this leaf while the track and the page chrome stay exactly as they were. The visitor has not navigated anywhere, so the brand line above them must not be redrawn as if they had."
                states={[
                    {
                        name: "step = \"otp\", otpCode = \"\"",
                        why: "The credentials card is gone and the code panel stands in its place, naming the mailbox the code went to and offering a way to ask for another. The address is the one that was typed a moment ago rather than a second prop, so the sentence cannot claim a mailbox the code never reached.",
                        code: `<LoginScreen
    step="otp"
    email={email}
    otpCode={otpCode}
    onOtpCodeChange={setOtpCode}
    onConfirmOtp={confirm}
    onResendOtp={resend}
    …
/>`,
                        render: <LoginScreen {...BASE} showAnatomy step="otp" />,
                    },
                    {
                        name: "otpCode = \"4821\", otpError = \"invalid\"",
                        why: "The cells keep the four digits already typed and take the error border, with the reason sitting under them. A code is rejected as a whole rather than cell by cell, so the reader is told what is wrong without their work being thrown away.",
                        code: "<LoginScreen step=\"otp\" otpCode=\"4821\" otpError=\"invalid\" … />",
                        render: <LoginScreen {...BASE} step="otp" otpCode="4821" otpError="invalid" />,
                    },
                    {
                        name: "isResendingOtp = true",
                        why: "The resend action keeps its slot on the same line and swaps to a muted in-flight line with no handler. A control that vanishes or moves while a request is out invites a second press, and a second press here means a second code and two valid mails to choose between.",
                        code: "<LoginScreen step=\"otp\" otpCode=\"482170\" isResendingOtp … />",
                        render: <LoginScreen {...BASE} step="otp" otpCode="482170" isResendingOtp />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the intro and the panel each mirror themselves. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="LoginScreen"
                tier="screen"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                reason="This leaf renders the credentials step only, and the omission is deliberate rather than an oversight. The step lives in client state, so a visitor who reloads is back at step one and the code panel is never the thing being waited on — a resting OTP panel would be a case no screen can reach (§14d.3)."
                states={[
                    {
                        name: "isSkeleton = true, step = \"credentials\"",
                        why: "The brand line becomes a wordmark-width bar and every control in the panel swaps to its own mirror, while the rule, the sign-up prompt and the field labels stay real text. The flag reaches the real blocks rather than a parallel skeleton tree, so the page keeps its height and nothing jumps when the session check lands.",
                        code: "<LoginScreen {...props} step=\"credentials\" isSkeleton />",
                        render: <LoginScreen {...BASE} showAnatomy step="credentials" isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
