import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ActivityFeed } from "@/components/blocks/feed/ActivityFeed"
import { ActivityType } from "@/modules/api/graphql/queries/types/my-feed"
import type { QueryMyFeedItemData } from "@/modules/api/graphql/queries/types/my-feed"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ActivityFeed> = {
    title: "Legacy/Blocks/Feed/ActivityFeed",
    component: ActivityFeed,
}
export default meta
type Story = StoryObj<typeof ActivityFeed>

/** No-op route resolver: pretends every entity is routable except the one with a null id. */
const resolveDemo = (globalId: string | null | undefined): (() => void) | undefined =>
    globalId ? () => {} : undefined

/** One activity today, one milestone roll-up + follow yesterday, one older enrollment. */
const richItems: Array<QueryMyFeedItemData> = [
    {
        id: "activity-1",
        actorGlobalId: "user-minhanh",
        actorUsername: "minhanh_dev",
        actorAvatar: "https://i.pravatar.cc/150?img=12",
        type: ActivityType.LessonRead,
        targetGlobalId: "lesson-server-components",
        targetLabel: "Bài 5: Server Components",
        at: "2026-07-21T09:15:00.000Z",
        reactionCount: 3,
        myReaction: null,
        isMine: false,
    },
    {
        id: "activity-2",
        actorGlobalId: "user-duyanh",
        actorUsername: "duyanh_code",
        actorAvatar: "https://i.pravatar.cc/150?img=33",
        type: ActivityType.ChallengePassed,
        targetGlobalId: "challenge-two-sum",
        targetLabel: "Challenge: Two Sum",
        at: "2026-07-21T07:40:00.000Z",
        reactionCount: 12,
        myReaction: ReactionType.Love,
        isMine: false,
    },
    {
        id: "activity-3",
        actorGlobalId: "user-duyanh",
        actorUsername: "duyanh_code",
        actorAvatar: "https://i.pravatar.cc/150?img=33",
        type: ActivityType.MilestonePassed,
        targetGlobalId: "milestone-3",
        targetLabel: "Milestone 3: Auth flow",
        at: "2026-07-20T16:00:00.000Z",
        reactionCount: 5,
        myReaction: null,
        isMine: false,
    },
    {
        id: "activity-4",
        actorGlobalId: "user-duyanh",
        actorUsername: "duyanh_code",
        actorAvatar: "https://i.pravatar.cc/150?img=33",
        type: ActivityType.MilestonePassed,
        targetGlobalId: "milestone-4",
        targetLabel: "Milestone 4: Payment flow",
        at: "2026-07-20T15:30:00.000Z",
        reactionCount: 2,
        myReaction: null,
        isMine: false,
    },
    {
        id: "activity-5",
        actorGlobalId: "user-duyanh",
        actorUsername: "duyanh_code",
        actorAvatar: "https://i.pravatar.cc/150?img=33",
        type: ActivityType.MilestonePassed,
        targetGlobalId: "milestone-5",
        targetLabel: "Milestone 5: Deployment",
        at: "2026-07-20T15:00:00.000Z",
        reactionCount: 0,
        myReaction: null,
        isMine: false,
    },
    {
        id: "activity-6",
        actorGlobalId: "user-lan",
        actorUsername: "lan_nguyen",
        actorAvatar: "https://i.pravatar.cc/150?img=45",
        type: ActivityType.UserFollowed,
        targetGlobalId: "user-hoang",
        targetLabel: "hoang_pham",
        at: "2026-07-20T10:20:00.000Z",
        reactionCount: 0,
        myReaction: null,
        isMine: false,
    },
    {
        id: "activity-7",
        actorGlobalId: "user-lan",
        actorUsername: "lan_nguyen",
        actorAvatar: "https://i.pravatar.cc/150?img=45",
        type: ActivityType.DiscussionCommented,
        targetGlobalId: null,
        targetLabel: null,
        at: "2026-07-20T09:00:00.000Z",
        reactionCount: 1,
        myReaction: null,
        isMine: false,
    },
    {
        id: "activity-8",
        actorGlobalId: "user-minhanh",
        actorUsername: "minhanh_dev",
        actorAvatar: "https://i.pravatar.cc/150?img=12",
        type: ActivityType.CourseEnrolled,
        targetGlobalId: "course-fullstack",
        targetLabel: "Fullstack Mastery",
        at: "2026-07-10T08:00:00.000Z",
        reactionCount: 4,
        myReaction: ReactionType.Like,
        isMine: false,
    },
]

/** A single item on its own — the smallest non-empty feed, one day header, one row. */
const singleItem: Array<QueryMyFeedItemData> = [richItems[0]]

