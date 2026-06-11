"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react"
import { cn } from "@heroui/react"
import {
    PublicationEvent,
    useAiQuotaOverlayState,
    useEditSubmissionForm,
    useJobNotificationsSocketIo,
    useMutateSubmitChallengeSubmissionSwr,
    useMutateSyncChallengeSubmissionSwr,
    useQueryAiModelsSwr,
    useQueryMyAiSettingsSwr,
    useQueryMyCreditUsageSwr,
    useSubmissionAttemptsOverlayState,
} from "@/hooks"
import type { AiGradableModel } from "@/modules/api"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import {
    ChallengeSubmissionEntity,
    JobCategory,
    JobStatus,
    UserChallengeSubmissionEntity,
    WithClassNames,
} from "@/modules/types"
import { FormikErrors, FormikTouched } from "formik"
import {
    setActiveChallengeSubmissionId,
    setChallengeSubmissionJobId,
} from "@/redux/slices"
import { useAppDispatch, useAppSelector } from "@/redux"
import { runGraphQLWithToast } from "@/modules/toast"
import _ from "lodash"
import { resolveChallengeSubmissionJobEnvelope } from "@/components/utils"
import type {
    ChallengeGradeSelection,
    ChallengeSubmissionRowViewModel,
} from "./types"
import { SUBMISSION_ICON_MAP } from "./map"
import { AUTO_GRADE_SELECTION, resolveInitialGradeSelection } from "./utils"
import { SubmissionRow } from "./SubmissionRow"

/** Props for {@link ChallengeSubmissionPanel} — state comes from Formik and Redux. */
type ChallengeSubmissionPanelProps = WithClassNames<undefined> & {
    /** SCHEMA V2: active programming language to submit with (selects the approach-criteria bucket). */
    lang?: string
}

/**
 * Left-column container of {@link ChallengeModal}: a grading-lane selector plus an inline
 * form per challenge requirement (URL input, job status, submit and history actions).
 *
 * Container: owns Formik form state, SWR data, Redux job/loading state and the socket
 * subscription, derives one view-model per row, and pushes `onXXX` handlers down to the
 * presentational {@link SubmissionRow} children. Marked `"use client"` for hooks/state.
 * @param props - Class names for the component.
 */
