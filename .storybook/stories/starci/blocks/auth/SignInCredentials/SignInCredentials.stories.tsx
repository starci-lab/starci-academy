import type { Meta, StoryObj } from "@storybook/nextjs"
import { SignInCredentials } from "@sb-components/starci/blocks/auth/SignInCredentials/SignInCredentials"
import type { SignInProviderKey } from "@sb-components/starci/blocks/auth/SignInProviders/SignInProviders"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `SignInCredentials`: the whole first step of signing in on one card.
 * The panel header, the provider column, the labelled rule between the two ways
 * in, the two credential fields, the remember row, the submit, and the exit to
 * sign-up.
 *
 * WHY THE CARD BELONGS TO THIS BLOCK. A screen composes blocks and frames only,
 * so the login screen cannot reach `SurfaceCard` and draw the panel face itself
 * (rules/1 §2). Either one block owns that face or several blocks each own a
 * slice of a face nobody owns whole, and the card plus its padding plus the
 * rhythm between its regions is one decision.
 *
 * WHY IT EARNS ITS LAYER OVER `SignInProviders`. It adds the form, every line of
 * wording on the panel, and the decision that the rule saying HOẶC exists only
 * while there is a provider column above it to close off. That is domain
 * knowledge rather than forwarding, which is what `check-passthrough-block` asks
 * of a block that nests a block.
 *
 * ERRORS ARE ENUMS, NOT SENTENCES. The brief asked for `emailError?: string`;
 * the props are closed unions instead, because a block that accepts the sentence
 * stops owning the wording that §14d.1 puts at this tier. The state names below
 * therefore read `emailError = "unknownAccount"` rather than quoting the line
 * the visitor sees.
 *
 * LEAVES BY STRUCTURE. `emailError` and `passwordError` grow an error line and
 * turn a border, `isSubmitting` swaps the submit glyph for a spinner and locks
 * the fieldset, and `onPressForgotPassword` decides whether the recovery link
 * exists at all — all three are flipped by the CALLER, so each is a leaf
 * (rules/2 §0). What the visitor types is data, so an empty panel and a filled
 * one are two states of the same leaf.
 *
 * NO `pendingProvider` LEAF. That prop changes a button INSIDE the nested block,
 * and `SignInProviders` already documents the case on its own story, so a leaf
 * here would be the same claim made twice in two places that can drift apart.
 *
 * NO `providers = []` LEAF EITHER. Every deployment of this product offers at
 * least one identity provider, so a panel without the column is a case no screen
 * asks for, and building it would be inventing one (§14d.3).
 */
const meta: Meta<typeof SignInCredentials> = {
    title: "StarCi/Blocks/Auth/SignInCredentials/SignInCredentials",
    component: SignInCredentials,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SignInCredentials>

/** The providers this product offers, in the order a screen would hand them over. */
const PROVIDERS: Array<SignInProviderKey> = ["google", "github"]

/** A filled-in address, short enough that it never truncates in the card. */
const EMAIL = "an@starci.dev"

/** A password long enough to pass the eight-character rule the block words. */
const PASSWORD = "khong-phai-that"

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the card face the whole panel sits on, owning the surface, its rounding and the padding around every region inside it", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "StackV": { tier: "frame", role: "one of the vertical tracks of the panel, either the one separating its four regions, the one binding the provider column to the rule beneath it, or the one holding the field column", storyId: "frames-stack-stackv--default" },
    "TitledText": { tier: "composite", role: "the panel header, taking the title and its one line of subtitle as data and owning the type scale and tone of both", storyId: "composites-texts-titledtext--header" },
    "SignInProviders": { tier: "block", role: "the nested block drawing one button per identity provider, owning the glyph and the sentence that belong to each of them", storyId: "starci-blocks-auth-signinproviders-signinproviders--default" },
    "Divider": { tier: "atom", role: "the labelled rule closing off the provider column, a line on each side of the word this block hands it", storyId: "atoms-display-divider-divider--with-label" },
    "Form": { tier: "composite", role: "the real form element underneath, giving the panel a native submit on ENTER and a fieldset that locks every control at once", storyId: "composites-form-form-form--default" },
    "InputText": { tier: "atom", role: "the email field, carrying its own label, placeholder and error line so the block hands it a sentence rather than drawing one", storyId: "atoms-forms-input-inputtext--default" },
    "InputPassword": { tier: "atom", role: "the password field, the same contract as the email field plus the reveal control it owns on its own right edge", storyId: "atoms-forms-input-inputpassword--default" },
    "Split": { tier: "frame", role: "the remember row, holding the checkbox as the side that gives way and the recovery link as the side that never shrinks", storyId: "frames-split-split--default" },
    "ChoiceCheckbox": { tier: "atom", role: "the remember-me control with its label sitting beside the box, reporting the new state rather than holding one", storyId: "atoms-forms-choice-choicecheckbox--default" },
    "Button": { tier: "atom", role: "the submit, the single strong weight on the panel, taking a spinner in place of its glyph while a request is in flight", storyId: "atoms-buttons-button-button--default" },
    "Typography": { tier: "atom", role: "one of the panel's quiet text lines, either the recovery link, the sign-up prompt, or the word that leads to the sign-up side", storyId: "atoms-text-typography-typography--plain" },
    "StackH": { tier: "frame", role: "the closing row that keeps the sign-up prompt and its link on one centred line with a single seam between them", storyId: "frames-stack-stackh--default" },
}

