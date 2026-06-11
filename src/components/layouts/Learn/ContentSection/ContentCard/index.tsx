"use client"

import { Clock as ClockIcon, Star as StarIcon, Video as VideoIcon } from "@gravity-ui/icons"
import { Button, Chip } from "@heroui/react"
import { useContentOverlayState } from "@/hooks"
import type { ContentEntity } from "@/modules/types"
import { useAppDispatch } from "@/redux"
import { setContentId } from "@/redux/slices"
import { TagChips } from "@/components/reuseable"
import { useTranslations } from "next-intl"
import React, { useCallback } from "react"
import { advancedPalette } from "@/components/pallettes"
import { CONTENT_DEMO_TAGS } from "./constants"


export interface ContentCardProps {
    /** One module content block from API. */
    content: ContentEntity
}

/**
 * Single content row in the Learn “Content” tab; opens full detail in ContentModal.
 */
export const ContentCard = ({ content }: ContentCardProps) => {
    const t = useTranslations()
    const { open } = useContentOverlayState()
    const dispatch = useAppDispatch()

    /** Select this content and open its detail modal. */
    const onPress = useCallback(() => {
        dispatch(setContentId(content.id))
        open()
    }, [dispatch, content.id, open])

    return (
        <Button
            className="w-full h-fit p-3 card card--default cursor-pointer flex flex-col items-start text-left"
            variant="tertiary"
            onPress={onPress}
        >
            <div className="flex flex-col gap-3 w-full">
                <div className="text-base font-semibold text-foreground overflow-hidden whitespace-normal">
                    {content.sortIndex}{". "} {content.title} <span>(Chưa đọc)</span>
                </div>
                <div className="flex items-center gap-2">
                    <Chip
                        variant="secondary"
                        size="sm"
                        color="accent"
                    >
                        <ClockIcon className="size-4" />
                        <Chip.Label>
                            {t("content.minutesRead", {
                                minutes: content.minutesRead,
                            })}
                        </Chip.Label>
                    </Chip>
                    <Chip
                        variant="secondary"
                        size="sm"
                        color="accent"
                    >
                        <VideoIcon className="size-4" />
                        <Chip.Label>
                                Có bài giảng
                        </Chip.Label>
                    </Chip>
                    <Chip
                        variant="secondary"
                        color="accent"
                        size="sm"
                        className={advancedPalette.text}
                    >
                        <StarIcon className="size-4" />
                        <Chip.Label>
                                Kiến thức nâng cao
                        </Chip.Label>
                    </Chip>
                </div>
                <div className="line-clamp-3 text-justify text-sm italic text-muted overflow-hidden whitespace-normal">
                    {content.description}
                </div>
                <TagChips tags={CONTENT_DEMO_TAGS} variant="soft" />
            </div>
        </Button>
    )
}
