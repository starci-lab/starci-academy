import type { Meta, StoryObj } from "@storybook/nextjs"
import { UserPlusIcon } from "@phosphor-icons/react"
import { FeedItem } from "@/components/blocks/feed/FeedItem"
import { ActivityAvatar } from "@/components/blocks/feed/ActivityAvatar"
import { ReactionBar } from "@/components/blocks/feed/ReactionBar"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import { Gallery, Variant } from "../../../../story-kit"
import { usage } from "./components"

const meta: Meta<typeof FeedItem> = {
    title: "Blocks/Feed/FeedItem",
    component: FeedItem,
}
export default meta
type Story = StoryObj<typeof FeedItem>

/**
 * Toàn bộ ma trận trạng thái của FeedItem: mặc định, có thanh reaction, không có
 * leading, và text hoạt động dài cần xuống dòng. Dùng để tra khi nào gắn reaction
 * bar, khi nào bỏ leading, và cách cột text xử lý câu dài nhiều thực thể.
 */
export const AllVariants: Story = {
    parameters: { usage },
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định"
                hint="Một hoạt động gắn với một người mà không ai tương tác lại được: avatar kèm badge loại hoạt động, câu mô tả hành động, và mốc thời gian tương đối."
            >
                <FeedItem
                    leading={(
                        <ActivityAvatar
                            username="minhanh_dev"
                            avatar="https://i.pravatar.cc/150?img=12"
                            icon={<UserPlusIcon aria-hidden focusable="false" weight="bold" />}
                        />
                    )}
                    timestamp="2 giờ trước"
                >
                    <span><strong>minhanh_dev</strong> đã follow <strong>quochuy_backend</strong></span>
                </FeedItem>
            </Variant>
            <Variant
                label="Có thanh reaction"
                hint="Khi hoạt động có thể được cộng đồng tương tác lại (ví dụ vừa hoàn thành một challenge), thêm reaction bar vào slot footer để người xem bấm react. Bỏ trống slot này với hoạt động riêng tư hoặc system log."
            >
                <FeedItem
                    leading={(
                        <ActivityAvatar
                            username="quochuy_backend"
                            avatar="https://i.pravatar.cc/150?img=33"
                            icon={<UserPlusIcon aria-hidden focusable="false" weight="bold" />}
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
                    <span><strong>quochuy_backend</strong> đã hoàn thành challenge <strong>Handling asynchronous flows</strong></span>
                </FeedItem>
            </Variant>
            <Variant
                label="Không có leading"
                hint="Khi hoạt động không gắn với một người dùng cụ thể hoặc không cần avatar (ví dụ system log), bỏ trống slot leading để hàng chỉ còn text — đừng nhét avatar giả vào cho cân hàng."
            >
                <FeedItem timestamp="Hôm qua lúc 21:40">
                    Hệ thống đã tự động backup tiến độ khóa học của bạn
                </FeedItem>
            </Variant>
            <Variant
                label="Text hoạt động dài"
                hint="Đặt trong cột hẹp để kiểm câu mô tả dài nhiều thực thể liên kết: cột text phải co giãn và xuống dòng tự nhiên, không được đẩy mốc thời gian ra khỏi hàng."
            >
                <div className="w-72">
                    <FeedItem
                        leading={(
                            <ActivityAvatar
                                username="thuha_ux"
                                avatar="https://i.pravatar.cc/150?img=45"
                                icon={<UserPlusIcon aria-hidden focusable="false" weight="bold" />}
                            />
                        )}
                        timestamp="3 ngày trước"
                    >
                        <span>
                            <strong>thuha_ux</strong> đã hoàn thành milestone
                            {" "}
                            <strong>Building a scalable design system for enterprise applications</strong>
                            {" "}
                            trong khóa <strong>System Design Mastery</strong>
                        </span>
                    </FeedItem>
                </div>
            </Variant>
        </Gallery>
    ),
}
