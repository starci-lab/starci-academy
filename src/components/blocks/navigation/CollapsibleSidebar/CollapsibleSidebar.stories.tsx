import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    BookOpenIcon,
    ChartBarIcon,
    CubeIcon,
    GearSixIcon,
    HouseIcon,
    LockIcon,
} from "@phosphor-icons/react"

import { CollapsibleSidebar } from "./index"
import { SidebarNavGroup } from "../SidebarNavGroup"
import { SidebarNavItem } from "../SidebarNavItem"
import { SidebarNavAccordionGroup } from "../SidebarNavAccordionGroup"

const meta: Meta<typeof CollapsibleSidebar> = {
    title: "Blocks/CollapsibleSidebar",
    component: CollapsibleSidebar,
}

export default meta

type Story = StoryObj<typeof CollapsibleSidebar>

/**
 * Sidebar LẮP RÁP: `CollapsibleSidebar` (khung + toggle + context) chứa `SidebarNavGroup`
 * → `SidebarNavItem` + `SidebarNavAccordionGroup`. Bấm nút toggle ở header để thu gọn IN
 * PLACE (rail icon-only) — nội dung bên phải reflow, không overlay. Chỉ 1 item `isActive`.
 */
export const Default: Story = {
    parameters: { usage: "Sidebar lắp ráp: CollapsibleSidebar + NavGroup + NavItem + AccordionGroup. Toggle để thu gọn in-place (rail icon), nội dung reflow bên cạnh." },
    render: () => (
        <div className="flex h-[560px] overflow-hidden rounded-2xl border border-separator bg-surface">
            <CollapsibleSidebar
                title="Học tập"
                collapseLabel="Thu gọn thanh bên"
                expandLabel="Mở rộng thanh bên"
                storageKey="sb-story-demo"
            >
                <SidebarNavGroup>
                    <SidebarNavItem icon={<HouseIcon className="size-5 shrink-0" />} label="Tổng quan" isActive onPress={() => {}} />
                    <SidebarNavItem icon={<BookOpenIcon className="size-5 shrink-0" />} label="Khóa học" onPress={() => {}} />
                    <SidebarNavItem icon={<ChartBarIcon className="size-5 shrink-0" />} label="Tiến độ" onPress={() => {}} />
                </SidebarNavGroup>
                <SidebarNavGroup label="Luyện tập" divider>
                    <SidebarNavAccordionGroup
                        icon={CubeIcon}
                        label="Playground"
                        items={[
                            { value: "docker", label: "Docker", onPress: () => {} },
                            { value: "k8s", label: "Kubernetes", onPress: () => {} },
                            { value: "rag", label: "RAG", onPress: () => {} },
                        ]}
                    />
                    <SidebarNavItem
                        icon={<GearSixIcon className="size-5 shrink-0" />}
                        label="Cài đặt"
                        endContent={<LockIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                        onPress={() => {}}
                    />
                </SidebarNavGroup>
            </CollapsibleSidebar>
            <div className="flex-1 p-6">
                <p className="text-sm text-muted">Vùng nội dung — reflow bên cạnh sidebar khi thu gọn / mở rộng (không overlay).</p>
            </div>
        </div>
    ),
}
