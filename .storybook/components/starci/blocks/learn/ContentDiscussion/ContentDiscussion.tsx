import React from "react"
import { ChatsCircleIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { FeedbackEmpty } from "@sb-components/composites/feedback/Feedback/Feedback"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { ContentCommentComposer, type ContentCommentComposerViewer } from "@sb-components/starci/blocks/learn/ContentCommentComposer/ContentCommentComposer"
import { ContentCommentThread, type ContentCommentNode, type ContentCommentThreadCallbacks } from "@sb-components/starci/blocks/learn/ContentCommentThread/ContentCommentThread"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContentDiscussion`: talk about this lesson — label + honest archive
 * line, an avatar-led collapsible composer, and the threaded comment list.
 *
 * ⭐⭐ REBUILT 2026-07-28 (thầy: "chế nhiều quá"). The first cut was a flat
 * two-line comment list inside a `SurfaceCard` — missing threaded replies,
 * per-comment reactions, edit/delete, a founder badge, and pagination
 * entirely, PLUS a structural mistake real `src` explicitly documents against:
 * `Discussion` is FRAMELESS. Ported verbatim now:
 *
 * ⭐ NO CARD. Real `Discussion`'s own file header says so explicitly — it sits
 * directly on the page canvas so it never stacks a second bordered surface
 * under the reading "paper" card above it. This is also WHY the composer's
 * field stays `variant="primary"` (see `ContentCommentComposer`'s own file
 * header) — nothing here is "a field inside a card".
 *
 * ⭐ THE ARCHIVE LINE IS HONEST, NOT FABRICATED. `answeredCount` is computed
 * from the comments THIS caller already loaded (`replyCount > 0`), the same
 * real, under-counts-until-fully-paged tradeoff `Discussion` itself documents
 * — never a made-up aggregate.
 *
 * ⭐ EMPTY IS DRAWN, ON PURPOSE — opposite of `ContentRelatedList`, which
 * hides itself when it has nothing. Nobody having written yet is an
 * INVITATION: the reader is the first, and saying so is what makes them
 * likely to write.
 *
 * THE COMPOSER NEVER HIDES. It sits above the list in every state (loading,
 * empty, error), because a reader who wants to write should never wait for a
 * list to load first.
 *
 * ⭐ LOADING = `isSkeleton`, ONE prop, matching EVERY sibling block in this
 * system (thầy 2026-07-28: "cái nào cũng có skeleton hết, tin code chứ không
 * tin concepts" — real `Discussion` happens to show a bare `Spinner` for this
 * one case, but copying that one-off choice would make this the ONLY block
 * in the whole design system without a self-mirroring skeleton, breaking
 * consistency with `ContentReaction`/`ContentRelatedList`/every other block
 * already built today). Two placeholder threads mirror the real row shape.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link ContentDiscussion}. */
export interface ContentDiscussionProps extends ContentCommentThreadCallbacks {
    /** Section label, localized by the caller — e.g. "Thảo luận" (the block appends "· {total}"). */
    label: string
    /** Current viewer id — drives owner-only edit/delete down the whole tree; null when signed out. */
    currentUserId: string | null
    /** Current viewer identity for the composer's avatar; null when signed out. */
    currentUser?: ContentCommentComposerViewer | null
    /** Top-level comments, newest first. EMPTY → the invitation is drawn instead. */
    comments: Array<ContentCommentNode>
    /** Total top-level comment count (drives the label + the archive line). */
    total: number
    /** Replies keyed by parent comment id (lazily populated by the caller). */
    repliesByParent: Record<string, ReadonlyArray<ContentCommentNode>>
    /** Post a new top-level comment. */
    onSubmitComment: (body: string) => void
    /** `true` → more top-level comment pages remain to load. */
    hasMore?: boolean
    /** `true` → the next page is currently loading. */
    isLoadingMore?: boolean
    /** Load the next page of top-level comments. */
    onLoadMore?: () => void
    /**
     * Set → the comment list could not be loaded. The message replaces the
     * LIST only: the composer stays, because a failed read did not remove
     * the ability to write.
     */
    errorMessage?: string
    /** `true` → two placeholder threads mirror the real row shape while the first page loads. */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: ContentDiscussionProps) => {
    // real (not fabricated) count of currently-loaded top-level comments that already
    // have at least one reply — under-counts before "load more" is exhausted, same
    // tradeoff real `Discussion` documents for its own archive line
    const answeredCount = comments.filter((comment) => comment.replyCount > 0).length

    return (
        <div data-anat-part={anatPart}>
            <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                {/* 3 seam ở đây khớp đúng real-src `Discussion/index.tsx:98-114` (thầy 2026-07-29,
                    "cảm giác hơi chật" — bản cũ lỏng hơn 1 bậc ở cả 3 chỗ): [label+archive]↔composer
                    = grouped (gap-3) · [icon+label]↔archive-line = tight (gap-1) · icon↔label = related (gap-2). */}
                <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                    <StackV gap="tight" anatPart={showAnatomy ? "StackV" : undefined}>
                        {/* no icon here — §5a.2 (thầy 2026-07-29): a chat-bubble icon needs an
                            ASSOCIATION step to read as "discussion" (not a universal symbol like
                            ✓/🔒), and the label text already carries the full fact on its own. */}
                        {isSkeleton ? (
                            <Typography weight="medium" isSkeleton classNames={["w-1/4"]} anatPart={showAnatomy ? "Typography" : undefined} />
                        ) : (
                            <Typography weight="medium" text={`${label} · ${total}`} anatPart={showAnatomy ? "Typography" : undefined} />
                        )}
                        {isSkeleton || total > 0 ? (
                            <Typography
                                size="xs"
                                color="muted"
                                isSkeleton={isSkeleton}
                                classNames={isSkeleton ? ["w-2/3"] : undefined}
                                text={`${answeredCount}/${total} câu hỏi đã được trả lời, tích luỹ theo thời gian`}
                                anatPart={showAnatomy ? "Typography" : undefined}
                            />
                        ) : null}
                    </StackV>
                    <ContentCommentComposer
                        onSubmit={onSubmitComment}
                        currentUser={currentUser}
                        collapsible
                        ariaLabel="Viết bình luận"
                        showAnatomy={showAnatomy}
                        anatPart={showAnatomy ? "ContentCommentComposer" : undefined}
                    />
                </StackV>

                {errorMessage != null ? (
                    <FeedbackEmpty
                        icon={WarningCircleIcon}
                        title={errorMessage}
                        anatPart={showAnatomy ? "FeedbackEmpty" : undefined}
                    />
                ) : !isSkeleton && comments.length === 0 ? (
                    // Nobody has written yet. This is an INVITATION, so it is drawn —
                    // hiding the section would hide the invitation with it.
                    <FeedbackEmpty
                        icon={ChatsCircleIcon}
                        title="Chưa có thảo luận"
                        description="Đặt câu hỏi đầu tiên về bài này"
                        anatPart={showAnatomy ? "FeedbackEmpty" : undefined}
                    />
                ) : (
                    <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                        {(isSkeleton ? SKELETON_ROWS : comments).map((comment) => (
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
                                showAnatomy={showAnatomy}
                            />
                        ))}
                        {!isSkeleton && hasMore ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                classNames={["self-center"]}
                                label={isLoadingMore ? "Đang tải…" : "Xem thêm bình luận"}
                                isDisabled={isLoadingMore}
                                onPress={onLoadMore}
                                anatPart={showAnatomy ? "Button" : undefined}
                            />
                        ) : null}
                    </StackV>
                )}
            </StackV>
        </div>
    )
}

export { ContentDiscussion }
