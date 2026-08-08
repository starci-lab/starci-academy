"use client"

import React, { useState } from "react"
import type { QueryCommunityCommentNode } from "@/modules/api/graphql/queries/types/community-comments"
import type { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import { CommunityCommentRow } from "@/components/blocks/feed/CommunityCommentRow"
import { Composer } from "@/components/blocks/feed/Composer"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"

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
export interface CommentThreadProps {
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
        <Typography
            size="xs"
            color="muted"
            isButton
            text="Reply"
            onPress={() => setReplying((previous) => !previous)}
        />
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
    const nested = depth > 0 && depth <= MAX_INDENT_DEPTH

    return (
        <StackV
            principle="sibling-stack"
            explain="Same-kind peer stack — not group-boundary, because the comment row, optional reply composer, and nested replies are repeating siblings in one thread unit."
            nested={nested}
            items={[
                () => (
                    <CommunityCommentRow
                        comment={node}
                        onReact={onReact ? (type) => onReact(node.id, type) : undefined}
                        actions={replyAction}
                    />
                ),
                ...(replying ? [() => (
                    <Composer
                        value={replyValue}
                        onChange={setReplyValue}
                        onSubmit={submitReply}
                        avatarSrc={avatarSrc}
                        placeholder="Write a reply..."
                        submitLabel="Reply"
                        nested
                    />
                )] : []),
                ...(replies.length > 0 ? [() => (
                    <StackV
                        principle="sibling-stack"
                        explain="Same-kind peer stack — not group-boundary, because nested reply rows are repeating siblings rather than section groups."
                        items={replies.map((reply) => () => (
                            <CommentThreadItem
                                key={reply.id}
                                node={reply}
                                depth={depth + 1}
                                onReply={onReply}
                                onReact={onReact}
                                avatarSrc={avatarSrc}
                            />
                        ))}
                    />
                )] : []),
            ]}
        />
    )
}

/**
 * CommentThread assembles a nested discussion from the existing
 * {@link CommunityCommentRow} (one per node) and {@link Composer} (root box + each
 * inline reply).
 *
 * @param props - {@link CommentThreadProps}
 */
export const CommentThread = ({
    comments,
    onReply,
    onReact,
    avatarSrc,
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
        <StackV
            identity={{ tier: "block", component: "CommentThread" }}
            principle="sibling-stack"
            explain="Same-kind peer stack — not group-boundary, because the root composer and thread rows are repeating siblings in one discussion unit."
            items={[
                () => (
                    <Composer
                        value={rootValue}
                        onChange={setRootValue}
                        onSubmit={submitRoot}
                        avatarSrc={avatarSrc}
                        placeholder="Write a comment..."
                    />
                ),
                ...(comments.length > 0 ? [() => (
                    <StackV
                        principle="sibling-stack"
                        explain="Same-kind peer stack — not group-boundary, because top-level comment rows are repeating siblings rather than section groups."
                        items={comments.map((comment) => () => (
                            <CommentThreadItem
                                key={comment.id}
                                node={comment}
                                depth={0}
                                onReply={onReply}
                                onReact={onReact}
                                avatarSrc={avatarSrc}
                            />
                        ))}
                    />
                )] : []),
            ]}
        />
    )
}
