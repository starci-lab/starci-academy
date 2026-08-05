"use client"

import React, { useCallback, useState } from "react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Button } from "@/components/atoms/buttons/Button"
import { Divider } from "@/components/atoms/display/Divider"
import { Input } from "@/components/atoms/forms/Input"
import { StackH, StackV } from "@/components/frames/Stack"
import { CommunityCommentItem } from "../CommunityCommentItem"
import type { QueryCommunityCommentNode } from "@/modules/api/graphql/queries/types/community-comments"

/** How many placeholder rows the co-located skeleton shows while the thread's first load is in flight. */
const SKELETON_ROW_COUNT = 3

/** All display text, already localized by the connected `CommunityCommentThread`; a story passes i18n keys. */
export interface CommunityCommentThreadLabels {
    /** Placeholder + aria-label of the top-level composer. */
    composerPlaceholder: string
    /** Submit button label. */
    send: string
    /** Shown when the thread has settled with zero comments. */
    emptyTitle: string
    /** Shown when the thread has settled with a fetch error, nothing in hand. */
    errorTitle: string
    /** Retry button label, paired with `onRetry`. */
    retry: string
}

/** Props for {@link _CommunityCommentThread} — presentational; all data resolved, no fetch/store/i18n. */
export interface CommunityCommentThreadProps {
    /** Post whose comments are shown — threaded to each row for its own reply/react calls. */
    postId: string
    /** Whether the viewer is signed in (gates the composer + reactions). */
    authenticated: boolean
    /**
     * First load, nothing in hand → the list shimmers in place (co-located, no parallel
     * tree). Owned by the connected file (loading-and-skeleton.md).
     */
    isSkeleton?: boolean
    /** Settled with zero comments → the empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats a stale loading flag). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler, paired with `labels.retry` on the error branch. */
    onRetry?: () => void
    /** Top-level comments to render; ignored while `isSkeleton`. */
    comments?: Array<QueryCommunityCommentNode>
    /** Refresh the thread after a row-level change (reply/react) — also bubbles up to the feed. */
    onItemChanged?: () => void
    /** Submit the composer's trimmed body; resolves `true` on success so the composer clears itself. */
    onSubmit: (body: string) => Promise<boolean>
    /** True while the create-comment mutation is in flight. */
    isSubmitting?: boolean
    labels: CommunityCommentThreadLabels
}

/**
 * Expandable comment thread under a community post: lists top-level comments (each with its own
 * reply + nested-replies controls via {@link CommunityCommentItem}), plus a composer for signed-in
 * users. The presentational half of {@link import("./index").CommunityCommentThread} — error beats a
 * stale loading flag, empty only once settled, otherwise the ONE tree renders with `isSkeleton`
 * threaded down. `CommunityCommentItem` carries no `isSkeleton` of its own, so the loading branch
 * swaps in `Skeleton.ListRow` placeholders right where the real rows sit (loading-and-skeleton.md).
 * See `tiers/split.md` — the connected `index.tsx` owns the fetch, the mutation, and i18n.
 *
 * @param props - {@link CommunityCommentThreadProps}
 */
export const _CommunityCommentThread = ({
    postId,
    authenticated,
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    comments = [],
    onItemChanged,
    onSubmit,
    isSubmitting = false,
    labels,
}: CommunityCommentThreadProps) => {
    const [composerValue, setComposerValue] = useState("")

    /** Submit the composer, then clear it only once the connected half confirms success. */
    const onComposerSubmit = useCallback(async () => {
        const trimmed = composerValue.trim()
        if (!trimmed) {
            return
        }
        const ok = await onSubmit(trimmed)
        if (ok) {
            setComposerValue("")
        }
    }, [composerValue, onSubmit])

    // Rows: `CommunityCommentItem` has no `isSkeleton` of its own, so while shimmering a matching
    // count of `Skeleton.ListRow` stands in, right in the same list position (co-located, not a
    // parallel tree) — see `missingSkeletonSupport`.
    const rows = isSkeleton
        ? Array.from({ length: SKELETON_ROW_COUNT }, () => () => (
            <Skeleton.ListRow withSubtitle withTrailing={false} />
        ))
        : comments.map((comment) => () => (
            <CommunityCommentItem
                postId={postId}
                comment={comment}
                authenticated={authenticated}
                onChanged={onItemChanged}
            />
        ))

    // error beats a stale loading flag; empty only once settled (BLOCK-8 / loading-and-skeleton.md).
    let listBody: React.ReactNode
    if (error) {
        listBody = <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    } else if (!isSkeleton && isEmpty) {
        listBody = <AsyncContentEmpty title={labels.emptyTitle} />
    } else {
        listBody = <StackV gap={3} isSkeleton={isSkeleton} items={rows} />
    }

    return (
        <StackV
            gap={3}
            identity={{ tier: "block", component: "CommunityCommentThread" }}
            items={[
                () => <Divider />,
                ...(authenticated ? [() => (
                    <StackV gap={2} items={[
                        () => (
                            <Input.Textarea
                                variant="secondary"
                                rows={2}
                                value={composerValue}
                                onValueChange={setComposerValue}
                                placeholder={labels.composerPlaceholder}
                                ariaLabel={labels.composerPlaceholder}
                            />
                        ),
                        () => (
                            <StackH gap={2} justify="end" items={[
                                () => (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        label={labels.send}
                                        isPending={isSubmitting}
                                        isDisabled={!composerValue.trim()}
                                        onPress={() => void onComposerSubmit()}
                                    />
                                ),
                            ]} />
                        ),
                    ]} />
                )] : []),
                () => listBody,
            ]}
        />
    )
}
