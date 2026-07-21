"use client"

import React, { useState } from "react"
import { Chip, Link, Spinner, cn } from "@heroui/react"
import { CheckCircleIcon, SealCheckIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import { ChatBubble } from "@/components/blocks/feed/ChatBubble"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { ReactionBar } from "@/components/features/community/Discussion/ReactionBar"
import { CommentComposer } from "@/components/features/community/Discussion/CommentComposer"
import type { ReactionType, CommentNode } from "@/modules/api/graphql/queries/types/discussion"
import type { CommentItemCallbacks } from "@/components/features/community/Discussion/CommentItem"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link QaMessageBubble}. */
export interface QaMessageBubbleProps extends CommentItemCallbacks, WithClassNames<undefined> {
    /** The answer/reply to render. */
    comment: CommentNode
    /** Current viewer id — drives own-bubble alignment + owner edit/delete; null when unknown. */
    currentUserId: string | null
    /** Current viewer identity for the reply composer avatar; null when signed out. */
    currentUser: { username: string, avatar?: string } | null
    /** Loaded reply subtrees, keyed by parent comment id (lazily populated by the container). */
    repliesByParent: Record<string, Array<CommentNode>>
    /**
     * When this bubble is a flattened reply-to-reply, the display name of the author it
     * answers — shown as a small `↳ trả lời {name}` tag so threading survives without indent.
     */
    replyToName?: string | null
    /**
     * Whether the viewer may accept this answer — true only for a DIRECT answer when the
     * viewer is the asker. Nested replies are never acceptable, so they leave this off.
     */
    canAccept?: boolean
    /** Accept (or clear) this answer as the accepted one. */
    onAcceptAnswer?: (commentId: string, accepted: boolean) => void
}

/**
 * One answer (or nested reply) in a course-Q&A conversation, rendered as a chat
 * bubble: the viewer's own messages align right on an accent tint, everyone else
 * (peers + founder) aligns left on the surface tint — reusing the canonical
 * {@link ChatBubble}. Identity (name · founder badge · relative time · edited) sits
 * in a header line above the bubble rather than inside it, since {@link ChatBubble}
 * is a plain two-role primitive; the founder is marked in that header, not by
 * recolouring the bubble.
 *
 * Behaviour mirrors the per-lesson {@link import("@/components/features/community/Discussion/CommentItem").CommentItem}
 * — 6-emotion {@link ReactionBar}, reply/edit/delete, and lazily-loaded nested replies —
 * so an answer keeps every interaction it had as a forum row. Nested replies are
 * FLATTENED (rendered as sibling bubbles carrying a `↳ trả lời {name}` tag) instead of
 * indented, so deep threads never squeeze the bubbles narrower.
 *
 * @param props - {@link QaMessageBubbleProps}
 */
