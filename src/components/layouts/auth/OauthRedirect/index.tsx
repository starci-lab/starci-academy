"use client"

import React, { useCallback, useEffect } from "react"
import { Spinner } from "@heroui/react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"

import { Spacer } from "@/components/reuseable"
import { pathConfig } from "@/resources/path"
import { sleep } from "@/modules/utils"

import type { OauthAction } from "./enums"
import { OAUTH_ACTION_MESSAGE_KEY_MAP } from "./map"

export * from "./enums"

/** Props for {@link OauthRedirect}. */
export interface OauthRedirectProps {
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
export const OauthRedirect = ({ action }: OauthRedirectProps) => {
    const router = useRouter()
    const locale = useLocale()
    const t = useTranslations()

    // Hold the user briefly so the Keycloak session settles, then go home.
    const onRedirect = useCallback(() => {
        sleep(1000).then(
            () => {
                router.push(pathConfig().locale(locale).build())
            }
        )
    }, [locale, router])

    useEffect(() => {
        onRedirect()
    }, [onRedirect])

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
            <div
                className="flex flex-col items-center gap-1"
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
