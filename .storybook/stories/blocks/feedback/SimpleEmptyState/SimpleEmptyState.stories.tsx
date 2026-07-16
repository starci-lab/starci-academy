import type { Meta, StoryObj } from "@storybook/nextjs"
import { SimpleEmptyState } from "@/components/blocks/feedback/SimpleEmptyState"

const meta: Meta<typeof SimpleEmptyState> = {
    title: "Blocks/Feedback/SimpleEmptyState",
    component: SimpleEmptyState,
}
export default meta
type Story = StoryObj<typeof SimpleEmptyState>

/** Use when a small tab or panel has no data yet and only needs a single muted line saying "nothing here" instead of a full empty state. */
export const Default: Story = {
    parameters: { usage: "Use when a small tab or panel has no data yet and only needs a single muted line saying \"nothing here\" instead of a full empty state." },
    render: () => <SimpleEmptyState>No data to display yet.</SimpleEmptyState>,
}

/** Use when the empty message needs to explain the reason or suggest a next action, and needs to wrap naturally within a narrow container. */
export const LongMessageWrapping: Story = {
    parameters: { usage: "Use when the empty message needs to explain the reason or suggest a next action, and needs to wrap naturally within a narrow container." },
    render: () => (
        <div className="w-64">
            <SimpleEmptyState>
                No submissions for this exercise yet. Complete and submit it to see your grading results here.
            </SimpleEmptyState>
        </div>
    ),
}
