"use client"

import React from "react"
import { Button } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { ErrorPageState } from "@/components/blocks/feedback/ErrorPageState"
import { pathConfig } from "@/resources/path"

/**
 * Localized 404 page — rendered for any unmatched route under `[locale]` and for
 * `notFound()` calls that don't hit a nearer boundary. A generic route-not-found
 * (distinct from the profile's own user-not-found state), with a single way back
 * home so it's never a dead end.
 */
export default function NotFound() {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()

    return (
        <ErrorPageState
            code="404"
            title={t("errorPage.notFoundTitle")}
            description={t("errorPage.notFoundDescription")}
            actions={(
                <Button
                    variant="primary"
                    onPress={() => router.push(pathConfig().locale(locale).build())}
                >
                    {t("nav.home")}
                </Button>
            )}
        />
    )
}
