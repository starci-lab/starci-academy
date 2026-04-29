"use client"

import React, { useMemo } from "react"
import _ from "lodash"
import { Modal, ScrollShadow } from "@heroui/react"
import { MarkdownContent } from "@/components/reuseable"
import { ContentReferences } from "./ContentReferences"
import { useContentOverlayState } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"

export const ContentModal = () => {
    const { isOpen, setOpen } = useContentOverlayState()
    const content = useAppSelector((state) => state.content.entity)
    const references = useMemo(() => _.cloneDeep(content?.references ?? []), [content?.references])
    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container size="full" scroll="inside">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <div className="text-2xl font-bold">
                                {content?.title ?? ""}
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <ScrollShadow hideScrollBar={true} className="px-3">   
                                <MarkdownContent markdown={content?.body ?? ""} />
                                <ContentReferences references={references} />
                                <div className="h-6"/>
                            </ScrollShadow>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
