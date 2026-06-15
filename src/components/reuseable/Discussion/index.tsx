"use client"

import React from "react"
import { Button, Separator, Spinner, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { ReactionType, type CommentNode, type ReactionSummary } from "@/modules/api"
import type { WithClassNames } from "@/modules/types"
import { InteractionBar, type ActionBarProps } from "./InteractionBar"
import { CommentComposer } from "./CommentComposer"
import { CommentItem } from "./CommentItem"

export * from "./ReactionBar"
export * from "./ReactionEmoji"
export * from "./CommentComposer"
export * from "./CommentItem"
export * from "./InteractionBar"
export * from "./constants"

/** Props for {@link Discussion}. */
export interface DiscussionProps extends ActionBarProps, WithClassNames<undefined> {
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
 * Bottom-of-article discussion: Facebook-style interaction bar, a composer, and a threaded
 * comment list.
 *
 * The {@link InteractionBar} merges the old separate ActionToolbar + ReactionBar into one row:
 * LEFT = stacked emoji reactions + total, RIGHT = bookmark/share/fullscreen + reaction picker.
 *
 * Presentational: receives all data + callbacks from a container; holds no data hooks.
 * @param props - {@link DiscussionProps}
 */
export const Discussion = ({
    // action bar
    isFavorite,
    isShareVisible,
    isFavoritePending,
    onToggleFavorite,
    onShare,
    onFullscreen,
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
            <Separator />

            {/* ── Facebook-style two-row interaction bar ── */}
            <InteractionBar
                summary={contentReactions}
                onReact={onReactContent}
                isFavorite={isFavorite}
                isShareVisible={isShareVisible}
                isFavoritePending={isFavoritePending}
                onToggleFavorite={onToggleFavorite}
                onShare={onShare}
                onFullscreen={onFullscreen}
                viewCount={contentReactions?.viewCount}
            />

            <Separator />

            {/* ── comment count heading ── */}
            <h2 className="text-base font-semibold text-foreground">
                {t("discussion.title", { count: total })}
            </h2>

            {/* ── new comment composer ── */}
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
        </section>
    )
}
