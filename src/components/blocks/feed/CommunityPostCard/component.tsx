import React from "react"
import {
    ChatCircleIcon,
    PushPinIcon,
    SealCheckIcon,
} from "@phosphor-icons/react"
import { ReactionBar } from "../ReactionBar"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import type { QueryCommunityFeedItemData } from "@/modules/api/graphql/queries/types/community-feed"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { Avatar } from "@/components/atoms/display/Avatar"
import { Typography } from "@/components/atoms/text/Typography"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { StackH, StackV } from "@/components/frames/Stack"
import { FillAvailable } from "@/components/frames/FillAvailable"

/** Props for {@link _CommunityPostCard} — presentational; labels already resolved. */
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
    /** Already-localized relative "x minutes ago" timestamp. */
    timeAgoLabel: string
    /** Already-localized channel name (e.g. "General"). */
    channelLabel: string
}

/**
 * One community feed post: author header (avatar + name + relative time + channel
 * + pinned badge), the markdown body, and a footer with the reaction bar + comment
 * count. Pure block: owns its look; the owning feature supplies data + the react
 * handler. Body renders via MarkdownContent (embedded flow) so inline code/markdown the
 * author wrote shows correctly.
 *
 * @param props - {@link CommunityPostCardProps}
 */
export const _CommunityPostCard = ({
    post,
    onReact,
    onToggleComments,
    children,
    timeAgoLabel,
    channelLabel,
}: CommunityPostCardProps) => {
    // resolve the display name, falling back to the username when unset
    const displayName = post.author.displayName || post.author.username

    return (
        <SurfaceCard
            identity={{ tier: "block", component: "CommunityPostCard" }}
            body={() => (
                <StackV
                    principle="sibling-stack"
                    explain="Same-kind peer stack — not group-boundary, because header, body, footer, and optional thread are repeating siblings in one post unit."
                    items={[
                        () => (
                            <StackH
                                principle="content-row"
                                explain="Keeps the author avatar and meta column on one baseline so the pin does not drop under the title."
                                items={[
                                    () => (
                                        <Avatar
                                            src={post.author.avatar ?? undefined}
                                            name={displayName}
                                            seed={post.author.username}
                                        />
                                    ),
                                    () => (
                                        <FillAvailable
                                            at="base"
                                            body={() => (
                                                <StackV
                                                    principle="title-subtitle"
                                                    explain="Display name over handle/meta reads as title over subtitle — not label-field (no form control), not name-handle (the handle is muted second-line meta rather than a paired identity token), not icon-text (no glyph owns this seam)."
                                                    items={[
                                                        () => (
                                                            <StackH
                                                                principle="icon-text"
                                                                explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                                                                items={[
                                                                    () => (
                                                                        <Typography size="sm" weight="semibold" truncate text={displayName} />
                                                                    ),
                                                                    ...(post.isFounderAuthor ? [() => (
                                                                        <SealCheckIcon
                                                                            weight="fill"
                                                                            aria-hidden
                                                                            focusable="false"
                                                                            className="size-4 shrink-0 text-accent-soft-foreground"
                                                                        />
                                                                    )] : []),
                                                                ]}
                                                            />
                                                        ),
                                                        () => (
                                                            <StackH
                                                                principle="separator-dot"
                                                                explain="Places a middle-dot separator between short meta peers so the items read as one inline list."
                                                                items={[
                                                                    () => (
                                                                        <Typography size="xs" color="muted" truncate text={`@${post.author.username}`} />
                                                                    ),
                                                                    () => (
                                                                        <Typography size="xs" color="muted" text={timeAgoLabel} />
                                                                    ),
                                                                    () => (
                                                                        <Typography size="xs" color="accent-soft" text={channelLabel} />
                                                                    ),
                                                                ]}
                                                            />
                                                        ),
                                                    ]}
                                                />
                                            )}
                                        />
                                    ),
                                    ...(post.isPinned ? [() => (
                                        <PushPinIcon
                                            weight="fill"
                                            aria-hidden
                                            focusable="false"
                                            className="size-4 shrink-0 text-accent-soft-foreground"
                                        />
                                    )] : []),
                                ]}
                            />
                        ),
                        () => (
                            <MarkdownContent markdown={post.body} flow="embedded" />
                        ),
                        () => (
                            <StackH
                                principle="flex-action"
                                explain="Reaction bar and comment toggle share one action row — not content-row, because both peers are controls rather than content-plus-meta."
                                items={[
                                    () => (
                                        <ReactionBar
                                            count={post.reactions.total}
                                            myReaction={post.reactions.myReaction}
                                            onReact={onReact ? (type) => onReact(post.id, type) : undefined}
                                        />
                                    ),
                                    () => (
                                        <Typography
                                            size="xs"
                                            color="muted"
                                            isButton={Boolean(onToggleComments)}
                                            prefixIcon={ChatCircleIcon}
                                            text={String(post.commentCount)}
                                            onPress={onToggleComments}
                                        />
                                    ),
                                ]}
                            />
                        ),
                        ...(children ? [() => <>{children}</>] : []),
                    ]}
                />
            )}
        />
    )
}
