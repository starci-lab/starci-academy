import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import { ActivityFeed, ActivityType, type QueryMyFeedItemData } from "./ActivityFeed"
import { ReactionType } from "../ReactionBar/ReactionBar"
import { SurfaceListCard, SurfaceListCardItem } from "../../cards/SurfaceListCard/SurfaceListCard"
import { EmptyState } from "../../feedback/EmptyState/EmptyState"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — the shared activity feed: rows grouped under relative day headers, each
 * row = an avatar-with-type-badge + a clickable actor/action/target sentence +
 * relative time + a reaction bar. Props-only; the owning FEATURE fetches items and
 * supplies the route resolver.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — the
 * data leaves share one FEED_PARTS composition, while `Rỗng` (EmptyState from the
 * feature) and `Đang tải` (skeleton mirror) each swap composition. There is no
 * separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof ActivityFeed> = {
    title: "Block/Feed/ActivityFeed",
    component: ActivityFeed,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ActivityFeed>

/** Plain canvas wrapping each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

/** No-op route resolver: every entity routable except a null id. */
const resolveDemo = (globalId: string | null | undefined): (() => void) | undefined =>
    globalId ? () => {} : undefined

const richItems: Array<QueryMyFeedItemData> = [
    { id: "activity-1", actorGlobalId: "user-minhanh", actorUsername: "minhanh_dev", actorAvatar: "https://i.pravatar.cc/150?img=12", type: ActivityType.LessonRead, targetGlobalId: "lesson-server-components", targetLabel: "Bài 5: Server Components", at: "2026-07-21T09:15:00.000Z", reactionCount: 3, myReaction: null, isMine: false },
    { id: "activity-2", actorGlobalId: "user-duyanh", actorUsername: "duyanh_code", actorAvatar: "https://i.pravatar.cc/150?img=33", type: ActivityType.ChallengePassed, targetGlobalId: "challenge-two-sum", targetLabel: "Challenge: Two Sum", at: "2026-07-21T07:40:00.000Z", reactionCount: 12, myReaction: ReactionType.Love, isMine: false },
    { id: "activity-3", actorGlobalId: "user-duyanh", actorUsername: "duyanh_code", actorAvatar: "https://i.pravatar.cc/150?img=33", type: ActivityType.MilestonePassed, targetGlobalId: "milestone-3", targetLabel: "Milestone 3: Auth flow", at: "2026-07-20T16:00:00.000Z", reactionCount: 5, myReaction: null, isMine: false },
    { id: "activity-4", actorGlobalId: "user-duyanh", actorUsername: "duyanh_code", actorAvatar: "https://i.pravatar.cc/150?img=33", type: ActivityType.MilestonePassed, targetGlobalId: "milestone-4", targetLabel: "Milestone 4: Payment flow", at: "2026-07-20T15:30:00.000Z", reactionCount: 2, myReaction: null, isMine: false },
    { id: "activity-5", actorGlobalId: "user-duyanh", actorUsername: "duyanh_code", actorAvatar: "https://i.pravatar.cc/150?img=33", type: ActivityType.MilestonePassed, targetGlobalId: "milestone-5", targetLabel: "Milestone 5: Deployment", at: "2026-07-20T15:00:00.000Z", reactionCount: 0, myReaction: null, isMine: false },
    { id: "activity-6", actorGlobalId: "user-lan", actorUsername: "lan_nguyen", actorAvatar: "https://i.pravatar.cc/150?img=45", type: ActivityType.UserFollowed, targetGlobalId: "user-hoang", targetLabel: "hoang_pham", at: "2026-07-20T10:20:00.000Z", reactionCount: 0, myReaction: null, isMine: false },
    { id: "activity-7", actorGlobalId: "user-lan", actorUsername: "lan_nguyen", actorAvatar: "https://i.pravatar.cc/150?img=45", type: ActivityType.DiscussionCommented, targetGlobalId: null, targetLabel: null, at: "2026-07-20T09:00:00.000Z", reactionCount: 1, myReaction: null, isMine: false },
    { id: "activity-8", actorGlobalId: "user-minhanh", actorUsername: "minhanh_dev", actorAvatar: "https://i.pravatar.cc/150?img=12", type: ActivityType.CourseEnrolled, targetGlobalId: "course-fullstack", targetLabel: "Fullstack Mastery", at: "2026-07-10T08:00:00.000Z", reactionCount: 4, myReaction: ReactionType.Like, isMine: false },
]

const singleItem: Array<QueryMyFeedItemData> = [richItems[0]]

const ownActivityItems: Array<QueryMyFeedItemData> = [
    { id: "activity-own", actorGlobalId: "user-viewer", actorUsername: "ban", actorAvatar: "https://i.pravatar.cc/150?img=8", type: ActivityType.AiLabPassed, targetGlobalId: "ai-lab-rag", targetLabel: "AI Lab: RAG from scratch", at: "2026-07-21T11:00:00.000Z", reactionCount: 6, myReaction: null, isMine: true },
]

/** Wrapper owning local state so reacting updates the count/myReaction, as in the real feed. */
const Controlled = () => {
    const [items, setItems] = useState<Array<QueryMyFeedItemData>>(richItems)
    const onReact = (activityId: string, type: ReactionType | null) => {
        setItems((previous) => previous.map((item) => {
            if (item.id !== activityId) {
                return item
            }
            const delta = type ? (item.myReaction ? 0 : 1) : -1
            return { ...item, reactionCount: item.reactionCount + delta, myReaction: type }
        }))
    }
    return <ActivityFeed items={items} onResolve={resolveDemo} onReact={onReact} />
}

// The real feed composition, mirroring the DOM ActivityFeed renders per day:
// DayHeaderSection (eyebrow + frame) → SurfaceListCard → SurfaceListCardItem →
// FeedItem, whose sentence Typography HOLDS the EntityLinks and whose footer is the
// ReactionBar. Every data/variant leaf shares this composition.
const FEED_PARTS: Array<AnatomyNode> = [
    {
        name: "DayHeaderSection",
        tier: "design",
        role: "khung mỗi ngày — eyebrow ngày (Hôm nay/Hôm qua/ngày cũ) trên nội dung frameless (mirror LabeledCard, chưa port)",
        children: [
            {
                name: "SurfaceListCard",
                tier: "primitive",
                role: "surface gom các hàng của một ngày (shadow, hoặc viền khi bordered)",
                children: [
                    {
                        name: "SurfaceListCardItem",
                        tier: "primitive",
                        role: "ô chứa một hàng hoạt động, kẻ ngăn giữa các hàng",
                        children: [
                            {
                                name: "FeedItem",
                                tier: "design",
                                role: "bố cục từng hàng (leading · câu · thời gian · footer)",
                                children: [
                                    {
                                        name: "ActivityAvatar",
                                        tier: "design",
                                        role: "leading — avatar + badge loại hoạt động",
                                        children: [
                                            { name: "UserAvatar", tier: "primitive", role: "avatar nền (ảnh/initials)" },
                                        ],
                                    },
                                    {
                                        name: "Typography",
                                        tier: "primitive",
                                        role: "câu actor/hành động/target (body-sm)",
                                        children: [
                                            { name: "EntityLink", tier: "design", role: "actor + target bấm được, dựng trong câu (2 thực thể)" },
                                        ],
                                    },
                                    { name: "Typography", tier: "primitive", role: "thời gian tương đối (body-xs, muted)" },
                                    { name: "ReactionBar", tier: "design", role: "footer — thả cảm xúc mỗi hàng" },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
]

// Empty leaf: the block itself has no empty slot (items=[] renders nothing) — the
// owning FEATURE renders an EmptyState in the feed's place. Here size="default", so
// EmptyState stacks a title Typography + a muted description Typography.
const EMPTY_PARTS: Array<AnatomyNode> = [
    {
        name: "EmptyState",
        tier: "primitive",
        role: 'trạng thái rỗng do FEATURE dựng ("Chưa có hoạt động nào")',
        state: "empty",
        children: [
            { name: "Typography", tier: "primitive", role: "tiêu đề rỗng (weight medium)" },
            { name: "Typography", tier: "primitive", role: "mô tả phụ (body-xs, muted)" },
        ],
    },
]

// Loading leaf: a skeleton MIRROR of the real layout — a day-header eyebrow over a
// SurfaceListCard whose SurfaceListCardItem rows mirror each FeedItem (avatar circle
// + sentence bar + timestamp bar + footer pill). All parts are Skeleton primitives.
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton.Typography", tier: "primitive", role: "eyebrow ngày (mirror DayHeaderSection)", state: "skeleton" },
    {
        name: "SurfaceListCard",
        tier: "primitive",
        role: "surface gom hàng (mirror)",
        state: "skeleton",
        children: [
            {
                name: "SurfaceListCardItem",
                tier: "primitive",
                role: "ô một hàng (mirror), lặp 3 lần",
                state: "skeleton",
                children: [
                    { name: "Skeleton.Avatar", tier: "primitive", role: "mirror ActivityAvatar/UserAvatar" },
                    { name: "Skeleton.Typography", tier: "primitive", role: "mirror câu (body-sm)" },
                    { name: "Skeleton.Typography", tier: "primitive", role: "mirror thời gian (body-xs)" },
                    { name: "Skeleton", tier: "primitive", role: "mirror footer ReactionBar (pill)" },
                ],
            },
        ],
    },
]

/** ONE ITEM — a single-row feed; the full composition on the smallest input. */
export const SingleItem: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ActivityFeed"
                tier="block"
                leaf="Một hoạt động"
                parts={FEED_PARTS}
                note="Một hàng duy nhất, nhưng CÙNG composition với feed nhiều ngày."
            >
                <div className="w-full max-w-xl"><ActivityFeed items={singleItem} onResolve={resolveDemo} onReact={() => {}} /></div>
            </BlockAnatomy>,
        ),
}

/** RICH — the full feed across multiple days, with milestone roll-up + null-target fallback. */
export const RichMultiDay: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ActivityFeed"
                tier="block"
                leaf="Nhiều ngày"
                parts={FEED_PARTS}
                reason="Feed hoạt động dùng chung cho trang chủ và tab Hoạt động: mỗi hàng là avatar-kèm-badge + câu actor/hành động/target + thời gian, gộp theo ngày (Hôm nay/Hôm qua/ngày cũ). Gộp milestone liên tiếp thành một dòng, null target rơi về câu generic — không để trống. Props-only nên một chỗ dựng, nhiều feature dùng."
            >
                <div className="w-full max-w-xl"><ActivityFeed items={richItems} onResolve={resolveDemo} onReact={() => {}} /></div>
            </BlockAnatomy>,
        ),
}

/** OWN ACTIVITY — the viewer's own row: ReactionBar auto-suppresses (can't react to yourself). */
export const OwnActivity: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ActivityFeed"
                tier="block"
                leaf="Hoạt động của bạn"
                parts={FEED_PARTS}
                note="Hàng của chính bạn (isMine) → ReactionBar chuyển chỉ-đọc, nhưng vẫn đủ các part."
            >
                <div className="w-full max-w-xl"><ActivityFeed items={ownActivityItems} onResolve={resolveDemo} onReact={() => {}} /></div>
            </BlockAnatomy>,
        ),
}

/** READ-ONLY — no `onReact` → every ReactionBar is display-only. Same composition. */
export const ReadOnly: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ActivityFeed"
                tier="block"
                leaf="Chỉ đọc"
                parts={FEED_PARTS}
                note="Bỏ onReact → toàn bộ ReactionBar chỉ hiển thị số, composition không đổi."
            >
                <div className="w-full max-w-xl"><ActivityFeed items={richItems} onResolve={resolveDemo} /></div>
            </BlockAnatomy>,
        ),
}

