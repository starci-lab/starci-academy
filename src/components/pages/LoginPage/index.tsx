"use client"

import React, { useEffect } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { _LoginPage } from "./component"
import { AuthenticationPanel } from "@/components/blocks/auth/AuthenticationPanel"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { AuthenticationModalTab, resetAuthenticationModalTab } from "@/redux/slices/tabs"
import { resetSignInState, resetSignUpState } from "@/redux/slices/state"
import { pathConfig } from "@/resources/path"

/**
 * `/login` — the auth-guard redirect target for protected routes (`src/proxy.ts`),
 * and a directly-navigable sign-in/sign-up page. Mounts the SAME
 * {@link AuthenticationPanel} body as {@link AuthenticationModal}; only the
 * chrome differs (page card vs `ModalShell`).
 *
 * On successful auth, resumes at `?redirect=<path>` (set by the edge guard) or the
 * dashboard by default.
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

    const redirectHint = redirectTarget
        ? (authenticationModalTab === AuthenticationModalTab.SignUp
            ? t("auth.signUp.desc")
            : t("auth.signIn.desc"))
        : undefined

    return (
        <_LoginPage
            brandHref={pathConfig().locale(locale).home().build()}
            brandLabel={t("nav.brand")}
            redirectHint={redirectHint}
            body={AuthenticationPanel}
        />
    )
}
