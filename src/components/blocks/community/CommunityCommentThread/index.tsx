"use client"

import React, { useCallback } from "react"
import { useTranslations } from "next-intl"
import { _CommunityCommentThread } from "./component"
import { useMutateCreateCommunityPostCommentSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCreateCommunityPostCommentSwr"
import { useQueryCommunityPostCommentsSwr } from "@/hooks/swr/api/graphql/queries/useQueryCommunityPostCommentsSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"

/** Props for {@link CommunityCommentThread}. */
export interface CommunityCommentThreadProps {
    /** Post whose comments are shown. */
    postId: string
    /** Whether the viewer is signed in (gates the composer + reactions). */
    authenticated: boolean
    /** Called after a comment is created so the parent can refresh the post. */
    onChanged?: () => void
}

/**
 * Expandable comment thread under a community post — the CONNECTED half (see `tiers/split.md`):
 * fetches its own page of top-level comments (SWR) so the feed only pays for it once a post is
 * expanded, wires the create-comment mutation, and hands resolved data + already-translated labels
 * to the presentational {@link _CommunityCommentThread}.
 *
 * @param props - {@link CommunityCommentThreadProps}
 */
export const CommunityCommentThread = ({
    postId,
    authenticated,
    onChanged,
}: CommunityCommentThreadProps) => {
    const t = useTranslations()
    const runGraphQL = useGraphQLWithToast()

    const { data, error, mutate } = useQueryCommunityPostCommentsSwr(postId)
    const { trigger: createComment, isMutating } = useMutateCreateCommunityPostCommentSwr()

    const comments = data?.comments ?? []

    // refresh the top-level list, and bubble up so the feed bumps the post's comment count
    const onItemChanged = useCallback(() => {
        void mutate()
        onChanged?.()
    }, [mutate, onChanged])

    /** Submit a new top-level comment, then refresh + bubble up. Resolves `true` on success. */
    const onSubmit = useCallback(async (body: string) => {
        // toast-wrapped create; action returns the inner GraphQLResponse
        const ok = await runGraphQL(
            async () => {
                const result = await createComment({ postId, body })
                return result.data!.createCommunityPostComment
            },
            { showSuccessToast: true },
        )
        if (ok) {
            await mutate()
            onChanged?.()
        }
        return Boolean(ok)
    }, [postId, createComment, runGraphQL, mutate, onChanged])

    return (
        <_CommunityCommentThread
            postId={postId}
            authenticated={authenticated}
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={!data && !error}
            // error beats loading + empty; only a settled fetch error (nothing in hand) reaches the block
            error={comments.length === 0 ? error : undefined}
            onRetry={() => { void mutate() }}
            isEmpty={comments.length === 0}
            comments={comments}
            onItemChanged={onItemChanged}
            onSubmit={onSubmit}
            isSubmitting={isMutating}
            labels={{
                composerPlaceholder: t("community.comments.placeholder"),
                send: t("community.comments.send"),
                emptyTitle: t("community.comments.empty"),
                errorTitle: t("community.comments.error"),
                retry: t("community.retry"),
            }}
        />
    )
}
