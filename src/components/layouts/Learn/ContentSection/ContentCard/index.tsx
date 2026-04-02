"use client"

import { StarCiCard, StarCiCardBody, StarCiChip, StarCiImage } from "@/components/atomic"
import { useContentDisclosure } from "@/hooks/singleton"
import type { ContentEntity } from "@/modules/types"
import { useAppDispatch } from "@/redux"
import { setContentModalData } from "@/redux/slices"
import { ClockIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import React from "react"

export interface ContentCardProps {
    /** One module content block from API. */
    content: ContentEntity
}

/**
 * Single content row in the Learn “Content” tab; opens full detail in ContentModal.
 */
export const ContentCard = ({ content }: ContentCardProps) => {
    const t = useTranslations()
    const { onOpen } = useContentDisclosure()
    const dispatch = useAppDispatch()
    const thumb = content.thumbnailUrl?.trim()

    return (
        <StarCiCard
            isPressable
            onPress={() => {
                dispatch(setContentModalData({ data: content }))
                onOpen()
            }
            }
        >
            <StarCiCardBody>
                <div className="grid grid-cols-3 gap-4">
                    {thumb ? (
                        <StarCiImage
                            src={thumb}
                            alt={content.title}
                            className="aspect-video h-full rounded-md object-cover"
                        />
                    ) : (
                        <div
                            className="aspect-video h-full rounded-md bg-default-200"
                            aria-hidden
                        />
                    )}
                    <div className="col-span-2 flex flex-col gap-3 text-start">
                        <div className="line-clamp-1 font-medium">{content.title}</div>
                        <div className="line-clamp-3 text-justify text-sm italic text-foreground-500">
                            {content.description}
                        </div>
                        <StarCiChip
                            startContent={<ClockIcon className="size-5" />}
                            color="primary"
                            size="sm"
                            variant="flat"
                        >
                            {t("course.modules.minutesRead", {
                                minutes: content.minutesRead,
                            })}
                        </StarCiChip>
                    </div>
                </div>
            </StarCiCardBody>
        </StarCiCard>
    )
}
