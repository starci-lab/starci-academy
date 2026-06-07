"use client"

import {
    KeycloakIdentityProvider,
} from "@/modules/api"
import {
    setAccessToken,
    setAuthenticated,
} from "@/redux/slices"
import { useAppDispatch } from "@/redux"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useLayoutEffect, useRef } from "react"
import { useMutateExchangeCodeForTokenSwr } from "../swr"
import {
    LocalStorage,
    LocalStorageAccessToken,
    LocalStorageId,
    SessionStorage,
    SessionStorageId,
    SessionStorageOauthIdpHint,
} from "@/modules/storage"

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
 * Resolves the provider from the session storage.
 * @returns The provider from the session storage.
 */ 
const resolveProvider = (): KeycloakIdentityProvider => {
    const oauthIdpHint = SessionStorage.getItem<SessionStorageOauthIdpHint>(
        SessionStorageId.OauthIdpHint
    )
    return oauthIdpHint?.provider ?? KeycloakIdentityProvider.Google
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
    /** Processed code — idempotent guard BY VALUE (not a one-shot boolean flag). */
    const processedCodeRef = useRef<string | null>(null)
    useLayoutEffect(() => {
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        if (!code || !state) {
            return
        }
        /**
         * Each `code` is exchanged exactly once: survives StrictMode (double mount) and STILL reruns
         * if a new `?code=` appears after the first render (a hard boolean flag would miss this).
         */
        if (processedCodeRef.current === code) {
            return
        }
        processedCodeRef.current = code
        const handleEffect = async () => {
            const cleanUrl = stripOauthSearchParams(pathname, searchParams)
            const provider = resolveProvider()
            try {
                const result = await swr.trigger(
                    {
                        request: {
                            code,
                            provider,
                            state,
                        },
                        
                    }
                )
                const envelope = result.data?.exchangeCodeForToken
                const data = envelope?.data
                if (!envelope?.success || !data) {
                    throw new Error(
                        envelope?.error ?? envelope?.message ?? "exchangeCodeForToken failed"
                    )
                }
                LocalStorage.setItem<LocalStorageAccessToken>(
                    LocalStorageId.KeycloakAccessToken,
                    data.accessToken
                )
                dispatch(setAccessToken(data.accessToken))
                dispatch(setAuthenticated(true))
            } finally {
                SessionStorage.removeItem(SessionStorageId.OauthIdpHint)
                router.replace(cleanUrl, { scroll: false })
            }
        }
        handleEffect()
    }, [
        dispatch, 
        pathname, 
        router, 
        searchParams
    ]
    )
}
