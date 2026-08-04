import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    PostCard,
    type PostCardLabels,
    type PostCommentView,
    type PostView,
} from "@sb-components/nivoexpert/blocks/community/PostCard/PostCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PostCard` — one community feed post: author identity, title + body, a like toggle
 * with its count, a comment count, and a comments preview. The three pictures —
 * `default`, `liked`, `with-comments` — are DATA, so they are STATES of the single
 * shape. Grounded in the real `PostEntity`, `CommentEntity`, and `ReactionEntity`
 * (`hasLiked` is derived; the like toggle is the real `reactPost` mutation).
 */
const meta: Meta<typeof PostCard> = {
    title: "NivoExpert/Blocks/Community/PostCard/PostCard",
    component: PostCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PostCard>

const LABELS: PostCardLabels = {
    pinnedLabel: "Pinned",
    likeAriaLabel: "Like this post",
    commentsSuffix: "comments",
    moreCommentsSuffix: "more",
}

const BASE_POST: PostView = {
    id: "post-1",
    authorName: "Mai Trang",
    title: "How I priced my first cohort",
    body: "I anchored the cohort near my monthly 1:1 rate and opened an early-bird tier for the first run.\n\nHalf the seats sold in two days — here's the exact breakdown.",
    pinned: true,
    reactionCount: 4,
    commentCount: 0,
    comments: [],
}

const COMMENTS: Array<PostCommentView> = [
    { id: "c-1", authorName: "Hoang Nam", body: "This is gold — did you cap the early-bird count?" },
    { id: "c-2", authorName: "Le Vy", body: "Following. My cohort launches next month." },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the post card and the nested comments preview" },
    UserCell: { tier: "composite", role: "the author identity (avatar + name)" },
    Button: { tier: "atom", role: "the like toggle — active when the viewer has a reaction row" },
    Chip: { tier: "atom", role: "the pinned badge" },
    Typography: { tier: "atom", role: "the title, body, comment count, and each comment" },
}

/** LEAF — one shape; the three pictures are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PostCard"
                tier="block"
                leaf="Post"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                reason="Blocks take no `className`: the block owns the post entity, so its pictures are states of one shape. `hasLiked` is DERIVED from whether the viewing member has a `ReactionEntity` row; the like button toggles it via `reactPost`. The comments preview only appears when the post carries comments."
                states={[
                    {
                        name: "not liked, no comments",
                        why: "The resting state: the author + pinned badge, the title and body, and the like/comment counts. The heart is inactive because the viewer has no reaction row.",
                        code: "<PostCard post={post} hasLiked={false} onToggleLike={like} labels={labels} />",
                        render: <PostCard post={BASE_POST} hasLiked={false} onToggleLike={() => {}} labels={LABELS} />,
                    },
                    {
                        name: "hasLiked = true",
                        why: "The viewer has liked the post, so their `ReactionEntity` row exists — the like button reads active and its count includes their like.",
                        code: "<PostCard {...props} hasLiked />",
                        render: (
                            <PostCard
                                post={{ ...BASE_POST, reactionCount: 13 }}
                                hasLiked
                                onToggleLike={() => {}}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "comments present",
                        why: "The post has comments: a preview of the first two appears in a nested region, with a \"+3 more\" line because `commentCount` (5) exceeds the preview length.",
                        code: "<PostCard post={{ ...post, comments, commentCount: 5 }} … />",
                        render: (
                            <PostCard
                                post={{ ...BASE_POST, commentCount: 5, comments: COMMENTS }}
                                hasLiked={false}
                                onToggleLike={() => {}}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The feed's first fetch is in flight, so the same post card renders with the author, title, body and like/comment counts all shimmering — matching the loaded post so the feed does not jump when the posts land.",
                        code: "<PostCard {...props} isSkeleton />",
                        render: (
                            <PostCard
                                post={BASE_POST}
                                hasLiked={false}
                                onToggleLike={() => {}}
                                isSkeleton
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
