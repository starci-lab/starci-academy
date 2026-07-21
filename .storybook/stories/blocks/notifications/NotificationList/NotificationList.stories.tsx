import type { Meta, StoryObj } from "@storybook/nextjs"
import { NotificationList } from "@/components/blocks/notifications/NotificationList"
import { Gallery, Variant } from "../../../../story-kit"
import { SAMPLE_GROUPS } from "./components"

const meta: Meta<typeof NotificationList> = {
    title: "Blocks/Notifications/NotificationList",
    component: NotificationList,
}
export default meta
type Story = StoryObj<typeof NotificationList>

/**
 * Toàn bộ trạng thái của NotificationList: có thông báo (header + gom theo ngày,
 * cuộn trong chiều cao cố định) và rỗng (fallback về EmptyState nhưng vẫn giữ
 * header nếu có truyền).
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Có thông báo, gom theo ngày"
                hint="Danh sách có header (tiêu đề + nút đánh dấu đã đọc hết) và nhãn gom theo ngày. Phần thân cuộn trong chiều cao tối đa nên lịch sử dài không làm phình container."
            >
                <div className="flex w-[380px] flex-col gap-2 rounded-2xl border border-separator bg-surface p-1">
                    <NotificationList
                        title="Notifications"
                        onMarkAllRead={() => {}}
                        groups={SAMPLE_GROUPS}
                    />
                </div>
            </Variant>
            <Variant
                label="Rỗng"
                hint="Khi không có thông báo nào, danh sách hiện empty state mặc định (dùng lại feedback/EmptyState) thay vì một container trống — header vẫn giữ nếu có truyền vào."
            >
                <div className="w-[380px] rounded-2xl border border-separator bg-surface p-1">
                    <NotificationList
                        title="Notifications"
                        groups={[{ items: [] }]}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Every state of NotificationList: a header (title + mark-all-as-read button) with date-group " +
            "labels, the list body scrolling within a max height so a long history doesn't balloon the " +
            "container, and the empty fallback (reuses feedback/EmptyState) which still keeps the header " +
            "when one is passed.",
    },
}
