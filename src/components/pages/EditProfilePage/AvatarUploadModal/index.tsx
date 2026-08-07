"use client"

import React from "react"
import { Modal, Typography } from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import { useAvatarUploadOverlayState } from "@/hooks/zustand/overlay/hooks"
import { ImageDropzone } from "@/components/blocks/identity/ImageDropzone"

/** Props for {@link AvatarUploadModal}. */
export interface AvatarUploadModalProps {
    /** Receives the picked image file (preview + staging owned by the parent form). */
    onFile: (file: File) => void
}

/**
 * Modal that wraps the {@link ImageDropzone} — opened by the "change avatar"
 * button on the edit-profile page. Open-state lives in the shared zustand overlay
 * (`avatarUpload` key); picking/dropping a file stages it in the parent form
 * (`onFile`) and closes the modal. Mounted by {@link import("../index").EditProfilePage}
 * (not the global ModalContainer) so it can wire the form's avatar setter.
 *
 * @param props - {@link AvatarUploadModalProps}
 */
export const AvatarUploadModal = ({
    onFile}: AvatarUploadModalProps) => {
    const t = useTranslations()
    const { isOpen, setOpen, close } = useAvatarUploadOverlayState()

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container size="md">
                    <Modal.Dialog className={""}>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Typography.Heading level={3}>
                                {t("profileEdit.changeAvatar")}
                            </Typography.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <ImageDropzone
                                label={t("profileEdit.avatarDropzone")}
                                hint={t("profileEdit.avatarHint")}
                                onFile={(file) => {
                                    onFile(file)
                                    close()
                                }}
                            />
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
