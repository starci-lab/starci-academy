"use client"

import React, { useState } from "react"
import { Button, Modal, toast } from "@heroui/react"
import { useSWRConfig } from "swr"
import {
    useCvApplyFormik,
    useCvUpdateOverlayState,
} from "@/hooks/singleton"
import { useKeycloakZustand } from "@/hooks/zustand"
import { useTranslations } from "next-intl"
import { Dropzone } from "@/components/reuseable"
import { querySubmitCvPresignedUrl } from "@/modules/api"

export const CvUpdateModal = () => {
    const { isOpen, setOpen } = useCvUpdateOverlayState()
    const formik = useCvApplyFormik()
    const keycloak = useKeycloakZustand()
    const t = useTranslations()
    const { mutate } = useSWRConfig()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleConfirmSubmission = async () => {
        await formik.setFieldTouched("cvFile", true, true)
        const errors = await formik.validateForm()
        const file = formik.values.cvFile
        if (errors.cvFile || !file) {
            return
        }

        const token = keycloak.token
        if (!token) {
            toast.danger("Error", {
                description: "Authentication token not found",
            })
            return
        }

        try {
            setIsSubmitting(true)
            const response = await querySubmitCvPresignedUrl({
                request: {
                    fileName: file.name,
                },
                token,
            })

            const presignedPayload = response.data?.SubmitCvPresignedUrl
            if (!presignedPayload?.url) {
                throw new Error("Failed to get pre-signed URL")
            }

            const uploadResponse = await fetch(presignedPayload.url, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type || "application/pdf",
                },
            })

            if (!uploadResponse.ok) {
                throw new Error(`Upload failed with status ${uploadResponse.status}`)
            }

            await formik.setValues({
                ...formik.values,
                cvFile: file,
                cvSubmissionId: presignedPayload.cvSubmissionId,
                cvSubmissionAttemptId: presignedPayload.cvSubmissionAttemptId,
            })

            if (token) {
                await mutate(["QUERY_CV_REVIEW_HISTORY_SWR", token])
            }

            toast.success("Success", {
                description: t("cv.form.modal.confirm"),
            })
            setOpen(false)
        } catch (error) {
            const message =
        error instanceof Error ? error.message : "Failed to submit CV"
            toast.danger("Error", {
                description: message,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container size="sm">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <div className="text-base font-semibold">
                                {t("cv.form.modal.title")}
                            </div>
                            <div className="text-xs text-muted">
                                {t("cv.form.modal.description")}
                            </div>
                        </Modal.Header>
                        <Modal.Body className="flex flex-col gap-4">
                            <Dropzone
                                hint={t("cv.form.cvFile.hint")}
                                file={formik.values.cvFile}
                                errorMessage={
                                    formik.touched.cvFile && formik.errors.cvFile
                                        ? t(formik.errors.cvFile)
                                        : undefined
                                }
                                acceptedMimeTypes={["application/pdf"]}
                                maxSizeInBytes={10 * 1024 * 1024}
                                onChange={(file) => formik.setFieldValue("cvFile", file)}
                                onBlur={() => formik.setFieldTouched("cvFile", true)}
                            />
                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    onPress={() => {
                                        formik.setValues({
                                            cvFile: null,
                                            cvSubmissionId: null,
                                            cvSubmissionAttemptId: null,
                                        })
                                        setOpen(false)
                                    }}
                                >
                                    {t("cv.form.cancel")}
                                </Button>
                                <Button
                                    variant="primary"
                                    isDisabled={isSubmitting}
                                    onPress={handleConfirmSubmission}
                                >
                                    {t("cv.form.modal.confirm")}
                                </Button>
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
