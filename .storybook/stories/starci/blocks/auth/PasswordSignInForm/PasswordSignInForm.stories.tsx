import type { Meta, StoryObj } from "@storybook/nextjs"
import { PasswordSignInForm } from "@sb-components/starci/blocks/auth/PasswordSignInForm/PasswordSignInForm"
import type { SignInProvider } from "@sb-components/starci/blocks/auth/SocialSignInOptions/SocialSignInOptions"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `PasswordSignInForm`: sign in with an email and a password, and the
 * owner of the card face that whole function sits on. The screen calls this one
 * block instead of holding a card composite plus a dozen loose form atoms.
 *
 * IT NESTS ANOTHER BLOCK. `SocialSignInOptions` renders inside the card, which
 * is legal since block-imports-block opened on 2026-07-28. The wrapper earns its
 * layer: it decides whether the provider column exists, it decides that losing
 * the column also loses the HOẶC rule, it closes both roads into submit when the
 * captcha is unsolved, and it words every error sentence on the panel.
 *
 * 📐 LEAF by STRUCTURE (rules/2 §0). Every error case, the in-flight state and
 * the blocked state leave the node tree untouched, so all six sit as STATES in
 * `Default`. Losing the providers removes two nodes, offering recovery grows
 * one, and `isSkeleton` is a leaf at every tier — those three are the leaves.
 *
 * ⛔ There is deliberately NO "no sign-up route" leaf. A sign-in panel always has
 * a way to register, so `onSwitchToSignUp` is required and a version without it
 * is a case no screen asks for (§14d.3).
 */
const meta: Meta<typeof PasswordSignInForm> = {
    title: "StarCi/Blocks/Auth/PasswordSignInForm/PasswordSignInForm",
    component: PasswordSignInForm,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PasswordSignInForm>

const PROVIDERS: Array<SignInProvider> = ["google", "github"]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the card face of the whole panel, which this block owns because a screen may not reach a composite to draw one itself", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "StackV": { tier: "frame", role: "one of the vertical tracks of the panel, either the outer one separating the provider column from the form and the sign-up prompt, the inner one holding the buttons above their closing rule, or the field column inside the form", storyId: "frames-stack-stackv--default" },
    "SocialSignInOptions": { tier: "block", role: "the provider column, a sibling block this one nests and hands the typed provider list to", storyId: "starci-blocks-auth-socialsigninoptions-socialsigninoptions--default" },
    "Divider": { tier: "atom", role: "the labelled rule closing off the provider column, carrying the word this block chose for the choice between the two roads in", storyId: "atoms-display-divider-divider--with-label" },
    "Form": { tier: "composite", role: "the real form element, giving every field an ENTER key that submits and locking the whole fieldset while the credentials are in flight", storyId: "composites-form-form-form--default" },
    "InputText": { tier: "atom", role: "the email field, carrying its own label and the error sentence this block worded from the failure enum", storyId: "atoms-forms-input-inputtext--with-label" },
    "InputPassword": { tier: "atom", role: "the password field, which owns the reveal control and the error line the same way the email field does", storyId: "atoms-forms-input-inputpassword--with-label" },
    "Split": { tier: "frame", role: "the remember row, where the checkbox is the side that gives way and the recovery link is the side that is never squeezed", storyId: "frames-split-split--default" },
    "ChoiceCheckbox": { tier: "atom", role: "the remember-me control, taking its label as plain text because the content slot owns its own type scale", storyId: "atoms-forms-choice-choicecheckbox--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines, either the recovery link, the sign-up question, or the word that opens the sign-up route", storyId: "atoms-text-typography-typography--plain" },
    "Button": { tier: "atom", role: "the submit control, drawing its own spinner while the attempt is in flight and refusing the press while the captcha is unsolved", storyId: "atoms-buttons-button-button--default" },
    "StackH": { tier: "frame", role: "the horizontal track centring the sign-up question beside the link that answers it, so the two read as one sentence", storyId: "frames-stack-stackh--default" },
}

