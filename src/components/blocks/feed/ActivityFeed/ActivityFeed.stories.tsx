import type { Meta, StoryObj } from "@storybook/nextjs"
import { ActivityFeed } from "./index"
import { ActivityType } from "@/modules/api/graphql/queries/types/my-feed"
import type { QueryMyFeedItemData } from "@/modules/api/graphql/queries/types/my-feed"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"

const meta: Meta<typeof ActivityFeed> = {
    title: "Blocks/Feed/ActivityFeed",
    component: ActivityFeed,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ActivityFeed>

/** Mảng item mẫu hôm nay: trải đủ các loại hoạt động, có avatar lẫn không. */
const todayItems: Array<QueryMyFeedItemData> = [
    {
        id: "act-1",
        actorGlobalId: "user:minh",
        actorUsername: "minhtran",
        actorAvatar: "https://i.pravatar.cc/80?img=12",
        type: ActivityType.ChallengePassed,
        targetGlobalId: "challenge:rest-api",
        targetLabel: "Xây dựng REST API",
        at: "2026-07-15T02:30:00.000Z",
        reactionCount: 4,
        myReaction: null,
        isMine: false,
    },
    {
        id: "act-2",
        actorGlobalId: "user:lan",
        actorUsername: "lan.nguyen",
        actorAvatar: "https://i.pravatar.cc/80?img=32",
        type: ActivityType.CourseEnrolled,
        targetGlobalId: "course:system-design",
        targetLabel: "System Design Mastery",
        at: "2026-07-15T01:10:00.000Z",
        reactionCount: 1,
        myReaction: ReactionType.Like,
        isMine: false,
    },
    {
        id: "act-3",
        actorGlobalId: "user:khoa",
        actorUsername: "khoa.le",
        actorAvatar: null,
        type: ActivityType.UserFollowed,
        targetGlobalId: "user:minh",
        targetLabel: "minhtran",
        at: "2026-07-15T00:45:00.000Z",
        reactionCount: 0,
        myReaction: null,
        isMine: false,
    },
]

/** 3 lần vượt milestone liên tiếp cùng actor trong hôm qua, để minh hoạ roll-up. */
const groupedYesterdayItems: Array<QueryMyFeedItemData> = [
    {
        id: "act-4",
        actorGlobalId: "user:hai",
        actorUsername: "hai.pham",
        actorAvatar: "https://i.pravatar.cc/80?img=5",
        type: ActivityType.MilestonePassed,
        targetGlobalId: "milestone:auth",
        targetLabel: "Xác thực & phân quyền",
        at: "2026-07-14T09:00:00.000Z",
        reactionCount: 0,
        myReaction: null,
        isMine: false,
    },
    {
        id: "act-5",
        actorGlobalId: "user:hai",
        actorUsername: "hai.pham",
        actorAvatar: "https://i.pravatar.cc/80?img=5",
        type: ActivityType.MilestonePassed,
        targetGlobalId: "milestone:cache",
        targetLabel: "Tối ưu cache",
        at: "2026-07-14T08:30:00.000Z",
        reactionCount: 0,
        myReaction: null,
        isMine: false,
    },
    {
        id: "act-6",
        actorGlobalId: "user:hai",
        actorUsername: "hai.pham",
        actorAvatar: "https://i.pravatar.cc/80?img=5",
        type: ActivityType.MilestonePassed,
        targetGlobalId: "milestone:deploy",
        targetLabel: "Triển khai CI/CD",
        at: "2026-07-14T08:00:00.000Z",
        reactionCount: 2,
        myReaction: null,
        isMine: false,
    },
]

/** Bài học đã bị xoá nên không còn target — phải rơi vào câu danh từ chung, không để trống. */
const noTargetItems: Array<QueryMyFeedItemData> = [
    {
        id: "act-7",
        actorGlobalId: "user:an",
        actorUsername: "an.vu",
        actorAvatar: "https://i.pravatar.cc/80?img=48",
        type: ActivityType.LessonRead,
        targetGlobalId: null,
        targetLabel: null,
        at: "2026-07-15T03:00:00.000Z",
        reactionCount: 0,
        myReaction: null,
        isMine: false,
    },
]

/** Hoạt động của chính người xem — không được hiện nút thả cảm xúc trên item này. */
const mineItems: Array<QueryMyFeedItemData> = [
    {
        id: "act-8",
        actorGlobalId: "user:me",
        actorUsername: "toi",
        actorAvatar: "https://i.pravatar.cc/80?img=68",
        type: ActivityType.CodingSolved,
        targetGlobalId: "problem:two-sum",
        targetLabel: "Two Sum",
        at: "2026-07-15T04:15:00.000Z",
        reactionCount: 0,
        myReaction: null,
        isMine: true,
    },
    ...todayItems,
]

/** Dùng khi hiển thị dòng thời gian hoạt động đầy đủ, có thể tương tác thả cảm xúc và bấm vào actor/target để điều hướng. */
export const Default: Story = {
    parameters: { usage: "Dùng khi hiển thị dòng thời gian hoạt động đầy đủ, có thể tương tác thả cảm xúc và bấm vào actor/target để điều hướng." },
    render: () => (
        <div className="w-[420px]">
            <ActivityFeed
                items={[...todayItems, ...groupedYesterdayItems]}
                onResolve={(globalId) => (globalId ? () => {} : undefined)}
                onReact={() => {}}
            />
        </div>
    ),
}

/** Dùng khi nhiều lần vượt milestone liên tiếp của cùng một người cần gộp lại thành một dòng thay vì lặp lại rời rạc. */
export const GroupedMilestones: Story = {
    parameters: { usage: "Dùng khi nhiều lần vượt milestone liên tiếp của cùng một người cần gộp lại thành một dòng thay vì lặp lại rời rạc." },
    render: () => (
        <div className="w-[420px]">
            <ActivityFeed
                items={groupedYesterdayItems}
                onResolve={(globalId) => (globalId ? () => {} : undefined)}
                onReact={() => {}}
            />
        </div>
    ),
}

/** Dùng khi target đã bị xoá hoặc không xác định — feed vẫn phải đọc trôi bằng câu danh từ chung thay vì để trống. */
export const NoTarget: Story = {
    parameters: { usage: "Dùng khi target đã bị xoá hoặc không xác định — feed vẫn phải đọc trôi bằng câu danh từ chung thay vì để trống." },
    render: () => (
        <div className="w-[420px]">
            <ActivityFeed
                items={noTargetItems}
                onResolve={(globalId) => (globalId ? () => {} : undefined)}
                onReact={() => {}}
            />
        </div>
    ),
}

/** Dùng khi hoạt động của chính người xem xuất hiện trong feed — không cho tự thả cảm xúc lên hoạt động của mình. */
export const OwnActivity: Story = {
    parameters: { usage: "Dùng khi hoạt động của chính người xem xuất hiện trong feed — không cho tự thả cảm xúc lên hoạt động của mình." },
    render: () => (
        <div className="w-[420px]">
            <ActivityFeed
                items={mineItems}
                onResolve={(globalId) => (globalId ? () => {} : undefined)}
                onReact={() => {}}
            />
        </div>
    ),
}

/** Dùng khi caller không truyền onReact — feed chỉ đọc, không có nút thả cảm xúc trên bất kỳ dòng nào. */
export const ReadOnly: Story = {
    parameters: { usage: "Dùng khi caller không truyền onReact — feed chỉ đọc, không có nút thả cảm xúc trên bất kỳ dòng nào." },
    render: () => (
        <div className="w-[420px]">
            <ActivityFeed
                items={todayItems}
                onResolve={(globalId) => (globalId ? () => {} : undefined)}
            />
        </div>
    ),
}
