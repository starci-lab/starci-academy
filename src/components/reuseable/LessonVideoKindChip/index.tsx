"use client"

import React, { useMemo } from "react"
import { Chip, Tooltip } from "@heroui/react"
import { LessonVideoKind } from "@/modules/types"
import { useTranslations } from "next-intl"
import {
    TwitchLogoIcon,
    SparkleIcon,
    FilmReelIcon,
} from "@phosphor-icons/react"

/**
 * The props for the LessonVideoKindChip component.
 * @param kind - The kind of the lesson video.
 */
export interface LessonVideoKindChipProps {
    /** Lesson video kind from the API. */
    kind: LessonVideoKind
}

/**
 * Chip with a tooltip explaining the lesson video kind (raw stream, edited, premium).
 */
export const LessonVideoKindChip = ({ kind }: LessonVideoKindChipProps) => {
    const t = useTranslations()
    const renderLessonVideoKind = () => {
        switch (kind) {
        case LessonVideoKind.RawStream:
            return {
                icon: <TwitchLogoIcon className="size-4" />,
                label: "lessonVideoKind.rawStream.label",
                tooltip: "lessonVideoKind.rawStream.tooltip",
            }
        case LessonVideoKind.EditedStream:
            return {
                icon: <SparkleIcon className="size-4" />,
                label: "lessonVideoKind.editedStream.label",
                tooltip: "lessonVideoKind.editedStream.tooltip",
            }
        case LessonVideoKind.PremiumRecord:
            return {
                icon: <FilmReelIcon className="size-4" />,
                label: "lessonVideoKind.premiumRecord.label",
                tooltip: "lessonVideoKind.premiumRecord.tooltip",
            }
        default:
            throw new Error(`Invalid kind: ${kind}`)
        }
    }
    const { icon, label, tooltip } = useMemo(() => renderLessonVideoKind(), [kind])
    return (
        <Tooltip>
            <Tooltip.Trigger>
                <Chip color="warning" size="sm" variant="soft">
                    {icon}
                    <Chip.Label>{t(label)}</Chip.Label>
                </Chip>
            </Tooltip.Trigger>
            <Tooltip.Content>{t(tooltip)}</Tooltip.Content>
        </Tooltip>
    )
}
