import type { Meta, StoryObj } from "@storybook/nextjs"
import { HighlightChip } from "./HighlightChip"

const meta: Meta<typeof HighlightChip> = {
    title: "Primitives/Chip/HighlightChip",
    component: HighlightChip,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof HighlightChip>

/** Neutral (default): a plain descriptive figure — no praise, no warning. */
export const Neutral: Story = {
    render: () => (
        <div className="p-8">
            <HighlightChip value={24} label="Modules" />
        </div>
    ),
}

/** Accent: a figure worth emphasising — not yet an achievement, no action needed. */
export const Accent: Story = {
    render: () => (
        <div className="p-8">
            <HighlightChip tone="accent" value="42h" label="Study hours" />
        </div>
    ),
}

/** Success: an achieved figure — not for pending or neutral numbers. */
export const Success: Story = {
    render: () => (
        <div className="p-8">
            <HighlightChip tone="success" value={276} label="Lessons completed" />
        </div>
    ),
}

/** Warning: needs attention but NOT late yet — still time to act. */
export const Warning: Story = {
    render: () => (
        <div className="p-8">
            <HighlightChip tone="warning" value={3} label="Lessons due soon" />
        </div>
    ),
}

/** Danger: overdue or broken, act now — don't borrow danger just to stand out. */
export const Danger: Story = {
    render: () => (
        <div className="p-8">
            <HighlightChip tone="danger" value={5} label="Lessons overdue" />
        </div>
    ),
}