export const ChallengeSubmissionPanel = (props: ChallengeSubmissionPanelProps) => {
    const { className, lang } = props
    const formik = useEditSubmissionForm()
    const {
        values,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
    } = formik
    const { open: openSubmissionAttempts } = useSubmissionAttemptsOverlayState()
    const submitChallengeSubmissionSwr = useMutateSubmitChallengeSubmissionSwr()
    const syncSubmissionSwr = useMutateSyncChallengeSubmissionSwr()
    const dispatch = useAppDispatch()
    const loadingChallengeSubmissionIds = useAppSelector(
        (state) => state.challenge.loadingChallengeSubmissionIds,
    )
    const submissionIdToJobId = useAppSelector((state) => state.challenge.submissionIdToJobId)
    const aiProcessingData = useAppSelector((state) => state.modal.aiProcessingData)
    const locale = useLocale()
    const router = useRouter()
    // Credit usage snapshot (source of truth: credit_usage_histories), Redis-cached.
    const creditUsageSwr = useQueryMyCreditUsageSwr()
    const creditUsage = creditUsageSwr.data
    // AI usage details live in the AiQuota modal; the panel only links into it.
    const { open: openAiQuota } = useAiQuotaOverlayState()
    // Route to the AI subscription page so the user can top up their quota.
    const onAddQuota = useCallback(
        () => {
            router.push(`/${locale}/profile/ai-subscription`)
        },
        [
            router,
            locale,
        ],
    )
    const jobNotificationsSocket = useJobNotificationsSocketIo()
    const jobStatusByJobId = useAppSelector((state) => state.socketIo.jobStatusByJobId)

    const config = useAppSelector((state) => state.system.config)
    const passThreshold = config?.challenge?.passThreshold ?? 0

    // grading lane + model the user picks per row; premium models gated by entitlement
    const myAiSettingsSwr = useQueryMyAiSettingsSwr()
    const aiSettings = myAiSettingsSwr.data
    const aiModelsSwr = useQueryAiModelsSwr()
    const canPremium = Boolean(aiSettings?.canPremium)

    /** Enabled models the grading dropdown can offer. */
    const gradableModels = useMemo<Array<AiGradableModel>>(
        () => aiModelsSwr.data?.aiModels?.data?.gradableModels ?? [],
        [
            aiModelsSwr.data,
        ],
    )

    /** Per-row grading-lane + model selection, keyed by submission id. */
    const [selectionBySubmissionId, setSelectionBySubmissionId] =
        useState<Record<string, ChallengeGradeSelection>>({})

    /** Submissions sorted by their requirement order. */
    const sortedSubmissions = useMemo(
        () => _.cloneDeep(values.submissions ?? []).sort((prev, next) => prev.sortIndex - next.sortIndex),
        [
            values.submissions,
        ],
    )

    /** Active AI-processing job id for the challenge-submit flow, from the modal state. */
    const modalJobId = useMemo(
        () => aiProcessingData?.category === JobCategory.SubmitChallenge
            ? aiProcessingData.jobId
            : undefined,
        [
            aiProcessingData,
        ],
    )

    /** One ready-to-render view-model per submission row. */
    const rows = useMemo<Array<ChallengeSubmissionRowViewModel>>(
        () => sortedSubmissions
            .map<ChallengeSubmissionRowViewModel | null>((submission) => {
                const index = values.submissions?.findIndex(
                    (candidate) => candidate.id === submission.id,
                ) ?? -1
                if (index < 0) {
                    return null
                }
                const errorMessage = (
                    (errors.submissions?.[index] as unknown as FormikErrors<ChallengeSubmissionEntity>)
                        ?.userSubmission as unknown as FormikErrors<UserChallengeSubmissionEntity>
                )?.submissionUrl
                const isTouched = !!(
                    (touched.submissions?.[index] as unknown as FormikTouched<ChallengeSubmissionEntity>)
                        ?.userSubmission as unknown as FormikTouched<UserChallengeSubmissionEntity>
                )?.submissionUrl
                const jobEnvelope = resolveChallengeSubmissionJobEnvelope(
                    submission.id,
                    submissionIdToJobId,
                    jobStatusByJobId,
                )
                const rowJobStatus = jobEnvelope?.data?.status
                const rowSubmitJobId = submissionIdToJobId[submission.id]
                const activeJobId = modalJobId && rowSubmitJobId && modalJobId === rowSubmitJobId
                    ? modalJobId
                    : undefined
                const activeJobStatus = activeJobId
                    ? jobStatusByJobId[activeJobId]?.data?.status
                    : undefined
                const activeJobError = activeJobId
                    ? jobStatusByJobId[activeJobId]?.data?.error
                    : undefined
                const isBusy = rowJobStatus === JobStatus.Queued
                    || rowJobStatus === JobStatus.Processing
                return {
                    submission,
                    index,
                    fieldName: `submissions.${index}.userSubmission.submissionUrl`,
                    inputId: `challenge-submission-url-${submission.id}`,
                    urlValue: values.submissions?.[index]?.userSubmission?.submissionUrl ?? "",
                    iconComponent: SUBMISSION_ICON_MAP[submission.type],
                    errorMessage: typeof errorMessage === "string" ? errorMessage : undefined,
                    isTouched,
                    rowJobStatus,
                    isPending: isSubmitting || isBusy,
                    isInputDisabled: isBusy,
                    isLoading: loadingChallengeSubmissionIds.includes(submission.id),
                    activeJobStatus,
                    activeJobError,
                    showActiveJob: activeJobId !== undefined && activeJobStatus !== undefined,
                    lastAttemptScore: submission.userSubmission?.lastAttempt?.score ?? undefined,
                    maxScore: submission.score ?? 0,
                }
            })
            .filter((row): row is ChallengeSubmissionRowViewModel => row !== null),
        [
            sortedSubmissions,
            values.submissions,
            errors.submissions,
            touched.submissions,
            submissionIdToJobId,
            jobStatusByJobId,
            modalJobId,
            isSubmitting,
            loadingChallengeSubmissionIds,
        ],
    )

    // seed each row's selection once its data + the model catalog are available:
    // restore the persisted pick if any, otherwise default to a premium model
    useEffect(() => {
        const submissions = values.submissions ?? []
        if (submissions.length === 0) {
            return
        }
        setSelectionBySubmissionId((prev) => {
            let changed = false
            const next = { ...prev }
            for (const submission of submissions) {
                if (next[submission.id]) {
                    continue
                }
                next[submission.id] = resolveInitialGradeSelection(
                    submission.userSubmission,
                    gradableModels,
                    canPremium,
                )
                changed = true
            }
            return changed ? next : prev
        })
    }, [
        values.submissions,
        gradableModels,
        canPremium,
    ])

    /**
     * Update one row's grading-lane + model selection and sync it to the
     * backend (upserts the user submission row, creating it if missing). URL is
     * intentionally omitted so this never trips URL validation.
     */
    const onSelectGrade = useCallback(
        (submissionId: string, selection: ChallengeGradeSelection) => {
            setSelectionBySubmissionId((prev) => ({
                ...prev,
                [submissionId]: selection,
            }))
            void runGraphQLWithToast(
                async () => {
                    const response = await syncSubmissionSwr.trigger({
                        id: submissionId,
                        selectedMode: selection.mode,
                        selectedModel: selection.model ?? undefined,
                        selectedModelProvider: selection.provider ?? undefined,
                    })
                    const result = response.data?.syncSubmission
                    if (!result?.success) {
                        throw new Error(response.error?.message)
                    }
                    return result
                },
                {
                    showSuccessToast: false,
                    showErrorToast: true,
                },
            )
        },
        [
            syncSubmissionSwr,
        ],
    )

    const onChangeUrl = useCallback(
        (fieldName: string, value: string) => {
            setFieldValue(fieldName, value)
        },
        [
            setFieldValue,
        ],
    )

    const onBlurUrl = useCallback(
        (fieldName: string) => {
            setFieldTouched(fieldName, true)
        },
        [
            setFieldTouched,
        ],
    )

    /** Submit a single row's URL for grading and subscribe to its job notifications. */
    const onSubmit = useCallback(
        async (submissionId: string, index: number) => {
            await runGraphQLWithToast(
                async () => {
                    // call the submit mutation with the typed URL + this row's
                    // chosen grading lane + model
                    const selection = selectionBySubmissionId[submissionId]
                    const response = await submitChallengeSubmissionSwr.trigger({
                        challengeSubmissionId: submissionId,
                        githubUrl: values.submissions?.[index]?.userSubmission?.submissionUrl?.trim()
                            || undefined,
                        mode: selection?.mode,
                        selectedModel: selection?.model ?? undefined,
                        selectedModelProvider: selection?.provider ?? undefined,
                        // SCHEMA V2: send the active language tab; backend falls back to the stored one if absent
                        lang,
                    })
                    const result = response.data?.submitChallengeSubmission
                    if (!result) {
                        throw new Error(response.error?.message)
                    }
                    // track the new job and subscribe to its live notifications
                    const newJobId = result.data?.jobId
                    if (newJobId) {
                        dispatch(setChallengeSubmissionJobId({
                            submissionId,
                            jobId: newJobId,
                        }))
                        jobNotificationsSocket.emit(
                            PublicationEvent.SubscribeJobNotification,
                            {
                                data: {
                                    jobId: newJobId,
                                },
                                locale,
                            },
                        )
                    }
                    return result
                },
                {
                    showSuccessToast: true,
                    showErrorToast: true,
                },
            )
        },
        [
            submitChallengeSubmissionSwr,
            values.submissions,
            selectionBySubmissionId,
            dispatch,
            jobNotificationsSocket,
            locale,
            lang,
        ],
    )

    /** Open the attempt-history overlay for a submission. */
    const onViewAttempts = useCallback(
        (submissionId: string) => {
            dispatch(setActiveChallengeSubmissionId(submissionId))
            openSubmissionAttempts()
        },
        [
            dispatch,
            openSubmissionAttempts,
        ],
    )

    return (
        <div className={cn(className, "flex flex-col")}>
            {rows.map((row) => (
                <SubmissionRow
                    key={row.submission.id}
                    row={row}
                    passThreshold={passThreshold}
                    gradeModels={gradableModels}
                    gradeSelection={
                        selectionBySubmissionId[row.submission.id] ?? AUTO_GRADE_SELECTION
                    }
                    canPremium={canPremium}
                    creditUsage={creditUsage ?? undefined}
                    onOpenAiQuota={openAiQuota}
                    onChangeUrl={onChangeUrl}
                    onBlurUrl={onBlurUrl}
                    onSubmit={onSubmit}
                    onSelectGrade={onSelectGrade}
                    onUpgrade={onAddQuota}
                    onViewAttempts={onViewAttempts}
                />
            ))}
        </div>
    )
}
