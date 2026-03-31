"use client"
import React, { useState } from "react"
import {
    StarCiModalBody,
    StarCiInput,
    StarCiDivider,
    StarCiButton,
    StarCiCheckbox,
    StarCiLink,
} from "../../../atomic"
import { Spacer } from "@heroui/react"
import { GoogleIcon } from "../../../svg"
import { useAppDispatch } from "@/redux"
import { EyeIcon, EyeClosedIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import {
    AuthenticationModalTab,
    setAuthenticationModalTab,
} from "@/redux/slices"
import { useSignInFormik } from "@/hooks/singleton"
import { useKeycloak } from "@/hooks/singleton"

export const SignInSection = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { data: keycloak, isLoading: keycloakLoading } = useKeycloak()
    const dispatch = useAppDispatch()
    const t = useTranslations()
    const {
        values,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
    } = useSignInFormik()

    return (
        <StarCiModalBody>
            <StarCiButton
                type="button"
                variant="bordered"
                className="w-full text-sm"
                isDisabled={keycloakLoading || !keycloak}
                startContent={<GoogleIcon className="w-5 h-5" />}
                onPress={
                    async () => {
                        await keycloak?.login({
                            idpHint: "google",
                        }
                        )
                    }
                }
            >
                {t("auth.signIn.google")}
            </StarCiButton>
            <Spacer y={3} />
            <StarCiDivider />
            <Spacer y={3} />
            <StarCiInput
                isRequired
                type="email"
                label={t("auth.signIn.email.label")}
                placeholder={t("auth.signIn.email.placeholder")}
                name="email"
                value={values.email}
                onValueChange={(email) => setFieldValue("email", email)}
                onBlur={() => setFieldTouched("email", true)}
                isInvalid={!!(touched.email && errors.email)}
                errorMessage={touched.email ? errors.email : undefined}
            />
            <Spacer y={3} />
            <StarCiInput
                isRequired
                type={showPassword ? "text" : "password"}
                label={t("auth.signIn.password.label")}
                placeholder={t("auth.signIn.password.placeholder")}
                name="password"
                value={values.password}
                onValueChange={(password) => setFieldValue("password", password)}
                onBlur={() => setFieldTouched("password", true)}
                isInvalid={!!(touched.password && errors.password)}
                errorMessage={touched.password ? errors.password : undefined}
                endContent={
                    <StarCiLink
                        as="button"
                        className="mr-1 flex items-center justify-center rounded-md p-1 text-foreground-500 outline-none transition-opacity hover:opacity-80"
                        aria-label={
                            showPassword ? t("auth.signIn.password.hide") : t("auth.signIn.password.show")
                        }
                        onClick={() => setShowPassword((s) => !s)}
                    >
                        {showPassword ? (
                            <EyeIcon className="h-4 w-4" />
                        ) : (
                            <EyeClosedIcon className="h-4 w-4" />
                        )}
                    </StarCiLink>
                }
            />
            <Spacer y={3} />
            <div className="flex justify-between">
                <div className="flex items-center gap-1.5">
                    <StarCiCheckbox
                        size="sm"
                        aria-label={t("auth.signIn.rememberMe")}
                        isSelected={values.rememberMe}
                        onValueChange={(rememberMe) => setFieldValue("rememberMe", rememberMe)}
                    />
                    <div className="text-xs text-foreground-500">
                        {t("auth.signIn.rememberMe")}
                    </div>
                </div>
                <StarCiLink className="text-xs">{t("auth.signIn.forgotPassword")}</StarCiLink>
            </div>
            <Spacer y={3} />
            <StarCiButton
                type="submit"
                color="primary"
                fullWidth
                isLoading={isSubmitting}
            >
                {t("auth.signIn.submit")}
            </StarCiButton>
            <Spacer y={3} />
            <div className="flex justify-center items-center gap-1">
                <div className="text-xs text-foreground-500">
                    {t("auth.signIn.noAccount")}
                </div>
                <StarCiLink
                    className="text-xs"
                    onPress={() =>
                        dispatch(
                            setAuthenticationModalTab(
                                AuthenticationModalTab.SignUp
                            )
                        )
                    }
                >
                    {t("auth.signIn.signUp")}
                </StarCiLink>
            </div>
        </StarCiModalBody>
    )
}
