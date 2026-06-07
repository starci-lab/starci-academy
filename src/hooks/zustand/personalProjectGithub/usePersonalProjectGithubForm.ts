"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"
import { debounce } from "lodash"
import { useLocale, useTranslations } from "next-intl"
import { useAppDispatch, useAppSelector } from "@/redux"
import { SidebarTab } from "@/redux/slices/sidebar"
import { addMilestoneTaskIdToJobId } from "@/redux/slices"
import { runGraphQLWithToast } from "@/modules/toast"
import {
    useMutateReviewPersonalProjectTaskSwr,
    useMutateSyncPersonalProjectGithubBranchSwr,
    useMutateSyncPersonalProjectGithubSwr,
    useQueryCourseEnrollmentStatusSwr,
} from "@/hooks/swr"
import {
    PublicationEvent,
    useJobNotificationsSocketIo,
} from "@/hooks/socketio"
import { usePersonalProjectGithubStore } from "./store"

/** GitHub repo regex (aligned with the challenge submission rule). */
const GITHUB_REGEX = /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)?(\/)?$/
const DEFAULT_BRANCH = "main"

/** Options for {@link usePersonalProjectGithubForm}. */
export interface UsePersonalProjectGithubFormOptions {
    /** Enable the 2 debounced auto-syncs (only the OWNER component — Submission — enables it, to avoid double-firing). */
    enableSync?: boolean
}

/**
 * Personal-project GitHub form hook — state SHARED via {@link usePersonalProjectGithubStore}.
 * Validated inline; submit runs the AI review + subscribes to the job. `enableSync` turns on the
 * debounced url/branch sync (only one component enables it so we never sync twice).
 * @param options - {@link UsePersonalProjectGithubFormOptions}
 */
