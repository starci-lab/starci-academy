"use client"

import React from "react"
import { Button, Modal } from "@heroui/react"
import { useCvApplyFormik, useCvUpdateOverlayState } from "@/hooks/singleton"
import { useTranslations } from "next-intl"
import { Dropzone } from "@/components/reuseable"

export const CvUpdateModal = () => {
    const { isOpen, onOpenChange } = useCvUpdateOverlayState()
    const formik = useCvApplyFormik()
    const t = useTranslations()

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container size="sm">
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
                                        onOpenChange(false)
                                    }}
                                >
                                    {t("cv.form.cancel")}
                                </Button>
                                <Button
                                    variant="primary"
                                    onPress={() => {
                                        void formik.submitForm()
                                        onOpenChange(false)
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
    )
}