/** LEAF — the minimal valid call: no recovery link, nothing in flight, no error. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SignInCredentials"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                reason="The submit is the only primary weight on the card. The provider buttons above it and the two links below it stay quiet on purpose, because a panel with two strong targets says nothing about which road the product expects."
                states={[
                    {
                        name: "email = \"\", password = \"\"",
                        why: "Both fields show their placeholders and no error line exists under either of them, so the card is at its shortest. This is what a visitor who has just landed sees, and nothing on it is red before they have been given a chance to type.",
                        code: `<SignInCredentials
    providers={["google", "github"]}
    onPressProvider={startRedirect}
    email=""
    onEmailChange={setEmail}
    password=""
    onPasswordChange={setPassword}
    isRemembered={false}
    onRememberedChange={setRemembered}
    onSubmit={signIn}
    onPressSignUp={goToSignUp}
/>`,
                        render: (
                            <SignInCredentials
                                anatPart="SignInCredentials"
                                showAnatomy
                                providers={PROVIDERS}
                                onPressProvider={() => {}}
                                email=""
                                onEmailChange={() => {}}
                                password=""
                                onPasswordChange={() => {}}
                                isRemembered={false}
                                onRememberedChange={() => {}}
                                onSubmit={() => {}}
                                onPressSignUp={() => {}}
                            />
                        ),
                    },
                    {
                        name: "email = \"an@starci.dev\", password holds 15 characters",
                        why: "Both fields carry a value, the password is drawn masked by the atom, and the remember box is ticked, while the shape of the card stays exactly as it was. This is the panel a second before submit, and it is worth seeing beside the empty one because nothing about it moved.",
                        code: `<SignInCredentials
    providers={["google", "github"]}
    onPressProvider={startRedirect}
    email="an@starci.dev"
    onEmailChange={setEmail}
    password={password}
    onPasswordChange={setPassword}
    isRemembered
    onRememberedChange={setRemembered}
    onSubmit={signIn}
    onPressSignUp={goToSignUp}
/>`,
                        render: (
                            <SignInCredentials
                                providers={PROVIDERS}
                                onPressProvider={() => {}}
                                email={EMAIL}
                                onEmailChange={() => {}}
                                password={PASSWORD}
                                onPasswordChange={() => {}}
                                isRemembered
                                onRememberedChange={() => {}}
                                onSubmit={() => {}}
                                onPressSignUp={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a validation axis: an error line grows under a field and its border turns. */
