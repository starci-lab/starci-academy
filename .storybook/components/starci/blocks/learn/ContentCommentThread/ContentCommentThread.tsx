import React, { useState } from "react"
import { SealCheckIcon } from "@phosphor-icons/react"
import { ThreadConnector } from "@sb-components/atoms/display/ThreadConnector/ThreadConnector"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { IdentityContentRow } from "@sb-components/composites/lists/IdentityContentRow/IdentityContentRow"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { ContentCommentComposer, type ContentCommentComposerViewer } from "@sb-components/starci/blocks/learn/ContentCommentComposer/ContentCommentComposer"
import { ReactionButton, type ReactionType, type ReactionCount } from "@sb-components/starci/blocks/learn/ReactionButton/ReactionButton"

/**
 * `ContentCommentThread` — a BLOCK: one threaded comment — author, reactions,
 * reply/edit/delete actions, and its recursively-rendered replies.
 *
 * Owns nested replies (capped visual indent via a left guide border), a
 * `ReactionButton` (the same control `ContentReaction` uses), owner-only
 * edit/delete, and a collapsible reply composer.
 *
 * A reply is just another `ContentCommentThread` one `depth` deeper — recursion,
 * not a separate "reply" component. `depth` drives only the indent guide
 * (`border-l`, capped nesting), a plain on-scale utility rather than a composed
 * layout, so it stays here rather than needing a frame.
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
}

/**
 * `IdentityContentRow.byline` — a component reference (COMPOSITE-8), not a
 * built element. Kept at MODULE scope (not defined inline inside
 * `ContentCommentThread`'s body) and fed only read-only per-comment fields as
 * props, so passing a fresh wrapping arrow each render never risks remounting
 * anything stateful — there is no state in this leaf to lose.
 */
const CommentByline = ({ username, isFounderAuthor, createdTimeAgo, isEdited }: CommentBylineProps) => (
    <>
        <Typography size="sm" weight="medium" text={username} />
        {isFounderAuthor ? (
            <SealCheckIcon weight="fill" aria-label="Founder" className="size-3.5 shrink-0 text-accent-soft-foreground" />
        ) : null}
        <Typography size="xs" color="muted" text={createdTimeAgo} />
        {isEdited ? (
            <Typography size="xs" color="muted" text="(edited)" />
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
     * nested reply) — `null`/omitted → reply composer renders with no avatar. Real
     * `CommentComposer` never shows one at all; this is a deliberate divergence, not
     * a `src` port.
     */
    currentUser?: ContentCommentComposerViewer | null
    /** Nesting depth — 0 for a top-level comment, `depth + 1` for each reply. */
    depth: number
    /** Already-loaded replies, keyed by parent id (empty until `onLoadReplies` resolves). */
    repliesByParent: Record<string, ReadonlyArray<ContentCommentNode>>
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


            />
            <Typography
                size="xs"
                weight="medium"
                color="muted"
                isButton
                hoverColor="default"
                text="Reply"
                onPress={() => setReplying((prev) => !prev)}

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

                    />
                    <Typography
                        size="xs"
                        weight="medium"
                        color="muted"
                        isButton
                        hoverColor="danger"
                        text="Delete"
                        onPress={() => onDelete(comment.id)}

                    />
                </>
            ) : null}
        </>
    )

    const bodyAndActions = (
        <>
            {/* body, edit form, or deleted placeholder */}
            {comment.isDeleted ? (
                <Typography size="sm" color="muted" isItalic text="[Comment removed]" />
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

                />
            ) : (
                <Typography size="sm" preserveWhitespace text={comment.body} />
            )}

            {!comment.isDeleted && !editing ? (
                <StackH gap={4} wrap align="center" body={actionRow} />
            ) : null}
        </>
    )

    const threadBody = (
        <>
            <StackV gap={2} body={bodyAndActions} />

            {/* reply composer — `ThreadConnector` draws the Facebook-style curved
                guide from this comment down into the reply's own avatar;
                `currentUser` is what gives the composer an avatar to connect TO
                in the first place (see its own file header). */}
            {replying ? (
                <StackH
                    gap={2}
                    align="start"

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

                />
            ) : null}

            {expanded && replies.length > 0 ? (
                <StackV
                    gap={4}

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

                        />
                    ))}
                />
            ) : null}
        </>
    )

    return (
        // `IdentityContentRow` (composite) owns the avatar+byline+column shape — both
        // its seams are `tight` ON PURPOSE, a denser standalone treatment, NOT a
        // `src`-fidelity port (see the composite's own file header). `nested` draws the
        // reply indent guide via the `Stack` frame prop.
        <IdentityContentRow
            avatarSrc={comment.author.avatarUrl}
            avatarName={comment.author.username}
            avatarSeed={comment.author.id}
            avatarSize="sm"
            nested={depth > 0}


            byline={() => (
                <StackH
                    gap={2}
                    wrap
                    align="center"

                    body={
                        <CommentByline
                            username={comment.author.username}
                            isFounderAuthor={comment.isFounderAuthor}
                            createdTimeAgo={comment.createdTimeAgo}
                            isEdited={comment.isEdited}

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
                <StackV gap={4} body={threadBody} />
            )}
        />
    )
}

export { ContentCommentThread }
