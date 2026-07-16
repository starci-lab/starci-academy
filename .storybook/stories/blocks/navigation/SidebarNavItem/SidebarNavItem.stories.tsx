import type { Meta, StoryObj } from "@storybook/nextjs"
import { HouseIcon, LockIcon, GearSixIcon } from "@phosphor-icons/react"
import { Chip, Label, Typography } from "@heroui/react"
import { SidebarNavItem } from "@/components/blocks/navigation/SidebarNavItem"

const meta: Meta<typeof SidebarNavItem> = {
    title: "Blocks/Navigation/SidebarNavItem",
    component: SidebarNavItem,
}
export default meta
type Story = StoryObj<typeof SidebarNavItem>

/** Use for an ordinary navigation item in the sidebar that isn't the current page. */
export const Default: Story = {
    parameters: { usage: "Use for an ordinary navigation item in the sidebar that isn't the current page." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Ordinary item</Label>
                <Typography type="body-sm" color="muted">
                    Use for an ordinary navigation item in the sidebar that isn't the current page.
                </Typography>
            </div>
            <div className="w-64">
                <SidebarNavItem
                    icon={<HouseIcon size={18} />}
                    label="Home"
                    onPress={() => {}}
                />
            </div>
        </div>
    ),
}

/** Use to mark the item matching the page the user is currently viewing, helping them locate where they are. */
export const Active: Story = {
    parameters: { usage: "Use to mark the item matching the page the user is currently viewing, helping them locate where they are." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Currently viewing</Label>
                <Typography type="body-sm" color="muted">
                    Use to mark the item matching the page the user is currently viewing, helping them locate where they are.
                </Typography>
            </div>
            <div className="w-64">
                <SidebarNavItem
                    icon={<GearSixIcon size={18} />}
                    label="Account settings"
                    isActive
                    onPress={() => {}}
                />
            </div>
        </div>
    ),
}

/** Use when a nav item needs to show an extra secondary state on the right edge, for example a locked paid feature. */
export const WithEndContent: Story = {
    parameters: { usage: "Use when a nav item needs to show an extra secondary state on the right edge, for example a locked paid feature." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With trailing state</Label>
                <Typography type="body-sm" color="muted">
                    Use when an item needs to show an extra secondary state on the right edge, for example a locked paid feature.
                </Typography>
            </div>
            <div className="w-64">
                <SidebarNavItem
                    icon={<LockIcon size={18} />}
                    label="Advanced content"
                    endContent={<Chip size="sm" variant="soft">Pro</Chip>}
                    onPress={() => {}}
                />
            </div>
        </div>
    ),
}

/** Use to verify that a long label truncates with an ellipsis instead of breaking the sidebar's width. */
export const LongLabelTruncation: Story = {
    parameters: { usage: "Use to verify that a long label truncates with an ellipsis instead of breaking the sidebar's width." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Long label truncation</Label>
                <Typography type="body-sm" color="muted">
                    Verifies that a long label truncates with an ellipsis instead of breaking the sidebar's width.
                </Typography>
            </div>
            <div className="w-64">
                <SidebarNavItem
                    icon={<HouseIcon size={18} />}
                    label="Detailed learning-progress report by course and milestone"
                    onPress={() => {}}
                />
            </div>
        </div>
    ),
}
