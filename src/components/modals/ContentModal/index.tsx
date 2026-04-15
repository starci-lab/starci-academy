"use client"

import React, { useMemo } from "react"
import _ from "lodash"
import {
    StarCiChip,
    StarCiModal,
    StarCiModalBody,
    StarCiModalContent,
    StarCiModalHeader,
    StarCiScrollShadow,
} from "../../atomic"
import { MarkdownContent, Spacer } from "@/components/reuseable"
import { ContentReferences } from "./ContentReferences"
import { useContentOverlayState } from "@/hooks/singleton"
import { ClockIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
export const ContentModal = () => {
    const { isOpen, onOpenChange } = useContentOverlayState()
    const t = useTranslations()
    const content = useAppSelector((state) => state.content.entity)
    const references = useMemo(() => _.cloneDeep(content?.references ?? []), [content?.references])
    return (
        <StarCiModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <StarCiModalContent size="full" className="[&_header]:max-w-[768px] [&_header]:mx-auto [&_.modal-body]:max-w-[768px] [&_.modal-body]:mx-auto">
                <StarCiModalHeader
                    title={content?.title ?? ""}
                    description={
                        <div className="flex flex-wrap justify-center gap-2">
                            <StarCiChip
                                color="accent"
                                size="sm"
                                variant="soft"
                            >
                                <ClockIcon className="size-4" />{" "}
                                {t("content.minutesRead", {
                                    minutes: content?.minutesRead ?? 0,
                                })}
                            </StarCiChip>
                        </div>
                    }
                />
                <StarCiModalBody>
                    <StarCiScrollShadow hideScrollBar>
                        <MarkdownContent markdown={content?.body ?? ""} />
                        <ContentReferences references={references} />
                        <Spacer y={6} />
                    </StarCiScrollShadow>
                </StarCiModalBody>
            </StarCiModalContent>
        </StarCiModal>
    )
}
