"use client"
import React, { useState } from "react"
import {
    Button,
    Checkbox,
    Input,
    Label,
    Link,
    Modal,
    Separator,
    TextField,
    FieldError,
    cn,
} from "@heroui/react"
import { GoogleIcon, GithubIcon } from "../../../svg"
import { useAppDispatch } from "@/redux"
import { EyeIcon, EyeClosedIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import {
    AuthenticationModalTab,
    setAuthenticationModalTab,
} from "@/redux/slices"
import { useSignInFormik } from "@/hooks/singleton"
import { useKeycloakZustand } from "@/hooks/zustand"
import { pathConfig } from "@/resources/path"
import { WithClassNames } from "@/modules/types"
import { 
    redirectToGoogleAuthentication, 
    redirectToGithubAuthentication 
} from "@/modules/keycloak"

/**
 * Props for SignInSection component
 */
export type SignInSectionProps = WithClassNames<{
    /**
     * Class name for the container
     */
    container?: string
}>

/**
 * SignInSection component
 */
export const SignInSection = ({ className, classNames }: SignInSectionProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const keycloak = useKeycloakZustand()
    const dispatch = useAppDispatch()
    const t = useTranslations()
    const authenticationPath = pathConfig().locale().authentication()
    const {
        values,
        errors,
        touched,
        submitForm,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
    } = useSignInFormik()
    const handleProviderSignIn = async (
        idpHint: string, 
        redirectPath: string
    ) => {
        await keycloak.init({
            onLoad: "check-sso",
            silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso.html`,
            responseMode: "query",
            pkceMethod: "S256",
            redirectUri: `${location.origin}/${redirectPath}`,
        })
        await keycloak?.login({
            idpHint,
            redirectUri: `${location.origin}/${redirectPath}`,
        })
    }
    return (
        <Modal.Body className={
            cn(
                "overflow-visible p-3", 
                className, 
                classNames?.container
            )
        }>
            <Button
                type="button"
                variant="outline"
                className="w-full text-sm"
                isDisabled={!keycloak}
                onPress={
                    async () => redirectToGoogleAuthentication()
                }
            >
                <span className="inline-flex items-center justify-center gap-2">
                    <GoogleIcon className="w-5 h-5" />
                    {t("auth.signIn.google")}
                </span>
            </Button>
            <div className="h-2" />
            <Button
                type="button"
                variant="outline"
                className="w-full text-sm"
                isDisabled={!keycloak}
                onPress={
                    async () => redirectToGithubAuthentication()
                }
            >
                <span className="inline-flex items-center justify-center gap-2">
                    <GithubIcon className="w-5 h-5" />
                    {t("auth.signIn.github")}
                </span>
            </Button>
            <div className="h-3" />
            <div className="flex items-center justify-center">
                <Separator className="flex-1"/>
                <div className="text-xs text-foreground-500">{t("auth.signIn.or")}</div>
                <Separator className="flex-1"/>
            </div>
            <div className="h-3" />
            <TextField
                isInvalid={!!(touched.email && errors.email)}
            >
                <Label htmlFor="sign-in-email" className="text-sm">
                    {t("auth.signIn.email.label")}
                </Label>
                <Input
                    id="sign-in-email"
                    required
                    variant="secondary"
                    type="email"
                    placeholder={t("auth.signIn.email.placeholder")}
                    name="email"
                    value={values.email}
                    onChange={(event) => setFieldValue(
                        "email", event.target.value
                    )}
                    onBlur={() => setFieldTouched("email", true)}
                />
                <FieldError>{errors.email}</FieldError>
            </TextField>
            <div className="h-3" />
            <TextField isInvalid={!!(touched.password && errors.password)}>
                <Label htmlFor="sign-in-password" className="text-sm">
                    {t("auth.signIn.password.label")}
                </Label>
                <div className="relative">
                    <Link
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-md p-1 text-foreground-500 outline-none transition-opacity hover:opacity-80"
                        onPress={() => setShowPassword((s) => !s)}
                    >
                        {showPassword ? <EyeIcon className="h-4 w-4" /> : <EyeClosedIcon className="h-4 w-4" />}
                    </Link>
                    <Input
                        id="sign-in-password"
                        required
                        variant="secondary"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth.signIn.password.placeholder")}
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
            <div className="flex justify-between">
                <div className="flex items-center gap-1.5">
                    <Checkbox
                        aria-label={t("auth.signIn.rememberMe")}
                        isSelected={values.rememberMe}
                        onChange={(isSelected) => setFieldValue("rememberMe", isSelected)}
                    />
                    <div className="text-xs text-foreground-500">
                        {t("auth.signIn.rememberMe")}
                    </div>
                </div>
                <Link className="text-xs cursor-pointer hover:opacity-80">{t("auth.signIn.forgotPassword")}</Link>
            </div>
            <div className="h-3" />
            <Button
                type="submit"
                variant="primary"
                fullWidth
                isPending={isSubmitting}
                onPress={() => {
                    submitForm()
                }}
            >
                {t("auth.signIn.submit")}
            </Button>
            <div className="h-3" />
            <div className="flex justify-center items-center gap-1">
                <div className="text-xs text-foreground-500">
                    {t("auth.signIn.noAccount")}
                </div>
                <Link
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
                </Link>
            </div>
        </Modal.Body>
    )
}
