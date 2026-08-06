import { ChatCircleIcon, HeartIcon, PushPinIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { UserCell } from "@sb-components/composites/lists/UserCell/UserCell"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `PostCard` -- one community feed post: author identity, title + body, a like toggle
 * with its count, a comment count, and a comments preview. The three pictures --
 * `default`, `liked`, `with-comments` -- are DATA, so they are STATES of the single
 * shape. Grounded in the real `PostEntity`, `CommentEntity`, and `ReactionEntity`
 * (`hasLiked` is derived; the like toggle is the real `reactPost` mutation).
 */

/** One comment preview -- a subset of `CommentEntity`. */
export interface PostCommentView {
    /** Comment id (`CommentEntity.id`). */
    id: string
    /** Display name of the commenter (`CommentEntity.authorName`). */
    authorName: string
    /** Comment body (`CommentEntity.body`). */
    body: string
}

/** One feed post -- a subset of `PostEntity`. */
export interface PostView {
    /** Post id (`PostEntity.id`). */
    id: string
    /** Display name of the author (`PostEntity.authorName`). */
    authorName: string
    /** Post title (`PostEntity.title`). */
    title: string
    /** Post body -- markdown source (`PostEntity.body`), rendered plain here. */
    body: string
    /** Whether the post is pinned to the top of the feed (`PostEntity.pinned`). */
    pinned: boolean
    /** Denormalised like count (`PostEntity.reactionCount`). */
    reactionCount: number
    /** Total number of comments (`PostEntity.comments.length`). */
    commentCount: number
    /** A preview of the first comments -- the connected layer caps the list. */
    comments: Array<PostCommentView>
}

/** Props for {@link PostCard}. */
export interface PostCardProps {
    /** The post. */
    post: PostView
    /** `true` when the viewing member has a reaction row for this post (derived from `ReactionEntity`). */
    hasLiked: boolean
    /** Toggle the viewer's like -- the connected layer runs `reactPost(postId)`. */
    onToggleLike: () => void
    /**
     * `true` -> the feed's first fetch is in flight: the same post card renders
     * with every content node (author, title, body, like/comment counts)
     * shimmering (§12b), threaded down. A feed renders a fixed count of these
     * while loading.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: PostCardLabels
}

/** The already-resolved copy the block renders. */
export interface PostCardLabels {
    /** Chip label for a pinned post. */
    pinnedLabel: string
    /** Accessible name for the like toggle (announces the action, not the count). */
    likeAriaLabel: string
    /** Suffix after the comment count (e.g. "comments"). */
    commentsSuffix: string
    /** Template piece before the hidden-comments count (e.g. "more") -- rendered as "+N more". */
    moreCommentsSuffix: string
}

/**
 * The community post card. See the file header for why the three pictures are
 * states of one shape rather than separate leaves.
 *
 * @param props - {@link PostCardProps}
 */
const PostCard = ({ post, hasLiked, onToggleLike, isSkeleton = false, labels }: PostCardProps) => {
    const hiddenComments = post.commentCount - post.comments.length

    /** One comment preview -- commenter identity above the comment body. */
    const CommentRow = (comment: PostCommentView) => (
        <StackV
            gap={1}
            isSkeleton={isSkeleton}
            items={[
                () => <Typography size="xs" weight="semibold" isSkeleton={isSkeleton} text={comment.authorName} />,
                () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={comment.body} />,
            ]}
        />
    )

    /** The comments preview region -- only rendered when a preview exists. */
    const CommentsRegion = () => (
        <SurfaceCard
            variant="nested"
            padding={3}
            isSkeleton={isSkeleton}
            body={() => (
                <StackV
                    gap={3}
                    isSkeleton={isSkeleton}
                    items={[
                        ...post.comments.map((comment) => () => CommentRow(comment)),
                        ...(hiddenComments > 0
                            ? [() => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={`+${hiddenComments} ${labels.moreCommentsSuffix}`} />]
                            : []),
                    ]}
                />
            )}
        />
    )

    return (
        <div data-tier="block" data-component="PostCard">
            <SurfaceCard
                padding={3}
                isSkeleton={isSkeleton}
                body={() => (
                    <StackV
                        principle="sibling-stack" gap={3}
                        isSkeleton={isSkeleton}
                        items={[
                            () => (
                                <StackH
                                    principle="value-row" gap={3}
                                    justify="between"
                                    align="center"
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => <UserCell username={post.authorName} size="sm" isSkeleton={isSkeleton} />,
                                        ...(!isSkeleton && post.pinned ? [() => <Chip tone="accent" icon={PushPinIcon} text={labels.pinnedLabel} />] : []),
                                    ]}
                                />
                            ),
                            () => <Typography size="base" weight="semibold" isSkeleton={isSkeleton} text={post.title} />,
                            () => <Typography size="sm" color="muted" preserveWhitespace isSkeleton={isSkeleton} text={post.body} />,
                            () => (
                                <StackH
                                    principle="flex-action" gap={3}
                                    align="center"
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => (
                                            <Button
                                                variant={hasLiked ? "secondary" : "ghost"}
                                                size="sm"
                                                prefixIcon={HeartIcon}
                                                label={String(post.reactionCount)}
                                                ariaLabel={labels.likeAriaLabel}
                                                isSkeleton={isSkeleton}
                                                onPress={onToggleLike}
                                            />
                                        ),
                                        () => (
                                            <Typography
                                                size="sm"
                                                color="muted"
                                                prefixIcon={ChatCircleIcon}
                                                isSkeleton={isSkeleton}
                                                text={`${post.commentCount} ${labels.commentsSuffix}`}
                                            />
                                        ),
                                    ]}
                                />
                            ),
                            ...(!isSkeleton && post.comments.length > 0 ? [() => <CommentsRegion />] : []),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { PostCard }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "PostCard" } as const
