"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    Chip,
    Link,
    toast,
} from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources"
import { useAppSelector } from "@/redux"
import { useCvApplyFormik, useCvPreviewOverlayState, useCvUpdateOverlayState, useQueryCvReviewHistorySwr } from "@/hooks/singleton"
import { useKeycloakZustand } from "@/hooks/zustand"
import { MarkdownContent } from "@/components/reuseable"
import { PDFView } from "@/components/reuseable/PDFView"
import { CvReviewHistory } from "@/components/layouts/Learn/CvReviewHistory"
import { ClockIcon, DownloadSimpleIcon, FilePdfIcon, MagnifyingGlassPlusIcon, SparkleIcon } from "@phosphor-icons/react"
import { dayjs } from "@/modules/dayjs"
import { mutateTriggerCvSubmission } from "@/modules/api"
import type { CvReviewHistoryItemPayload } from "@/modules/api"

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

const isRenderablePdfSource = (value?: string) => {
    if (!value) return false
    return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("blob:") || value.startsWith("data:")
}

const Page = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const formik = useCvApplyFormik()
    const keycloak = useKeycloakZustand()
    const token = keycloak.authenticated ? keycloak.token : undefined
    const [isReviewing, setIsReviewing] = useState(false)
    const { onOpen: onOpenCvUpdateModal } = useCvUpdateOverlayState()
    const { onOpen: onOpenCvPreviewModal } = useCvPreviewOverlayState()
    const selectedFileUrl = useMemo(() => {
        if (!formik.values.cvFile) return ""
        return URL.createObjectURL(formik.values.cvFile)
    }, [formik.values.cvFile])
    const reviewHistorySwr = useQueryCvReviewHistorySwr()
    const latestHistoryItem = reviewHistorySwr.data?.data?.[0]
    const cvSubmissionId = reviewHistorySwr.data?.cvSubmissionId
    const historyFileUrl = latestHistoryItem?.fileUrl || ""
    const downloadableCvUrl = isRenderablePdfSource(historyFileUrl) ? historyFileUrl : ""
    const currentCvLink = selectedFileUrl || downloadableCvUrl
    const currentCvLinkLabel = formik.values.cvFile?.name ||
        (latestHistoryItem?.fileUrl ? getFileNameFromUrl(latestHistoryItem.fileUrl) : "my-name.pdf")
    const previewPdfUrl = selectedFileUrl || downloadableCvUrl
    const recentFeedbackRows = useMemo(() =>
        (reviewHistorySwr.data?.data || []).map((item: CvReviewHistoryItemPayload) => ({
            id: item.attemptId,
            fileName: getFileNameFromUrl(item.fileUrl),
            fileUrl: item.fileUrl,
            submittedAt: dayjs(item.submittedAt).format("DD/MM/YYYY HH:mm"),
            feedback: item.feedback || "-",
        })),
    [reviewHistorySwr.data?.data])

    const handleReviewCv = async () => {
        if (!token) {
            toast.danger("Error", {
                description: "Authentication token not found",
            })
            return
        }

        if (!cvSubmissionId) {
            toast.danger("Error", {
                description: "CV submission not found",
            })
            return
        }

        try {
            setIsReviewing(true)
            const response = await mutateTriggerCvSubmission({
                variables: {
                    request: {
                        cvSubmissionId,
                        cvSubmissionAttemptId: latestHistoryItem?.attemptId,
                    },
                },
                token,
            })

            const payload = response.data?.triggerCvSubmission
            if (!payload?.success) {
                throw new Error(payload?.message || "Failed to queue CV processing")
            }

            toast.success("Success", {
                description: payload.message || t("cv.submission.reviewAction"),
            })
            await reviewHistorySwr.mutate()
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to queue CV processing"
            toast.danger("Error", {
                description: message,
            })
        } finally {
            setIsReviewing(false)
        }
    }

    useEffect(() => {
        return () => {
            if (selectedFileUrl) URL.revokeObjectURL(selectedFileUrl)
        }
    }, [selectedFileUrl])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="col-span-3 lg:border-r lg:/60">
                <div className="p-6">
                    <Breadcrumbs>
                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale().build())}>
                            {t("nav.home")}
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale(locale).course().build())}>
                            {t("nav.courses")}
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale(locale).course(courseDisplayId).build())}>
                            {course?.title || t("nav.courses")}
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item>
                            <span>{t("course.cvTitle")}</span>
                        </Breadcrumbs.Item>
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
                                                <div className="flex items-center gap-1 mt-1 text-xs text-muted">
                                                    <ClockIcon className="size-4" />
                                                    {t("cv.submission.submittedAt")}
                                                </div>
                                            </div>
                                        </div>
                                        {currentCvLink ? (
                                            <Link
                                                href={currentCvLink}
                                                target="_blank"
                                                className="shrink-0 inline-flex items-center gap-1 text-sm text-accent"
                                            >
                                                <DownloadSimpleIcon className="size-5" />
                                                {t("cv.submission.download")}
                                            </Link>
                                        ) : (
                                            <span className="shrink-0 inline-flex items-center gap-1 text-sm text-foreground-500">
                                                <DownloadSimpleIcon className="size-5" />
                                                {t("cv.submission.download")}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="h-3" />
                            <div className="flex gap-3">
                                <Button isDisabled={isReviewing || !cvSubmissionId} onPress={handleReviewCv}>
                                    {t("cv.submission.reviewAction")}
                                </Button>
                                <Button variant="secondary" onPress={onOpenCvUpdateModal}>
                                    {t("cv.submission.updateAction")}
                                </Button>
                            </div>
                            <div className="h-6" />
                            <div>
                                <div className="mb-3 text-base font-medium flex items-center gap-2">{t("cv.submission.feedbackTitle")}<Chip variant="secondary" color="accent"><SparkleIcon className="size-5" />StarCi AI</Chip></div>
                                <div className="border  rounded-3xl p-3">
                                    <MarkdownContent
                                        markdown={latestHistoryItem?.feedback || "This CV currently does not have feedback"}
                                    />
                                </div>
                            </div> 
                            <div className="h-6" />
                            <div>
                                <div className="mb-3 text-base font-medium flex items-center gap-2">{t("cv.submission.historyTitle")}</div>
                                <CvReviewHistory items={recentFeedbackRows} />
                            </div> 
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
                    <div className="sticky bottom-0 p-3 backdrop-blur border-t ">
                        <Button
                            className="w-full"
                            size="lg"
                            onPress={onOpenCvPreviewModal}
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

export default Page