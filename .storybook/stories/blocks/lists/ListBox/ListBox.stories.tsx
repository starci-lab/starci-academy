import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, ListBox, Typography } from "@heroui/react"
import { ControlledListBox } from "./components"

/**
 * `ListBox` + `ListBox.Item` (HeroUI, react-aria) — a SELECTABLE list: each row is a
 * choice, up/down keys + Enter select, and `selectedKeys`/`onSelectionChange` control
 * the state. Unlike `RadioGroup` (a few short choices, always showing radio buttons),
 * ListBox suits LONG/dynamic lists (filter rail, item picker); each `ListBox.Item` needs
 * an `id` + `textValue` for keyboard and selection to work.
 */
const meta: Meta<typeof ListBox> = {
    title: "Core/List/ListBox",
    component: ListBox,
}
export default meta
type Story = StoryObj<typeof ListBox>

/** A single-select list — use for a filter rail/item picker when the list is long or dynamic and needs keyboard navigation. */
export const SingleSelect: Story = {
    parameters: {
        usage: "Use when you need a selectable list where the selected item stands out with an accent background; suits long or dynamic lists (topic filter rail, item picker) that need keyboard navigation — unlike RadioGroup, which is for a few short choices always showing radio buttons.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Select an item</Label>
                <Typography type="body-sm" color="muted">
                    A long or dynamic list that needs single selection and keyboard navigation.
                </Typography>
            </div>
            <ControlledListBox initial="string" />
        </div>
    ),
}

/** With a disabled item — use disabledKeys when a choice exists but isn't unlocked for this user; it stays visible but dimmed and unselectable. */
export const WithDisabledItem: Story = {
    parameters: {
        usage: "Use disabledKeys when an item exists but isn't unlocked for this user, so it stays visible (dimmed, unselectable) instead of hidden — the user knows it exists but can't click it.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With a disabled item</Label>
                <Typography type="body-sm" color="muted">
                    The disabled item stays visible but dimmed so the user knows it exists.
                </Typography>
            </div>
            <ControlledListBox initial="array" disabledKeys={["sliding-window"]} />
        </div>
    ),
}
