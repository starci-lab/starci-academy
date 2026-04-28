"use client"

import React, { useMemo, useState } from "react"
import {
    Button,
    Checkbox,
    FieldError,
    Input,
    Label,
    Link,
    Separator,
    TextField,
} from "@heroui/react"
import { 
    EyeClosedIcon, 
    EyeIcon 
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAppDispatch } from "@/redux"
import { AuthenticationModalTab, setAuthenticationModalTab } from "@/redux/slices"
import { useSignInFormik } from "@/hooks/singleton"
import { GoogleIcon, GithubIcon } from "../../../../svg"
import { useRouter } from "next/navigation"
import { KeycloakIdentityProvider, keycloakRedirect } from "@/modules/api"
import {
    SessionStorage,
    SessionStorageId,
    SessionStorageOauthIdpHint,
} from "@/modules/storage"
import { WithClassNames } from "@/modules/types"

export type CredentialsStateProps = WithClassNames<undefined>

interface OauthButtonItem {
    /** OAuth identity provider. */
    provider: KeycloakIdentityProvider
    /** Icon component for the provider button. */
    icon: React.ComponentType<WithClassNames<undefined>>
    /** Translation key for the button label. */
    labelKey: string
}

/**
 * CredentialsState component.
 *
 * @param props Props for CredentialsState component.
 */
export const CredentialsState = () => {
    const t = useTranslations()
    const {
        values,
        errors,
        touched,
        submitForm,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
    } = useSignInFormik()

    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const dispatch = useAppDispatch()

    const oauthButtons = useMemo<Array<OauthButtonItem>>(
        () => [
            {
                provider: KeycloakIdentityProvider.Google,
                icon: GoogleIcon,
                labelKey: "auth.signIn.google",
            },
            {
                provider: KeycloakIdentityProvider.Github,
                icon: GithubIcon,
                labelKey: "auth.signIn.github",
            },
        ],
        []
    )

    const onOauthPress = (provider: KeycloakIdentityProvider) => {
        SessionStorage.setItem<SessionStorageOauthIdpHint>(
            SessionStorageId.OauthIdpHint,
            { provider }
        )
        const url = provider === KeycloakIdentityProvider.Google
            ? keycloakRedirect.google
            : keycloakRedirect.github
        url.searchParams.set("redirect_uri", window.location.href)
        router.push(url.toString())
    }

    return (
        <>
            {oauthButtons.map((item, idx) => (
                <React.Fragment key={item.provider}>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full text-sm"
                        onPress={() => onOauthPress(item.provider)}
                    >
                        <span className="inline-flex items-center justify-center gap-2">
                            <item.icon className="w-5 h-5" />
                            {t(item.labelKey)}
                        </span>
                    </Button>
                    {idx === 0 && <div className="h-2" />}
                </React.Fragment>
            ))}

            <div className="h-3" />
            <div className="flex items-center justify-center">
                <Separator className="flex-1" />
                <div className="text-xs text-foreground-500">{t("auth.signIn.or")}</div>
                <Separator className="flex-1" />
            </div>

            <div className="h-3" />
            <TextField isInvalid={!!(touched.email && errors.email)}>
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
                    onChange={(event) => setFieldValue("email", event.target.value)}
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
                        {showPassword ? (
                            <EyeIcon className="h-4 w-4" />
                        ) : (
                            <EyeClosedIcon className="h-4 w-4" />
                        )}
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
                <Link className="text-xs cursor-pointer hover:opacity-80">
                    {t("auth.signIn.forgotPassword")}
                </Link>
            </div>

            <div className="h-3" />
            <Button
                type="submit"
                variant="primary"
                fullWidth
                isPending={isSubmitting}
                onPress={() => submitForm()}
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
                        dispatch(setAuthenticationModalTab(AuthenticationModalTab.SignUp))
                    }
                >
                    {t("auth.signIn.signUp")}
                </Link>
            </div>
        </>
    )
}