export const QaMessageBubble = ({
    comment,
    currentUserId,
    currentUser,
    repliesByParent,
    replyToName,
    canAccept = false,
    onAcceptAnswer,
    onReply,
    onEdit,
    onDelete,
    onReactComment,
    onLoadReplies,
    className,
}: QaMessageBubbleProps) => {
    const t = useTranslations()
    // transient per-bubble UI state (mirrors CommentItem)
    const [replying, setReplying] = useState(false)
    const [editing, setEditing] = useState(false)
    const [expanded, setExpanded] = useState(false)

    const isMine = currentUserId !== null && currentUserId === comment.author.id
    const isOwner = isMine
    // the container sets the key (even to an empty array) once a load resolves, so
    // its presence — not a local flag — tells us the subtree finished loading
    const repliesLoaded = comment.id in repliesByParent
    const replies = repliesByParent[comment.id] ?? []
    const displayName = isMine ? t("courseQa.you") : comment.author.username

    // expand/collapse the reply subtree, loading it on first expand
    const toggleReplies = () => {
        const next = !expanded
        setExpanded(next)
        if (next && !repliesLoaded) {
            onLoadReplies(comment.id)
        }
    }

    return (
        <div className={cn("flex w-full", isMine ? "justify-end" : "justify-start", className)}>
            <div className={cn("flex min-w-0 max-w-[92%] flex-col gap-1", isMine && "items-end")}>
                {/* reply-to tag (flattened threading) */}
                {replyToName ? (
                    <span className="rounded-lg bg-accent-soft px-2 py-1 text-xs text-accent-soft-foreground">
                        {t("courseQa.replyingTo", { name: replyToName })}
                    </span>
                ) : null}

                {/* accepted-answer badge — this reply is the chosen answer */}
                {comment.isAcceptedAnswer ? (
                    <Chip size="sm" variant="soft" color="success" className="gap-1">
                        <CheckCircleIcon weight="fill" aria-hidden className="size-3.5 shrink-0" />
                        {t("courseQa.acceptedAnswer")}
                    </Chip>
                ) : null}

                {/* identity header: name (+ founder) + relative time + edited flag */}
                <div className="flex flex-wrap items-center gap-2 px-1 text-xs text-muted">
                    <span className="font-medium text-foreground">{displayName}</span>
                    {comment.isFounderAuthor ? (
                        <span className="inline-flex items-center gap-1 text-accent-soft-foreground">
                            <SealCheckIcon weight="fill" aria-hidden className="size-3.5 shrink-0" />
                            {t("courseQa.founderBadge")}
                        </span>
                    ) : null}
                    <span>{getTimeAgoLabel(getTimeAgoMessage(comment.createdAt), t)}</span>
                    {comment.editedAt ? <span>{t("discussion.edited")}</span> : null}
                </div>

                {/* body: bubble, edit form, or deleted placeholder */}
                {comment.isDeleted ? (
                    <ChatBubble role={isMine ? "user" : "assistant"}>
                        <span className="text-sm italic text-muted">{t("discussion.deletedPlaceholder")}</span>
                    </ChatBubble>
                ) : editing ? (
                    <CommentComposer
                        initialValue={comment.body}
                        submitLabel={t("common.save")}
                        onCancel={() => setEditing(false)}
                        onSubmit={(body) => {
                            onEdit(comment.id, body)
                            setEditing(false)
                        }}
                    />
                ) : (
                    <ChatBubble role={isMine ? "user" : "assistant"}>
                        <MarkdownContent markdown={comment.body} className="text-sm [&_p]:m-0" />
                    </ChatBubble>
                )}

                {/* action row: reactions + reply + owner edit/delete */}
                {!comment.isDeleted && !editing ? (
                    <div className={cn("flex flex-wrap items-center gap-3 px-1", isMine && "flex-row-reverse")}>
                        <ReactionBar
                            summary={comment.reactions}
                            onReact={(type: ReactionType | null) => onReactComment(comment.id, type)}
                        />
                        <Link
                            className="cursor-pointer text-xs font-medium text-muted hover:text-foreground"
                            onPress={() => setReplying((prev) => !prev)}
                        >
                            {t("discussion.reply")}
                        </Link>
                        {isOwner ? (
                            <>
                                <Link
                                    className="cursor-pointer text-xs font-medium text-muted hover:text-foreground"
                                    onPress={() => setEditing(true)}
                                >
                                    {t("common.edit")}
                                </Link>
                                <Link
                                    className="cursor-pointer text-xs font-medium text-muted hover:text-danger-soft-foreground"
                                    onPress={() => onDelete(comment.id)}
                                >
                                    {t("common.delete")}
                                </Link>
                            </>
                        ) : null}
                        {/* asker-only: accept this direct answer as THE answer (toggle) */}
                        {canAccept ? (
                            <Link
                                className="cursor-pointer text-xs font-medium text-success-soft-foreground hover:underline underline-offset-4"
                                onPress={() => onAcceptAnswer?.(comment.id, !comment.isAcceptedAnswer)}
                            >
                                {comment.isAcceptedAnswer ? t("courseQa.unaccept") : t("courseQa.accept")}
                            </Link>
                        ) : null}
                    </div>
                ) : null}

                {/* reply composer */}
                {replying ? (
                    <CommentComposer
                        className="w-full"
                        placeholder={t("discussion.replyPlaceholder")}
                        submitLabel={t("discussion.reply")}
                        currentUser={currentUser}
                        onCancel={() => setReplying(false)}
                        onSubmit={(body) => {
                            onReply(comment.id, body)
                            setReplying(false)
                            // surface the new reply immediately by expanding + reloading the subtree
                            setExpanded(true)
                            onLoadReplies(comment.id)
                        }}
                    />
                ) : null}

                {/* replies toggle */}
                {comment.replyCount > 0 ? (
                    <Link
                        className="cursor-pointer self-start px-1 text-xs font-medium text-accent-soft-foreground hover:underline underline-offset-4 decoration-[var(--separator-tertiary)]"
                        onPress={toggleReplies}
                    >
                        {expanded
                            ? t("discussion.hideReplies")
                            : t("discussion.viewReplies", { count: comment.replyCount })}
                    </Link>
                ) : null}

                {/* flattened reply subtree — each reply is a sibling bubble carrying a reply-to tag */}
                {expanded ? (
                    !repliesLoaded ? (
                        <div className="flex w-full justify-center py-1">
                            <Spinner size="sm" />
                        </div>
                    ) : replies.length > 0 ? (
                        <div className="flex w-full flex-col gap-3">
                            {replies.map((reply) => (
                                <QaMessageBubble
                                    key={reply.id}
                                    comment={reply}
                                    currentUserId={currentUserId}
                                    currentUser={currentUser}
                                    repliesByParent={repliesByParent}
                                    replyToName={displayName}
                                    onReply={onReply}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onReactComment={onReactComment}
                                    onLoadReplies={onLoadReplies}
                                />
                            ))}
                        </div>
                    ) : null
                ) : null}
            </div>
        </div>
    )
}
