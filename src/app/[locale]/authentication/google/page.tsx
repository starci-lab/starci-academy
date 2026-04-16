"use client"

import React, { useEffect } from "react"
import { Spinner } from "@heroui/react"
import { Spacer } from "@/components/reuseable"

import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import { useLocale, useTranslations } from "next-intl"
import { sleep } from "@/modules/utils"
/**
 * OAuth redirect target after Google via Keycloak. Waits for adapter `init`, then sends the user home.
 */
const Page = () => {
    const router = useRouter()
    const locale = useLocale()
    const t = useTranslations()
    useEffect(() => {
        sleep(1000).then(
            () => {
                router.push(pathConfig().locale(locale).build())
            }
        )
    }, [locale, router])
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
                    {t("auth.oauth.authenticating")}
                </div>
            </div>
        </div>
    )
}

export default Page