/** BORDERED — the per-day SurfaceListCard uses a border instead of a shadow (nested-surface). */
export const Bordered: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ActivityFeed"
                tier="block"
                leaf="Viền"
                parts={FEED_PARTS}
                note="SurfaceListCard đổi shadow → viền khi feed lồng trong surface khác; cùng các part."
            >
                <div className="w-full max-w-xl"><ActivityFeed items={singleItem} onResolve={resolveDemo} onReact={() => {}} bordered /></div>
            </BlockAnatomy>,
        ),
}

/** INTERACTIVE — a stateful wrapper so reacting updates the count/myReaction live. */
export const InteractiveReactions: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ActivityFeed"
                tier="block"
                leaf="Thả cảm xúc"
                parts={FEED_PARTS}
                note="Wrapper cầm state → bấm ReactionBar cập nhật count/myReaction; composition như leaf dữ liệu."
            >
                <div className="w-full max-w-xl"><Controlled /></div>
            </BlockAnatomy>,
        ),
}

/**
 * Empty: `items=[]` renders nothing (no empty-state slot on the block). A local
 * {@link EmptyState} shown alongside is what the owning FEATURE would render in the
 * feed's place when there's no activity.
 */
export const Empty: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ActivityFeed"
                tier="block"
                leaf="Rỗng"
                parts={EMPTY_PARTS}
                note="Block không có slot rỗng — items=[] render trống; FEATURE dựng EmptyState thay chỗ."
            >
                <div className="w-full max-w-xl">
                    <EmptyState title="Chưa có hoạt động nào" description="Hoạt động của bạn và người bạn theo dõi sẽ xuất hiện ở đây." />
                    <ActivityFeed items={[]} onResolve={resolveDemo} onReact={() => {}} />
                </div>
            </BlockAnatomy>,
        ),
}

