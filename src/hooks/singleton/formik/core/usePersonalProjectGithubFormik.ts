"use client"

import { useAppDispatch, useAppSelector } from "@/redux"
import { SidebarTab } from "@/redux/slices/sidebar"
import { addMilestoneTaskIdToJobId } from "@/redux/slices"
import { runGraphQLWithToast } from "@/modules/toast"
import { useFormik } from "formik"
import { useEffect, useMemo, useRef } from "react"
import { useLocale, useTranslations } from "next-intl"
import { debounce } from "lodash"
import * as Yup from "yup"
import {
    useMutateReviewPersonalProjectTaskSwr,
    useMutateSyncPersonalProjectGithubBranchSwr,
    useMutateSyncPersonalProjectGithubSwr,
    useQueryCourseEnrollmentStatusSwr,
} from "../../swr"
import {
    PublicationEvent,
    useJobNotificationsSocketIo,
} from "../../socketio"

/** Regex for GitHub repository URLs (aligned with challenge submission GitHub rule). */
const GITHUB_REGEX =
    /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)?(\/)?$/

const defaultBranch = "main"

/** Single Formik shape: repo URL + branch (debounced sync per field; submit = AI review). */
export interface PersonalProjectGithubFormikValues {
    /** GitHub repository URL persisted via `syncPersonalProjectGithub`. */
    githubUrl: string
    /** Git branch persisted via `syncPersonalProjectGithub` (branch-only payload). */
    branch: string
}
/**
 * Personal project: one Formik with `githubUrl` + `branch`, debounced enrollment sync, review on submit.
 */
