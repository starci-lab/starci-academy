"use client"

import React, { useEffect } from "react"
import { Button } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { ErrorPageState } from "@/components/blocks/feedback/ErrorPageState"
import { pathConfig } from "@/resources/path"

/**
 * Localized 500 / error boundary for the `[locale]` segment — Next renders this
 * (a MANDATORY client component) when a page throws during render. Offers a
 * `reset()` retry (re-render the failed segment) plus a way back home, so a
 * runtime error never leaves a blank screen.
 *
 * @param props.error - The thrown error (with an optional `digest` for server logs).
 * @param props.reset - Re-attempts rendering the errored segment.
 */
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()

    // surface the error for diagnostics (Next only passes a `digest` to the client).
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <ErrorPageState
            code="500"
            title={t("errorPage.errorTitle")}
            description={t("errorPage.errorDescription")}
            actions={(
                <>
                    <Button variant="primary" onPress={() => reset()}>
                        {t("common.retry")}
                    </Button>
                    <Button
                        variant="tertiary"
                        onPress={() => router.push(pathConfig().locale(locale).build())}
                    >
                        {t("nav.home")}
                    </Button>
                </>
            )}
        />
    )
}
