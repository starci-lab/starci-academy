import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    HouseIcon,
    BookOpenIcon,
    UserIcon,
    GearSixIcon,
    TrophyIcon,
    ChatCircleTextIcon,
    PlayIcon,
} from "@phosphor-icons/react"
import { Label, Typography, cn } from "@heroui/react"
import { CollapsibleSidebar } from "./index"
import { useSidebarCollapsed } from "./context"
import { SidebarNavGroup } from "../SidebarNavGroup"
import { SidebarNavItem } from "../SidebarNavItem"

const meta: Meta<typeof CollapsibleSidebar> = {
    title: "Core/Navigation/CollapsibleSidebar",
    component: CollapsibleSidebar,
}
export default meta
type Story = StoryObj<typeof CollapsibleSidebar>

/** Sidebar điều hướng chính của khu vực học tập, dùng khi cần một nhóm mục điều hướng có thể thu gọn lại thành dải icon để nhường chỗ cho nội dung. */
export const Default: Story = {
    parameters: { usage: "Sidebar điều hướng chính của khu vực học tập, dùng khi cần một nhóm mục điều hướng có thể thu gọn lại thành dải icon để nhường chỗ cho nội dung." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Sidebar thu gọn được</Label>
                <Typography type="body-sm" color="muted">
                    Sidebar điều hướng chính khu học tập — thu gọn thành dải icon để nhường chỗ cho nội dung.
                </Typography>
            </div>
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
        </div>
    ),
}

/**
 * Khối ghim topSlot phải TỰ THÍCH NGHI với collapse (đọc `useSidebarCollapsed`): mở rộng = pill icon +
 * chữ TRUNCATE (không wrap vỡ), thu gọn = ô icon-only, luôn bo góc. Dùng accent SOLID (không accent-soft)
 * cho pill "Tiếp tục" để nó đọc là 1 lối-tắt-CTA DUY NHẤT, khác hẳn item đang chọn (accent-soft) — thu gọn
 * hết cảnh 2 khối đỏ giống nhau chồng lên nhau.
 */
const ContinueTopSlot = () => {
    const collapsed = useSidebarCollapsed()
    return (
        <div
            className={cn(
                "mb-4 flex items-center rounded-xl bg-accent text-accent-foreground",
                collapsed ? "mx-auto size-10 justify-center" : "gap-2 px-3 py-2",
            )}
        >
            <PlayIcon className="size-5 shrink-0" aria-hidden focusable="false" />
            {!collapsed ? (
                <span className="min-w-0 flex-1 truncate text-sm font-medium">Tiếp tục: Module 3</span>
            ) : null}
        </div>
    )
}

/** Ghim một khối luôn hiển thị phía trên vùng cuộn (ví dụ pill tiếp tục học), dùng khi cần một lối tắt quan trọng không bị trôi theo danh sách điều hướng dài. */
export const VoiTopSlot: Story = {
    parameters: { usage: "Ghim một khối luôn hiển thị phía trên vùng cuộn (ví dụ pill tiếp tục học), dùng khi cần một lối tắt quan trọng không bị trôi theo danh sách điều hướng dài." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có khối ghim trên</Label>
                <Typography type="body-sm" color="muted">
                    Ghim một khối luôn hiện trên vùng cuộn (vd pill tiếp tục học) — lối tắt quan trọng không trôi theo danh sách dài.
                </Typography>
            </div>
            <div className="h-[32rem]">
                <CollapsibleSidebar
                    title="Học tập"
                    collapseLabel="Thu gọn sidebar"
                    expandLabel="Mở rộng sidebar"
                    storageKey="storybook-sidebar-top-slot"
                    topSlot={<ContinueTopSlot />}
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
        </div>
    ),
}

/** Tiêu đề panel dài cần rút gọn bằng dấu ba chấm, dùng để kiểm tra sidebar vẫn giữ được bề rộng cố định khi tên khu vực học tập dài hơn bình thường. */
export const TieuDeDai: Story = {
    parameters: { usage: "Tiêu đề panel dài cần rút gọn bằng dấu ba chấm, dùng để kiểm tra sidebar vẫn giữ được bề rộng cố định khi tên khu vực học tập dài hơn bình thường." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Tiêu đề dài</Label>
                <Typography type="body-sm" color="muted">
                    Tiêu đề panel dài rút gọn bằng ba chấm — kiểm tra sidebar giữ bề rộng cố định khi tên khu vực dài.
                </Typography>
            </div>
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
        </div>
    ),
}