export const usePersonalProjectGithubFormikCore = () => {
    const t = useTranslations()
    const locale = useLocale()
    const dispatch = useAppDispatch()
    const course = useAppSelector((state) => state.course.entity)
    const enrollment = useAppSelector((state) => state.user.enrollment)
    const sidebarTab = useAppSelector((state) => state.sidebar.sidebar.tab)
    const selectedTaskId = useAppSelector((state) => state.milestone.selectedTaskId)

    const syncPersonalProjectGithubSwr = useMutateSyncPersonalProjectGithubSwr()
    const syncBranchSwr = useMutateSyncPersonalProjectGithubBranchSwr()
    const queryCourseEnrollmentStatusSwr = useQueryCourseEnrollmentStatusSwr()
    const reviewPersonalProjectTaskSwr = useMutateReviewPersonalProjectTaskSwr()
    const jobNotificationsSocket = useJobNotificationsSocketIo()

    const initialValues = useMemo<PersonalProjectGithubFormikValues>(
        () => ({
            githubUrl: enrollment?.personalProjectGithubUrl ?? "",
            branch: enrollment?.personalProjectGithubBranch?.trim() || defaultBranch,
        }),
        [
            enrollment?.personalProjectGithubUrl,
            enrollment?.personalProjectGithubBranch,
        ],
    )

    const validationSchema = useMemo(
        () => Yup.object({
            githubUrl: Yup.string()
                .trim()
                .required(t("finalProject.page.submitGithub.urlRequired"))
                .test(
                    "github-repo",
                    t("finalProject.page.submitGithub.urlInvalidGithub"),
                    (value) => Boolean(value && GITHUB_REGEX.test(String(value).trim())),
                ),
            branch: Yup.string()
                .trim()
                .max(255, t("finalProject.page.submitGithub.branchTooLong"))
                .matches(
                    /^$|^[a-zA-Z0-9._/-]+$/,
                    t("finalProject.page.submitGithub.branchInvalid"),
                ),
        }),
        [t],
    )

    const personalProjectGithubFormik = useFormik<PersonalProjectGithubFormikValues>({
        initialValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values, { setFieldError }) => {
            if (!course?.id) {
                return
            }
            const draftUrl = values.githubUrl.trim()
            const enrollmentUrl = enrollment?.personalProjectGithubUrl?.trim() ?? ""
            const githubUrl = draftUrl || enrollmentUrl
            if (!githubUrl) {
                setFieldError(
                    "branch",
                    t("finalProject.page.submitGithub.missingRepoForReview"),
                )
                return
            }
            const branchTrimmed = values.branch.trim()
            await runGraphQLWithToast(
                async () => {
                    if (!selectedTaskId) {
                        throw new Error("Selected task ID is required")
                    }
                    const reviewResult = await reviewPersonalProjectTaskSwr.trigger({
                        courseId: course.id,
                        taskId: selectedTaskId,
                        githubUrl,
                        branch: branchTrimmed || undefined,
                    })
                    const reviewEnv = reviewResult?.data?.reviewPersonalProjectTask
                    if (!reviewEnv) {
                        throw new Error("Review failed")
                    }
                    if (!reviewEnv.success) {
                        throw new Error(reviewEnv.error ?? reviewEnv.message ?? "Review failed")
                    }

                    const jobId = reviewEnv.data?.jobId
                    if (jobId) {
                        dispatch(
                            addMilestoneTaskIdToJobId({
                                milestoneTaskId: selectedTaskId,
                                jobId,
                            }),
                        )
                        jobNotificationsSocket.emit(
                            PublicationEvent.SubscribeJobNotification,
                            {
                                data: { jobId },
                                locale,
                            },
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

    const githubUrlMountedRef = useRef(false)
    useEffect(
        () => {
            if (!githubUrlMountedRef.current) {
                githubUrlMountedRef.current = true
                return
            }
            if (sidebarTab !== SidebarTab.PersonalProject) {
                return
            }
            if (!course?.id) {
                return
            }
            if (personalProjectGithubFormik.errors.githubUrl) {
                return
            }
            const trimmed = personalProjectGithubFormik.values.githubUrl.trim()
            const initialTrimmed = initialValues.githubUrl.trim()
            if (trimmed === initialTrimmed) {
                return
            }
            const debouncedTrigger = debounce(
                async () => {
                    const result = await syncPersonalProjectGithubSwr.trigger({
                        courseId: course.id,
                        githubUrl: trimmed,
                    })
                    const payload = result?.data?.syncPersonalProjectGithub
                    if (payload && !payload.success) {
                        personalProjectGithubFormik.setFieldError(
                            "githubUrl",
                            payload.error ?? payload.message ?? t("finalProject.page.submitGithub.syncFailed"),
                        )
                        return
                    }
                    await queryCourseEnrollmentStatusSwr.mutate()
                },
                300,
            )
            debouncedTrigger()
            return () => {
                debouncedTrigger.cancel()
            }
        },
        [
            course?.id,
            personalProjectGithubFormik.errors.githubUrl,
            personalProjectGithubFormik.values.githubUrl,
            initialValues.githubUrl,
            sidebarTab,
            t,
            syncPersonalProjectGithubSwr,
            queryCourseEnrollmentStatusSwr,
        ],
    )

    const branchMountedRef = useRef(false)
    useEffect(
        () => {
            if (!branchMountedRef.current) {
                branchMountedRef.current = true
                return
            }
            if (sidebarTab !== SidebarTab.PersonalProject) {
                return
            }
            if (!course?.id) {
                return
            }
            if (personalProjectGithubFormik.errors.branch) {
                return
            }
            const trimmed = personalProjectGithubFormik.values.branch.trim()
            const initialTrimmed = initialValues.branch.trim()
            if (trimmed === initialTrimmed) {
                return
            }
            const debouncedTrigger = debounce(
                async () => {
                    const result = await syncBranchSwr.trigger({
                        courseId: course.id,
                        branch: trimmed.length > 0 ? trimmed : "",
                    })
                    const payload = result?.data?.syncPersonalProjectGithub
                    if (payload && !payload.success) {
                        personalProjectGithubFormik.setFieldError(
                            "branch",
                            payload.error ?? payload.message ?? t("finalProject.page.submitGithub.syncFailed"),
                        )
                        return
                    }
                    await queryCourseEnrollmentStatusSwr.mutate()
                },
                300,
            )
            debouncedTrigger()
            return () => {
                debouncedTrigger.cancel()
            }
        },
        [
            course?.id,
            personalProjectGithubFormik.errors.branch,
            personalProjectGithubFormik.values.branch,
            initialValues.branch,
            sidebarTab,
            t,
            syncBranchSwr,
            queryCourseEnrollmentStatusSwr,
        ],
    )

    return personalProjectGithubFormik
}
