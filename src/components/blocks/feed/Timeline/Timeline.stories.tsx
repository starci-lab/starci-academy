import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { TrophyIcon } from "@phosphor-icons/react"

import { Timeline } from "./index"
import { FeedItem } from "../FeedItem"
import { ActivityAvatar } from "../ActivityAvatar"

const meta: Meta<typeof Timeline> = {
    title: "Blocks/Feed/Timeline",
    component: Timeline,
}
export default meta
type Story = StoryObj<typeof Timeline>

/**
 * Vai của block, giống nhau ở mọi story. Timeline chỉ vẽ đường nối dọc + khoảng cách;
 * nội dung hàng là việc của caller (JSDoc của block ghi rõ children nên là FeedItem).
 */
const usage = "Bọc một chuỗi hàng hoạt động để nối chúng bằng đường kẻ dọc bên trái, cho thấy chúng thuộc cùng một mạch thời gian. Chọn Timeline thay vì xếp FeedItem trần khi thứ tự trước sau giữa các hàng là thông tin đáng thấy; feed rời rạc không có mạch chung thì bỏ Timeline đi. Timeline không tự dựng hàng, nó chỉ vẽ đường nối và thụt lề."

/** Dùng khi cần hiển thị chuỗi hoạt động hoặc lần thử theo thứ tự thời gian, nối bằng một đường kẻ dọc bên trái. */
export const Default: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex w-[360px] flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định</Label>
                <Typography type="body-sm" color="muted">
                    Bọc thẳng các FeedItem đúng như JSDoc của block mô tả: Timeline lo đường nối, FeedItem lo nội dung hàng.
                </Typography>
            </div>
            <Timeline>
                <FeedItem
                    leading={(
                        <ActivityAvatar
                            username="minhanh_dev"
                            avatar="https://i.pravatar.cc/150?img=12"
                            icon={<TrophyIcon aria-hidden focusable="false" weight="bold" />}
                        />
                    )}
                    timestamp="2 giờ trước"
                >
                    Nộp bài tập Module 3
                </FeedItem>
                <FeedItem
                    leading={(
                        <ActivityAvatar
                            username="minhanh_dev"
                            avatar="https://i.pravatar.cc/150?img=12"
                            icon={<TrophyIcon aria-hidden focusable="false" weight="bold" />}
                        />
                    )}
                    timestamp="Hôm qua, 14:20"
                >
                    Hoàn thành bài kiểm tra
                </FeedItem>
                <FeedItem
                    leading={(
                        <ActivityAvatar
                            username="minhanh_dev"
                            avatar="https://i.pravatar.cc/150?img=12"
                            icon={<TrophyIcon aria-hidden focusable="false" weight="bold" />}
                        />
                    )}
                    timestamp="3 ngày trước"
                >
                    Bắt đầu khoá học
                </FeedItem>
            </Timeline>
        </div>
    ),
}
