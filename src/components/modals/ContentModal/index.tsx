"use client"

import React from "react"
import { Modal, ScrollShadow } from "@heroui/react"
import { MarkdownContent } from "@/components/reuseable"
import { useContentOverlayState } from "@/hooks"
import { useAppSelector } from "@/redux"

export const ContentModal = () => {
    const { isOpen, setOpen } = useContentOverlayState()
    const content = useAppSelector((state) => state.content.entity)
    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container size="full" scroll="inside">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <div className="text-2xl font-bold text-center">
                                {content?.title ?? ""}
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <ScrollShadow hideScrollBar={true} className="px-3">   
                                <MarkdownContent markdown={content?.body ?? ""} />
                                <div className="h-6"/>
                            </ScrollShadow>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
