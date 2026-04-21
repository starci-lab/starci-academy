"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
    Breadcrumbs,
    Button,
    Card,
    Link,
    Modal,
} from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources"
import { useAppSelector } from "@/redux"
import { useCvApplyFormik } from "@/hooks/singleton"
import { Dropzone, PDFView } from "@/components/reuseable"
import { ClockIcon, DownloadSimpleIcon, FilePdfIcon } from "@phosphor-icons/react"

const REMOTE_TEST_PDF_URL = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"

const Page = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const formik = useCvApplyFormik()
    const [isUpdateCvModalOpen, setIsUpdateCvModalOpen] = useState(false)
    const selectedFileUrl = useMemo(() => {
        if (!formik.values.cvFile) return ""
        return URL.createObjectURL(formik.values.cvFile)
    }, [formik.values.cvFile])
    const previewPdfUrl = selectedFileUrl || REMOTE_TEST_PDF_URL
    const currentCvLink = selectedFileUrl || REMOTE_TEST_PDF_URL
    const currentCvLinkLabel = formik.values.cvFile?.name || "my-name.pdf"
    const hasSubmittedCv = Boolean(currentCvLink)

    useEffect(() => {
        return () => {
            if (selectedFileUrl) URL.revokeObjectURL(selectedFileUrl)
        }
    }, [selectedFileUrl])

    return (
        <div>
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
                <Card className="p-4">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                        <div className="order-1 lg:col-span-2">
                            {hasSubmittedCv ? (
                                <div className="flex flex-col gap-4">
                                    <div className="rounded-large border border-divider p-4">
                                        <div className="mb-3 text-sm font-medium">{t("cv.submission.fileCardTitle")}</div>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-start gap-2">
                                                <FilePdfIcon className="size-5" />
                                                <div className="min-w-0">
                                                    <div className="truncate text-sm font-medium">{currentCvLinkLabel}</div>
                                                    <div className="mt-1 flex items-center gap-1 text-xs text-muted">
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
                                                <DownloadSimpleIcon className="size-4" />
                                                {t("cv.submission.download")}
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 w-full">
                                        <Button variant="outline" className="flex-1">
                                            {t("cv.submission.reviewAction")}
                                        </Button>
                                        <Button variant="secondary" onPress={() => setIsUpdateCvModalOpen(true)} className="flex-1">
                                            {t("cv.submission.updateAction")}
                                        </Button>
                                    </div>
                                    <div className="rounded-large border border-divider p-4">
                                        <div className="mb-2 text-sm font-medium">{t("cv.submission.feedbackTitle")}</div>
                                        <div className="text-sm text-foreground-600">{t("cv.submission.feedbackSummary")}</div>
                                    </div> 
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <div className="mb-2 text-sm">{t("cv.form.cvFile.label")}</div>
                                    <Dropzone
                                        hint={t("cv.form.cvFile.hint")}
                                        file={formik.values.cvFile}
                                        errorMessage={formik.touched.cvFile && formik.errors.cvFile ? t(formik.errors.cvFile) : undefined}
                                        acceptedMimeTypes={["application/pdf"]}
                                        maxSizeInBytes={10 * 1024 * 1024}
                                        onChange={(file) => formik.setFieldValue("cvFile", file)}
                                        onBlur={() => formik.setFieldTouched("cvFile", true)}
                                    />
                                    <Link
                                        href={currentCvLink}
                                        target="_blank"
                                        className="flex items-center gap-2 text-sm text-accent underline"
                                    >
                                        {currentCvLinkLabel}
                                    </Link>
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="primary"
                                            onPress={() => {
                                                void formik.submitForm()
                                            }}
                                        >
                                            {t("cv.form.submit")}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="order-2 lg:col-span-3">
                            <div className="flex flex-col gap-2">
                                <div className="text-sm font-medium">{t("cv.preview.title")}</div>
                                <PDFView
                                    src={previewPdfUrl}
                                    title={t("cv.preview.title")}
                                    heightClassName="h-[700px]"
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <Modal isOpen={isUpdateCvModalOpen} onOpenChange={setIsUpdateCvModalOpen}>
                <Modal.Backdrop>
                    <Modal.Container size="md">
                        <Modal.Dialog>
                            <Modal.CloseTrigger />
                            <Modal.Header>
                                <div className="text-base font-semibold">{t("cv.form.modal.title")}</div>
                                <div className="text-xs text-muted">{t("cv.form.modal.description")}</div>
                            </Modal.Header>
                            <Modal.Body className="flex flex-col gap-4">
                                <Dropzone
                                    hint={t("cv.form.cvFile.hint")}
                                    file={formik.values.cvFile}
                                    errorMessage={formik.touched.cvFile && formik.errors.cvFile ? t(formik.errors.cvFile) : undefined}
                                    acceptedMimeTypes={["application/pdf"]}
                                    maxSizeInBytes={10 * 1024 * 1024}
                                    onChange={(file) => formik.setFieldValue("cvFile", file)}
                                    onBlur={() => formik.setFieldTouched("cvFile", true)}
                                />
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        onPress={() => {
                                            formik.setFieldValue("cvFile", null)
                                            setIsUpdateCvModalOpen(false)
                                        }}
                                    >
                                        {t("cv.form.cancel")}
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onPress={() => {
                                            void formik.submitForm()
                                            setIsUpdateCvModalOpen(false)
                                        }}
                                    >
                                        {t("cv.form.modal.confirm")}
                                    </Button>
                                </div>
                            </Modal.Body>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    )
}

export default Page