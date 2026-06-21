"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { debounce } from "lodash"
import { useLocale, useTranslations } from "next-intl"
import { useAppDispatch, useAppSelector } from "@/redux"
import { SidebarTab } from "@/redux/slices/sidebar"
import { addMilestoneTaskIdToJobId } from "@/redux/slices"
import { useGraphQLWithToast } from "@/modules/toast"
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
import { usePersonalProjectGithubStore, type PersonalProjectGithubAutosaveStatus } from "./store"

/** GitHub repo regex (aligned with the challenge submission rule). */
const GITHUB_REGEX = /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)?(\/)?$/
const DEFAULT_BRANCH = "main"

/** Autosave status for the debounced url/branch sync (inline feedback). Lives in the store. */
export type { PersonalProjectGithubAutosaveStatus } from "./store"

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
    const runGraphQL = useGraphQLWithToast()
    const course = useAppSelector((state) => state.course.entity)
    const enrollment = useAppSelector((state) => state.user.enrollment)
    const sidebarTab = useAppSelector((state) => state.sidebar.sidebar.tab)
    const selectedTaskId = useAppSelector((state) => state.milestone.selectedTaskId)

    const syncPersonalProjectGithubSwr = useMutateSyncPersonalProjectGithubSwr()
    const syncBranchSwr = useMutateSyncPersonalProjectGithubBranchSwr()
    const queryCourseEnrollmentStatusSwr = useQueryCourseEnrollmentStatusSwr()
    const reviewPersonalProjectTaskSwr = useMutateReviewPersonalProjectTaskSwr()
    const jobNotificationsSocket = useJobNotificationsSocketIo()

    // SWR exposes STABLE trigger/mutate fns; the debounced-sync effects depend on
    // THESE, not the whole hook objects — otherwise every `isMutating` flip during a
    // sync changed the object identity, re-ran the effect, and re-fired the sync in a
    // loop that tripped the backend rate limiter (ThrottlerException: Too Many Requests).
    const syncGithubTrigger = syncPersonalProjectGithubSwr.trigger
    const syncBranchTrigger = syncBranchSwr.trigger
    const mutateEnrollmentStatus = queryCourseEnrollmentStatusSwr.mutate

    const githubUrl = usePersonalProjectGithubStore((state) => state.githubUrl)
    const branch = usePersonalProjectGithubStore((state) => state.branch)
    const lang = usePersonalProjectGithubStore((state) => state.lang)
    const touchedGithubUrl = usePersonalProjectGithubStore((state) => state.touchedGithubUrl)
    const touchedBranch = usePersonalProjectGithubStore((state) => state.touchedBranch)
    const githubUrlError = usePersonalProjectGithubStore((state) => state.githubUrlError)
    const branchError = usePersonalProjectGithubStore((state) => state.branchError)
    const isSubmitting = usePersonalProjectGithubStore((state) => state.isSubmitting)
    const seeded = usePersonalProjectGithubStore((state) => state.seeded)
    const setGithubUrl = usePersonalProjectGithubStore((state) => state.setGithubUrl)
    const setBranch = usePersonalProjectGithubStore((state) => state.setBranch)
    const setLang = usePersonalProjectGithubStore((state) => state.setLang)
    const setTouchedGithubUrl = usePersonalProjectGithubStore((state) => state.setTouchedGithubUrl)
    const setTouchedBranch = usePersonalProjectGithubStore((state) => state.setTouchedBranch)
    const setGithubUrlError = usePersonalProjectGithubStore((state) => state.setGithubUrlError)
    const setBranchError = usePersonalProjectGithubStore((state) => state.setBranchError)
    const setIsSubmitting = usePersonalProjectGithubStore((state) => state.setIsSubmitting)
    const seed = usePersonalProjectGithubStore((state) => state.seed)
    // url/branch autosave status live in the shared store so the field (which can render
    // in the settings Drawer) reads the same status the sync OWNER (panel) writes.
    const urlAutosaveStatus = usePersonalProjectGithubStore((state) => state.urlAutosaveStatus)
    const branchAutosaveStatus = usePersonalProjectGithubStore((state) => state.branchAutosaveStatus)
    const setUrlAutosaveStatus = usePersonalProjectGithubStore((state) => state.setUrlAutosaveStatus)
    const setBranchAutosaveStatus = usePersonalProjectGithubStore((state) => state.setBranchAutosaveStatus)

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
        // skip when it matches what we LAST synced — without this the effect's re-runs
        // (enrollment refetch after a save) would re-fire the same sync endlessly.
        if (trimmed === initialUrlRef.current) {
            return
        }
        const debounced = debounce(async () => {
            setUrlAutosaveStatus("saving")
            await runGraphQL(
                async () => {
                    try {
                        const result = await syncGithubTrigger({ courseId: course.id, githubUrl: trimmed })
                        const payload = result?.data?.syncPersonalProjectGithub
                        if (!payload) {
                            throw new Error("Sync failed")
                        }
                        if (!payload.success) {
                            setGithubUrlError(payload.error ?? payload.message ?? t("finalProject.page.submitGithub.syncFailed"))
                            setUrlAutosaveStatus("failed")
                            return payload
                        }
                        // record the synced value so the guard above stops re-firing
                        initialUrlRef.current = trimmed
                        await mutateEnrollmentStatus()
                        setUrlAutosaveStatus("saved")
                        return payload
                    } catch (error) {
                        setUrlAutosaveStatus("failed")
                        throw error
                    }
                },
                { showSuccessToast: false },
            )
        }, 600)
        debounced()
        return () => debounced.cancel()
    }, [enableSync, course?.id, githubUrl, validationError.githubUrl, sidebarTab, t, syncGithubTrigger, mutateEnrollmentStatus, setGithubUrlError, runGraphQL])

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
            setBranchAutosaveStatus("saving")
            await runGraphQL(
                async () => {
                    try {
                        const result = await syncBranchTrigger({ courseId: course.id, branch: trimmed.length > 0 ? trimmed : "" })
                        const payload = result?.data?.syncPersonalProjectGithub
                        if (!payload) {
                            throw new Error("Sync failed")
                        }
                        if (!payload.success) {
                            setBranchError(payload.error ?? payload.message ?? t("finalProject.page.submitGithub.syncFailed"))
                            setBranchAutosaveStatus("failed")
                            return payload
                        }
                        // record the synced value so the guard above stops re-firing
                        initialBranchRef.current = trimmed
                        await mutateEnrollmentStatus()
                        setBranchAutosaveStatus("saved")
                        return payload
                    } catch (error) {
                        setBranchAutosaveStatus("failed")
                        throw error
                    }
                },
                { showSuccessToast: false },
            )
        }, 600)
        debounced()
        return () => debounced.cancel()
    }, [enableSync, course?.id, branch, validationError.branch, sidebarTab, t, syncBranchTrigger, mutateEnrollmentStatus, setBranchError, runGraphQL])

    // Private-repo GitHub token: a one-off save/clear (NOT autosaved per keystroke — it's a secret).
    // Write-only — the plaintext is encrypted server-side and never returned.
    const [tokenSaveStatus, setTokenSaveStatus] = useState<PersonalProjectGithubAutosaveStatus>("idle")

    const saveGithubToken = useCallback(async (token: string) => {
        const trimmed = token.trim()
        if (!course?.id || !trimmed) {
            return
        }
        setTokenSaveStatus("saving")
        await runGraphQL(
            async () => {
                try {
                    const result = await syncPersonalProjectGithubSwr.trigger({ courseId: course.id, githubToken: trimmed })
                    const payload = result?.data?.syncPersonalProjectGithub
                    if (!payload?.success) {
                        setTokenSaveStatus("failed")
                        throw new Error(payload?.error ?? payload?.message ?? t("finalProject.page.submitGithub.syncFailed"))
                    }
                    await queryCourseEnrollmentStatusSwr.mutate()
                    setTokenSaveStatus("saved")
                    return payload
                } catch (error) {
                    setTokenSaveStatus("failed")
                    throw error
                }
            },
            { showSuccessToast: true },
        )
    }, [course?.id, syncPersonalProjectGithubSwr, queryCourseEnrollmentStatusSwr, t, runGraphQL])

    const clearGithubToken = useCallback(async () => {
        if (!course?.id) {
            return
        }
        setTokenSaveStatus("saving")
        await runGraphQL(
            async () => {
                try {
                    const result = await syncPersonalProjectGithubSwr.trigger({ courseId: course.id, clearGithubToken: true })
                    const payload = result?.data?.syncPersonalProjectGithub
                    if (!payload?.success) {
                        setTokenSaveStatus("failed")
                        throw new Error(payload?.error ?? payload?.message ?? t("finalProject.page.submitGithub.syncFailed"))
                    }
                    await queryCourseEnrollmentStatusSwr.mutate()
                    setTokenSaveStatus("idle")
                    return payload
                } catch (error) {
                    setTokenSaveStatus("failed")
                    throw error
                }
            },
            { showSuccessToast: true },
        )
    }, [course?.id, syncPersonalProjectGithubSwr, queryCourseEnrollmentStatusSwr, t, runGraphQL])

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
            await runGraphQL(
                async () => {
                    if (!selectedTaskId) {
                        throw new Error("Selected task ID is required")
                    }
                    const reviewResult = await reviewPersonalProjectTaskSwr.trigger({
                        courseId: course.id,
                        taskId: selectedTaskId,
                        githubUrl: resolvedUrl,
                        branch: branchTrimmed || undefined,
                        lang: lang || undefined,
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
    }, [course?.id, githubUrl, branch, lang, enrollment?.personalProjectGithubUrl, selectedTaskId, reviewPersonalProjectTaskSwr, jobNotificationsSocket, locale, dispatch, queryCourseEnrollmentStatusSwr, setBranchError, setIsSubmitting, t, runGraphQL])

    return {
        githubUrl,
        branch,
        lang,
        errors,
        touched: { githubUrl: touchedGithubUrl, branch: touchedBranch },
        autosaveStatus: { githubUrl: urlAutosaveStatus, branch: branchAutosaveStatus },
        isSubmitting,
        setGithubUrl,
        setBranch,
        setLang,
        setTouchedGithubUrl,
        setTouchedBranch,
        setGithubUrlError,
        setBranchError,
        submit,
        saveGithubToken,
        clearGithubToken,
        tokenSaveStatus,
    }
}
