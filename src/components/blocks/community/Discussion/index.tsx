"use client"

import React, { useMemo } from "react"
import { ChatsCircleIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/atoms/buttons/Button"
import { Spinner } from "@/components/atoms/display/Spinner"
import { Typography } from "@/components/atoms/text/Typography"
import { AsyncContentEmpty } from "@/components/composites/async/AsyncContent"
import { StackV } from "@/components/frames/Stack"
import { CommentComposer } from "./CommentComposer"
import { CommentItem } from "./CommentItem"
import { ReactionType, type CommentNode } from "@/modules/api/graphql/queries/types/discussion"

export * from "./ReactionBar"
export * from "./ReactionEmoji"
export * from "./FacebookReactionSelector"
export * from "./CommentComposer"
export * from "./CommentItem"
export * from "./InteractionBar"
export * from "./constants"

/** Props for {@link Discussion}. */
export interface DiscussionProps {
    /** Current viewer id (drives owner-only actions); null when unknown. */
    currentUserId: string | null
    /** Current viewer identity for the composer avatar; null when signed out. */
    currentUser: { username: string, avatar?: string } | null
    /** Top-level comments for the content. */
    comments: Array<CommentNode>
    /** Total top-level comment count (for the heading). */
    total: number
    /** Whether the first page of comments is still loading. */
    isLoading: boolean
    /** Replies keyed by parent comment id (lazily populated). */
    repliesByParent: Record<string, Array<CommentNode>>
    /** Post a new top-level comment. */
    onSubmitComment: (body: string) => void
    /** Post a reply under a parent comment. */
    onReply: (parentId: string, body: string) => void
    /** Edit a comment body (author only). */
    onEdit: (commentId: string, body: string) => void
    /** Soft-delete a comment (author only). */
    onDelete: (commentId: string) => void
    /** React to a comment (null removes the reaction). */
    onReactComment: (commentId: string, type: ReactionType | null) => void
    /** Lazily load the replies of a parent comment. */
    onLoadReplies: (parentId: string) => void
    /** Whether more top-level comment pages remain to load. */
    hasMore?: boolean
    /** Whether the next page is currently loading. */
    isLoadingMore?: boolean
    /** Load the next page of top-level comments. */
    onLoadMore?: () => void
}

/**
 * Bottom-of-lesson discussion zone — FRAMELESS: a label ("Discussion · N") + an honest
 * "archive line" above an avatar-led composer and the threaded comment list, sitting
 * directly on the page canvas (no card). Mirrors Storybook `ContentDiscussion` shape
 * with house Typography / Stack / Button / Spinner.
 *
 * @param props - {@link DiscussionProps}
 */
export const Discussion = ({
    currentUserId,
    currentUser,
    comments,
    total,
    isLoading,
    repliesByParent,
    onSubmitComment,
    onReply,
    onEdit,
    onDelete,
    onReactComment,
    onLoadReplies,
    hasMore,
    isLoadingMore,
    onLoadMore,
}: DiscussionProps) => {
    const t = useTranslations()

    // real (not fabricated) count of currently-loaded top-level questions that already
    // have at least one reply — the "compounds over time" answer archive
    const answeredCount = useMemo(
        () => comments.filter((comment) => comment.replyCount > 0).length,
        [comments],
    )

    return (
        <StackV
            identity={{ tier: "block", component: "Discussion" }}
            principle="group-boundary"
            explain="Header+composer group above the comment list — not sibling-stack, because these are section groups rather than repeating peers."
            items={[
                () => (
                    <StackV
                        principle="sibling-stack"
                        explain="Same-kind peer stack — not group-boundary, because label block and composer are repeating siblings in the header group."
                        items={[
                            () => (
                                <StackV
                                    principle="title-subtitle"
                                    explain="Discussion title over archive line reads as title over subtitle — not label-field (no form control), not name-handle (no identity pair), not icon-text (no glyph owns this seam)."
                                    items={[
                                        () => (
                                            <Typography
                                                weight="medium"
                                                text={t("discussion.title", { count: total })}
                                            />
                                        ),
                                        ...(total > 0 ? [() => (
                                            <Typography
                                                size="xs"
                                                color="muted"
                                                text={t("discussion.archiveLine", {
                                                    answered: answeredCount,
                                                    total,
                                                })}
                                            />
                                        )] : []),
                                    ]}
                                />
                            ),
                            () => (
                                <CommentComposer
                                    onSubmit={onSubmitComment}
                                    currentUser={currentUser}
                                    collapsible
                                />
                            ),
                        ]}
                    />
                ),
                ...(isLoading ? [() => (
                    <Spinner size="md" tone="accent" label={t("discussion.title", { count: total })} />
                )] : comments.length === 0 ? [() => (
                    <AsyncContentEmpty
                        icon={ChatsCircleIcon}
                        title={t("discussion.empty")}
                        description={t("discussion.emptyHint")}
                    />
                )] : [() => (
                    <StackV
                        principle="sibling-stack"
                        explain="Same-kind peer stack — not group-boundary, because comment rows are repeating siblings rather than section groups."
                        items={[
                            ...comments.map((comment) => () => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    currentUserId={currentUserId}
                                    depth={0}
                                    repliesByParent={repliesByParent}
                                    onReply={onReply}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onReactComment={onReactComment}
                                    onLoadReplies={onLoadReplies}
                                />
                            )),
                            ...(hasMore ? [() => (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    isDisabled={isLoadingMore}
                                    isPending={isLoadingMore}
                                    onPress={onLoadMore}
                                    label={t("discussion.loadMore")}
                                />
                            )] : []),
                        ]}
                    />
                )]),
            ]}
        />
    )
}
