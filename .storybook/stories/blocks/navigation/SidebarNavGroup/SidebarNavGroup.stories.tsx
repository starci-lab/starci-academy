import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    BookOpenIcon,
    ChartBarIcon,
    GearSixIcon,
    HouseIcon,
    LockIcon,
} from "@phosphor-icons/react"
import { Label, Typography } from "@heroui/react"

import { SidebarNavGroup } from "@/components/blocks/navigation/SidebarNavGroup"
import { SidebarNavItem } from "@/components/blocks/navigation/SidebarNavItem"
import { SidebarCollapsedContext } from "@/components/blocks/navigation/CollapsibleSidebar/context"

const meta: Meta<typeof SidebarNavGroup> = {
    title: "Blocks/Navigation/SidebarNavGroup",
    component: SidebarNavGroup,
}
export default meta
type Story = StoryObj<typeof SidebarNavGroup>

/** Use for the first nav cluster in the sidebar: a muted uppercase label sits above the rows. */
export const Default: Story = {
    parameters: { usage: "Use for the first nav cluster in the sidebar: a muted uppercase label sits above the rows." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>First cluster</Label>
                <Typography type="body-sm" color="muted">
                    Use for the first nav cluster in the sidebar: a muted uppercase label sits above the rows.
                </Typography>
            </div>
            <div className="w-64 rounded-2xl border border-separator bg-surface p-3">
                <SidebarNavGroup label="Learning">
                    <SidebarNavItem icon={<HouseIcon className="size-5 shrink-0" />} label="Overview" isActive onPress={() => {}} />
                    <SidebarNavItem icon={<BookOpenIcon className="size-5 shrink-0" />} label="Courses" onPress={() => {}} />
                    <SidebarNavItem icon={<ChartBarIcon className="size-5 shrink-0" />} label="Progress" onPress={() => {}} />
                </SidebarNavGroup>
            </div>
        </div>
    ),
}

/** Turn on divider when a nav cluster follows another one, to separate the two groups with a horizontal rule. */
export const WithDivider: Story = {
    parameters: { usage: "Turn on divider when a nav cluster follows another one, to separate the two groups with a horizontal rule." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With divider</Label>
                <Typography type="body-sm" color="muted">
                    Turn on divider when a nav cluster follows another one — a horizontal rule separates the two groups.
                </Typography>
            </div>
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
        </div>
    ),
}

/** When the sidebar collapses into an icon-only rail, the muted uppercase label auto-hides and only the divider still separates the clusters. */
export const Collapsed: Story = {
    parameters: { usage: "When the sidebar collapses into an icon-only rail, the muted uppercase label auto-hides and only the divider still separates the clusters." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Collapsed rail</Label>
                <Typography type="body-sm" color="muted">
                    When the sidebar collapses into an icon-only rail, the muted uppercase label auto-hides and only the divider still separates the clusters.
                </Typography>
            </div>
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
        </div>
    ),
}
