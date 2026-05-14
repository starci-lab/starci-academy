"use client"

import React, {
    useEffect,
    useMemo,
} from "react"
import {
    Button,
    Card,
    CardContent,
    Link,
    Spinner,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useAppSelector,
} from "@/redux"
import {
    useCvApplyFormik,
    useCvReviewFormik,
    useCvReviewLevelDetailsOverlayState,
    useCvSubmissionAttemptsDrawerOverlayState,
    useCvUpdateOverlayState,
    useQueryCvUrlSwr,
    useQueryTemplateCvsSwr,
} from "@/hooks/singleton"
import { 
    AIProcessingText, 
    MarkdownContent, 
    StarCiAIBadge
} from "@/components/reuseable"
import {
    ClockIcon,
    DownloadSimpleIcon,
    FilePdfIcon,
} from "@phosphor-icons/react"
import {
    JobCategory,
    JobStatus,
} from "@/modules/types"
import { dayjs } from "@/modules/dayjs"
import { getFileNameFromUrl } from "@/utils"
import { ScanIcon } from "@phosphor-icons/react"

export interface CVUploadProps {
    /** Optional wrapper classes on the root fragment wrapper (outer div). */
    className?: string
}
/**
 * CV submission block: stored file card, rubric level, review/update actions, and inline job status.
 * @param props - {@link CVUploadProps}
 */
