"use client"

import React from "react"
import { Button, Spinner, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { ReactionType, type CommentNode, type ReactionSummary } from "@/modules/api"
import type { WithClassNames } from "@/modules/types"
import { LabeledCard } from "@/components/blocks"
import { InteractionBar } from "./InteractionBar"
import { CommentComposer } from "./CommentComposer"
import { CommentItem } from "./CommentItem"

export * from "./ReactionBar"
export * from "./ReactionEmoji"
export * from "./CommentComposer"
export * from "./CommentItem"
export * from "./InteractionBar"
export * from "./constants"

/** Props for {@link Discussion}. */
export interface DiscussionProps extends WithClassNames<undefined> {
    /** Current viewer id (drives owner-only actions); null when unknown. */
    currentUserId: string | null
    /** Aggregate reactions on the content itself. */
    contentReactions: ReactionSummary | undefined
    /** React to the content (null removes the reaction). */
    onReactContent: (type: ReactionType | null) => void
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
 * Bottom-of-article discussion: a single-row reaction bar (stays with the content) + a separate
 * community surface holding the composer and threaded comment list.
 *
 * {@link InteractionBar} is reaction-only (plain-emoji picker + view count); bookmark / share /
 * fullscreen live in the OnThisPage rail, not here. The comments sit in their own bordered
 * surface so they read as a distinct community area, separated from the lesson.
 *
 * Presentational: receives all data + callbacks from a container; holds no data hooks.
 * @param props - {@link DiscussionProps}
 */
export const Discussion = ({
    // reactions
    currentUserId,
    contentReactions,
    onReactContent,
    // comments
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
    className,
}: DiscussionProps) => {
    const t = useTranslations()

    return (
        <section className={cn("flex flex-col gap-6", className)}>
            {/* ── reaction bar (reaction + view count) — belongs to the content ── */}
            <InteractionBar
                summary={contentReactions}
                onReact={onReactContent}
                viewCount={contentReactions?.viewCount}
            />

            {/* ── comment zone: the canonical section card (LabeledCard) — title sits ABOVE the
                card; composer + threaded list inside. Reads as a distinct community area, apart
                from the lesson. ── */}
            <LabeledCard
                label={t("discussion.title", { count: total })}
                contentClassName="flex flex-col gap-6"
            >
                {/* new comment composer */}
                <CommentComposer onSubmit={onSubmitComment} />

                {/* ── comment list / loading / empty states ── */}
                {isLoading ? (
                    <div className="flex justify-center py-6">
                        <Spinner />
                    </div>
                ) : comments.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted">
                        {t("discussion.empty")}
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {comments.map((comment) => (
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
                        ))}
                        {hasMore ? (
                            <Button
                                variant="tertiary"
                                className="self-center text-sm text-accent"
                                isDisabled={isLoadingMore}
                                onPress={onLoadMore}
                            >
                                {isLoadingMore ? <Spinner size="sm" /> : t("discussion.loadMore")}
                            </Button>
                        ) : null}
                    </div>
                )}
            </LabeledCard>
        </section>
    )
}
