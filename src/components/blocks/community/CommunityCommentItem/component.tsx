import { InputTextarea } from "@/components/atoms/forms"
import React from "react"
import type { ReactNode } from "react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { CommunityCommentRow } from "@/components/blocks/feed/CommunityCommentRow"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Button } from "@/components/atoms/buttons/Button"

import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import type { QueryCommunityCommentNode } from "@/modules/api/graphql/queries/types/community-comments"

/** How many placeholder rows the co-located skeleton shows while the replies list loads. */
const SKELETON_REPLY_COUNT = 2

/** All display text, already localized by the connected {@link import("./index").CommunityCommentItem}; a story passes i18n keys. */
export interface CommunityCommentItemLabels {
    /** "Reply" toggle under the comment (only when signed in and the comment isn't deleted). */
    replyToggle: string
    /** "View N replies" — shown when the reply list is collapsed. Already interpolated with the count. */
    viewReplies: string
    /** "Hide replies" — shown when the reply list is open. */
    hideReplies: string
    /** Placeholder + accessible name for the reply textarea. */
    replyPlaceholder: string
    /** Submit button label on the reply box. */
    send: string
    /** Settled with zero replies — the replies region's empty title. */
    repliesEmptyTitle: string
    /** Settled with a fetch error — the replies region's error title. */
    repliesErrorTitle: string
    /** Retry-button label on the replies region's error state. */
    retry: string
}

/** Props for {@link _CommunityCommentItem} — presentational; all data resolved, no fetch/store/i18n. */
export interface CommunityCommentItemProps {
    /** The top-level comment to render (with its reply controls). */
    comment: QueryCommunityCommentNode
    /** Whether the viewer is signed in (gates reply + reactions). */
    authenticated: boolean
    /** React to this top-level comment. Omit to render the reaction bar read-only. */
    onReact?: (type: ReactionType | null) => void

    /** Whether the reply textarea is open. */
    replyOpen: boolean
    /** Toggles {@link CommunityCommentItemProps.replyOpen}. */
    onToggleReplyOpen: () => void
    /** Current (controlled) reply draft. */
    replyBody: string
    /** Fired on every keystroke in the reply textarea. */
    onReplyBodyChange: (value: string) => void
    /** Submits {@link CommunityCommentItemProps.replyBody} as a reply. */
    onSubmitReply: () => void
    /** True while the reply mutation is in flight — locks the send button. */
    isSubmittingReply?: boolean

    /** Whether the replies list is expanded. */
    repliesOpen: boolean
    /** Toggles {@link CommunityCommentItemProps.repliesOpen}. */
    onToggleReplies: () => void
    /** First load, nothing in hand → the replies region shimmers in place (co-located). Owned by the connected file. */
    repliesIsSkeleton?: boolean
    /** Settled with zero replies → the replies region's empty message. */
    repliesIsEmpty?: boolean
    /** Truthy → the replies region's error message (beats loading + empty). */
    repliesError?: unknown
    /** Retries the failed replies query. */
    onRetryReplies?: () => void
    /** The loaded replies, already resolved. */
    replies?: Array<QueryCommunityCommentNode>
    /** React to one of the replies. Omit to render every reply's reaction bar read-only. */
    onReactReply?: (replyId: string, type: ReactionType | null) => void

    labels: CommunityCommentItemLabels
}

/**
 * A top-level community comment with its reply affordances: react, reply (one level deep), and an
 * expandable list of its replies — the presentational half of
 * {@link import("./index").CommunityCommentItem} (`tiers/split.md`). The replies region renders
 * error → skeleton → empty → content in that fixed order (BLOCK-8); `CommunityCommentRow` (the reply
 * row) takes no `isSkeleton` of its own, so while shimmering the SAME list position swaps in a bare
 * `Skeleton.ListRow` instead of threading a flag through it (`loading-and-skeleton.md` §1's stated
 * exception).
 *
 * @param props - {@link CommunityCommentItemProps}
 */
export const _CommunityCommentItem = ({
    comment,
    authenticated,
    onReact,
    replyOpen,
    onToggleReplyOpen,
    replyBody,
    onReplyBodyChange,
    onSubmitReply,
    isSubmittingReply = false,
    repliesOpen,
    onToggleReplies,
    repliesIsSkeleton = false,
    repliesIsEmpty = false,
    repliesError,
    onRetryReplies,
    replies = [],
    onReactReply,
    labels,
}: CommunityCommentItemProps) => {
    const showReplyToggle = authenticated && !comment.isDeleted
    const showViewReplies = comment.replyCount > 0

    const actions = showReplyToggle || showViewReplies
        ? (
            <StackH gap={4} items={[
                ...(showReplyToggle ? [() => (
                    <Typography size="xs" color="muted" isButton text={labels.replyToggle} onPress={onToggleReplyOpen} />
                )] : []),
                ...(showViewReplies ? [() => (
                    <Typography
                        size="xs"
                        color="accent-soft"
                        isButton
                        text={repliesOpen ? labels.hideReplies : labels.viewReplies}
                        onPress={onToggleReplies}
                    />
                )] : []),
            ]} />
        )
        : undefined

    // error beats a stale skeleton flag; empty only once settled (BLOCK-8)
    let repliesContent: ReactNode = null
    if (repliesOpen) {
        if (repliesError) {
            repliesContent = (
                <AsyncContentError title={labels.repliesErrorTitle} onRetry={onRetryReplies} retryLabel={labels.retry} />
            )
        } else if (!repliesIsSkeleton && repliesIsEmpty) {
            repliesContent = <AsyncContentEmpty title={labels.repliesEmptyTitle} />
        } else {
            // co-located: SAME row list, placeholder rows while shimmering, real rows once resolved.
            // `CommunityCommentRow` has no `isSkeleton` of its own (§1's exception) — the placeholder
            // swaps in a bare `Skeleton.ListRow` at the same position instead of threading a flag.
            const rows = repliesIsSkeleton
                ? Array.from({ length: SKELETON_REPLY_COUNT }, () => () => (
                    <Skeleton.ListRow withSubtitle withTrailing={false} />
                ))
                : replies.map((reply) => () => (
                    <CommunityCommentRow
                        comment={reply}
                        onReact={authenticated ? (type: ReactionType | null) => onReactReply?.(reply.id, type) : undefined}
                    />
                ))
            repliesContent = <StackV gap={4} items={rows} />
        }
    }

    return (
        <StackV
            gap={3}
            principle="sibling-stack"
            identity={{ tier: "block", component: "CommunityCommentItem" }}
            items={[
                () => (
                    <CommunityCommentRow comment={comment} onReact={authenticated ? onReact : undefined} actions={actions} />
                ),
                ...(replyOpen && authenticated ? [() => (
                    <StackV gap={3} principle="sibling-stack" nested items={[
                        () => (
                            <InputTextarea
                                rows={2}
                                value={replyBody}
                                onValueChange={onReplyBodyChange}
                                placeholder={labels.replyPlaceholder}
                                ariaLabel={labels.replyPlaceholder}
                                variant="secondary"
                            />
                        ),
                        () => (
                            <Box principle="push-end" className="ml-auto w-fit">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    isPending={isSubmittingReply}
                                    isDisabled={!replyBody.trim()}
                                    onPress={onSubmitReply}
                                    label={labels.send}
                                />
                            </Box>
                        ),
                    ]} />
                )] : []),
                ...(repliesOpen ? [() => (
                    <StackV gap={3} principle="sibling-stack" nested body={() => repliesContent} />
                )] : []),
            ]} />
    )
}
