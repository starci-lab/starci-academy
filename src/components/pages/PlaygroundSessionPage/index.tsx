"use client"

import React, { useEffect } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import { usePlaygroundSessionContext } from "@/components/providers/PlaygroundSessionProvider"
import { PlaygroundCliSession } from "@/components/blocks/learn/PlaygroundCliSession"
import { PlaygroundRagSession } from "@/components/blocks/learn/PlaygroundRagSession"
import { Typography } from "@/components/atoms/text/Typography"
import { Stage } from "@/components/frames/Stage"

/**
 * `PlaygroundSessionPage` — the 20-step work surface. `slug === "rag"` swaps the
 * CLI Terminal/Resources workspace for the on-device RAG widget; both are blocks,
 * and choosing between them is this screen's one structural decision.
 *
 * GUARDED: a session with no paired machine is a dead surface — that is the whole
 * reason Setup is its own route — so an unpaired visit (a deep link, or a refresh
 * that minted a fresh session) is sent back to Setup. A machine that paired and
 * then DROPPED stays here (`everConnected`) and gets the reconnect strip instead.
 */
export const PlaygroundSessionPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    // Course from the URL, NOT the store — see the Setup screen for why.
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
            <Stage
                fill="viewport"
                identity={{ tier: "page", component: "PlaygroundSessionPage" }}
                canvas={() => <Typography size="sm" color="muted" text={t("common.loading")} />}
            />
        )
    }

    return isRag ? <PlaygroundRagSession /> : <PlaygroundCliSession />
}
