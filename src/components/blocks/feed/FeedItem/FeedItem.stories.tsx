import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { UserPlusIcon } from "@phosphor-icons/react"
import { FeedItem } from "./index"
import { ActivityAvatar } from "../ActivityAvatar"
import { ReactionBar } from "../ReactionBar"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"

const meta: Meta<typeof FeedItem> = {
    title: "Core/Feed/FeedItem",
    component: FeedItem,
}
export default meta
type Story = StoryObj<typeof FeedItem>

/**
 * Hàng kể lại một SỰ KIỆN đã xảy ra kèm mốc thời gian. Chọn FeedItem thay vì ListRow khi
 * hàng chỉ để ĐỌC — FeedItem không có onPress/href, còn ListRow bấm được và dẫn đi đâu đó.
 */
const usage = "Hàng kể lại một sự kiện đã xảy ra kèm mốc thời gian (ai làm gì, lúc nào). Chọn FeedItem thay vì ListRow khi hàng chỉ để ĐỌC: FeedItem không có onPress hay href, còn ListRow bấm được và dẫn người dùng đi đâu đó. Cần đường nối dọc giữa các hàng thì bọc chúng trong Timeline."

/** Dùng cho một mục hoạt động cơ bản trong feed: avatar kèm badge loại hoạt động, câu mô tả hành động và thời gian tương đối. */
export const Default: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định</Label>
                <Typography type="body-sm" color="muted">
                    Hoạt động gắn với một người và không ai tương tác lại được.
                </Typography>
            </div>
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
                <span><strong>minhanh_dev</strong> đã theo dõi <strong>quochuy_backend</strong></span>
            </FeedItem>
        </div>
    ),
}

/** Khi hoạt động có thể được cộng đồng tương tác (ví dụ hoàn thành thử thách), thêm thanh cảm xúc ở dưới cùng để người xem thả reaction. */
export const CoThanhReaction: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có thanh reaction</Label>
                <Typography type="body-sm" color="muted">
                    Dùng slot footer khi hoạt động đáng để cộng đồng thả cảm xúc, ví dụ vượt qua thử thách. Hoạt động riêng tư hoặc log hệ thống thì bỏ trống.
                </Typography>
            </div>
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
                <span><strong>quochuy_backend</strong> đã vượt qua thử thách <strong>Xử lý luồng bất đồng bộ</strong></span>
            </FeedItem>
        </div>
    ),
}

/** Khi hoạt động không gắn với người dùng cụ thể hoặc không cần avatar (ví dụ log hệ thống), bỏ qua slot leading để hàng chỉ còn văn bản. */
export const KhongCoLeading: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Không có leading</Label>
                <Typography type="body-sm" color="muted">
                    Bỏ trống leading khi hoạt động không do người nào gây ra, ví dụ log hệ thống. Đừng nhét avatar giữ chỗ cho cân hàng.
                </Typography>
            </div>
            <FeedItem timestamp="Hôm qua lúc 21:40">
                Hệ thống đã tự động sao lưu tiến độ khóa học của bạn
            </FeedItem>
        </div>
    ),
}

/** Khi câu mô tả hành động dài (nhiều thực thể liên kết), cột văn bản co giãn và xuống dòng tự nhiên thay vì tràn khỏi hàng. */
export const VanBanHoatDongDai: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex w-72 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Văn bản hoạt động dài</Label>
                <Typography type="body-sm" color="muted">
                    Bày trong cột hẹp để kiểm câu dài nhiều thực thể: cột chữ phải xuống dòng, không đẩy mốc thời gian tràn khỏi hàng.
                </Typography>
            </div>
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
