import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import {
    BookOpenIcon,
    ChatCircleIcon,
    CheckCircleIcon,
    FlameIcon,
    VideoCameraIcon,
} from "@phosphor-icons/react"
import { NotificationList } from "./index"
import type { NotificationGroup } from "./index"

const meta: Meta<typeof NotificationList> = {
    title: "Block/Notifications/NotificationList",
    component: NotificationList,
}
export default meta
type Story = StoryObj<typeof NotificationList>

/** Các nhóm theo ngày ("Hôm nay" / "Trước đó") với dữ liệu học tập thật, thời gian định dạng sẵn. */
const SAMPLE_GROUPS: NotificationGroup[] = [
    {
        label: "Hôm nay",
        items: [
            {
                icon: <CheckCircleIcon />,
                tone: "success",
                title: "Bài nộp của bạn đã được chấm điểm",
                body: "Thử thách API Gateway — đạt 92/100.",
                timeLabel: "2 giờ trước",
                isUnread: true,
                onPress: () => {},
            },
            {
                icon: <ChatCircleIcon />,
                tone: "accent",
                title: "Minh Quân đã trả lời bình luận của bạn",
                body: "Đúng rồi, chỗ đó nên tách ra thành một service riêng.",
                timeLabel: "45 phút trước",
                isUnread: true,
                onPress: () => {},
            },
            {
                icon: <VideoCameraIcon />,
                tone: "warning",
                title: "Buổi phỏng vấn thử sắp bắt đầu",
                body: "Phỏng vấn System Design lúc 20:00 — còn khoảng một giờ nữa.",
                timeLabel: "1 giờ trước",
                onPress: () => {},
            },
        ],
    },
    {
        label: "Trước đó",
        items: [
            {
                icon: <BookOpenIcon />,
                tone: "accent",
                title: "Khoá học mới vừa mở: Kubernetes thực chiến",
                body: "Đăng ký sớm trong tuần này để nhận ưu đãi.",
                timeLabel: "Hôm qua",
                onPress: () => {},
            },
            {
                icon: <FlameIcon />,
                tone: "warning",
                title: "Đừng để tuột chuỗi học 12 ngày của bạn",
                body: "Học thêm một bài hôm nay để giữ chuỗi streak.",
                timeLabel: "2 ngày trước",
                onPress: () => {},
            },
        ],
    },
]

/** Danh sách có header + nhóm theo ngày, cuộn trong chiều cao tối đa cố định. */
export const Grouped: Story = {
    parameters: {
        usage: "Dùng cho danh sách thông báo có header (tiêu đề + nút đánh dấu tất cả đã đọc) và nhãn nhóm theo ngày. Thân danh sách cuộn trong chiều cao tối đa nên lịch sử dài không làm phình khung.",
    },
    render: () => (
        <div className="flex w-[380px] flex-col gap-2 rounded-2xl border border-separator bg-surface p-1">
            <NotificationList
                title="Thông báo"
                onMarkAllRead={() => {}}
                groups={SAMPLE_GROUPS}
            />
        </div>
    ),
}

/** Không có thông báo nào — rơi về empty state mặc định (tái dùng feedback/EmptyState). */
export const Empty: Story = {
    parameters: {
        usage: "Khi không có thông báo nào, danh sách hiển thị empty state (tái dùng feedback/EmptyState) thay vì một khung trống — vẫn giữ header nếu được truyền vào.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Label>Rỗng</Label>
                <Typography type="body-sm" color="muted">
                    Mọi nhóm đều không có item nên danh sách rơi về empty state mặc định.
                </Typography>
            </div>
            <div className="w-[380px] rounded-2xl border border-separator bg-surface p-1">
                <NotificationList
                    title="Thông báo"
                    groups={[{ items: [] }]}
                />
            </div>
        </div>
    ),
}
