"use client"
import { JobStatus } from "@/modules/types"
import {
    useMutateReviewPersonalProjectTaskSwr,
    useQueryCourseEnrollmentStatusSwr,
    useQueryUserPersonalTaskAttemptsSwr,
} from "../../swr"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setReviewJob } from "@/redux/slices"
import { runGraphQLWithToast } from "@/modules/toast"
import { useFormik } from "formik"
import { useMemo } from "react"
import { useTranslations } from "next-intl"
import * as Yup from "yup"
import { useLocale } from "next-intl"
import {
    jobNotificationsSocketIoEventEmitter,
    PublicationEvent,
    SubscriptionEvent,
    useJobNotificationsSocketIo,
} from "../../socketio"
import type {
    JobStatusUpdatedSocketIoMessage,
} from "../../socketio"

/**
 * Form values for personal project GitHub URL submission.
 */
export interface PersonalProjectGithubUrlFormikValues {
    /** The GitHub repository URL. */
    githubUrl: string
}

/**
 * Singleton Formik core for personal project GitHub URL submission.
 * On submit: triggers AI review for the selected task, subscribes via Socket.IO
 * for real-time completion notification, then revalidates feedback data.
 */
export const usePersonalProjectGithubUrlFormikCore = () => {
    const t = useTranslations()
    const locale = useLocale()
    const dispatch = useAppDispatch()
    const reviewPersonalProjectTaskSwr = useMutateReviewPersonalProjectTaskSwr()
    const queryCourseEnrollmentStatusSwr = useQueryCourseEnrollmentStatusSwr()
    const queryUserPersonalTaskAttemptsSwr = useQueryUserPersonalTaskAttemptsSwr()
    const course = useAppSelector((state) => state.course.entity)
    const enrollment = useAppSelector((state) => state.user.enrollment)
    const selectedTaskId = useAppSelector((state) => state.milestone.selectedTaskId)
    const jobNotificationsSocket = useJobNotificationsSocketIo()
    const validationSchema = useMemo(
        () => Yup.object({
            githubUrl: Yup.string()
                .trim()
                .required(t("finalProject.page.submitGithub.urlRequired"))
                .url(t("finalProject.page.submitGithub.urlInvalid")),
        }), [t],
    )

    const initialValues = useMemo<PersonalProjectGithubUrlFormikValues>(
        () => ({
            githubUrl: enrollment?.personalProjectGithubUrl ?? "",
        }),
        [enrollment?.personalProjectGithubUrl],
    )

    const formik = useFormik<PersonalProjectGithubUrlFormikValues>({
        initialValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            if (!course?.id) {
                return
            }
            await runGraphQLWithToast(
                async () => {
                    const reviewResult = await reviewPersonalProjectTaskSwr.trigger({
                        courseId: course.id,
                        taskId: selectedTaskId,
                        githubUrl: values.githubUrl.trim(),
                    })
                    const reviewEnv = reviewResult?.data?.reviewPersonalProjectTask
                    if (!reviewEnv) {
                        throw new Error("Review failed")
                    }
                    if (!reviewEnv.success) {
                        throw new Error(reviewEnv.error ?? reviewEnv.message ?? "Review failed")
                    }

                    /** Subscribe to job completion via Socket.IO */
                    const jobId = reviewEnv.data?.jobId
                    if (jobId) {
                        /** Set initial job status in Redux */
                        dispatch(setReviewJob({ jobId, status: JobStatus.Processing }))

                        jobNotificationsSocket.emit(PublicationEvent.SubscribeJobNotification, {
                            data: { jobId },
                            locale,
                        })

                        /** Listen for this job's status updates */
                        const onJobUpdate = (message: JobStatusUpdatedSocketIoMessage) => {
                            if (message.data?.jobId !== jobId) return
                            const status = message.data?.status
                            if (status) {
                                dispatch(setReviewJob({ jobId, status }))
                            }
                            if (status === JobStatus.Completed || status === JobStatus.Failed) {
                                jobNotificationsSocketIoEventEmitter.off(
                                    SubscriptionEvent.JobStatusUpdated,
                                    onJobUpdate,
                                )
                                /** Revalidate attempts SWR to show new results */
                                void queryUserPersonalTaskAttemptsSwr.mutate()
                            }
                        }
                        jobNotificationsSocketIoEventEmitter.on(
                            SubscriptionEvent.JobStatusUpdated,
                            onJobUpdate,
                        )
                    }

                    await queryCourseEnrollmentStatusSwr.mutate()
                    return reviewEnv
                },
                {
                    showErrorToast: true,
                    showSuccessToast: true,
                },
            )
        },
    })

    return formik
}
