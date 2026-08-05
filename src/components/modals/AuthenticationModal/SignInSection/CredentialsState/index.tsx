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
    Modal,
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
import { Turnstile } from "@/components/features/auth/Turnstile"
import { publicEnv } from "@/resources/env/public"
import { Typography } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"
import { Divider } from "@/components/atoms/display/Divider"
import { StackV } from "@/components/frames/Stack"
import { Box } from "@/components/frames/Box"

/** Props for {@link CredentialsState}. */
export interface CredentialsStateProps {
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

    const onChangePassword = useCallback(
        (value: string) => {
            setFieldValue("password", value)
        },
        [
            setFieldValue,
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

    const bodyItems = [
        () => (
            <StackV
                gap={4}
                items={[
                    () => <OauthButtons items={oauthButtons} onOauthPress={onOauthPress} />,
                    () => <Divider label={t("auth.signIn.or")} />,
                ]}
            />
        ),
        () => (
            <StackV
                gap={4}
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
                            value={values.password}
                            error={errors.password}
                            touched={touched.password}
                            onChangeValue={onChangePassword}
                        />
                    ),
                    () => (
                        <RememberMeRow
                            isSelected={values.rememberMe}
                            onChangeSelected={onChangeRememberMe}
                        />
                    ),
                ]}
            />
        ),
        ...(publicEnv().captcha.enabled ? [() => (
            <Turnstile
                onVerify={(token: string) => setFieldValue("captchaToken", token)}
                onExpire={() => setFieldValue("captchaToken", undefined)}
                onError={() => setFieldValue("captchaToken", undefined)}
            />
        )] : []),
        () => (
            <Button
                variant="primary"
                classNames={["w-full"]}
                isPending={isSubmitting}
                isDisabled={isSubmitDisabled}
                label={t("auth.signIn.submit")}
                onPress={onSubmit}
            />
        ),
        () => <SignUpPrompt onSwitchToSignUp={onSwitchToSignUp} />,
    ]

    return (
        <>
            {!hideCloseButton && <Modal.CloseTrigger />}
            <Modal.Header>
                <Box className="pr-8">
                    <StackV
                        gap={2}
                        principles={["title-subtitle"]}
                        items={[
                            () => <Typography weight="semibold" align="center" text={t("auth.signIn.title")} />,
                            () => <Typography size="xs" color="muted" align="center" text={t("auth.signIn.desc")} />,
                        ]}
                    />
                </Box>
            </Modal.Header>
            <Modal.Body>
                <StackV gap={6} items={bodyItems} />
            </Modal.Body>
        </>
    )
}
