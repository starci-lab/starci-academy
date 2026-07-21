import React from "react"
import { Card, CardContent, Typography } from "@heroui/react"
import { ChatCircleIcon, PushPinIcon, SealCheckIcon } from "@phosphor-icons/react"
import { ReactionBar, ReactionType } from "../ReactionBar/ReactionBar"
import { UserAvatar } from "../../identity/UserAvatar/UserAvatar"
import { MarkdownContent } from "../../rendering/MarkdownContent/MarkdownContent"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK ported faithfully from
 * `@/components/blocks/feed/CommunityPostCard`. Composed from local primitives
 * `UserAvatar` + `MarkdownContent` + the local `ReactionBar` block, framed by HeroUI
 * `Card`. Synced to `src` later. `@/modules` types, the channel label, and the
 * time-ago label are inlined locally.
 */

/** Local mirror of `CommunityChannel`. */
export enum CommunityChannel {
    General = "GENERAL",
    FounderQa = "FOUNDER_QA",
    Problems = "PROBLEMS",
}

/** Localized channel label (inlined mirror of `t("community.channel.*")`). */
const CHANNEL_LABEL: Record<CommunityChannel, string> = {
    [CommunityChannel.General]: "Chung",
    [CommunityChannel.FounderQa]: "Hỏi founder",
    [CommunityChannel.Problems]: "Vấn đề",
}

/** Local mirror of the post author shape. */
export interface CommunityPostAuthor {
    id: string
    username: string
    displayName: string
    avatar: string | null
}

/** Local mirror of `QueryCommunityFeedItemData`. */
export interface QueryCommunityFeedItemData {
    id: string
    body: string
    channel: CommunityChannel
    isPinned: boolean
    editedAt: string | null
    createdAt: string
    author: CommunityPostAuthor
    commentCount: number
    reactions: { total: number, myReaction: ReactionType | null }
    isMine: boolean
    isFounderAuthor: boolean
}

/** Compact Vietnamese relative-time formatter (mirror of the shared time-ago helper). */
const timeAgo = (iso: string): string => {
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

/** Props for the {@link CommunityPostCard} block. */
export interface CommunityPostCardProps {
    /** The post to render (author relation already loaded). */
    post: QueryCommunityFeedItemData
    /**
     * React handler — `(postId, emotion | null)`. Omit to render the reaction bar
     * READ-ONLY (e.g. when the viewer is signed out).
     */
    onReact?: (postId: string, type: ReactionType | null) => void
    /** Toggle the comment thread for this post. Omit to render the count static. */
    onToggleComments?: () => void
    /** Optional content rendered inside the card below the footer (e.g. comments). */
    children?: React.ReactNode
    /** Extra classes merged onto the card. */
    className?: string
}

/**
 * One community feed post: author header (avatar + name + relative time + channel
 * + pinned badge), the markdown body, and a footer with the reaction bar + comment
 * count. Pure block: owns its look; the owning feature supplies data + the react
 * handler. Body renders via MarkdownContent (compact) so inline code/markdown the
 * author wrote shows correctly.
 *
 * @param props - {@link CommunityPostCardProps}
 */
export const CommunityPostCard = ({
    post,
    onReact,
    onToggleComments,
    children,
    className,
}: CommunityPostCardProps) => {
    // resolve the display name, falling back to the username when unset
    const displayName = post.author.displayName || post.author.username

    return (
        <Card className={className}>
            <CardContent>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <UserAvatar
                            username={post.author.username}
                            avatar={post.author.avatar}
                        />
                        <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-center gap-1">
                                <Typography type="body-sm" weight="semibold" truncate>
                                    {displayName}
                                </Typography>
                                {post.isFounderAuthor ? (
                                    <SealCheckIcon
                                        weight="fill"
                                        className="size-4 shrink-0 text-accent-soft-foreground"
                                    />
                                ) : null}
                            </div>
                            <div className="flex items-center gap-2">
                                <Typography type="body-xs" color="muted" truncate>
                                    {`@${post.author.username}`}
                                </Typography>
                                <Typography type="body-xs" color="muted">
                                    {"·"}
                                </Typography>
                                <Typography type="body-xs" color="muted">
                                    {timeAgo(post.createdAt)}
                                </Typography>
                                <Typography type="body-xs" className="text-accent-soft-foreground">
                                    {CHANNEL_LABEL[post.channel]}
                                </Typography>
                            </div>
                        </div>
                        {post.isPinned ? (
                            <PushPinIcon weight="fill" className="size-4 shrink-0 text-accent-soft-foreground" />
                        ) : null}
                    </div>

                    <MarkdownContent markdown={post.body} className="[&_p]:m-0" />

                    <div className="flex items-center gap-6">
                        <ReactionBar
                            count={post.reactions.total}
                            myReaction={post.reactions.myReaction}
                            onReact={onReact ? (type) => onReact(post.id, type) : undefined}
                        />
                        <button
                            type="button"
                            disabled={!onToggleComments}
                            onClick={onToggleComments}
                            className="flex items-center gap-1 rounded-full px-2 py-0 text-muted transition-colors hover:bg-default/40 disabled:cursor-default disabled:hover:bg-transparent"
                        >
                            <ChatCircleIcon className="size-4 shrink-0" />
                            <Typography type="body-xs" color="muted">
                                {post.commentCount}
                            </Typography>
                        </button>
                    </div>

                    {children}
                </div>
            </CardContent>
        </Card>
    )
}
