"use client"

import { Clock as ClockIcon, Flag as SwordIcon } from "@gravity-ui/icons"
import React, {
    useCallback,
} from "react"
import {
    Chip,
    Spinner,
    cn,
} from "@heroui/react"
import {
    motion,
} from "framer-motion"
import {
    useTranslations,
} from "next-intl"
import {
    useParams,
} from "next/navigation"
import {
    useQueryContentSwr,
} from "@/hooks"
import {
    getContentChallengeCount,
} from "@/modules/types"
import {
    ReadBadge,
} from "@/components/reuseable"
import type {
    ContentEntity,
} from "@/modules/types"
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
    /** Fired with the content id when the title link is pressed (module id is bound by the parent row). */
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
    // Spinner replaces the leading icon while THIS row's content is the one being
    // fetched. Gate on the URL content id (not Redux `isActive`, which lags one
    // frame behind navigation) so the spinner lands on the just-clicked row.
    const params = useParams()
    const { isLoading: isContentLoading } = useQueryContentSwr()
    const isLoadingTarget = params.contentId === content.id && isContentLoading
    const onPress = useCallback(
        () => {
            onSelectContent(content.id)
        },
        [
            content.id,
            onSelectContent,
        ],
    )
    // Keyboard parity for the clickable row: Enter/Space select like a button.
    const onKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onPress()
            }
        },
        [
            onPress,
        ],
    )
    /** Foreground by default; accent when this content is the active one. */
    const iconClass = cn(
        "size-5 shrink-0",
        isActive ? "text-accent" : "text-foreground",
    )
    return (
        <div>
            {/* Whole row is the navigation target (not just the title) so taps on the
                description/icon select too; button role + key handler give keyboard parity. */}
            <div
                role="button"
                tabIndex={0}
                onClick={onPress}
                onKeyDown={onKeyDown}
                className="flex cursor-pointer items-start gap-3"
            >
                {/* Kind icon: star (premium) / article (free); spinner while loading this content.
                    Fixed-size slot so swapping icon ↔ spinner never collapses the column width. */}
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center">
                    {isLoadingTarget ? (
                        <Spinner color="current"  />
                    ) : (
                        <KindIcon
                            className={iconClass}
                        />
                    )}
                </div>
                {/* Content body */}
                <div className="min-w-0 flex-1">
                    <div
                        className={cn(
                            "font-normal text-foreground",
                            isActive ? "font-semibold text-accent" : "",
                        )}
                    >
                        {`${content.orderIndex + 1}. ${content.title}`}
                    </div>
                    <div className="h-2" />
                    <div className="line-clamp-3 text-xs text-muted">
                        {content.description}
                    </div>
                    <div className="h-3" />
                    {/* Draggable meta strip: stop click bubbling so dragging/tapping the chips
                        doesn't trigger the row's navigation. */}
                    <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
                        {isActive && <ReadBadge size="sm" />}
                        <div className="overflow-hidden flex-1">
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
            </div>
            <div className="h-3" />
            {!isLast && <div className="border-t " />}
        </div>
    )
}
