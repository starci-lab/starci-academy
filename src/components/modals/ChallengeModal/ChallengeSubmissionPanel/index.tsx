"use client"

import React, { useMemo } from "react"
import {
    Button,
    Chip,
    FieldError,
    Input,
    Spinner,
    TextField,
} from "@heroui/react"
import {
    useEditSubmissionFormik,
    useMutateSubmitChallengeSubmissionSwr,
    useSubmissionAttemptsOverlayState,
} from "@/hooks/singleton"
import { useLocale, useTranslations } from "next-intl"
import {
    ChallengeSubmissionEntity,
    JobCategory,
    JobStatus,
    SubmissionType,
    UserChallengeSubmissionEntity,
    WithClassNames,
} from "@/modules/types"
import { FormikErrors, FormikTouched } from "formik"
import { SiGithub, SiGoogledrive } from "@icons-pack/react-simple-icons"
import { setActiveChallengeSubmissionId, setChallengeSubmissionJobId } from "@/redux/slices"
import { useAppDispatch, useAppSelector } from "@/redux"
import { runGraphQLWithToast } from "@/modules/toast"
import { Icon, PencilLineIcon } from "@phosphor-icons/react"
import _ from "lodash"
import { cn } from "@heroui/react"
import {
    PublicationEvent,
    useJobNotificationsSocketIo,
} from "@/hooks/singleton"
import { AIProcessingText } from "@/components/reuseable"
import { resolveChallengeSubmissionJobEnvelope } from "@/components/utils"

/** Props for {@link ChallengeSubmissionPanel} — state comes from Formik and Redux. */
type ChallengeSubmissionPanelProps = WithClassNames<undefined>

type SubmissionIconMap = Record<
    SubmissionType,
    Icon
>

/**
 * Inline form for each challenge requirement URL, job status, and per-row submit / history actions.
 * Intended for the left column of {@link ChallengeModal}.
 * @param props - Class names for the component.
 */
