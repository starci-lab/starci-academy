"use client"

/**
 * Sign-up step: registration form (email, passwords, terms).
 *
 * Container: owns the sign-up formik (singleton `useSignUpForm()`) and the
 * switch-to-sign-in action; resolves i18n; hands resolved props to the
 * presentational {@link _RegistrationState}. See `tiers/split.md`.
 */
import React, {
    useCallback,
} from "react"
import { useTranslations } from "next-intl"
import { _RegistrationState } from "./component"
import { useAppDispatch } from "@/redux/hooks"
import { AuthenticationModalTab, setAuthenticationModalTab } from "@/redux/slices/tabs"
import { resetSignUpState } from "@/redux/slices/state"
import { useSignUpForm } from "@/hooks/zustand/signUp/useSignUpForm"
import { publicEnv } from "@/resources/env/public"

/** Props for {@link RegistrationState}. */
export interface RegistrationStateProps {
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

    // `Input.*` atoms carry no `onBlur` — the field is marked touched on its
    // first edit instead (same combined value+touch shape already used for
    // `agreeToTerms` below), so the inline error still gates on interaction.
    const onChangeEmail = useCallback(
        (value: string) => {
            setFieldValue("email", value)
            setFieldTouched("email", true)
        },
        [
            setFieldValue,
            setFieldTouched,
        ],
    )

    const onChangePassword = useCallback(
        (value: string) => {
            setFieldValue("password", value)
            setFieldTouched("password", true)
        },
        [
            setFieldValue,
            setFieldTouched,
        ],
    )

    const onChangeConfirmPassword = useCallback(
        (value: string) => {
            setFieldValue("confirmPassword", value)
            setFieldTouched("confirmPassword", true)
        },
        [
            setFieldValue,
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

    const onCaptchaVerify = useCallback(
        (token: string) => {
            setFieldValue("captchaToken", token)
        },
        [
            setFieldValue,
        ],
    )
    const onCaptchaExpire = useCallback(
        () => {
            setFieldValue("captchaToken", undefined)
        },
        [
            setFieldValue,
        ],
    )
    const onCaptchaError = useCallback(
        () => {
            setFieldValue("captchaToken", undefined)
        },
        [
            setFieldValue,
        ],
    )

    const captchaEnabled = publicEnv().captcha.enabled
    const isSubmitDisabled = !isValid || (captchaEnabled && !values.captchaToken)

    return (
        <_RegistrationState
            hideCloseButton={hideCloseButton}
            values={values}
            errors={errors}
            touched={touched}
            isSubmitting={isSubmitting}
            isSubmitDisabled={isSubmitDisabled}
            captchaEnabled={captchaEnabled}
            labels={{
                title: t("auth.signUp.title"),
                desc: t("auth.signUp.desc"),
                submit: t("auth.signUp.submit"),
            }}
            onChangeEmail={onChangeEmail}
            onChangePassword={onChangePassword}
            onChangeConfirmPassword={onChangeConfirmPassword}
            onChangeAgreeToTerms={onChangeAgreeToTerms}
            onSubmit={onSubmit}
            onSwitchToSignIn={onSwitchToSignIn}
            onCaptchaVerify={onCaptchaVerify}
            onCaptchaExpire={onCaptchaExpire}
            onCaptchaError={onCaptchaError}
        />
    )
}
