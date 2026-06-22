"use client"

import React, { useState } from "react"
import { Button, Popover, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { ReactionType, type ReactionSummary } from "@/modules/api"
import type { WithClassNames } from "@/modules/types"
import { REACTIONS, REACTION_BY_TYPE } from "./constants"
import { ReactionEmoji } from "./ReactionEmoji"

/** Props for {@link ReactionBar}. */
export interface ReactionBarProps extends WithClassNames<undefined> {
    /** Current reaction summary for the target (content or comment). */
    summary: ReactionSummary | undefined
    /** Called with a new emotion, or null to remove the current one. */
    onReact: (type: ReactionType | null) => void
    /** Disables interaction (e.g. while a mutation is in flight). */
    disabled?: boolean
}

/**
 * Facebook-style reaction control: a HeroUI Button trigger that opens a 6-emoji picker
 * (HeroUI Popover), plus a compact summary (top emojis + total). Picking the active
 * emotion again removes it. The SAME control is used for both the content reaction
 * (InteractionBar) and each comment, so they render identically.
 *
 * Presentational: only local picker-open state; all persistence is delegated via `onReact`.
 * @param props - {@link ReactionBarProps}
 */
export const ReactionBar = ({ summary, onReact, disabled, className }: ReactionBarProps) => {
    const t = useTranslations()
    // controlled so the popover closes as soon as an emotion is picked
    const [open, setOpen] = useState(false)
    const myReaction = summary?.myReaction ?? null
    const total = summary?.total ?? 0
    // emotions present on the target, busiest first, capped to the top 3 descriptors
    const topReactions = (summary?.counts ?? [])
        .slice()
        .sort((prev, next) => next.count - prev.count)
        .slice(0, 3)
        .map((count) => REACTION_BY_TYPE[count.type])
        .filter(Boolean)

    const myDescriptor = myReaction ? REACTION_BY_TYPE[myReaction] : REACTION_BY_TYPE[ReactionType.Like]

    // picking an emotion toggles it off when it's already the user's pick, then closes
    const handlePick = (type: ReactionType) => {
        setOpen(false)
        onReact(myReaction === type ? null : type)
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {/* trigger: a real HeroUI Button (pill); secondary once the viewer has reacted */}
            <Popover isOpen={open} onOpenChange={setOpen}>
                <Popover.Trigger>
                    <Button
                        size="sm"
                        variant={myReaction ? "secondary" : "tertiary"}
                        isDisabled={disabled}
                        className="rounded-full"
                    >
                        <ReactionEmoji descriptor={myDescriptor} size="xs" />
                        <span className="text-xs">
                            {myReaction
                                ? t(REACTION_BY_TYPE[myReaction].labelKey)
                                : t("discussion.react")}
                        </span>
                    </Button>
                </Popover.Trigger>
                <Popover.Content className="flex items-center gap-2 rounded-full p-1">
                    {REACTIONS.map((reaction) => (
                        <button
                            key={reaction.type}
                            type="button"
                            aria-label={t(reaction.labelKey)}
                            title={t(reaction.labelKey)}
                            onClick={() => handlePick(reaction.type)}
                            className={cn(
                                "cursor-pointer rounded-full p-1 transition-transform hover:scale-125",
                                myReaction === reaction.type ? "bg-accent/10" : undefined,
                            )}
                        >
                            <ReactionEmoji descriptor={reaction} size="sm" />
                        </button>
                    ))}
                </Popover.Content>
            </Popover>

            {/* compact summary: stacked top emojis + total count */}
            {total > 0 ? (
                <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="flex items-center -space-x-1">
                        {topReactions.map((reaction) => (
                            <ReactionEmoji key={reaction.type} descriptor={reaction} size="xs" />
                        ))}
                    </span>
                    <span>{total}</span>
                </div>
            ) : null}
        </div>
    )
}
