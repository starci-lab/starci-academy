"use client"

import { EyeIcon } from "@phosphor-icons/react"
import React, { useRef, useState } from "react"
import { cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { ReactionType, type ReactionSummary } from "@/modules/api"
import type { WithClassNames } from "@/modules/types"
import { REACTIONS, REACTION_BY_TYPE } from "./constants"
import { ReactionEmoji } from "./ReactionEmoji"

/** Props for {@link InteractionBar}. */
export interface InteractionBarProps extends WithClassNames<undefined> {
    /** Aggregate reaction summary for the content. */
    summary: ReactionSummary | undefined
    /** React to / un-react from the content (null removes the reaction). */
    onReact: (type: ReactionType | null) => void
    /** Optional view count from the server (undefined = not tracked yet). */
    viewCount?: number
}

/**
 * Single-row content interaction: a reaction trigger (with a plain-emoji picker) + the reaction
 * summary on the left, the view count on the right. Save / share / fullscreen are intentionally
 * NOT here — they own a single home in the OnThisPage rail.
 */
export const InteractionBar = ({
    summary,
    onReact,
    viewCount,
    className,
}: InteractionBarProps) => {
    const t = useTranslations()
    const [pickerOpen, setPickerOpen] = useState(false)
    const pickerRef = useRef<HTMLDivElement>(null)

    const myReaction = summary?.myReaction ?? null
    const total = summary?.total ?? 0
    const topReactions = (summary?.counts ?? [])
        .slice()
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map((c) => REACTION_BY_TYPE[c.type])
        .filter(Boolean)
    const myDescriptor = myReaction ? REACTION_BY_TYPE[myReaction] : REACTION_BY_TYPE[ReactionType.Like]

    const handlePick = (type: ReactionType) => {
        setPickerOpen(false)
        onReact(myReaction === type ? null : type)
    }

    return (
        <div className={cn("flex items-center justify-between gap-3", className)}>
            {/* reaction trigger + summary */}
            <div
                ref={pickerRef}
                className="relative flex items-center gap-3"
                onBlur={(e) => {
                    if (!pickerRef.current?.contains(e.relatedTarget as Node)) {
                        setPickerOpen(false)
                    }
                }}
            >
                <button
                    type="button"
                    onClick={() => setPickerOpen((p) => !p)}
                    className={cn(
                        "flex cursor-pointer items-center gap-2 text-sm font-medium transition-colors hover:text-foreground",
                        myReaction ? "text-accent" : "text-muted",
                    )}
                >
                    <ReactionEmoji descriptor={myDescriptor} size="sm" />
                    <span>{myReaction ? t(REACTION_BY_TYPE[myReaction].labelKey) : t("discussion.react")}</span>
                </button>

                {total > 0 ? (
                    <span className="flex items-center gap-2 text-sm text-muted">
                        <span className="flex items-center -space-x-1">
                            {topReactions.map((r) => (
                                <ReactionEmoji key={r.type} descriptor={r} size="xs" />
                            ))}
                        </span>
                        <span>{total}</span>
                    </span>
                ) : null}

                {/* plain-emoji picker */}
                {pickerOpen ? (
                    <div className="absolute bottom-full left-0 z-20 mb-2 flex items-center gap-2 rounded-full border border-default bg-background p-1 shadow-lg">
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
                    </div>
                ) : null}
            </div>

            {/* view count */}
            {viewCount !== undefined ? (
                <span className="flex items-center gap-2 text-xs text-muted">
                    <EyeIcon aria-hidden focusable="false" className="size-4" />
                    {viewCount.toLocaleString()}
                </span>
            ) : null}
        </div>
    )
}
