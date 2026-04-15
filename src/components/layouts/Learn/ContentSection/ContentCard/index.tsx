"use client"

import { StarCiCard, StarCiCardBody, StarCiChip } from "@/components/atomic"
import { useContentOverlayState } from "@/hooks/singleton"
import type { ContentEntity } from "@/modules/types"
import { useAppDispatch } from "@/redux"
import { setContentId } from "@/redux/slices"
import { ClockIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import React from "react"
import { Spacer } from "@/components/reuseable"

export interface ContentCardProps {
    /** One module content block from API. */
    content: ContentEntity
}

/**
 * Single content row in the Learn “Content” tab; opens full detail in ContentModal.
 */
export const ContentCard = ({ content }: ContentCardProps) => {
    const t = useTranslations()
    const { onOpen } = useContentOverlayState()
    const dispatch = useAppDispatch()

    return (
        <StarCiCard
            className="w-full cursor-pointer"
            onClick={() => {
                dispatch(setContentId(content.id))
                onOpen()
            }
            }
        >
            <StarCiCardBody>
                <div>
                    <div className="flex flex-col">
                        <div className="line-clamp-1 font-medium">
                            {content.orderIndex + 1}{". "} {content.title}</div>
                        <Spacer y={3} />
                        <div className="line-clamp-2 text-justify text-sm italic text-foreground-500">
                            {content.description}
                        </div>
                        <Spacer y={3} />
                        <StarCiChip
                            color="accent"
                            size="sm"
                            variant="soft"
                        >
                            <ClockIcon className="size-5" />
                            {t("content.minutesRead", {
                                minutes: content.minutesRead,
                            })}
                        </StarCiChip>
                    </div>
                </div>
            </StarCiCardBody>
        </StarCiCard>
    )
}
