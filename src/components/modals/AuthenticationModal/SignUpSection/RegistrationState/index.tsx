"use client"

/**
 * Sign-up step: registration form (email, passwords, terms).
 *
 * Container: owns the sign-up formik (singleton `useSignUpForm()`) and the
 * switch-to-sign-in action; renders presentational field children inside the
 * modal chrome. Modal shell matches {@link SignInSection} `CredentialsState`.
 */
import React, {
    useCallback,
} from "react"
import {
    Button,
    Modal,
    Spinner,
    Typography,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { EmailField } from "./EmailField"
import { PasswordField } from "./PasswordField"
import { AgreeToTermsRow } from "./AgreeToTermsRow"
import { SignInPrompt } from "./SignInPrompt"
import { useAppDispatch } from "@/redux/hooks"
import { AuthenticationModalTab, setAuthenticationModalTab } from "@/redux/slices/tabs"
import { resetSignUpState } from "@/redux/slices/state"
import { useSignUpForm } from "@/hooks/zustand/signUp/useSignUpForm"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { Turnstile } from "@/components/reuseable/Turnstile"
import { publicEnv } from "@/resources/env/public"

/** Props for {@link RegistrationState}. */
export interface RegistrationStateProps extends WithClassNames<undefined> {
    /** Hides `Modal.CloseTrigger` when hosted outside a dismissible modal (the `/login` page). */
    hideCloseButton?: boolean
}

/**
 * Registration form container for the sign-up tab.
 */
export const RegistrationState = ({ hideCloseButton }: RegistrationStateProps = {}) => {
    const dispatch = useAppDispatch()
    const t = useTranslations()
    const {
        values,
        errors,
        touched,
        submitForm,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
        resetForm,
        isValid,
    } = useSignUpForm()

    const onChangeEmail = useCallback(
        (value: string) => {
            setFieldValue("email", value)
        },
        [
            setFieldValue,
        ],
    )
    const onBlurEmail = useCallback(
        () => {
            setFieldTouched("email", true)
        },
        [
            setFieldTouched,
        ],
    )

    const onChangePassword = useCallback(
        (value: string) => {
            setFieldValue("password", value)
        },
        [
            setFieldValue,
        ],
    )
    const onBlurPassword = useCallback(
        () => {
            setFieldTouched("password", true)
        },
        [
            setFieldTouched,
        ],
    )

    const onChangeConfirmPassword = useCallback(
        (value: string) => {
            setFieldValue("confirmPassword", value)
        },
        [
            setFieldValue,
        ],
    )
    const onBlurConfirmPassword = useCallback(
        () => {
            setFieldTouched("confirmPassword", true)
        },
        [
            setFieldTouched,
        ],
    )

    const onChangeAgreeToTerms = useCallback(
        (selected: boolean) => {
            // third arg true: run validation so `errors.agreeToTerms` clears when checked
            setFieldValue("agreeToTerms", selected, true)
            setFieldTouched("agreeToTerms", true, false)
        },
        [
            setFieldValue,
            setFieldTouched,
        ],
    )

    const onSubmit = useCallback(
        () => {
            submitForm()
        },
        [
            submitForm,
        ],
    )

    /** Reset the form + sign-up state, then switch to the sign-in tab. */
    const onSwitchToSignIn = useCallback(
        () => {
            resetForm()
            dispatch(resetSignUpState())
            dispatch(setAuthenticationModalTab(AuthenticationModalTab.SignIn))
        },
        [
            resetForm,
            dispatch,
        ],
    )

    const isSubmitDisabled = !isValid || (publicEnv().captcha.enabled && !values.captchaToken)

    return (
        <>
            {!hideCloseButton && <Modal.CloseTrigger />}
            <Modal.Header>
                <Typography type="body" weight="semibold" className="pr-8 text-center">
                    {t("auth.signUp.title")}
                </Typography>
                <Typography type="body-xs" color="muted" className="text-center">
                    {t("auth.signUp.desc")}
                </Typography>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                    <EmailField
                        value={values.email}
                        error={errors.email}
                        touched={touched.email}
                        onChangeValue={onChangeEmail}
                        onBlurField={onBlurEmail}
                    />
                    <PasswordField
                        fieldId="sign-up-password"
                        name="password"
                        label={t("auth.signUp.password.label")}
                        placeholder={t("auth.signUp.password.placeholder")}
                        value={values.password}
                        error={errors.password}
                        touched={touched.password}
                        onChangeValue={onChangePassword}
                        onBlurField={onBlurPassword}
                        showLabel={t("auth.signUp.password.show")}
                        hideLabel={t("auth.signUp.password.hide")}
                    />
                    <PasswordField
                        fieldId="sign-up-confirm-password"
                        name="confirmPassword"
                        label={t("auth.signUp.confirmPassword.label")}
                        placeholder={t("auth.signUp.confirmPassword.placeholder")}
                        value={values.confirmPassword}
                        error={errors.confirmPassword}
                        touched={touched.confirmPassword}
                        onChangeValue={onChangeConfirmPassword}
                        onBlurField={onBlurConfirmPassword}
                        showLabel={t("auth.signUp.confirmPassword.show")}
                        hideLabel={t("auth.signUp.confirmPassword.hide")}
                    />
                    <AgreeToTermsRow
                        isSelected={values.agreeToTerms}
                        error={errors.agreeToTerms}
                        touched={touched.agreeToTerms}
                        onChangeSelected={onChangeAgreeToTerms}
                    />
                </div>

                {publicEnv().captcha.enabled && (
                    <Turnstile
                        onVerify={(token) => setFieldValue("captchaToken", token)}
                        onExpire={() => setFieldValue("captchaToken", undefined)}
                        onError={() => setFieldValue("captchaToken", undefined)}
                    />
                )}

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isDisabled={isSubmitDisabled}
                    isPending={isSubmitting}
                    onPress={onSubmit}
                >
                    {({ isPending }) => (
                        <>
                            {isPending ? <Spinner color="current" size="sm" /> : null}
                            {t("auth.signUp.submit")}
                        </>
                    )}
                </Button>
                <SignInPrompt onSwitchToSignIn={onSwitchToSignIn} />
            </Modal.Body>
        </>
    )
}
