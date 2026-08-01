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
 * ⭐⭐ THIS IS THE MASSIVE GAP THE EARLIER `ContentDiscussion` NEVER HAD (teacher:
 * "over-engineered it"). The first cut was a flat two-line list — no replies, no
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
    /** Already-formatted relative time, e.g. "2 hours ago". */
    createdTimeAgo: string
    /** `true` → a founder badge rides beside the author name. */
    isFounderAuthor?: boolean
    /** `true` → the body was edited after posting; shows a quiet "(edited)" marker. */
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

/** Props for the module-scope {@link CommentByline} helper. */
interface CommentBylineProps {
    username: string
    isFounderAuthor?: boolean
    createdTimeAgo: string
    isEdited?: boolean
    showAnatomy: boolean
}

/**
 * `IdentityContentRow.byline` — a component reference (COMPOSITE-8), not a
 * built element. Kept at MODULE scope (not defined inline inside
 * `ContentCommentThread`'s body) and fed only read-only per-comment fields as
 * props, so passing a fresh wrapping arrow each render never risks remounting
 * anything stateful — there is no state in this leaf to lose.
 */
const CommentByline = ({ username, isFounderAuthor, createdTimeAgo, isEdited, showAnatomy }: CommentBylineProps) => (
    <>
        <Typography size="sm" weight="medium" text={username} showAnatomy={showAnatomy} />
        {isFounderAuthor ? (
            <SealCheckIcon weight="fill" aria-label="Founder" className="size-3.5 shrink-0 text-accent-soft-foreground" />
        ) : null}
        <Typography size="xs" color="muted" text={createdTimeAgo} showAnatomy={showAnatomy} />
        {isEdited ? (
            <Typography size="xs" color="muted" text="(edited)" showAnatomy={showAnatomy} />
        ) : null}
    </>
)

/** Props for {@link ContentCommentThread}. */
export interface ContentCommentThreadProps extends ContentCommentThreadCallbacks {
    /** The comment to render. */
    comment: ContentCommentNode
    /** Current viewer id — drives owner-only edit/delete; null when signed out. */
    currentUserId: string | null
    /**
     * Current viewer identity for the reply composer's own avatar (Facebook-style
     * nested reply, teacher 2026-07-29) — `null`/omitted → reply composer renders with
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

    // action row: reaction + reply + owner edit/delete. `isButton`, NOT `isLink` — real
    // src's own action links carry no underline at all, only a resting→hover COLOR
    // shift, which isLink's underline treatment would misrepresent.
    const actionRow = (
        <>
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
                text="Reply"
                onPress={() => setReplying((prev) => !prev)}
                showAnatomy={showAnatomy}
            />
            {isOwner ? (
                <>
                    <Typography
                        size="xs"
                        weight="medium"
                        color="muted"
                        isButton
                        hoverColor="default"
                        text="Edit"
                        onPress={() => setEditing(true)}
                        showAnatomy={showAnatomy}
                    />
                    <Typography
                        size="xs"
                        weight="medium"
                        color="muted"
                        isButton
                        hoverColor="danger"
                        text="Delete"
                        onPress={() => onDelete(comment.id)}
                        showAnatomy={showAnatomy}
                    />
                </>
            ) : null}
        </>
    )

    const bodyAndActions = (
        <>
            {/* body, edit form, or deleted placeholder */}
            {comment.isDeleted ? (
                <Typography size="sm" color="muted" isItalic text="[Comment removed]" showAnatomy={showAnatomy} />
            ) : editing ? (
                <ContentCommentComposer
                    initialValue={comment.body}
                    submitLabel="Save"
                    ariaLabel="Edit comment"
                    onCancel={() => setEditing(false)}
                    onSubmit={(body) => {
                        onEdit(comment.id, body)
                        setEditing(false)
                    }}
                    showAnatomy={showAnatomy}
                />
            ) : (
                <Typography size="sm" preserveWhitespace text={comment.body} showAnatomy={showAnatomy} />
            )}

            {!comment.isDeleted && !editing ? (
                <StackH gap={4} wrap align="center" anatPart={showAnatomy ? "StackH" : undefined} body={actionRow} />
            ) : null}
        </>
    )

    const threadBody = (
        <>
            <StackV gap={2} anatPart={showAnatomy ? "StackV" : undefined} body={bodyAndActions} />

            {/* reply composer — `ThreadConnector` draws the Facebook-style curved
                guide from this comment down into the reply's own avatar (teacher
                2026-07-29); `currentUser` is what gives the composer an avatar to
                connect TO in the first place (see its own file header). */}
            {replying ? (
                <StackH
                    gap={2}
                    align="start"
                    anatPart={showAnatomy ? "StackH" : undefined}
                    body={
                        <>
                            <ThreadConnector />
                            <ContentCommentComposer
                                placeholder="Write a reply..."
                                submitLabel="Reply"
                                ariaLabel="Write a reply"
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
                        </>
                    }
                />
            ) : null}

            {/* replies toggle + recursive subtree */}
            {comment.replyCount > 0 ? (
                <Typography
                    size="xs"
                    weight="medium"
                    color="accent"
                    isLink
                    underlineOnHover
                    text={expanded ? "Hide replies" : `View ${comment.replyCount} replies`}
                    onPress={toggleReplies}
                    showAnatomy={showAnatomy}
                />
            ) : null}

            {expanded && replies.length > 0 ? (
                <StackV
                    gap={4}
                    anatPart={showAnatomy ? "StackV" : undefined}
                    body={replies.map((reply) => (
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
                />
            ) : null}
        </>
    )

    return (
        // `IdentityContentRow` (composite, teacher 2026-07-29 "group the black color
        // into its own block") owns the avatar+byline+column shape — both its seams are `tight`
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
            byline={() => (
                <StackH
                    gap={2}
                    wrap
                    align="center"
                    anatPart={showAnatomy ? "StackH" : undefined}
                    body={
                        <CommentByline
                            username={comment.author.username}
                            isFounderAuthor={comment.isFounderAuthor}
                            createdTimeAgo={comment.createdTimeAgo}
                            isEdited={comment.isEdited}
                            showAnatomy={showAnatomy}
                        />
                    }
                />
            )}
            // `body` is the former `children` slot (COMPOSITE-8) — a component
            // reference, not a built node. `threadBody` (StackV wrapping
            // bodyAndActions + reply composer + replies subtree) is already
            // computed above per the current render's state, so the wrapper here
            // only needs to hand it back.
            body={() => (
                /* `grouped` — separates [body+actions, tight together] from whatever
                    comes after a reply composer/toggle/subtree, teacher 2026-07-29 "orange
                    still gap-3": the seam right before a reply composer appears needs more
                    room than the tight identity block above it (also where the
                    Facebook-style connector line will run). */
                <StackV gap={4} anatPart={showAnatomy ? "StackV" : undefined} body={threadBody} />
            )}
        />
    )
}

export { ContentCommentThread }
