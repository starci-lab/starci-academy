import React, { useMemo } from "react"
import { StarCiChip, StarCiTooltip } from "@/components/atomic"
import { LessonVideoKind } from "@/modules/types"
import { useTranslations } from "next-intl"
import { 
    TwitchLogoIcon,
    SparkleIcon,
    FilmReelIcon,
} from "@phosphor-icons/react"

/**
 * The props for the HostPlatformChip component.
 * @param kind - The kind of the lesson video.
 */
export interface LessonVideoKindChipProps {
    kind: LessonVideoKind
}

/**
 * A chip that displays the host platform of a lesson video.
 * @param kind - The kind of the lesson video.
 * @returns A chip that displays the host platform of a lesson video.
 */
export const LessonVideoKindChip = ({ kind }: LessonVideoKindChipProps) => {
    const t = useTranslations()
    // switch case to return the icon and label
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
        <StarCiTooltip
            content={t(tooltip)}
        >
            <StarCiChip 
                startContent={icon} 
                color="warning" 
                size="sm" 
                variant="flat"
            >
                {t(label)}
            </StarCiChip>
        </StarCiTooltip>
    )
}