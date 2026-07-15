import type { Meta, StoryObj } from "@storybook/nextjs"
import { UserPlusIcon } from "@phosphor-icons/react"
import { FeedItem } from "./index"
import { ActivityAvatar } from "../ActivityAvatar"
import { ReactionBar } from "../ReactionBar"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"

const meta: Meta<typeof FeedItem> = {
    title: "Blocks/Feed/FeedItem",
    component: FeedItem,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof FeedItem>

/** Dùng cho một mục hoạt động cơ bản trong feed: avatar kèm badge loại hoạt động, câu mô tả hành động và thời gian tương đối. */
export const Default: Story = {
    parameters: { usage: "Dùng cho một mục hoạt động cơ bản trong feed: avatar kèm badge loại hoạt động, câu mô tả hành động và thời gian tương đối." },
    render: () => (
        <FeedItem
            leading={(
                <ActivityAvatar
                    username="minhanh_dev"
                    avatar="https://i.pravatar.cc/150?img=12"
                    icon={<UserPlusIcon weight="fill" />}
                />
            )}
            timestamp="2 giờ trước"
        >
            <span><strong>minhanh_dev</strong> đã theo dõi <strong>quochuy_backend</strong></span>
        </FeedItem>
    ),
}

/** Khi hoạt động có thể được cộng đồng tương tác (ví dụ hoàn thành thử thách), thêm thanh cảm xúc ở dưới cùng để người xem thả reaction. */
export const CoThanhReaction: Story = {
    parameters: { usage: "Khi hoạt động có thể được cộng đồng tương tác (ví dụ hoàn thành thử thách), thêm thanh cảm xúc ở dưới cùng để người xem thả reaction." },
    render: () => (
        <FeedItem
            leading={(
                <ActivityAvatar
                    username="quochuy_backend"
                    avatar="https://i.pravatar.cc/150?img=33"
                    icon={<UserPlusIcon weight="fill" />}
                />
            )}
            timestamp="15 phút trước"
            footer={(
                <ReactionBar
                    count={8}
                    myReaction={ReactionType.Like}
                    onReact={() => {}}
                />
            )}
        >
            <span><strong>quochuy_backend</strong> đã vượt qua thử thách <strong>Xử lý luồng bất đồng bộ</strong></span>
        </FeedItem>
    ),
}

/** Khi hoạt động không gắn với người dùng cụ thể hoặc không cần avatar (ví dụ log hệ thống), bỏ qua slot leading để hàng chỉ còn văn bản. */
export const KhongCoLeading: Story = {
    parameters: { usage: "Khi hoạt động không gắn với người dùng cụ thể hoặc không cần avatar (ví dụ log hệ thống), bỏ qua slot leading để hàng chỉ còn văn bản." },
    render: () => (
        <FeedItem timestamp="Hôm qua lúc 21:40">
            Hệ thống đã tự động sao lưu tiến độ khóa học của bạn
        </FeedItem>
    ),
}

/** Khi câu mô tả hành động dài (nhiều thực thể liên kết), cột văn bản co giãn và xuống dòng tự nhiên thay vì tràn khỏi hàng. */
export const VanBanHoatDongDai: Story = {
    parameters: { usage: "Khi câu mô tả hành động dài (nhiều thực thể liên kết), cột văn bản co giãn và xuống dòng tự nhiên thay vì tràn khỏi hàng." },
    render: () => (
        <div className="w-72">
            <FeedItem
                leading={(
                    <ActivityAvatar
                        username="thuha_ux"
                        avatar="https://i.pravatar.cc/150?img=45"
                        icon={<UserPlusIcon weight="fill" />}
                    />
                )}
                timestamp="3 ngày trước"
            >
                <span>
                    <strong>thuha_ux</strong> đã hoàn thành cột mốc
                    {" "}
                    <strong>Xây dựng hệ thống thiết kế có thể mở rộng cho ứng dụng doanh nghiệp</strong>
                    {" "}
                    trong khóa <strong>System Design Mastery</strong>
                </span>
            </FeedItem>
        </div>
    ),
}
