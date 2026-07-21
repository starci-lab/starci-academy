"use client"

import React, { useCallback, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { Button, Typography } from "@heroui/react"
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react"
import { EmptyContent } from "@/components/blocks/async/EmptyContent"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { PlaygroundRagWorkspace } from "@/components/features/learn/Playground/PlaygroundRagWorkspace"
import { PlaygroundHeader } from "@/components/features/learn/Playground/PlaygroundHeader"
import { usePlaygroundSessionContext } from "@/components/features/learn/Playground/PlaygroundSessionProvider"
import { pathConfig } from "@/resources/path"

/**
 * Full machine-backed RAG lab surface — the guided step column on the left
 * beside the {@link PlaygroundRagWorkspace} (import → ask → cite over the
 * learner's own local Ollama) on the right.
 *
 * The socket + session are owned by {@link usePlaygroundSessionContext} (mounted
 * at the route layout, shared with the Setup route) — this component is the
 * Lab surface only; installing Ollama and pairing the agent lives on the Setup
 * (`[slug]`) route.
 */
export const PlaygroundRagSession = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    // Course from the URL, NOT the store — playgrounds are shared by every course,
    // so a stale `state.course.displayId` navigates the learner out of theirs.
    const params = useParams()
    const courseDisplayId = String(params.courseId ?? "")

    const { playground, byomState, sendRagIndex, sendRagAsk } = usePlaygroundSessionContext()

    const [currentStepIndex, setCurrentStepIndex] = useState(0)

    const steps = playground?.steps ?? []
    const currentStep = steps[currentStepIndex]

    const onPrevStep = useCallback(() => {
        setCurrentStepIndex((prev) => Math.max(0, prev - 1))
    }, [])
    const onNextStep = useCallback(() => {
        setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))
    }, [steps.length])

    const onLeave = useCallback(() => {
        router.push(pathConfig().locale(locale).course(courseDisplayId).learn().playground().build())
    }, [router, locale, courseDisplayId])

    // ── lab phase — guided steps beside the RAG workspace ──
    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col">
            <PlaygroundHeader step={{ current: currentStepIndex + 1, total: steps.length }} />

            <div className="grid flex-1 grid-cols-1 overflow-hidden @app-lg:grid-cols-2">
                {/* LEFT — guided step */}
                <div className="flex flex-col overflow-y-auto border-r border-default bg-background px-6 pt-5 pb-6">
                    {currentStep ? (
                        <div className="flex flex-col gap-4">
                            <Typography type="h6" weight="bold">
                                {currentStep.title}
                            </Typography>
                            <MarkdownContent markdown={currentStep.body} codeElevated />
                            {currentStep.actionHint ? (
                                <div className="rounded-medium border border-dashed border-default bg-default px-3 py-2 text-sm">
                                    <MarkdownContent markdown={currentStep.actionHint} />
                                </div>
                            ) : null}

                            <div className="flex items-center gap-2 border-t border-default pt-4">
                                <Button
                                    variant="tertiary"
                                    isDisabled={currentStepIndex === 0}
                                    onPress={onPrevStep}
                                >
                                    <ArrowLeftIcon aria-hidden focusable="false" className="size-4" />
                                    {t("playground.session.prevStep")}
                                </Button>
                                <Button
                                    variant="primary"
                                    isDisabled={currentStepIndex >= steps.length - 1}
                                    onPress={onNextStep}
                                >
                                    {t("playground.session.nextStep")}
                                    <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <EmptyContent
                            title={t("playground.session.completeTitle")}
                            description={t("playground.session.completeDescription")}
                            onRetry={onLeave}
                            retryLabel={t("playground.session.backToHub")}
                        />
                    )}
                </div>

                {/* RIGHT — machine-backed RAG workspace */}
                <div className="flex flex-col overflow-hidden bg-surface">
                    <PlaygroundRagWorkspace
                        className="h-full"
                        ragAnswer={byomState.ragAnswer}
                        ragCitations={byomState.ragCitations}
                        sendRagIndex={sendRagIndex}
                        sendRagAsk={sendRagAsk}
                    />
                </div>
            </div>
        </div>
    )
}
