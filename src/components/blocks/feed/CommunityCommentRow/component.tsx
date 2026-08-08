import React from "react"
import { Typography } from "@/components/atoms/text/Typography"
import { SealCheckIcon } from "@phosphor-icons/react"
import { ReactionBar } from "../ReactionBar"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import type { QueryCommunityCommentNode } from "@/modules/api/graphql/queries/types/community-comments"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { IdentityContentRow } from "@/components/composites/lists/IdentityContentRow"
import { StackH, StackV } from "@/components/frames/Stack"

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
            <StackV
                identity={{ tier: "block", component: "CommunityCommentRow" }}
                principle="sibling-stack"
                explain="Same-kind peer stack — not group-boundary, because the deleted placeholder and optional actions are repeating siblings in one row unit."
                items={[
                    () => (
                        <Typography size="xs" color="muted" isItalic text={deletedLabel} />
                    ),
                    ...(actions ? [() => (
                        <StackH
                            principle="flex-action"
                            explain="Deleted-row actions share one action row — not content-row, because both peers are controls rather than content-plus-meta."
                            items={[() => <>{actions}</>]}
                        />
                    )] : []),
                ]}
            />
        )
    }

    return (
        <StackV
            identity={{ tier: "block", component: "CommunityCommentRow" }}
            principle="sibling-stack"
            explain="Same-kind peer stack — not group-boundary, because this comment row is a single vertical unit owned by the block root."
            items={[
                () => (
                    <IdentityContentRow
                        avatarSrc={comment.author.avatar ?? undefined}
                        avatarName={displayName}
                        avatarSeed={comment.author.username}
                        byline={() => (
                            <StackH
                                principle="separator-dot"
                                explain="Places a middle-dot separator between short meta peers so the items read as one inline list."
                                items={[
                                    () => (
                                        <StackH
                                            principle="icon-text"
                                            explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                                            items={[
                                                () => (
                                                    <Typography size="xs" weight="semibold" truncate text={displayName} />
                                                ),
                                                ...(comment.isFounderAuthor ? [() => (
                                                    <SealCheckIcon
                                                        weight="fill"
                                                        aria-hidden
                                                        focusable="false"
                                                        className="size-3.5 shrink-0 text-accent-soft-foreground"
                                                    />
                                                )] : []),
                                            ]}
                                        />
                                    ),
                                    () => (
                                        <Typography size="xs" color="muted" text={timeAgoLabel} />
                                    ),
                                ]}
                            />
                        )}
                        body={() => (
                            <StackV
                                principle="sibling-stack"
                                explain="Same-kind peer stack — not group-boundary, because markdown body and reaction/actions are repeating siblings under the byline."
                                items={[
                                    () => (
                                        <MarkdownContent markdown={comment.body} flow="embedded" />
                                    ),
                                    () => (
                                        <StackH
                                            principle="flex-action"
                                            explain="Reaction bar and optional reply controls share one action row — not content-row, because both peers are controls rather than content-plus-meta."
                                            items={[
                                                () => (
                                                    <ReactionBar
                                                        count={comment.reactions.total}
                                                        myReaction={comment.reactions.myReaction}
                                                        onReact={onReact}
                                                    />
                                                ),
                                                ...(actions ? [() => <>{actions}</>] : []),
                                            ]}
                                        />
                                    ),
                                ]}
                            />
                        )}
                    />
                ),
            ]}
        />
    )
}
