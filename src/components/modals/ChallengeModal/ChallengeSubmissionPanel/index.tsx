"use client"

import React, { useCallback, useMemo } from "react"
import {
    Button,
    Chip,
    FieldError,
    Input,
    Spinner,
    TextField,
} from "@heroui/react"
import {
    PublicationEvent,
    useEditSubmissionFormik,
    useJobNotificationsSocketIo,
    useMutateSubmitChallengeSubmissionSwr,
    useSubmissionAttemptsOverlayState,
} from "@/hooks/singleton"
import { useLocale, useTranslations } from "next-intl"
import {
    ChallengeSubmissionEntity,
    JobStatus,
    SubmissionType,
    UserChallengeSubmissionEntity,
    WithClassNames,
} from "@/modules/types"
import { FormikErrors, FormikTouched } from "formik"
import { SiGithub, SiGoogledrive } from "@icons-pack/react-simple-icons"
import { setActiveChallengeSubmissionId } from "@/redux/slices"
import { useAppDispatch, useAppSelector } from "@/redux"
import { runGraphQLWithToast } from "@/modules/toast"
import {
    CheckCircleIcon,
    Icon,
    QueueIcon,
    SparkleIcon,
    WarningOctagonIcon,
} from "@phosphor-icons/react"
import _ from "lodash"
import { cn } from "@heroui/react"

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
    const { onOpen: onOpenSubmissionAttempts } = useSubmissionAttemptsOverlayState()
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
    const sortedSubmissions = useMemo(() => {
        return _.cloneDeep(values.submissions ?? []).sort((prev, next) => prev.orderIndex - next.orderIndex)
    }, [values.submissions])
    const socket = useJobNotificationsSocketIo()
    const locale = useLocale()
    const jobStatusByJobId = useAppSelector((state) => state.socketIo.jobStatusByJobId)
    const renderJobNotification = useCallback(
        (challengeSubmissionId: string) => {
            const envelope = jobStatusByJobId[challengeSubmissionId]
            if (!envelope) {
                return null
            }
            const status = envelope.data?.status
            if (!status) {
                return null
            }
            const errorDetail = envelope.data?.error
            const data = (() => {
                switch (status) {
                case JobStatus.Queued:
                    return {
                        icon: <QueueIcon className="size-5 min-w-5 min-h-5 text-muted animate-pulse" />,
                        label: t("challenge.submissionModal.jobStatus.queued"),
                    }
                case JobStatus.Processing:
                    return {
                        icon: <SparkleIcon className="size-5 min-w-5 min-h-5 text-warning animate-pulse" />,
                        label: t("challenge.submissionModal.jobStatus.processing"),
                    }
                case JobStatus.Completed:
                    return {
                        icon: <CheckCircleIcon className="size-5 min-w-5 min-h-5 text-success" />,
                        label: t("challenge.submissionModal.jobStatus.completed"),
                    }
                case JobStatus.Failed:
                    return {
                        icon: <WarningOctagonIcon className="size-5 min-w-5 min-h-5 text-danger" />,
                        label: errorDetail ? errorDetail : t("challenge.submissionModal.jobStatus.failed"),
                    }
                default:
                    return {
                        icon: null,
                        label: null,
                    }
                }
            })()
            if (!data.icon) {
                return null
            }
            return (
                <div className="mt-3 flex items-center gap-2">
                    {data.icon}
                    <div className="text-sm text-muted">{data.label}</div>
                </div>
            )
        },
        [jobStatusByJobId, t],
    )
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
                                    disabled={jobStatusByJobId[submission.id]?.data?.status === JobStatus.Queued
                                                    || jobStatusByJobId[submission.id]?.data?.status === JobStatus.Processing
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
                            <div className="flex gap-2">
                                <Button
                                    isDisabled={isSubmitting
                                                    || jobStatusByJobId[submission.id]?.data?.status === JobStatus.Queued
                                                    || jobStatusByJobId[submission.id]?.data?.status
                                                        === JobStatus.Processing
                                    }
                                    size="lg"
                                    variant="primary"
                                    onPress={async () => {
                                        await runGraphQLWithToast(
                                            async () => {
                                                const response = await submitChallengeSubmissionSwr.trigger({
                                                    challengeSubmissionId: submission.id,
                                                })
                                                const result = response.data?.submitChallengeSubmission
                                                if (!result) {
                                                    throw new Error(response.error?.message)
                                                }
                                                const newJobId = result.data?.jobId
                                                if (newJobId) {
                                                    socket.emit(
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
                                    {t("challenge.submissionModal.submit")}
                                </Button>
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    onPress={() => {
                                        dispatch(setActiveChallengeSubmissionId(submission.id))
                                        onOpenSubmissionAttempts()
                                    }}
                                >
                                    {t("challenge.submissionModal.viewAttempts")}
                                </Button>
                            </div>
                            <div className="h-3" />
                            {jobStatusByJobId[submission.id] ? (
                                renderJobNotification(submission.id)
                            ) : loadingChallengeSubmissionIds.includes(submission.id) ? (
                                <div className="mt-3 flex items-center gap-2">
                                    <Spinner />
                                    <div className="text-sm text-muted">
                                        {t("challenge.submissionModal.loading")}
                                    </div>
                                </div>
                            ) : null}
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
