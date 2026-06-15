"use client"

import { ArrowRight as ArrowRightIcon, Clock as ClockIcon, Flame } from "@gravity-ui/icons"
import React, {
    useCallback,
} from "react"
import {
    cn,
    Card,
    Button,
} from "@heroui/react"
import {
    useRouter,
} from "next/navigation"
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
        <Card
            className={cn("w-full hover:border-accent transition-colors cursor-pointer", className)}
            onClick={onPress}
        >
            <div className="p-4 flex flex-row items-center gap-3 w-full text-left">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">{content.title}</h3>
                    <p className="text-sm text-muted line-clamp-2 mt-1">{content.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted">
                        <div className="flex items-center gap-1.5">
                            <ClockIcon className="size-4" />
                            <span>{content.minutesRead} min read</span>
                        </div>
                        {challengeCount > 0 && (
                            <div className="flex items-center gap-1.5">
                                <Flame className="size-4" />
                                <span>{challengeCount} challenges</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="shrink-0 pl-2">
                    <Button
                        isIconOnly
                        variant="ghost"
                        className="rounded-full"
                    >
                        <ArrowRightIcon className="size-5 text-muted" />
                    </Button>
                </div>
            </div>
        </Card>
    )
}
