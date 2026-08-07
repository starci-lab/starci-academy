import React from "react"
import { Typography } from "@heroui/react"
import { SealCheckIcon } from "@phosphor-icons/react"
import { ReactionBar } from "../ReactionBar"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import type { QueryCommunityCommentNode } from "@/modules/api/graphql/queries/types/community-comments"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { UserAvatar } from "@/components/blocks/identity/UserAvatar"

/** Props for {@link _CommunityCommentRow} — presentational; labels already resolved. */
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
    /** Already-localized placeholder shown instead of the body when the comment is soft-deleted. */
    deletedLabel: string
    /** Already-localized relative "x minutes ago" timestamp. */
    timeAgoLabel: string
}

/**
 * One community comment row: avatar + author (with founder badge) + relative time,
 * the markdown body, a reaction bar, and an optional actions slot. Pure block:
 * owns its look; the owning feature supplies data + the react handler + actions.
 *
 * @param props - {@link CommunityCommentRowProps}
 */
export const _CommunityCommentRow = ({
    comment,
    onReact,
    actions,
    deletedLabel,
    timeAgoLabel,
}: CommunityCommentRowProps) => {
    // resolve the display name, falling back to the username when unset
    const displayName = comment.author.displayName || comment.author.username

    // Soft-deleted comments are still returned by the listing (BE does not filter
    // `isDeleted`); render a muted placeholder instead of the (empty) body, and
    // suppress author identity, the reaction bar, and reply/edit controls. The
    // `actions` slot is still rendered so thread navigation (e.g. "view replies")
    // the owning feature chooses to keep stays reachable on a deleted node.
    if (comment.isDeleted) {
        return (
            <div>
                <div className="flex min-w-0 flex-col gap-1">
                    <Typography type="body-xs" color="muted" className="italic">
                        {deletedLabel}
                    </Typography>
                    {actions ? (
                        <div className="flex items-center gap-3">{actions}</div>
                    ) : null}
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex gap-3">
                <UserAvatar
                    username={comment.author.username}
                    avatar={comment.author.avatar}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center gap-1">
                        <Typography type="body-xs" weight="semibold" truncate>
                            {displayName}
                        </Typography>
                        {comment.isFounderAuthor ? (
                            <SealCheckIcon
                                weight="fill"
                                className="size-3.5 shrink-0 text-accent-soft-foreground"
                            />
                        ) : null}
                        <Typography type="body-xs" color="muted">
                            {timeAgoLabel}
                        </Typography>
                    </div>
                    <MarkdownContent markdown={comment.body} className="[&_p]:m-0" />
                    <div className="flex items-center gap-3">
                        <ReactionBar
                            count={comment.reactions.total}
                            myReaction={comment.reactions.myReaction}
                            onReact={onReact}
                        />
                        {actions}
                    </div>
                </div>
            </div>
        </div>
    )
}