export const ChallengeSubmissionPanel = (props: ChallengeSubmissionPanelProps) => {
    const { className } = props
    const formik = useEditSubmissionFormik()
    const { values, errors, touched, setFieldValue, setFieldTouched, isSubmitting } = formik
    const { open: openSubmissionAttempts } = useSubmissionAttemptsOverlayState()
    const t = useTranslations()
    const iconMap: SubmissionIconMap = {
        [SubmissionType.GithubUrl]: SiGithub,
        [SubmissionType.GoogleDocsUrl]: SiGoogledrive,
    }
    const submitChallengeSubmissionSwr = useMutateSubmitChallengeSubmissionSwr()
    const dispatch = useAppDispatch()
    const loadingChallengeSubmissionIds = useAppSelector(
        (state) => state.challenge.loadingChallengeSubmissionIds,
    )
    const submissionIdToJobId = useAppSelector((state) => state.challenge.submissionIdToJobId)
    const aiProcessingData = useAppSelector((state) => state.modal.aiProcessingData)
    const sortedSubmissions = useMemo(() => {
        return _.cloneDeep(values.submissions ?? []).sort((prev, next) => prev.orderIndex - next.orderIndex)
    }, [values.submissions])
    const locale = useLocale()
    const jobNotificationsSocket = useJobNotificationsSocketIo()
    const jobStatusByJobId = useAppSelector((state) => state.socketIo.jobStatusByJobId)

    const config = useAppSelector((state) => state.system.config)
    const passThreshold = config?.challenge?.passThreshold ?? 0

    return (
        <div className={cn(className, "flex flex-col")}>
            {_.cloneDeep(sortedSubmissions).sort((prev, next) => prev.orderIndex - next.orderIndex).map((submission) => {
                const index =
                            values.submissions?.findIndex((_submission) => _submission.id === submission.id) ?? -1
                if (index < 0) {
                    return null
                }
                const errorKey = (
                            (errors.submissions?.[index] as unknown as FormikErrors<ChallengeSubmissionEntity>)
                                ?.userSubmission as unknown as FormikErrors<UserChallengeSubmissionEntity>
                )?.submissionUrl
                const isTouched = !!(
                            (touched.submissions?.[index] as unknown as FormikTouched<ChallengeSubmissionEntity>)
                                ?.userSubmission as unknown as FormikTouched<UserChallengeSubmissionEntity>
                )?.submissionUrl
                const fieldName = `submissions.${index}.userSubmission.submissionUrl` as const
                const inputId = `challenge-submission-url-${submission.id}`
                const IconComponent = iconMap[submission.type]
                const jobEnvelope = resolveChallengeSubmissionJobEnvelope(
                    submission.id,
                    submissionIdToJobId,
                    jobStatusByJobId,
                )
                const rowJobStatus = jobEnvelope?.data?.status
                const modalJobId =
                    aiProcessingData?.category === JobCategory.SubmitChallenge
                        ? aiProcessingData.jobId
                        : undefined
                const rowSubmitJobId = submissionIdToJobId[submission.id]
                const activeChallengeSubmitJobId =
                    modalJobId && rowSubmitJobId && modalJobId === rowSubmitJobId
                        ? modalJobId
                        : undefined
                const activeChallengeSubmitJobStatus = activeChallengeSubmitJobId
                    ? jobStatusByJobId[activeChallengeSubmitJobId]?.data?.status
                    : undefined
                const activeChallengeSubmitJobError = activeChallengeSubmitJobId
                    ? jobStatusByJobId[activeChallengeSubmitJobId]?.data?.error
                    : undefined
                return (
                    <div key={submission.id} className="border-b last:border-b-0 p-3">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-foreground text-base font-semibold">
                                <div>
                                    {submission.orderIndex + 1}
                                    {". "}
                                    {submission.title}
                                </div>
                                {IconComponent ? <IconComponent size={16} /> : null}
                            </div>
                            <div className="h-2" />
                            <div className="text-xs text-muted">
                                {submission.description}
                            </div>
                            <div className="h-3" />
                            <TextField
                                className="w-full"
                                fullWidth
                                isInvalid={!!(isTouched && errorKey)}
                            >
                                <Input
                                    variant="secondary"
                                    id={inputId}
                                    name={fieldName}
                                    disabled={rowJobStatus === JobStatus.Queued
                                                    || rowJobStatus === JobStatus.Processing
                                    }
                                    placeholder={t("challenge.submissionModal.urlPlaceholder")}
                                    value={values.submissions?.[index]?.userSubmission?.submissionUrl ?? ""}
                                    onBlur={() => setFieldTouched(fieldName, true)}
                                    onChange={(event) => setFieldValue(fieldName, event.target.value)}
                                />
                                <FieldError>
                                    {typeof errorKey === "string" && errorKey.startsWith("challenge.")
                                        ? t(errorKey)
                                        : errorKey}
                                </FieldError>
                            </TextField>
                            <div className="h-3" />
                            {
                                activeChallengeSubmitJobId !== undefined
                                && activeChallengeSubmitJobStatus !== undefined
                                    ? (
                                        <AIProcessingText
                                            className="mb-3"
                                            classNames={{
                                                innerPanel: "bg-overlay",
                                            }}
                                            jobCategory={JobCategory.SubmitChallenge}
                                            jobStatus={activeChallengeSubmitJobStatus}
                                            error={activeChallengeSubmitJobError}
                                        />
                                    )
                                    : loadingChallengeSubmissionIds.includes(submission.id)
                                        ? (
                                            <div className="mt-3 flex items-center gap-2">
                                                <Spinner />
                                                <div className="text-sm text-muted">
                                                    {t("challenge.submissionModal.loading")}
                                                </div>
                                            </div>
                                        )
                                        : null
                            }
                            <div className="flex gap-2">
                                <Button
                                    isDisabled={isSubmitting
                                                    || rowJobStatus === JobStatus.Queued
                                                    || rowJobStatus === JobStatus.Processing
                                    }
                                    size="lg"
                                    variant="primary"
                                    onPress={async () => {
                                        await runGraphQLWithToast(
                                            async () => {
                                                const response = await submitChallengeSubmissionSwr.trigger(
                                                    {
                                                        challengeSubmissionId: submission.id,
                                                        githubUrl: values.submissions?.[index]?.userSubmission?.submissionUrl?.trim()
                                                        || undefined,
                                                    }
                                                )
                                                const result = response.data?.submitChallengeSubmission
                                                if (!result) {
                                                    throw new Error(response.error?.message)
                                                }
                                                const newJobId = result.data?.jobId
                                                if (newJobId) {
                                                    dispatch(setChallengeSubmissionJobId({
                                                        submissionId: submission.id,
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
                                    }}
                                >
                                    {({
                                        isPending
                                    }) => (<>
                                        {
                                            isPending ? <Spinner color="current"/> : <PencilLineIcon className="size-5" />}
                                        {
                                            t("challenge.submissionModal.submit")
                                        }
                                    </>
                                    )
                                    }
                                </Button>
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    onPress={() => {
                                        dispatch(setActiveChallengeSubmissionId(submission.id))
                                        openSubmissionAttempts()
                                    }}
                                >
                                    {t("challenge.submissionModal.viewAttempts")}
                                </Button>
                            </div>
                        </div>
                        {submission.userSubmission?.lastAttempt ? (
                            <div>
                                <div className="border-t border-divider"/>
                                <div className="h-3"/>
                                {
                                    (() => {
                                        const isPassed = (submission.userSubmission?.lastAttempt?.score ?? 0) >= (submission.score ?? 0) * passThreshold
                                        return (
                                            <div className="flex gap-2 text-sm text-muted items-center">
                                                <Chip color={isPassed ? "success" : "danger"} size="sm" variant="soft">
                                                    <Chip.Label>
                                                        {t(isPassed ? "challenge.pass" : "challenge.fail")}
                                                    </Chip.Label>
                                                </Chip>
                                                <span className="text-xs">
                                                    {t.rich("challenge.submissionModal.lastAttemptScoreWithRequirement", {
                                                        earned: submission.userSubmission.lastAttempt.score ?? 0,
                                                        max: submission.score ?? 0,
                                                        required: (submission.score ?? 0) * passThreshold,
                                                        n: (chunks) => (
                                                            <span className="text-foreground">{chunks}</span>
                                                        ),
                                                    })}
                                                </span>
                                            </div>
                                        )
                                    })()
                                }
                              
                            </div>
                        ) 
                            : null
                        }
                    </div>
                )
            })}
        </div>
    )
}
