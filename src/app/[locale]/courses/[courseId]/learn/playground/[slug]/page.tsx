"use client"

import React, { useCallback } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { Typography } from "@heroui/react"
import { TerminalWindowIcon } from "@phosphor-icons/react"
import { ErrorContent } from "@/components/blocks/async/ErrorContent"
import { EmptyContent } from "@/components/blocks/async/EmptyContent"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { PlaygroundPrepare } from "@/components/features/learn/Playground/PlaygroundPrepare"
import { usePlaygroundSessionContext } from "@/components/features/learn/Playground/PlaygroundSessionProvider"
import type { GuideLab } from "@/components/features/learn/Playground/PlaygroundSessionProvider"
import { pathConfig } from "@/resources/path"

/**
 * Intro copy per playground. Docker and K8s share the `infra` setup flavor but
 * NOT this line — one shared string left the Kubernetes page promising Docker
 * containers.
 */
const INTRO_KEY_BY_LAB: Record<GuideLab, string> = {
    docker: "playground.prepare.introDocker",
    k8s: "playground.prepare.introK8s",
    rag: "playground.prepare.introRag",
}

/**
 * Learn / playground / [slug] — the SETUP surface: install the engine (Docker /
 * kind+kubectl / Ollama) then pair the local agent, with a live readiness panel
 * gating the "Bắt đầu lab" CTA.
 *
 * This stays the exercise's ENTRY url (so the hub cards and every existing link
 * keep working); the 20-step work surface lives at `[slug]/session`. The socket +
 * session are owned by `layout.tsx`, so moving between the two routes keeps the
 * pairing the learner already ran `npx` for.
 */
const Page = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    // Course from the URL, NOT the store — playgrounds are shared by every course,
    // so a stale `state.course.displayId` navigates the learner out of theirs.
    const params = useParams()
    const courseDisplayId = String(params.courseId ?? "")
    const {
        slug,
        playground,
        isLoading,
        error,
        refetchPlayground,
        prepareFlavor,
        guideLab,
        osGuides,
        engineName,
        pairCommand,
        byomState,
        readinessItems,
        allReady,
        requestVerify,
        pairingCodeSecondsLeft,
        pairingCodeExpired,
        refreshPairingCode,
        isRefreshingPairingCode,
    } = usePlaygroundSessionContext()

    const learnPath = pathConfig().locale(locale).course(courseDisplayId).learn()
    const sessionPath = learnPath.playground(slug).session().build()
    const hubPath = learnPath.playground().build()

    const onEnter = useCallback(() => {
        router.push(sessionPath)
    }, [router, sessionPath])

    // NO auto-enter on pair. A previous version pushed the learner straight into
    // the Lab the moment `byomState.connected` flipped, which was wrong twice
    // over: it gated on the AGENT being connected while the CTA right above gates
    // on `allReady`, so it walked past the readiness check it was supposed to
    // enforce (into the Lab with the engine still down); and `router.replace`
    // wiped history, so Back couldn't return to Setup to inspect state. Setup is
    // a gate the learner reads — entering is their call, via the CTA.

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Typography type="body-sm" color="muted">{t("common.loading")}</Typography>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-6">
                <ErrorContent
                    title={t("playground.session.loadErrorTitle")}
                    description={t("playground.session.loadErrorDescription")}
                    onRetry={refetchPlayground}
                    retryLabel={t("common.retry")}
                />
            </div>
        )
    }

    if (!playground) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-6">
                <EmptyContent
                    icon={<TerminalWindowIcon aria-hidden focusable="false" className="size-8 text-muted" />}
                    title={t("playground.session.notFoundTitle")}
                    description={t("playground.session.notFoundDescription")}
                    onRetry={() => router.push(hubPath)}
                    retryLabel={t("common.retry")}
                />
            </div>
        )
    }

    const device = byomState.deviceInfo

    return (
        // Reading column + gap-10 header→content, the same shape the Flashcards hub
        // uses. No Setup/Lab tab strip: this IS the hub — you enter the lab through
        // the CTA and come back via the header's back-link.
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
            <PageHeader
                breadcrumb={<BackLink label={t("playground.session.backToHub")} onPress={() => router.push(hubPath)} />}
                title={t("playground.session.pageTitle", { name: playground.title })}
                description={t(INTRO_KEY_BY_LAB[guideLab])}
            />
            <div className="flex flex-col gap-6">
                <PlaygroundPrepare
                    flavor={prepareFlavor}
                    engineName={engineName}
                    envReport={byomState.envReport}
                    osGuides={osGuides}
                    pairCommand={pairCommand}
                    pairingCodeSecondsLeft={pairingCodeSecondsLeft}
                    pairingCodeExpired={pairingCodeExpired}
                    onRefreshPairingCode={refreshPairingCode}
                    isRefreshingPairingCode={isRefreshingPairingCode}
                    deviceInfo={device}
                    readinessItems={readinessItems}
                    allReady={allReady}
                    onEnter={onEnter}
                    onVerify={requestVerify}
                />
            </div>
        </div>
    )
}

export default Page
