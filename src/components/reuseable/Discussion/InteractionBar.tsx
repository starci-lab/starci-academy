"use client"

import { Bookmark as BookmarkSimpleIcon, BookmarkFill, Eye as EyeIcon, NodesRight as ShareNetworkIcon, SquareDashedText as ArrowsOutIcon } from "@gravity-ui/icons"
import React, { useRef, useState } from "react"
import { Spinner, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { ReactionType, type ReactionSummary } from "@/modules/api"
import { REACTIONS, REACTION_BY_TYPE } from "./constants"
import { ReactionEmoji } from "./ReactionEmoji"


/** Action toolbar props mirrored from ActionToolbar. */
export interface ActionBarProps {
    isFavorite: boolean
    isShareVisible: boolean
    isFavoritePending: boolean
    onToggleFavorite: () => void
    onShare: () => void
    onFullscreen: () => void
}

/** Props for {@link InteractionBar}. */
export interface InteractionBarProps extends ActionBarProps {
    /** Aggregate reaction summary for the content. */
    summary: ReactionSummary | undefined
    /** React to / un-react from the content (null removes the reaction). */
    onReact: (type: ReactionType | null) => void
    /** Optional view count from the server (undefined = not tracked yet). */
    viewCount?: number
    /** Optional share count from the server (undefined = not tracked yet). */
    shareCount?: number
}

/**
 * Facebook-style two-row interaction bar:
 *
 * ROW 1 — stats:  LEFT = stacked emoji reactions + total
 *                 RIGHT = 👁 view count  📤 share count
 *
 * ROW 2 — action tabs (equal-width, separator-divided, like Facebook's Like/Comment/Share):
 *          [😊 Yêu thích] | [🔖 Lưu] | [↗ Chia sẻ] | [⛶ Mở rộng]
 */
export const InteractionBar = ({
    summary,
    onReact,
    isFavorite,
    isShareVisible,
    isFavoritePending,
    onToggleFavorite,
    onShare,
    onFullscreen,
    viewCount,
    shareCount,
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

    const myDescriptor = myReaction
        ? REACTION_BY_TYPE[myReaction]
        : REACTION_BY_TYPE[ReactionType.Like]

    const handlePick = (type: ReactionType) => {
        setPickerOpen(false)
        onReact(myReaction === type ? null : type)
    }

    return (
        <div className="flex flex-col">
            {/* ── ROW 1: stats ── */}
            <div className="flex items-center justify-between py-2">
                {/* LEFT: reaction emoji pill */}
                <div className="flex items-center gap-1.5">
                    {total > 0 ? (
                        <>
                            <span className="flex items-center -space-x-1">
                                {topReactions.map((r) => (
                                    <ReactionEmoji key={r.type} descriptor={r} size="xs" />
                                ))}
                            </span>
                            <span className="text-sm text-muted">{total}</span>
                        </>
                    ) : (
                        <span className="h-5" />
                    )}
                </div>

                {/* RIGHT: view + share counts */}
                <div className="flex items-center gap-3 text-xs text-muted">
                    {viewCount !== undefined && (
                        <span className="flex items-center gap-1">
                            <EyeIcon className="size-3.5" />
                            {viewCount.toLocaleString()}
                        </span>
                    )}
                    {shareCount !== undefined && isShareVisible && (
                        <span className="flex items-center gap-1">
                            <ShareNetworkIcon className="size-3.5" />
                            {shareCount.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>

            {/* ── divider ── */}
            <div className="border-t border-default" />

            {/* ── ROW 2: action tabs (Facebook-style) ── */}
            <div className="flex items-stretch divide-x divide-default">
                {/* Yêu thích — reaction picker trigger */}
                <div
                    ref={pickerRef}
                    className="relative flex flex-1"
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
                            "flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors hover:bg-default/50",
                            myReaction ? "text-accent" : "text-muted",
                        )}
                    >
                        <ReactionEmoji descriptor={myDescriptor} size="xs" />
                        <span>
                            {myReaction
                                ? t(REACTION_BY_TYPE[myReaction].labelKey)
                                : t("discussion.react")}
                        </span>
                    </button>

                    {/* floating emoji picker */}
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

                {/* Lưu — bookmark */}
                <button
                    type="button"
                    onClick={onToggleFavorite}
                    disabled={isFavoritePending}
                    className={cn(
                        "flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-default/50",
                        isFavorite && "text-accent",
                    )}
                >
                    {isFavoritePending ? (
                        <Spinner className="size-4" />
                    ) : isFavorite ? (
                        <BookmarkFill className="size-4" />
                    ) : (
                        <BookmarkSimpleIcon className="size-4" />
                    )}
                    <span>{t("content.save")}</span>
                </button>

                {/* Chia sẻ — share (hidden for premium) */}
                {isShareVisible ? (
                    <button
                        type="button"
                        onClick={onShare}
                        className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-default/50"
                    >
                        <ShareNetworkIcon className="size-4" />
                        <span>{t("content.share")}</span>
                    </button>
                ) : null}

                {/* Mở rộng — fullscreen */}
                <button
                    type="button"
                    onClick={onFullscreen}
                    className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-default/50"
                >
                    <ArrowsOutIcon className="size-4" />
                    <span>{t("content.fullscreen")}</span>
                </button>
            </div>
        </div>
    )
}
