"use client"

import React, { useEffect, useMemo } from "react"
import {
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    Chip,
    Link,
} from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources"
import { useAppSelector } from "@/redux"
import { useCvApplyFormik, useCvPreviewOverlayState, useCvUpdateOverlayState } from "@/hooks/singleton"
import { MarkdownContent } from "@/components/reuseable"
import { PDFView } from "@/components/reuseable/PDFView"
import { CvReviewHistory } from "@/components/layouts/Learn/CvReviewHistory"
import { ClockIcon, DownloadSimpleIcon, FilePdfIcon, MagnifyingGlassPlusIcon, SparkleIcon } from "@phosphor-icons/react"

const REMOTE_TEST_PDF_URL = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"

const Page = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const formik = useCvApplyFormik()
    const { onOpen: onOpenCvUpdateModal } = useCvUpdateOverlayState()
    const { onOpen: onOpenCvPreviewModal } = useCvPreviewOverlayState()
    const selectedFileUrl = useMemo(() => {
        if (!formik.values.cvFile) return ""
        return URL.createObjectURL(formik.values.cvFile)
    }, [formik.values.cvFile])
    const previewPdfUrl = selectedFileUrl || REMOTE_TEST_PDF_URL
    const currentCvLink = selectedFileUrl || REMOTE_TEST_PDF_URL
    const currentCvLinkLabel = formik.values.cvFile?.name || "my-name.pdf"
    const recentFeedbackRows = useMemo(() => [
        {
            id: "1",
            fileName: currentCvLinkLabel,
            submittedAt: "21/04/2026 10:30",
            feedback: "Bố cục CV rõ ràng, cần bổ sung thêm số liệu thành tích.",
        },
        {
            id: "2",
            fileName: "my-name-v0.pdf",
            submittedAt: "18/04/2026 16:10",
            feedback: "Cần tối ưu phần tóm tắt và mô tả kinh nghiệm thực tế.",
        },
    ], [currentCvLinkLabel])

    useEffect(() => {
        return () => {
            if (selectedFileUrl) URL.revokeObjectURL(selectedFileUrl)
        }
    }, [selectedFileUrl])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="col-span-3 lg:border-r lg:border-divider/60">
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
                    <div className="h-12" />
                    <div className="flex flex-col gap-6">
                        <div>
                            <div className="text-3xl font-bold">{t("course.cvTitle")}</div>
                            <div className="text-muted mt-2 text-sm">{t("course.cvDescription")}</div>
                        </div>
                        <div>

                            <div className="mb-3 text-base font-medium">{t("cv.submission.fileCardTitle")}</div>
                            <Card className="w-full">
                                <CardContent className="flex items-center">
                                    <div className="flex items-center justify-between gap-3 w-full">
                                        <div className="flex items-center gap-2">
                                            <FilePdfIcon className="size-10" />
                                            <div className="min-w-0">
                                                <Link
                                                    href={currentCvLink}
                                                    target="_blank"
                                                    className="truncate text-sm font-medium text-accent underline"
                                                >
                                                    {currentCvLinkLabel}
                                                </Link>
                                                <div className="flex items-center gap-1 mt-1 text-xs text-muted">
                                                    <ClockIcon className="size-4" />
                                                    {t("cv.submission.submittedAt")}
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            href={currentCvLink}
                                            target="_blank"
                                            className="inline-flex items-center gap-1 text-sm text-accent"
                                        >
                                            <DownloadSimpleIcon className="size-5" />
                                            {t("cv.submission.download")}
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="h-3" />
                            <div className="flex gap-3">
                                <Button >
                                    {t("cv.submission.reviewAction")}
                                </Button>
                                <Button variant="secondary" onPress={onOpenCvUpdateModal}>
                                    {t("cv.submission.updateAction")}
                                </Button>
                            </div>
                            <div className="h-6" />
                            <div>
                                <div className="mb-3 text-base font-medium flex items-center gap-2">{t("cv.submission.feedbackTitle")}<Chip variant="secondary" color="accent"><SparkleIcon className="size-5" />StarCi AI</Chip></div>
                                <div className="border border-divider rounded-3xl p-3">
                                    <MarkdownContent
                                        markdown="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
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
                <div className="flex h-full flex-col p-3">
                    <PDFView
                        src={previewPdfUrl}
                        title={t("cv.preview.title")}
                        heightClassName="h-[300px] lg:h-full"
                        showAllPages={true}
                        allowVerticalScroll={true}
                        fitToContainer={true}
                    />
                    <div className="sticky bottom-0 mt-3 bg-background/95 pb-1 pt-2 backdrop-blur">
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