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
import { MarkdownContent } from "@/components/reuseable"
import { ContentReferences } from "./ContentReferences"
import { useContentDisclosure } from "@/hooks/singleton"
import { ClockIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { Spacer } from "@heroui/react"

export const ContentModal = () => {
    const { isOpen, onOpenChange } = useContentDisclosure()
    const t = useTranslations()
    const content = useAppSelector((state) => state.content.entity)
    const references = useMemo(() => _.cloneDeep(content?.references ?? []), [content?.references])
    return (
        <StarCiModal
            isOpen={isOpen}
            size="full"
            onOpenChange={onOpenChange}
            classNames={{
                header: "max-w-[768px] mx-auto",
                body: "max-w-[768px] mx-auto",
            }}
            scrollBehavior="inside"
        >
            <StarCiModalContent>
                <StarCiModalHeader
                    title={content?.title ?? ""}
                    description={
                        <div className="flex flex-wrap justify-center gap-2">
                            <StarCiChip
                                startContent={<ClockIcon className="size-4" />}
                                color="primary"
                                size="sm"
                                variant="flat"
                            >
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
