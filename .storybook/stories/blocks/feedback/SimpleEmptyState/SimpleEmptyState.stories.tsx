import type { Meta, StoryObj } from "@storybook/nextjs"
import { SimpleEmptyState } from "./SimpleEmptyState"

const meta: Meta<typeof SimpleEmptyState> = {
    title: "Primitives/Feedback/SimpleEmptyState",
    component: SimpleEmptyState,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SimpleEmptyState>

/** A small tab or panel with no data yet — one muted line instead of a full empty state. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <SimpleEmptyState>No data to display yet.</SimpleEmptyState>
        </div>
    ),
}

/** A longer message that explains the reason and wraps naturally within a narrow container. */
export const LongMessageWrapping: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-64">
                <SimpleEmptyState>
                    No submissions for this exercise yet. Complete and submit it to see your grading results here.
                </SimpleEmptyState>
            </div>
        </div>
    ),
}