/** LEAF — the minimal valid call: providers, two fields, remember row, submit, sign-up prompt. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="PasswordSignInForm"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="Every state below leaves the node tree exactly as it is. An error grows a sentence inside a field the field already reserved room for, and neither the in-flight nor the blocked state adds or removes anything, which is why all six live in one leaf."
                states={[
                    {
                        name: "email = \"\", password = \"\"",
                        why: "Both fields are empty and no error line is drawn under either of them, so the panel is at its shortest. This is what a visitor sees before touching anything, and a form that warns before it has been used teaches people to ignore its warnings.",
                        code: `<PasswordSignInForm
    email=""
    onEmailChange={setEmail}
    password=""
    onPasswordChange={setPassword}
    isRemembered={false}
    onRememberedChange={setRemembered}
    providers={["google", "github"]}
    onProviderPress={startOauth}
    onSubmit={submit}
    onSwitchToSignUp={goToSignUp}
/>`,
                        render: (
                            <PasswordSignInForm
                                anatPart="PasswordSignInForm"
                                showAnatomy
                                email=""
                                onEmailChange={() => {}}
                                password=""
                                onPasswordChange={() => {}}
                                isRemembered={false}
                                onRememberedChange={() => {}}
                                providers={PROVIDERS}
                                onProviderPress={() => {}}
                                onSubmit={() => {}}
                                onSwitchToSignUp={() => {}}
                            />
                        ),
                    },
                    {
                        name: "emailError = \"invalid\"",
                        why: "A danger line appears under the email field and its border turns, while every other node stays where it was. The address is malformed rather than unknown, so the sentence asks the visitor to fix what they typed instead of suggesting they have no account.",
                        code: `<PasswordSignInForm
    email="huy@"
    emailError="invalid"
    …
/>`,
                        render: (
                            <PasswordSignInForm
                                email="huy@"
                                onEmailChange={() => {}}
                                emailError="invalid"
                                password="matkhau123"
                                onPasswordChange={() => {}}
                                isRemembered={false}
                                onRememberedChange={() => {}}
                                providers={PROVIDERS}
                                onProviderPress={() => {}}
                                onSubmit={() => {}}
                                onSwitchToSignUp={() => {}}
                            />
                        ),
                    },
                    {
                        name: "emailError = \"notExists\"",
                        why: "The same node carries a different sentence: the address is well formed but no account uses it. Telling the visitor to correct their typing here would send them round in circles, because the thing to fix is not the address but the fact that they have not registered yet.",
                        code: `<PasswordSignInForm
    email="huy@starci.io"
    emailError="notExists"
    …
/>`,
                        render: (
                            <PasswordSignInForm
                                email="huy@starci.io"
                                onEmailChange={() => {}}
                                emailError="notExists"
                                password="matkhau123"
                                onPasswordChange={() => {}}
                                isRemembered={false}
                                onRememberedChange={() => {}}
                                providers={PROVIDERS}
                                onProviderPress={() => {}}
                                onSubmit={() => {}}
                                onSwitchToSignUp={() => {}}
                            />
                        ),
                    },
                    {
                        name: "passwordError = \"tooShort\"",
                        why: "The error line moves down to the password field and the email field is clean. The sentence names the exact length the rule wants, because a password rejected without a number to aim at is a password the visitor will get wrong twice.",
                        code: `<PasswordSignInForm
    password="abc"
    passwordError="tooShort"
    …
/>`,
                        render: (
                            <PasswordSignInForm
                                email="huy@starci.io"
                                onEmailChange={() => {}}
                                password="abc"
                                onPasswordChange={() => {}}
                                passwordError="tooShort"
                                isRemembered={false}
                                onRememberedChange={() => {}}
                                providers={PROVIDERS}
                                onProviderPress={() => {}}
                                onSubmit={() => {}}
                                onSwitchToSignUp={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSubmitting = true",
                        why: "A spinner takes the leading slot of the submit button and the whole fieldset greys out, fields and providers included. The credentials are already on the wire, so a second press would start a second attempt against an answer that is on its way back.",
                        code: `<PasswordSignInForm
    isSubmitting
    …
/>`,
                        render: (
                            <PasswordSignInForm
                                email="huy@starci.io"
                                onEmailChange={() => {}}
                                password="matkhau123"
                                onPasswordChange={() => {}}
                                isRemembered
                                onRememberedChange={() => {}}
                                providers={PROVIDERS}
                                onProviderPress={() => {}}
                                onSubmit={() => {}}
                                isSubmitting
                                onSwitchToSignUp={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSubmitBlocked = true",
                        why: "The submit button is refused while the two fields stay live and editable. The captcha is enabled and not yet solved, and locking the form over a robot check the visitor has not failed would stop them finishing a sentence they were in the middle of typing.",
                        code: `<PasswordSignInForm
    isSubmitBlocked={captchaEnabled && !captchaToken}
    …
/>`,
                        render: (
                            <PasswordSignInForm
                                email="huy@starci.io"
                                onEmailChange={() => {}}
                                password="matkhau123"
                                onPasswordChange={() => {}}
                                isRemembered={false}
                                onRememberedChange={() => {}}
                                providers={PROVIDERS}
                                onProviderPress={() => {}}
                                onSubmit={() => {}}
                                isSubmitBlocked
                                onSwitchToSignUp={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — no providers configured, so the nested block and the labelled rule both disappear. */
