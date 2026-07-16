"use client"

/**
 * **Sign-in step 1** — OAuth shortcuts, email/password, link to sign-up tab.
 *
 * Container: owns the sign-in formik (singleton `useSignInForm()`), the
 * router/dispatch wiring, and the OAuth redirect action; renders presentational
 * children inside the modal chrome (`Modal.CloseTrigger`, `Header`, `Body`).
 *
 * @see {@link SignInSection} for Redux step routing and folder conventions.
 */
import React, {
    useCallback,
    useMemo,
} from "react"
import {
    Button,
    Modal,
    Separator,
    Spinner,
    Typography,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { OAUTH_BUTTON_ITEMS } from "./map"
import { OauthButtons } from "./OauthButtons"
import { EmailField } from "./EmailField"
import { PasswordField } from "./PasswordField"
import { RememberMeRow } from "./RememberMeRow"
import { SignUpPrompt } from "./SignUpPrompt"
import { useAppDispatch } from "@/redux/hooks"
import { AuthenticationModalTab, setAuthenticationModalTab } from "@/redux/slices/tabs"
import { useSignInForm } from "@/hooks/zustand/signIn/useSignInForm"
import { KeycloakIdentityProvider } from "@/modules/api/graphql/mutations/types/exchange-code-for-token"
import { keycloakRedirect } from "@/modules/api/redirect/keycloak"
import { SessionStorage } from "@/modules/storage/session/storage"
import { SessionStorageId } from "@/modules/storage/session/enums/id"
import { type SessionStorageOauthIdpHint } from "@/modules/storage/session/types/oauth-idp-hint"
import { type SessionStoragePostLoginRedirect } from "@/modules/storage/session/types/post-login-redirect"
import { useSearchParams } from "next/navigation"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { Turnstile } from "@/components/features/auth/Turnstile"
import { publicEnv } from "@/resources/env/public"

/** Props for {@link CredentialsState}. */
export interface CredentialsStateProps extends WithClassNames<undefined> {
    /** Hides `Modal.CloseTrigger` when hosted outside a dismissible modal (the `/login` page). */
    hideCloseButton?: boolean
}

/**
 * Credentials step container for the sign-in tab.
 */
export const CredentialsState = ({ hideCloseButton }: CredentialsStateProps = {}) => {
    const t = useTranslations()
    const searchParams = useSearchParams()
    const {
        values,
        errors,
        touched,
        submitForm,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
    } = useSignInForm()

    const router = useRouter()
    const dispatch = useAppDispatch()

    /** Stable reference to the static OAuth button catalog. */
    const oauthButtons = useMemo(
        () => OAUTH_BUTTON_ITEMS,
        [],
    )

    /** Start the Keycloak OAuth redirect for the chosen provider. */
    const onOauthPress = useCallback(
        (provider: KeycloakIdentityProvider) => {
            // remember which IdP was used so the callback can resume the flow
            SessionStorage.setItem<SessionStorageOauthIdpHint>(
                SessionStorageId.OauthIdpHint,
                { provider },
            )
            // carry the originally-requested protected route (set by the edge guard as
            // `?redirect=`) through the Keycloak round-trip, since query params on THIS
            // page don't survive the IdP hop.
            const redirectTarget = searchParams.get("redirect")
            if (redirectTarget) {
                SessionStorage.setItem<SessionStoragePostLoginRedirect>(
                    SessionStorageId.PostLoginRedirect,
                    { target: redirectTarget },
                )
            }
            const url = provider === KeycloakIdentityProvider.Google
                ? keycloakRedirect.google
                : keycloakRedirect.github
            url.searchParams.set("redirect_uri", window.location.href)
            router.push(url.toString())
        },
        [
            router,
            searchParams,
        ],
    )

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

    const onChangeRememberMe = useCallback(
        (selected: boolean) => {
            // third arg true: run validation so dependent errors clear
            setFieldValue("rememberMe", selected, true)
            setFieldTouched("rememberMe", true, false)
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

    const onSwitchToSignUp = useCallback(
        () => {
            dispatch(setAuthenticationModalTab(AuthenticationModalTab.SignUp))
        },
        [
            dispatch,
        ],
    )

    const isSubmitDisabled = publicEnv().captcha.enabled && !values.captchaToken

    return (
        <>
            {!hideCloseButton && <Modal.CloseTrigger />}
            <Modal.Header>
                <Typography type="body" weight="semibold" className="pr-8 text-center">
                    {t("auth.signIn.title")}
                </Typography>
                <Typography type="body-xs" color="muted" className="text-center">
                    {t("auth.signIn.desc")}
                </Typography>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                    <OauthButtons
                        items={oauthButtons}
                        onOauthPress={onOauthPress}
                    />

                    <div className="flex items-center justify-center gap-3">
                        <Separator className="flex-1" />
                        <Typography type="body-xs" color="muted">{t("auth.signIn.or")}</Typography>
                        <Separator className="flex-1" />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <EmailField
                        value={values.email}
                        error={errors.email}
                        touched={touched.email}
                        onChangeValue={onChangeEmail}
                        onBlurField={onBlurEmail}
                    />

                    <PasswordField
                        value={values.password}
                        error={errors.password}
                        touched={touched.password}
                        onChangeValue={onChangePassword}
                        onBlurField={onBlurPassword}
                    />

                    <RememberMeRow
                        isSelected={values.rememberMe}
                        onChangeSelected={onChangeRememberMe}
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
                    isPending={isSubmitting}
                    isDisabled={isSubmitDisabled}
                    onPress={onSubmit}
                >
                    {({ isPending }) => (
                        <>
                            {isPending ? <Spinner color="current" size="sm" /> : null}
                            {t("auth.signIn.submit")}
                        </>
                    )}
                </Button>

                <SignUpPrompt onSwitchToSignUp={onSwitchToSignUp} />
            </Modal.Body>
        </>
    )
}
