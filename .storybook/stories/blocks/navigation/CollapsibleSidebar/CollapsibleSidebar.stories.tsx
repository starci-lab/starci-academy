import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    HouseIcon,
    BookOpenIcon,
    UserIcon,
    GearSixIcon,
    TrophyIcon,
    ChatCircleTextIcon,
} from "@phosphor-icons/react"
import { Label, Typography } from "@heroui/react"
import { CollapsibleSidebar } from "@/components/blocks/navigation/CollapsibleSidebar"
import { SidebarNavGroup } from "@/components/blocks/navigation/SidebarNavGroup"
import { SidebarNavItem } from "@/components/blocks/navigation/SidebarNavItem"
import { ContinueTopSlot } from "./components"

const meta: Meta<typeof CollapsibleSidebar> = {
    title: "Layout/CollapsibleSidebar",
    component: CollapsibleSidebar,
}
export default meta
type Story = StoryObj<typeof CollapsibleSidebar>

/** The main navigation sidebar for the learning area, used when you need a group of nav items that can collapse into an icon rail to free up space for content. */
export const Default: Story = {
    parameters: { usage: "The main navigation sidebar for the learning area, used when you need a group of nav items that can collapse into an icon rail to free up space for content." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Collapsible sidebar</Label>
                <Typography type="body-sm" color="muted">
                    The main navigation sidebar for the learning area — collapses into an icon rail to free up space for content.
                </Typography>
            </div>
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
        </div>
    ),
}

/** Pins a block that stays visible above the scroll area (for example a continue-learning pill), used when an important shortcut must not drift away with a long navigation list. */
export const WithTopSlot: Story = {
    parameters: { usage: "Pins a block that stays visible above the scroll area (for example a continue-learning pill), used when an important shortcut must not drift away with a long navigation list." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With pinned top block</Label>
                <Typography type="body-sm" color="muted">
                    Pins a block that stays above the scroll area (e.g. a continue-learning pill) — an important shortcut that never drifts with a long list.
                </Typography>
            </div>
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
        </div>
    ),
}

/** A long panel title that needs to be truncated with an ellipsis, used to verify the sidebar keeps its fixed width when the learning-area name is longer than usual. */
export const LongTitle: Story = {
    parameters: { usage: "A long panel title that needs to be truncated with an ellipsis, used to verify the sidebar keeps its fixed width when the learning-area name is longer than usual." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Long title</Label>
                <Typography type="body-sm" color="muted">
                    A long panel title truncated with an ellipsis — verifies the sidebar keeps its fixed width when the area name is long.
                </Typography>
            </div>
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
        </div>
    ),
}
