"use client"

import React, { useCallback, useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import {
    usePlaygroundSessionContext,
    type GuideLab,
} from "@/components/features/learn/Playground/PlaygroundSessionProvider"
import type {
    PlaygroundReadinessChecklistItem,
    PlaygroundReadinessKind,
} from "@/components/starci/blocks/learn/PlaygroundReadinessChecklist"
import { _PlaygroundPreparePage } from "./component"

/**
 * The session context still identifies a readiness row by a free-form `id` and
 * carries its own icon element; the block names a closed `kind` and draws the
 * icon itself. This is the one place the two vocabularies meet — every id the
 * provider emits is listed, so a new one fails the build here rather than
 * silently rendering the wrong glyph.
 */
const KIND_BY_ROW_ID: Record<string, PlaygroundReadinessKind> = {
    agent: "agent",
    engine: "engine",
    embed: "embedModel",
    gen: "genModel",
    device: "device",
}

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
 * `PlaygroundPreparePage` — the CONNECTED half of the playground SETUP screen:
 * install the engine (Docker / kind+kubectl / Ollama) then pair the local
 * agent, with a live readiness panel gating the "enter the lab" CTA.
 *
 * This is the exercise's ENTRY url (so the hub cards and every existing link
 * keep working); the 20-step work surface lives at `[slug]/session`. The socket
 * and the session are owned by the route's `layout.tsx`, so moving between the
 * two routes keeps the pairing the learner already ran `npx` for — which is why
 * every input here comes from {@link usePlaygroundSessionContext} rather than a
 * fetch of its own.
 *
 * NO auto-enter on pair. A previous version pushed the learner straight into the
 * Lab the moment the agent connected, which was wrong twice over: it gated on
 * the AGENT while the CTA gates on every readiness item, so it walked past the
 * check it was meant to enforce; and `router.replace` wiped history, so Back
 * could not return to Setup to inspect state. Setup is a gate the learner reads.
 */
export const PlaygroundPreparePage = () => {
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

    const onBackToHub = useCallback(() => {
        router.push(hubPath)
    }, [hubPath, router])

    const checklistItems = useMemo<Array<PlaygroundReadinessChecklistItem>>(
        () => readinessItems.map((row) => ({
            key: row.id,
            kind: KIND_BY_ROW_ID[row.id] ?? "engine",
            label: row.label,
            readyDescription: row.readyDescription,
            pendingDescription: row.pendingDescription,
            ready: row.ready,
        })),
        [readinessItems],
    )

    return (
        <_PlaygroundPreparePage
            breadcrumbLabel={t("playground.session.backToHub")}
            onBack={onBackToHub}
            title={t("playground.session.pageTitle", { name: playground?.title ?? "" })}
            description={t(INTRO_KEY_BY_LAB[guideLab])}
            checklistItems={checklistItems}
            onEnter={onEnter}
            deviceInfo={byomState.deviceInfo ?? undefined}
            flavor={prepareFlavor}
            engineName={engineName}
            osGuides={osGuides}
            pairCommand={pairCommand}
            pairingCodeSecondsLeft={pairingCodeSecondsLeft}
            pairingCodeExpired={pairingCodeExpired}
            onRefreshPairingCode={refreshPairingCode}
            isRefreshingPairingCode={isRefreshingPairingCode}
            onVerify={requestVerify}
            // first load, nothing in hand → the screen rests; settled (data OR error) stops it
            isSkeleton={isLoading && !playground}
            // settled with no playground for this slug → the exercise is gone
            isEmpty={!isLoading && !error && !playground}
            error={error}
            onRetry={refetchPlayground}
            onBackToHub={onBackToHub}
            labels={{
                emptyTitle: t("playground.session.notFoundTitle"),
                emptyDescription: t("playground.session.notFoundDescription"),
                errorTitle: t("playground.session.loadErrorTitle"),
                errorDescription: t("playground.session.loadErrorDescription"),
                retry: t("common.retry"),
            }}
        />
    )
}
