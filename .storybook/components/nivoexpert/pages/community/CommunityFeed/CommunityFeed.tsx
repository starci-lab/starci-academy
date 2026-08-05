import { ChatsCircleIcon, ShieldCheckIcon, ShieldWarningIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { SplitWorkspace } from "@sb-components/frames/SplitWorkspace/SplitWorkspace"
import {
    PostCard,
    type PostCardLabels,
    type PostView,
} from "@sb-components/nivoexpert/blocks/community/PostCard/PostCard"

/**
 * `CommunityFeed` -- the community PAGE: the post feed beside a sticky moderation-queue
 * summary card. A page's story is one complete STATE per story -- `with-posts`,
 * `loading`, `empty` -- not a leaf-per-prop map. Grounded in the real `posts` query ->
 * `PostEntity[]`, the `reactPost` like toggle, and the moderation-queue count (the FE
 * has no full admin capability for it yet -- this page only summarizes a count).
 */

/** One feed entry -- a post plus whether the viewer has liked it (derived from `ReactionEntity`). */
export interface FeedPostView {
    /** The post. */
    post: PostView
    /** `true` when the viewing member has a reaction row for this post. */
    hasLiked: boolean
}

/** Props for {@link CommunityFeed}. */
export interface CommunityFeedProps {
    /** The feed, pinned-first, as ordered by the connected layer. Empty is the `empty` state. */
    posts: Array<FeedPostView>
    /** Toggle the viewer's like on one post -- the connected layer runs `reactPost(postId)`. */
    onToggleLike: (postId: string) => void
    /** How many community posts are waiting for moderation review right now. `0` -> the aside shows the all-clear picture. */
    pendingModerationCount: number
    /** Opens the moderation queue (the connected layer routes to the moderation surface, e.g. `PostModerationDrawer` on the first pending post). */
    onOpenModerationQueue: () => void
    /** `true` -> the feed's first fetch is in flight; the page shows a heading + a fixed count of skeleton post cards (the same {@link PostCard} with `isSkeleton`) so nothing jumps. */
    isSkeleton?: boolean
    /** Already-localized copy for the page. */
    labels: CommunityFeedLabels
    /** Already-localized copy forwarded to each {@link PostCard}. */
    postLabels: PostCardLabels
}

/** Props for the feed's reading column or sticky aside. */
interface CommunityFeedColumnProps {
    /** `true` -> this column is a loading mirror. */
    isSkeleton?: boolean
}

/** The already-resolved copy the page renders. */
export interface CommunityFeedLabels {
    /** Feed heading (e.g. "Community"). */
    title: string
    /** Empty-state title when there are no posts. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
    /** Moderation aside card label (e.g. "Moderation queue"). */
    moderationTitle: string
    /** Moderation aside title when posts are waiting for review. */
    moderationPendingTitle: string
    /** Moderation aside supporting line when posts are waiting for review. */
    moderationPendingDescription: string
    /** Moderation aside title when there is nothing to review. */
    moderationClearTitle: string
    /** Moderation aside supporting line when there is nothing to review. */
    moderationClearDescription: string
    /** Label of the button that opens the moderation queue. */
    moderationCtaLabel: string
}

/** How many skeleton post cards the loading mirror draws. */
const SKELETON_POST_COUNT = 3

/** A placeholder post sized like a real one, so the skeleton card mirrors the loaded shape. */
const SKELETON_POST: PostView = {
    id: "skeleton-post",
    authorName: "Member name",
    title: "A community post title goes here",
    body: "A couple of lines of the post body stand in for the real content while the feed loads.",
    pinned: false,
    reactionCount: 0,
    commentCount: 0,
    comments: [],
}

/**
 * The community feed page. See the file header for why it composes the `PostCard`
 * block, why the moderation queue is a summary card rather than an inlined list, and
 * why its story is one state per render.
 *
 * @param props - {@link CommunityFeedProps}
 */
const CommunityFeed = ({
    posts,
    onToggleLike,
    pendingModerationCount,
    onOpenModerationQueue,
    isSkeleton: isPageSkeleton = false,
    labels,
    postLabels,
}: CommunityFeedProps) => {
    /** The reading column -- the feed heading above the post list, or its skeleton mirror. */
    const Main = ({ isSkeleton = false }: CommunityFeedColumnProps) =>
        isSkeleton ? (
            <StackV
                gap={4}
                isSkeleton
                items={[
                    () => <Typography size="h3" weight="semibold" isSkeleton />,
                    () => (
                        <StackV
                            gap={4}
                            isSkeleton
                            items={Array.from({ length: SKELETON_POST_COUNT }, () => () => (
                                <PostCard post={SKELETON_POST} hasLiked={false} onToggleLike={() => {}} isSkeleton labels={postLabels} />
                            ))}
                        />
                    ),
                ]}
            />
        ) : (
            <StackV
                gap={4}
                items={[
                    () => <Typography size="h3" weight="semibold" text={labels.title} />,
                    () =>
                        posts.length === 0 ? (
                            <EmptyState icon={ChatsCircleIcon} title={labels.emptyTitle} description={labels.emptyDescription} />
                        ) : (
                            <StackV
                                gap={4}
                                items={posts.map((entry) => () => (
                                    <PostCard
                                        post={entry.post}
                                        hasLiked={entry.hasLiked}
                                        onToggleLike={() => onToggleLike(entry.post.id)}
                                        labels={postLabels}
                                    />
                                ))}
                            />
                        ),
                ]}
            />
        )

    /** The sticky aside -- a summary of the moderation queue, never the queue itself. */
    const Aside = ({ isSkeleton = false }: CommunityFeedColumnProps) => (
        <SurfaceCard
            padding={3}
            label={labels.moderationTitle}
            isSkeleton={isSkeleton}
            action={
                isSkeleton
                    ? undefined
                    : () => <Chip tone={pendingModerationCount > 0 ? "warning" : "default"} text={String(pendingModerationCount)} />
            }
            body={() => (
                <EmptyState
                    icon={pendingModerationCount > 0 ? ShieldWarningIcon : ShieldCheckIcon}
                    isSkeleton={isSkeleton}
                    title={pendingModerationCount > 0 ? labels.moderationPendingTitle : labels.moderationClearTitle}
                    description={pendingModerationCount > 0 ? labels.moderationPendingDescription : labels.moderationClearDescription}
                    action={
                        isSkeleton || pendingModerationCount === 0
                            ? undefined
                            : () => <Button variant="secondary" size="sm" label={labels.moderationCtaLabel} onPress={onOpenModerationQueue} />
                    }
                />
            )}
        />
    )

    return (
        <div data-tier="page" data-component="CommunityFeed" className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
            <SplitWorkspace main={Main} aside={Aside} isSkeleton={isPageSkeleton} />
        </div>
    )
}

export { CommunityFeed }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "CommunityFeed" } as const
