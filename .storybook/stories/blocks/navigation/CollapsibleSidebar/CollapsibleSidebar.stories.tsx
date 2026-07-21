import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    HouseIcon,
    BookOpenIcon,
    UserIcon,
    GearSixIcon,
    TrophyIcon,
    ChatCircleTextIcon,
} from "@phosphor-icons/react"
import { CollapsibleSidebar } from "@/components/blocks/navigation/CollapsibleSidebar"
import { SidebarNavGroup } from "@/components/blocks/navigation/SidebarNavGroup"
import { SidebarNavItem } from "@/components/blocks/navigation/SidebarNavItem"
import { Gallery, Variant } from "../../../../story-kit"
import { ContinueTopSlot } from "./components"

const meta: Meta<typeof CollapsibleSidebar> = {
    title: "Layout/CollapsibleSidebar",
    component: CollapsibleSidebar,
}
export default meta
type Story = StoryObj<typeof CollapsibleSidebar>

/**
 * Toàn bộ ma trận trạng thái của CollapsibleSidebar: mặc định (collapse thành
 * icon rail), có block ghim phía trên khu vực cuộn, và tiêu đề dài bị cắt bằng
 * ellipsis. Dùng để tra khi nào ghim topSlot và xác nhận sidebar giữ đúng chiều
 * rộng cố định khi tên khu vực học dài hơn bình thường.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định"
                hint="Sidebar điều hướng chính của khu vực học tập — dùng khi cần một nhóm mục điều hướng có thể collapse thành icon rail để nhường chỗ cho nội dung."
            >
                <div className="h-[32rem]">
                    <CollapsibleSidebar
                        title="Learning"
                        collapseLabel="Collapse sidebar"
                        expandLabel="Expand sidebar"
                        storageKey="storybook-sidebar-default"
                    >
                        <SidebarNavGroup label="Overview">
                            <SidebarNavItem
                                icon={<HouseIcon className="size-5" />}
                                label="Home"
                                isActive
                                onPress={() => {}}
                            />
                            <SidebarNavItem
                                icon={<BookOpenIcon className="size-5" />}
                                label="My courses"
                                onPress={() => {}}
                            />
                        </SidebarNavGroup>
                        <SidebarNavGroup label="Account" divider>
                            <SidebarNavItem
                                icon={<UserIcon className="size-5" />}
                                label="Profile"
                                onPress={() => {}}
                            />
                            <SidebarNavItem
                                icon={<GearSixIcon className="size-5" />}
                                label="Settings"
                                onPress={() => {}}
                            />
                        </SidebarNavGroup>
                    </CollapsibleSidebar>
                </div>
            </Variant>
            <Variant
                label="Có block ghim phía trên"
                hint="Ghim một block luôn hiện phía trên khu vực cuộn (ví dụ pill tiếp tục học) — dùng khi có một shortcut quan trọng không được trôi mất theo danh sách điều hướng dài."
            >
                <div className="h-[32rem]">
                    <CollapsibleSidebar
                        title="Learning"
                        collapseLabel="Collapse sidebar"
                        expandLabel="Expand sidebar"
                        storageKey="storybook-sidebar-top-slot"
                        topSlot={<ContinueTopSlot />}
                    >
                        <SidebarNavGroup label="Overview">
                            <SidebarNavItem
                                icon={<HouseIcon className="size-5" />}
                                label="Home"
                                onPress={() => {}}
                            />
                            <SidebarNavItem
                                icon={<BookOpenIcon className="size-5" />}
                                label="My courses"
                                isActive
                                onPress={() => {}}
                            />
                        </SidebarNavGroup>
                    </CollapsibleSidebar>
                </div>
            </Variant>
            <Variant
                label="Tiêu đề dài"
                hint="Tiêu đề panel dài bị cắt bằng ellipsis — dùng để xác nhận sidebar giữ đúng chiều rộng cố định khi tên khu vực học dài hơn bình thường."
            >
                <div className="h-[32rem]">
                    <CollapsibleSidebar
                        title="Advanced Full-stack Engineer track"
                        collapseLabel="Collapse sidebar"
                        expandLabel="Expand sidebar"
                        storageKey="storybook-sidebar-long-title"
                    >
                        <SidebarNavGroup>
                            <SidebarNavItem
                                icon={<TrophyIcon className="size-5" />}
                                label="Leaderboard"
                                onPress={() => {}}
                            />
                            <SidebarNavItem
                                icon={<ChatCircleTextIcon className="size-5" />}
                                label="Q&A"
                                onPress={() => {}}
                            />
                        </SidebarNavGroup>
                    </CollapsibleSidebar>
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của CollapsibleSidebar: mặc định (collapse thành icon rail), " +
            "có block ghim phía trên khu vực cuộn, và tiêu đề dài bị cắt bằng ellipsis. Dùng để tra khi nào " +
            "ghim topSlot và xác nhận sidebar giữ đúng chiều rộng cố định khi tên khu vực học dài hơn bình thường.",
    },
}
