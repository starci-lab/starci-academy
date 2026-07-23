import type { Meta, StoryObj } from "@storybook/nextjs"
import { DifficultyChip } from "./DifficultyChip"

const meta: Meta<typeof DifficultyChip> = {
    title: "Design/Chip/DifficultyChip",
    component: DifficultyChip,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof DifficultyChip>

/** Beginner: a safe starting point, almost no prerequisites — emerald dot. */
export const Beginner: Story = {
    render: () => (
        <div className="p-8">
            <DifficultyChip difficulty="beginner" />
        </div>
    ),
}

/** Intermediate: needs the core concepts first — amber = consider carefully, not a warning. */
export const Intermediate: Story = {
    render: () => (
        <div className="p-8">
            <DifficultyChip difficulty="intermediate" />
        </div>
    ),
}

/** Advanced: non-trivial design decisions — orange, one step past intermediate (not `danger`). */
export const Advanced: Story = {
    render: () => (
        <div className="p-8">
            <DifficultyChip difficulty="advanced" />
        </div>
    ),
}

/** Insane: the top tier — its own rose colour (four tiers, four distinct colours). */
export const Insane: Story = {
    render: () => (
        <div className="p-8">
            <DifficultyChip difficulty="insane" />
        </div>
    ),
}

/** Đang tải: skeleton mirror dot+nhãn, không giật layout khi dữ liệu về. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <DifficultyChip difficulty="beginner" isSkeleton />
        </div>
    ),
}
