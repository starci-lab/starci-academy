"use client"

import React, {
    useCallback,
} from "react"
import {
    Chip,
    cn,
    Link,
} from "@heroui/react"
import {
    ClockIcon,
    SwordIcon,
    VideoIcon,
} from "@phosphor-icons/react"
import {
    motion,
} from "framer-motion"
import {
    useTranslations,
} from "next-intl"
import {
    getContentChallengeCount,
} from "@/modules/types"
import type {
    ContentEntity,
} from "@/modules/types"

/** Horizontal drag bounds for the meta-chip strip. */
const META_DRAG_CONSTRAINTS = { left: -100, right: 0 }

/**
 * Props for {@link ModuleContentRow}.
 */
export interface ModuleContentRowProps {
    /** Content this row renders. */
    content: ContentEntity
    /** Whether this content is the active one. */
    isActive: boolean
    /** Whether this is the last content in its module (hides the divider). */
    isLast: boolean
    /** Fired with the content id when the title link is pressed. */
    onSelectContent: (contentId: string) => void
}

/**
 * One module content row: title link, description, and draggable meta chips
 * (minutes read, lesson count, challenge count).
 *
 * Presentational: renders one content and forwards a thin select callback.
 * `"use client"` for the press handler + drag motion.
 * @param props - content, active/last state, and select callback
 */
export const ModuleContentRow = ({
    content,
    isActive,
    isLast,
    onSelectContent,
}: ModuleContentRowProps) => {
    const t = useTranslations()
    const onPress = useCallback(
        () => onSelectContent(content.id),
        [
            content.id,
            onSelectContent,
        ],
    )
    return (
        <div>
            <div>
                <Link
                    onPress={onPress}
                    className={cn(
                        "font-medium text-foreground",
                        isActive ? "text-accent" : "",
                    )}
                >
                    {`${content.orderIndex + 1}. ${content.title}`}
                </Link>
                <div className="h-2" />
                <div className="line-clamp-3 text-xs text-muted">
                    {content.description}
                </div>
                <div className="h-3" />
                <div className="overflow-hidden">
                    <motion.div
                        className="flex w-max items-center gap-2"
                        drag="x"
                        dragConstraints={META_DRAG_CONSTRAINTS}
                        whileTap={{ cursor: "grabbing" }}
                    >
                        <Chip variant="tertiary" color="default" className="text-muted" size="sm">
                            <ClockIcon className="size-4" />
                            <Chip.Label>
                                {t("content.minutesRead", {
                                    minutes: content?.minutesRead ?? 0,
                                })}
                            </Chip.Label>
                        </Chip>
                        <Chip variant="tertiary" color="default" className="text-muted" size="sm">
                            <VideoIcon className="size-4" />
                            <Chip.Label>
                                {t("content.lessonCount", {
                                    count: content?.numLessons ?? 0,
                                })}
                            </Chip.Label>
                        </Chip>
                        <Chip variant="tertiary" color="default" className="text-muted" size="sm">
                            <SwordIcon className="size-4" />
                            <Chip.Label>
                                {t("content.challengeCount", {
                                    count: getContentChallengeCount(content ?? {}),
                                })}
                            </Chip.Label>
                        </Chip>
                    </motion.div>
                </div>
            </div>
            <div className="h-3" />
            {!isLast && <div className="border-t " />}
        </div>
    )
}