/**
 * SkeletonLoading MIRRORS the real layout: a subtle day-header eyebrow over a
 * {@link SurfaceListCard} of rows, each row = an avatar circle + two text bars +
 * a footer bar, matching {@link ActivityFeed}'s FeedItem structure.
 */
export const SkeletonLoading: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ActivityFeed"
                tier="block"
                leaf="Đang tải"
                parts={SKELETON_PARTS}
                note="Skeleton mirror giữ đúng footprint feed thật (eyebrow ngày + surface hàng), không có part thật."
            >
                <div className="flex w-full max-w-xl flex-col gap-6">
                    <section className="flex flex-col gap-2">
                        <Skeleton.Typography type="body-xs" width="1/4" />
                        <SurfaceListCard>
                            {[0, 1, 2].map((row) => (
                                <SurfaceListCardItem key={row}>
                                    <div className="flex items-start gap-2">
                                        <Skeleton.Avatar size="sm" />
                                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                                            <div className="flex flex-col gap-1">
                                                <Skeleton.Typography type="body-sm" width="3/4" />
                                                <Skeleton.Typography type="body-xs" width="1/4" />
                                            </div>
                                            <Skeleton className="h-4 w-12 rounded-full" />
                                        </div>
                                    </div>
                                </SurfaceListCardItem>
                            ))}
                        </SurfaceListCard>
                    </section>
                </div>
            </BlockAnatomy>,
        ),
}
