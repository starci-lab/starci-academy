"use client"

import { useCallback, useState } from "react"
import { useLocale } from "next-intl"
import { useCvGenerationStore } from "./store"
import { PublicationEvent } from "@/hooks/socketio/enums/publication-event"
import { useJobNotificationsSocketIo } from "@/hooks/socketio/useJobNotificationsSocketIo"
import { useMutateGenerateCvSwr } from "@/hooks/swr/api/graphql/mutations/useMutateGenerateCvSwr"
import { useMutateReviseCvSwr } from "@/hooks/swr/api/graphql/mutations/useMutateReviseCvSwr"
import { useMutateDeleteCvGenerationSwr } from "@/hooks/swr/api/graphql/mutations/useMutateDeleteCvGenerationSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import type { GradeModelSelection } from "@/components/blocks/grading/GradeModelDropdown"

/**
 * Action hook for the AI CV generation flows. `generate` builds a CV from the learner's StarCi
 * activity; `revise` improves an existing CV (`cv_generations.id`, either source); `remove` deletes
 * one outright. All three accept/enqueue as appropriate, subscribe to job notifications (generate/
 * revise), and store the returned `cvGenerationId` in {@link useCvGenerationStore} so the preview
 * area can poll it.
 *
 * Follows the standard async-job shape (runGraphQL + emit subscription), but the result is a
 * compiled PDF (`generatedPdfUrl`, previewed via the shared `PDFView`) instead of a rubric score.
 *
 * @returns `generate`, `revise`, `remove`, and their pending flags.
 */
export const useCvGenerationForm = () => {
    const locale = useLocale()
    const { trigger: triggerGenerateCv } = useMutateGenerateCvSwr()
    const { trigger: triggerReviseCv } = useMutateReviseCvSwr()
    const { trigger: triggerDeleteCv } = useMutateDeleteCvGenerationSwr()
    const jobNotificationsSocket = useJobNotificationsSocketIo()
    const setActiveCvGenerationId = useCvGenerationStore((state) => state.setActiveCvGenerationId)
    const runGraphQL = useGraphQLWithToast()
    const [isGenerating, setIsGenerating] = useState(false)
    const [isRevising, setIsRevising] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    /** Subscribe to the job's realtime notifications (best-effort; polling is the source of truth). */
    const subscribeJob = useCallback(
        (jobId: string) => {
            jobNotificationsSocket.emit(
                PublicationEvent.SubscribeJobNotification,
                { data: { jobId }, locale },
            )
        },
        [jobNotificationsSocket, locale],
    )

    /** Generate a CV from scratch off the learner's StarCi activity. */
    const generate = useCallback(
        async (extraPrompts?: string, selection?: GradeModelSelection, courseId?: string) => {
            setIsGenerating(true)
            try {
                await runGraphQL(
                    async () => {
                        const result = await triggerGenerateCv({
                            extraPrompts: extraPrompts?.trim() || undefined,
                            selectedModel: selection?.model ?? undefined,
                            selectedModelProvider: selection?.provider ?? undefined,
                            courseId,
                        })
                        const env = result?.data?.generateCv
                        if (!env) {
                            throw new Error("CV generation failed")
                        }
                        if (!env.success) {
                            throw new Error(env.message || env.error || "CV generation failed")
                        }
                        const { jobId, cvGenerationId } = env.data ?? {}
                        if (!jobId || !cvGenerationId) {
                            throw new Error(env.message || "CV generation failed")
                        }
                        setActiveCvGenerationId(cvGenerationId)
                        subscribeJob(jobId)
                        return env
                    },
                    { showErrorToast: true, showSuccessToast: true },
                )
            } finally {
                setIsGenerating(false)
            }
        },
        [runGraphQL, triggerGenerateCv, setActiveCvGenerationId, subscribeJob],
    )

    /** Revise an existing CV (`cv_generations.id`, either uploaded or generated). */
    const revise = useCallback(
        async (sourceCvGenerationId: string, extraPrompts?: string, selection?: GradeModelSelection, courseId?: string) => {
            setIsRevising(true)
            try {
                await runGraphQL(
                    async () => {
                        const result = await triggerReviseCv({
                            // request field kept as `cvSubmissionId` — the resolver now
                            // accepts a `cv_generations.id` here (see BE reviseCv fix)
                            cvSubmissionId: sourceCvGenerationId,
                            extraPrompts: extraPrompts?.trim() || undefined,
                            selectedModel: selection?.model ?? undefined,
                            selectedModelProvider: selection?.provider ?? undefined,
                            courseId,
                        })
                        const env = result?.data?.reviseCv
                        if (!env) {
                            throw new Error("CV revision failed")
                        }
                        if (!env.success) {
                            throw new Error(env.message || env.error || "CV revision failed")
                        }
                        const { jobId, cvGenerationId } = env.data ?? {}
                        if (!jobId || !cvGenerationId) {
                            throw new Error(env.message || "CV revision failed")
                        }
                        setActiveCvGenerationId(cvGenerationId)
                        subscribeJob(jobId)
                        return env
                    },
                    { showErrorToast: true, showSuccessToast: true },
                )
            } finally {
                setIsRevising(false)
            }
        },
        [runGraphQL, triggerReviseCv, setActiveCvGenerationId, subscribeJob],
    )

    /** Delete a CV generation outright (removes the row + its CDN objects server-side). */
    const remove = useCallback(
        async (id: string) => {
            setIsDeleting(true)
            try {
                await runGraphQL(
                    async () => {
                        const result = await triggerDeleteCv({ id })
                        const env = result?.data?.deleteCvGeneration
                        if (!env) {
                            throw new Error("CV deletion failed")
                        }
                        if (!env.success) {
                            throw new Error(env.message || env.error || "CV deletion failed")
                        }
                        return env
                    },
                    { showErrorToast: true, showSuccessToast: true },
                )
            } finally {
                setIsDeleting(false)
            }
        },
        [runGraphQL, triggerDeleteCv],
    )

    return {
        generate,
        revise,
        remove,
        isGenerating,
        isRevising,
        isDeleting,
    }
}
