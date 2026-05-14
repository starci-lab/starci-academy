"use client"

import React, {
    useEffect,
    useMemo,
} from "react"
import { Modal } from "@heroui/react"
import { useAppSelector } from "@/redux"
import {
    JobStatus,
} from "@/modules/types"
import {
    CheckCircleIcon,
    QueueIcon,
    SparkleIcon,
    WarningOctagonIcon,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAIProcessingOverlayState } from "@/hooks/singleton"
import { resolveAiProcessingCopy } from "@/components/utils"

/**
 * Modal overlay shown while an AI review job is processing.
 * Copy keys: `aiProcessing.submitChallenge|reviewTask|reviewCv` × status phase.
 * Overlay `open` is driven from Redux: whenever `setAiProcessingModalData` runs (typically
 * from the job-notifications socket handler), this component opens the modal so callers
 * do not need to invoke `useAIProcessingOverlayState().open` manually.
 */
export const AIProcessingModal = () => {
    const t = useTranslations()
    const { isOpen, setOpen, open } = useAIProcessingOverlayState()
    const jobCategory = useAppSelector((state) => state.modal.aiProcessingData?.category)
    const jobId = useAppSelector((state) => state.modal.aiProcessingData?.jobId)

    useEffect(() => {
        if (!jobId || jobCategory == null) {
            return
        }
        open()
    }, [
        jobCategory,
        jobId,
        open,
    ])
    const jobStatusByJobId = useAppSelector((state) => state.socketIo.jobStatusByJobId)
    const jobStatus = jobStatusByJobId[jobId ?? ""]?.data?.status
    const envelopeError = jobStatusByJobId[jobId ?? ""]?.data?.error

    /**
     * Resolve the data for the modal.
     */
    const data = useMemo(() => {
        if (!jobCategory || !jobStatus) {
            return null
        }
        return resolveAiProcessingCopy(
            t,
            {
                jobCategory,
                jobStatus,
                ...(jobStatus === JobStatus.Failed && envelopeError
                    ? { error: envelopeError }
                    : {}),
            },
        )
    }, [
        t,
        jobCategory,
        jobStatus,
        envelopeError,
    ])

    /**
     * Map of job status to icon.
     */
    const iconMap: Partial<Record<JobStatus, React.ReactNode>> = {
        [JobStatus.Queued]: <QueueIcon className="size-12 text-muted animate-pulse" />,
        [JobStatus.Processing]: <SparkleIcon className="size-12 text-warning animate-pulse" />,
        [JobStatus.Completed]: <CheckCircleIcon className="size-12 text-success" />,
        [JobStatus.Failed]: <WarningOctagonIcon className="size-12 text-danger" />,
    }

    /**
     * Render the modal.
     */
    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.Body>
                            <div className="flex flex-col items-center justify-center gap-4 py-8 px-4">
                                {jobStatus && iconMap[jobStatus]}
                                <div className="text-lg font-bold text-center">{data?.title}</div>
                                <div className="text-sm text-muted text-center max-w-sm">{data?.description}</div>
                                {jobStatus === JobStatus.Failed && data?.error && (
                                    <div className="text-sm text-danger break-all">{data.error}</div>
                                )}
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
