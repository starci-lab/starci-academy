"use client"

import {
    KeycloakIdentityProvider,
} from "@/modules/api"
import {
    setAccessToken,
    setAuthenticated,
    setInitialized,
} from "@/redux/slices"
import { useAppDispatch } from "@/redux"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { useMutateExchangeCodeForTokenSwr } from "../singleton"

/** localStorage key for the Keycloak access token (see `useExchangeCodeForToken`). */
const ACCESS_TOKEN_STORAGE_KEY = "starci.keycloak.accessToken"
const OAUTH_QUERY_KEYS = ["code", "state", "session_state", "iss"] as const

/**
 * Clears OIDC callback query params from the current URL (e.g. after code exchange).
 */
const stripOauthSearchParams = (
    pathname: string,
    searchParams: URLSearchParams
) => {
    const next = new URLSearchParams(searchParams.toString())
    for (const key of OAUTH_QUERY_KEYS) {
        next.delete(key)
    }
    const q = next.toString()
    return q ? `${pathname}?${q}` : pathname
}

/**
 * Persists refresh token via HttpOnly cookie (see `src/app/api/auth/refresh-cookie/route.ts`).
 */
const postRefreshTokenCookie = async (refreshToken: string) => {
    const res = await fetch(
        `${typeof window !== "undefined" ? window.location.origin : ""}/api/auth/refresh-cookie`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ refreshToken }),
        }
    )
    if (!res.ok) {
        throw new Error("Failed to set refresh token cookie")
    }
}

const clearOAuthSessionMarkers = () => {
    if (typeof window === "undefined") {
        return
    }
    sessionStorage.removeItem("pkce_verifier")
    sessionStorage.removeItem("auth_state")
    sessionStorage.removeItem("oauth_idp_hint")
}

const resolveProvider = (): KeycloakIdentityProvider => {
    const hint = sessionStorage.getItem("oauth_idp_hint")
    return hint === "github"
        ? KeycloakIdentityProvider.Github
        : KeycloakIdentityProvider.Google
}

/**
 * Global effect: when Keycloak redirects back with `?code=&state=` (and optional `session_state`, `iss`),
 * validates `state` against `sessionStorage.auth_state`, exchanges the code via GraphQL `exchangeCodeForToken`,
 * stores the access token (Redux + localStorage), sets the refresh token HttpOnly cookie, then removes OAuth
 * query params from the URL.
 *
 * Expects `oauth_idp_hint` in session storage (set by {@link redirectToGoogleAuthentication} /
 * {@link redirectToGithubAuthentication}).
 */
export const useExchangeCodeForToken = () => {
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const swr = useMutateExchangeCodeForTokenSwr()
    const ranForQuery = useRef<string | null>(null)

    const querySignature = searchParams.toString()

    useEffect(() => {
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        if (!code || !state) {
            return
        }
        if (ranForQuery.current === querySignature) {
            return
        }
        ranForQuery.current = querySignature
        const controller = new AbortController()

        const run = async () => {
            const cleanUrl = stripOauthSearchParams(pathname, searchParams)
            const expectedState = sessionStorage.getItem("auth_state")
            if (expectedState !== state) {
                clearOAuthSessionMarkers()
                dispatch(setAuthenticated(false))
                dispatch(setAccessToken(undefined))
                dispatch(setInitialized(true))
                router.replace(cleanUrl, { scroll: false })
                return
            }

            const provider = resolveProvider()

            try {
                const result = await swr.trigger({
                    request: {
                        code,
                        provider,
                        redirectUri: sessionStorage.getItem("oauth_redirect_uri") ?? "",
                        codeVerifier: sessionStorage.getItem("pkce_verifier") ?? "",
                    },
                })
                const envelope = result.data?.exchangeCodeForToken
                const tokenData = envelope?.data
                if (!envelope?.success || !tokenData) {
                    throw new Error(
                        envelope?.error ?? envelope?.message ?? "exchangeCodeForToken failed"
                    )
                }

                localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, tokenData.accessToken)
                dispatch(setAccessToken(tokenData.accessToken))
                dispatch(setAuthenticated(true))

                await postRefreshTokenCookie(tokenData.refreshToken)
            } catch {
                dispatch(setAuthenticated(false))
                dispatch(setAccessToken(undefined))
                localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
            } finally {
                clearOAuthSessionMarkers()
                dispatch(setInitialized(true))
                router.replace(cleanUrl, { scroll: false })
            }
        }

        void run()
        return () => {
            controller.abort()
        }
    }, [dispatch, pathname, querySignature, router, searchParams])
}
