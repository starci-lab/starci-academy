"use client"

import React, { useMemo } from "react"
import _ from "lodash"
import { Chip, Modal, ScrollShadow } from "@heroui/react"
import { MarkdownContent } from "@/components/reuseable"
import { ContentReferences } from "./ContentReferences"
import { useContentOverlayState } from "@/hooks/singleton"
import { ClockIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { AppModalHeader } from "../AppModalHeader"

export const ContentModal = () => {
    const { isOpen, onOpenChange } = useContentOverlayState()
    const t = useTranslations()
    const content = useAppSelector((state) => state.content.entity)
    const references = useMemo(() => _.cloneDeep(content?.references ?? []), [content?.references])
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container size="full" scroll="inside">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <AppModalHeader
                            description={
                                <div className="flex flex-wrap justify-center gap-2">
                                    <Chip color="accent" size="sm" variant="soft">
                                        <ClockIcon className="size-4" />
                                        <Chip.Label>
                                            {t("content.minutesRead", {
                                                minutes: content?.minutesRead ?? 0,
                                            })}
                                        </Chip.Label>
                                    </Chip>
                                </div>
                            }
                            title={content?.title ?? ""}
                        />
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
