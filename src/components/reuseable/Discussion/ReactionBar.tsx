"use client"

import React, { useRef, useState } from "react"
import { Button, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { ReactionType, type ReactionSummary } from "@/modules/api"
import { REACTIONS, REACTION_BY_TYPE } from "./constants"
import { ReactionEmoji } from "./ReactionEmoji"

/** Props for {@link ReactionBar}. */
export interface ReactionBarProps {
    /** Current reaction summary for the target (content or comment). */
    summary: ReactionSummary | undefined
    /** Called with a new emotion, or null to remove the current one. */
    onReact: (type: ReactionType | null) => void
    /** Disables interaction (e.g. while a mutation is in flight). */
    disabled?: boolean
}

/**
 * Facebook-style reaction control: a trigger that opens a 6-emoji picker, plus a compact
 * summary (top emojis + total). Picking the active emotion again removes it.
 *
 * Presentational: only local open state; all persistence is delegated via `onReact`.
 * @param props - {@link ReactionBarProps}
 */
export const ReactionBar = ({ summary, onReact, disabled }: ReactionBarProps) => {
    const t = useTranslations()
    // local visibility of the emoji picker panel
    const [pickerOpen, setPickerOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
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

    // picking an emotion toggles it off when it's already the user's pick
    const handlePick = (type: ReactionType) => {
        setPickerOpen(false)
        onReact(myReaction === type ? null : type)
    }

    return (
        <div
            ref={containerRef}
            className="relative flex items-center gap-1.5"
            onBlur={(e) => {
                // close picker when focus leaves the entire reaction bar
                if (!containerRef.current?.contains(e.relatedTarget as Node)) {
                    setPickerOpen(false)
                }
            }}
        >
            {/* trigger button: shows current reaction or default "Like" */}
            <Button
                size="sm"
                variant={myReaction ? "secondary" : "tertiary"}
                isDisabled={disabled}
                onPress={() => setPickerOpen((prev) => !prev)}
                className="rounded-full"
            >
                <ReactionEmoji descriptor={myDescriptor} size="xs" />
                <span className="text-xs">
                    {myReaction
                        ? t(REACTION_BY_TYPE[myReaction].labelKey)
                        : t("discussion.react")}
                </span>
            </Button>

            {/* compact summary: stacked top emojis + total count */}
            {total > 0 ? (
                <div className="flex items-center gap-1 text-xs text-muted">
                    <span className="flex items-center -space-x-1">
                        {topReactions.map((reaction) => (
                            <ReactionEmoji key={reaction.type} descriptor={reaction} size="xs" />
                        ))}
                    </span>
                    <span>{total}</span>
                </div>
            ) : null}

            {/* emoji picker panel — floats above the trigger */}
            {pickerOpen ? (
                <div className="absolute bottom-full left-0 z-20 mb-2 flex items-center gap-1 rounded-full border border-default bg-background p-1 shadow-lg">
                    {REACTIONS.map((reaction) => (
                        <button
                            key={reaction.type}
                            type="button"
                            aria-label={t(reaction.labelKey)}
                            title={t(reaction.labelKey)}
                            onClick={() => handlePick(reaction.type)}
                            className={cn(
                                "rounded-full p-1 transition-transform hover:scale-125",
                                myReaction === reaction.type ? "bg-accent/10" : undefined,
                            )}
                        >
                            <ReactionEmoji descriptor={reaction} size="sm" />
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    )
}
