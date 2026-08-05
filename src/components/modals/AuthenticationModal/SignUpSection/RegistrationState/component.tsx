import React from "react"
import { Modal } from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"
import { Box } from "@/components/frames/Box"
import { StackV } from "@/components/frames/Stack"
import { Form } from "@/components/composites/form/Form"
import { EmailField } from "./EmailField"
import { PasswordField } from "./PasswordField"
import { AgreeToTermsRow } from "./AgreeToTermsRow"
import { SignInPrompt } from "./SignInPrompt"
import { Turnstile } from "@/components/features/auth/Turnstile"

/** Editable values {@link _RegistrationState} renders. */
export interface RegistrationStateValues {
    email: string
    password: string
    confirmPassword: string
    agreeToTerms: boolean
}

/** Field-level validation errors, keyed the same as {@link RegistrationStateValues}. */
export interface RegistrationStateErrors {
    email?: string
    password?: string
    confirmPassword?: string
    agreeToTerms?: string
}

/** Which fields have been interacted with — gates when an error is shown. */
export interface RegistrationStateTouched {
    email?: boolean
    password?: boolean
    confirmPassword?: boolean
    agreeToTerms?: boolean
}

/** Already-translated strings {@link _RegistrationState} renders — resolved by the connected `RegistrationState`, never `t()` itself. */
export interface RegistrationStateLabels {
    title: string
    desc: string
    submit: string
}

/** Props for {@link _RegistrationState}. */
export interface RegistrationStateProps {
    /** Hides `Modal.CloseTrigger` when hosted outside a dismissible modal (the `/login` page). */
    hideCloseButton?: boolean
    values: RegistrationStateValues
    errors: RegistrationStateErrors
    touched: RegistrationStateTouched
    /** True while `signUpInit` is in flight — locks the submit button. */
    isSubmitting: boolean
    /** True when the form cannot be submitted yet (invalid, or captcha required but not solved). */
    isSubmitDisabled: boolean
    /** Whether the Cloudflare Turnstile widget should render at all. */
    captchaEnabled: boolean
    /** Already-translated strings — see {@link RegistrationStateLabels}. */
    labels: RegistrationStateLabels
    onChangeEmail: (value: string) => void
    onChangePassword: (value: string) => void
    onChangeConfirmPassword: (value: string) => void
    onChangeAgreeToTerms: (selected: boolean) => void
    /** Submit the form (the connected half runs `signUpInit`). */
    onSubmit: () => void
    /** Switch back to the sign-in tab. */
    onSwitchToSignIn: () => void
    onCaptchaVerify: (token: string) => void
    onCaptchaExpire: () => void
    onCaptchaError: () => void
}

/**
 * Presentational registration form — the first sign-up step (email, passwords,
 * terms). Renders its OWN `Modal.CloseTrigger` / `Modal.Header` / `Modal.Body`
 * chrome (not `ModalShell`): this section is also mounted bare on `/login`,
 * where there is no surrounding `<Modal>` at all — see {@link RegistrationState}.
 *
 * @param props - {@link RegistrationStateProps}
 */
export const _RegistrationState = ({
    hideCloseButton,
    values,
    errors,
    touched,
    isSubmitting,
    isSubmitDisabled,
    captchaEnabled,
    labels,
    onChangeEmail,
    onChangePassword,
    onChangeConfirmPassword,
    onChangeAgreeToTerms,
    onSubmit,
    onSwitchToSignIn,
    onCaptchaVerify,
    onCaptchaExpire,
    onCaptchaError,
}: RegistrationStateProps) => (
    <>
        {!hideCloseButton && <Modal.CloseTrigger />}
        <Modal.Header>
            <StackV
                gap={2}
                principles={["title-subtitle"]}
                items={[
                    () => (
                        <Box className="pr-8">
                            <Typography weight="semibold" align="center" text={labels.title} />
                        </Box>
                    ),
                    () => <Typography size="xs" color="muted" align="center" text={labels.desc} />,
                ]}
            />
        </Modal.Header>
        <Modal.Body>
            <Form
                onSubmit={onSubmit}
                gap={6}
                body={() => (
                    <StackV
                        gap={6}
                        items={[
                            () => (
                                <StackV
                                    gap={3}
                                    items={[
                                        () => (
                                            <EmailField
                                                value={values.email}
                                                error={errors.email}
                                                touched={touched.email}
                                                onChangeValue={onChangeEmail}
                                            />
                                        ),
                                        () => (
                                            <PasswordField
                                                kind="password"
                                                value={values.password}
                                                error={errors.password}
                                                touched={touched.password}
                                                onChangeValue={onChangePassword}
                                            />
                                        ),
                                        () => (
                                            <PasswordField
                                                kind="confirmPassword"
                                                value={values.confirmPassword}
                                                error={errors.confirmPassword}
                                                touched={touched.confirmPassword}
                                                onChangeValue={onChangeConfirmPassword}
                                            />
                                        ),
                                        () => (
                                            <AgreeToTermsRow
                                                isSelected={values.agreeToTerms}
                                                error={errors.agreeToTerms}
                                                touched={touched.agreeToTerms}
                                                onChangeSelected={onChangeAgreeToTerms}
                                            />
                                        ),
                                    ]}
                                />
                            ),
                            ...(captchaEnabled
                                ? [() => (
                                    <Turnstile
                                        onVerify={onCaptchaVerify}
                                        onExpire={onCaptchaExpire}
                                        onError={onCaptchaError}
                                    />
                                )]
                                : []),
                        ]}
                    />
                )}
                actions={() => (
                    <StackV
                        gap={6}
                        items={[
                            () => (
                                <Button
                                    variant="primary"
                                    classNames={["w-full"]}
                                    isDisabled={isSubmitDisabled}
                                    isPending={isSubmitting}
                                    label={labels.submit}
                                    onPress={onSubmit}
                                />
                            ),
                            () => <SignInPrompt onSwitchToSignIn={onSwitchToSignIn} />,
                        ]}
                    />
                )}
            />
        </Modal.Body>
    </>
)
