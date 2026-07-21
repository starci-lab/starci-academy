"use client"

import React, { useEffect } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { Typography } from "@heroui/react"
import { PlaygroundSession } from "@/components/features/learn/Playground/PlaygroundSession"
import { PlaygroundRagSession } from "@/components/features/learn/Playground/PlaygroundRagSession"
import { usePlaygroundSessionContext } from "@/components/features/learn/Playground/PlaygroundSessionProvider"
import { pathConfig } from "@/resources/path"

/**
 * Learn / playground / [slug] / session — the 20-step work surface. `slug ===
 * "rag"` swaps the CLI Terminal/Resources workspace for the on-device RAG widget.
 *
 * GUARDED: a session with no paired machine is a dead surface (the whole reason
 * Setup is its own route), so an unpaired visit — a deep link, or a refresh that
 * minted a fresh session — is sent back to Setup. A machine that paired and then
 * DROPPED stays here (`everConnected`) and shows the reconnect strip instead.
 */
const Page = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    // Course from the URL, NOT the store — see the Setup route for why.
    const params = useParams()
    const courseDisplayId = String(params.courseId ?? "")
    const { slug, isRag, playground, isLoading, byomState, everConnected } = usePlaygroundSessionContext()

    const setupPath = pathConfig().locale(locale).course(courseDisplayId).learn().playground(slug).build()

    useEffect(() => {
        if (isLoading || !playground) {
            return
        }
        if (!byomState.connected && !everConnected) {
            router.replace(setupPath)
        }
    }, [isLoading, playground, byomState.connected, everConnected, router, setupPath])

    if (isLoading || !playground) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Typography type="body-sm" color="muted">{t("common.loading")}</Typography>
            </div>
        )
    }

    return isRag ? <PlaygroundRagSession /> : <PlaygroundSession />
}

export default Page
