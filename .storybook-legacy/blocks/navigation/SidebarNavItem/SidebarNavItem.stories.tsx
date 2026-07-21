import type { Meta, StoryObj } from "@storybook/nextjs"
import { HouseIcon, LockIcon, GearSixIcon } from "@phosphor-icons/react"
import { Chip } from "@heroui/react"
import { SidebarNavItem } from "@/components/blocks/navigation/SidebarNavItem"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof SidebarNavItem> = {
    title: "Legacy/Blocks/Navigation/SidebarNavItem",
    component: SidebarNavItem,
}
export default meta
type Story = StoryObj<typeof SidebarNavItem>

/**
 * Toàn bộ ma trận trạng thái của SidebarNavItem: mục thông thường, mục đang active
 * (trang hiện tại), mục có nội dung phụ ở cuối (ví dụ Chip "Pro" đánh dấu tính năng
 * trả phí), và nhãn dài bị cắt bằng ellipsis. Dùng để tra khi nào bật isActive,
 * khi nào gắn endContent, và xác nhận nhãn dài không phá vỡ chiều rộng sidebar.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Mục thông thường"
                hint="Dùng cho một mục điều hướng thông thường trong sidebar, không phải trang hiện tại."
            >
                <div className="w-64">
                    <SidebarNavItem
                        icon={<HouseIcon size={18} />}
                        label="Home"
                        onPress={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Đang được chọn (trang hiện tại)"
                hint="Dùng để đánh dấu mục khớp với trang người dùng đang xem, giúp họ biết đang ở đâu."
            >
                <div className="w-64">
                    <SidebarNavItem
                        icon={<GearSixIcon size={18} />}
                        label="Account settings"
                        isActive
                        onPress={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Có nội dung phụ ở cuối"
                hint="Dùng khi mục nav cần hiện thêm trạng thái phụ ở lề phải, ví dụ tính năng trả phí bị khoá."
            >
                <div className="w-64">
                    <SidebarNavItem
                        icon={<LockIcon size={18} />}
                        label="Advanced content"
                        endContent={<Chip size="sm" variant="soft">Pro</Chip>}
                        onPress={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Nhãn dài bị cắt"
                hint="Dùng để xác nhận nhãn dài bị cắt bằng dấu ba chấm thay vì phá vỡ chiều rộng sidebar."
            >
                <div className="w-64">
                    <SidebarNavItem
                        icon={<HouseIcon size={18} />}
                        label="Detailed learning-progress report by course and milestone"
                        onPress={() => {}}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của SidebarNavItem: mục thông thường, mục đang active " +
            "(trang hiện tại), mục có nội dung phụ ở cuối (ví dụ Chip \"Pro\" đánh dấu tính năng trả phí), " +
            "và nhãn dài bị cắt bằng ellipsis. Dùng khi cần tra lúc nào bật isActive, lúc nào gắn " +
            "endContent, và xác nhận nhãn dài không phá vỡ chiều rộng sidebar.",
    },
}
