"use client"

import React, { useEffect } from "react"
import { Card, CardContent, cn, Link } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { SignInSection } from "@/components/modals/AuthenticationModal/SignInSection"
import { SignUpSection } from "@/components/modals/AuthenticationModal/SignUpSection"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { AuthenticationModalTab, resetAuthenticationModalTab } from "@/redux/slices/tabs"
import { resetSignInState, resetSignUpState } from "@/redux/slices/state"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link LoginPage}. */
export type LoginPageProps = WithClassNames<undefined>

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
export const LoginPage = ({ className }: LoginPageProps) => {
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
        <div className={cn("mx-auto flex max-w-2xl flex-col gap-6 p-6 py-16", className)}>
            <Link
                href={pathConfig().locale(locale).home().build()}
                className="mx-auto font-semibold text-lg"
            >
                {t("nav.brand")}
            </Link>

            {redirectTarget && (
                <div className="text-center text-xs text-muted">
                    {authenticationModalTab === AuthenticationModalTab.SignUp
                        ? t("auth.signUp.desc")
                        : t("auth.signIn.desc")}
                </div>
            )}

            <Card>
                <CardContent>
                    {renderSection()}
                </CardContent>
            </Card>
        </div>
    )
}
