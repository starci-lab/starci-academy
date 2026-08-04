import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    CommunityFeed,
    type CommunityFeedLabels,
    type FeedPostView,
} from "@sb-components/nivoexpert/pages/community/CommunityFeed/CommunityFeed"
import type { PostCardLabels } from "@sb-components/nivoexpert/blocks/community/PostCard/PostCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CommunityFeed` — the community PAGE: the post feed beside a sticky moderation-queue
 * summary card. A page's story is one complete STATE per story — `with-posts`,
 * `loading`, `empty` — not a leaf-per-prop map. Grounded in the real `posts` query →
 * `PostEntity[]`, the `reactPost` like toggle, and the moderation-queue count (the FE
 * has no full admin capability for it yet — this page only summarizes a count).
 */
const meta: Meta<typeof CommunityFeed> = {
    title: "NivoExpert/Pages/Community/CommunityFeed/CommunityFeed",
    component: CommunityFeed,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CommunityFeed>

const NOOP = () => {}

const LABELS: CommunityFeedLabels = {
    title: "Community",
    emptyTitle: "No posts yet",
    emptyDescription: "Be the first to post — share a win, ask a question, or start a discussion.",
    moderationTitle: "Moderation queue",
    moderationPendingTitle: "Posts waiting for review",
    moderationPendingDescription: "New posts stay live until a moderator pins, hides, or removes them.",
    moderationClearTitle: "All caught up",
    moderationClearDescription: "No posts are waiting for review right now.",
    moderationCtaLabel: "Review queue",
}

const POST_LABELS: PostCardLabels = {
    pinnedLabel: "Pinned",
    likeAriaLabel: "Like this post",
    commentsSuffix: "comments",
    moreCommentsSuffix: "more",
}

const POSTS: Array<FeedPostView> = [
    {
        hasLiked: true,
        post: {
            id: "post-1",
            authorName: "Mai Trang",
            title: "How I priced my first cohort",
            body: "I anchored the cohort near my monthly 1:1 rate and opened an early-bird tier for the first run.",
            pinned: true,
            reactionCount: 13,
            commentCount: 5,
            comments: [
                { id: "c-1", authorName: "Hoang Nam", body: "This is gold — did you cap the early-bird count?" },
                { id: "c-2", authorName: "Le Vy", body: "Following. My cohort launches next month." },
            ],
        },
    },
    {
        hasLiked: false,
        post: {
            id: "post-2",
            authorName: "Hoang Nam",
            title: "Weekly build log — the tool loop finally clicked",
            body: "Spent the week wiring the agent's tool loop. Sharing the exact webhook wiring that made it work.",
            pinned: false,
            reactionCount: 4,
            commentCount: 0,
            comments: [],
        },
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SplitWorkspace": { tier: "frame", role: "the reading column beside the sticky moderation-queue aside", storyId: "frames-splitworkspace-splitworkspace--default" },
    "Typography (heading)": { tier: "atom", role: "the feed heading" },
    "EmptyState (feed)": { tier: "composite", role: "shown when the feed has no posts" },
    "PostCard": {
        tier: "block",
        role: "one post per feed entry, pinned first",
        storyId: "nivoexpert-blocks-community-postcard-postcard--default",
    },
    "SurfaceCard (aside)": { tier: "composite", role: "the moderation-queue summary card" },
    "Chip": { tier: "atom", role: "the pending-review count, next to the aside's label" },
    "EmptyState (aside)": { tier: "composite", role: "the queue summary picture — waiting-for-review, or all caught up" },
    "Button": { tier: "atom", role: "opens the moderation queue — only shown while a review is pending" },
}

/** STATE — the resolved feed with posts, pinned first, and a pending moderation queue. */
export const WithPosts: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CommunityFeed"
                tier="screen"
                leaf="With posts"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render, not a leaf-per-prop map — a page has states to show, not props to enumerate. The page composes the PostCard block for each post rather than rebuilding the post shape inline, and summarizes the moderation queue as a COUNT in a sticky aside rather than inlining the queue itself — the full row-level moderation surface is a separate drawer, opened from the aside's CTA."
                states={[
                    {
                        name: "posts present · 2 pending review",
                        why: "The full feed: the pinned post first (the viewer has liked it), then the newest post — each rendered as the PostCard block. The aside carries a warning-toned count and its all-clear copy switches to the waiting-for-review picture with a \"Review queue\" CTA.",
                        code: "<CommunityFeed posts={posts} onToggleLike={like} pendingModerationCount={2} onOpenModerationQueue={openQueue} labels={labels} postLabels={postLabels} />",
                        render: (
                            <CommunityFeed
                                posts={POSTS}
                                onToggleLike={NOOP}
                                pendingModerationCount={2}
                                onOpenModerationQueue={NOOP}
                                labels={LABELS}
                                postLabels={POST_LABELS}
                            />
                        ),
                    },
                    {
                        name: "posts present · queue clear",
                        why: "`pendingModerationCount: 0` switches the aside to its all-clear picture: a neutral count chip, the shield-check icon, and no CTA — there is nothing to review.",
                        code: "<CommunityFeed posts={posts} pendingModerationCount={0} … />",
                        render: (
                            <CommunityFeed
                                posts={POSTS}
                                onToggleLike={NOOP}
                                pendingModerationCount={0}
                                onOpenModerationQueue={NOOP}
                                labels={LABELS}
                                postLabels={POST_LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the feed's first fetch is in flight; a heading above skeleton post cards, beside a shimmering aside. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CommunityFeed"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render. While the posts query is still in flight the page shows its heading above a fixed count of skeleton post cards — the same PostCard block with isSkeleton — beside a shimmering moderation aside, so the resolved feed drops into the identical layout without a jump."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The feed hasn't resolved yet, so the page renders a shimmering heading, three skeleton post cards mirroring the loaded post shape, and a shimmering moderation-queue card.",
                        code: "<CommunityFeed posts={[]} isSkeleton … />",
                        render: (
                            <CommunityFeed
                                posts={[]}
                                onToggleLike={NOOP}
                                pendingModerationCount={0}
                                onOpenModerationQueue={NOOP}
                                isSkeleton
                                labels={LABELS}
                                postLabels={POST_LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — a community with no posts yet, and nothing to moderate. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CommunityFeed"
                tier="screen"
                leaf="Empty"
                annotate={ANNOTATE}
                reason="A brand-new community: the page doesn't reach for the PostCard block at all — with no posts it renders its own empty state under the heading, inviting the first post, while the aside shows the all-clear picture."
                states={[
                    {
                        name: "posts = [] · queue clear",
                        why: "No posts have been written yet, so the feed shows its intentional empty state rather than a blank page, and there is nothing in the moderation queue either.",
                        code: "<CommunityFeed posts={[]} pendingModerationCount={0} … />",
                        render: (
                            <CommunityFeed
                                posts={[]}
                                onToggleLike={NOOP}
                                pendingModerationCount={0}
                                onOpenModerationQueue={NOOP}
                                labels={LABELS}
                                postLabels={POST_LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
