"use client"

import React from "react"
import { Modal, ScrollShadow } from "@heroui/react"
import { MarkdownContent } from "@/components/reuseable"
import { VideoRenderer } from "@/components/reuseable/VideoRenderer"
import { useFoundationOverlayState } from "@/hooks/singleton"
import { FoundationKind, LessonVideoType, VideoHostPlatform } from "@/modules/types"
import { useAppSelector } from "@/redux"

/**
 * Foundation viewer modal: renders markdown or MPEG-DASH by `foundation.kind`.
 */
export const FoundationModal = () => {
    const { isOpen, setOpen } = useFoundationOverlayState()
    const foundation = useAppSelector((state) => state.foundation.entity)

    const renderBody = () => {
        if (!foundation) {
            return null
        }

        switch (foundation.kind) {
        case FoundationKind.Document:
            return (
                <ScrollShadow hideScrollBar className="px-3">
                    <MarkdownContent markdown={foundation.value ?? ""} />
                    <div className="h-6" />
                </ScrollShadow>
            )
        case FoundationKind.Video: {
            const url = foundation.value ?? ""
            const isYoutube = /youtube\.com|youtu\.be/i.test(url)
            return (
                <div className="flex flex-col items-center p-4">
                    <VideoRenderer
                        classNames={{
                            base: "w-full overflow-hidden rounded-lg",
                            content: "w-full",
                        }}
                        url={url}
                        hostPlatform={isYoutube ? VideoHostPlatform.Youtube : undefined}
                        videoType={isYoutube ? undefined : LessonVideoType.MpegDash}
                        title={foundation.title}
                    />
                </div>
            )
        }
        default:
            return null
        }
    }

    const containerClassName = foundation?.kind === FoundationKind.Video
        ? "modal__container--narrow"
        : undefined

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container
                    className={containerClassName}
                    size="full"
                    scroll={foundation?.kind === FoundationKind.Document ? "inside" : undefined}
                >
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <div className="text-center text-2xl font-bold">
                                {foundation?.title ?? ""}
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            {renderBody()}
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
