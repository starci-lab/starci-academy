import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    PostModerationCard,
    type PostModerationCardLabels,
    type PostModerationView,
} from "@sb-components/nivoexpert/blocks/community/PostModerationCard/PostModerationCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PostModerationCard` — one community post as the expert's moderation queue
 * shows it: identity, title + body, static like/comment counts, and the
 * pin/hide controls the public `PostCard` has no room for. The three
 * pictures — `published, not pinned`, `published, pinned`, `hidden` — are
 * DATA, so they are STATES of the single shape. Grounded in the real
 * `PostEntity.pinned` and `PostEntity.status` (`"published" | "removed"`) —
 * the FE has no `pinPost`/`hidePost` mutation yet.
 */
const meta: Meta<typeof PostModerationCard> = {
    title: "NivoExpert/Blocks/Community/PostModerationCard/PostModerationCard",
    component: PostModerationCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PostModerationCard>

const LABELS: PostModerationCardLabels = {
    pinnedLabel: "Pinned",
    hiddenLabel: "Hidden",
    pinLabel: "Pin",
    unpinLabel: "Unpin",
    hideLabel: "Hide",
    likesSuffix: "likes",
    commentsSuffix: "comments",
}

const BASE_POST: PostModerationView = {
    id: "post-1",
    authorName: "An Nguyen",
    title: "Welcome",
    body: "Welcome to the student community! Introduce yourself below.",
    pinned: false,
    status: "published",
    reactionCount: 12,
    commentCount: 3,
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the moderation card face" },
    UserCell: { tier: "composite", role: "the author identity (avatar + name)" },
    Typography: { tier: "atom", role: "the title, body, and the static like/comment counts" },
    Chip: { tier: "atom", role: "the pinned badge and, once hidden, the hidden-status badge" },
    Button: { tier: "atom", role: "the pin/unpin and hide moderation actions" },
}

/** LEAF — one shape; `pinned`, `status`, and `isBusy` are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PostModerationCard"
                tier="block"
                leaf="Moderation row"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                reason="Blocks take no `className`: the card owns the post entity, so its pictures are states of one shape. This is a `PostCard` VARIANT, not a reuse — the admin never likes a post (the counts render as static text) and never needs the comments preview, so the moderation row replaces both with pin/hide controls that map onto `PostEntity.pinned`/`PostEntity.status`. There is no un-hide control: no restore mutation is grounded anywhere in the app, so a hidden row shows a status chip instead of inventing one."
                states={[
                    {
                        name: "published, not pinned",
                        why: "The resting state: identity, title, body, static like/comment counts, and the pin + hide actions a moderator can take.",
                        code: "<PostModerationCard post={post} onTogglePin={pin} onHide={hide} labels={labels} />",
                        render: <PostModerationCard post={BASE_POST} onTogglePin={NOOP} onHide={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "published, pinned",
                        why: "The post is pinned to the top of the public feed: a pinned chip rides beside the author, and the pin button reads \"Unpin\".",
                        code: "<PostModerationCard post={{ ...post, pinned: true }} … />",
                        render: (
                            <PostModerationCard
                                post={{ ...BASE_POST, pinned: true }}
                                onTogglePin={NOOP}
                                onHide={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "hidden (status = removed)",
                        why: "The moderator already hid this post: it no longer shows on the public feed, and the action row collapses to a \"Hidden\" status chip — there is no un-hide mutation to offer.",
                        code: "<PostModerationCard post={{ ...post, status: \"removed\" }} … />",
                        render: (
                            <PostModerationCard
                                post={{ ...BASE_POST, status: "removed" }}
                                onTogglePin={NOOP}
                                onHide={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isBusy = true",
                        why: "This row's own pin/hide mutation is in flight: both controls lock so a double-click cannot fire the mutation twice.",
                        code: "<PostModerationCard {...props} isBusy />",
                        render: <PostModerationCard post={BASE_POST} onTogglePin={NOOP} onHide={NOOP} isBusy labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The moderation queue's own first fetch is in flight, so the same card renders with every content node shimmering — matching the loaded post so the queue does not jump when the posts land.",
                        code: "<PostModerationCard {...props} isSkeleton />",
                        render: (
                            <PostModerationCard post={BASE_POST} onTogglePin={NOOP} onHide={NOOP} isSkeleton labels={LABELS} />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
