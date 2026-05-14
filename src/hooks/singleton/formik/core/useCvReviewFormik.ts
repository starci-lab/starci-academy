"use client"

import { runGraphQLWithToast } from "@/modules/toast"
import { useFormik } from "formik"
import { useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import * as Yup from "yup"
import {
    PublicationEvent,
    useJobNotificationsSocketIo,
} from "@/hooks/singleton/socketio"
import { useMutateReviewCvSwr } from "../../swr"
import type {
    GraphQLResponse,
    ReviewCvResponseData,
} from "@/modules/api"
import { useAppSelector } from "@/redux"

/**
 * Form values for queuing an AI CV review (`reviewCv` mutation).
 */
export interface CvReviewFormikValues {
    /** `cv_submissions.id` for the learner's current submission. */
    cvSubmissionId: string
    /** Selected rubric (`template_cvs.id`). */
    templateCvId: string
}

/**
 * Singleton Formik for CV review: mirrors submission + rubric from Redux-backed UI,
 * then triggers {@link useMutateReviewCvSwr} and subscribes to job notifications.
 */
export const useCvReviewFormikCore = () => {
    const t = useTranslations()
    const locale = useLocale()
    /**
     * Mutate review CV SWR.
     */
    const mutateReviewCvSwr = useMutateReviewCvSwr()
    /**
     * Job notifications socket.
     */
    const jobNotificationsSocket = useJobNotificationsSocketIo()
    /**
     * CV URL payload.
     */
    const cvUrlPayload = useAppSelector((state) => state.cvUrl.entity)
    /**
     * Selected template ID.
     */
    const selectedTemplateId = useAppSelector((state) => state.cvReviewLevel.selectedTemplateId)
    const templateCvs = useAppSelector((state) => state.templateCvs.rows)
    /**
     * Initial values.
     * Note: `selectedTemplateId` is `""` in Redux until the learner picks a row or
     * the CV screen syncs the default. `??` does not treat `""` as missing, so we must
     * fall back to the first template when the selection is still empty.
     */
    const initialValues = useMemo<CvReviewFormikValues>(
        () => {
            const templateCvId = selectedTemplateId.trim().length > 0
                ? selectedTemplateId
                : (templateCvs[0]?.id ?? "")
            return {
                cvSubmissionId: cvUrlPayload?.id ?? "",
                templateCvId,
            }
        },
        [
            cvUrlPayload?.id,
            selectedTemplateId,
            templateCvs,
        ],
    )

    /**
     * Validation schema.
     */
    const validationSchema = useMemo(
        () =>
            Yup.object({
                cvSubmissionId: Yup.string()
                    .trim()
                    .required(t("cv.submission.toast.submissionNotFound")),
                templateCvId: Yup.string()
                    .trim()
                    .required(t("cv.submission.toast.reviewLevelRequired")),
            }),
        [t],
    )

    /**
     * Formik instance.
     */
    return useFormik<CvReviewFormikValues>({
        initialValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            await runGraphQLWithToast(
                async (): Promise<GraphQLResponse<ReviewCvResponseData>> => {
                    const reviewResult = await mutateReviewCvSwr.trigger({
                        cvSubmissionId: values.cvSubmissionId,
                        templateCvId: values.templateCvId,
                    })
                    const env = reviewResult?.data?.reviewCv
                    if (!env) {
                        throw new Error(t("cv.submission.toast.reviewFailed"))
                    }
                    if (!env.success) {
                        throw new Error(env.message || t("cv.submission.toast.reviewFailed"))
                    }
                    const jobId = env.data?.jobId
                    if (!jobId) {
                        throw new Error(env.message || t("cv.submission.toast.reviewFailed"))
                    }
                    jobNotificationsSocket.emit(
                        PublicationEvent.SubscribeJobNotification,
                        {
                            data: { jobId },
                            locale,
                        },
                    )
                    return env
                },
                {
                    showErrorToast: true,
                    showSuccessToast: true,
                },
            )
        },
    })
}
