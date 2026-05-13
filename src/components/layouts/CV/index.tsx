"use client"

import React, {
    useEffect,
    useMemo,
    useState,
} from "react"
import {
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    Chip,
    Link,
    toast,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import dynamic from "next/dynamic"
import {
    pathConfig,
} from "@/resources"
import {
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    useCvApplyFormik,
    useAIProcessingOverlayState,
    useCvPreviewOverlayState,
    useCvReviewLevelDetailsOverlayState,
    useCvUpdateOverlayState,
    useQueryCvUrlSwr,
    useQueryTemplateCvsSwr,
} from "@/hooks/singleton"
import {
    MarkdownContent,
} from "@/components/reuseable"
import {
    ClockIcon,
    DownloadSimpleIcon,
    FilePdfIcon,
    MagnifyingGlassPlusIcon,
    SparkleIcon,
} from "@phosphor-icons/react"
import {
    GraphQLHeadersKey,
    mutateReviewCv,
} from "@/modules/api"
import {
    CvReviewLevelField,
} from "./CvReviewLevelField"
import {
    AIProcessingModalKind,
    setAIProcessingModalData,
    setSelectedCvReviewTemplateId,
} from "@/redux/slices"
import {
    PublicationEvent,
    useJobNotificationsSocketIo,
} from "@/hooks/singleton/socketio"
import {
    JobStatus,
} from "@/modules/types"

const PDFView = dynamic(
    () => import("@/components/reuseable/PDFView").then((module) => module.PDFView),
    { ssr: false },
)

/**
 * Derives a display filename from an HTTP(S) or blob URL path segment.
 */
const getFileNameFromUrl = (url: string) => {
    try {
        const pathname = new URL(url).pathname
        const lastPart = pathname.split("/").filter(Boolean).at(-1)
        return lastPart ? decodeURIComponent(lastPart) : url
    } catch {
        const lastPart = url.split("/").filter(Boolean).at(-1)
        return lastPart ? decodeURIComponent(lastPart) : url
    }
}

/** One breadcrumb row for the learn CV page. */
type CvLearnBreadcrumbItem = {
    /** Stable React key. */
    key: string
    /** Visible label (already translated or course title). */
    label: string
    /** Optional navigation handler when the segment is clickable. */
    onPress?: () => void
}

/**
 * Learn-module CV page: breadcrumbs, file card, review/update actions, feedback summary, and PDF preview.
 */
export const CvLearnLayout = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const formik = useCvApplyFormik()
    const [
        isReviewing,
        setIsReviewing,
    ] = useState(false)
    const selectedTemplateId = useAppSelector((state) => state.cvReviewLevel.selectedTemplateId)
    const {
        open: openCvUpdateModal,
    } = useCvUpdateOverlayState()
    const {
        open: openCvPreviewModal,
    } = useCvPreviewOverlayState()
    const {
        open: openReviewLevelDetailsModal,
    } = useCvReviewLevelDetailsOverlayState()
    const {
        open: openAIProcessing,
    } = useAIProcessingOverlayState()
    const jobNotificationsSocket = useJobNotificationsSocketIo()
    const selectedFileUrl = useMemo(() => {
        if (!formik.values.cvFile) return ""
        return URL.createObjectURL(formik.values.cvFile)
    }, [
        formik.values.cvFile,
    ])
    const cvUrlSwr = useQueryCvUrlSwr()
    const templateCvsSwr = useQueryTemplateCvsSwr()
    const cvUrlPayload = useAppSelector((state) => state.cvUrl.entity)
    const aiProcessingData = useAppSelector((state) => state.modal.aiProcessingData)
    const activeCvReviewJobId = aiProcessingData?.kind === AIProcessingModalKind.Cv
        ? aiProcessingData.jobId
        : undefined
    const activeCvReviewJobStatus = useAppSelector((state) => activeCvReviewJobId
        ? state.socketIo.jobStatusByJobId[activeCvReviewJobId]?.data?.status
        : undefined)
    const cvSubmissionId = cvUrlPayload?.id || ""
    const currentCvLink = selectedFileUrl || (cvUrlPayload?.cvUrl ?? "")
    const currentCvLinkLabel =
        formik.values.cvFile?.name ||
        (cvUrlPayload?.cvUrl ? getFileNameFromUrl(cvUrlPayload.cvUrl) : t("cv.submission.defaultCvFileName"))
    const previewPdfUrl = selectedFileUrl || (cvUrlPayload?.cvUrl ?? "")

    const templateOptions = useMemo(
        () =>
            (templateCvsSwr.data ?? []).map((row) => ({
                id: row.id,
                title: row.title,
            })),
        [
            templateCvsSwr.data,
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

    const breadcrumbItems = useMemo((): Array<CvLearnBreadcrumbItem> => [
        {
            key: "home",
            label: t("nav.home"),
            onPress: () => router.push(pathConfig().locale().build()),
        },
        {
            key: "courses",
            label: t("nav.courses"),
            onPress: () => router.push(pathConfig().locale(locale).course().build()),
        },
        {
            key: "course",
            label: course?.title || t("nav.courses"),
            onPress: () => router.push(pathConfig().locale(locale).course(courseDisplayId).build()),
        },
        {
            key: "cv",
            label: t("course.cvTitle"),
        },
    ], [
        course?.title,
        courseDisplayId,
        locale,
        router,
        t,
    ])

    const handleReviewCv = async () => {
        if (!cvSubmissionId) {
            toast.danger(
                t("cv.submission.toast.errorTitle"),
                {
                    description: t("cv.submission.toast.submissionNotFound"),
                },
            )
            return
        }

        if (!selectedTemplateId) {
            toast.danger(
                t("cv.submission.toast.errorTitle"),
                {
                    description: t("cv.submission.toast.reviewLevelRequired"),
                },
            )
            return
        }

        try {
            setIsReviewing(true)
            const response = await mutateReviewCv({
                request: {
                    cvSubmissionId,
                    templateCvId: selectedTemplateId,
                },
                headers: {
                    [GraphQLHeadersKey.XLocale]: locale,
                },
            })

            const payload = response.data?.reviewCv
            if (!payload?.success) {
                throw new Error(payload?.message || t("cv.submission.toast.reviewFailed"))
            }
            const jobId = payload.data?.jobId
            if (!jobId) {
                throw new Error(payload.message || t("cv.submission.toast.reviewFailed"))
            }

            jobNotificationsSocket.emit(
                PublicationEvent.SubscribeJobNotification,
                {
                    data: {
                        jobId,
                    },
                    locale,
                },
            )
            dispatch(setAIProcessingModalData({
                kind: AIProcessingModalKind.Cv,
                jobId,
            }))
            openAIProcessing()
            toast.success(
                t("cv.submission.toast.successTitle"),
                {
                    description: payload.message || t("cv.submission.reviewAction"),
                },
            )
        } catch (error) {
            const message = error instanceof Error ? error.message : t("cv.submission.toast.reviewFailed")
            toast.danger(
                t("cv.submission.toast.errorTitle"),
                {
                    description: message,
                },
            )
        } finally {
            setIsReviewing(false)
        }
    }

    useEffect(() => {
        if (activeCvReviewJobStatus !== JobStatus.Completed) {
            return
        }
        void cvUrlSwr.mutate()
    }, [
        activeCvReviewJobStatus,
        cvUrlSwr,
    ])

    useEffect(() => {
        if (!activeCvReviewJobId) {
            return
        }
        if (
            activeCvReviewJobStatus === JobStatus.Completed ||
            activeCvReviewJobStatus === JobStatus.Failed
        ) {
            return
        }

        const subscribe = () => {
            jobNotificationsSocket.emit(
                PublicationEvent.SubscribeJobNotification,
                {
                    data: {
                        jobId: activeCvReviewJobId,
                    },
                    locale,
                },
            )
        }

        subscribe()
        const interval = setInterval(
            subscribe,
            2500,
        )
        return () => {
            clearInterval(interval)
        }
    }, [
        activeCvReviewJobId,
        activeCvReviewJobStatus,
        jobNotificationsSocket,
        locale,
    ])


    useEffect(() => {
        return () => {
            if (selectedFileUrl) URL.revokeObjectURL(selectedFileUrl)
        }
    }, [
        selectedFileUrl,
    ])

    useEffect(() => {
        const list = templateCvsSwr.data ?? []
        if (list.length === 0) {
            return
        }
        if (selectedTemplateId && list.some((row) => row.id === selectedTemplateId)) {
            return
        }
        dispatch(setSelectedCvReviewTemplateId(list[0]?.id ?? ""))
    }, [
        dispatch,
        selectedTemplateId,
        templateCvsSwr.data,
    ])

    const handleOpenReviewLevelDetailsModal = () => {
        if (isReviewing || templateCvsSwr.isLoading) {
            return
        }
        openReviewLevelDetailsModal()
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="col-span-3 lg:border-r lg:border-divider/60">
                <div className="p-6">
                    <Breadcrumbs>
                        {breadcrumbItems.map((item) => (
                            <Breadcrumbs.Item
                                key={item.key}
                                onPress={item.onPress}
                            >
                                {item.label}
                            </Breadcrumbs.Item>
                        ))}
                    </Breadcrumbs>
                    <div className="h-6" />
                    <div className="flex flex-col gap-6">
                        <div>
                            <div className="text-3xl font-bold">{t("course.cvTitle")}</div>
                            <div className="text-muted mt-2 text-sm">{t("course.cvDescription")}</div>
                        </div>
                        <div>
                            <div className="mb-3 text-base font-medium">{t("cv.submission.fileCardTitle")}</div>
                            <Card className="w-full">
                                <CardContent className="flex items-center">
                                    <div className="flex w-full items-center justify-between gap-3">
                                        <div className="flex min-w-0 flex-1 items-center gap-2">
                                            <FilePdfIcon className="size-10" />
                                            <div className="min-w-0 flex-1" title={currentCvLinkLabel}>
                                                {currentCvLink ? (
                                                    <Link
                                                        href={currentCvLink}
                                                        target="_blank"
                                                        className="block w-full truncate text-sm font-medium text-accent underline"
                                                    >
                                                        {currentCvLinkLabel}
                                                    </Link>
                                                ) : (
                                                    <span className="block w-full truncate text-sm font-medium text-foreground-500">
                                                        {currentCvLinkLabel}
                                                    </span>
                                                )}
                                                <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                                                    <ClockIcon className="size-4" />
                                                    {t("cv.submission.submittedAt")}
                                                </div>
                                            </div>
                                        </div>
                                        {currentCvLink ? (
                                            <Link
                                                href={currentCvLink}
                                                target="_blank"
                                                className="inline-flex shrink-0 items-center gap-1 text-sm text-accent"
                                            >
                                                <DownloadSimpleIcon className="size-5" />
                                                {t("cv.submission.download")}
                                            </Link>
                                        ) : (
                                            <span className="inline-flex shrink-0 items-center gap-1 text-sm text-foreground-500">
                                                <DownloadSimpleIcon className="size-5" />
                                                {t("cv.submission.download")}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="h-3" />
                            <CvReviewLevelField
                                labelText={t("cv.submission.reviewLevelLabel")}
                                placeholderText={t("cv.submission.reviewLevelPlaceholder")}
                                options={templateOptions}
                                value={selectedTemplateId}
                                onOpen={handleOpenReviewLevelDetailsModal}
                                isDisabled={isReviewing}
                                isLoading={templateCvsSwr.isLoading}
                            />
                            <div className="h-3" />
                            <div className="flex gap-3">
                                <Button
                                    isDisabled={
                                        isReviewing ||
                                        !cvSubmissionId ||
                                        !selectedTemplateId
                                    }
                                    onPress={handleReviewCv}
                                >
                                    {t("cv.submission.reviewAction")}
                                </Button>
                                <Button variant="secondary" onPress={openCvUpdateModal}>
                                    {t("cv.submission.updateAction")}
                                </Button>
                            </div>
                            <div className="h-6" />
                            <div>
                                <div className="mb-3 flex items-center gap-2 text-base font-medium">
                                    {t("cv.submission.feedbackTitle")}
                                    <Chip variant="secondary" color="accent">
                                        <span className="inline-flex items-center gap-1">
                                            <SparkleIcon className="size-5" />
                                            {t("cv.submission.aiBrand")}
                                        </span>
                                    </Chip>
                                </div>
                                <div className="rounded-3xl border p-3">
                                    <MarkdownContent markdown={feedbackMarkdown} />
                                </div>
                            </div>
                            <div className="h-6" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-span-2 lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-64px)]">
                <div className="flex h-full flex-col">
                    <PDFView
                        src={previewPdfUrl}
                        title={t("cv.preview.title")}
                        heightClassName="h-[300px] lg:h-full"
                        showAllPages={true}
                        allowVerticalScroll={true}
                        fitToContainer={true}
                    />
                    <div className="sticky bottom-0 border-t p-3 backdrop-blur">
                        <Button
                            className="w-full"
                            size="lg"
                            onPress={openCvPreviewModal}
                        >
                            <MagnifyingGlassPlusIcon className="size-5" />
                            {t("cv.preview.fullscreen")}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
