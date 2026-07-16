import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { DiffViewer } from "@/components/blocks/grading/DiffViewer"
import { sampleHunks } from "./components"

const meta: Meta<typeof DiffViewer> = {
    title: "Core/Rendering/CodeDiff",
    component: DiffViewer,
}
export default meta
type Story = StoryObj<typeof DiffViewer>

/** Use when you need to show a code diff for grading feedback — comparing the student's submission with a suggested fix, in a unified single-column view with +/- markers and token-colored backgrounds. */
export const Unified: Story = {
    parameters: {
        usage: "Use for grading feedback — compare the student's submission with a suggested fix in a unified single-column view. The block takes pre-parsed hunks (it doesn't run a diff algorithm itself); added lines get a success background, removed lines a danger background, context lines stay neutral. Long lines scroll horizontally in their own container.",
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label>Unified diff</Label>
                <Typography type="body-sm" color="muted">
                    A small diff with added, removed and context lines, plus a filename header bar and a line-number column.
                </Typography>
            </div>
            <DiffViewer filename="src/auth/login.ts" hunks={sampleHunks} />
        </div>
    ),
}

/** Use when you want the old file on the left and the new file on the right — removed lines show only on the left, added lines only on the right, context lines on both sides. */
export const Split: Story = {
    parameters: {
        usage: "Use the split variant when you want to compare the old file on the left with the new file on the right. Removed lines show only on the left, added lines only on the right, context lines on both sides with separate line numbers per side.",
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label>Split diff</Label>
                <Typography type="body-sm" color="muted">
                    Same hunk data but laid out in two columns: old file on the left, new file on the right.
                </Typography>
            </div>
            <DiffViewer filename="src/auth/login.ts" hunks={sampleHunks} variant="split" />
        </div>
    ),
}
