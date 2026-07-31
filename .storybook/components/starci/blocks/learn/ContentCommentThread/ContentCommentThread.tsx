import React, { useState } from "react"
import { SealCheckIcon } from "@phosphor-icons/react"
import { ThreadConnector } from "@sb-components/atoms/display/ThreadConnector/ThreadConnector"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { IdentityContentRow } from "@sb-components/composites/lists/IdentityContentRow/IdentityContentRow"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { ContentCommentComposer, type ContentCommentComposerViewer } from "@sb-components/starci/blocks/learn/ContentCommentComposer/ContentCommentComposer"
import { ReactionButton, type ReactionType, type ReactionCount } from "@sb-components/starci/blocks/learn/ReactionButton/ReactionButton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContentCommentThread`: ONE threaded comment — author, reactions,
 * reply/edit/delete actions, and its recursively-rendered replies. Ported
 * verbatim from real `src`'s `CommentItem`.
 *
 * ⭐⭐ THIS IS THE MASSIVE GAP THE EARLIER `ContentDiscussion` NEVER HAD (thầy:
 * "chế nhiều quá"). The first cut was a flat two-line list — no replies, no
 * per-comment reactions, no edit/delete, no founder badge, no load-more. This
 * block owns everything real `CommentItem` owns: nested replies (capped visual
 * indent via a left guide border), a reaction control (`ReactionButton` — the
 * SAME control `ContentReaction` uses for the content-level reaction), owner-
 * only edit/delete, and a collapsible reply composer.
 *
 * RECURSION, NOT A SEPARATE "REPLY" COMPONENT. A reply is just another
 * `ContentCommentThread` one `depth` deeper — real `src` renders `<CommentItem
 * depth={depth + 1} .../>` for each loaded reply, not a different shape.
 *
 * DEPTH DRIVES ONLY THE INDENT GUIDE (`border-l`, capped visual nesting) — a
 * plain utility on-scale (`pl-3`), not a layout composed via flex/grid+gap, so
 * it stays here rather than needing a frame of its own.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Minimal identity for a comment's author. */
export interface ContentCommentAuthor {
    id: string
    username: string
    avatarUrl?: string
}

/** One comment (or, at `depth > 0`, one reply). */
export interface ContentCommentNode {
    /** Stable id — also what reply/edit/delete/react target. */
    id: string
    author: ContentCommentAuthor
    /** Already-formatted relative time, e.g. "2 giờ trước". */
    createdTimeAgo: string
    /** `true` → a founder badge rides beside the author name. */
    isFounderAuthor?: boolean
    /** `true` → the body was edited after posting; shows a quiet "(đã sửa)" marker. */
    isEdited?: boolean
    /** `true` → the body is replaced with a "removed" placeholder; no actions render. */
    isDeleted?: boolean
    /** The comment text (ignored when `isDeleted`). */
    body: string
    /** Total replies under this comment (drives the "view replies" toggle). */
    replyCount: number
    /** The viewer's own reaction on this comment, or `null`. */
    myReaction: ReactionType | null
    /** Per-emotion reaction counts on this comment. */
    reactionCounts?: ReadonlyArray<ReactionCount>
}

/** Callbacks shared down the comment tree — same shape at every depth. */
export interface ContentCommentThreadCallbacks {
    onReply: (parentId: string, body: string) => void
    onEdit: (commentId: string, body: string) => void
    onDelete: (commentId: string) => void
    onReactComment: (commentId: string, type: ReactionType | null) => void
    /** Lazily load a parent's replies — fired the first time its subtree expands. */
    onLoadReplies: (parentId: string) => void
}

