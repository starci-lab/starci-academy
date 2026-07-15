import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    BookOpenIcon,
    ChartBarIcon,
    GearSixIcon,
    HouseIcon,
    LockIcon,
} from "@phosphor-icons/react"
import { Label, Typography } from "@heroui/react"

import { SidebarNavGroup } from "./index"
import { SidebarNavItem } from "../SidebarNavItem"
import { SidebarCollapsedContext } from "../CollapsibleSidebar/context"

const meta: Meta<typeof SidebarNavGroup> = {
    title: "Core/Navigation/SidebarNavGroup",
    component: SidebarNavGroup,
}
export default meta
type Story = StoryObj<typeof SidebarNavGroup>

/** Dùng cho cụm nav đầu tiên trong sidebar: có nhãn hoa mờ phía trên các dòng. */
export const Default: Story = {
    parameters: { usage: "Dùng cho cụm nav đầu tiên trong sidebar: có nhãn hoa mờ phía trên các dòng." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Cụm đầu</Label>
                <Typography type="body-sm" color="muted">
                    Dùng cho cụm nav đầu tiên trong sidebar: có nhãn hoa mờ phía trên các dòng.
                </Typography>
            </div>
            <div className="w-64 rounded-2xl border border-separator bg-surface p-3">
                <SidebarNavGroup label="Học tập">
                    <SidebarNavItem icon={<HouseIcon className="size-5 shrink-0" />} label="Tổng quan" isActive onPress={() => {}} />
                    <SidebarNavItem icon={<BookOpenIcon className="size-5 shrink-0" />} label="Khóa học" onPress={() => {}} />
                    <SidebarNavItem icon={<ChartBarIcon className="size-5 shrink-0" />} label="Tiến độ" onPress={() => {}} />
                </SidebarNavGroup>
            </div>
        </div>
    ),
}

/** Bật divider khi cụm nav đứng sau một cụm khác, để tách rời hai nhóm bằng một đường kẻ ngang. */
export const WithDivider: Story = {
    parameters: { usage: "Bật divider khi cụm nav đứng sau một cụm khác, để tách rời hai nhóm bằng một đường kẻ ngang." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có divider</Label>
                <Typography type="body-sm" color="muted">
                    Bật divider khi cụm nav đứng sau một cụm khác — đường kẻ ngang tách rời hai nhóm.
                </Typography>
            </div>
            <div className="w-64 rounded-2xl border border-separator bg-surface p-3">
                <SidebarNavGroup label="Học tập">
                    <SidebarNavItem icon={<HouseIcon className="size-5 shrink-0" />} label="Tổng quan" isActive onPress={() => {}} />
                    <SidebarNavItem icon={<BookOpenIcon className="size-5 shrink-0" />} label="Khóa học" onPress={() => {}} />
                </SidebarNavGroup>
                <SidebarNavGroup label="Cài đặt" divider>
                    <SidebarNavItem
                        icon={<GearSixIcon className="size-5 shrink-0" />}
                        label="Tài khoản"
                        endContent={<LockIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                        onPress={() => {}}
                    />
                </SidebarNavGroup>
            </div>
        </div>
    ),
}

/** Khi sidebar thu gọn thành rail icon-only, nhãn hoa mờ tự ẩn và chỉ divider còn tách các cụm. */
export const Collapsed: Story = {
    parameters: { usage: "Khi sidebar thu gọn thành rail icon-only, nhãn hoa mờ tự ẩn và chỉ divider còn tách các cụm." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Thu gọn rail</Label>
                <Typography type="body-sm" color="muted">
                    Khi sidebar thu gọn thành rail icon-only, nhãn hoa mờ tự ẩn và chỉ divider còn tách các cụm.
                </Typography>
            </div>
            <SidebarCollapsedContext.Provider value={true}>
                <div className="w-16 rounded-2xl border border-separator bg-surface p-2">
                    <SidebarNavGroup label="Học tập">
                        <SidebarNavItem icon={<HouseIcon className="size-5 shrink-0" />} label="Tổng quan" isActive onPress={() => {}} />
                        <SidebarNavItem icon={<BookOpenIcon className="size-5 shrink-0" />} label="Khóa học" onPress={() => {}} />
                    </SidebarNavGroup>
                    <SidebarNavGroup label="Cài đặt" divider>
                        <SidebarNavItem icon={<GearSixIcon className="size-5 shrink-0" />} label="Tài khoản" onPress={() => {}} />
                    </SidebarNavGroup>
                </div>
            </SidebarCollapsedContext.Provider>
        </div>
    ),
}
