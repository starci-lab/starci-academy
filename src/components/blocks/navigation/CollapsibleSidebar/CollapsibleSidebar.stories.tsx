import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    HouseIcon,
    BookOpenIcon,
    UserIcon,
    GearSixIcon,
    TrophyIcon,
    ChatCircleTextIcon,
} from "@phosphor-icons/react"
import { CollapsibleSidebar } from "./index"
import { SidebarNavGroup } from "../SidebarNavGroup"
import { SidebarNavItem } from "../SidebarNavItem"

const meta: Meta<typeof CollapsibleSidebar> = {
    title: "Blocks/Navigation/CollapsibleSidebar",
    component: CollapsibleSidebar,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof CollapsibleSidebar>

/** Sidebar điều hướng chính của khu vực học tập, dùng khi cần một nhóm mục điều hướng có thể thu gọn lại thành dải icon để nhường chỗ cho nội dung. */
export const Default: Story = {
    parameters: { usage: "Sidebar điều hướng chính của khu vực học tập, dùng khi cần một nhóm mục điều hướng có thể thu gọn lại thành dải icon để nhường chỗ cho nội dung." },
    render: () => (
        <div className="h-[32rem]">
            <CollapsibleSidebar
                title="Học tập"
                collapseLabel="Thu gọn sidebar"
                expandLabel="Mở rộng sidebar"
                storageKey="storybook-sidebar-default"
            >
                <SidebarNavGroup label="Tổng quan">
                    <SidebarNavItem
                        icon={<HouseIcon className="size-5" />}
                        label="Trang chủ"
                        isActive
                        onPress={() => {}}
                    />
                    <SidebarNavItem
                        icon={<BookOpenIcon className="size-5" />}
                        label="Khóa học của tôi"
                        onPress={() => {}}
                    />
                </SidebarNavGroup>
                <SidebarNavGroup label="Tài khoản" divider>
                    <SidebarNavItem
                        icon={<UserIcon className="size-5" />}
                        label="Hồ sơ cá nhân"
                        onPress={() => {}}
                    />
                    <SidebarNavItem
                        icon={<GearSixIcon className="size-5" />}
                        label="Cài đặt"
                        onPress={() => {}}
                    />
                </SidebarNavGroup>
            </CollapsibleSidebar>
        </div>
    ),
}

/** Ghim một khối luôn hiển thị phía trên vùng cuộn (ví dụ pill tiếp tục học), dùng khi cần một lối tắt quan trọng không bị trôi theo danh sách điều hướng dài. */
export const VoiTopSlot: Story = {
    parameters: { usage: "Ghim một khối luôn hiển thị phía trên vùng cuộn (ví dụ pill tiếp tục học), dùng khi cần một lối tắt quan trọng không bị trôi theo danh sách điều hướng dài." },
    render: () => (
        <div className="h-[32rem]">
            <CollapsibleSidebar
                title="Học tập"
                collapseLabel="Thu gọn sidebar"
                expandLabel="Mở rộng sidebar"
                storageKey="storybook-sidebar-top-slot"
                topSlot={(
                    <div className="mb-4 rounded-large bg-accent-soft px-3 py-2 text-accent-soft-foreground">
                        Tiếp tục: Module 3
                    </div>
                )}
            >
                <SidebarNavGroup label="Tổng quan">
                    <SidebarNavItem
                        icon={<HouseIcon className="size-5" />}
                        label="Trang chủ"
                        onPress={() => {}}
                    />
                    <SidebarNavItem
                        icon={<BookOpenIcon className="size-5" />}
                        label="Khóa học của tôi"
                        isActive
                        onPress={() => {}}
                    />
                </SidebarNavGroup>
            </CollapsibleSidebar>
        </div>
    ),
}

/** Tiêu đề panel dài cần rút gọn bằng dấu ba chấm, dùng để kiểm tra sidebar vẫn giữ được bề rộng cố định khi tên khu vực học tập dài hơn bình thường. */
export const TieuDeDai: Story = {
    parameters: { usage: "Tiêu đề panel dài cần rút gọn bằng dấu ba chấm, dùng để kiểm tra sidebar vẫn giữ được bề rộng cố định khi tên khu vực học tập dài hơn bình thường." },
    render: () => (
        <div className="h-[32rem]">
            <CollapsibleSidebar
                title="Lộ trình Full-stack Engineer nâng cao"
                collapseLabel="Thu gọn sidebar"
                expandLabel="Mở rộng sidebar"
                storageKey="storybook-sidebar-long-title"
            >
                <SidebarNavGroup>
                    <SidebarNavItem
                        icon={<TrophyIcon className="size-5" />}
                        label="Bảng xếp hạng"
                        onPress={() => {}}
                    />
                    <SidebarNavItem
                        icon={<ChatCircleTextIcon className="size-5" />}
                        label="Hỏi đáp"
                        onPress={() => {}}
                    />
                </SidebarNavGroup>
            </CollapsibleSidebar>
        </div>
    ),
}
