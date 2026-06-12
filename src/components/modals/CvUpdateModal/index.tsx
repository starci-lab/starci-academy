"use client"

import React from "react"
import { Button, Modal } from "@heroui/react"
import {
    useCvUpdateOverlayState,
} from "@/hooks"
import { useCvApplyForm } from "@/hooks/zustand"
import { useTranslations } from "next-intl"
import { Dropzone } from "@/components/reuseable"

export const CvUpdateModal = () => {
    const { isOpen, setOpen } = useCvUpdateOverlayState()
    // cvFile is shared via the zustand store so CVUpload/CVPreview see the same file.
    const { cvFile, setCvFile, error, submit, isSubmitting } = useCvApplyForm()
    const t = useTranslations()
    const handleConfirmSubmission = async () => {
        if (!cvFile || error) {
            return
        }
        await submit()
        setOpen(false)
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
                                file={cvFile}
                                errorMessage={
                                    cvFile && error
                                        ? t(error)
                                        : undefined
                                }
                                acceptedMimeTypes={["application/pdf"]}
                                maxSizeInBytes={10 * 1024 * 1024}
                                onChange={(file) => setCvFile(file)}
                            />
                            <div className="flex items-center justify-end gap-1.5">
                                <Button
                                    variant="ghost"
                                    onPress={() => {
                                        setCvFile(null)
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
