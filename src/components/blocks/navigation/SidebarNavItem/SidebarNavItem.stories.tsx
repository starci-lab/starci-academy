import type { Meta, StoryObj } from "@storybook/nextjs"
import { HouseIcon, LockIcon, GearSixIcon } from "@phosphor-icons/react"
import { Chip } from "@heroui/react"
import { SidebarNavItem } from "./index"

const meta: Meta<typeof SidebarNavItem> = {
    title: "Blocks/Navigation/SidebarNavItem",
    component: SidebarNavItem,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof SidebarNavItem>

/** Dùng cho một mục điều hướng thông thường trong sidebar, chưa phải trang hiện tại. */
export const Default: Story = {
    parameters: { usage: "Dùng cho một mục điều hướng thông thường trong sidebar, chưa phải trang hiện tại." },
    render: () => (
        <div className="w-64">
            <SidebarNavItem
                icon={<HouseIcon size={18} />}
                label="Trang chủ"
                onPress={() => {}}
            />
        </div>
    ),
}

/** Dùng để đánh dấu mục tương ứng với trang mà người dùng đang xem, giúp định hướng vị trí hiện tại. */
export const Active: Story = {
    parameters: { usage: "Dùng để đánh dấu mục tương ứng với trang mà người dùng đang xem, giúp định hướng vị trí hiện tại." },
    render: () => (
        <div className="w-64">
            <SidebarNavItem
                icon={<GearSixIcon size={18} />}
                label="Cài đặt tài khoản"
                isActive
                onPress={() => {}}
            />
        </div>
    ),
}

/** Dùng khi mục điều hướng cần hiển thị thêm trạng thái phụ ở lề phải, ví dụ khoá tính năng trả phí. */
export const WithEndContent: Story = {
    parameters: { usage: "Dùng khi mục điều hướng cần hiển thị thêm trạng thái phụ ở lề phải, ví dụ khoá tính năng trả phí." },
    render: () => (
        <div className="w-64">
            <SidebarNavItem
                icon={<LockIcon size={18} />}
                label="Nội dung nâng cao"
                endContent={<Chip size="sm" variant="soft">Pro</Chip>}
                onPress={() => {}}
            />
        </div>
    ),
}

/** Dùng để kiểm tra nhãn dài bị cắt gọn bằng dấu ba chấm thay vì làm vỡ chiều rộng sidebar. */
export const LongLabelTruncation: Story = {
    parameters: { usage: "Dùng để kiểm tra nhãn dài bị cắt gọn bằng dấu ba chấm thay vì làm vỡ chiều rộng sidebar." },
    render: () => (
        <div className="w-64">
            <SidebarNavItem
                icon={<HouseIcon size={18} />}
                label="Báo cáo tiến độ học tập chi tiết theo từng khoá học và mốc thời gian"
                onPress={() => {}}
            />
        </div>
    ),
}
