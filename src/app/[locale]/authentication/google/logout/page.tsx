"use client"

import React, { useEffect } from "react"
import { StarCiSpinner } from "@/components/atomic"
import { Spacer } from "@/components/reuseable"

import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import { useLocale } from "next-intl"
import { sleep } from "@/modules/utils"
/**
 * OAuth redirect target after Google via Keycloak. Waits for adapter `init`, then sends the user home.
 */
const Page = () => {
    const router = useRouter()
    const locale = useLocale()
    useEffect(() => {
        sleep(1000).then(
            () => {
                router.push(pathConfig().locale(locale).build())
            }
        )
    }, [])
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
            <div
                className="flex flex-col items-center gap-1"
            >
                <StarCiSpinner 
                    size="lg" 
                    color="accent" 
                />
                <Spacer y={3} />
                <div
                    className="text-sm"
                >
                    Signing you out...
                </div>
            </div>
        </div>
    )
}

export default Page