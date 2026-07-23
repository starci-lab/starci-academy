import React from "react"
import { Typography } from "@heroui/react"
import { SealCheckIcon } from "@phosphor-icons/react"
import { ReactionBar, ReactionType } from "../ReactionBar/ReactionBar"
import { UserAvatar } from "../../identity/UserAvatar/UserAvatar"
import { MarkdownContent } from "../../rendering/MarkdownContent/MarkdownContent"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK ported faithfully from
 * `@/components/blocks/feed/CommunityCommentRow`. Composed from local primitives
 * `UserAvatar` + `MarkdownContent` + the local `ReactionBar` block. Synced to `src`
 * later. `@/modules` types + the localized time-ago label are inlined locally.
 */

/** Local mirror of the comment author shape. */
export interface CommunityPostAuthor {
    id: string
    username: string
    displayName: string
    avatar: string | null
}

/** Local mirror of `QueryCommunityCommentNode` from `@/modules/api/graphql/...`. */
export interface QueryCommunityCommentNode {
    id: string
    body: string
    isDeleted: boolean
    editedAt: string | null
    createdAt: string
    parentCommentId: string | null
    author: CommunityPostAuthor
    replyCount: number
    reactions: { total: number, myReaction: ReactionType | null }
    isFounderAuthor: boolean
}

/**
 * Local mirror of the shared `getTimeAgoLabel(getTimeAgoMessage(...))` helper — a
 * compact Vietnamese relative-time formatter so the block renders without next-intl.
 */
export const timeAgo = (iso: string): string => {
    const diffMs = Date.now() - new Date(iso).getTime()
    const minute = 60_000
    const hour = 60 * minute
    const day = 24 * hour
    if (diffMs < minute) {
        return "vừa xong"
    }
    if (diffMs < hour) {
        return `${Math.floor(diffMs / minute)} phút trước`
    }
    if (diffMs < day) {
        return `${Math.floor(diffMs / hour)} giờ trước`
    }
    return `${Math.floor(diffMs / day)} ngày trước`
}

/** Props for the {@link CommunityCommentRow} block. */
export interface CommunityCommentRowProps {
    /** The comment to render. */
    comment: QueryCommunityCommentNode
    /**
     * React handler — pass the chosen emotion, or `null` to remove. Omit to render
     * the reaction bar READ-ONLY (e.g. when the viewer is signed out).
     */
    onReact?: (type: ReactionType | null) => void
    /**
     * Optional actions rendered below the body (e.g. reply / view-replies controls).
     * Supplied by the owning feature so the row stays presentational.
     */
    actions?: React.ReactNode
    /** Extra classes merged onto the root. */
    className?: string
    /** When on, each composed part emits `data-anat-part` for the anatomy panel. */
    showAnatomy?: boolean
}

/**
 * One community comment row: avatar + author (with founder badge) + relative time,
 * the markdown body, a reaction bar, and an optional actions slot. Pure block:
 * owns its look; the owning feature supplies data + the react handler + actions.
 *
 * @param props - {@link CommunityCommentRowProps}
 */
export const CommunityCommentRow = ({
    comment,
    onReact,
    actions,
    className,
    showAnatomy,
}: CommunityCommentRowProps) => {
    // resolve the display name, falling back to the username when unset
    const displayName = comment.author.displayName || comment.author.username

    return (
        <div className={className}>
            <div className="flex gap-3">
                <UserAvatar
                    username={comment.author.username}
                    avatar={comment.author.avatar}
                    anatPart={showAnatomy ? "UserAvatar" : undefined}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center gap-1">
                        <Typography
                            type="body-xs"
                            weight="semibold"
                            truncate
                            data-anat-part={showAnatomy ? "Typography" : undefined}
                        >
                            {displayName}
                        </Typography>
                        {comment.isFounderAuthor ? (
                            <SealCheckIcon
                                weight="fill"
                                className="size-3.5 shrink-0 text-accent-soft-foreground"
                                data-anat-part={showAnatomy ? "SealCheckIcon" : undefined}
                            />
                        ) : null}
                        <Typography
                            type="body-xs"
                            color="muted"
                            data-anat-part={showAnatomy ? "Typography" : undefined}
                        >
                            {timeAgo(comment.createdAt)}
                        </Typography>
                    </div>
                    <MarkdownContent
                        markdown={comment.body}
                        className="[&_p]:m-0"
                        anatPart={showAnatomy ? "MarkdownContent" : undefined}
                    />
                    <div className="flex items-center gap-3">
                        <ReactionBar
                            count={comment.reactions.total}
                            myReaction={comment.reactions.myReaction}
                            onReact={onReact}
                            anatPart={showAnatomy ? "ReactionBar" : undefined}
                        />
                        {actions}
                    </div>
                </div>
            </div>
        </div>
    )
}