/** Props for {@link ContentCommentThread}. */
export interface ContentCommentThreadProps extends ContentCommentThreadCallbacks {
    /** The comment to render. */
    comment: ContentCommentNode
    /** Current viewer id — drives owner-only edit/delete; null when signed out. */
    currentUserId: string | null
    /**
     * Current viewer identity for the reply composer's own avatar (Facebook-style
     * nested reply, thầy 2026-07-29) — `null`/omitted → reply composer renders with
     * no avatar, same as before. Real `CommentComposer` never shows one at all; this
     * is a deliberate divergence, not a `src` port.
     */
    currentUser?: ContentCommentComposerViewer | null
    /** Nesting depth — 0 for a top-level comment, `depth + 1` for each reply. */
    depth: number
    /** Already-loaded replies, keyed by parent id (empty until `onLoadReplies` resolves). */
    repliesByParent: Record<string, ReadonlyArray<ContentCommentNode>>
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * One threaded comment. See the file header for the full contract.
 *
 * @param props - {@link ContentCommentThreadProps}
 */
const ContentCommentThread = ({
    comment,
    currentUserId,
    currentUser,
    depth,
    repliesByParent,
    onReply,
    onEdit,
    onDelete,
    onReactComment,
    onLoadReplies,
    showAnatomy = false,
    anatPart,
}: ContentCommentThreadProps) => {
    const [replying, setReplying] = useState(false)
    const [editing, setEditing] = useState(false)
    const [expanded, setExpanded] = useState(false)

    const isOwner = currentUserId !== null && currentUserId === comment.author.id
    const replies = repliesByParent[comment.id] ?? []

    const toggleReplies = () => {
        const next = !expanded
        setExpanded(next)
        if (next) {
            onLoadReplies(comment.id)
        }
    }

    return (
        // `IdentityContentRow` (composite, thầy 2026-07-29 "gom màu đen thành block
        // riêng") owns the avatar+byline+column shape — both its seams are `tight`
        // ON PURPOSE, a denser standalone treatment, NOT a `src`-fidelity port
        // (see the composite's own file header). `nested` still draws the reply
        // indent guide via the same `Stack` frame prop as before.
        <IdentityContentRow
            avatarSrc={comment.author.avatarUrl}
            avatarName={comment.author.username}
            avatarSeed={comment.author.id}
            avatarSize="sm"
            nested={depth > 0}
            anatPart={anatPart}
            showAnatomy={showAnatomy}
            byline={
                <StackH gap="tight" wrap align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                    <Typography size="sm" weight="medium" text={comment.author.username} anatPart={showAnatomy ? "Typography" : undefined} />
                    {comment.isFounderAuthor ? (
                        <SealCheckIcon weight="fill" aria-label="Founder" className="size-3.5 shrink-0 text-accent-soft-foreground" />
                    ) : null}
                    <Typography size="xs" color="muted" text={comment.createdTimeAgo} anatPart={showAnatomy ? "Typography" : undefined} />
                    {comment.isEdited ? (
                        <Typography size="xs" color="muted" text="(đã sửa)" anatPart={showAnatomy ? "Typography" : undefined} />
                    ) : null}
                </StackH>
            }
        >
            {/* `grouped` — separates [body+actions, tight together] from whatever
                comes after a reply composer/toggle/subtree, thầy 2026-07-29 "màu cam
                vẫn gap-3": the seam right before a reply composer appears needs more
                room than the tight identity block above it (also where the
                Facebook-style connector line will run). */}
            <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                <StackV gap="tight" anatPart={showAnatomy ? "StackV" : undefined}>
                    {/* body, edit form, or deleted placeholder */}
                    {comment.isDeleted ? (
                        <Typography size="sm" color="muted" isItalic text="[Bình luận đã bị xóa]" anatPart={showAnatomy ? "Typography" : undefined} />
                    ) : editing ? (
                        <ContentCommentComposer
                            initialValue={comment.body}
                            submitLabel="Lưu"
                            ariaLabel="Sửa bình luận"
                            onCancel={() => setEditing(false)}
                            onSubmit={(body) => {
                                onEdit(comment.id, body)
                                setEditing(false)
                            }}
                            showAnatomy={showAnatomy}
                        />
                    ) : (
                        <Typography size="sm" preserveWhitespace text={comment.body} anatPart={showAnatomy ? "Typography" : undefined} />
                    )}

                    {/* action row: reaction + reply + owner edit/delete. `isButton`, NOT
                    `isLink` — real src's own action links carry no underline at all,
                    only a resting→hover COLOR shift, which isLink's underline
                    treatment would misrepresent. */}
                    {!comment.isDeleted && !editing ? (
                        <StackH gap="grouped" wrap align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                            <ReactionButton
                                myReaction={comment.myReaction}
                                counts={comment.reactionCounts}
                                onReact={(type) => onReactComment(comment.id, type)}
                                showAnatomy={showAnatomy}
                                anatPart={showAnatomy ? "ReactionButton" : undefined}
                            />
                            <Typography
                                size="xs"
                                weight="medium"
                                color="muted"
                                isButton
                                hoverColor="default"
                                text="Trả lời"
                                onPress={() => setReplying((prev) => !prev)}
                                anatPart={showAnatomy ? "Typography" : undefined}
                            />
                            {isOwner ? (
                                <>
                                    <Typography
                                        size="xs"
                                        weight="medium"
                                        color="muted"
                                        isButton
                                        hoverColor="default"
                                        text="Sửa"
                                        onPress={() => setEditing(true)}
                                        anatPart={showAnatomy ? "Typography" : undefined}
                                    />
                                    <Typography
                                        size="xs"
                                        weight="medium"
                                        color="muted"
                                        isButton
                                        hoverColor="danger"
                                        text="Xóa"
                                        onPress={() => onDelete(comment.id)}
                                        anatPart={showAnatomy ? "Typography" : undefined}
                                    />
                                </>
                            ) : null}
                        </StackH>
                    ) : null}
                </StackV>

                {/* reply composer — `ThreadConnector` draws the Facebook-style curved
                    guide from this comment down into the reply's own avatar (thầy
                    2026-07-29); `currentUser` is what gives the composer an avatar to
                    connect TO in the first place (see its own file header). */}
                {replying ? (
                    <StackH gap="tight" align="start" anatPart={showAnatomy ? "StackH" : undefined}>
                        <ThreadConnector />
                        <ContentCommentComposer
                            placeholder="Viết câu trả lời..."
                            submitLabel="Trả lời"
                            ariaLabel="Viết câu trả lời"
                            currentUser={currentUser}
                            className="min-w-0 flex-1"
                            onCancel={() => setReplying(false)}
                            onSubmit={(body) => {
                                onReply(comment.id, body)
                                setReplying(false)
                                setExpanded(true)
                                onLoadReplies(comment.id)
                            }}
                            showAnatomy={showAnatomy}
                        />
                    </StackH>
                ) : null}

                {/* replies toggle + recursive subtree */}
                {comment.replyCount > 0 ? (
                    <Typography
                        size="xs"
                        weight="medium"
                        color="accent"
                        isLink
                        underlineOnHover
                        text={expanded ? "Ẩn câu trả lời" : `Xem ${comment.replyCount} câu trả lời`}
                        onPress={toggleReplies}
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                ) : null}

                {expanded && replies.length > 0 ? (
                    <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                        {replies.map((reply) => (
                            <ContentCommentThread
                                key={reply.id}
                                comment={reply}
                                currentUserId={currentUserId}
                                currentUser={currentUser}
                                depth={depth + 1}
                                repliesByParent={repliesByParent}
                                onReply={onReply}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onReactComment={onReactComment}
                                onLoadReplies={onLoadReplies}
                                showAnatomy={showAnatomy}
                            />
                        ))}
                    </StackV>
                ) : null}
            </StackV>
        </IdentityContentRow>
    )
}

export { ContentCommentThread }
