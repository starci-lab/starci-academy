import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    CommunityPreviewCard,
    type CommunityPreviewCardLabels,
    type CommunityPreviewPost,
} from "@sb-components/nivoexpert/blocks/landing/CommunityPreviewCard/CommunityPreviewCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CommunityPreviewCard` — the landing's honest community proof: the real
 * latest/pinned post, the "be the first" sub-state when the community is on
 * but genuinely has zero posts, or (per the caller, not this component) not
 * mounted at all when `Brand.communityEnabled` is false. Grounded in the real
 * `Post` shape (`id`/`authorName`/`title`/`body`/`pinned`) — no reaction or
 * student count, since `expert-api` exposes none. Built on the shared HeroUI
 * atom system (`SurfaceCard`/`Avatar`/`Chip`/`Typography`/`Stack`), re-themed
 * per tenant through `apps/expert/app/globals.css`'s `--nivo-*` -> HeroUI
 * CSS-var bridge — see the component's own file header for the full
 * contract.
 */
const meta: Meta<typeof CommunityPreviewCard> = {
    title: "NivoExpert/Blocks/Landing/CommunityPreviewCard/CommunityPreviewCard",
    component: CommunityPreviewCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CommunityPreviewCard>

const LABELS_POPULATED: CommunityPreviewCardLabels = {
    label: "Community",
    sourceCaption: "Latest pinned post",
    pinnedLabel: "Pinned",
    emptyTitle: "No posts yet",
    emptyDescription: "Nobody has posted yet. Join and be the first to start the conversation.",
    onwardLabel: "Open the community",
}

const LABELS_EMPTY: CommunityPreviewCardLabels = {
    ...LABELS_POPULATED,
    sourceCaption: "Just opened",
    onwardLabel: "Be the first",
}

const WELCOME_POST: CommunityPreviewPost = {
    id: "post-welcome",
    authorName: "Alex Rivera",
    title: "Welcome",
    body: "Welcome to the community! Post your first question here — I read every one.",
    pinned: true,
}

const REGULAR_POST: CommunityPreviewPost = {
    id: "post-recent",
    authorName: "Jamie Chen",
    title: "How I validated my first paying customer",
    body: "Posted my landing page here last week and got three replies with real feedback before I wrote a line of code.",
    pinned: false,
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the outer trust card, plus a nested surface around the quoted post" },
    Avatar: { tier: "atom", role: "the community identity glyph — forced to a single initial via fallback=\"initials\"" },
    Chip: { tier: "atom", role: "the pinned marker, shown only when the post is pinned" },
    Typography: { tier: "atom", role: "the section label, caption, and post author/title/body" },
    Button: { tier: "atom", role: "the onward action into /community" },
}

/** LEAF — one shape; `post = null | Post` and `isSkeleton` are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CommunityPreviewCard"
                tier="block"
                leaf="Post"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                reason="`post` is DATA (`posts()[0]` — `PostsResolver.execute()` is public and unguarded), never a stylistic choice: `null` and a real post are two different real pictures, not a loading/empty toggle this block invents. `SeedService.seedCommunityWelcome()` seeds exactly one real pinned welcome post for a brand-new tenant with community on and a configured welcome message, so the populated state below IS that seeded post, not fixture prose. Whether this card renders AT ALL is the caller's decision (`Brand.communityEnabled`) — a disabled feature is not the same design problem as an empty one, so this component carries no `enabled` prop of its own. Built on the shared HeroUI atom system, re-themed per tenant through the `--nivo-*` -> HeroUI CSS-var bridge (`apps/expert/app/globals.css`) — the same accent/surface/foreground tokens the plain-CSS version read directly, now resolved one layer earlier. The onward action is a callback (`onOpenCommunity`), not an `href` — the shared `Button` atom has no link variant, the same convention `CourseOfferCard`'s `onOpenCourse` uses."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The feed's own first fetch is in flight: identity, caption, and the post block all shimmer at the same geometry as the loaded shape, so nothing reflows once the post lands.",
                        code: "<CommunityPreviewCard post={null} labels={labels} onOpenCommunity={onOpenCommunity} isSkeleton />",
                        render: <CommunityPreviewCard post={null} labels={LABELS_POPULATED} onOpenCommunity={() => {}} isSkeleton />,
                    },
                    {
                        name: "post = null (community on, zero posts)",
                        why: "The community is enabled but genuinely has no posts yet — an honest 'be the first' sub-state, never a hidden/broken card. The onward action still opens the community, so this is not a dead end either.",
                        code: "<CommunityPreviewCard post={null} labels={emptyLabels} onOpenCommunity={onOpenCommunity} />",
                        render: <CommunityPreviewCard post={null} labels={LABELS_EMPTY} onOpenCommunity={() => {}} />,
                    },
                    {
                        name: "pinned post (the seeded welcome post)",
                        why: "The real hook this card exists for: `SeedService.seedCommunityWelcome()`'s seeded pinned welcome post, shown as-is — the pinned chip appears because `post.pinned` is true, and no reaction/comment/student count anywhere on the card, because `expert-api`'s `Post` carries none.",
                        code: "<CommunityPreviewCard post={welcomePost} labels={labels} onOpenCommunity={onOpenCommunity} />",
                        render: <CommunityPreviewCard post={WELCOME_POST} labels={LABELS_POPULATED} onOpenCommunity={() => {}} />,
                    },
                    {
                        name: "unpinned post",
                        why: "`post.pinned` is a real boolean on `Post`, not always true — a later, non-pinned post renders the identical shape with the pinned chip simply omitted.",
                        code: "<CommunityPreviewCard post={regularPost} labels={labels} onOpenCommunity={onOpenCommunity} />",
                        render: <CommunityPreviewCard post={REGULAR_POST} labels={LABELS_POPULATED} onOpenCommunity={() => {}} />,
                    },
                ]}
            />
        </div>
    ),
}
