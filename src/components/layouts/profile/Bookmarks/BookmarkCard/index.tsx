"use client"

import { ArrowRight as ArrowRightIcon, Clock as ClockIcon, Flame } from "@gravity-ui/icons"
import React, {
    useCallback,
} from "react"
import {
    Card,
    Button,
} from "@heroui/react"
import {
    type ContentEntity,
    getContentChallengeCount,
} from "@/modules/types"

/** Props for {@link BookmarkCard}. */
export interface BookmarkCardProps {
    /** Saved content entity rendered by this card. */
    content: ContentEntity
    /** Fired with the content's `displayId` when the card is pressed. */
    onOpen: (displayId: string) => void
}

/**
 * One saved-content card: title, description, and read/lesson/challenge meta.
 *
 * Presentational: render + a thin open callback, no business logic. The whole
 * card is the click target; the trailing arrow button is purely decorative.
 * @param props - the saved content + open callback
 */
export const BookmarkCard = ({
    content,
    onOpen,
}: BookmarkCardProps) => {
    const challengeCount = getContentChallengeCount(content)
    const onPress = useCallback(
        () => {
            if (content.displayId) {
                onOpen(content.displayId)
            }
        },
        [
            content.displayId,
            onOpen,
        ],
    )
    return (
        <Card
            className="w-full hover:border-accent transition-colors cursor-pointer"
            onClick={onPress}
        >
            <div className="p-4 flex flex-row items-center gap-4 w-full text-left">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">{content.title}</h3>
                    <p className="text-sm text-muted line-clamp-2 mt-1">{content.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted">
                        <div className="flex items-center gap-1">
                            <ClockIcon className="size-4" />
                            <span>{content.minutesRead} min read</span>
                        </div>
                        {challengeCount > 0 && (
                            <div className="flex items-center gap-1">
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
