import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import { ActivityFeed, ActivityType, type QueryMyFeedItemData } from "./ActivityFeed"
import { ReactionType } from "../ReactionBar/ReactionBar"
import { SurfaceListCard, SurfaceListCardItem } from "../../cards/SurfaceListCard/SurfaceListCard"
import { EmptyState } from "../../feedback/EmptyState/EmptyState"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { blockShell } from "../../../block-anatomy"

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

const ANATOMY = {
    primitives: [
        { name: "ActivityAvatar", role: "leading mỗi hàng — avatar + badge loại hoạt động" },
        { name: "EntityLink", role: "actor + target bấm được trong câu" },
        { name: "FeedItem", role: "bố cục từng hàng hoạt động" },
        { name: "ReactionBar", role: "thả cảm xúc mỗi hàng" },
        { name: "SurfaceListCard", role: "surface gom các hàng của một ngày" },
    ],
    reason:
        "Feed hoạt động dùng chung cho trang chủ và tab Hoạt động: mỗi hàng là avatar-kèm-badge + câu actor/hành động/target + thời gian, gộp theo ngày (Hôm nay/Hôm qua/ngày cũ). Gộp milestone liên tiếp thành một dòng, null target rơi về câu generic — không để trống. Props-only nên một chỗ dựng, nhiều feature dùng.",
}

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

export const SingleItem: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><ActivityFeed items={singleItem} onResolve={resolveDemo} onReact={() => {}} /></div>, ANATOMY),
}

export const RichMultiDay: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><ActivityFeed items={richItems} onResolve={resolveDemo} onReact={() => {}} /></div>, ANATOMY),
}

export const OwnActivity: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><ActivityFeed items={ownActivityItems} onResolve={resolveDemo} onReact={() => {}} /></div>, ANATOMY),
}

export const ReadOnly: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><ActivityFeed items={richItems} onResolve={resolveDemo} /></div>, ANATOMY),
}

export const Bordered: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><ActivityFeed items={singleItem} onResolve={resolveDemo} onReact={() => {}} bordered /></div>, ANATOMY),
}

export const InteractiveReactions: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><Controlled /></div>, ANATOMY),
}

/**
 * Empty: `items=[]` renders nothing (no empty-state slot on the block). A local
 * {@link EmptyState} shown alongside is what the owning FEATURE would render in the
 * feed's place when there's no activity.
 */
export const Empty: Story = {
    render: () =>
        blockShell(
            <div className="w-full max-w-xl">
                <EmptyState title="Chưa có hoạt động nào" description="Hoạt động của bạn và người bạn theo dõi sẽ xuất hiện ở đây." />
                <ActivityFeed items={[]} onResolve={resolveDemo} onReact={() => {}} />
            </div>,
            ANATOMY,
        ),
}

/**
 * SkeletonLoading MIRRORS the real layout: a subtle day-header eyebrow over a
 * {@link SurfaceListCard} of rows, each row = an avatar circle + two text bars +
 * a footer bar, matching {@link ActivityFeed}'s FeedItem structure.
 */
export const SkeletonLoading: Story = {
    render: () =>
        blockShell(
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
            </div>,
            ANATOMY,
        ),
}
