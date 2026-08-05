"use client"

import React, { useCallback, useState } from "react"
import { useTranslations } from "next-intl"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import type { QueryCommunityCommentNode } from "@/modules/api/graphql/queries/types/community-comments"
import { useMutateCreateCommunityPostCommentSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCreateCommunityPostCommentSwr"
import { useMutateReactCommunityPostCommentSwr } from "@/hooks/swr/api/graphql/mutations/useMutateReactCommunityPostCommentSwr"
import { useQueryCommunityPostCommentsSwr } from "@/hooks/swr/api/graphql/queries/useQueryCommunityPostCommentsSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { _CommunityCommentItem } from "./component"

/** Props for {@link CommunityCommentItem}. */
export interface CommunityCommentItemProps {
    /** Post the comment belongs to. */
    postId: string
    /** The top-level comment to render (with its reply controls). */
    comment: QueryCommunityCommentNode
    /** Whether the viewer is signed in (gates reply + reactions). */
    authenticated: boolean
    /** Refresh the parent list (updates this comment's reaction + reply counts). */
    onChanged?: () => void
}

/**
 * A top-level community comment with its reply affordances — the CONNECTED half: owns the
 * reply-box/replies-list UI state, the react + create-comment mutations, the replies list's own SWR
 * (fetched only once the viewer opens it), and every translated label. Hands it all, already resolved,
 * to the presentational {@link _CommunityCommentItem}. See `tiers/split.md`.
 *
 * @param props - {@link CommunityCommentItemProps}
 */
export const CommunityCommentItem = ({
    postId,
    comment,
    authenticated,
    onChanged,
}: CommunityCommentItemProps) => {
    const t = useTranslations()
    const runGraphQL = useGraphQLWithToast()
    const [repliesOpen, setRepliesOpen] = useState(false)
    const [replyOpen, setReplyOpen] = useState(false)
    const [replyBody, setReplyBody] = useState("")

    const { trigger: reactComment } = useMutateReactCommunityPostCommentSwr()
    const { trigger: createComment, isMutating } = useMutateCreateCommunityPostCommentSwr()
    // replies load only once the list is opened
    const repliesSwr = useQueryCommunityPostCommentsSwr(postId, comment.id, repliesOpen)
    const replies = repliesSwr.data?.comments ?? []

    /** React to this top-level comment, then refresh the parent list. */
    const onReact = useCallback(
        async (type: ReactionType | null) => {
            await reactComment({ commentId: comment.id, type })
            onChanged?.()
        },
        [reactComment, comment.id, onChanged],
    )

    /** React to one of the replies, then refresh the reply list. */
    const onReactReply = useCallback(
        async (replyId: string, type: ReactionType | null) => {
            await reactComment({ commentId: replyId, type })
            await repliesSwr.mutate()
        },
        [reactComment, repliesSwr],
    )

    /** Post a reply to this comment, then open + refresh the reply list. */
    const onSubmitReply = useCallback(async () => {
        const trimmed = replyBody.trim()
        if (!trimmed) {
            return
        }
        const ok = await runGraphQL(
            async () => {
                const result = await createComment({
                    postId,
                    parentCommentId: comment.id,
                    body: trimmed,
                })
                return result.data!.createCommunityPostComment
            },
            { showSuccessToast: true },
        )
        if (ok) {
            setReplyBody("")
            setReplyOpen(false)
            setRepliesOpen(true)
            await repliesSwr.mutate()
            // bump this comment's replyCount in the parent list
            onChanged?.()
        }
    }, [replyBody, postId, comment.id, createComment, runGraphQL, repliesSwr, onChanged])

    return (
        <_CommunityCommentItem
            comment={comment}
            authenticated={authenticated}
            onReact={onReact}
            replyOpen={replyOpen}
            onToggleReplyOpen={() => setReplyOpen((previous) => !previous)}
            replyBody={replyBody}
            onReplyBodyChange={setReplyBody}
            onSubmitReply={onSubmitReply}
            isSubmittingReply={isMutating}
            repliesOpen={repliesOpen}
            onToggleReplies={() => setRepliesOpen((previous) => !previous)}
            // first load, nothing in hand → shimmer (loading-and-skeleton.md §2)
            repliesIsSkeleton={repliesSwr.isLoading && replies.length === 0}
            repliesIsEmpty={replies.length === 0}
            repliesError={replies.length === 0 ? repliesSwr.error : undefined}
            onRetryReplies={() => { void repliesSwr.mutate() }}
            replies={replies}
            onReactReply={onReactReply}
            labels={{
                replyToggle: t("community.comments.reply"),
                viewReplies: t("community.comments.viewReplies", { count: comment.replyCount }),
                hideReplies: t("community.comments.hideReplies"),
                replyPlaceholder: t("community.comments.replyPlaceholder"),
                send: t("community.comments.send"),
                repliesEmptyTitle: t("community.comments.empty"),
                repliesErrorTitle: t("community.comments.error"),
                retry: t("community.retry"),
            }}
        />
    )
}