export const NoProviders: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="PasswordSignInForm"
                tier="block"
                leaf="No providers"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="The rule leaves WITH the column it closes. A HOẶC line with nothing above it separates the fields from the top of the card and reads as a heading that lost its words, so the two nodes are tied together rather than dropped one at a time."
                states={[
                    {
                        name: "providers = []",
                        why: "The nested SocialSignInOptions node and the labelled Divider are both gone, so the card opens straight on the email field. A deployment with no identity provider configured has only one road in, and drawing a choice between one thing is a choice the visitor cannot make.",
                        code: `<PasswordSignInForm
    providers={[]}
    onProviderPress={startOauth}
    …
/>`,
                        render: (
                            <PasswordSignInForm
                                anatPart="PasswordSignInForm"
                                showAnatomy
                                email=""
                                onEmailChange={() => {}}
                                password=""
                                onPasswordChange={() => {}}
                                isRemembered={false}
                                onRememberedChange={() => {}}
                                providers={[]}
                                onProviderPress={() => {}}
                                onSubmit={() => {}}
                                onSwitchToSignUp={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a recovery handler is supplied, so the trailing side of the remember row grows a link. */
export const ForgotPasswordOffered: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="PasswordSignInForm"
                tier="block"
                leaf="Forgot password offered"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="A function prop that makes a node GROW is a leaf, not a state, because the caller is the one flipping it (rules/2 §1). The link rides the trailing side of the Split so it can never be squeezed by a longer remember-me label."
                states={[
                    {
                        name: "onForgotPassword supplied",
                        why: "The recovery link appears on the trailing side of the remember row, opposite the checkbox. Only a screen that has a recovery route wired up passes the handler, so a panel without one shows no way to a page that would answer with an error.",
                        code: `<PasswordSignInForm
    onForgotPassword={startRecovery}
    …
/>`,
                        render: (
                            <PasswordSignInForm
                                anatPart="PasswordSignInForm"
                                showAnatomy
                                email="huy@starci.io"
                                onEmailChange={() => {}}
                                password="matkhau123"
                                onPasswordChange={() => {}}
                                isRemembered
                                onRememberedChange={() => {}}
                                providers={PROVIDERS}
                                onProviderPress={() => {}}
                                onSubmit={() => {}}
                                onForgotPassword={() => {}}
                                onSwitchToSignUp={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`, so every control swaps to its own mirror. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="PasswordSignInForm"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="The HOẶC rule and the sign-up prompt stay as REAL text at rest. They are constants of the panel rather than anything being fetched, so shimmering them would fake a wait that is not happening."
                states={[
                    {
                        name: "isSkeleton = true, providers = [\"google\", \"github\"]",
                        why: "Each field draws a label bar over a field-box mirror, the remember row draws a square beside a label bar, and the submit draws a pill, all from the atoms themselves. The flag reaches those real atoms instead of a parallel skeleton tree, which is why the card does not resize when the session check returns.",
                        code: `<PasswordSignInForm
    isSkeleton
    email=""
    password=""
    providers={["google", "github"]}
    …
/>`,
                        render: (
                            <PasswordSignInForm
                                anatPart="PasswordSignInForm"
                                showAnatomy
                                email=""
                                onEmailChange={() => {}}
                                password=""
                                onPasswordChange={() => {}}
                                isRemembered={false}
                                onRememberedChange={() => {}}
                                providers={PROVIDERS}
                                onProviderPress={() => {}}
                                onSubmit={() => {}}
                                onSwitchToSignUp={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
