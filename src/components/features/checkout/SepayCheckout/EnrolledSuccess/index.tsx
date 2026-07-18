"use client"

import { CheckCircleIcon as CheckCircle } from "@phosphor-icons/react"
import React from "react"
import {
    Card,
    Spinner,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import { IconTile } from "@/components/blocks/identity/IconTile"

/**
 * Success state shown once enrollment is confirmed, just before redirecting to
 * the course page.
 *
 * Presentational (render-only); `"use client"` for the i18n UI hook + the
 * animated HeroUI spinner. The redirect timer itself lives in the container.
 */
export const EnrolledSuccess = () => {
    const t = useTranslations()
    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md bg-default/40 p-8 text-center backdrop-blur-md">
                <Card.Content>
                    <div className="mb-6 flex justify-center">
                        <IconTile icon={<CheckCircle aria-hidden focusable="false" />} tone="success" size="lg" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold">{t("payment.sepay.success")}</h1>
                    <p className="mb-6 text-muted">{t("payment.sepay.redirecting")}</p>
                    <Spinner color="success" size="lg" />
                </Card.Content>
            </Card>
        </div>
    )
}
