"use client"

import React, { useCallback, useEffect } from "react"
import { cn, Spinner } from "@heroui/react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types/base/class-name"

import { OauthAction } from "./enums"
import { OAUTH_ACTION_MESSAGE_KEY_MAP } from "./map"
import { Spacer } from "@/components/blocks/layout/Spacer"
import { sleep } from "@/modules/utils/misc"
import { SessionStorage } from "@/modules/storage/session/storage"
import { SessionStorageId } from "@/modules/storage/session/enums/id"
import { type SessionStoragePostLoginRedirect } from "@/modules/storage/session/types/post-login-redirect"

export * from "./enums"

/** Props for {@link OauthRedirect}. */
export interface OauthRedirectProps extends WithClassNames<undefined> {
    /**
     * The OAuth lifecycle step this redirect page represents — selects the i18n
     * message shown under the spinner. The redirect destination (locale home)
     * and delay are identical for every step.
     */
    action: OauthAction
}

/**
 * OAuth redirect landing — shown after a Keycloak provider hand-off
 * (login / logout / generic authenticate). Waits ~1s, then sends the user to
 * the locale home. Presentational shell + the redirect effect.
 *
 * `"use client"`: relies on `useRouter`, `useEffect` and `useLocale`.
 */
export const OauthRedirect = ({ action, className }: OauthRedirectProps) => {
    const router = useRouter()
    const locale = useLocale()
    const t = useTranslations()

    // Hold the user briefly so the Keycloak session settles, then continue on: a sign-in
    // started from the `/login` guard stashed where the visitor was headed (query params
    // don't survive the IdP round-trip); anything else (logout, generic authenticate) goes home.
    const onRedirect = useCallback(() => {
        sleep(1000).then(
            () => {
                let target: string | undefined
                if (action === OauthAction.Login) {
                    const stashed = SessionStorage.getItem<SessionStoragePostLoginRedirect>(
                        SessionStorageId.PostLoginRedirect,
                    )
                    target = stashed?.target
                    SessionStorage.removeItem(SessionStorageId.PostLoginRedirect)
                }
                router.push(target ?? pathConfig().locale(locale).build())
            }
        )
    }, [action, locale, router])

    useEffect(() => {
        onRedirect()
    }, [onRedirect])

    return (
        <div className={cn("flex min-h-[60vh] flex-col items-center justify-center", className)}>
            <div
                className="flex flex-col items-center gap-2"
            >
                <Spinner
                    color="accent"
                    size="lg"
                />
                <Spacer y={3} />
                <div
                    className="text-sm"
                >
                    {t(OAUTH_ACTION_MESSAGE_KEY_MAP[action])}
                </div>
            </div>
        </div>
    )
}