/** The viewer's own activity — the reaction picker must stay hidden for this row even though `onReact` is passed. */
const ownActivityItems: Array<QueryMyFeedItemData> = [
    {
        id: "activity-own",
        actorGlobalId: "user-viewer",
        actorUsername: "ban",
        actorAvatar: "https://i.pravatar.cc/150?img=8",
        type: ActivityType.AiLabPassed,
        targetGlobalId: "ai-lab-rag",
        targetLabel: "AI Lab: RAG from scratch",
        at: "2026-07-21T11:00:00.000Z",
        reactionCount: 6,
        myReaction: null,
        isMine: true,
    },
]

/** Wrapper that owns local state so reacting to a row actually updates its count/myReaction, as in the real feed. */
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

/**
 * Every state of the feed side by side: empty, one row, a rich multi-day mix (roll-up +
 * no-target fallback), the viewer's own activity, fully read-only, and the nested/bordered
 * surface variant.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng để hiển thị dòng hoạt động (activity feed) của trang chủ hoặc tab Hoạt động trên hồ sơ: mỗi hàng là avatar kèm icon huy hiệu, câu actor + hành động + target, và mốc thời gian tương đối, gộp theo ngày. Component chỉ nhận props (items + onResolve, không tự fetch/router), nên feature bên ngoài quyết định nguồn dữ liệu và cách điều hướng.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Rỗng"
                hint="Không có hoạt động nào — dùng khi feed chưa có dữ liệu, ví dụ người dùng mới hoặc bộ lọc không khớp gì. Không render gì cả, không để lại khoảng trống lạ."
            >
                <ActivityFeed items={[]} onResolve={resolveDemo} onReact={() => {}} />
            </Variant>
            <Variant
                label="Một hoạt động duy nhất"
                hint="Feed chỉ có 1 mục — một nhóm ngày, một hàng. Dùng để kiểm layout tối thiểu trước khi có nhiều ngày/nhiều hàng."
            >
                <ActivityFeed items={singleItem} onResolve={resolveDemo} onReact={() => {}} />
            </Variant>
            <Variant
                label="Nhiều hoạt động, nhiều ngày, gộp milestone"
                hint="Trường hợp thật nhất: nhiều loại hoạt động trải nhiều ngày (Hôm nay/Hôm qua/ngày cũ), 3 lần vượt milestone liên tiếp của cùng một actor gộp thành 1 hàng 'đã hoàn thành 3 milestone task', và một bình luận không có target vẫn có câu thay thế (không để trống)."
            >
                <ActivityFeed items={richItems} onResolve={resolveDemo} onReact={() => {}} />
            </Variant>
            <Variant
                label="Hoạt động của chính mình"
                hint="Khi activity là của chính người xem (isMine), nút chọn cảm xúc tự ẩn ở đúng hàng đó dù prop onReact vẫn được truyền cho cả feed — không ai tự react cho mình."
            >
                <ActivityFeed items={ownActivityItems} onResolve={resolveDemo} onReact={() => {}} />
            </Variant>
            <Variant
                label="Chỉ đọc toàn bộ"
                hint="Bỏ hẳn prop onReact khi người xem không có quyền react (ví dụ xem hồ sơ công khai của người khác ở chế độ chỉ đọc) — mọi hàng chỉ hiện số lượt react, không có nút chọn."
            >
                <ActivityFeed items={richItems} onResolve={resolveDemo} />
            </Variant>
            <Variant
                label="Bordered — lồng trong Card khác"
                hint="Truyền bordered khi feed nằm LỒNG trong một surface khác (ví dụ đặt trong Card của tab), vì --surface-shadow không hiện rõ trên nền surface cha ở dark mode; mỗi ngày sẽ có viền thay vì đổ bóng."
            >
                <ActivityFeed items={singleItem} onResolve={resolveDemo} onReact={() => {}} bordered />
            </Variant>
        </Gallery>
    ),
}

/**
 * Bấm nút react ở một hàng để thấy số lượt và cảm xúc của người xem cập nhật ngay tại
 * đúng hàng đó — giống hành vi thật khi feature bọc onReact bằng một mutation rồi revalidate.
 */
export const InteractiveReactions: Story = {
    parameters: {
        usage: "Dùng khi cần minh hoạ vòng react thật (bấm mở picker, chọn cảm xúc, số đếm đổi ngay) thay vì chỉ nhìn trạng thái tĩnh — feature thật bọc onReact bằng mutation rồi revalidate, story này giả lập bằng state cục bộ.",
    },
    render: () => <Controlled />,
}
