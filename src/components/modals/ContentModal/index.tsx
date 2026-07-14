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
            title={content?.title
                ? <MarkdownContent markdown={content.title} className="[&_p]:m-0 [&_p]:inline" />
                : null}
            bodyClassName="pb-6"
        >
            <ScrollShadow hideScrollBar={true}>
                <MarkdownContent markdown={content?.body ?? ""} />
            </ScrollShadow>
        </ModalShell>
    )
}
