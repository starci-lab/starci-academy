"use client"

/**
 * Sign-up step: registration form (email, passwords, terms). Singleton `useSignUpFormik()`.
 * Modal chrome matches {@link SignInSection} `CredentialsState` (close, header, body).
 */
import React, { useState } from "react"
import {
    Button,
    Checkbox,
    FieldError,
    Input,
    Label,
    Link,
    Modal,
    Spinner,
    TextField,
} from "@heroui/react"
import { useAppDispatch } from "@/redux"
import {
    AuthenticationModalTab,
    resetSignUpState,
    setAuthenticationModalTab,
} from "@/redux/slices"
import { EyeIcon, EyeClosedIcon } from "@phosphor-icons/react"
import { useSignUpFormik } from "@/hooks/singleton"
import { useTranslations } from "next-intl"
import { WithClassNames } from "@/modules/types"

export type RegistrationStateProps = WithClassNames<undefined>

/**
 * Registration form UI for the sign-up tab.
 */
export const RegistrationState = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
    } = useSignUpFormik()
    return (
        <>
            <Modal.CloseTrigger />
            <Modal.Header>
                <div className="text-center">
                    <div className="font-semibold text-lg">{t("auth.signUp.title")}</div>
                    <div className="text-xs text-muted">{t("auth.signUp.desc")}</div>
                </div>
            </Modal.Header>
            <Modal.Body className="overflow-visible p-3">
                <TextField isInvalid={!!(touched.email && errors.email)}>
                    <Label htmlFor="sign-up-email" className="text-sm">
                        {t("auth.signUp.email.label")}
                    </Label>
                    <Input
                        id="sign-up-email"
                        required
                        variant="secondary"
                        type="email"
                        placeholder={t("auth.signUp.email.placeholder")}
                        name="email"
                        value={values.email}
                        onChange={(event) => setFieldValue("email", event.target.value)}
                        onBlur={() => setFieldTouched("email", true)}
                    />
                    <FieldError>{errors.email}</FieldError>
                </TextField>
                <div className="h-3" />
                <TextField isInvalid={!!(touched.password && errors.password)}>
                    <Label htmlFor="sign-up-password" className="text-sm">
                        {t("auth.signUp.password.label")}
                    </Label>
                    <div className="relative">
                        <Link
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-md p-1 text-foreground-500 outline-none transition-opacity hover:opacity-80"
                            onPress={() => setShowPassword((s) => !s)}
                        >
                            {showPassword ? (
                                <EyeIcon className="h-4 w-4" />
                            ) : (
                                <EyeClosedIcon className="h-4 w-4" />
                            )}
                        </Link>
                        <Input
                            id="sign-up-password"
                            required
                            variant="secondary"
                            placeholder={t("auth.signUp.password.placeholder")}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="w-full"
                            value={values.password}
                            onChange={(e) => setFieldValue("password", e.target.value)}
                            onBlur={() => setFieldTouched("password", true)}
                        />
                    </div>
                    <FieldError>{errors.password}</FieldError>
                </TextField>
                <div className="h-3" />
                <TextField isInvalid={!!(touched.confirmPassword && errors.confirmPassword)}>
                    <Label htmlFor="sign-up-confirm-password" className="text-sm">
                        {t("auth.signUp.confirmPassword.label")}
                    </Label>
                    <div className="relative">
                        <Link
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-md p-1 text-foreground-500 outline-none transition-opacity hover:opacity-80"
                            onPress={() => setShowConfirmPassword((s) => !s)}
                        >
                            {showConfirmPassword ? (
                                <EyeIcon className="h-4 w-4" />
                            ) : (
                                <EyeClosedIcon className="h-4 w-4" />
                            )}
                        </Link>
                        <Input
                            id="sign-up-confirm-password"
                            required
                            variant="secondary"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t("auth.signUp.confirmPassword.placeholder")}
                            name="confirmPassword"
                            className="w-full"
                            value={values.confirmPassword}
                            onChange={(e) => setFieldValue("confirmPassword", e.target.value)}
                            onBlur={() => setFieldTouched("confirmPassword", true)}
                        />
                    </div>
                    <FieldError>{errors.confirmPassword}</FieldError>
                </TextField>
                <div className="h-3" />
                <div className="flex flex-col gap-1">
                    <div className="flex items-start gap-1.5">
                        <Checkbox
                            id="sign-up-agree-to-terms"
                            className="w-full"
                            variant="secondary"
                            isSelected={values.agreeToTerms}
                            onChange={(v) => {
                                /** Third arg: run validation so `errors.agreeToTerms` clears when checked. */
                                setFieldValue("agreeToTerms", Boolean(v), true)
                                setFieldTouched("agreeToTerms", true, false)
                            }}
                        >
                            <Checkbox.Control>
                                <Checkbox.Indicator />
                            </Checkbox.Control>
                            <Checkbox.Content className="w-full">
                                <Label htmlFor="sign-up-agree-to-terms">
                                    <div className="text-xs text-muted">
                                        <span>{t("auth.signUp.agreeToTerms.prefix")}{" "}</span>
                                        <Link className="text-xs underline inline ">
                                            {t("auth.signUp.agreeToTerms.terms")}
                                        </Link>{" "}
                                        <span>{t("auth.signUp.agreeToTerms.and")}{" "}</span>
                                        <Link className="text-xs underline inline ">
                                            {t("auth.signUp.agreeToTerms.privacy")}
                                        </Link>{" "}
                                        <span>{t("auth.signUp.agreeToTerms.and")}{" "}</span>
                                    </div>
                                </Label>
                            </Checkbox.Content>
                        </Checkbox>
                    </div>
                    {
                        touched.agreeToTerms && errors.agreeToTerms ? (
                            <div className="text-xs text-danger mt-1">
                                {errors.agreeToTerms}
                            </div>
                        ) : null
                    }
                </div>
                <div className="h-3" />
                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isDisabled={!isValid}
                    isPending={isSubmitting}
                    onPress={() => submitForm()}
                >
                    {({ isPending }) => (
                        <>
                            {isPending ? <Spinner color="current" size="sm" /> : null}
                            {t("auth.signUp.submit")}
                        </>
                    )}
                </Button>
                <div className="h-3" />
                <div className="flex justify-center items-center gap-1">
                    <div className="text-xs text-foreground-500">
                        {t("auth.signUp.haveAccount")}
                    </div>
                    <Link
                        className="text-xs"
                        onPress={() => {
                            resetForm()
                            dispatch(resetSignUpState())
                            dispatch(
                                setAuthenticationModalTab(AuthenticationModalTab.SignIn)
                            )
                        }}
                    >
                        {t("auth.signUp.signIn")}
                    </Link>
                </div>
            </Modal.Body>
        </>
    )
}
