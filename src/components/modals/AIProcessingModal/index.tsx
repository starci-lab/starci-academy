"use client"

import React, { useMemo } from "react"
import { Modal } from "@heroui/react"
import { useAppSelector } from "@/redux"
import {
    JobStatus,
    JobType,
} from "@/modules/types"
import { AIProcessingModalKind } from "@/redux/slices"
import {
    CheckCircleIcon,
    QueueIcon,
    SparkleIcon,
    WarningOctagonIcon,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAIProcessingOverlayState } from "@/hooks/singleton"

/**
 * Modal overlay shown while an AI review job is processing.
 * Renders different layouts for Task (personal project) vs Challenge kinds.
 * Controlled by `useAIProcessingOverlayState` singleton.
 */
export const AIProcessingModal = () => {
    const t = useTranslations()
    const { isOpen, setOpen } = useAIProcessingOverlayState()
    const aiProcessingData = useAppSelector((state) => state.modal.aiProcessingData)
    const kind = aiProcessingData?.kind ?? AIProcessingModalKind.Challenge
    const trackedJobId = aiProcessingData?.jobId

    const taskJobStatus = useAppSelector((state) => state.milestone.reviewJobStatus)
    const taskJobError = useAppSelector((state) => state.milestone.reviewJobError)
    const jobStatusByJobId = useAppSelector((state) => state.socketIo.jobStatusByJobId)

    const statusObj = useMemo(() => {
        switch (kind) {
        case AIProcessingModalKind.Task:
            return { status: taskJobStatus, error: taskJobError }
        case AIProcessingModalKind.Challenge: {
            const entries = Object.values(jobStatusByJobId)
            const challengeEntries = entries.filter(
                (entry) =>
                    entry.data?.jobType === JobType.SubmitChallenge ||
                    entry.data?.jobType === undefined,
            )
            const active = challengeEntries.find(
                (entry) =>
                    entry.data?.status === JobStatus.Queued ||
                        entry.data?.status === JobStatus.Processing,
            )
            const latest = challengeEntries[challengeEntries.length - 1]
            return {
                status: active?.data?.status ?? latest?.data?.status,
                error: active?.data?.error ?? latest?.data?.error,
            }
        }
        case AIProcessingModalKind.Cv: {
            const entry = trackedJobId ? jobStatusByJobId[trackedJobId] : undefined
            return {
                status: entry?.data?.status,
                error: entry?.data?.error,
            }
        }
        default:
            return { status: undefined, error: undefined }
        }
    }, [kind, taskJobStatus, taskJobError, jobStatusByJobId, trackedJobId])

    const jobStatus = statusObj.status ?? (kind === AIProcessingModalKind.Cv ? JobStatus.Queued : undefined)
    const jobError = statusObj.error

    const prefix = kind === AIProcessingModalKind.Task
        ? "aiProcessing.task"
        : kind === AIProcessingModalKind.Cv
            ? "aiProcessing.cv"
            : "aiProcessing.challenge"

    const config = useMemo(() => {
        switch (jobStatus) {
        case JobStatus.Queued:
            return {
                title: t(`${prefix}.queued.title`),
                description: t(`${prefix}.queued.description`),
            }
        case JobStatus.Processing:
            return {
                title: t(`${prefix}.processing.title`),
                description: t(`${prefix}.processing.description`),
            }
        case JobStatus.Completed:
            return {
                title: t(`${prefix}.completed.title`),
                description: t(`${prefix}.completed.description`),
            }
        case JobStatus.Failed:
            return {
                title: t(`${prefix}.failed.title`),
                description: t(`${prefix}.failed.description`),
            }
        default:
            return null
        }
    }, [jobStatus, t, prefix])

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.Body>
                            <ChallengeProcessingContent
                                jobStatus={jobStatus}
                                title={config?.title}
                                description={config?.description}
                                error={jobError}
                            />
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}

interface ProcessingContentProps {
    /** Current job status. */
    jobStatus?: JobStatus
    /** Title text. */
    title?: string
    /** Description text. */
    description?: string
    /** Error detail when failed. */
    error?: string
}

/**
 * Challenge kind: centered icon layout (original style).
 * @param props - Processing content props.
 */
const ChallengeProcessingContent = ({ jobStatus, title, description, error }: ProcessingContentProps) => {
    const iconMap: Partial<Record<JobStatus, React.ReactNode>> = {
        [JobStatus.Queued]: <QueueIcon className="size-12 text-muted animate-pulse" />,
        [JobStatus.Processing]: <SparkleIcon className="size-12 text-warning animate-pulse" />,
        [JobStatus.Completed]: <CheckCircleIcon className="size-12 text-success" />,
        [JobStatus.Failed]: <WarningOctagonIcon className="size-12 text-danger" />,
    }
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-8 px-4">
            {jobStatus && iconMap[jobStatus]}
            <div className="text-lg font-bold text-center">{title}</div>
            <div className="text-sm text-muted text-center max-w-sm">{description}</div>
            {jobStatus === JobStatus.Failed && error && (
                <div className="text-sm text-danger break-all">{error}</div>
            )}
        </div>
    )
}

