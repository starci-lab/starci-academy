"use client"

import React from "react"
import { FilmStripIcon as FilmReelIcon, SparkleIcon } from "@phosphor-icons/react"
import { cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { SiTwitch as TwitchLogoIcon } from "@icons-pack/react-simple-icons"
import { LessonVideoKind } from "@/modules/types/enums/lesson-video-kind"
import { EnumChip } from "@/components/blocks/chips/EnumChip"
import type { EnumChipEntry } from "@/components/blocks/chips/EnumChip"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * The props for the LessonVideoKindChip component.
 * @param kind - The kind of the lesson video.
 */
export interface LessonVideoKindChipProps extends WithClassNames<undefined> {
    /** Lesson video kind from the API. */
    kind: LessonVideoKind
}

/**
 * Chip with a tooltip explaining the lesson video kind (raw stream, edited, premium).
 * Thin domain map over the shared {@link EnumChip} primitive (warning-toned, per-kind
 * icon + tooltip).
 */
export const LessonVideoKindChip = ({ kind, className }: LessonVideoKindChipProps) => {
    const t = useTranslations()
    const map: Record<LessonVideoKind, EnumChipEntry> = {
        [LessonVideoKind.RawStream]: {
            color: "warning",
            icon: <TwitchLogoIcon className="size-5" />,
            label: t("lessonVideoKind.rawStream.label"),
            tooltip: t("lessonVideoKind.rawStream.tooltip"),
        },
        [LessonVideoKind.EditedStream]: {
            color: "warning",
            icon: <SparkleIcon className="size-5" />,
            label: t("lessonVideoKind.editedStream.label"),
            tooltip: t("lessonVideoKind.editedStream.tooltip"),
        },
        [LessonVideoKind.PremiumRecord]: {
            color: "warning",
            icon: <FilmReelIcon className="size-5" />,
            label: t("lessonVideoKind.premiumRecord.label"),
            tooltip: t("lessonVideoKind.premiumRecord.tooltip"),
        },
    }
    return <EnumChip value={kind} map={map} className={cn(className)} />
}
