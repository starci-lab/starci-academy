"use client"

import { useCallback, useMemo, useState } from "react"
import { z } from "zod"
import axios from "axios"
import { useLocale } from "next-intl"
import { useCvGenerationStore } from "./store"
import { sleep } from "@/modules/utils/misc"
import { PublicationEvent } from "@/hooks/socketio/enums/publication-event"
import { useJobNotificationsSocketIo } from "@/hooks/socketio/useJobNotificationsSocketIo"
import { useMutateGenerateSubmitCvPresignUrlSwr } from "@/hooks/swr/api/graphql/mutations/useMutateGenerateSubmitCvPresignUrlSwr"
import { useMutateUploadCvSwr } from "@/hooks/swr/api/graphql/mutations/useMutateUploadCvSwr"
import { useGraphQLWithToast, useRestWithToast } from "@/modules/toast/hooks"
import type { GradeModelSelection } from "@/components/blocks/grading/GradeModelDropdown"

/** Mimetypes the upload form accepts — matches the Dropzone + BE `extractCvText` (pdf-parse / UTF-8 fallback). */
const ACCEPTED_CV_MIME_TYPES: ReadonlyArray<string> = ["application/pdf", "text/plain"]

/** CV file validation schema: required, must be PDF or plain text, ≤ 10MB. */
const cvFileSchema = z
    .custom<File | null>((value) => value instanceof File, "cv.upload.errors.fileRequired")
    .refine((file) => file instanceof File && ACCEPTED_CV_MIME_TYPES.includes(file.type), "cv.upload.errors.fileTypeInvalid")
    .refine((file) => file instanceof File && file.size <= 10 * 1024 * 1024, "cv.upload.errors.fileSizeInvalid")

/**
 * Action hook for the CV **upload** flow (WF-07): presign → PUT the raw file to
 * storage → register it via `uploadCv` so it lands in the unified `cv_generations`
 * table (`source = uploaded`) and gets AI-scored. Stores the returned
 * `cvGenerationId` in {@link useCvGenerationStore} so the shared preview polls it —
 * the same infra the generate/revise flows use.
 *
 * @returns file state (`cvFile`/`setCvFile`/`error`), `submit(label?, selection?)`, and `isUploading`.
 */
export const useCvUploadForm = () => {
    const locale = useLocale()
    const [cvFile, setCvFile] = useState<File | null>(null)
    const { trigger: triggerGenerateSubmitCvPresignUrl } = useMutateGenerateSubmitCvPresignUrlSwr()
    const { trigger: triggerUploadCv } = useMutateUploadCvSwr()
    const jobNotificationsSocket = useJobNotificationsSocketIo()
    const setActiveCvGenerationId = useCvGenerationStore((state) => state.setActiveCvGenerationId)
    const runGraphQL = useGraphQLWithToast()
    const runRest = useRestWithToast()
    const [isUploading, setIsUploading] = useState(false)

    /** i18n key of the current validation error; null when valid. */
    const error = useMemo(() => {
        const result = cvFileSchema.safeParse(cvFile)
        return result.success ? null : (result.error.issues[0]?.message ?? "cv.upload.errors.fileRequired")
    }, [cvFile])

    /** Subscribe to the scoring job's realtime notifications (best-effort; polling is source of truth). */
    const subscribeJob = useCallback(
        (jobId: string) => {
            jobNotificationsSocket.emit(
                PublicationEvent.SubscribeJobNotification,
                { data: { jobId }, locale },
            )
        },
        [jobNotificationsSocket, locale],
    )

    const submit = useCallback(
        async (label?: string, selection?: GradeModelSelection, courseId?: string) => {
            if (!cvFile || error) {
                return
            }
            setIsUploading(true)
            try {
                await runGraphQL(
                    async () => {
                        // Step 1: presign a PUT URL + get the storage object key (cdnKey).
                        const presignResponse = await triggerGenerateSubmitCvPresignUrl({
                            request: { fileName: cvFile.name },
                        })
                        const presignPayload = presignResponse.data?.generateSubmitCvPresignUrl?.data
                        if (!presignPayload?.url || !presignPayload.cdnKey) {
                            throw new Error("Failed to get pre-signed URL")
                        }

                        // Step 2: PUT the raw file to storage.
                        const contentType = cvFile.type || "application/pdf"
                        const uploadResponse = await runRest(
                            () => axios.put(presignPayload.url, cvFile, {
                                headers: { "Content-Type": contentType },
                            }),
                            { showSuccessToast: false },
                        )
                        if (!uploadResponse || uploadResponse.status !== 200) {
                            throw new Error(`Upload failed with status ${uploadResponse?.status}`)
                        }

                        // Wait ~1s for storage to propagate before registering.
                        await sleep(1000)

                        // Step 3: register the uploaded CV into the unified table + enqueue scoring.
                        const result = await triggerUploadCv({
                            cdnKey: presignPayload.cdnKey,
                            label: label?.trim() || undefined,
                            selectedModel: selection?.model ?? undefined,
                            selectedModelProvider: selection?.provider ?? undefined,
                            courseId,
                        })
                        const env = result?.data?.uploadCv
                        if (!env) {
                            throw new Error("CV upload failed")
                        }
                        if (!env.success) {
                            throw new Error(env.message || env.error || "CV upload failed")
                        }
                        const { jobId, cvGenerationId } = env.data ?? {}
                        if (!jobId || !cvGenerationId) {
                            throw new Error(env.message || "CV upload failed")
                        }
                        setActiveCvGenerationId(cvGenerationId)
                        subscribeJob(jobId)
                        setCvFile(null)
                        return env
                    },
                    { showErrorToast: true, showSuccessToast: true },
                )
            } finally {
                setIsUploading(false)
            }
        },
        [
            cvFile,
            error,
            runGraphQL,
            runRest,
            triggerGenerateSubmitCvPresignUrl,
            triggerUploadCv,
            setActiveCvGenerationId,
            subscribeJob,
        ],
    )

    return {
        cvFile,
        setCvFile,
        error,
        submit,
        isUploading,
    }
}
