"use client"

import React from "react"
import { ScrollShadow } from "@heroui/react"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { useContentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useAppSelector } from "@/redux/hooks"
import { WithClassNames } from "@/modules/types/base/class-name"
import { ModalShell } from "@/components/blocks/layout/ModalShell"

/** Props for {@link ContentModal}. */
type ContentModalProps = WithClassNames<undefined>

export const ContentModal = ({ className }: ContentModalProps = {}) => {
    const { isOpen, setOpen } = useContentOverlayState()
    const content = useAppSelector((state) => state.content.entity)
    return (
        <ModalShell
            isOpen={isOpen}
            onOpenChange={setOpen}
            className={className}
            size="full"
            scroll="inside"
            title={content?.title ?? ""}
            titleClassName="text-2xl font-bold text-center"
        >
            <ScrollShadow hideScrollBar={true} className="px-3">
                <MarkdownContent markdown={content?.body ?? ""} />
                <div className="h-6"/>
            </ScrollShadow>
        </ModalShell>
    )
}
