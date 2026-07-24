import React, { useState } from "react"
import { cn } from "@heroui/react"
import { CommunityCommentRow, type QueryCommunityCommentNode } from "../CommunityCommentRow/CommunityCommentRow"
import { Composer } from "../Composer/Composer"
import type { ReactionType } from "../ReactionBar/ReactionBar"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK ported faithfully from
 * `@/components/blocks/feed/CommentThread`. Composed from the local blocks
 * `CommunityCommentRow` (one per node) + `Composer` (root box + each inline reply).
 * Synced to `src` later.
 */

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

/** Props for the {@link CommentThread} block. */
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
    /** Extra classes merged onto the root. */
    className?: string
    /**
     * When on, each composed part emits `data-anat-part` so a BlockAnatomy panel can
     * badge it on-render. Cascades into every recursive {@link CommentThreadItem}.
     */
    showAnatomy?: boolean
}

/** Props for the recursive {@link CommentThreadItem}. */
interface CommentThreadItemProps {
    node: CommentThreadNode
    depth: number
    onReply: (parentId: string | null, text: string) => void
    onReact?: (commentId: string, type: ReactionType | null) => void
    avatarSrc?: string
    /** Threaded from {@link CommentThread}; tags this item + its inline reply composer. */
    showAnatomy?: boolean
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
    showAnatomy,
}: CommentThreadItemProps) => {
    const [replying, setReplying] = useState(false)
    const [replyValue, setReplyValue] = useState("")

    // reveal-a-reply-box affordance, handed to the row's actions slot
    // NOTE: left as hand-rolled — Button port has no plain-text/link variant; every
    // variant (incl. ghost) carries `.button--sm`'s fixed h-9/px-3 pill chrome, which
    // would force padding/height onto this bare "Trả lời" text toggle that today has
    // none. Swapping would visibly change what renders, so it stays a plain button.
    const replyAction = (
        <button
            type="button"
            onClick={() => setReplying((previous) => !previous)}
            className="cursor-pointer text-xs font-medium text-muted transition-colors hover:text-foreground"
            data-anat-part={showAnatomy ? "Trả lời" : undefined}
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
                depth > 0 && depth <= MAX_INDENT_DEPTH ? "border-l border-default pl-3 @app-sm:pl-4" : undefined,
            )}
            data-anat-part={showAnatomy ? "CommentThreadItem" : undefined}
        >
            <CommunityCommentRow
                comment={node}
                onReact={onReact ? (type) => onReact(node.id, type) : undefined}
                actions={replyAction}
                anatPart={showAnatomy ? "CommunityCommentRow" : undefined}
                showAnatomy={showAnatomy}
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
                    anatPart={showAnatomy ? "Composer" : undefined}
                    showAnatomy={showAnatomy}
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
                            showAnatomy={showAnatomy}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    )
}

/**
 * CommentThread assembles a nested discussion from {@link CommunityCommentRow} (one
 * per node) and {@link Composer} (root box + each inline reply). Replies indent one
 * level per depth behind a guide rail that caps after a few levels; every node
 * exposes a "Trả lời" affordance that reveals its own reply composer, and a
 * top-level composer adds a root comment. Reaction handling is a straight
 * pass-through to each row.
 *
 * Presentational block: props-only. It owns only the transient draft/reveal state of
 * the composers; posting is delegated via {@link CommentThreadProps.onReply}.
 *
 * @param props - {@link CommentThreadProps}
 */
export const CommentThread = ({
    comments,
    onReply,
    onReact,
    avatarSrc,
    className,
    showAnatomy,
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
        <div className={cn("flex flex-col gap-3", className)}>
            {/* top-level composer for a new root comment */}
            <Composer
                value={rootValue}
                onChange={setRootValue}
                onSubmit={submitRoot}
                avatarSrc={avatarSrc}
                placeholder="Viết bình luận..."
                anatPart={showAnatomy ? "Composer" : undefined}
                showAnatomy={showAnatomy}
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
                            showAnatomy={showAnatomy}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    )
}
