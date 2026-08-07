"use client"

import React, { useEffect } from "react"
import { Card, CardContent, Link } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { SignInSection } from "@/components/overlays/modals/AuthenticationModal/SignInSection"
import { SignUpSection } from "@/components/overlays/modals/AuthenticationModal/SignUpSection"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { AuthenticationModalTab, resetAuthenticationModalTab } from "@/redux/slices/tabs"
import { resetSignInState, resetSignUpState } from "@/redux/slices/state"
import { pathConfig } from "@/resources/path"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"

/** Props for {@link LoginPage}. */
export type LoginPageProps = Record<string, never>
/**
 * `/login` — the auth-guard redirect target for protected routes (`src/proxy.ts`),
 * and a directly-navigable sign-in/sign-up page. Reuses the SAME sign-in/sign-up
 * step components as {@link AuthenticationModal} (Credentials/OTP, Registration/Otp) —
 * only the chrome differs (no close button, a page shell instead of a dialog).
 *
 * On successful auth, resumes at `?redirect=<path>` (set by the edge guard) or the
 * dashboard by default.
 *
 * @param props - {@link LoginPageProps}
 */
export const LoginPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams()

    const authenticationModalTab = useAppSelector((state) => state.tabs.authenticationModalTab)
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)

    const rawRedirect = searchParams.get("redirect")
    // Only ever resume to an internal path — never let a query param send the visitor off-site.
    const redirectTarget = rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
        ? rawRedirect
        : undefined

    // Always land on Sign-in + a clean step, regardless of whatever the modal was left at elsewhere.
    useEffect(() => {
        dispatch(resetAuthenticationModalTab())
        dispatch(resetSignInState())
        dispatch(resetSignUpState())
    }, [dispatch])

    // Credentials/OTP success flips `keycloak.authenticated` in place (no navigation of its
    // own, since the modal variant just closes) — this page resumes the originally-requested
    // route once that happens. The OAuth round-trip resumes separately via `OauthRedirect`.
    useEffect(() => {
        if (!authenticated) {
            return
        }
        router.replace(redirectTarget ?? pathConfig().locale(locale).dashboard().build())
    }, [authenticated, redirectTarget, router, locale])

    const renderSection = () => {
        switch (authenticationModalTab) {
        case AuthenticationModalTab.SignIn:
            return <SignInSection hideCloseButton />
        case AuthenticationModalTab.SignUp:
            return <SignUpSection hideCloseButton />
        }
    }

    return (
        <Box principle="center-measure"
            explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport."
            className={"mx-auto max-w-2xl p-6 py-16"}>
            <StackV gap={6} principle="block-boundary"
                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                items={[
                    () => (
                        <StackH gap={1} principle="name-handle"
                            explain="Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle."
                            justify="center" items={[
                                () => (
                                    <Link
                                        href={pathConfig().locale(locale).home().build()}
                                        className="font-semibold text-lg"
                                    >
                                        {t("nav.brand")}
                                    </Link>
                                ),
                            ]} />
                    ),
                    () => (redirectTarget ? (
                        <div className="text-center text-xs text-muted">
                            {authenticationModalTab === AuthenticationModalTab.SignUp
                                ? t("auth.signUp.desc")
                                : t("auth.signIn.desc")}
                        </div>
                    ) : null),
                    () => (
                        <Card>
                            <CardContent>
                                {renderSection()}
                            </CardContent>
                        </Card>
                    ),
                ]} />
        </Box>
    )
}
