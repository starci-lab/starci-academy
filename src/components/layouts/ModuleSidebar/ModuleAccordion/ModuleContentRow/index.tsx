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
import {
    ContentKind,
} from "../../enums"
import {
    MODULE_CONTENT_KIND_ICON_MAP,
} from "../../map"
import {
    getContentKind,
} from "../../utils"

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
    /** Free vs premium, deciding the leading icon (premium = star, free = article). */
    const kind = getContentKind(content)
    const KindIcon = MODULE_CONTENT_KIND_ICON_MAP[kind]
    const onPress = useCallback(
        () => onSelectContent(content.id),
        [
            content.id,
            onSelectContent,
        ],
    )
    /** Foreground by default; accent when this content is the active one. */
    const iconClass = cn(
        "size-5 shrink-0",
        isActive ? "text-accent" : "text-foreground",
    )
    return (
        <div>
            <div className="flex items-start gap-3">
                {/* Kind icon: star (premium) / article (free) */}
                <div className="mt-0.5 shrink-0">
                    <KindIcon
                        className={iconClass}
                        weight={kind === ContentKind.Premium ? "fill" : "regular"}
                    />
                </div>

                {/* Content body */}
                <div className="min-w-0 flex-1">
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
            </div>
            <div className="h-3" />
            {!isLast && <div className="border-t " />}
        </div>
    )
}
