import { SignInIcon, UserPlusIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Alert } from "@sb-components/atoms/feedback/Alert/Alert"
import { InputPassword, InputText } from "@sb-components/atoms/forms"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `AuthCard` -- the centred email/password card a visitor meets before entering
 * their learning space or their academy dashboard. ONE composition: an
 * optional name field (register only), email + password, a submit button, and
 * an error slot. The `mode` toggle and the presence/absence of the toggle
 * LINK are DATA, so they are STATES of the single shape -- not two components.
 * Grounded in the real `learn/page.tsx` (student: register ⇄ login, default
 * mode `register`) and `dashboard/page.tsx` (admin: login only, no register --
 * `onToggleMode` is simply omitted). Maps onto the real `register`/`login`
 * GraphQL mutations (`lib/session.ts`). The real app has no OAuth/SSO
 * provider anywhere in `lib/session.ts`, so no OAuth button is modelled here.
 */

/** Which form this card shows. */
export type AuthMode = "login" | "register"

/** Fields + actions every mode shares. */
interface AuthCardOwnProps {
    /** Email address -- maps to `register`/`login`'s `email` argument. */
    email: string
    /** Fires as the email field changes. */
    onEmailChange: (value: string) => void
    /** Password -- maps to `register`/`login`'s `password` argument. */
    password: string
    /** Fires as the password field changes. */
    onPasswordChange: (value: string) => void
    /** Submit the form -- the connected layer runs `register(...)` or `login(...)` by `mode`. */
    onSubmit: () => void
    /**
     * The mutation's thrown message (`AuthResult` envelope's `error`/`message`),
     * shown as a danger alert above the fields. Unset while idle or once the
     * fields have changed since the last failed attempt.
     */
    errorMessage?: string
    /** `true` -> the mutation is in flight: the submit button shows a spinner and every field locks. */
    isSubmitting?: boolean
    /** Already-localized copy. */
    labels: AuthCardLabels
}

/**
 * `mode` decides the composition (COMPOSITE rule: scenario is a discriminating
 * prop). `register` always carries `name` + `onNameChange` + `onToggleMode` --
 * the real app only reaches the register form through the toggle, so a
 * register-mode card with no way back to login cannot occur. `login` carries
 * `onToggleMode` only when the deployment actually offers self-registration
 * (the student flow); the admin flow's dashboard sign-in omits it, and the
 * card renders with no toggle link at all -- matching `dashboard/page.tsx`,
 * which has no register branch to switch to.
 */
export type AuthCardProps = AuthCardOwnProps &
    (
        | { mode: "register"; name: string; onNameChange: (value: string) => void; onToggleMode: () => void }
        | { mode: "login"; onToggleMode?: () => void }
    )

/** The already-resolved copy the card renders. */
export interface AuthCardLabels {
    /** Card title in login mode. */
    loginTitle: string
    /** Card title in register mode. */
    registerTitle: string
    /** Label above the name field (register mode only). */
    nameLabel: string
    /** Label above the email field. */
    emailLabel: string
    /** Label above the password field. */
    passwordLabel: string
    /** Accessible name for the password reveal control. */
    passwordRevealLabel: string
    /** Accessible name for the password hide control. */
    passwordHideLabel: string
    /** Submit button label in login mode. */
    loginSubmitLabel: string
    /** Submit button label in register mode. */
    registerSubmitLabel: string
    /** Toggle link label shown while in login mode (switches to register). */
    toggleToRegisterLabel: string
    /** Toggle link label shown while in register mode (switches to login). */
    toggleToLoginLabel: string
}

/**
 * The sign-in / sign-up card. See the file header for why `mode` and the
 * toggle's presence are states of one shape rather than separate leaves.
 *
 * @param props - {@link AuthCardProps}
 */
const AuthCard = (props: AuthCardProps) => {
    const { email, onEmailChange, password, onPasswordChange, onSubmit, errorMessage, isSubmitting = false, labels, mode, onToggleMode } = props
    const name = mode === "register" ? props.name : undefined
    const onNameChange = mode === "register" ? props.onNameChange : undefined

    // Presentation logic the block derives, not a request it makes -- mirrors the
    // real `doAuth`'s implicit contract (both mutations require email + password;
    // `register` additionally requires a name).
    const canSubmit = email.trim().length > 0 && password.trim().length > 0 && (mode !== "register" || Boolean(name?.trim().length))

    return (
        <div data-tier="block" data-component="AuthCard">
            <SurfaceCard
                padding={4}
                isSkeleton={false}
                body={() => (
                    <StackV
                        gap={4}
                        items={[
                            () => <Typography size="h4" weight="semibold" text={mode === "register" ? labels.registerTitle : labels.loginTitle} />,
                            ...(errorMessage ? [() => <Alert status="danger" title={errorMessage} />] : []),
                            () => (
                                <StackV
                                    gap={3}
                                    items={[
                                        ...(mode === "register"
                                            ? [() => (
                                                <InputText
                                                    variant="secondary"
                                                    label={labels.nameLabel}
                                                    value={name ?? ""}
                                                    onValueChange={(value) => onNameChange?.(value)}
                                                    isDisabled={isSubmitting}
                                                />
                                            )]
                                            : []),
                                        () => (
                                            <InputText
                                                variant="secondary"
                                                label={labels.emailLabel}
                                                value={email}
                                                onValueChange={onEmailChange}
                                                isDisabled={isSubmitting}
                                            />
                                        ),
                                        () => (
                                            <InputPassword
                                                label={labels.passwordLabel}
                                                value={password}
                                                onValueChange={onPasswordChange}
                                                isDisabled={isSubmitting}
                                                revealLabel={labels.passwordRevealLabel}
                                                hideLabel={labels.passwordHideLabel}
                                            />
                                        ),
                                    ]}
                                />
                            ),
                            () => (
                                <Button
                                    variant="primary"
                                    prefixIcon={mode === "register" ? UserPlusIcon : SignInIcon}
                                    label={mode === "register" ? labels.registerSubmitLabel : labels.loginSubmitLabel}
                                    onPress={onSubmit}
                                    isDisabled={!canSubmit}
                                    isPending={isSubmitting}
                                />
                            ),
                            ...(onToggleMode
                                ? [() => (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        label={mode === "register" ? labels.toggleToLoginLabel : labels.toggleToRegisterLabel}
                                        onPress={onToggleMode}
                                        isDisabled={isSubmitting}
                                    />
                                )]
                                : []),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { AuthCard }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "AuthCard" } as const