export const Invalid: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SignInCredentials"
                tier="block"
                leaf="Prop `emailError` and `passwordError`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                reason="The caller names the RULE that failed and this block writes the sentence. A prop that accepted the sentence would hand the wording back to the caller, and two screens would then be free to explain the same failure two different ways."
                states={[
                    {
                        name: "emailError = \"unknownAccount\"",
                        why: "A line grows under the email field and that field's border turns, while the password field below it is untouched. The address is well formed but no account uses it, and saying so is more useful than a shared sentence about the pair being wrong.",
                        code: `<SignInCredentials
    providers={["google", "github"]}
    onPressProvider={startRedirect}
    email="an@starci.dev"
    onEmailChange={setEmail}
    emailError="unknownAccount"
    password=""
    onPasswordChange={setPassword}
    isRemembered={false}
    onRememberedChange={setRemembered}
    onSubmit={signIn}
    onPressSignUp={goToSignUp}
/>`,
                        render: (
                            <SignInCredentials
                                anatPart="SignInCredentials"
                                showAnatomy
                                providers={PROVIDERS}
                                onPressProvider={() => {}}
                                email={EMAIL}
                                onEmailChange={() => {}}
                                emailError="unknownAccount"
                                password=""
                                onPasswordChange={() => {}}
                                isRemembered={false}
                                onRememberedChange={() => {}}
                                onSubmit={() => {}}
                                onPressSignUp={() => {}}
                            />
                        ),
                    },
                    {
                        name: "passwordError = \"tooShort\"",
                        why: "The error moves to the second field, so the line and the turned border sit under the password while the email above stays neutral. The rule is checked in the browser before anything is sent, which is why the panel can name the length rather than reporting a rejected attempt.",
                        code: `<SignInCredentials
    providers={["google", "github"]}
    onPressProvider={startRedirect}
    email="an@starci.dev"
    onEmailChange={setEmail}
    password="abc"
    onPasswordChange={setPassword}
    passwordError="tooShort"
    isRemembered={false}
    onRememberedChange={setRemembered}
    onSubmit={signIn}
    onPressSignUp={goToSignUp}
/>`,
                        render: (
                            <SignInCredentials
                                providers={PROVIDERS}
                                onPressProvider={() => {}}
                                email={EMAIL}
                                onEmailChange={() => {}}
                                password="abc"
                                onPasswordChange={() => {}}
                                passwordError="tooShort"
                                isRemembered={false}
                                onRememberedChange={() => {}}
                                onSubmit={() => {}}
                                onPressSignUp={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSubmitting`, so the submit locks and the fieldset goes with it. */
export const Submitting: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SignInCredentials"
                tier="block"
                leaf="Prop `isSubmitting`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                reason="Both roads into submit close together. The fieldset locks the button and every field, and the form handler is unhooked so ENTER inside a field cannot start a second attempt while the first is still out."
                states={[
                    {
                        name: "isSubmitting = true",
                        why: "The submit takes a spinner in place of its glyph and stops accepting presses, and every control above it greys out with the fieldset. The credentials are already on their way, so a panel that still looked pressable would invite the second attempt it is there to prevent.",
                        code: `<SignInCredentials
    providers={["google", "github"]}
    onPressProvider={startRedirect}
    email="an@starci.dev"
    onEmailChange={setEmail}
    password={password}
    onPasswordChange={setPassword}
    isRemembered
    onRememberedChange={setRemembered}
    onSubmit={signIn}
    isSubmitting
    onPressSignUp={goToSignUp}
/>`,
                        render: (
                            <SignInCredentials
                                anatPart="SignInCredentials"
                                showAnatomy
                                providers={PROVIDERS}
                                onPressProvider={() => {}}
                                email={EMAIL}
                                onEmailChange={() => {}}
                                password={PASSWORD}
                                onPasswordChange={() => {}}
                                isRemembered
                                onRememberedChange={() => {}}
                                onSubmit={() => {}}
                                isSubmitting
                                onPressSignUp={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the screen wires account recovery, so a link grows on the trailing side of the remember row. */
export const ForgotPassword: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SignInCredentials"
                tier="block"
                leaf="Prop `onPressForgotPassword`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                reason="The remember row keeps its frame whether or not the link exists, so the checkbox is drawn in the same box either way. The row is a constant of the panel and only the link is conditional, which is why the two sides are named rather than merely lined up."
                states={[
                    {
                        name: "onPressForgotPassword is wired",
                        why: "A link appears on the trailing side of the remember row, opposite the checkbox and against the right edge of the card. Recovery is only offered when a screen has somewhere to send the visitor, because a way out that leads nowhere is worse than no way out.",
                        code: `<SignInCredentials
    providers={["google", "github"]}
    onPressProvider={startRedirect}
    email="an@starci.dev"
    onEmailChange={setEmail}
    password={password}
    onPasswordChange={setPassword}
    isRemembered={false}
    onRememberedChange={setRemembered}
    onSubmit={signIn}
    onPressForgotPassword={startRecovery}
    onPressSignUp={goToSignUp}
/>`,
                        render: (
                            <SignInCredentials
                                anatPart="SignInCredentials"
                                showAnatomy
                                providers={PROVIDERS}
                                onPressProvider={() => {}}
                                email={EMAIL}
                                onEmailChange={() => {}}
                                password={PASSWORD}
                                onPasswordChange={() => {}}
                                isRemembered={false}
                                onRememberedChange={() => {}}
                                onSubmit={() => {}}
                                onPressForgotPassword={() => {}}
                                onPressSignUp={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