export const CVUpload = ({ className }: CVUploadProps) => {
    /**
     * Translations function.
     */
    const t = useTranslations()
    /**
     * Current locale (dayjs month labels).
     */
    const locale = useLocale()
    /**
     * Formik instance for CV file upload (update modal).
     */
    const formik = useCvApplyFormik()
    /**
     * Formik for queuing CV AI review (`reviewCv`).
     */
    const cvReviewFormik = useCvReviewFormik()
    /**
     * Opens the CV update upload modal.
     */
    const { open: openCvUpdateModal } = useCvUpdateOverlayState()
    /**
     * Opens the rubric level details / picker modal.
     */
    const { open: openReviewLevelDetailsModal } = useCvReviewLevelDetailsOverlayState()
    /**
     * Opens the drawer listing CV upload attempts (fetch gated by overlay open).
     */
    const { open: openCvSubmissionAttemptsDrawer } = useCvSubmissionAttemptsDrawerOverlayState()
    /**
     * Selected file URL.
     */
    const selectedFileUrl = useMemo(() => {
        if (!formik.values.cvFile) return ""
        return URL.createObjectURL(formik.values.cvFile)
    }, [
        formik.values.cvFile,
    ])
    /**
     * CV URL SWR.
     */
    const cvUrlSwr = useQueryCvUrlSwr()
    /**
     * Template CVs SWR.
     */
    const templateCvsSwr = useQueryTemplateCvsSwr()
    /**
     * CV URL payload.
     */
    const cvUrlPayload = useAppSelector((state) => state.cvUrl.entity)
    /**
     * AI processing data.
     */
    const aiProcessingData = useAppSelector((state) => state.modal.aiProcessingData)
    /**
     * Active CV review job ID.
     */
    const activeCvReviewJobId = aiProcessingData?.category === JobCategory.ReviewCv
        ? aiProcessingData.jobId
        : undefined
    /**
     * Active CV review job status.
     */
    const activeCvReviewJobStatus = useAppSelector((state) => activeCvReviewJobId
        ? state.socketIo.jobStatusByJobId[activeCvReviewJobId]?.data?.status
        : undefined)
    /**
     * Active CV review job error.
     */
    const activeCvReviewJobError = useAppSelector((state) => activeCvReviewJobId
        ? state.socketIo.jobStatusByJobId[activeCvReviewJobId]?.data?.error
        : undefined)
    /**
     * Current CV link.
     */
    const currentCvLink = selectedFileUrl || (cvUrlPayload?.cvUrl ?? "")
    /**
     * Current CV link label.
     */
    const currentCvLinkLabel =
        formik.values.cvFile?.name ||
        (
            cvUrlPayload?.cvUrl ?
                getFileNameFromUrl(cvUrlPayload.cvUrl)
                : t("cv.submission.defaultCvFileName")
        )
    /**
     * Rubric templates from Redux (hydrated by `useQueryTemplateCvsSwr` core).
     */
    const templateCvs = useAppSelector((state) => state.templateCvs.rows)
    /**
     * Human-readable submission time: `HH:mm, D MMM YYYY` (e.g. `15:33, 23 Jan 2024`).
     */
    const submittedAtLabel = useMemo(() => {
        const raw = cvUrlPayload?.submittedAt
        if (!raw) {
            return t("cv.submission.submittedAtPending")
        }
        const d = dayjs(raw)
        if (!d.isValid()) {
            return t("cv.submission.submittedAtPending")
        }
        const dayjsLocale = locale.startsWith("vi") ? "vi" : "en"
        return d.locale(dayjsLocale).format("HH:mm, D MMMM YYYY")
    }, [
        cvUrlPayload?.submittedAt,
        locale,
        t,
    ])
    /**
     * Handle CV URL SWR.
     */
    useEffect(
        () => {
            if (activeCvReviewJobStatus !== JobStatus.Completed) {
                return
            }
            void cvUrlSwr.mutate()
        }, [
            activeCvReviewJobStatus,
            cvUrlSwr,
        ]
    )

    /**
     * Handle selected file URL.
     */
    useEffect(
        () => {
            return () => {
                if (selectedFileUrl) URL.revokeObjectURL(selectedFileUrl)
            }
        }, [
            selectedFileUrl,
        ]
    )

    const templateCv = useMemo(
        () =>
            templateCvs.find((templateCv) => templateCv.id === cvReviewFormik.values.templateCvId),
        [
            templateCvs,
            cvReviewFormik.values.templateCvId,
        ],
    )

    const feedbackMarkdown = useMemo(() => {
        const detail = cvUrlPayload?.detailFeedback?.trim()
        if (detail) {
            return detail
        }
        return t("cv.submission.feedbackSummary")
    }, [
        cvUrlPayload?.detailFeedback,
        t,
    ])
    /**
     * When the backend already returned AI markdown feedback, primary CTA copy becomes “re-run”.
     */
    const hasPersistedAiFeedback = useMemo(
        () => Boolean(cvUrlPayload?.detailFeedback?.trim()),
        [
            cvUrlPayload?.detailFeedback,
        ],
    )

    return (
        <div className={className}>
            <div>
                <div className="mb-3 text-base font-semibold">{t("cv.submission.fileCardTitle")}</div>
                <Card className="w-full shadow-none">
                    <CardContent className="flex items-center">
                        <div className="flex w-full items-center justify-between gap-3">
                            <div className="flex min-w-0 flex-1 items-center gap-2">
                                <FilePdfIcon className="size-10 text-muted" />
                                <div className="min-w-0 flex-1" title={currentCvLinkLabel}>
                                    {
                                        currentCvLink ? (
                                            <Link
                                                href={currentCvLink}
                                                target="_blank"
                                                className="block w-full truncate text-sm text-accent underline"
                                            >
                                                {currentCvLinkLabel}
                                            </Link>
                                        ) : (
                                            <span className="block w-full truncate text-sm text-muted">
                                                {currentCvLinkLabel}
                                            </span>
                                        )}
                                    <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                                        <ClockIcon className="size-4" />
                                        {submittedAtLabel}
                                    </div>
                                </div>
                            </div>
                            {
                                currentCvLink && (
                                    <Link
                                        href={currentCvLink}
                                        target="_blank"
                                    >
                                        <DownloadSimpleIcon className="size-5 text-muted" />
                                    </Link>
                                )
                            }
                        </div>
                    </CardContent>
                </Card>
                <div className="h-3" />
                <Button variant="secondary" onPress={openCvUpdateModal}>
                    {t("cv.submission.updateAction")}
                </Button>
            </div>
            <div className="h-6" />
            <div>
                <div className="mb-3 text-base font-semibold">{t("cv.submission.reviewLevelLabel")}</div>
                <Card className="w-full shadow-none">
                    <CardContent>
                        <div className="mb-2">{templateCv?.title}</div>
                        <div className="text-sm text-muted">
                            {templateCv?.description}
                        </div>
                    </CardContent>
                </Card>
                <div className="h-3" />
                <Button
                    variant="secondary"
                    isDisabled={formik.isSubmitting || templateCvsSwr.isLoading}
                    onPress={openReviewLevelDetailsModal}
                >
                    {t("cv.submission.reviewLevelUpdate")}
                </Button>
            </div>
            <div className="h-6" />
            <div>  
                <div className="flex items-center gap-2 text-base font-semibold">
                    {t("cv.submission.feedbackTitle")}
                    <StarCiAIBadge />
                </div>
                <div className="h-3" />
                <div className="rounded-3xl mb-3 bg-surface p-3 text-muted text-sm">
                    <MarkdownContent markdown={feedbackMarkdown} />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="lg"
                        isDisabled={formik.isSubmitting || templateCvsSwr.isLoading}
                        isPending={
                            cvReviewFormik.isSubmitting
                        || activeCvReviewJobStatus === JobStatus.Processing
                        || activeCvReviewJobStatus === JobStatus.Queued
                        }
                        onPress={cvReviewFormik.submitForm}
                    >
                        {
                            (
                                {
                                    isPending,
                                }
                            ) => {
                                return (
                                    <>
                                        {isPending ? <Spinner color="current" /> : <ScanIcon className="size-5" />}
                                        <span>
                                            {t(
                                                hasPersistedAiFeedback
                                                    ? "cv.submission.reviewActionRerun"
                                                    : "cv.submission.reviewAction",
                                            )}
                                        </span>
                                    </>
                                )
                            }
                        }
                    </Button>
                    <Button
                        size="lg"
                        variant="secondary"
                        onPress={openCvSubmissionAttemptsDrawer}
                    >
                        {t("cv.submission.attemptsDrawer.openButton")}
                    </Button>
                </div>
                {
                    activeCvReviewJobId !== undefined && activeCvReviewJobStatus !== undefined ? (
                        <AIProcessingText
                            className="mt-3"
                            jobCategory={JobCategory.ReviewCv}
                            jobStatus={activeCvReviewJobStatus}
                            error={activeCvReviewJobError}
                        />
                    ) : null
                }
            </div>
        </div>
    )
}
