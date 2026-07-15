"use client"

import React, { useState } from "react"
import { cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { QueryCommunityCommentNode } from "@/modules/api/graphql/queries/types/community-comments"
import type { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import { CommunityCommentRow } from "@/components/blocks/feed/CommunityCommentRow"
import { Composer } from "@/components/blocks/feed/Composer"

/** Deepest level that still gets a visual indent rail; deeper replies render flush. */
const MAX_INDENT_DEPTH = 4

/**
 * One node in a {@link CommentThread}: everything {@link CommunityCommentRow} needs
 * (a {@link QueryCommunityCommentNode}, which already carries `id`) plus its nested
 * replies.
 */
export interface CommentThreadNode extends QueryCommunityCommentNode {
    /** Direct replies to this comment, rendered indented one level deeper. */
    replies?: Array<CommentThreadNode>
}

/**
 * Props for the {@link CommentThread} block.
 *
 * A nested comment thread built from {@link CommunityCommentRow}s plus a
 * {@link Composer} for both the root box and each inline reply. Tier-3
 * presentational — the tree + callbacks arrive via props; the block owns only the
 * transient draft/reveal UI state.
 */
export interface CommentThreadProps extends WithClassNames<undefined> {
    /** The comment tree, top-level nodes first. */
    comments: Array<CommentThreadNode>
    /**
     * Post a comment. `parentId` is the id of the comment being replied to, or
     * `null` for a new root comment from the top-level composer.
     */
    onReply: (parentId: string | null, text: string) => void
    /**
     * Pass-through of {@link CommunityCommentRow}'s react handler, keyed by comment
     * id — pass the chosen emotion, or `null` to remove. Omit to render every row's
     * reaction bar READ-ONLY (e.g. a signed-out viewer).
     */
    onReact?: (commentId: string, type: ReactionType | null) => void
    /** Avatar url for the viewer, shown on the root + reply composers. */
    avatarSrc?: string
}

/** Props for the recursive {@link CommentThreadItem}. */
interface CommentThreadItemProps {
    /** The node to render (with its replies). */
    node: CommentThreadNode
    /** Nesting depth — drives the capped indent rail. */
    depth: number
    /** See {@link CommentThreadProps.onReply}. */
    onReply: (parentId: string | null, text: string) => void
    /** See {@link CommentThreadProps.onReact}. */
    onReact?: (commentId: string, type: ReactionType | null) => void
    /** Avatar url for the inline reply composer. */
    avatarSrc?: string
}

/**
 * One comment plus its recursively-rendered replies. Owns only transient UI state
 * (the reply box's open flag + its draft); persistence is delegated upward.
 */
const CommentThreadItem = ({
    node,
    depth,
    onReply,
    onReact,
    avatarSrc,
}: CommentThreadItemProps) => {
    const [replying, setReplying] = useState(false)
    const [replyValue, setReplyValue] = useState("")

    // reveal-a-reply-box affordance, handed to the row's actions slot
    const replyAction = (
        <button
            type="button"
            onClick={() => setReplying((previous) => !previous)}
            className="cursor-pointer text-xs font-medium text-muted transition-colors hover:text-foreground"
        >
            Trả lời
        </button>
    )

    // submit the reply, clear the draft, and collapse the box
    const submitReply = () => {
        const text = replyValue.trim()
        if (!text) {
            return
        }
        onReply(node.id, text)
        setReplyValue("")
        setReplying(false)
    }

    const replies = node.replies ?? []

    return (
        <div
            className={cn(
                "flex flex-col gap-3",
                // indent nested replies with a guide rail, capped so deep threads stay readable
                depth > 0 && depth <= MAX_INDENT_DEPTH ? "border-l border-default pl-3 sm:pl-4" : undefined,
            )}
        >
            <CommunityCommentRow
                comment={node}
                onReact={onReact ? (type) => onReact(node.id, type) : undefined}
                actions={replyAction}
            />

            {/* inline reply composer, revealed by the "Trả lời" affordance */}
            {replying ? (
                <Composer
                    value={replyValue}
                    onChange={setReplyValue}
                    onSubmit={submitReply}
                    avatarSrc={avatarSrc}
                    placeholder="Viết câu trả lời..."
                    submitLabel="Trả lời"
                    className="pl-9"
                />
            ) : null}

            {/* recursive reply subtree */}
            {replies.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {replies.map((reply) => (
                        <CommentThreadItem
                            key={reply.id}
                            node={reply}
                            depth={depth + 1}
                            onReply={onReply}
                            onReact={onReact}
                            avatarSrc={avatarSrc}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    )
}

/**
 * CommentThread assembles a nested discussion from the existing
 * {@link CommunityCommentRow} (one per node) and {@link Composer} (root box + each
 * inline reply). Replies indent one level per depth behind a guide rail that caps
 * after a few levels so deep threads stay readable; every node exposes a "Trả lời"
 * affordance that reveals its own reply composer, and a top-level composer adds a
 * root comment. Reaction handling is a straight pass-through to each row.
 *
 * Tier-3 presentational block: props-only, no store, no SWR. It owns only the
 * transient draft/reveal state of the composers; posting is delegated via
 * {@link CommentThreadProps.onReply}.
 *
 * @param props - {@link CommentThreadProps}
 *
 * @example
 * <CommentThread
 *   comments={tree}
 *   onReply={(parentId, text) => post(parentId, text)}
 *   onReact={(id, type) => react(id, type)}
 * />
 */
export const CommentThread = ({
    comments,
    onReply,
    onReact,
    avatarSrc,
    className,
}: CommentThreadProps) => {
    const [rootValue, setRootValue] = useState("")

    // submit a new root comment (parentId = null), then clear the box
    const submitRoot = () => {
        const text = rootValue.trim()
        if (!text) {
            return
        }
        onReply(null, text)
        setRootValue("")
    }

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            {/* top-level composer for a new root comment */}
            <Composer
                value={rootValue}
                onChange={setRootValue}
                onSubmit={submitRoot}
                avatarSrc={avatarSrc}
                placeholder="Viết bình luận..."
            />

            {/* the thread */}
            {comments.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {comments.map((comment) => (
                        <CommentThreadItem
                            key={comment.id}
                            node={comment}
                            depth={0}
                            onReply={onReply}
                            onReact={onReact}
                            avatarSrc={avatarSrc}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    )
}
