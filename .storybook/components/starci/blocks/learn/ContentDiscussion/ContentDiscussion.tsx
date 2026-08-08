import React from "react"
import { ChatsCircleIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { ContentCommentComposer, type ContentCommentComposerViewer } from "@sb-components/starci/blocks/learn/ContentCommentComposer/ContentCommentComposer"
import { ContentCommentThread, type ContentCommentNode, type ContentCommentThreadCallbacks } from "@sb-components/starci/blocks/learn/ContentCommentThread/ContentCommentThread"

/**
 * `ContentDiscussion` — talk about this lesson: a label + archive line, an
 * avatar-led collapsible composer, and the threaded comment list, frameless on
 * the page canvas. The empty state is drawn on purpose — no comments yet is an
 * invitation. The composer never hides, and an error replaces the list only.
 * Comment count, archive line, and `hasMore` are states of `Full`; empty, error,
 * and the loading mirror are each their own leaf.
 */

/** Props for {@link ContentDiscussion}. */
export interface ContentDiscussionProps extends ContentCommentThreadCallbacks {
    /** Section label, localized by the caller — e.g. "Discussion" (the block appends "· {total}"). */
    label: string
    /** Current viewer id — drives owner-only edit/delete down the whole tree; null when signed out. */
    currentUserId: string | null
    /** Current viewer identity for the composer's avatar; null when signed out. */
    currentUser?: ContentCommentComposerViewer | null
    /** Top-level comments, newest first. EMPTY -> the invitation is drawn instead. */
    comments: Array<ContentCommentNode>
    /** Total top-level comment count (drives the label + the archive line). */
    total: number
    /** Replies keyed by parent comment id (lazily populated by the caller). */
    repliesByParent: Record<string, ReadonlyArray<ContentCommentNode>>
    /** Post a new top-level comment. */
    onSubmitComment: (body: string) => void
    /** `true` -> more top-level comment pages remain to load. */
    hasMore?: boolean
    /** `true` -> the next page is currently loading. */
    isLoadingMore?: boolean
    /** Load the next page of top-level comments. */
    onLoadMore?: () => void
    /**
 * Set -> the comment list could not be loaded. The message replaces the
 * LIST only: the composer stays, because a failed read did not remove
 * the ability to write.
 */
    errorMessage?: string
    /** `true` -> two placeholder threads mirror the real row shape while the first page loads. */
    isSkeleton?: boolean
}

/** Two placeholder rows so the mirror has the same shape as a short thread. */
const SKELETON_ROWS: Array<ContentCommentNode> = [
    { id: "s1", author: { id: "s1", username: "" }, createdTimeAgo: "", body: "", replyCount: 0, myReaction: null },
    { id: "s2", author: { id: "s2", username: "" }, createdTimeAgo: "", body: "", replyCount: 0, myReaction: null },
]

/**
 * Lesson discussion. See the file header for the full contract.
 *
 * @param props - {@link ContentDiscussionProps}
 */
const ContentDiscussion = ({
    label,
    currentUserId,
    currentUser,
    comments,
    total,
    repliesByParent,
    onSubmitComment,
    onReply,
    onEdit,
    onDelete,
    onReactComment,
    onLoadReplies,
    hasMore = false,
    isLoadingMore = false,
    onLoadMore,
    errorMessage,
    isSkeleton = false,
}: ContentDiscussionProps) => {
    // real (not fabricated) count of currently-loaded top-level comments that already
    // have at least one reply — under-counts before "load more" is exhausted, same
    // tradeoff real `Discussion` documents for its own archive line
    const answeredCount = comments.filter((comment) => comment.replyCount > 0).length

    // no icon here: a chat-bubble icon needs an ASSOCIATION step to read as
    // "discussion" (not a universal symbol like check/locklock), and the label text already
    // carries the full fact on its own.
    return (
        <div>
            <StackV
                gap={4}
                isSkeleton={isSkeleton}
                items={[
                    // These 3 seams match the real-src `Discussion/index.tsx:98-114` exactly:
                    // [label+archive]<->composer = grouped (gap-3) · [icon+label]<->archive-line
                    // = tight (gap-1) · icon<->label = related (gap-2).
                    () => (
                        <StackV
                            gap={4}
                            isSkeleton={isSkeleton}
                            items={[
                                () => (
                                    <StackV
                                        gap={2}
                                        isSkeleton={isSkeleton}
                                        items={[
                                            () => (
                                                isSkeleton ? (
                                                    <Typography weight="medium" isSkeleton />
                                                ) : (
                                                    <Typography weight="medium" text={`${label} · ${total}`} />
                                                )
                                            ),
                                            ...(isSkeleton || total > 0 ? [() => (
                                                <Typography
                                                    size="xs"
                                                    color="muted"
                                                    isSkeleton={isSkeleton}

                                                    text={`${answeredCount}/${total} questions answered, accumulated over time`}

                                                />
                                            )] : []),
                                        ]}
                                    />
                                ),
                                () => (
                                    <ContentCommentComposer
                                        onSubmit={onSubmitComment}
                                        currentUser={currentUser}
                                        collapsible
                                        ariaLabel="Write a comment"


                                    />
                                ),
                            ]}
                        />
                    ),
                    ...(errorMessage != null ? [() => (
                        <EmptyState
                            icon={WarningCircleIcon}
                            title={errorMessage}

                        />
                    )] : !isSkeleton && comments.length === 0 ? [() => (
                        // Nobody has written yet. This is an INVITATION, so it is drawn —
                        // hiding the section would hide the invitation with it.
                        <EmptyState
                            icon={ChatsCircleIcon}
                            title="No discussion yet"
                            description="Ask the first question about this lesson"

                        />
                    )] : [() => (
                        <StackV
                            gap={4}
                            isSkeleton={isSkeleton}
                            items={[
                                ...(isSkeleton ? SKELETON_ROWS : comments).map((comment) => () => (
                                    <ContentCommentThread
                                        key={comment.id}
                                        comment={comment}
                                        currentUserId={currentUserId}
                                        currentUser={currentUser}
                                        depth={0}
                                        repliesByParent={repliesByParent}
                                        onReply={onReply}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onReactComment={onReactComment}
                                        onLoadReplies={onLoadReplies}

                                    />
                                )),
                                ...(!isSkeleton && hasMore ? [() => (
                                    <Button
                                        variant="ghost"
                                        size="sm"

                                        label={isLoadingMore ? "Loading…" : "Show more comments"}
                                        isDisabled={isLoadingMore}
                                        onPress={onLoadMore}
                                    />
                                )] : []),
                            ]}
                        />
                    )]),
                ]}
            />
        </div>
    )
}

export { ContentDiscussion }
