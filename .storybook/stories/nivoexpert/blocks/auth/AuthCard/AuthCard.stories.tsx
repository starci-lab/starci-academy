import type { Meta, StoryObj } from "@storybook/nextjs"
import { AuthCard, type AuthCardLabels } from "@sb-components/nivoexpert/blocks/auth/AuthCard/AuthCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AuthCard` — the centred email/password card a visitor meets before entering
 * their learning space or their academy dashboard. ONE composition: an
 * optional name field (register only), email + password, a submit button, and
 * an error slot. The `mode` toggle and the presence/absence of the toggle
 * LINK are DATA, so they are STATES of the single shape — not two components.
 * Grounded in the real `learn/page.tsx` (student: register ⇄ login, default
 * mode `register`) and `dashboard/page.tsx` (admin: login only, no register —
 * `onToggleMode` is simply omitted). Maps onto the real `register`/`login`
 * GraphQL mutations (`lib/session.ts`). The real app has no OAuth/SSO
 * provider anywhere in `lib/session.ts`, so no OAuth button is modelled here.
 */
const meta: Meta<typeof AuthCard> = {
    title: "NivoExpert/Blocks/Auth/AuthCard/AuthCard",
    component: AuthCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AuthCard>

const LABELS: AuthCardLabels = {
    loginTitle: "Sign in",
    registerTitle: "Create your account",
    nameLabel: "Your name",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginSubmitLabel: "Sign in",
    registerSubmitLabel: "Create account",
    toggleToRegisterLabel: "Create a new account",
    toggleToLoginLabel: "Already have an account?",
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the card face the form sits inside" },
    Typography: { tier: "atom", role: "the card title" },
    Alert: { tier: "atom", role: "the error slot — the last mutation's thrown message" },
    InputText: { tier: "atom", role: "the name field (register only) and the email field" },
    InputPassword: { tier: "atom", role: "the masked password field" },
    Button: { tier: "atom", role: "the submit action and, when offered, the mode-toggle link" },
}

/** LEAF — one shape; `mode`, the toggle's presence, `isSubmitting`, and `errorMessage` are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AuthCard"
                tier="block"
                leaf="Auth card"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="Blocks take no `className`: the card owns the credential entry, so a route places the WHOLE card rather than restyling it. `mode` is a discriminating prop deciding the composition — register carries an extra name field and always a toggle back to login (the real app only reaches register THROUGH that toggle); login carries the toggle only when the deployment actually offers self-registration, and omits it entirely for the admin dashboard's login-only sign-in."
                states={[
                    {
                        name: "mode = login, toggle offered",
                        why: "A returning student on the shared learn-page flow: email + password, submit, and a link down to register. The resting state most visitors meet.",
                        code: `<AuthCard mode="login"
    email={email} onEmailChange={setEmail}
    password={password} onPasswordChange={setPassword}
    onSubmit={login} onToggleMode={switchToRegister}
    labels={labels}
/>`,
                        render: (
                            <AuthCard
                                mode="login"
                                email=""
                                onEmailChange={NOOP}
                                password=""
                                onPasswordChange={NOOP}
                                onSubmit={NOOP}
                                onToggleMode={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "mode = register, toggle offered",
                        why: "The learn-page flow's default entry state (`useState(\"register\")` in the real page): a name field ahead of email/password, and a link back down to login for a visitor who already has an account.",
                        code: `<AuthCard mode="register"
    name={name} onNameChange={setName}
    email={email} onEmailChange={setEmail}
    password={password} onPasswordChange={setPassword}
    onSubmit={register} onToggleMode={switchToLogin}
    labels={labels}
/>`,
                        render: (
                            <AuthCard
                                mode="register"
                                name=""
                                onNameChange={NOOP}
                                email=""
                                onEmailChange={NOOP}
                                password=""
                                onPasswordChange={NOOP}
                                onSubmit={NOOP}
                                onToggleMode={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "mode = login, no toggle (admin)",
                        why: "The academy dashboard's sign-in (`dashboard/page.tsx`): admin accounts are never self-registered, so `onToggleMode` is simply omitted and no toggle link renders — there is nowhere for it to lead.",
                        code: "<AuthCard mode=\"login\" email={email} onEmailChange={setEmail} password={password} onPasswordChange={setPassword} onSubmit={login} labels={labels} />",
                        render: (
                            <AuthCard
                                mode="login"
                                email=""
                                onEmailChange={NOOP}
                                password=""
                                onPasswordChange={NOOP}
                                onSubmit={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSubmitting = true",
                        why: "The mutation is in flight: the submit button shows a spinner and every field locks, so a double-click cannot fire `register`/`login` twice.",
                        code: "<AuthCard {...props} isSubmitting />",
                        render: (
                            <AuthCard
                                mode="login"
                                email="mai.trang@nivo.local"
                                onEmailChange={NOOP}
                                password="cohort-launch-2026"
                                onPasswordChange={NOOP}
                                onSubmit={NOOP}
                                onToggleMode={NOOP}
                                isSubmitting
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "errorMessage set",
                        why: "The last attempt's thrown message (the `AuthResult` envelope's `error`, e.g. a wrong password or a duplicate email) surfaces as a danger alert above the fields — the fields keep their typed values so nothing is lost.",
                        code: "<AuthCard {...props} errorMessage=\"Invalid email or password.\" />",
                        render: (
                            <AuthCard
                                mode="login"
                                email="mai.trang@nivo.local"
                                onEmailChange={NOOP}
                                password="wrong-password"
                                onPasswordChange={NOOP}
                                onSubmit={NOOP}
                                onToggleMode={NOOP}
                                errorMessage="Invalid email or password."
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
