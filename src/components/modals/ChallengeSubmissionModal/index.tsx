"use client"

import React, { useCallback } from "react"
import {
    Button,
    FieldError,
    Input,
    Modal,
    ScrollShadow,
    Spinner,
    Surface,
    TextField,
} from "@heroui/react"
import {
    PublicationEvent,
    useChallengeSubmissionOverlayState,
    useEditSubmissionFormik,
    useMutateSubmitChallengeSubmissionSwr,
    useSubmissionAttemptsOverlayState,
} from "@/hooks/singleton"
import { useLocale, useTranslations } from "next-intl"
import { ChallengeSubmissionEntity, JobStatus, SubmissionType, UserChallengeSubmissionEntity } from "@/modules/types"
import { FormikErrors, FormikTouched } from "formik"
import { SiGithub, SiGoogledrive } from "@icons-pack/react-simple-icons"
import { setChallengeSubmissionId } from "@/redux/slices"
import { useAppDispatch, useAppSelector } from "@/redux"
import { AppModalHeader } from "../AppModalHeader"
import { runGraphQLWithToast } from "@/modules/toast"
import { useJobNotificationsSocketIo } from "@/hooks/singleton"
import { WarningOctagonIcon, SparkleIcon, QueueIcon, CheckCircleIcon, TrophyIcon } from "@phosphor-icons/react"

/**
 * Challenge submission modal: lists each requirement with a Formik-bound URL field.
 */
export const ChallengeSubmissionModal = () => {
    const { isOpen, onOpenChange } = useChallengeSubmissionOverlayState()
    const formik = useEditSubmissionFormik()
    const { values, errors, touched, setFieldValue, setFieldTouched, isSubmitting } = formik
    const { onOpen: onOpenSubmissionAttempts } = useSubmissionAttemptsOverlayState()
    const t = useTranslations()
    const iconMap: Record<SubmissionType, React.ReactNode> = {
        [SubmissionType.GithubUrl]: <SiGithub size={16} />,
        [SubmissionType.GoogleDocsUrl]: <SiGoogledrive size={16} />,
    }
    const submitChallengeSubmissionSwr = useMutateSubmitChallengeSubmissionSwr()
    const dispatch = useAppDispatch()
    const loadingChallengeSubmissionIds = useAppSelector((state) => state.challenge.loadingChallengeSubmissionIds)
    const sortedSubmissions = React.useMemo(() => {
        if (!values.submissions?.length) {
            return []
        }
        return [...values.submissions].sort((a, b) => a.orderIndex - b.orderIndex)
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
                <div className="flex items-center gap-2 mt-3">
                    {data.icon}
                    <div className="text-sm text-muted">{data.label}</div>
                </div>
            )
        },
        [jobStatusByJobId, t],
    )

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container className="modal__container--narrow" size="lg">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <AppModalHeader title={t("challenge.submissionModal.title")} />
                        <Modal.Body>
                            <ScrollShadow hideScrollBar>
                                {!values.submissions?.length ? (
                                    <div className="text-sm text-foreground-600">
                                        {t("challenge.submissionModal.empty")}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {sortedSubmissions.map((submission) => {
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
                                                (
                                                    touched.submissions?.[index] as unknown as FormikTouched<ChallengeSubmissionEntity>
                                                )?.userSubmission as unknown as FormikTouched<UserChallengeSubmissionEntity>
                                            )?.submissionUrl
                                            const fieldName =
                                                `submissions.${index}.userSubmission.submissionUrl` as const
                                            const inputId = `challenge-submission-url-${submission.id}`
                                            return (
                                                <Surface key={submission.id} className="w-full rounded-3xl p-0" variant="secondary">
                                                    <div className="p-3">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <div className="text-sm">
                                                                    {submission.orderIndex + 1}
                                                                    {". "}
                                                                    {submission.title}
                                                                </div>
                                                                {iconMap[submission.type]}
                                                            </div>
                                                            <div className="h-1.5" />
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
                                                                    id={inputId}
                                                                    name={fieldName}
                                                                    disabled={jobStatusByJobId[submission.id]?.data?.status === JobStatus.Queued || jobStatusByJobId[submission.id]?.data?.status === JobStatus.Processing}
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
                                                                    isDisabled={isSubmitting || jobStatusByJobId[submission.id]?.data?.status === JobStatus.Queued || jobStatusByJobId[submission.id]?.data?.status === JobStatus.Processing}
                                                                    size="lg"
                                                                    variant="primary"
                                                                    onPress={async () => {
                                                                        await runGraphQLWithToast(
                                                                            async () => {
                                                                                const response = await submitChallengeSubmissionSwr.trigger({
                                                                                    challengeSubmissionId: submission.id,
                                                                                })
                                                                                const result =
                                                                                response.data?.submitChallengeSubmission
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
                                                                        dispatch(setChallengeSubmissionId(submission.id))
                                                                        onOpenSubmissionAttempts()
                                                                    }}
                                                                >
                                                                    {t("challenge.submissionModal.viewAttempts")}
                                                                </Button>      
                                                            </div>
                                                            
                                                            {
                                                                jobStatusByJobId[submission.id]
                                                                    ? renderJobNotification(
                                                                        submission.id,
                                                                    )
                                                                    : 
                                                                    loadingChallengeSubmissionIds.includes(
                                                                        submission.id
                                                                    ) ? (
                                                                            <div className="flex items-center gap-2 mt-3">
                                                                                <Spinner />
                                                                                <div className="text-sm text-muted">
                                                                                    {t("challenge.submissionModal.loading")}
                                                                                </div>
                                                                            </div>
                                                                        ) : null
                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        submission.userSubmission?.lastAttempt ? (
                                                            <div className="p-3 border-t border-divider">
                                                                <div className="flex gap-2 text-sm text-muted">
                                                                    <TrophyIcon className="size-5 min-w-5 min-h-5" />
                                                                    <span>
                                                                        {t("challenge.submissionModal.lastAttemptScore", {
                                                                            earned:
                                                                                submission.userSubmission.lastAttempt.score ?? 0,
                                                                            max: submission.score ?? 0,
                                                                        })}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : null
                                                    }
                                                </Surface>
                                            )
                                        })}
                                    </div>
                                )}
                                
                            </ScrollShadow>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
