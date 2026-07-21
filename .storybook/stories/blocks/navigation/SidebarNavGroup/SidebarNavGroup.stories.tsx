import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    BookOpenIcon,
    ChartBarIcon,
    GearSixIcon,
    HouseIcon,
    LockIcon,
} from "@phosphor-icons/react"

import { SidebarNavGroup } from "@/components/blocks/navigation/SidebarNavGroup"
import { SidebarNavItem } from "@/components/blocks/navigation/SidebarNavItem"
import { SidebarCollapsedContext } from "@/components/blocks/navigation/CollapsibleSidebar/context"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof SidebarNavGroup> = {
    title: "Blocks/Navigation/SidebarNavGroup",
    component: SidebarNavGroup,
}
export default meta
type Story = StoryObj<typeof SidebarNavGroup>

/**
 * Toàn bộ trạng thái của SidebarNavGroup: cụm đầu tiên không divider, cụm thứ
 * hai theo sau có divider phân tách, và rail thu gọn chỉ còn icon (label ẩn,
 * chỉ divider còn giữ vai trò phân tách hai cụm). Dùng để tra khi nào bật
 * divider và cách nhãn/divider phản ứng lúc sidebar collapse.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Cụm đầu tiên"
                hint="Dùng cho cụm nav đầu tiên trong sidebar: một nhãn muted viết hoa nằm trên các dòng, không có divider phía trên."
            >
                <div className="w-64 rounded-2xl border border-separator bg-surface p-3">
                    <SidebarNavGroup label="Learning">
                        <SidebarNavItem icon={<HouseIcon className="size-5 shrink-0" />} label="Overview" isActive onPress={() => {}} />
                        <SidebarNavItem icon={<BookOpenIcon className="size-5 shrink-0" />} label="Courses" onPress={() => {}} />
                        <SidebarNavItem icon={<ChartBarIcon className="size-5 shrink-0" />} label="Progress" onPress={() => {}} />
                    </SidebarNavGroup>
                </div>
            </Variant>
            <Variant
                label="Có divider"
                hint="Bật divider khi một cụm nav đi theo sau một cụm khác — một đường kẻ ngang tách hai cụm ra."
            >
                <div className="w-64 rounded-2xl border border-separator bg-surface p-3">
                    <SidebarNavGroup label="Learning">
                        <SidebarNavItem icon={<HouseIcon className="size-5 shrink-0" />} label="Overview" isActive onPress={() => {}} />
                        <SidebarNavItem icon={<BookOpenIcon className="size-5 shrink-0" />} label="Courses" onPress={() => {}} />
                    </SidebarNavGroup>
                    <SidebarNavGroup label="Settings" divider>
                        <SidebarNavItem
                            icon={<GearSixIcon className="size-5 shrink-0" />}
                            label="Account"
                            endContent={<LockIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                            onPress={() => {}}
                        />
                    </SidebarNavGroup>
                </div>
            </Variant>
            <Variant
                label="Rail thu gọn"
                hint="Khi sidebar thu gọn thành rail chỉ-icon, nhãn muted viết hoa tự ẩn và chỉ còn divider phân tách các cụm."
            >
                <SidebarCollapsedContext.Provider value={true}>
                    <div className="w-16 rounded-2xl border border-separator bg-surface p-2">
                        <SidebarNavGroup label="Learning">
                            <SidebarNavItem icon={<HouseIcon className="size-5 shrink-0" />} label="Overview" isActive onPress={() => {}} />
                            <SidebarNavItem icon={<BookOpenIcon className="size-5 shrink-0" />} label="Courses" onPress={() => {}} />
                        </SidebarNavGroup>
                        <SidebarNavGroup label="Settings" divider>
                            <SidebarNavItem icon={<GearSixIcon className="size-5 shrink-0" />} label="Account" onPress={() => {}} />
                        </SidebarNavGroup>
                    </div>
                </SidebarCollapsedContext.Provider>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ trạng thái của SidebarNavGroup: cụm đầu tiên không divider, cụm thứ hai theo sau có " +
            "divider phân tách, và rail thu gọn chỉ còn icon. Dùng khi cần tra lúc nào bật divider và cách " +
            "nhãn/divider phản ứng khi sidebar collapse.",
    },
}
