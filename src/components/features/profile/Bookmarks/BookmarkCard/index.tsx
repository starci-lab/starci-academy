"use client"

import { ArrowRightIcon, ClockIcon, FireIcon } from "@phosphor-icons/react"
import React, {
    useCallback,
} from "react"
import {
    Typography,
    cn,
} from "@heroui/react"
import {
    PressableCard,
} from "@/components/blocks"
import {
    useRouter,
} from "next/navigation"
import {
    useTranslations,
} from "next-intl"
import {
    type ContentEntity,
    getContentChallengeCount,
    type WithClassNames,
} from "@/modules/types"
import {
    pathConfig,
} from "@/resources/path"

/** Props for {@link BookmarkCard} (list item — per-item content data only). */
export interface BookmarkCardProps extends WithClassNames<undefined> {
    /** Saved content entity rendered by this card. */
    content: ContentEntity
}

/**
 * One saved-content card: title, description, and read/lesson/challenge meta.
 *
 * List item: receives its own content entity; self-navigates to the content
 * page via the router (no open callback drilled from the parent).
 * @param props - the saved content
 */
export const BookmarkCard = ({
    content,
    className,
}: BookmarkCardProps) => {
    const t = useTranslations()
    const router = useRouter()
    const challengeCount = getContentChallengeCount(content)

    const onPress = useCallback(
        () => {
            if (content.displayId) {
                router.push(pathConfig().locale().publicContent(content.displayId).build())
            }
        },
        [
            content.displayId,
            router,
        ],
    )
    return (
        <PressableCard
            onPress={onPress}
            className={cn("flex flex-row items-center gap-3", className)}
        >
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Typography type="body-sm" weight="semibold" truncate>
                    {content.title}
                </Typography>
                <Typography type="body-xs" color="muted" truncate>
                    {content.description}
                </Typography>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <ClockIcon aria-hidden className="size-4 text-muted" />
                        <Typography type="body-xs" color="muted">
                            {t("content.minutesRead", { minutes: content.minutesRead })}
                        </Typography>
                    </div>
                    {challengeCount > 0 && (
                        <div className="flex items-center gap-2">
                            <FireIcon aria-hidden className="size-4 text-muted" />
                            <Typography type="body-xs" color="muted">
                                {t("content.challengeCount", { count: challengeCount })}
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
            <ArrowRightIcon aria-hidden className="size-5 shrink-0 text-muted" />
        </PressableCard>
    )
}