export const usePersonalProjectGithubForm = (options: UsePersonalProjectGithubFormOptions = {}) => {
    const { enableSync = false } = options
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

    const githubUrl = usePersonalProjectGithubStore((state) => state.githubUrl)
    const branch = usePersonalProjectGithubStore((state) => state.branch)
    const touchedGithubUrl = usePersonalProjectGithubStore((state) => state.touchedGithubUrl)
    const touchedBranch = usePersonalProjectGithubStore((state) => state.touchedBranch)
    const githubUrlError = usePersonalProjectGithubStore((state) => state.githubUrlError)
    const branchError = usePersonalProjectGithubStore((state) => state.branchError)
    const isSubmitting = usePersonalProjectGithubStore((state) => state.isSubmitting)
    const seeded = usePersonalProjectGithubStore((state) => state.seeded)
    const setGithubUrl = usePersonalProjectGithubStore((state) => state.setGithubUrl)
    const setBranch = usePersonalProjectGithubStore((state) => state.setBranch)
    const setTouchedGithubUrl = usePersonalProjectGithubStore((state) => state.setTouchedGithubUrl)
    const setTouchedBranch = usePersonalProjectGithubStore((state) => state.setTouchedBranch)
    const setGithubUrlError = usePersonalProjectGithubStore((state) => state.setGithubUrlError)
    const setBranchError = usePersonalProjectGithubStore((state) => state.setBranchError)
    const setIsSubmitting = usePersonalProjectGithubStore((state) => state.setIsSubmitting)
    const seed = usePersonalProjectGithubStore((state) => state.seed)

    // Seed once from enrollment (replaces enableReinitialize).
    useEffect(() => {
        if (seeded || !enrollment) {
            return
        }
        seed(
            enrollment.personalProjectGithubUrl ?? "",
            enrollment.personalProjectGithubBranch?.trim() || DEFAULT_BRANCH,
        )
    }, [seeded, enrollment, seed])

    // Inline validation errors (combined with manual errors from sync/submit below).
    const validationError = useMemo(() => {
        const url = githubUrl.trim()
        let urlErr: string | null = null
        if (!url) {
            urlErr = t("finalProject.page.submitGithub.urlRequired")
        } else if (!GITHUB_REGEX.test(url)) {
            urlErr = t("finalProject.page.submitGithub.urlInvalidGithub")
        }
        const br = branch.trim()
        let branchErr: string | null = null
        if (br.length > 255) {
            branchErr = t("finalProject.page.submitGithub.branchTooLong")
        } else if (!/^$|^[a-zA-Z0-9._/-]+$/.test(br)) {
            branchErr = t("finalProject.page.submitGithub.branchInvalid")
        }
        return { githubUrl: urlErr, branch: branchErr }
    }, [githubUrl, branch, t])

    const errors = {
        githubUrl: githubUrlError ?? validationError.githubUrl,
        branch: branchError ?? validationError.branch,
    }

    const initialUrlRef = useRef(enrollment?.personalProjectGithubUrl?.trim() ?? "")
    const initialBranchRef = useRef(enrollment?.personalProjectGithubBranch?.trim() || DEFAULT_BRANCH)

    // Debounced URL sync (only when enableSync + PersonalProject tab + valid + changed vs enrollment).
    useEffect(() => {
        if (!enableSync || sidebarTab !== SidebarTab.PersonalProject || !course?.id) {
            return
        }
        if (validationError.githubUrl) {
            return
        }
        const trimmed = githubUrl.trim()
        if (trimmed === initialUrlRef.current) {
            return
        }
        const debounced = debounce(async () => {
            const result = await syncPersonalProjectGithubSwr.trigger({ courseId: course.id, githubUrl: trimmed })
            const payload = result?.data?.syncPersonalProjectGithub
            if (payload && !payload.success) {
                setGithubUrlError(payload.error ?? payload.message ?? t("finalProject.page.submitGithub.syncFailed"))
                return
            }
            await queryCourseEnrollmentStatusSwr.mutate()
        }, 300)
        debounced()
        return () => debounced.cancel()
    }, [enableSync, course?.id, githubUrl, validationError.githubUrl, sidebarTab, t, syncPersonalProjectGithubSwr, queryCourseEnrollmentStatusSwr, setGithubUrlError])

    // Debounced branch sync.
    useEffect(() => {
        if (!enableSync || sidebarTab !== SidebarTab.PersonalProject || !course?.id) {
            return
        }
        if (validationError.branch) {
            return
        }
        const trimmed = branch.trim()
        if (trimmed === initialBranchRef.current) {
            return
        }
        const debounced = debounce(async () => {
            const result = await syncBranchSwr.trigger({ courseId: course.id, branch: trimmed.length > 0 ? trimmed : "" })
            const payload = result?.data?.syncPersonalProjectGithub
            if (payload && !payload.success) {
                setBranchError(payload.error ?? payload.message ?? t("finalProject.page.submitGithub.syncFailed"))
                return
            }
            await queryCourseEnrollmentStatusSwr.mutate()
        }, 300)
        debounced()
        return () => debounced.cancel()
    }, [enableSync, course?.id, branch, validationError.branch, sidebarTab, t, syncBranchSwr, queryCourseEnrollmentStatusSwr, setBranchError])

    const submit = useCallback(async () => {
        if (!course?.id) {
            return
        }
        const draftUrl = githubUrl.trim()
        const enrollmentUrl = enrollment?.personalProjectGithubUrl?.trim() ?? ""
        const resolvedUrl = draftUrl || enrollmentUrl
        if (!resolvedUrl) {
            setBranchError(t("finalProject.page.submitGithub.missingRepoForReview"))
            return
        }
        const branchTrimmed = branch.trim()
        setIsSubmitting(true)
        try {
            await runGraphQLWithToast(
                async () => {
                    if (!selectedTaskId) {
                        throw new Error("Selected task ID is required")
                    }
                    const reviewResult = await reviewPersonalProjectTaskSwr.trigger({
                        courseId: course.id,
                        taskId: selectedTaskId,
                        githubUrl: resolvedUrl,
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
                        dispatch(addMilestoneTaskIdToJobId({ milestoneTaskId: selectedTaskId, jobId }))
                        jobNotificationsSocket.emit(
                            PublicationEvent.SubscribeJobNotification,
                            { data: { jobId }, locale },
                        )
                    }
                    await queryCourseEnrollmentStatusSwr.mutate()
                    return reviewEnv
                },
                { showErrorToast: true, showSuccessToast: true },
            )
        } finally {
            setIsSubmitting(false)
        }
    }, [course?.id, githubUrl, branch, enrollment?.personalProjectGithubUrl, selectedTaskId, reviewPersonalProjectTaskSwr, jobNotificationsSocket, locale, dispatch, queryCourseEnrollmentStatusSwr, setBranchError, setIsSubmitting, t])

    return {
        githubUrl,
        branch,
        errors,
        touched: { githubUrl: touchedGithubUrl, branch: touchedBranch },
        isSubmitting,
        setGithubUrl,
        setBranch,
        setTouchedGithubUrl,
        setTouchedBranch,
        setGithubUrlError,
        setBranchError,
        submit,
    }
}
